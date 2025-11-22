"use client";

import Sidebar from "@/components/user/Sidebar";
import { Sidebar2 } from "@/components/user/sidebar2";
import { Sidebar3 } from "@/components/user/sidebar3";
import Header from "@/components/Header1";
import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/store/userStore";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, fetchUser } = useUserStore();

  // Fetch user data on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading && !user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-row bg-pattern bg-cover">
      <Sidebar2 />
      <div className="admin-container">
        <Header />
        {children}
      </div>
    </main>
  );
};

export default UserLayout;
