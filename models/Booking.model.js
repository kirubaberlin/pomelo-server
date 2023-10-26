const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  consultant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultant",
  },
  jobseeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobseeker",
    required: true,
  },
  sessionDate: {
    type: Date,
    required: true,
  },
  packageType: {
    type: Number,
    enum: [3, 5, 7],
    required: true,
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Refunded"],
    default: "paid",
  },
  zoomMeetingLink: {
    type: String,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
