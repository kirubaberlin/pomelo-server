const express = require("express");
const router = express.Router();
const Consultant = require("../models/Consultant.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Route for creating or registering new consultants
router.post("/consultant", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

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
  const { firstName, lastName, email, introductionVideoUrl } = req.body;

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
    if (introductionVideoUrl) {
      consultant.introductionVideoUrl = introductionVideoUrl;
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

module.exports = router;
