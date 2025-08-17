import { Request, Response, NextFunction } from "express";
import { db } from "../database/connectdb";
import { books } from "../database/schema";


export const createBooks = async (
  req: Request, res: any, next: NextFunction
) => {

  try {
    const {
      title, author, genre, rating, coverUrl,
      coverColor,description,
      totalCopies,
      videoUrl,
      summary
    } = req.body;

    // Validate required fields
    if (!title || !author || !totalCopies) {
      return res.status(400).json({
        success: false,
        message: 'Title, author, and totalCopies are required'
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
        availableCopies: totalCopies
      })
      .returning();  //it returns the book

      return res.status(201).json({success: true,data: newBook[0]});
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the book'
    });
  }
}