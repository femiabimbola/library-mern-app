"use client";

import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }
  return res.json();
};

const UserDashboard = () => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    "http://localhost:5000/api/user",
    fetcher
  );

  // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (error) {
  //     router.push('/auth/login'); // Redirect to login page if not authenticated
  //   }
  // }, [error, router]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!data || !data.user) {
  //   return null; // Redirect will handle this
  // }

  const user = data.user;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <div className="mb-4">
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-lg">
            <span className="font-semibold">User ID:</span> {user.id}
          </p>
        </div>
        <button
          onClick={() => {
            fetch("http://localhost:5000/api/logout", {
              method: "POST",
              credentials: "include",
            }).then(() => router.push("/auth/login"));
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
