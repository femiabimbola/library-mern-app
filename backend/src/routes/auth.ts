import { Request, NextFunction, Router } from "express";
import { createUser, loginUser, } from "../controller/auth";
import { validateSignUp } from "../middleware/authValidation";
import { rateLimiter } from "../middleware/ratelimit";
// import {  checkSchema } from "express-validator";
// import { createUserValidationSchema, loginUserValidationSchema } from "../validator/expressValidator";

const router = Router();


router.post("/auth/register", validateSignUp, rateLimiter, createUser)

router.post("/auth/login", validateSignUp, loginUser)




export default router;