"use client";

import { useBookStore } from "@/store/bookStore";
import { useEffect } from "react";
import { BookArchive } from "@/components/bookdesign/BookArchive2";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react"; 
import { BookSkeleton } from "@/components/bookdesign/BookSkeleton";


const Books = () => {
  const { books, isLoading, error, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Helper function to render the main content based on state
  const renderContent = () => {
    // 1. Loading State
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-3xl mx-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <BookSkeleton key={index} />
          ))}
        </div>
      );
    }

    // 2. Error State
    if (error) {
      return (
        <div className="max-w-lg mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Fetching Books</AlertTitle>
            <AlertDescription>We couldn't load the book archive. Please try again later.</AlertDescription>
          </Alert>
        </div>
      );
    }

    // 3. Empty State
    if (books.length === 0) {
      return (
        <div className="max-w-lg mx-auto">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>There are no Books</AlertTitle>
            <AlertDescription>There are currently no books in the collection. Check back soon!</AlertDescription>
          </Alert>
        </div>
      );
    }

    // 4. Success State
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-[1200px] max-w-5xl mx-auto">
        {books.map((book) => (
          <BookArchive
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            uploadedImageUrl={book.coverUrl}
          />
        ))}
      </div>
    );
  };

  return (
    // Page layout with standard padding and heading
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to our Book Store</h1>
        <p className="text-muted-foreground ">
          {/* Dynamically update subtitle based on state */}
          {isLoading ? "Browsing our collection..." : `Browse all ${books.length} books in our collection.`}
        </p>
      </div>

      {/* Render the correct content based on the current state */}
      {renderContent()}
    </section>
  );
};

export default Books;
