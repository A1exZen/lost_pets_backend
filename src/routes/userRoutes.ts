import { Router } from "express";
import { getProfile, updateUser, getUserData, getStats } from "../controllers/userController";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/profile", getProfile);
router.put("/profile", updateUser);
router.get("/listings", getUserData);


router.use(authorizeAdmin);
router.get("/stats", getStats);

export default router;