import axios from "axios";
import { notFound } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImageUrl: string;
}

const getBook = async (bookId: string) => {
  const bookApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`;

  try {
    const response = await axios.get(bookApiUrl);
    if (response.status === 404) {
      notFound();
    }
    return response.data.data;
  } catch (error) {
    console.error("Axios error:", error);
    throw new Error("Failed to fetch book data using Axios.");
  }
};

const SingleBookPage = async ({ params }: { params: { bookId: string } }) => {
  // const params = useParams(); // Get params on client
  // const bookId = params.id as string

  const { bookId } = await params;
  const book: Book | null = await getBook(bookId);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <h1 className="text-xl font-semibold text-red-600 p-6 bg-white rounded-lg shadow-md">404 - Book Not Found</h1>
        <p className="text-gray-600">The book with ID "{bookId}" could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Details</h1>
      <p>
        <strong>Author:</strong> {book?.author}
      </p>
      <p>{book?.title}</p>

      <p>
        <strong>Genre:</strong> {book.genre}
      </p>
      {/* <img 
        src={book.coverImage} //
        alt="Book Cover" 
        className="w-64 h-auto mt-4" 
      /> */}
    </div>
  );
};

export default SingleBookPage;
