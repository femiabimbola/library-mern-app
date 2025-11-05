import { Router } from "express";

import { borrowBook } from "../controller/borrowBooks";
import { borrowBook2 } from "../controller/borrowBook2";

const router = Router();

router.post("/borrow", borrowBook2);

export default router;
