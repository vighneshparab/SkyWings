  const mongoose = require("mongoose");

  const paymentSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
      },
      enrollment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Enrollment",
        required: [true, "Enrollment is required"],
      },
      amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"],
      },
      currency: {
        type: String,
        required: [true, "Currency is required"],
        default: "USD",
        uppercase: true,
      },
      paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
        enum: ["credit_card", "debit_card", "net_banking", "wallet"],
      },
      paymentDate: { type: Date, default: Date.now },
      transactionId: {
        type: String,
        required: [true, "Transaction ID is required"],
        unique: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      discountCode: { type: String, trim: true }, // Added for discounts
      paymentPlan: {
        type: String,
        enum: ["one-time", "installment"],
        default: "one-time",
      }, // Added for payment plans
    },
    { timestamps: true }
  );

  // Indexes for faster queries
  paymentSchema.index({ user: 1 });
  paymentSchema.index({ enrollment: 1 });
  paymentSchema.index({ transactionId: 1 });

  module.exports = mongoose.model("Payment", paymentSchema);
