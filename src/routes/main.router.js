import { Router } from "express";
import userRouter from "./user.router.js";
import postRouter from "./post.router.js";

const router = Router();

router.use("/users", userRouter);
router.use("/posts", postRouter);

export default router;
