"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";

const BookFetcher = async (url: string) => {
  const response = await axios.get(url, { withCredentials: true });
  return response.data.data;
};

const SingleBookPage = ({ params }: { params: { id: string } }) => {
  const bookId = params.id;
  const bookApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`;

  const { data: bookData, isLoading, error: swrFetchError } = useSWR(bookId ? bookApiUrl : null, BookFetcher);

  return <p> {bookApiUrl}</p>;
};

export default SingleBookPage;
