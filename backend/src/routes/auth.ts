import { Request, NextFunction, Router } from "express";
import { createUser, PassportLocal, logOut } from "../controller/auth";
import { validateSignUp, validateSignIn } from "../middleware/authValidation";
import { rateLimiter } from "../middleware/ratelimit";
import "../lib/passportStrategy/localStrategy";

const router = Router();

router.post("/auth/register", validateSignUp, rateLimiter, createUser);

router.post("/auth/login", validateSignIn, PassportLocal);

router.get("/auth/logout", logOut);

export default router;
