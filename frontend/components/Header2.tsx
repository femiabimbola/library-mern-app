"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";

const Header = () => {
  const pathname = usePathname();

  const { user, isLoading, error } = useUserStore();

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

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
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
            {/* User Section */}
            {user ? (
              <Link href="/my-profile" className="group">
                <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-gray-200 group-hover:ring-blue-300 transition-all">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}`} alt={user?.fullName} />
                  <AvatarFallback
                    className={cn(
                      "bg-gradient-to-br from-blue-100 to-amber-100 text-gray-800 font-semibold",
                      "group-hover:from-blue-200 group-hover:to-amber-200 transition-all"
                    )}
                  >
                    {/* {getInitials(user?.name || "")} */}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign Up</Link>
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
