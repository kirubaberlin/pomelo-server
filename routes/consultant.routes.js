const express = require("express");
const router = express.Router();
const Consultant = require("../models/Consultant.model");
const bcrypt = require("bcrypt");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking.model");
const fileUploader = require("../config/cloudinary.config");

// Route for creating or registering new consultants
router.post("/consultant", async (req, res) => {
  const { firstName, lastName, email, password, consultantBio } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newConsultant = new Consultant({
      firstName,
      lastName,
      email,
      consultantBio,
      password: hashedPassword,
    });

    await newConsultant.save();

    const token = jwt.sign(
      { _id: newConsultant._id },
      process.env.TOKEN_SECRET
    );

    const consultantWithoutPassword = {
      _id: newConsultant._id,
      firstName: newConsultant.firstName,
      lastName: newConsultant.lastName,
      email: newConsultant.email,
      introductionVideoUrl: newConsultant.introductionVideoUrl,
    };

    res.status(201).json({ consultant: consultantWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route for getting all consultants
router.get("/consultants", async (req, res) => {
  try {
    const consultants = await Consultant.find().select("-password");
    res.status(200).json({ consultants });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

///

// // GET /profile/consultant - Get consultant profile
router.get("/consultant/profile", isAuthenticated, async (req, res) => {
  const consultantId = req.payload._id;

  try {
    const consultant = await Consultant.findById(consultantId).select(
      "-password"
    );

    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found." });
    }

    const profileData = {
      consultant: {
        firstName: consultant.firstName,
        lastName: consultant.lastName,
        consultantBio: consultant.consultantBio,
        profilePicture: consultant.profilePicture,
        // Add other consultant data you want to include
      },
      bookings: [], // Initialize bookings as an empty array
    };

    const bookings = await Booking.find({ consultant: consultantId }).populate({
      path: "jobseeker",
      select: "firstName lastName", // Select the needed properties from the jobseeker
    });

    // Map the bookings and include jobseeker data
    profileData.bookings = bookings.map((booking) => ({
      jobseeker: booking.jobseeker
        ? `${booking.jobseeker.firstName} ${booking.jobseeker.lastName}`
        : "Unknown Jobseeker",
      sessionDate: booking.sessionDate
        ? new Date(booking.sessionDate).toLocaleString()
        : "Unknown Date",
      packageType: booking.packageType,
      paymentStatus: booking.paymentStatus,
      zoomMeetingLink: booking.zoomMeetingLink,
    }));

    res.status(200).json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Route for getting a consultant by ID
router.get("/consultant/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const consultant = await Consultant.findById(id).select("-password");

    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    res.status(200).json({ consultant });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for updating a consultant by ID
router.put("/consultant/:id", async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    introductionVideoUrl,
    profilePicture,
    consultantBio,
  } = req.body;

  try {
    const consultant = await Consultant.findById(id);

    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    if (firstName) {
      consultant.firstName = firstName;
    }
    if (lastName) {
      consultant.lastName = lastName;
    }
    if (email) {
      consultant.email = email;
    }
    if (profilePicture) {
      consultant.profilePicture = profilePicture;
    }
    if (consultantBio) {
      consultant.consultantBio = consultantBio;
    }
    await consultant.save();

    res.status(200).json({ consultant });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for deleting a consultant by ID
router.delete("/consultant/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const consultant = await Consultant.findById(id);

    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }
    await consultant.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/upload",
  fileUploader.single("profilePicture"),
  (req, res, next) => {
    // console.log("file is: ", req.file)

    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }

    // Get the URL of the uploaded file and send it as a response.
    // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

    res.json({ fileUrl: req.file.path });
  }
);

module.exports = router;
