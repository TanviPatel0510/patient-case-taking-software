import mongoose from "mongoose";

const medicalDocumentSchema = new mongoose.Schema(
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
    documentType: {
      type: String,
      enum: ["prescription", "lab_report", "discharge_summary", "radiology", "other"],
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    documentDate: {
      type: Date, // Extracted clinical date of the record for chronological timeline
      index: true,
    },

    // Multilingual OCR Extraction Metadata
    ocr: {
      rawText: String,
      confidenceScore: Number, // 0 - 1 confidence
      detectedLanguage: String,
      isHandwritten: {
        type: Boolean,
        default: false,
      },
    },

    // Structured Entity Intelligence
    extractedData: {
      diagnoses: [String],
      medications: [
        {
          drugName: String,
          dosage: String,
          frequency: String,
          duration: String,
        },
      ],
      investigations: [
        {
          testName: String, // e.g. "HbA1c", "Serum Creatinine", "ESR"
          observedValue: String,
          unit: String,
          referenceRange: String,
          isAbnormal: {
            type: Boolean,
            default: false, // Highlighted in red on doctor's consultation screen
          },
        },
      ],
      potentialDrugInteractions: [String],
    },
  },
  { timestamps: true }
);

export const MedicalDocument = mongoose.model("MedicalDocument", medicalDocumentSchema);

