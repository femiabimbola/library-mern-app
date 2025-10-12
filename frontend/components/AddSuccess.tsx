"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AddSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get title and author from query parameters
  const title = searchParams.get("title");
  const author = searchParams.get("author");

  return (
    <div className="container mx-auto px-6 py-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl">Success!</CardTitle>
          <CardDescription className="text-center">
            The book <span className="font-semibold">{title || "Unknown Title"}</span> by
            <span className="font-semibold">{author || "Unknown Author"}</span> has been added to the library.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button onClick={() => router.push("/add-book")} className="w-80 py-6">
            Add Another Book
          </Button>
          <Button onClick={() => router.push("/inventory")} variant="outline" className="w-80 py-6">
            View Book Inventory
          </Button>
          <Button onClick={() => router.push("/")} variant="outline" className="w-80 py-6">
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSuccessPage;
