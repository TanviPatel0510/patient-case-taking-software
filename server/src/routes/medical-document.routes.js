import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { deleteMedicalDocument } from "../controllers/medical-history.controller.js";

const router = Router();

router.use(requireAuth);
router.delete("/:documentId", deleteMedicalDocument);

export default router;