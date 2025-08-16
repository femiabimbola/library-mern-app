import { Router } from "express";
import authRouter from "./auth";
import bookRouter from "./book"
import userRouter from "./user"

const router = Router();

router.use(authRouter);
router.use(bookRouter);
router.use(userRouter)

export default router;