import { Router } from "express";
import { createBooks, getAllBooks } from "../controller/books";

const router = Router();

router.post("/books", createBooks);
router.get("/books", getAllBooks);
// router.get("/books", createBooks)

export default router;
