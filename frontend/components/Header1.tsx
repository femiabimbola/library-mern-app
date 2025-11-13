"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; // Import Button
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";

// Helper function for avatar fallback
const getInitials = (name: string) => {
  if (!name) return "";
  const names = name.split(" ");
  // Get first letter of the first name and first letter of the last name
  if (names.length > 1) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  // Or just first two letters if only one name
  return name.substring(0, 2).toUpperCase();
};

const Header = () => {
  const pathname = usePathname();
  const { user, isLoading } = useUserStore(); // Removed 'error' as it's not used here

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/35 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/icons/logo.svg" alt="Logo" width={40} height={40} className="hover:opacity-80" priority />
            <span className="text-lg font-semibold text-gray-900 hidden sm:block">BookWise</span>
          </Link>

          {/* Navigation & Auth Section */}
          <nav className="flex items-center space-x-6">
            {/* Navigation Links */}
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      pathname === link.href ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ===== AUTHENTICATION SECTION ===== */}
            {isLoading ? (
              // 1. Loading State
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : user ? (
              // 2. Authenticated State (User Avatar)
              <Link href="/my-profile" className="group">
                <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-gray-200 group-hover:ring-blue-300 transition-all">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}`} alt={user.fullName} />
                  <AvatarFallback
                    className={cn(
                      "bg-gradient-to-br from-blue-100 to-amber-100 text-gray-800 font-semibold",
                      "group-hover:from-blue-200 group-hover:to-amber-200 transition-all"
                    )}
                  >
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              // 3. Unauthenticated State (Sign In / Sign Up)
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/sign-in">Log In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/sign-up">Register</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
