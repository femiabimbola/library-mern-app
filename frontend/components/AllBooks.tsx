"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ErrorBoundary } from "react-error-boundary";
import { useCallback, useEffect, useState } from "react";
import { useBookStore } from "@/store/bookStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ErrorBoundaryAdapter from "./GlobalErrorFallback";
import { Button } from "./ui/button";
import { DeleteModal } from "./editBook/DeleteModal";
import { EditModal } from "./editBook/EditDialog";

const AllBooks = () => {
  const { books, isLoading, fetchBooks, deleteBook } = useBookStore();
  const [bookToDeleteId, setBookToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bookToEditId, setBookToEditId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Handler to open the confirmation modal
  const handleDeleteClick = useCallback((bookId: any) => {
    setBookToDeleteId(bookId);
  }, []);

  const handleEditClick = useCallback((bookId: any) => {
    setBookToEditId(bookId);
  }, []);

  // Handler for confirmed deletion
  const handleConfirmDelete = useCallback(
    async (id: string) => {
      if (isDeleting) return;
      try {
        const result = await deleteBook(id);
        console.log(result);
        await fetchBooks();
      } catch (error) {
        console.error("An unexpected error occurred during deletion:", error);
      } finally {
        setIsDeleting(false);
        setBookToDeleteId(null);
      }
    },
    [deleteBook]
  );

  if (isLoading && books.length === 0) {
    return <p className="text-center text-white my-10">Loading books...</p>;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryAdapter}>
      <Card className="my-10">
        <CardHeader>
          <CardTitle className=""> List of all the books</CardTitle>
          <CardDescription> These are the lists of your books </CardDescription>
          {books.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No books found in the library.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="h-12 border-b">
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Total Copies</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="">{book.title}</TableCell>
                    <TableCell className="">{book.author}</TableCell>
                    <TableCell className="">{book.genre}</TableCell>
                    <TableCell className="">{book.totalCopies}</TableCell>
                    <TableCell className="">{book.rating}</TableCell>
                    <TableCell className="">
                      <div className="flex gap-x-2">
                        <Button variant="link" className="cursor-pointer" onClick={() => handleEditClick(book.id)}>
                          Edit
                        </Button>
                        <Button
                          className="cursor-pointer"
                          onClick={() => handleDeleteClick(book.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting && bookToDeleteId === book.id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardHeader>
      </Card>
      {/* There must be props for dialog */}
       <DeleteModal
        bookId={bookToDeleteId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBookToDeleteId(null)}
      />
      {/* For the edit */}

      <EditModal bookId={bookToEditId} onCancel={() => setBookToEditId(null)} />
    </ErrorBoundary>
  );
};

export default AllBooks;
