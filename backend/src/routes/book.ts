import { Router } from "express";
import { createBooks, getAllBooks, deleteBook, getBookById } from "../controller/books";

const router = Router();

router.post("/books", createBooks);
router.get("/books", getAllBooks);
router.delete("/books/:id", deleteBook);
router.get("/books/:id", getBookById);

export default router;
