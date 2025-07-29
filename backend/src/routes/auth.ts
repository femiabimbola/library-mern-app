import { Request, NextFunction, Router } from "express";
import { createUser, } from "../controller/auth";
import { validateSignUp } from "../middleware/authValidation";
// import {  checkSchema } from "express-validator";
// import { createUserValidationSchema, loginUserValidationSchema } from "../validator/expressValidator";

const router = Router();


router.post("/auth/register", validateSignUp, createUser)




export default router;