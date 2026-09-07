import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";
import { env } from "../../config/env.js";
import { DoctorProfile, OtpVerification, Patient, User, UserPatientProfile } from "../models/index.js";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookie.js";
import { signToken } from "../utils/jwt.js";

function publicPatient(patient) {
  const value = patient.toObject ? patient.toObject() : { ...patient };
  return {
    id: value._id,
    role: "patient",
    fullName: value.demographics?.fullName,
    age: value.demographics?.age,
    gender: value.demographics?.gender,
    preferredLanguage: value.preferences?.preferredLanguage,
    abhaStatus: value.identity?.isAbhaVerified ? "Verified" : "Not verified",
    demographics: value.demographics,
    medicalProfile: value.medicalProfile,
  };
}

function publicProfile(link) {
  const patient = link.patientId;
  return {
    id: patient._id,
    fullName: patient.demographics?.fullName,
    age: patient.demographics?.age,
    gender: patient.demographics?.gender,
    relation: link.relation,
    isPrimary: link.isPrimary,
  };
}

function publicStaff(user) {
  return {
    id: user._id,
    role: user.role,
    fullName: user.name,
    email: user.email,
    department: user.department,
    specialization: user.specialization,
  };
}

export async function registerPatient(req, res) {
  try {
    const {
      abhaNumber, abhaAddress, aadhaarLastFour, fullName, dateOfBirth, gender,
      identifier, mobileNumber, email, preferredLanguage, villageOrCity, district, state,
      pincode, emergencyContactName, emergencyContactRelationship,
      emergencyContactPhone, heightCm, weightKg, bloodGroup, chronicConditions,
      allergies, medications, consent, otp,
    } = req.body;

    if (!consent) return res.status(400).json({ message: "Consent is required to register." });
    const rawIdentifier = identifier || mobileNumber || email;
    const normalized = normalizeIdentifier(rawIdentifier);
    if (!normalized) return res.status(400).json({ message: "A valid mobile number or email is required." });
    const accountUser = req.auth?.role === "patient" ? await User.findById(req.auth.sub) : null;
    const verification = await consumeOtp(normalized, otp, accountUser ? "profile_add" : "registration");
    if (!verification.ok) return res.status(verification.status).json({ message: verification.message });
    if (!dateOfBirth) return res.status(400).json({ message: "Date of birth is required." });

    const identifierUser = accountUser || await findUser(normalized);
    if (identifierUser && !accountUser) return res.status(409).json({ message: "This mobile number or email is already registered. Please login." });

    const contact = buildAccountContact(normalized, mobileNumber, email);
    if (contact.error) return res.status(400).json({ message: contact.error });
    if (!accountUser) {
      const conflictingUser = await findConflictingUser(contact);
      if (conflictingUser) return res.status(409).json({ message: "The phone number or email is already linked to another account." });
    }

    if (abhaNumber && await Patient.exists({ "identity.abhaNumber": abhaNumber })) {
      return res.status(409).json({ message: "This ABHA number is already registered." });
    }
    if (abhaAddress && await Patient.exists({ "identity.abhaAddress": abhaAddress })) {
      return res.status(409).json({ message: "This ABHA address is already registered." });
    }
    if (aadhaarLastFour && await Patient.exists({ "identity.aadhaarLastFour": aadhaarLastFour })) {
      return res.status(409).json({ message: "This Aadhaar reference is already registered." });
    }

    const birthDate = new Date(dateOfBirth);
    const age = Math.max(0, Math.floor((Date.now() - birthDate.getTime()) / 31557600000));
    const user = accountUser || await User.create({ name: fullName, ...contact, role: "patient", isVerified: true });
    const patient = await Patient.create({
      identity: { abhaNumber, abhaAddress, aadhaarLastFour },
      demographics: {
        fullName, gender, dateOfBirth: birthDate, age,
        address: { villageOrCity, district, state, pincode },
        emergencyContact: { name: emergencyContactName, relationship: emergencyContactRelationship, phone: emergencyContactPhone },
      },
      preferences: { preferredLanguage },
      medicalProfile: { heightCm, weightKg, bloodGroup, chronicConditions: chronicConditions || [], allergies: allergies || [], medications: medications || [] },
      consent: { accepted: true, acceptedAt: new Date() },
    });

    const link = await UserPatientProfile.create({
      userId: user.id,
      patientId: patient.id,
      relation: accountUser ? (req.body.emergencyContactRelationship || "dependent") : "self",
      isPrimary: !accountUser,
    });
    const token = signToken({ sub: user.id, role: "patient" });
    setAuthCookie(res, token);
    return res.status(201).json({ user: publicUser(user), profiles: [{ ...publicProfile({ patientId: patient, relation: link.relation, isPrimary: link.isPrimary }) }], role: "patient" });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "A patient with one of these identity details already exists." });
    return res.status(400).json({ message: error.message || "Unable to register patient." });
  }
}

