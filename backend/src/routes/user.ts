import {  Router } from "express";
import { getUser, isAuthenticated } from "../controller/user";

const router = Router();

router.get('/user',  getUser );

export default router;