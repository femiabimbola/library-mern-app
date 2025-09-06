"use client";

import Sidebar from "@/components/user/Sidebar";
import Header from "@/components/user/Header";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/store/userStore";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user, isLoading, error, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser(); // Fetch user data on mount
  }, [fetchUser]);

  useEffect(() => {
    if (error) {
      router.push("/auth/login"); // Redirect to login page if not authenticated
    }
  }, [error, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Redirect will handle this
  }

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar user={user} />
      <div className="admin-container">
        <Header user={user} />
        {children}
      </div>
    </main>
  );
};

export default UserLayout;
