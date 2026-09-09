import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  registerPatient,
  requestPatientOtp,
  selectPatientProfile,
  updatePreferredLanguage,
  validatePatientRegistration,
  verifyPatientOtp,
} from "../controllers/auth.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", optionalAuth, registerPatient);
router.post("/patient/add-profile", requireAuth, registerPatient);
router.post("/login", login);
router.post("/patient/validate-registration", optionalAuth, validatePatientRegistration);
router.post("/patient/request-otp", requestPatientOtp);
router.post("/patient/verify-otp", verifyPatientOtp);
router.post("/patient/select-profile", requireAuth, selectPatientProfile);
router.put("/patient/preferred-language", requireAuth, updatePreferredLanguage);
router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logout);

export default router;
