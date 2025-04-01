const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
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
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    courseRating: {
      type: Number,
      required: [true, "Course rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    instructorRating: {
      type: Number,
      required: [true, "Instructor rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: { type: String, trim: true },
    anonymousFeedback: { type: Boolean, default: false }, // Added for anonymous feedback
    feedbackType: {
      type: String,
      enum: ["course", "instructor", "platform"],
      required: true,
    }, // Added for feedback type
  },
  { timestamps: true }
);

// Indexes for faster queries
feedbackSchema.index({ student: 1 });
feedbackSchema.index({ course: 1 });
feedbackSchema.index({ instructor: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
