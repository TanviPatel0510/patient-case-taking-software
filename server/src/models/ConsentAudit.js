import mongoose from "mongoose";

const consentAuditSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    // DPDP Act 2023 Granular & Specific Consent Flags
    consents: {
      audioRecordingAndASR: {
        type: Boolean,
        default: true,
        required: true,
      },
      documentOcrAndStorage: {
        type: Boolean,
        default: true,
        required: true,
      },
      abhaDataFetchAndLink: {
        type: Boolean,
        default: true,
        required: true,
      },
      shareWithConsultingDoctor: {
        type: Boolean,
        default: true,
        required: true,
      },
    },

    consentMode: {
      type: String,
      enum: ["audio_prompt", "touch_screen", "otp_verified"],
      default: "touch_screen",
    },

    // Audio evidence of verbal consent for low-literacy patients
    audioConsentRecordingUrl: String,
    ipAddressOrKioskId: String,

    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED", "EXPIRED"],
      default: "ACTIVE",
      index: true,
    },
    revokedAt: Date,
  },
  { timestamps: true }
);

export const ConsentAudit = mongoose.model("ConsentAudit", consentAuditSchema);

