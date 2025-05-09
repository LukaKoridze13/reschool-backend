import { Router } from "express";
import { createUser, getUser, loginUser, newAccessToken } from "../controllers/user.controller.js";
import { tokenProtection } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/refresh-token", newAccessToken);
router.get("/me", tokenProtection, getUser);

export default router;
