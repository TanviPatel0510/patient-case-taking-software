import mongoose from "mongoose";

// Patient Basic Measurements (Vitals & Anthropometry)
const basicMeasurementsSchema = new mongoose.Schema(
  {
    weightKg: { type: Number, min: 0, max: 500 },
    heightCm: { type: Number, min: 0, max: 300 },
    bmi: { type: Number }, // Calculated: weightKg / ((heightCm/100)^2)
    bloodPressure: {
      systolic: { type: Number, min: 30, max: 300 },
      diastolic: { type: Number, min: 20, max: 200 },
    },
    pulseRateBpm: { type: Number, min: 20, max: 250 },
    temperatureFahrenheit: { type: Number, min: 80, max: 115 },
    spO2Percent: { type: Number, min: 40, max: 100 },
    respiratoryRateBpm: { type: Number, min: 5, max: 80 },
    bloodSugarMgDl: {
      value: Number,
      readingType: {
        type: String,
        enum: ["RBS", "FBS", "PPBS", "CBG"],
        default: "RBS",
      },
    },
  },
  { _id: false }
);

// HPI Subschema: PatientNotes OLDCARTS + SOCRATES Hybrid (Changes based on Chief Complaint)
const hpiSchema = new mongoose.Schema(
  {
    onset: {
      timing: String, // e.g. "3 hours ago", "woke up with headache"
      isSudden: Boolean, // Sudden vs Gradual (Critical red-flag check for thunderclap headache)
    },
    locationAndRadiation: {
      primarySite: String, // e.g. "Frontal / Unilateral / Temples"
      radiationSite: String, // e.g. "Radiating down to neck"
    },
    duration: String, // e.g. "Continuous for 3 hours"
    characteristics: [String], // e.g. ["throbbing", "pulsating", "band-like tightness", "sharp"]
    severityScore: {
      type: Number,
      min: 1,
      max: 10,
    },
    timing: String, // e.g. "Worse in morning", "Constant"
    aggravatingFactors: [String], // e.g. ["bright lights (photophobia)", "loud noise (phonophobia)", "bending forward"]
    relievingFactors: [String], // e.g. ["dark quiet room", "cold compress", "sleep"]
    associatedSymptoms: [String], // e.g. ["nausea", "vomiting", "visual aura", "neck stiffness"]
    treatmentsTried: [
      {
        treatment: String, // e.g. "Paracetamol 650mg", "Balm application"
        effect: {
          type: String,
          enum: ["improved", "no_effect", "worsened"],
        },
      },
    ],
    pertinentNegatives: [String], // e.g. ["denies fever", "denies visual loss", "denies limb weakness"]
  },
  { _id: false }
);

// Review of Systems (ROS) Subschema from PatientNotes Clinical Guide
const reviewOfSystemsSchema = new mongoose.Schema(
  {
    constitutional: {
      fever: { type: Boolean, default: false },
      chills: { type: Boolean, default: false },
      fatigue: { type: Boolean, default: false },
      weightLoss: { type: Boolean, default: false },
    },
    cardiovascular: {
      chestPain: { type: Boolean, default: false },
      palpitations: { type: Boolean, default: false },
      ankleSwelling: { type: Boolean, default: false },
      orthopnea: { type: Boolean, default: false },
    },
    respiratory: {
      cough: { type: Boolean, default: false },
      shortnessOfBreath: { type: Boolean, default: false },
      wheezing: { type: Boolean, default: false },
      hemoptysis: { type: Boolean, default: false },
    },
    gastrointestinal: {
      nausea: { type: Boolean, default: false },
      vomiting: { type: Boolean, default: false },
      abdominalPain: { type: Boolean, default: false },
      constipation: { type: Boolean, default: false },
      diarrhea: { type: Boolean, default: false },
    },
    neurological: {
      headache: { type: Boolean, default: false },
      dizziness: { type: Boolean, default: false },
      weakness: { type: Boolean, default: false },
      numbness: { type: Boolean, default: false },
      syncope: { type: Boolean, default: false },
    },
    musculoskeletal: {
      jointPain: { type: Boolean, default: false },
      musclePain: { type: Boolean, default: false },
      stiffness: { type: Boolean, default: false },
    },
    notes: String,
  },
  { _id: false }
);

