const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");

//Route for creating new bookings
router.post("/booking", async (req, res) => {
  try {
    const { consultant, jobseeker, sessionDate, packageType, paymentStatus } =
      req.body;

    //body validation
    if (
      !consultant ||
      !jobseeker ||
      !sessionDate ||
      !packageType ||
      !paymentStatus
    ) {
      return res.status(400).json({ error: "required fields" });
    }
    //checking for validatity of package
    if (![3, 5, 7].includes(packageType)) {
    }
    const booking = new Booking({
      consultant,
      jobseeker,
      sessionDate,
      packageType,
      paymentStatus,
    });

    await booking.save();
    res.status(201).json({ booking: booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Bookings
router.get("/bookings", async (req, res) => {
  try {
    const booking = await Booking.find();
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/booking/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for updating
router.patch("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Delete a booking by ID
router.delete("/booking/delete/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
