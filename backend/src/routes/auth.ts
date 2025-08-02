import { Request, NextFunction, Router } from "express";
import { createUser, loginUser, } from "../controller/auth";
import { validateSignUp } from "../middleware/authValidation";
import { rateLimiter } from "../middleware/ratelimit";


const router = Router();


router.post("/auth/register", validateSignUp, rateLimiter, createUser)

router.post("/auth/login", validateSignUp, loginUser)




export default router;