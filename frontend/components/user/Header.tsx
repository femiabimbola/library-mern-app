"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = ({ user }: { user: any }) => {
  // For active link to change colour
  const pathname = usePathname();
  return (
    <header className=" my-10 flex justify-between gap-5 border border-red-400">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/library" ? "text-light-200" : "text-lime-100"
            )}
          >
            {" "}
            Library
          </Link>
        </li>
        <li>
          <Link href={"/my-profile"}>
            <Avatar>
              <AvatarFallback className="bg-amber-100 font-bold">
                {getInitials(user?.name || "")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
