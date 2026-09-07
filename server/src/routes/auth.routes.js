import { Router } from "express";
import { getCurrentUser, login, logout, registerPatient, requestPatientOtp, selectPatientProfile, verifyPatientOtp } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerPatient);
router.post("/patient/add-profile", requireAuth, registerPatient);
router.post("/login", login);
router.post("/patient/request-otp", requestPatientOtp);
router.post("/patient/verify-otp", verifyPatientOtp);
router.post("/patient/select-profile", requireAuth, selectPatientProfile);
router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logout);

export default router;
