import { Router } from "express";
import { createBooks, getAllBooks, deleteBook, getBookById, editBook } from "../controller/books";

const router = Router();

router.post("/books", createBooks);
router.get("/books", getAllBooks);
router.delete("/books/:id", deleteBook);
router.put("/books/:id", editBook);
router.get("/books/:id", getBookById);

export default router;
