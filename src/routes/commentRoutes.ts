import { Router } from "express";
import { createComment, getComments, deleteComment } from "../controllers/commentController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", createComment);
router.get("/:listingId", getComments);
router.delete("/:id", deleteComment);

export default router;