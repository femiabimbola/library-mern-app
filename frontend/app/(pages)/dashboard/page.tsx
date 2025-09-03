"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

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

export default function Dashboard() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  // const { toast } = useToast();

  useEffect(
    () => {
      const fetchUser = async () => {
        try {
          const response = await fetch("/api/user", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Add authorization header if needed, e.g., Bearer token
              // 'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setUser(data.user);
        } catch (error) {
          // toast({
          //   variant: "destructive",
          //   title: "Error",
          //   description: "Failed to load user data. Please try again.",
          // });
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    },
    [
      // toast
    ]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Unable to load user data.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
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
          <Table>
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
                <TableCell>{new Date(user.lastActivityDate).toLocaleDateString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Account Created</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
