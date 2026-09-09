import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createMedicalBundle, handleMedicalUploadError, listMedicalBundles, medicalUpload } from "../controllers/medical-history.controller.js";

const router = Router();

router.use(requireAuth);
router.post("/bundle", medicalUpload, createMedicalBundle);
router.get("/", listMedicalBundles);
router.use(handleMedicalUploadError);

export default router;