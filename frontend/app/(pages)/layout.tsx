"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/user/Sidebar";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import useSWR from "swr";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }
  return res.json();
};

const UserLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    "http://localhost:5000/api/user",
    fetcher
  );

  useEffect(() => {
    if (error) {
      router.push("/auth/login"); // Redirect to login page if not authenticated
    }
  }, [error, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.user) {
    return null; // Redirect will handle this
  }

  const user = data.user;

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar user={user} />
      <div className="admin-container">
        {/* <Header session={session} /> */}
      </div>
      {/* {children} */}
    </main>
  );
};

export default UserLayout;
