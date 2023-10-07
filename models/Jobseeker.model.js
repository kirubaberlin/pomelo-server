const mongoose = require("mongoose");

const jobseekerSchema = new mongoose.Schema({
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
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  purchasedPackages: {
    type: Number,
    enum: [3, 5, 7],
  },
  scheduledSessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  feedback: {
    type: String,
  },
  ratings: {
    type: Number,
  },
});

// JSON exclude the password field??
jobseekerSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const Jobseeker = mongoose.model("Jobseeker", jobseekerSchema);

module.exports = Jobseeker;
