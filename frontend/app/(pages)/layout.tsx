"use client";

import Sidebar from "@/components/user/Sidebar";
import Header from "@/components/Header1";
import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/store/userStore";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, fetchUser } = useUserStore();

  // Fetch user data on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-row bg-pattern bg-cover">
      <Sidebar user={user} />
      <div className="admin-container">
        <Header />
        {children}
      </div>
    </main>
  );
};

export default UserLayout;
