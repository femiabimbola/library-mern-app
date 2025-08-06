import { Request, NextFunction, Router } from "express";
import { createUser, loginUser, } from "../controller/auth";
import { validateSignUp, validateSignIn } from "../middleware/authValidation";
import { rateLimiter } from "../middleware/ratelimit";
import "../lib/passportStrategy/localStrategy"
import passport from "passport";


const router = Router();


router.post("/auth/register", validateSignUp, rateLimiter, createUser)

router.post("/auth/login", validateSignIn, passport.authenticate("local", {failureMessage: true}), loginUser )


export default router;