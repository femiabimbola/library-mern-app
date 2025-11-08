import ErrorBoundaryAdapter from "./GlobalErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { useCallback, useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useSWRMutation from "swr/mutation";
import axios from "axios";

const getBorrowRecord = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

const BorrowBookRecord = () => {
  const {
    trigger,
    isMutating,
    error: swrError,
  } = useSWRMutation(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/borrow`, getBorrowRecord);

  useEffect(() => {
    trigger();
  });

  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryAdapter}>
      <Card className="my-10">
        <CardHeader>
          <CardTitle className=""> List of all the books</CardTitle>
          <CardDescription> These are the lists of the borrow record </CardDescription>
        </CardHeader>
      </Card>
    </ErrorBoundary>
  );
};

export default BorrowBookRecord;
