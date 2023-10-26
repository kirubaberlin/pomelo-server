// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/Booking.model");
// const stripe = require("stripe")(
//   "sk_test_51I45iRCt8DyxHOxWcpAN5WLRotRRZXOfjJqncln84mjeYRRtTpQb7wazQUXtrDO4gk5nqCxIBhgS9zUt95p0UtpT000n46e4Y3"
// ); // Replace with your Stripe secret key

// // Route for creating new bookings
// router.post("/booking", async (req, res) => {
//   try {
//     const { consultant, jobseeker, sessionDate, packageType, paymentStatus } =
//       req.body;

//     if (
//       !consultant ||
//       !jobseeker ||
//       !sessionDate ||
//       !packageType ||
//       !paymentStatus
//     ) {
//       return res.status(400).json({ error: "Required fields" });
//     }

//     const amount = calculatePaymentAmount(packageType);
//     if (amount === 0) {
//       return res.status(400).json({ error: "Invalid package type" });
//     }

//     // Create a Payment Intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount, // Calculated amount based on packageType
//       currency: "usd", // Replace with the actual currency
//       // Other options
//     });

//     // Send the client secret to the client
//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Get all Bookings
// router.get("/bookings", async (req, res) => {
//   try {
//     const bookings = await Booking.find();
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get("/booking/:id", async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Routes for updating
// router.patch("/bookings/:id", async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete a booking by ID
// router.delete("/booking/delete/:id", async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndDelete(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post("/payment", async (req, res) => {
//   const { paymentMethodId, amount, currency } = req.body;

//   try {
//     // Create a PaymentIntent to confirm the payment
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       payment_method: paymentMethodId,
//       confirm: true,
//     });

//     // If the payment is successful, return a success response
//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Error processing payment:", error);
//     return res.status(400).json({ error: error.message });
//   }
// });

// function calculatePaymentAmount(packageType) {
//   if (packageType === "3") {
//     return 2000; // $20.00 (in cents)
//   } else if (packageType === "5") {
//     return 5000; // $50.00 (in cents)
//   } else if (packageType === "7") {
//     return 7000; // $70.00 (in cents)
//   } else {
//     return 0;
//   }
// }

// module.exports = router;

const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");
const stripe = require("stripe")(
  "sk_test_51I45iRCt8DyxHOxWcpAN5WLRotRRZXOfjJqncln84mjeYRRtTpQb7wazQUXtrDO4gk5nqCxIBhgS9zUt95p0UtpT000n46e4Y3"
);
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
// Replace with your Stripe secret key

// Route for creating new bookings
// Route for creating new bookings
router.post("/booking", isAuthenticated, async (req, res) => {
  try {
    const { consultant, jobseeker, sessionDate, packageType, paymentStatus } =
      req.body;

    if (
      !consultant ||
      !jobseeker ||
      !sessionDate ||
      !packageType ||
      !paymentStatus
    ) {
      return res.status(400).json({ error: "Required fields" });
    }

    if (consultant === jobseeker) {
      return res
        .status(400)
        .json({ error: "You cannot book a session with yourself." });
    }

    const amount = calculatePaymentAmount(packageType);

    if (amount <= 0) {
      return res.status(400).json({ error: "Invalid package type" });
    }
    // Payment Intent using Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Calculated amount based on packageType
      currency: "usd", // Replace with the actual currency
      // Other options
    });

    const newBooking = new Booking({
      consultant,
      jobseeker,
      sessionDate,
      packageType,
      paymentStatus,
    });

    // Save the new booking to the database
    await newBooking.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ error: "Failed to create booking. Please try again." });
  }
});

// Get all Bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
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

router.post("/payment", async (req, res) => {
  const { paymentMethodId, amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: "https://sodapopp.cyclic.cloud/",
    });

    if (paymentIntent.status === "succeeded") {
      // Payment succeeded
      return res.status(200).json({ success: true });
    } else {
      // Payment failed
      return res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(400).json({ error: error.message });
  }
});

function calculatePaymentAmount(packageType) {
  if (packageType === 3) {
    return 2000; // $20.00 (in cents)
  } else if (packageType === 5) {
    return 5000; // $50.00 (in cents)
  } else if (packageType === 7) {
    return 10000; // $100.00 (in cents)
  } else {
    return 0; // Return 0 if an invalid package type is provided
  }
}

// Store rooms in memory (you may want to use a database in a production app)
const rooms = [];

// Create a new room and return its ID
router.post("/api/create-room", (req, res) => {
  const roomID = generateUniqueRoomID(); // Implement your logic to generate a unique room ID

  // Store the room in memory
  rooms.push({ id: roomID, created: new Date() });

  res.json({ roomID });
});

// Helper function to generate a unique room ID (you can use a library like `shortid`)
function generateUniqueRoomID() {
  // Implement your logic to generate a unique room ID here
  // For simplicity, this example uses a random string
  return Math.random().toString(36).substring(7);
}

module.exports = router;
