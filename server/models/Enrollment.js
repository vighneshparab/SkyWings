const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    enrollmentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "waitlisted"],
      default: "pending",
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be negative"],
      max: [100, "Progress cannot exceed 100"],
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    }, // Added for payment tracking
    startDate: { type: Date }, // Added for course start date
    endDate: { type: Date }, // Added for course end date
  },
  { timestamps: true }
);

// Indexes for faster queries
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
