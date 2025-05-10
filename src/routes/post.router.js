import { Router } from "express";
import { tokenProtection } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { createPost, postFeed } from "../controllers/post.controller.js";
const router = Router();

router.post("/", tokenProtection, upload.single("file"), createPost);
router.get("/feed", postFeed);

export default router;
