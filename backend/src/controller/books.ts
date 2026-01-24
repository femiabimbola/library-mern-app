import { Request, Response, NextFunction } from "express";
import { db } from "../database/connectdb";
import { books } from "../database/schema";
import { eq, sql } from "drizzle-orm";

interface DeleteBookParams {
  id: string;
}

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
      res.status(400).json({
        success: false,
        message: "Book ID is required for deletion",
      });
      return;
    }

    // const book = await db.select().from(books).where(eq(books.id, id)).limit(1);
    const book = await db.select().from(books).where(eq(books.id, sql`${id}::uuid`)).limit(1);

    if (book.length === 0) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

  // 2. Perform the deletion query
  const deletedBook = await db
      .delete(books) 
      .where(eq(books.id, sql`${id}::uuid`)) 
      .returning();

    // 4. Respond with success
    res.status(200).json({
      success: true,
      message: `Book with ID ${id} deleted successfully`,
      data: deletedBook[0], // Optionally return the deleted book
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the book",
    });
    return;
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    // 1. Get the book ID from the request parameters
    const { id } = req.params;

    // Validate if ID is present
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
      return;
    }

    // 2. Perform the selection query
    const book = await db
      .select()
      .from(books) // Specify the table
      .where(eq(books.id, sql`${id}::uuid`)) // Specify the condition
      .limit(1); // Limit the result to one

    // 3. Check if the book was found
    if (book.length === 0) {
      res.status(404).json({
        success: false,
        message: `Book with ID ${id} not found`,
      });
      return;
    }

    // 4. Respond with the found book
    res.status(200).json({
      success: true,
      message: `Book with ID ${id} retrieved successfully`,
      data: book[0], // Return the single found book object
    });
    return;
  } catch (error) {
    // 5. Handle potential server errors
    console.error("Error retrieving book:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the book",
    });
    return;
  }
};

export const editBook = async (req: Request, res: any, next: NextFunction) => {
  try {
    const { id } = req.params; // Book ID from URL parameters
    const { title, author, genre, rating, coverUrl, coverColor, description, totalCopies, videoUrl, summary } =
      req.body;

    // Validate book ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    // Validate at least one field is provided for update
    if (
      !title &&
      !author &&
      !genre &&
      !rating &&
      !coverUrl &&
      !coverColor &&
      !description &&
      !totalCopies &&
      !videoUrl &&
      !summary
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided to update",
      });
    }

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (genre !== undefined) updateData.genre = genre;
    if (rating !== undefined) updateData.rating = rating;
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
    if (coverColor !== undefined) updateData.coverColor = coverColor;
    if (description !== undefined) updateData.description = description;
    if (totalCopies !== undefined) {
      updateData.totalCopies = totalCopies;
      updateData.availableCopies = totalCopies; // Update availableCopies to match totalCopies
    }
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (summary !== undefined) updateData.summary = summary;

    // Perform the update with Drizzle ORM
    const updatedBook = await db
      .update(books)
      .set(updateData)
      .where(eq(books.id, sql`${id}::uuid`)) 
      .returning();

    // Check if the book was found and updated
    if (!updatedBook[0]) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedBook[0],
    });
  } catch (error) {
    console.error("Error updating book:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the book",
    });
  }
};
