import mongoose from "mongoose";

const userPatientProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    relation: {
      type: String,
      enum: ["self", "child", "spouse", "parent", "sibling", "dependent", "other"],
      default: "self",
    },
    isPrimary: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

userPatientProfileSchema.index({ userId: 1, patientId: 1 }, { unique: true });

export const UserPatientProfile = mongoose.model("UserPatientProfile", userPatientProfileSchema);
