import axios from "axios";
import { notFound } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImageUrl: string;
}

const getBook = async (id: string) => {
  const bookApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`;

  const res = await fetch(bookApiUrl, {
    cache: "no-store", // Or adjust caching as needed (e.g., 'force-cache' for static)
  });

  if (!res.ok) {
    notFound(); // Redirect to 404 page if fetch fails
  }
  console.log(res.json);
  return res.json();
};

const SingleBookPage = async ({ params }: { params: { bookId: string } }) => {
  const { bookId } = params;
  // console.log(bookId, "my 28");
  const book: Book | null = await getBook(bookId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Details</h1>
      <p>
        <strong>Author:</strong> {book?.author}
      </p>
      <p>{book?.title}</p>

      {/* <p><strong>Genre:</strong> {book.genre}</p> */}
      {/* <img 
        src={book.coverImage} //
        alt="Book Cover" 
        className="w-64 h-auto mt-4" 
      /> */}
    </div>
  );
};

export default SingleBookPage;