export async function login(req, res) {
  try {
    const { identifier, password } = req.body;
    const loginValue = normalizeIdentifier(identifier);
    if (!loginValue || !password) return res.status(400).json({ message: "Login identifier and password are required." });

    const user = await findUser(loginValue);
    if (!user || user.role === "patient" || !user.isActive || !(await bcrypt.compare(password, user.passwordHash || ""))) {
      return res.status(401).json({ message: "Invalid login details." });
    }
    user.lastLoginAt = new Date();
    await user.save();
    setAuthCookie(res, signToken({ sub: user.id, role: user.role }));

    let staffData = publicStaff(user);
    if (user.role === "doctor") {
      const doctorProfile = await DoctorProfile.findOne({ userId: user._id });
      if (doctorProfile) {
        staffData = {
          ...staffData,
          department: doctorProfile.department || staffData.department,
          specialization: doctorProfile.specialization || staffData.specialization,
          roomNumber: doctorProfile.roomNumber,
        };
      }
    }
    return res.json({ user: staffData, role: user.role });
  } catch {
    return res.status(500).json({ message: "Unable to sign in right now." });
  }
}

export async function requestPatientOtp(req, res) {
  try {
    const identifier = normalizeIdentifier(req.body.identifier);
    if (!identifier) return res.status(400).json({ message: "Enter a valid phone number or email address." });

    const user = await findUser(identifier);
    if (user && user.role !== "patient") return res.status(409).json({ message: "This identifier belongs to a staff account. Use staff login." });
    const purpose = req.body.purpose === "profile_add" && user ? "profile_add" : user ? "login" : "registration";

    const code = String(randomInt(100000, 1000000));
    await OtpVerification.create({
      identifier,
      channel: identifier.includes("@") ? "email" : "phone",
      purpose,
      codeHash: await bcrypt.hash(code, 10),
      expiresAt: new Date(Date.now() + env.otpExpiresMinutes * 60 * 1000),
    });
    console.log(`[patient-otp:${purpose}] ${identifier}: ${code}`);
    const response = { message: "OTP generated. Check the backend console during phase 1.", purpose, channel: identifier.includes("@") ? "email" : "phone", requiresRegistration: !user, identifier };
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to generate OTP." });
  }
}

export async function verifyPatientOtp(req, res) {
  try {
    const identifier = normalizeIdentifier(req.body.identifier);
    const verification = await consumeOtp(identifier, req.body.otp, "login");
    if (!verification.ok) return res.status(verification.status).json({ message: verification.message });
    const user = await findUser(identifier);
    if (!user || user.role !== "patient" || !user.isActive) return res.status(404).json({ message: "Patient account not found. Please register." });
    user.lastLoginAt = new Date();
    await user.save();
    setAuthCookie(res, signToken({ sub: user.id, role: "patient" }));
    return res.json(await patientSession(user));
  } catch {
    return res.status(500).json({ message: "Unable to verify OTP." });
  }
}

