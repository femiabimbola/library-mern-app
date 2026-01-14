// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface SuccessState {
//   bookTitle?: string;
//   bookAuthor?: string;
// }

// const AddSuccess = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [bookTitle, setBookTitle] = useState<string>("");
//   const [bookAuthor, setBookAuthor] = useState<string>("");

//   useEffect(() => {
//     // Check if state is available (from router.push with state)
//     // Note: In Next.js app router, state from router.push isn't directly accessible
//     // So we'll use URL params as a reliable alternative
//     const title = searchParams.get("title");
//     const author = searchParams.get("author");

//     if (title && author) {
//       setBookTitle(decodeURIComponent(title));
//       setBookAuthor(decodeURIComponent(author));
//     }
//   }, [searchParams]);

//   // Alternative: If you prefer using localStorage for more reliable state passing
//   useEffect(() => {
//     const storedData = localStorage.getItem("bookSuccessData");
//     if (storedData) {
//       const { bookTitle: storedTitle, bookAuthor: storedAuthor } = JSON.parse(storedData) as SuccessState;
//       setBookTitle(storedTitle || "");
//       setBookAuthor(storedAuthor || "");
//       localStorage.removeItem("bookSuccessData"); // Clean up after reading
//     }
//   }, []);

//   const handleAddAnother = () => {
//     router.push("/add-book"); // Adjust to your form page route
//   };

//   const handleGoToInventory = () => {
//     router.push("/books"); // Adjust to your inventory page route
//   };

//   const handleGoHome = () => {
//     router.push("/");
//   };

//   return (
//     <div className="container mx-auto px-6 py-12 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-center text-3xl">Success!</CardTitle>
//           <CardDescription className="text-center">
//             {bookTitle && bookAuthor ? (
//               <>
//                 "<strong>{bookTitle}</strong>" by <strong>{bookAuthor}</strong> has been successfully added to the
//                 library!
//               </>
//             ) : (
//               "Your book has been added to the library."
//             )}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col items-center gap-4 p-8">
//           {bookTitle && (
//             <div className="text-center text-lg text-muted-foreground mb-4">
//               Book: <span className="font-semibold">{bookTitle}</span>
//               <br />
//               Author: <span className="font-semibold">{bookAuthor}</span>
//             </div>
//           )}
//           <div className="flex flex-col gap-3 w-full max-w-md">
//             <Button onClick={handleGoToInventory} className="w-full py-6 cursor-pointer">
//               View Book Inventory
//             </Button>
//             <Button onClick={handleAddAnother} variant="outline" className="w-full py-6 cursor-pointer">
//               Add Another Book
//             </Button>
//             <Button onClick={handleGoHome} variant="ghost" className="w-full py-6 cursor-pointer">
//               Go to Home
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AddSuccess;


"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SuccessState {
  bookTitle: string;
  bookAuthor: string;
}

const AddSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use a single state object
  const [data, setData] = useState<SuccessState | null>(null);

  useEffect(() => {
    // 1. Try URL params first (Next.js handles decoding automatically)
    const title = searchParams.get("title");
    const author = searchParams.get("author");

    if (title && author) {
      setData({ bookTitle: title, bookAuthor: author });
      return; // Exit early if found in URL
    }

    // 2. Fallback to LocalStorage
    const storedData = localStorage.getItem("bookSuccessData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData) as SuccessState;
        setData(parsed);
        localStorage.removeItem("bookSuccessData");
      } catch (e) {
        console.error("Failed to parse stored book data", e);
      }
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Success!</CardTitle>
          <CardDescription className="text-lg">
            {data ? (
              <span>
                "<strong>{data.bookTitle}</strong>" by <strong>{data.bookAuthor}</strong> has been added to the library.
              </span>
            ) : (
              "Your book has been successfully added to the library."
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center gap-6 p-8">
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Button onClick={() => router.push("/books")} className="w-full h-12 text-base">
              View Book Inventory
            </Button>
            <Button onClick={() => router.push("/add-book")} variant="outline" className="w-full h-12 text-base">
              Add Another Book
            </Button>
            <Button onClick={() => router.push("/")} variant="ghost" className="w-full h-12 text-base">
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSuccess;