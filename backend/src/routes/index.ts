import { Router } from "express";
import authRouter from "./auth";
import bookRouter from "./book"

const router = Router();

router.use(authRouter);
router.use(bookRouter)

export default router;