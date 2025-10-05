import { Router } from "express";
import { createBooks, getAllBooks, deleteBook } from "../controller/books";

const router = Router();

router.post("/books", createBooks);
router.get("/books", getAllBooks);
router.delete("/books/:id", deleteBook);

export default router;
