import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      set: (v) => (v && v.trim() ? v.trim().toLowerCase() : undefined),
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      set: (v) => (v && v.trim() ? v.trim() : undefined),
    },
    passwordHash: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "triage_nurse", "admin", "kiosk"],
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

