import { Request, Response, NextFunction } from "express";
import { db } from "../database/connectdb";
import { books } from "../database/schema";

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

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allBooks = await db.select().from(books);

    return res.status(200).json({
      success: true,
      data: allBooks,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching books",
    });
  }
};
