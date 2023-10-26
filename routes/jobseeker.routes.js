const express = require("express");
const router = express.Router();
const Jobseeker = require("../models/Jobseeker.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// Create a job seeker
router.post("/jobseeker", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Hash the provided plain text password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds??

    const jobseeker = new Jobseeker({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Store the hashed password in the database???
    });

    await jobseeker.save();
    const token = jwt.sign({ _id: jobseeker._id }, process.env.TOKEN_SECRET);
    res.status(201).json({ jobseeker, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /profile/jobseeker - Get consultant profile
// router.get("/jobseeker/profile", isAuthenticated, (req, res) => {
//   // req.payload contains the user information from the JWT
//   const jobseekerId = req.payload._id;

//   Jobseeker.findById(jobseekerId)
//     .select("-password")
//     .then((jobSeeker) => {
//       if (!jobSeeker) {
//         return res.status(404).json({ message: "jobseeker not found." });
//       }
//       res.status(200).json(jobSeeker);
//     })
//     .catch((error) => {
//       res.status(500).json({ message: "Internal server error." });
//     });
// });

router.get("/jobseeker/profile", isAuthenticated, async (req, res) => {
  // req.payload contains the user information from the JWT
  const jobseekerId = req.payload._id;

  try {
    const jobSeeker = await Jobseeker.findById(jobseekerId).select("-password");

    if (!jobSeeker) {
      return res.status(404).json({ message: "Jobseeker not found." });
    }

    // Return an object with a 'jobSeeker' property
    res.status(200).json({ jobSeeker });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get all job seekers
router.get("/jobseeker", async (req, res) => {
  try {
    const jobSeekers = await Jobseeker.find();
    res.status(200).json(jobSeekers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific job seeker by ID
router.get("/jobseeker/:id", async (req, res) => {
  try {
    const jobSeeker = await Jobseeker.findById(req.params.id);
    if (!jobSeeker) {
      return res.status(404).json({ message: "Job seeker not found" });
    }
    res.status(200).json(jobSeeker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a job seeker by ID
router.put("/jobseeker/:id", async (req, res) => {
  try {
    const jobSeeker = await Jobseeker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!jobSeeker) {
      return res.status(404).json({ message: "Job seeker not found" });
    }
    res.status(200).json(jobSeeker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a job seeker by ID
router.delete("/jobseeker/:id", async (req, res) => {
  try {
    const jobSeeker = await Jobseeker.findByIdAndDelete(req.params.id);
    if (!jobSeeker) {
      return res.status(404).json({ message: "Job seeker not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

//import bcrypt to has their password

//const express = require("express");

//endpoint for getting all jobseekers
//router.get("/", (req, res) => {});

//endpoint for creating a jobseeker
//router.post("/", (req, res) => {});
