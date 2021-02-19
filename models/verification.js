// importing dependency
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// creating Verification model
const VerificationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      default: "BTC",
      enum: ["BTC", "ETH"],
    },
    transactionAddress: {
      type: String,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
    request: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Verification = model("Verification", VerificationSchema);
module.exports = Verification;
