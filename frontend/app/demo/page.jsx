"use client";

import React, { useState, useEffect, useCallback } from "react";
// We assume the useBookStore includes the deleteBook action and the component uses a client-side library like Zustand.

// -------------------------------------------------------------------------
// MOCK UI COMPONENTS (Simplified for single-file runnable example)
// -------------------------------------------------------------------------

const Card = ({ children, className }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>{children}</div>
);
const CardHeader = ({ children }) => <div>{children}</div>;
const CardTitle = ({ children }) => <h2 className="text-2xl font-bold text-gray-800 mb-2">{children}</h2>;
const CardDescription = ({ children }) => <p className="text-gray-500 mb-4">{children}</p>;
const Table = ({ children }) => <table className="min-w-full divide-y divide-gray-200">{children}</table>;
const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
const TableBody = ({ children }) => <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
const TableRow = ({ children, className = "" }) => (
  <tr className={`hover:bg-gray-50 transition duration-150 ${className}`}>{children}</tr>
);
const TableHead = ({ children }) => (
  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>{children}</td>
);
const Button = ({ children, onClick, variant, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-lg transition duration-150 ease-in-out font-medium 
      ${variant === "link" ? "text-blue-600 hover:text-blue-800" : ""}
      ${
        className.includes("outline")
          ? "border border-red-500 text-red-500 hover:bg-red-50"
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
      }
      ${className}
    `}
  >
    {children}
  </button>
);
const ErrorBoundary = ({ children, FallbackComponent }) => {
  try {
    return children;
  } catch (e) {
    return <FallbackComponent error={e} />;
  }
};
const ErrorBoundaryAdapter = ({ error }) => (
  <div className="text-red-600 p-4 border border-red-300 rounded-lg">
    <p>An error occurred in the component boundary: {error.message}</p>
  </div>
);

// -------------------------------------------------------------------------
// MOCK DATA STORE (Simulating useBookStore)
// -------------------------------------------------------------------------

// Initial mock data
let mockBooksData = [
  { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", totalCopies: 15, rating: 4.5 },
  { id: "2", title: "1984", author: "George Orwell", genre: "Dystopian", totalCopies: 22, rating: 4.8 },
  { id: "3", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", totalCopies: 18, rating: 4.7 },
];

// Simple state management for the mock store
let storeState = {
  books: mockBooksData,
  isLoading: false,
  error: null,
};

const listeners = new Set();

const updateStore = (newState) => {
  storeState = { ...storeState, ...newState };
  listeners.forEach((listener) => listener(storeState));
};

const mockFetchBooks = async () => {
  updateStore({ isLoading: true, error: null });
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, this would be a fetch call
  updateStore({ isLoading: false, books: mockBooksData });
};

const mockDeleteBook = async (id) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  const initialLength = mockBooksData.length;
  mockBooksData = mockBooksData.filter((book) => book.id !== id);

  if (mockBooksData.length < initialLength) {
    // Successful deletion (simulated)
    console.log(`Mock: Book with ID ${id} deleted.`);
    return { success: true, message: "Deleted successfully" };
  } else {
    // Book not found (simulated)
    console.error(`Mock: Book with ID ${id} not found.`);
    return { success: false, message: "Book not found" };
  }
};

const useBookStore = () => {
  const [state, setState] = useState(storeState);

  useEffect(() => {
    const listener = (newState) => setState(newState);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  // Provide bound functions
  return {
    ...state,
    fetchBooks: mockFetchBooks,
    deleteBook: mockDeleteBook, // <-- The new action
  };
};

// -------------------------------------------------------------------------
// CONFIRMATION DIALOG COMPONENT
// -------------------------------------------------------------------------

const ConfirmationDialog = ({ bookId, onConfirm, onCancel }) => {
  if (!bookId) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 text-center shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <CardTitle>Confirm Deletion</CardTitle>
        <CardDescription className="my-4">
          Are you sure you want to delete this book? This action cannot be undone.
        </CardDescription>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400 border-none">
            Cancel
          </Button>
          <Button onClick={() => onConfirm(bookId)} className="bg-red-600 text-white hover:bg-red-700">
            Delete Permanently
          </Button>
        </div>
      </Card>
    </div>
  );
};

// -------------------------------------------------------------------------
// MAIN COMPONENT (AllBooks)
// -------------------------------------------------------------------------

const AllBooks = () => {
  const { books, isLoading, error, fetchBooks, deleteBook } = useBookStore();
  const [bookToDeleteId, setBookToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Initial data fetch
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Handler to open the confirmation modal
  const handleDeleteClick = useCallback((bookId) => {
    setBookToDeleteId(bookId);
  }, []);

  // Handler for confirmed deletion
  const handleConfirmDelete = useCallback(
    async (id) => {
      if (isDeleting) return;

      setIsDeleting(true);
      try {
        const result = await deleteBook(id);

        if (result.success) {
          // Re-fetch the list to update the UI after successful deletion
          await fetchBooks();
        } else {
          console.error("Deletion failed:", result.message);
          // In a real app, show a toast or message box here
        }
      } catch (err) {
        console.error("An unexpected error occurred during deletion:", err);
      } finally {
        setIsDeleting(false);
        setBookToDeleteId(null); // Close the modal regardless of success/failure
      }
    },
    [deleteBook, fetchBooks, isDeleting]
  );

  // Render Loading/Error state
  if (isLoading && books.length === 0) {
    return <p className="text-center text-blue-600 my-10">Loading books...</p>;
  }

  if (error) {
    return <ErrorBoundaryAdapter error={{ message: error }} />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryAdapter}>
      <Card className="my-10 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>List of all the books</CardTitle>
          <CardDescription>These are the lists of your books.</CardDescription>

          {books.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No books found in the library.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="h-12 border-b">
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Copies</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-semibold">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell>{book.totalCopies}</TableCell>
                    <TableCell>{book.rating}</TableCell>
                    <TableCell>
                      <div className="flex gap-x-2 items-center">
                        <Button variant="link" className="pointer">
                          Edit
                        </Button>
                        <Button className="outline" onClick={() => handleDeleteClick(book.id)} disabled={isDeleting}>
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

      {/* Confirmation Dialog for Deletion */}
      <ConfirmationDialog
        bookId={bookToDeleteId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBookToDeleteId(null)}
      />
    </ErrorBoundary>
  );
};

export default AllBooks;
