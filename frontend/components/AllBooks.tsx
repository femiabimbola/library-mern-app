"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect } from "react";
import { useBookStore } from "@/store/bookStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import ErrorFallback from "./ErrorFallback";

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

{
  /* <ErrorFallback errorMessage={""} />; */
}

const AllBooks = () => {
  const { books, isLoading, error, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  console.log(books);
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Card className="py-10">
        <CardHeader>
          <CardTitle> List of all the books</CardTitle>
          <CardDescription> These are the lists of your books</CardDescription>
        </CardHeader>
      </Card>
    </ErrorBoundary>
  );
};

export default AllBooks;
