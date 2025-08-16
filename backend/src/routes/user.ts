import { Request, NextFunction, Router } from "express";
import { getUser } from "../controller/user";

const router = Router();

router.post('/user', getUser );

export default router