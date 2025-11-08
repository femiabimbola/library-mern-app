import { Request, Response, RequestHandler } from "express";
import { books, borrowRecords } from "../database/schema";
import { db } from "../database/connectdb";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

interface BorrowBookRequestBody {
  userId: string;
  bookId: string;
}

//Request<P, ResBody, ReqBody, ReqQuery>
export const borrowBook: RequestHandler<{}, any, BorrowBookRequestBody> = async (
  req: Request<{}, any, BorrowBookRequestBody>,
  res: Response
) => {
  const { userId, bookId } = req.body;

  console.log("Borrow request:", { userId, bookId });

  if (!userId || !bookId) {
    res.status(400).json({
      success: false,
      error: "userId and bookId are required right",
    });
    return;
  }

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      res.status(400).json({
        success: false,
        error: "Book is not available for borrowing",
      });
      return;
    }

    const dueDate = dayjs().add(7, "day").format("YYYY-MM-DD");

    const [record] = await db
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
