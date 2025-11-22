"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { adminSideBarLinks } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserStore } from "@/store/userStore";

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/dashboard",
    text: "Dashboard",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/addbook",
    text: "Add Book",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/allbooks",
    text: "All Books",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/borrow-records",
    text: "Borrow Records",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/setting",
    text: "Account Setting",
  },
  // Removed Logout from here
];

export const Sidebar3 = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserStore();

  // Mock logout function - replace with your actual auth logout logic
  const handleLogout = async () => {
    // await signOut();
    // clearUserStore();
    router.push("/sign-in");
  };

  return (
    <div className="sticky top-0 left-0 flex h-screen w-[280px] flex-col justify-between bg-white border-r border-gray-200 pt-8 pb-6 shadow-sm max-md:hidden">
      {/* --- TOP SECTION: Logo & Nav --- */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-8 mb-10">
          <Image src="/icons/admin/logo.svg" alt="logo" height={40} width={40} className="object-contain" />
          <h1 className="text-2xl font-bold text-dark-200 tracking-tight">BookWise</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 px-4">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/dashboard" && pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out",
                    isSelected
                      ? "bg-primary-admin shadow-md translate-x-1" // Active State
                      : "hover:bg-gray-100 hover:text-dark-200" // Hover State
                  )}
                >
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt="icon"
                      fill
                      className={cn(
                        "object-contain transition-colors",
                        isSelected ? "brightness-0 invert" : "opacity-60 group-hover:opacity-100"
                      )}
                    />
                  </div>

                  <p
                    className={cn(
                      "text-base font-medium transition-colors",
                      isSelected ? "text-white" : "text-gray-500 group-hover:text-dark-100"
                    )}
                  >
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* --- BOTTOM SECTION: User & Logout --- */}
      <div className="px-4">
        <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
          {/* User Info Card */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-amber-100 text-amber-700 font-bold">
                {getInitials(user?.fullName || "A")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <p className="truncate text-sm font-bold text-dark-200">{user?.fullName || "Admin User"}</p>
              <p className="truncate text-xs text-gray-400 font-medium">{user?.email || "admin@bookwise.com"}</p>
            </div>
          </div>

          <div className="h-px w-full bg-gray-200" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-red-50"
          >
            <div className="relative size-5">
              {/* Assuming you have a logout icon or reuse user.svg */}
              <Image
                src="/icons/admin/user.svg" // Or use a specific logout icon
                alt="logout"
                fill
                className="object-contain opacity-50 transition-all group-hover:opacity-100 group-hover:brightness-0 group-hover:invert-[.25] group-hover:sepia group-hover:saturate-[50] group-hover:hue-rotate-[320deg]"
              />
            </div>
            <p className="text-sm font-semibold text-gray-500 transition-colors group-hover:text-red-600">Log Out</p>
          </button>
        </div>
      </div>
    </div>
  );
};
