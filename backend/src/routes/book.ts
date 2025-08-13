import { Router } from "express";
import { createBooks } from "../controller/books";

const router = Router();

router.post('/books', createBooks );

export default router;