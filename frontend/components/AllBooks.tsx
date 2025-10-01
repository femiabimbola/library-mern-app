"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect } from "react";
import { useBookStore } from "@/store/bookStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ErrorBoundaryAdapter from "./GlobalErrorFallback";

const AllBooks = () => {
  const { books, isLoading, error, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryAdapter}>
      <Card className="my-10">
        <CardHeader>
          <CardTitle> List of all the books</CardTitle>
          <CardDescription> These are the lists of your books</CardDescription>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          {books.map((book) => (
            <p key={book.id}>{book.title}</p>
          ))}
        </CardHeader>
      </Card>
    </ErrorBoundary>
  );
};

export default AllBooks;
