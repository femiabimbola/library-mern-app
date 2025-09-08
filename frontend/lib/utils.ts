import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const getInitialsNew = (name: string) => {
  if (!name) return "U";
  const names = name.trim().split(" ");
  return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : names[0][0];
};
