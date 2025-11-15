import { Router } from "express";
import { createBooks, getAllBooks, deleteBook, getBookById, editBook } from "../controller/books";
import { validateBook } from "../middleware/bookValidation";

const router = Router();

router.post("/books", validateBook, createBooks);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve a list of books
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get("/books", getAllBooks);

router.delete("/books/:id", deleteBook);
router.put("/books/:id", editBook);
router.get("/books/:id", getBookById);

export default router;
