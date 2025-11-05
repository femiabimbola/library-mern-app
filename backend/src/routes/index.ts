import { Router } from "express";
import authRouter from "./auth";
import bookRouter from "./book";
import userRouter from "./user";
import borrowRouter from "./borrow";

const router = Router();

router.use(authRouter);
router.use(bookRouter);
router.use(userRouter);
router.use(borrowRouter);

export default router;
