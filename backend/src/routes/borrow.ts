import { Router } from "express";

import { borrowBook, getAllBorrowRecords } from "../controller/borrowBook";
import { validateBorrow } from "../middleware/borrowValidation";

const router = Router();

router.post("/borrow", validateBorrow, borrowBook);
router.get("/borrow", getAllBorrowRecords);

export default router;
