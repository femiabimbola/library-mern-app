"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import useSWR from "swr";
import { format } from "date-fns";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/userStore";

interface AppUser {
  id: string;
  fullName: string;
  email: string;
  universityId: string;
  universityCard: string;
  role: string;
  lastActivityDate: string;
  createdAt: string;
}

interface UserResponse {
  user: AppUser;
}

// Error fallback component
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="p-4">
        <CardTitle className="text-red-500">Something went wrong</CardTitle>
        <CardDescription>{error.message}</CardDescription>
      </Card>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, error } = useUserStore();

  useEffect(() => {
    if (error) {
      toast.error("Authentication Error", {
        description: "Please log in to access the dashboard.",
        duration: 3000,
      });
      setTimeout(() => router.push("/auth/login"), 3000); // Delay redirect for toast visibility
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will handle this
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto p-4 space-y-6">
        <Toaster richColors />
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Avatar className="h-16 w-16" aria-label={`Avatar of ${user.fullName}`}>
              <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}`} alt={user.fullName} />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.fullName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant={user.role === "admin" ? "default" : "secondary"} className="mt-2">
                {user.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* User Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Additional information about your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Table aria-label="User account details">
              <TableHeader>
                <TableRow>
                  <TableHead>Attribute</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">User ID</TableCell>
                  <TableCell>{user.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">University ID</TableCell>
                  <TableCell>{user.universityId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">University Card</TableCell>
                  <TableCell>{user.universityCard}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Last Activity</TableCell>
                  <TableCell>{format(new Date(user.lastActivityDate), "PPP")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Account Created</TableCell>
                  <TableCell>{format(new Date(user.createdAt), "PPP")}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
