import { Router } from "express";
import { tokenProtection } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { createPost } from "../controllers/post.controller.js";
const router = Router();

router.post("/", tokenProtection, upload.single("file"), createPost);

export default router;
