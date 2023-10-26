const mongoose = require("mongoose");

const consultantSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  consultantBio: {
    type: String,
  },

  profilePicture: {
    type: String,
  },
  coverPicture: {
    type: String,
  },
  cv: {
    type: String,
  },
  introductionVideoUrl: {
    type: String,
  },
  availablePackages: [
    {
      type: Number,
      enum: [3, 5, 7],
    },
  ],
  availability: [
    {
      type: Date,
    },
  ],
  feedback: {
    type: String,
  },
  ratings: {
    type: Number,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

const Consultant = mongoose.model("Consultant", consultantSchema);

module.exports = Consultant;
