import { create } from "zustand";

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  coverUrl: string;
  coverColor: string;
  videoUrl: string;
  summary: string;
}

interface BookState {
  books: Book[];
  isLoading: boolean;
  error: Error | null;
  fetchBooks: () => Promise<void>;
  addBook: (book: Book) => void;
  deleteBook: (id: string) => Promise<void>;
  clearBooks: () => void;
}

export const useBookStore = create<BookState>((set) => ({
  books: [],
  isLoading: false,
  error: null,
  fetchBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`);

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();

      // set({ books: data.books || [], isLoading: false });
      set({ books: data.data || [], isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  deleteBook: async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete book");
      }
      set((state) => ({
        books: state.books.filter((book) => book.id !== id),
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
  clearBooks: () => set({ books: [], error: null, isLoading: false }),
}));
