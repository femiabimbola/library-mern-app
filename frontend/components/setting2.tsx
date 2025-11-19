"use client";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/ErrorFallBack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageKitProvider } from "@imagekit/next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { User, Mail, University, Calendar, Shield } from "lucide-react";

interface AppUser {
  id: string;
  fullName: string;
  email: string;
  universityId: string;
  universityCard: string;
  role: string; // e.g., "student" | "admin"
  lastActivityDate: string;
  createdAt: string;
}

export const Setting2 = () => {
  const router = useRouter();
  const { user, isLoading, error } = useUserStore();
  const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

  // Simulate role toggle (you'll connect this to your backend/store later)
  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!user || error) {
    router.push("/login");
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto p-6 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card - Left Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <ImageKitProvider urlEndpoint={imageKitEndpoint}>
                  <Avatar className="w-32 h-32 ring-4 ring-background shadow-xl">
                    <AvatarImage src={user.universityCard} alt={user.fullName} className="object-cover" />
                    <AvatarFallback className="text-3xl">
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </ImageKitProvider>

                <div>
                  <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                  <CardDescription className="text-base">{user.email}</CardDescription>
                </div>

                <Badge variant={isAdmin ? "default" : "secondary"} className="px-3 py-1">
                  <Shield className="w-3 h-3 mr-1" />
                  {isAdmin ? "Administrator" : "Student"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <University className="w-4 h-4" />
                <span>{user.universityId}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Main Settings Area */}
          <div className="space-y-8 lg:col-span-2">
            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your personal details and university information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={user.fullName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="universityId">University ID</Label>
                    <Input id="universityId" value={user.universityId} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={isAdmin}
                        onCheckedChange={() => {
                          // TODO: Update role in backend + store
                          alert("Role change would be saved here");
                        }}
                      />
                      <span className="text-sm font-medium">Administrator Mode</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* University Card Preview */}
            {/* <Card>
              <CardHeader>
                <CardTitle>University Card</CardTitle>
                <CardDescription>Your uploaded student ID card</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageKitProvider urlEndpoint={imageKitEndpoint}>
                  <div className="relative rounded-lg overflow-hidden shadow-lg border">
                    <Image
                      src={user.universityCard}
                      alt="University Card"
                      width={800}
                      height={500}
                      className="w-full h-auto object-contain bg-gray-50"
                    />
                  </div>
                </ImageKitProvider>
                <Button variant="outline" className="mt-4 w-full">
                  Change University Card
                </Button>
              </CardContent>
            </Card> */}

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions that affect your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
