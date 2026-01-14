"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ColorPicker from "../ColorPicker";
import { MediaUpload } from "./MediaUpload";

// Error fallback component
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

export const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  author: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50),
  rating: z.coerce.number().min(1).max(5),
  totalCopies: z.coerce.number().int().positive().lte(10000),
  coverUrl: z.string(),
  coverColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i),
  videoUrl: z.string(),
  summary: z.string().trim().min(10),
});

export const BookForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      genre: "",
      rating: 1,
      totalCopies: 1,
      coverUrl: "",
      coverColor: "",
      videoUrl: "",
      summary: "",
    },
  });

  const SavedBookFetcher = async (url: string, { arg }: { arg: z.infer<typeof bookSchema> }) => {
    const response = await axios.post(url, arg, { withCredentials: true });
    return response.data;
  };

  const {
    trigger,
    isMutating,
    error: swrError,
  } = useSWRMutation(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`, SavedBookFetcher);

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    try {
      const data = await trigger(values);
      form.reset();
      // TODO - redesign the add success
      const { title, author } = values;
      router.push(`/add-success?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || swrError?.message || "An unexpected error occurred";
      setError(errorMessage);
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto px-6 py-12 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl">Add Books</CardTitle>
            <CardDescription className="text-center">Add books to the Library</CardDescription>
          </CardHeader>
          <CardContent className="px-16">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          className="border h-12 focus-visible:ring-0 focus-visible:border"
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
                <div className="flex justify-center items-center py-4">
                  <Button type="submit" className=" text-white w-80 cursor-pointer py-6">
                    Add Book to Library
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
