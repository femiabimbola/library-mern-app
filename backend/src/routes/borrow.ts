import { Router } from "express";

import { borrowBook } from "../controller/borrowBook";

const router = Router();

router.post("/borrow", borrowBook);

export default router;
