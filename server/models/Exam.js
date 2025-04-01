const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    examType: {
      type: String,
      required: [true, "Exam type is required"],
      enum: ["quiz", "midterm", "final"],
    },
    googleFormLink: {
      type: String,
      required: [true, "Google Form link is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.*/.test(v);
        },
        message: "Invalid Google Form link",
      },
    },
    googleFormResponseId: {
      type: String,
      unique: true,
      sparse: true, // Ensures that unique response IDs can be stored without forcing them on every record
    },
    score: {
      type: Number,
      min: [0, "Score cannot be negative"],
    },
    totalMarks: {
      type: Number,
      required: [true, "Total marks are required"],
      min: [0, "Total marks cannot be negative"],
    },
    passingPercentage: {
      type: Number,
      required: true,
    },
    examDate: {
      type: Date,
      default: Date.now,
    },
    submissionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pass", "fail", "pending"],
      default: "pending",
    },
    retakeCount: {
      type: Number,
      default: 0,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Indexes for faster lookup
examSchema.index({ course: 1 });
examSchema.index({ student: 1 });
examSchema.index({ googleFormResponseId: 1 }, { unique: true, sparse: true });

// Automatically update the pass/fail status when the score is entered
examSchema.pre("save", function (next) {
  if (this.score !== undefined && this.totalMarks) {
    const percentage = (this.score / this.totalMarks) * 100;
    this.status = percentage >= this.passingPercentage ? "pass" : "fail";
  }
  next();
});

module.exports = mongoose.model("Exam", examSchema);
