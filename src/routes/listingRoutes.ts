import { Router } from "express";
import {
	create,
	getById,
	update,
	deleteL,
	search,
	toggleFavoriteListing,
	getUserFavoritesList
} from "../controllers/listingController";
import { authenticate } from "../middleware/auth";
import { validateCreateListing } from "../middleware/validation";
import { upload } from "../middleware/upload";
import {getUserData} from "../controllers/userController";

const router = Router();

router.get("/", search);
router.get("/favorites", authenticate, getUserFavoritesList);

router.use(authenticate);

router.post("/", upload.array("photos", 5), validateCreateListing, create);
router.get("/my", getUserData);
router.get("/:id", getById);
router.put("/:id", upload.array("photos", 5), update);
router.delete("/:id", deleteL);
router.post("/:id/favorite", toggleFavoriteListing);

export default router;