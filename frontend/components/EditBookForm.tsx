"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr"; // Use SWR for fetching data
import useSWRMutation from "swr/mutation"; // Use SWRMutation for updating data
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import ColorPicker from "./ColorPicker";
import { MediaUpload } from "./MediaUpload";
// Import your existing schema
import { bookSchema } from "./BookForm"; // Assuming you export bookSchema from the file where BookForm is defined

// Type for the book data based on your schema
type BookFormData = z.infer<typeof bookSchema>;

// Error fallback component (copied from your original code)
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

// --- Fetcher Functions ---

// Fetch function for SWR to get book data
const BookFetcher = async (url: string) => {
  const response = await axios.get(url, { withCredentials: true });
  return response.data.data;
};

// Update function for SWRMutation (using PUT for full replacement)
const UpdatedBookFetcher = async (url: string, { arg }: { arg: BookFormData }) => {
  console.log("frontend here");
  const response = await axios.put(url, arg, { withCredentials: true });
  return response.data;
};

// --- Main Component ---

interface EditBookFormProps {
  bookId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditBookForm = ({ bookId, onSuccess, onCancel }: EditBookFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();

  // 1. FETCH existing book data
  const bookApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`;
  const {
    data: bookData,
    isLoading,
    error: swrFetchError,
  } = useSWR(
    bookId ? bookApiUrl : null, // Only fetch if bookId exists
    BookFetcher
  );
  console.log(bookData);
  // 2. SETUP Form with default values from fetched data
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    // it will be updated by the useEffect hook below.
    defaultValues: bookData || {},
  });

  // Effect to populate form fields once data is loaded
  useEffect(() => {
    if (bookData) {
      const numericData = {
        ...bookData,
        rating: Number(bookData.rating),
        totalCopies: Number(bookData.totalCopies),
      };
      form.reset(numericData); // Resets the form with the fetched data
    }
  }, [bookData, form]);

  // 3. SETUP SWRMutation for updating the book
  const { trigger, isMutating, error: swrMutationError } = useSWRMutation(bookApiUrl, UpdatedBookFetcher);

  // 4. HANDLE form submission
  const onSubmit = async (values: BookFormData) => {
    try {
      await trigger(values);
      onSuccess(); // Call the parent's onSuccess handler
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || swrMutationError?.message || "An unexpected error occurred during update";
      setError(errorMessage);
    }
  };

  // --- Render Logic ---

  if (!bookId) return null;

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <CardTitle>Loading Book Details...</CardTitle>
        <CardDescription className="mt-2">Fetching data for book ID: {bookId}</CardDescription>
      </Card>
    );
  }

  if (swrFetchError || !bookData) {
    return (
      <Card className="p-8 text-center">
        <CardTitle className="text-red-500">Error</CardTitle>
        <CardDescription className="mt-2">
          Failed to load book: {swrFetchError?.message || "Book not found."}
        </CardDescription>
        <Button onClick={onCancel} className="mt-4">
          Close
        </Button>
      </Card>
    );
  }

  // Combine all errors for display
  const displayError = error || swrMutationError?.message || swrFetchError?.message;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto px-6 py-12 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl">Edit Book</CardTitle>
            <CardDescription className="text-center">Update the details for the book ID: **{bookId}**</CardDescription>
          </CardHeader>
          <CardContent className="px-16">
            {displayError && (
              <p className="text-red-500 text-center mb-4 border border-red-500 p-2 rounded">{displayError}</p>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* *** FORM FIELDS (Same as BookForm) ***
                  
                  I'm only including one field for brevity, but you would include 
                  ALL the fields from your original BookForm here. 
                  Since they are controlled components and the form is reset with bookData, 
                  they will be automatically populated.
                */}
                <FormField
                  control={form.control}
                  name={"title"}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-base font-normal">Book Title</FormLabel>
                      <FormControl>
                        <Input
                          required
                          placeholder="Book title"
                          {...field}
                          className="border-1 h-12 focus-visible:ring-0 focus-visible:border-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name={"author"}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="text-base font-normal text-dark-500">Author</FormLabel>
                        <FormControl>
                          <Input required placeholder="Book author" {...field} className="input-style" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"genre"}
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="text-base font-normal text-dark-500">Genre</FormLabel>
                        <FormControl>
                          <Input required placeholder="Book genre" {...field} className="input-style" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"rating"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base font-normal text-dark-500">Rating</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={5} placeholder="Book rating" {...field} className="" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"totalCopies"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base font-normal text-dark-500">Total Copies</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={10000}
                            placeholder="Total copies"
                            {...field}
                            className="book-form_input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-x-4">
                  <FormField
                    control={form.control}
                    name={"coverUrl"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1 w-1/3">
                        <FormLabel className="text-base font-normal text-dark-500">Book Image</FormLabel>
                        <FormControl>
                          <MediaUpload
                            field={field}
                            folder="/libApp/images"
                            mediaType="image"
                            previewWidth={700}
                            previewHeight={400}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"videoUrl"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1 w-1/3">
                        <FormLabel className="text-base font-normal text-dark-500">Book Trailer</FormLabel>
                        <FormControl>
                          <MediaUpload
                            field={field}
                            folder="/libApp/images"
                            mediaType="video"
                            previewWidth={700}
                            previewHeight={400}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={"coverColor"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1 w-1/4">
                        <FormLabel className="text-base font-normal text-dark-500">Primary Color</FormLabel>
                        <FormControl>
                          <ColorPicker onPickerChange={field.onChange} value={field.value} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-x-4">
                  <FormField
                    control={form.control}
                    name={"description"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1 w-1/2">
                        <FormLabel className="text-base font-normal text-dark-500">Book Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Book description" {...field} rows={10} className="book-form_input" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"summary"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1 w-1/2">
                        <FormLabel className="text-base font-normal text-dark-500">Book Summary</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Book summary" {...field} rows={5} className="book-form_input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between items-center py-4">
                  <Button
                    type="button"
                    onClick={onCancel}
                    disabled={isMutating}
                    className=" text-white w-40 cursor-pointer py-6 bg-gray-500 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isMutating} className=" text-white w-80 cursor-pointer py-6">
                    {isMutating ? "Saving..." : "Update Book Details"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};
