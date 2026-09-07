import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    employeeId: {
      type: String,
      trim: true,
      index: true,
    },
    licenseRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    roomNumber: {
      type: String,
      trim: true,
    },
    consultationType: {
      type: String,
      enum: ["AYUSH", "ALLOPATHY", "INTEGRATED"],
      default: "INTEGRATED",
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "busy", "off_duty"],
      default: "off_duty",
    },
  },
  { timestamps: true }
);

export const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);
