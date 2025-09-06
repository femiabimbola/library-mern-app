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
    if (error || user) {
      return router.push("/auth/login"); // Redirect will handle this
    }
  }, [error, router]);

  if (isLoading) {
    return <div>Loading...</div>;
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
