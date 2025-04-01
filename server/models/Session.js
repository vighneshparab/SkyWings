const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    sessionDate: { type: Date, required: [true, "Session date is required"] },
    sessionType: {
      type: String,
      enum: ["live", "recorded"],
      required: [true, "Session type is required"],
    },
    sessionDuration: {
      type: Number,
      required: [true, "Session duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    title: { type: String, required: [true, "Session title is required"] },
    description: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    googleMeetLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Only require link if sessionType is 'live'
          if (this.sessionType === "live") {
            return /^https?:\/\/(meet\.google\.com|www\.google\.com\/meet)\/.+/.test(
              v
            );
          }
          return true;
        },
        message: (props) => `Invalid Google Meet URL for live session`,
      },
      required: function () {
        return this.sessionType === "live";
      },
    },
    recordingLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Only validate if sessionType is 'recorded' and link exists
          if (this.sessionType === "recorded" && v) {
            return /^https?:\/\/.+/.test(v);
          }
          return true;
        },
        message: (props) => `Invalid recording URL`,
      },
    },
  },
  { timestamps: true }
);

// Index for better performance on frequent queries
sessionSchema.index({ course: 1, sessionDate: -1 });
sessionSchema.index({ sessionType: 1, sessionDate: 1 });

module.exports = mongoose.model("Session", sessionSchema);
