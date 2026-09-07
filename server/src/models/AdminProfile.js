import mongoose from "mongoose";

const adminProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    adminType: {
      type: String,
      enum: ["super_admin", "facility_admin", "department_admin"],
      default: "facility_admin",
    },
    employeeId: {
      type: String,
      trim: true,
      index: true,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    permissions: {
      manageUsers: { type: Boolean, default: false },
      manageFacilities: { type: Boolean, default: false },
      manageReports: { type: Boolean, default: false },
      manageSettings: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const AdminProfile = mongoose.model("AdminProfile", adminProfileSchema);
