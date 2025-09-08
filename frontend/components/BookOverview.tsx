import Image from "next/image";
import React from "react";
import BookCover from "./BookCover";
// import { BorrowBook } from "./BorrowBook";

import { useUserStore } from "@/store/userStore";

interface Props extends Book {
  userId: string;
}

const BookOverview = async ({
  title,
  author,
  genre,
  rating,
  totalCopies,
  availableCopies,
  description,
  coverColor,
  coverUrl,
  id,
  userId,
}: Props) => {
  const { user, isLoading, error } = useUserStore();

  if (!user) return null;

  const borrowingEligibility = {
    // isEligible: availableCopies > 0 && user.status === "APPROVED",
    isEligible: availableCopies > 0,
    message: availableCopies <= 0 ? "Book is not avaliable" : "You are not an approved user",
  };

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>
          <p>
            Category: <span className="font-semibold text-light-200">{genre}</span>
          </p>
          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" width={22} height={22} alt="star" />
            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books <span>{totalCopies}</span>
          </p>
          <p>
            Available Books <span>{availableCopies}</span>
          </p>
        </div>

        <p className="book-description">{description}</p>

        {/* {user && <BorrowBook bookId={id} userId={userId} borrowingEligibility={borrowingEligibility} />} */}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover variant="wide" className="z-10" coverColor={coverColor} coverUrl={coverUrl} />
          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover variant="wide" coverColor={coverColor} coverUrl={coverUrl} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;
