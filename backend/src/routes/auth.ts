import { Request, NextFunction, Router } from "express";
import { createUser, loginUser, PassportLocal, } from "../controller/auth";
import { validateSignUp, validateSignIn } from "../middleware/authValidation";
import { rateLimiter } from "../middleware/ratelimit";
import "../lib/passportStrategy/localStrategy"
import passport from "passport";


const router = Router();


router.post("/auth/register", validateSignUp, rateLimiter, createUser)

// router.post("/auth/login", validateSignIn, passport.authenticate("local", {failureMessage: true}), loginUser )



router.post('/auth/login', PassportLocal);

// router.post('/auth/login', PassportLocal, loginUser )


export default router;