"use client";

import Image from "next/image";
import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, fetchUser } = useUserStore();
  const router = useRouter();

  // useEffect(() => {
  //   fetchUser(); // Fetch user data on mount
  // }, [fetchUser]);

  // useEffect(() => {
  //   if (!isLoading && user) {
  //     router.push("/dashboard"); // Redirect to dashboard if user is authenticated
  //   }
  // }, [user, isLoading, router]);

  // useEffect(() => {
  //   if (user) {
  //     router.push("/dashboard"); // Redirect to dashboard if user is authenticated
  //   }
  // }, [user, router]);

  return (
    <main className="relative flex flex-col-reverse text-light-100 sm:flex-row">
      <section className="my-auto flex h-full min-h-screen flex-1 items-center bg-pattern bg-cover bg-top px-5 py-10">
        <div className="gradient-vertical mx-auto flex max-w-xl flex-col gap-6 rounded-lg p-10">
          <div className="flex flex-row gap-3 m-auto ">
            <Image src="/images/logo/mern.png" alt="logo" width={45} height={45} />
            <h1 className="text-2xl font-semibold text-white">BookWise</h1>
          </div>
          <div>{children}</div>
        </div>
      </section>
      <section className="sticky h-40 w-full sm:top-0 sm:h-screen sm:flex-1">
        <Image
          src="/images/auth-illustration.png"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  );
};

export default AuthLayout;
