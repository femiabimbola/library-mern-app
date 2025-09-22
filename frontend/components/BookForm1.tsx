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
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || swrError?.message || "An unexpected error occurred";
      setError(errorMessage);
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Books</CardTitle>
            <CardDescription>Add more books to the Library</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4"></CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};
