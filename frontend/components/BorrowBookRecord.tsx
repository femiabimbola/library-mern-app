"use client";

import ErrorBoundaryAdapter from "./GlobalErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import useSWR from "swr";
import axios from "axios";
import { format } from "date-fns";

// --- Type Definition ---
type BorrowRecord = {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
  createdAt: string;
  bookTitle?: string;
};

// --- Fetcher ---
const fetcher = async (url: string): Promise<BorrowRecord[]> => {
  const { data } = await axios.get<{
    success: boolean;
    data: BorrowRecord[];
    count: number;
  }>(url);

  // Only return the array inside `data`
  if (data.success && Array.isArray(data.data)) {
    return data.data;
  }

  // Fallback
  return [];
};

const BorrowBookRecord = () => {
  const {
    data: records = [],
    error,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/borrow`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
  });

  // --- Helper: Format Date ---
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "d MMM, yyyy");
    } catch {
      return dateStr.split("T")[0];
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Loading borrow history...</span>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load borrow history</AlertTitle>
        <AlertDescription>
          {(error as any)?.response?.data?.message || error?.message || "Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  // --- Empty State ---
  if (records.length === 0) {
    return (
      <Card className="my-10">
        <CardHeader>
          <CardTitle>Book Borrowing History</CardTitle>
          <CardDescription>No borrow records found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // --- Main Render ---
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryAdapter}>
      <Card className="my-10">
        <CardHeader>
          <CardTitle>Book Borrowing History</CardTitle>
          <CardDescription>All books borrowed, with due dates and return status.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Borrowed</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Returned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "RETURNED"
                            ? "default"
                            : record.status === "OVERDUE"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.bookTitle ?? `Book #${record.bookId.slice(0, 8)}`}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{record.userId.slice(0, 8)}</TableCell>
                    <TableCell>{formatDate(record.borrowDate)}</TableCell>
                    <TableCell>{formatDate(record.dueDate)}</TableCell>
                    <TableCell>{record.returnDate ? formatDate(record.returnDate) : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default BorrowBookRecord;
