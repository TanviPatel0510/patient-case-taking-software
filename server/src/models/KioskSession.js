import mongoose from "mongoose";

const kioskSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      index: true, // Kiosk terminal identifier / station ID
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      index: true,
    },
    status: {
      type: String,
      enum: [
        "started",
        "voice_intake",
        "doc_scanning",
        "summarizing",
        "completed",
        "diverted_emergency",
        "abandoned",
      ],
      default: "started",
      index: true,
    },
    interactionMode: {
      type: String,
      enum: ["voice", "touch", "hybrid"],
      default: "hybrid",
    },
    languageUsed: {
      type: String,
      default: "hi",
    },

    // DPDP Act 2023 Compliance: Data Minimization & Session Termination
    // All temporary audio recordings, voice tokens, and unredacted raw audio buffers
    // are purged upon intake submission or session cancellation.
    ephemeralDataCleared: {
      type: Boolean,
      default: false,
    },
    audioFilesDeletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-delete abandoned session logs after 24 hours (TTL index)
kioskSessionSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: { status: "abandoned" },
  }
);

export const KioskSession = mongoose.model("KioskSession", kioskSessionSchema);

