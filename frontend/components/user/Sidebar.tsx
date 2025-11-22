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
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserStore();

  const handleLogout = async () => {
    // Add your logout logic here
    // await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="sticky top-0 left-0 flex h-screen w-[280px] flex-col justify-between bg-white border-r border-gray-200 pt-8 pb-6 shadow-sm max-md:hidden">
      {/* --- TOP SECTION --- */}

      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-8 mb-10">
          <Image src="/icons/admin/logo.svg" alt="logo" height={37} width={37} className="object-contain" />
          <h1 className="text-2xl font-bold text-dark-100 tracking-tight">BookWise</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-3 px-4">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/dashboard" && pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 ease-in-out",
                    isSelected
                      ? "bg-blue-600 shadow-md text-white hover:bg-blue-700" // Active: Blue BG + White Text
                      : "text-gray-500 hover:bg-gray-100 hover:text-dark-100" // Inactive: Gray Text + Light Hover
                  )}
                >
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt="icon"
                      fill
                      className={cn(
                        "object-contain transition-all",
                        // If selected, turn icon white using filter. If not, opacity reduced.
                        isSelected ? "brightness-0 invert" : "opacity-50"
                      )}
                    />
                  </div>

                  <p className="text-base font-medium">{link.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* --- BOTTOM SECTION: User & Logout --- */}
      <div className="px-4">
        <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                {getInitials(user?.fullName || "A")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <p className="truncate text-sm font-bold text-dark-100">{user?.fullName || "Admin User"}</p>
              <p className="truncate text-xs text-gray-400 font-medium">{user?.email || "admin@bookwise.com"}</p>
            </div>
          </div>

          <div className="h-px w-full bg-gray-200" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-red-50"
          >
            {/* Using a logout icon or fallback */}
            <div className="relative size-5">
              {/* Ensure this path exists or use a generic icon */}
              <Image
                src="/icons/admin/logout.svg" // Assuming you have this, or reuse user.svg
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
