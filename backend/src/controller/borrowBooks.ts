import { Request, Response } from "express";
import { books, borrowRecords } from "../database/schema";
import { db } from "../database/connectdb";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

// Define the shape of the request body
interface BorrowBookRequestBody {
  userId: string;
  bookId: string;
}

// Express route handler for borrowing a book
export const borrowBook = async (req: Request<BorrowBookRequestBody>, res: Response) => {
  const { userId, bookId } = req.body;

  // Validate request body
  if (!userId || !bookId) {
    return res.status(400).json({
      success: false,
      error: "userId and bookId are required!!!",
    });
  }

  try {
    // Check book availability
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

    // Calculate due date (7 days from now)
    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    // Insert borrow record
    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    // Update available copies
    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    // Return success response
    res.status(200).json({
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    });
  } catch (error) {
    console.error("Error borrowing book:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while borrowing the book",
    });
    return;
  }
};
