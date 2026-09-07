import mongoose from "mongoose";

const kioskProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    kioskName: {
      type: String,
      required: true,
      trim: true,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
    },
    location: {
      type: String,
      trim: true,
    },
    credentialHash: {
      type: String,
      required: true,
    },
    lastSeenAt: Date,
    softwareVersion: String,
  },
  { timestamps: true }
);

export const KioskProfile = mongoose.model("KioskProfile", kioskProfileSchema);
