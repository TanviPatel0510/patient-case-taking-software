import mongoose from "mongoose";

const medicalHistoryBundleSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicalCase",
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    bundleType: {
      type: String,
      enum: [
        "surgery",
        "hospitalization",
        "disease",
        "treatment",
        "injury",
        "other",
      ],
      default: "other",
    },

    eventDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const MedicalHistoryBundle = mongoose.model(
  "MedicalHistoryBundle",
  medicalHistoryBundleSchema
);