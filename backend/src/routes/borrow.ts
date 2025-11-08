import { Router } from "express";

import { borrowBook, getAllBorrowRecords } from "../controller/borrowBook";

const router = Router();

router.post("/borrow", borrowBook);
router.get("/borrow", getAllBorrowRecords);

export default router;
