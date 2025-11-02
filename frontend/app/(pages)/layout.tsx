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

  // useEffect(() => {
  //   // Only run after loading is complete
  //   if (!isLoading) {
  //     if (user) {
  //       router.push("/dashboard");
  //     } else {
  //       router.push("/auth/login");
  //     }
  //   }
  // }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-row bg-pattern bg-cover">
      <Sidebar user={user} />
      <div className="admin-container">
        <Header user={user} />
        {children}
      </div>
    </main>
  );
};

export default UserLayout;
