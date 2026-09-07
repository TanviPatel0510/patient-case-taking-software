import bcrypt from "bcryptjs";
import { connectDB } from "../../config/db.js";
import {
  AdminProfile,
  DoctorProfile,
  KioskProfile,
  NurseProfile,
  Patient,
  User,
  UserPatientProfile,
} from "../models/index.js";

export async function seedDatabase() {
  console.log("Connecting to MongoDB for seeding...");
  await connectDB();

  console.log("Checking and seeding users...");

  // 1. DOCTORS (3 doctors)
  const doctors = [
    {
      name: "Dr. Rajesh Sharma",
      email: "doctor.sharma@medikiosk.in",
      phone: "9876500001",
      password: "Doctor@123",
      profile: {
        employeeId: "DOC-001",
        licenseRegistrationNumber: "MCI-2024-001",
        qualification: "MBBS, MD (Medicine)",
        department: "General Medicine",
        specialization: "Internal Medicine & Chronic Disease",
        roomNumber: "OPD Room 101",
        consultationType: "ALLOPATHY",
        availabilityStatus: "available",
      },
    },
    {
      name: "Dr. Priya Patel",
      email: "doctor.patel@medikiosk.in",
      phone: "9876500002",
      password: "Doctor@123",
      profile: {
        employeeId: "DOC-002",
        licenseRegistrationNumber: "MCI-2024-002",
        qualification: "BAMS, MD (Ayurveda)",
        department: "Ayush & Integrative Medicine",
        specialization: "Ayurveda & Holistic Health",
        roomNumber: "OPD Room 104",
        consultationType: "AYUSH",
        availabilityStatus: "available",
      },
    },
    {
      name: "Dr. Vikram Reddy",
      email: "doctor.reddy@medikiosk.in",
      phone: "9876500003",
      password: "Doctor@123",
      profile: {
        employeeId: "DOC-003",
        licenseRegistrationNumber: "MCI-2024-003",
        qualification: "MBBS, DCH (Pediatrics)",
        department: "Pediatrics",
        specialization: "Child & Adolescent Health",
        roomNumber: "OPD Room 108",
        consultationType: "ALLOPATHY",
        availabilityStatus: "available",
      },
    },
  ];

  for (const doc of doctors) {
    let user = await User.findOne({ email: doc.email });
    if (!user) {
      const passwordHash = await bcrypt.hash(doc.password, 10);
      user = await User.create({
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        passwordHash,
        role: "doctor",
        isActive: true,
        isVerified: true,
      });
      console.log(`Created doctor user: ${doc.name} (${doc.email})`);
    }

    const existingProfile = await DoctorProfile.findOne({ userId: user._id });
    if (!existingProfile) {
      await DoctorProfile.create({
        userId: user._id,
        ...doc.profile,
      });
      console.log(`Created DoctorProfile for: ${doc.name}`);
    }
  }

  // 2. TRIAGE NURSE (1 user)
  const nurseData = {
    name: "Nurse Sunita Verma",
    email: "nurse.verma@medikiosk.in",
    phone: "9876500010",
    password: "Nurse@123",
    profile: {
      employeeId: "NURSE-001",
      licenseRegistrationNumber: "INC-2024-010",
      qualification: "B.Sc Nursing",
      department: "OPD Triage",
      station: "Triage Desk A",
      shift: "Morning",
      isOnDuty: true,
    },
  };

  let nurseUser = await User.findOne({ email: nurseData.email });
  if (!nurseUser) {
    const passwordHash = await bcrypt.hash(nurseData.password, 10);
    nurseUser = await User.create({
      name: nurseData.name,
      email: nurseData.email,
      phone: nurseData.phone,
      passwordHash,
      role: "triage_nurse",
      isActive: true,
      isVerified: true,
    });
    console.log(`Created nurse user: ${nurseData.name} (${nurseData.email})`);
  }

  const existingNurseProfile = await NurseProfile.findOne({ userId: nurseUser._id });
  if (!existingNurseProfile) {
    await NurseProfile.create({
      userId: nurseUser._id,
      ...nurseData.profile,
    });
    console.log(`Created NurseProfile for: ${nurseData.name}`);
  }

  // 3. ADMIN (1 user)
  const adminData = {
    name: "Admin Amit Gupta",
    email: "admin@medikiosk.in",
    phone: "9876500020",
    password: "Admin@123",
    profile: {
      adminType: "super_admin",
      employeeId: "ADM-001",
      permissions: {
        manageUsers: true,
        manageFacilities: true,
        manageReports: true,
        manageSettings: true,
      },
    },
  };

  let adminUser = await User.findOne({ email: adminData.email });
  if (!adminUser) {
    const passwordHash = await bcrypt.hash(adminData.password, 10);
    adminUser = await User.create({
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone,
      passwordHash,
      role: "admin",
      isActive: true,
      isVerified: true,
    });
    console.log(`Created admin user: ${adminData.name} (${adminData.email})`);
  }

  const existingAdminProfile = await AdminProfile.findOne({ userId: adminUser._id });
  if (!existingAdminProfile) {
    await AdminProfile.create({
      userId: adminUser._id,
      ...adminData.profile,
    });
    console.log(`Created AdminProfile for: ${adminData.name}`);
  }

  // 4. KIOSK (1 user)
  const kioskData = {
    name: "Kiosk Station OPD-1",
    email: "kiosk.opd01@medikiosk.in",
    phone: "9876500030",
    password: "Kiosk@123",
    profile: {
      deviceId: "KIOSK-OPD-001",
      kioskName: "Main OPD Registration Kiosk",
      location: "Ground Floor OPD Waiting Area",
      credentialHash: await bcrypt.hash("kiosk-station-token", 10),
      softwareVersion: "1.0.0",
    },
  };

  let kioskUser = await User.findOne({ email: kioskData.email });
  if (!kioskUser) {
    const passwordHash = await bcrypt.hash(kioskData.password, 10);
    kioskUser = await User.create({
      name: kioskData.name,
      email: kioskData.email,
      phone: kioskData.phone,
      passwordHash,
      role: "kiosk",
      isActive: true,
      isVerified: true,
    });
    console.log(`Created kiosk user: ${kioskData.name} (${kioskData.email})`);
  }

  const existingKioskProfile = await KioskProfile.findOne({ userId: kioskUser._id });
  if (!existingKioskProfile) {
    await KioskProfile.create({
      userId: kioskUser._id,
      ...kioskData.profile,
    });
    console.log(`Created KioskProfile for: ${kioskData.name}`);
  }

  // 5. PATIENT (1 user + patient record)
  const patientUserData = {
    name: "Ramesh Kumar",
    email: "ramesh.kumar@medikiosk.in",
    phone: "9876543210",
  };

  let patientUser = await User.findOne({ phone: patientUserData.phone });
  if (!patientUser) {
    patientUser = await User.create({
      name: patientUserData.name,
      email: patientUserData.email,
      phone: patientUserData.phone,
      role: "patient",
      isActive: true,
      isVerified: true,
    });
    console.log(`Created patient user: ${patientUserData.name} (${patientUserData.phone})`);
  }

  let patientRecord = await Patient.findOne({ "demographics.fullName": "Ramesh Kumar" });
  if (!patientRecord) {
    patientRecord = await Patient.create({
      identity: {
        abhaNumber: "14-1234-5678-9012",
        abhaAddress: "ramesh.kumar@abdm",
        aadhaarLastFour: "5432",
        isAbhaVerified: true,
      },
      demographics: {
        fullName: "Ramesh Kumar",
        gender: "male",
        dateOfBirth: new Date("1984-06-15"),
        age: 42,
        address: {
          villageOrCity: "Ahmedabad",
          district: "Ahmedabad",
          state: "Gujarat",
          pincode: "380015",
        },
        emergencyContact: {
          name: "Sita Kumar",
          relationship: "Spouse",
          phone: "9876543211",
        },
      },
      preferences: {
        preferredLanguage: "hi",
        accessibilityMode: {
          audioGuided: true,
          highContrast: false,
          largeFont: false,
        },
      },
      medicalProfile: {
        heightCm: "172",
        weightKg: "70",
        bloodGroup: "B+",
        chronicConditions: ["Hypertension"],
        allergies: ["Penicillin"],
        medications: ["Amlodipine 5mg"],
      },
      consent: {
        accepted: true,
        acceptedAt: new Date(),
      },
      status: "active",
    });
    console.log(`Created Patient clinical record for: ${patientRecord.demographics.fullName}`);
  }

  const existingLink = await UserPatientProfile.findOne({
    userId: patientUser._id,
    patientId: patientRecord._id,
  });
  if (!existingLink) {
    await UserPatientProfile.create({
      userId: patientUser._id,
      patientId: patientRecord._id,
      relation: "self",
      isPrimary: true,
    });
    console.log(`Linked patient profile for: ${patientUser.name}`);
  }

  console.log("\n==========================================");
  console.log("DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("==========================================");
  console.log("Doctor Accounts (password: Doctor@123):");
  console.log("  1. doctor.sharma@medikiosk.in (General Medicine)");
  console.log("  2. doctor.patel@medikiosk.in  (Ayush & Integrative)");
  console.log("  3. doctor.reddy@medikiosk.in  (Pediatrics)");
  console.log("Triage Nurse Account (password: Nurse@123):");
  console.log("  nurse.verma@medikiosk.in");
  console.log("Admin Account (password: Admin@123):");
  console.log("  admin@medikiosk.in");
  console.log("Kiosk Account (password: Kiosk@123):");
  console.log("  kiosk.opd01@medikiosk.in");
  console.log("Patient Account (OTP via console):");
  console.log("  Phone: 9876543210 (or ramesh.kumar@medikiosk.in)");
  console.log("==========================================\n");
}

// Allow standalone execution
if (process.argv[1]?.includes("seed.js")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding error:", err);
      process.exit(1);
    });
}
