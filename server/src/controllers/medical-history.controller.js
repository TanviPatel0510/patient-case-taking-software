import mongoose from "mongoose";
import multer from "multer";
import { env } from "../../config/env.js";
import { MedicalDocument, MedicalHistoryBundle, Patient, UserPatientProfile } from "../models/index.js";
import { deleteCloudinaryFile, uploadMedicalDocument } from "../services/cloudinary.service.js";

const documentTypes = ["prescription", "report", "summary"];
const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/jpg", "image/png"]);

export const medicalUpload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 30, fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!documentTypes.includes(file.fieldname) || !allowedMimeTypes.has(file.mimetype)) {
      return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
    callback(null, true);
  },
}).fields(documentTypes.map((name) => ({ name, maxCount: 10 })));

async function selectedPatientId(req) {
  if (req.auth?.role !== "patient") return null;
  if (req.auth.selectedPatientId) return req.auth.selectedPatientId;

  const link = await UserPatientProfile.findOne({ userId: req.auth.sub })
    .sort({ isPrimary: -1, createdAt: 1 })
    .select("patientId")
    .lean();

  return link?.patientId || null;
}

async function ownedPatient(req) {
  const patientId = await selectedPatientId(req);
  if (!patientId || !mongoose.isValidObjectId(patientId)) return null;
  const linked = await UserPatientProfile.exists({ userId: req.auth.sub, patientId });
  return linked ? Patient.findById(patientId) : null;
}

function validateBundleInput(body) {
  const { title, description, bundleType, eventDate } = body;
  if (!title?.trim() || !eventDate || Number.isNaN(Date.parse(eventDate))) {
    return "Title and a valid event date are required.";
  }
  if (!["surgery", "hospitalization", "disease", "treatment", "injury", "other"].includes(bundleType)) {
    return "Choose a valid bundle type.";
  }
  if (description && description.length > 2000) return "Description is too long.";
  return null;
}

export async function createMedicalBundle(req, res) {
  const patient = await ownedPatient(req);
  if (!patient) return res.status(403).json({ message: "You do not have access to this patient profile." });

  const validationError = validateBundleInput(req.body);
  if (validationError) return res.status(400).json({ message: validationError });
  const files = Object.values(req.files || {}).flat();
  if (!files.length) return res.status(400).json({ message: "Add at least one medical document." });
  if (![...files].every((file) => allowedMimeTypes.has(file.mimetype))) {
    return res.status(400).json({ message: "Only PDF, JPG, JPEG, and PNG files are supported." });
  }

  let bundle;
  const uploaded = [];
  try {
    bundle = await MedicalHistoryBundle.create({
      patientId: patient._id,
      title: req.body.title.trim(),
      description: req.body.description?.trim() || undefined,
      bundleType: req.body.bundleType,
      eventDate: new Date(req.body.eventDate),
    });

    const documents = [];
    for (const file of files) {
      const result = await uploadMedicalDocument(file.buffer, {
        folder: `medikiosk/patients/${patient._id}/${bundle._id}/${file.fieldname}`,
        mimeType: file.mimetype,
        originalFileName: file.originalname,
      });
      uploaded.push({ publicId: result.public_id, resourceType: result.resource_type });
      documents.push({
        patientId: patient._id,
        bundleId: bundle._id,
        documentType: file.fieldname,
        fileUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
        originalFileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
      });
    }

    const savedDocuments = await MedicalDocument.insertMany(documents);
    patient.bundles.push(bundle._id);
    await patient.save();
    return res.status(201).json({ bundle: { ...bundle.toObject(), documents: savedDocuments } });
  } catch (error) {
    await Promise.all(uploaded.map((file) => deleteCloudinaryFile(file.publicId, file.resourceType).catch(() => null)));
    if (bundle) await MedicalHistoryBundle.findByIdAndDelete(bundle._id);
    return res.status(500).json({ message: error.message || "Unable to upload medical documents." });
  }
}

export async function listMedicalBundles(req, res) {
  const patient = await ownedPatient(req);
  if (!patient) return res.status(403).json({ message: "You do not have access to this patient profile." });
  const bundles = await MedicalHistoryBundle.find({ patientId: patient._id }).sort({ eventDate: -1, createdAt: -1 }).lean();
  const documents = await MedicalDocument.find({ patientId: patient._id, bundleId: { $in: bundles.map((bundle) => bundle._id) } }).lean();
  const grouped = documents.reduce((result, document) => {
    (result[document.bundleId.toString()] ||= []).push(document);
    return result;
  }, {});
  return res.json({ bundles: bundles.map((bundle) => ({ ...bundle, documents: grouped[bundle._id.toString()] || [] })) });
}

export async function deleteMedicalDocument(req, res) {
  const patient = await ownedPatient(req);
  if (!patient || !mongoose.isValidObjectId(req.params.documentId)) return res.status(403).json({ message: "You do not have access to this document." });
  const document = await MedicalDocument.findOne({ _id: req.params.documentId, patientId: patient._id });
  if (!document) return res.status(404).json({ message: "Medical document not found." });
  await deleteCloudinaryFile(document.cloudinaryPublicId, document.mimeType === "application/pdf" ? "raw" : "image");
  await document.deleteOne();
  return res.json({ message: "Medical document deleted." });
}

export function handleMedicalUploadError(error, _req, res, next) {
  if (error instanceof multer.MulterError) return res.status(400).json({ message: "Each file must be a PDF, JPG, JPEG, or PNG under 10 MB." });
  return next(error);
}