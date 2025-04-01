const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
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
    issueDate: { type: Date, default: Date.now },
    certificateId: {
      type: String,
      required: [true, "Certificate ID is required"],
      unique: true,
    },
    certificateType: {
      type: String,
      enum: ["completion", "excellence"],
      required: true,
    }, // Added for certificate type
    validityPeriod: { type: String, required: true }, // Added for certificate validity
  },
  { timestamps: true }
);

// Indexes for faster queries
certificateSchema.index({ student: 1 });
certificateSchema.index({ course: 1 });
certificateSchema.index({ certificateId: 1 });

module.exports = mongoose.model("Certificate", certificateSchema);
