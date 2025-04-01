const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    instructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Instructors are required"],
      },
    ],
    schedule: { type: Date, required: [true, "Schedule is required"] },
    fees: {
      type: Number,
      required: [true, "Fees are required"],
      min: [0, "Fees cannot be negative"],
    },
    maxParticipants: {
      type: Number,
      required: [true, "Maximum participants is required"],
      min: [1, "Maximum participants must be at least 1"],
    },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    prerequisites: [{ type: String, trim: true }],
    courseLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    }, // Added for course difficulty
    courseDuration: { type: String, required: true }, // Added for course duration (e.g., 3 months)
    courseType: {
      type: String,
      enum: ["live", "self-paced", "hybrid"],
      required: true,
    }, // Added for course type
    image: { type: String, required: [true, "Course image is required"] }, // Added for course image
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for faster queries
courseSchema.index({ title: 1 });
courseSchema.index({ category: 1 });

module.exports = mongoose.model("Course", courseSchema);