export async function selectPatientProfile(req, res) {
  if (req.auth.role !== "patient") return res.status(403).json({ message: "Only patient accounts can select a profile." });
  const link = await UserPatientProfile.findOne({ userId: req.auth.sub, patientId: req.body.patientId }).populate("patientId");
  if (!link) return res.status(403).json({ message: "This patient profile is not linked to the account." });
  setAuthCookie(res, signToken({ sub: req.auth.sub, role: "patient", selectedPatientId: link.patientId.id }));
  return res.json({ user: await User.findById(req.auth.sub).then(publicUser), patient: publicPatient(link.patientId), role: "patient", selectedPatientId: link.patientId.id });
}

export async function getCurrentUser(req, res) {
  const record = await User.findById(req.auth.sub);
  if (!record) return res.status(404).json({ message: "Account not found." });
  if (record.role !== "patient") {
    let staffData = publicStaff(record);
    if (record.role === "doctor") {
      const doctorProfile = await DoctorProfile.findOne({ userId: record._id });
      if (doctorProfile) {
        staffData = {
          ...staffData,
          department: doctorProfile.department || staffData.department,
          specialization: doctorProfile.specialization || staffData.specialization,
          roomNumber: doctorProfile.roomNumber,
        };
      }
    }
    return res.json({ user: staffData, role: record.role });
  }
  return res.json(await patientSession(record));
}

export function logout(req, res) {
  clearAuthCookie(res);
  return res.json({ message: "Signed out." });
}

function normalizeIdentifier(value) {
  const identifier = String(value || "").trim();
  if (!identifier) return null;
  if (identifier.includes("@")) return identifier.toLowerCase();
  let digits = identifier.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

function findUser(identifier) {
  return User.findOne(identifier.includes("@") ? { email: identifier } : { phone: identifier });
}

function buildAccountContact(identifier, mobileNumber, email) {
  const normMobile = normalizeIdentifier(mobileNumber);
  const normEmail = String(email || "").trim().toLowerCase();
  const phone = identifier.includes("@") ? normMobile : identifier;
  const accountEmail = identifier.includes("@") ? identifier : (normEmail.includes("@") ? normEmail : undefined);
  if (!phone && !accountEmail) return { error: "A valid mobile number or email address is required." };
  if (mobileNumber && !normMobile) return { error: "Enter a valid 10-digit mobile number." };
  if (email && !accountEmail?.includes("@")) return { error: "Enter a valid email address." };
  return { ...(phone ? { phone } : {}), ...(accountEmail ? { email: accountEmail } : {}) };
}

function findConflictingUser(contact) {
  const conditions = [];
  if (contact.phone) conditions.push({ phone: contact.phone });
  if (contact.email) conditions.push({ email: contact.email });
  return conditions.length ? User.findOne({ $or: conditions }) : null;
}

async function consumeOtp(identifier, code, purpose) {
  if (!identifier || !/^\d{6}$/.test(String(code || ""))) return { ok: false, status: 400, message: "Enter the six-digit OTP." };
  const otp = await OtpVerification.findOne({ identifier, purpose, consumedAt: { $exists: false } }).sort({ createdAt: -1 });
  if (!otp || otp.expiresAt <= new Date()) return { ok: false, status: 401, message: "This OTP has expired. Request a new one." };
  if (otp.attempts >= env.otpMaxAttempts) return { ok: false, status: 429, message: "Too many incorrect attempts. Request a new OTP." };
  otp.attempts += 1;
  const valid = await bcrypt.compare(String(code), otp.codeHash);
  if (!valid) {
    await otp.save();
    return { ok: false, status: 401, message: "Incorrect OTP." };
  }
  otp.consumedAt = new Date();
  await otp.save();
  return { ok: true };
}

async function patientSession(user) {
  const links = await UserPatientProfile.find({ userId: user.id }).populate("patientId").sort({ isPrimary: -1, createdAt: 1 });
  return { user: publicUser(user), profiles: links.map(publicProfile), role: "patient" };
}

function publicUser(user) {
  return { id: user.id, fullName: user.name, phone: user.phone, email: user.email, role: user.role };
}
