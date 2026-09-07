import mongoose from "mongoose";

const nurseProfileSchema = new mongoose.Schema(
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
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    shift: {
      type: String,
      trim: true,
    },
    station: {
      type: String,
      trim: true,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
    },
    isOnDuty: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const NurseProfile = mongoose.model("NurseProfile", nurseProfileSchema);
