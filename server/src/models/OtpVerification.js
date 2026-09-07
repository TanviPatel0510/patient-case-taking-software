import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ["phone", "email"],
      required: true,
    },
    purpose: {
      type: String,
      enum: ["login", "registration", "profile_add"],
      required: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    consumedAt: Date,
  },
  { timestamps: true }
);

otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpVerificationSchema.index({ identifier: 1, purpose: 1, createdAt: -1 });

export const OtpVerification = mongoose.model("OtpVerification", otpVerificationSchema);
