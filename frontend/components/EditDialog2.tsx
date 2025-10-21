import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { bookSchema } from "./BookForm";
import { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";

interface EditBookFormProps {
  bookId: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

// Fetch function for SWR to get book data
const BookFetcher = async (url: string) => {
  const response = await axios.get(url, { withCredentials: true });
  return response.data;
};

// Type for the book data based on your schema
type BookFormData = z.infer<typeof bookSchema>;

// Not used yet
const EditDialog2 = ({ bookId, onConfirm, onCancel }: EditBookFormProps) => {
  if (!bookId) return null;

  // const [error, setError] = useState<string | undefined>("");
  // const [bookData, setBookData] = useState<z.infer<typeof bookSchema> | null>(null);

  const bookApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`;

  const {
    data: bookData,
    isLoading,
    error: swrFetchError,
  } = useSWR<BookFormData>(
    bookId ? bookApiUrl : null, // Only fetch if bookId exists
    BookFetcher
  );

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: bookData || {},
  });

  // useEffect(() => {
  //   const fetchBook = async () => {
  //     if (!bookId) return; // Early return if bookId is null
  //     try {
  //       const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`, {
  //         withCredentials: true,
  //       });
  //       setBookData(response.data);
  //       form.reset(response.data);
  //     } catch (err: any) {
  //       setError(err?.response?.data?.message || "Failed to fetch book data");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchBook();
  // }, [bookId, form]);

  // Effect to populate form fields once data is loaded
  useEffect(() => {
    if (bookData) {
      // Convert number fields that might be strings from the server to numbers for react-hook-form
      const numericData = {
        ...bookData,
        rating: Number(bookData.rating),
        totalCopies: Number(bookData.totalCopies),
      };
      form.reset(numericData); // Resets the form with the fetched data
    }
  }, [bookData, form]);

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 ">
      <Card className="max-w-md w-full p-6 text-center shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Edit Book</CardTitle>
          <CardDescription className="text-center">Update the details for the book ID: **{bookId}**</CardDescription>
        </CardHeader>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400 border-none">
            Cancel
          </Button>
          <Button onClick={() => onConfirm(bookId)} className="bg-red-600 text-white hover:bg-red-700">
            Edit Book
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditDialog2;
