import { Request, NextFunction, Router } from "express";
import { createUser, loginUser, PassportLocal, } from "../controller/auth";
import { validateSignUp, validateSignIn } from "../middleware/authValidation";
import { rateLimiter } from "../middleware/ratelimit";
import "../lib/passportStrategy/localStrategy"


const router = Router();


router.post("/auth/register", validateSignUp, rateLimiter, createUser)

router.post('/auth/login', PassportLocal);


export default router;