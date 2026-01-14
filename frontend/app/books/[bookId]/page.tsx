import BorrowButton1 from "@/components/BorrowBookButton1";

// import BorrowButton from "@/components/BorrowBookButton";
// import BorrowBook2 from "@/components/BorrowBookButton2";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Import shadcn/ui components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Import icons from lucide-react
import { Library, User, CheckCircle, XCircle, TriangleAlert } from "lucide-react";

// (Your Book interface remains the same)
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl: string;
  availableCopies?: number;
  description: string;
  summary?: string;
}

// (Your getBook function remains the same)
const getBook = async (bookId: string) => {
  const bookApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`;

try {
    const response = await axios.get(bookApiUrl);
    return response.data.data;
  } catch (error) {
    // Check if it's specifically a 404 from the server
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null; 
    }
    // For other errors (network fail, 500), log and return null
    console.error("Fetch Error:", error);
    return null;
  }
};

const SingleBookPage = async ({ params }: { params: { bookId: string } }) => {
  const { bookId } = await params; 
  const book: Book | null = await getBook(bookId);

 
  // This check is a fallback in case getBook returns null unexpectedly.
  if (!book) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md p-6 md:p-8 text-center">
          <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <TriangleAlert size={28} className="text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold">Book Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We're sorry, but the book with ID "{bookId}" could not be found. It might have been removed or the link
              may be incorrect.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/books">Back to Library</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const copies = book.availableCopies ?? 0;
  const isAvailable = copies > 0;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-8">
          {/* Column 1: Book Cover Image */}
          <div className="md:col-span-1 p-6 md:p-8 bg-muted/50 flex justify-center items-center">
            <Image
              src={book.coverUrl}
              alt={book.title}
              width={400} // Provide high-res base for quality
              height={600} // Maintain aspect ratio
              className="rounded-lg shadow-xl object-cover w-full max-w-75 md:max-w-full h-auto"
              priority // Prioritize loading this image (LCP)
            />
          </div>

          {/* Column 2: Book Details */}
          <div className="md:col-span-2 p-6 md:p-8 flex flex-col space-y-6">
            {/* Header: Title, Author, Genre */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{book.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User size={16} />
                  <span className="text-lg font-medium text-primary/90">{book.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Library size={16} />
                  <Badge variant="outline" className="text-sm">
                    {book.genre}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Availability & Action Section */}
            <div className="bg-muted/50 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Availability</h3>
                <div className="flex items-center gap-2">
                  {isAvailable ? (
                    <CheckCircle size={18} className="text-green-600" />
                  ) : (
                    <XCircle size={18} className="text-red-600" />
                  )}
                  <span className={`font-medium ${isAvailable ? "text-green-700" : "text-red-700"}`}>
                    {isAvailable ? `${copies} ${copies === 1 ? "Copy" : "Copies"} Available` : "Out of Stock"}
                  </span>
                </div>
              </div>
              <BorrowButton1 bookId={book.id} availableCopies={copies} />
            </div>

            {/* Description & Summary Section */}
            <div className="space-y-6 pt-4">
              {book.description && (
                <article className="prose prose-gray dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold">Description</h3>
                  <p>{book.description}</p>
                </article>
              )}

              {book.summary && (
                <article className="prose prose-gray dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold">Summary</h3>
                  <p>{book.summary}</p>
                </article>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SingleBookPage;
