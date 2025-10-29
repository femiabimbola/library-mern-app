"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BorrowButtonProps {
  bookId: string;
  availableCopies: number;
  userId: string;
}

const BorrowBook = ({ bookId, availableCopies, userId }: BorrowButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleBorrow = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/borrow`,
        { userId, bookId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "Book borrowed successfully! Due in 7 days." });
        // Refresh page to update available copies
        setTimeout(() => router.refresh(), 1500);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to borrow book.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };
  const isAvailable = availableCopies > 0;

  return (
    <div className="mt-6">
      <button
        onClick={handleBorrow}
        disabled={!isAvailable || loading}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          isAvailable
            ? loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Borrowing..." : isAvailable ? "Borrow Book" : "Not Available"}
      </button>

      {message && (
        <p className={`mt-3 text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <p className="mt-2 text-sm text-gray-600">{availableCopies} copy(ies) available</p>
    </div>
  );
};

export default BorrowBook;
