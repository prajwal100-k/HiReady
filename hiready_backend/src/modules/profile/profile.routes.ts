import { Router } from "express";
import { getMyProfile, updateMyProfile } from "./profile.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

// protected routes
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);

export default router;
