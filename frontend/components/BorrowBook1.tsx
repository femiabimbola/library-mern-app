"use client";

import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BorrowButtonProps {
  bookId: string;
  availableCopies: number;
}

const BorrowBook = ({ bookId, availableCopies }: BorrowButtonProps) => {
  // ────── STATE ──────
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const router = useRouter();
  const { user, isLoading: userLoading, fetchUser } = useUserStore();

  // ────── FETCH USER ON MOUNT ──────
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ────── DERIVED VALUES ──────
  const isLoggedIn = !!user?.id; // true when user exists
  const isAvailable = availableCopies > 0;
  const canBorrow = isLoggedIn && isAvailable; // button enabled only here

  // ────── BORROW HANDLER (unchanged) ──────
  const handleBorrow = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/borrow`,
        { userId: user!.id, bookId }, // user is guaranteed here
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Book borrowed successfully! Due in 7 days.",
        });
        setTimeout(() => router.refresh(), 1500);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to borrow book.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // ────── LOGIN HANDLER ──────
  const handleLoginRedirect = () => {
    // Preserve the book page so user returns after login
    router.push(`/auth/login?redirect=/books/${bookId}`);
  };

  // ────── UI LOGIC ──────
  const getButtonProps = () => {
    // 1. Not logged in
    if (!isLoggedIn) {
      return {
        text: "Log in to borrow book",
        disabled: false,
        onClick: handleLoginRedirect,
        className: "bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer",
      };
    }

    // 2. Logged in – loading
    if (loading) {
      return {
        text: "Borrowing…",
        disabled: true,
        onClick: undefined,
        className: "bg-gray-400 text-white cursor-not-allowed",
      };
    }

    // 3. Logged in – not available
    if (!isAvailable) {
      return {
        text: "Not Available",
        disabled: true,
        onClick: undefined,
        className: "bg-gray-300 text-gray-500 cursor-not-allowed",
      };
    }

    // 4. Logged in – ready to borrow
    return {
      text: "Borrow Book",
      disabled: false,
      onClick: handleBorrow,
      className: "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer",
    };
  };

  const btn = getButtonProps();

  // ────── RENDER ──────
  return (
    <div className="mt-6">
      <button
        onClick={btn.onClick}
        disabled={btn.disabled}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${btn.className}`}
      >
        {btn.text}
      </button>

      {/* Optional: show loading spinner for user fetch */}
      {userLoading && <p className="mt-2 text-sm text-gray-500">Checking login…</p>}

      {message && (
        <p className={`mt-3 text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <p className="mt-2 text-sm text-gray-600">{availableCopies} copies available</p>
    </div>
  );
};

export default BorrowBook;
