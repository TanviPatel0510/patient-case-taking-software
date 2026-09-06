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
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      enum: ["doctor", "triage_nurse", "admin", "kiosk"],
      required: true,
      index: true,
    },
    department: {
      type: String,
      trim: true,
      // e.g. "Kayachikitsa", "Shalya Tantra", "Panchakarma", "General Medicine"
    },
    specialization: {
      type: String,
      trim: true,
    },
    licenseRegistrationNumber: {
      type: String,
      trim: true, // NMC or State AYUSH Board registration number
    },
    roomNumber: {
      type: String,
      trim: true, // OPD Room assigned to doctor
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

