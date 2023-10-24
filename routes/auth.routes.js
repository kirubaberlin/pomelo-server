const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");
const Consultant = require("../models/Consultant.model");
const Jobseeker = require("../models/Jobseeker.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const Booking = require("../models/Booking.model");

const saltRounds = 10;

// POST /auth/signup - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  // Your existing signup route code here...
});

// POST /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password, userType } = req.body;

  if (!userType || !["consultant", "jobseeker"].includes(userType)) {
    return res.status(400).json({
      message: "Invalid userType. It should be 'consultant' or 'jobseeker'.",
    });
  }

  if (!email || !password) {
    return res.status(400).json({ message: "Provide email and password." });
  }

  const userModel = userType === "consultant" ? Consultant : Jobseeker;

  userModel
    .findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (!passwordCorrect) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const { _id, email, name } = foundUser;
      const payload = { _id, email, name, userType }; // Include userType in the payload

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      res.status(200).json({ authToken });
    })
    .catch((err) => next(err));
});
// GET /profile/consultant - Get consultant profile
router.get("/consultant/profile", isAuthenticated, (req, res) => {
  // req.payload contains the user information from the JWT
  const consultantId = req.payload._id;

  // Define an object to store both consultant and bookings
  const profileData = {};

  Consultant.findById(consultantId)
    .select("-password")
    .then((consultant) => {
      if (!consultant) {
        return res.status(404).json({ message: "Consultant not found." });
      }

      // Store the consultant's data in the profileData object
      profileData.consultant = consultant;

      // Find bookings associated with the consultant
      return Booking.find({ consultant: consultantId });
    })
    .then((bookings) => {
      // Store the consultant's bookings in the profileData object
      profileData.bookings = bookings;

      // Send the profileData object as the response
      res.status(200).json(profileData);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    });
});
// GET /profile/jobseeker - Get consultant profile

// GET jobseeker's profile with booked sessions
router.get("/jobseeker/profile", isAuthenticated, (req, res) => {
  const jobseekerId = req.payload._id; // Assuming the job seeker's ID is in req.payload

  Booking.find({ jobseeker: jobseekerId })
    .populate("consultant", "firstName lastName") // Populate the consultant information
    .exec()
    .then((bookings) => {
      if (bookings.length === 0) {
        // Handle case where no bookings are found
        res
          .status(200)
          .json({ message: "No bookings found for this jobseeker." });
      } else {
        res.status(200).json({ bookings });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal server error." });
    });
});

// GET /auth/verify - Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

//const ZegoSDK = require("zego-sdk"); // Your Zego SDK

// Define your Zego app ID and secret
const ZEGO_APP_ID = "331314442";
const ZEGO_APP_SECRET = "77dd5f51a25fdc6bdd8e899bff9417ca";

// Define a route for generating Zego tokens
router.post("/generate-zego-token", (req, res) => {
  // Get the user's ID from the request (you should implement proper user authentication)
  const userID = req.body.userID;

  // Generate a Zego token using the Zego SDK and your app ID/secret
  const tokenPayload = {
    app_id: ZEGO_APP_ID,
    user_id: userID,
    // Other token payload data as required
  };

  // Sign the payload using your Zego secret
  const token = jwt.sign(tokenPayload, ZEGO_APP_SECRET);

  // Send the generated token as a response
  res.json({ token });
});

module.exports = router;
