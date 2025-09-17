"use client";

import { useBookStore } from "@/store/bookStore";
import { useEffect } from "react";

const Books = () => {
  const { books, isLoading, error, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  console.log(books);
  return (
    <section className="my-auto flex h-full min-h-screen flex-1 items-center bg-pattern bg-cover bg-top px-5 py-10">
      <p>hey</p>
    </section>
  );
};

export default Books;