// AYUSH (Ayurveda) Assessment Subschema: Dashavidha & Ashtavidha Pariksha
const ayushAssessmentSchema = new mongoose.Schema(
  {
    prakriti: {
      dominantDosha: {
        type: String,
        enum: [
          "Vata",
          "Pitta",
          "Kapha",
          "Vata-Pitta",
          "Pitta-Kapha",
          "Vata-Kapha",
          "Tridoshaja",
        ],
      },
      confidenceScore: Number,
    },
    vikriti: {
      vitiatedDosha: [
        {
          type: String,
          enum: ["Vata", "Pitta", "Kapha"],
        },
      ],
    },
    agni: {
      type: String,
      enum: ["Manda", "Tikshna", "Vishama", "Sama"], // Slow/hypo, sharp/hyper, irregular, balanced
    },
    koshtha: {
      type: String,
      enum: ["Krura", "Mridu", "Madhyama"], // Hard (constipated), soft (loose), balanced
    },
    dhatuSara: String,
    samhanana: {
      type: String,
      enum: ["Susamhata", "Madhyama", "Heena"],
    },
    pramana: String,
    satmya: String,
    sattva: {
      type: String,
      enum: ["Pravara", "Madhyama", "Avara"],
    },
    aharaShakti: {
      abhyavaharana: String,
      jaranaShakti: String,
    },
    vyayamaShakti: {
      type: String,
      enum: ["Pravara", "Madhyama", "Avara"],
    },
    vaya: {
      type: String,
      enum: ["Bala", "Madhyama", "Vriddha"],
    },
    aharaVihara: {
      dietaryHabits: [String],
      nidra: String,
      lifestyleFactors: [String],
    },
    nidana: [String],
    sampraptiSummary: String,
  },
  { _id: false }
);

const clinicalCaseSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KioskSession",
      index: true,
    },
    consultationType: {
      type: String,
      enum: ["AYUSH", "ALLOPATHY", "INTEGRATED"],
      default: "INTEGRATED",
      index: true,
    },

    // Step 1: Chief Complaints (e.g. Headache)
    chiefComplaints: [
      {
        complaint: { type: String, required: true }, // e.g. "Headache"
        duration: { type: String, required: true },  // e.g. "3 hours"
        severity: String,                           // e.g. "Moderate to Severe"
      },
    ],

    // Step 1.5: Patient Basic Measurements (Vitals & Anthropometry)
    basicMeasurements: basicMeasurementsSchema,

    // Step 2: History of Present Illness (Adaptive based on Chief Complaint)
    hpi: hpiSchema,

    // Step 2.5: Review of Systems (ROS)
    reviewOfSystems: reviewOfSystemsSchema,

    // Past Medical & Surgical History
    pastMedicalHistory: [String],
    pastSurgicalHistory: [String],

    // Drug Allergies & Current Medications
    drugAllergies: [String],
    currentMedications: [
      {
        name: String,
        dose: String,
        frequency: String,
        duration: String,
      },
    ],

    // Social & Family History
    personalHistory: {
      diet: { type: String, enum: ["vegetarian", "non-vegetarian", "vegan", "eggetarian"] },
      smoking: { type: Boolean, default: false },
      alcohol: { type: Boolean, default: false },
      bowelBladderHabits: String,
    },
    familyHistory: [String],

    // AYUSH Clinical Assessment (Dashavidha Pariksha)
    ayushAssessment: ayushAssessmentSchema,

    // Step 2.8: Continuous Triage & Red-Flag Trigger
    triage: {
      isRedFlagDetected: { type: Boolean, default: false, index: true },
      priorityLevel: {
        type: String,
        enum: ["ROUTINE", "PRIORITY", "EMERGENCY"],
        default: "ROUTINE",
        index: true,
      },
      redFlagTriggers: [String], // e.g. ["Thunderclap headache (onset < 1 min)", "Neck stiffness with fever", "Systolic BP > 180"]
      alertNotifiedAt: Date,
      acknowledgedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    // Step 4: AI-Generated Framework-Accurate Clinical Summary
    aiSummary: {
      doctorSummaryEnglish: { type: String, required: true },
      patientSummaryLocal: String,
      audioSummaryUrl: String,
      generatedAt: { type: Date, default: Date.now },
    },

    // Step 5: Physician Consultation, Review & Edit
    physicianReview: {
      doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
      reviewStatus: {
        type: String,
        enum: ["pending", "approved", "modified", "rejected"],
        default: "pending",
        index: true,
      },
      doctorEditedSummary: String,
      examinationNotes: String, // Doctor's physical examination findings
      reasoningAndDiagnosis: [String], // Doctor's clinical reasoning & diagnosis
      counselingNotes: String, // Patient counseling & advice
      reviewedAt: Date,
    },
  },
  { timestamps: true }
);

// Auto-calculate BMI before saving if height and weight are provided
clinicalCaseSchema.pre("save", function (next) {
  if (this.basicMeasurements) {
    const { weightKg, heightCm } = this.basicMeasurements;
    if (weightKg && heightCm && heightCm > 0) {
      const heightInMeters = heightCm / 100;
      this.basicMeasurements.bmi = parseFloat(
        (weightKg / (heightInMeters * heightInMeters)).toFixed(1)
      );
    }
  }
  next();
});

export const ClinicalCase = mongoose.model("ClinicalCase", clinicalCaseSchema);
