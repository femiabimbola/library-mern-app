"use client"

import { cn } from "@/lib/utils";
import { BookCoverSvg } from "./bookdesign/BookCoverSvg";
import { ImageKitProvider } from "@imagekit/next";
import Link from "next/link";
import Image from "next/image";



const variantStyles: Record<any, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

const BookCover = ({
  className,
  variant = "regular",
  coverColor = "#012B48",
  coverUrl,
}: any) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      <BookCoverSvg coverColor={coverColor} />
      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >

        <ImageKitProvider urlEndpoint={imageKitEndpoint}>
                <Image src={coverUrl} alt="Uploaded Media" width={250} height={300} className="rounded-md" />
              </ImageKitProvider>
      </div>
    </div>
  );
};

export default BookCover;
