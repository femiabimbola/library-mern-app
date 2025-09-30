"use client";

import { Card, CardDescription, CardTitle } from "./ui/card";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect } from "react";
import { useBookStore } from "@/store/bookStore";

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="p-4">
        <CardTitle className="text-red-500">Something went wrong</CardTitle>
        <CardDescription>{error.message}</CardDescription>
      </Card>
    </div>
  );
};

const AllBooks = () => {
  const { books, isLoading, error, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  console.log(books);
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Card></Card>
    </ErrorBoundary>
  );
};

export default AllBooks;
