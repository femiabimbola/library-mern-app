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
  const [loading, setLoading] = useState(false); // For the borrow API call
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  // Get user state and loading status from your Zustand store
  const { user, isLoading: isUserLoading, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser(); // Fetch user data on mount
  }, [fetchUser]);

  // --- State Booleans for Clearer Logic ---
  const isUserLoggedIn = !!user?.id;
  const isBookAvailable = availableCopies > 0;
  // const isBorrowApiLoading = loading; // Renamed for clarity
  const isBorrowApiLoading = isUserLoggedIn && isBookAvailable; // Renamed for clarity

  const handleBorrow = async () => {
    // Guard clause: Ensure user is logged in before proceeding
    if (!user?.id) {
      setMessage({ type: "error", text: "You must be logged in to borrow." });
      return;
    }

    setLoading(true);
    setMessage(null);
    const userId = user.id;

    console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/borrow`);
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

  /**
   * Main click handler for the button.
   * It either triggers the borrow action or routes to the login page.
   */
  const handleMainClick = () => {
    if (isUserLoggedIn) {
      handleBorrow();
    } else {
      // Redirect to your login page
      // Assumes your login route is '/login'
      router.push("/auth/login");
    }
  };

  // --- Dynamic Button Props ---

  const isDisabled =
    isUserLoading || // 1. Disabled while checking user auth
    isBorrowApiLoading || // 2. Disabled while borrow API is running
    (isUserLoggedIn && !isBookAvailable); // 3. Disabled if logged in but no copies

  const getButtonText = () => {
    if (isUserLoading) return "Loading...";
    if (!isUserLoggedIn) return "Log in to borrow book";
    if (isBorrowApiLoading) return "Borrowing...";
    if (!isBookAvailable) return "Not Available";
    return "Borrow Book";
  };

  const getButtonClassName = () => {
    const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all cursor-pointer";

    if (isDisabled) {
      // "Not Available" state
      if (isUserLoggedIn && !isBookAvailable) {
        return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`;
      }
      // All other loading/disabled states
      return `${baseClasses} bg-gray-400 text-white cursor-not-allowed`;
    }

    // Active states ("Borrow Book" or "Log in to borrow")
    return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white`;
  };

  // --- Render ---

  return (
    <div className="mt-6">
      <button onClick={handleMainClick} disabled={isDisabled} className={getButtonClassName()}>
        {getButtonText()}
      </button>

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
