const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    fileUrl: { type: String, required: [true, "File URL is required"] },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    }, // Added course reference

    resourceType: {
      type: String,
      enum: ["video", "pdf", "quiz", "assignment"],
      required: true,
    }, // Added for resource type

    resourceCategory: {
      type: String,
      enum: ["safety", "hospitality", "grooming"],
      required: true,
    }, // Added for resource category

    downloadCount: { type: Number, default: 0 }, // Added for tracking popularity
  },
  { timestamps: true }
);

// Indexes for faster queries
resourceSchema.index({ title: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ course: 1 }); // Index for course-based queries

module.exports = mongoose.model("Resource", resourceSchema);
