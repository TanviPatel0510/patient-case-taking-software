import mongoose from "mongoose";

const queueTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true, // e.g. "AYU-OPD-104"
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicalCase",
      required: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
      index: true, // e.g. "Kayachikitsa", "Panchakarma", "Shalya Tantra", "General Medicine"
    },
    roomNumber: {
      type: String,
      trim: true,
    },
    assignedDoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    status: {
      type: String,
      enum: [
        "waiting",
        "triage_priority",
        "in_consultation",
        "completed",
        "no_show",
      ],
      default: "waiting",
      index: true,
    },
    estimatedWaitMinutes: {
      type: Number,
      default: 15,
    },
    calledAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export const QueueTicket = mongoose.model("QueueTicket", queueTicketSchema);

