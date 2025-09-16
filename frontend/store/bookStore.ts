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
  cart: Book[];
  isLoading: boolean;
  error: Error | null;
  fetchBooks: () => Promise<void>;
  addBook: (book: Book) => void;
  addToCart: (book: Book) => void;
  removeFromCart: (id: string) => void;
  clearBooks: () => void;
}

export const useBookStore = create<BookState>((set) => ({
  books: [],
  cart: [],
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
      set({ books: data.books || [], isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  addToCart: (book) => set((state) => ({ cart: [...state.cart, book] })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  clearBooks: () => set({ books: [], error: null, isLoading: false }),
}));
