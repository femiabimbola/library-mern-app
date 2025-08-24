"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/user/Sidebar";
import { redirect, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import useSWR from "swr";

// import "@/styles/admin.css";
// import { db } from "@/database/drizzle";
// import { users } from "@/database/schema";
// import { eq } from "drizzle-orm";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }
  return res.json();
};

const UserLayout = async ({ children }: { children: ReactNode }) => {
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
  // const session = await auth();
  // if (!session?.user?.id) redirect("/sign-in");

  // const isAdmin = await db
  //   .select({ isAdmin: users.role })
  //   .from(users)
  //   .where(eq(users.id, session.user.id))
  //   .limit(1)
  //   .then((res) => res[0]?.isAdmin === "ADMIN");

  // if (!isAdmin) redirect("/");

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={user} />
      <div className="admin-container">
        {/* <Header session={session} /> */}
        {children}
      </div>
      {children}
    </main>
  );
};

export default UserLayout;
