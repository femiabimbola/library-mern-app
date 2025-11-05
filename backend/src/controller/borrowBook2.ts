import { Request, Response, RequestHandler } from "express";
import { books, borrowRecords } from "../database/schema";
import { db } from "../database/connectdb";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

// ... your imports

interface BorrowBookRequestBody {
  userId: string;
  bookId: string;
}

//req: Request<{}, any, BorrowBookRequestBody>
export const borrowBook2 = async (req: Request, res: Response) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({
      success: false,
      error: "userId and bookId are required",
    });
  }

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        error: "Book is not available for borrowing",
      });
    }

    const dueDate = dayjs().add(7, "day").format("YYYY-MM-DD");

    const record = await db
      .insert(borrowRecords)
      .values({
        userId,
        bookId,
        dueDate,
        status: "BORROWED",
      })
      .returning(); // optional: use .returning() if supported

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error borrowing book:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while borrowing the book",
    });
  }
};
