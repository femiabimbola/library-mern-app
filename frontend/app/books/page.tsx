"use client";

import { useBookStore } from "@/store/bookStore";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SingleBookCard } from "@/components/SingleBook";

const Books = () => {
  const { books, isLoading, error, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  if (isLoading) {
    return (
      <div className="">
        <p> The book is loading </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p> An error occurred</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No books found.</p>
      </div>
    );
  }

  return (
    <section className="">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {books.map((book) => (
          <SingleBookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            uploadedImageUrl={book.coverUrl}
          />
        ))}
      </div>
      )
    </section>
  );
};

export default Books;
