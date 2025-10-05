import { Router } from "express";
import { deleteUser, getProfile, getStats, getUserData, listUsers, updateUser } from "../controllers/userController";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/profile", getProfile);
router.put("/profile", updateUser);
router.get("/listings", getUserData);


router.use(authorizeAdmin);
router.get("/stats", getStats);
router.get("/", listUsers);
router.delete("/:id", deleteUser);

export default router;