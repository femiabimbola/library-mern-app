import { Request, NextFunction, Router } from "express";
import { createUser, loginUser, } from "../controller/auth";
import { validateSignUp, validateSignIn } from "../middleware/authValidation";
import { rateLimiter } from "../middleware/ratelimit";
import passport from "passport";


const router = Router();


router.post("/auth/register", validateSignUp, rateLimiter, createUser)

router.post("/api/auth/login", validateSignIn, passport.authenticate("local",) )


export default router;