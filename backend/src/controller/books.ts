import { Request, Response, NextFunction } from "express";
import { db } from "../database/connectdb";
import { books } from "../database/schema";
import { eq } from "drizzle-orm";

export const createBooks = async (req: Request, res: any, next: NextFunction) => {
  try {
    const { title, author, genre, rating, coverUrl, coverColor, description, totalCopies, videoUrl, summary } =
      req.body;

    // Validate required fields
    if (!title || !author || !totalCopies) {
      return res.status(400).json({
        success: false,
        message: "Title, author, and totalCopies are required",
      });
    }

    const newBook = await db
      .insert(books)
      .values({
        title,
        author,
        genre,
        rating,
        coverUrl,
        coverColor,
        description,
        totalCopies,
        videoUrl,
        summary,
        availableCopies: totalCopies,
      })
      .returning(); //it returns the book

    return res.status(201).json({ success: true, data: newBook[0] });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the book",
    });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const allBooks = await db.select().from(books);
    res.status(200).json({
      success: true,
      data: allBooks,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching books",
    });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    // 1. Get the book ID from the request parameters
    const { id } = req.params;

    // Validate if ID is present
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required for deletion",
      });
    }

    const book = await db.select().from(books).where(eq(books.id, id)).limit(1);

    if (book.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // 2. Perform the deletion query
    const deletedBook = await db
      .delete(books) // Specify the table
      .where(eq(books.id, id)) // Specify the condition (assuming the primary key is 'id' and 'eq' is a function for equality comparison from the ORM)
      .returning(); // Optional: returns the deleted rows

    // 3. Check if any book was actually deleted
    // if (deletedBook.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: `Book with ID ${id} not found`,
    //   });
    // }

    // 4. Respond with success
    return res.status(200).json({
      success: true,
      message: `Book with ID ${id} deleted successfully`,
      data: deletedBook[0], // Optionally return the deleted book
    });
  } catch (error) {
    console.error(`Error deleting book with ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the book",
    });
  }
};
