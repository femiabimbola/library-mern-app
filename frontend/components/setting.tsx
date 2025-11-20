"use client";

import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/ErrorFallBack";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageKitProvider } from "@imagekit/next";
import { format } from "date-fns"; // Optional: helpful for date formatting

// Store
import { useUserStore } from "@/store/userStore";

// Shadcn UI Components (Ensure these are installed)
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, LogOut, UserCheck, Building2, CalendarDays } from "lucide-react";

// Types
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

export const Setting = () => {
  const router = useRouter();
  const { user, isLoading } = useUserStore();
  const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

  // State for the switch (Visual only for this demo)
  const [isRoleActive, setIsRoleActive] = useState(true);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto max-w-6xl p-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and university credentials.</p>
          </div>
          <Button variant="destructive" size="sm">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Profile Summary */}
          <div className="space-y-6">
            <Card className="lg:col-span-1">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4">
                  <Avatar className="h-24 w-24">
                    {/* Fallback to University Card if no dedicated avatar, or just initials */}
                    <AvatarImage src={user.universityCard} className="object-cover" />
                    <AvatarFallback className="text-lg font-bold">{getInitials(user.fullName)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{user.fullName}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <div className="flex justify-center mt-4">
                  <Badge variant={isRoleActive ? "default" : "secondary"} className="capitalize">
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Member since {format(new Date(user.createdAt), "MMMM yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Last active: {format(new Date(user.lastActivityDate), "MMM dd, HH:mm")}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Details & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your identification details within the university system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={user.fullName} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user.email} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uniId">University ID</Label>
                    <div className="relative">
                      <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="uniId" value={user.universityId} readOnly className="pl-9 bg-muted/50" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* University Card & Role Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* University Card Image */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-base">University ID Card</CardTitle>
                  <CardDescription>Digital copy of your ID</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-6">
                  <div className="relative w-full aspect-[3/2] max-w-[280px] rounded-xl overflow-hidden border shadow-sm">
                    <ImageKitProvider urlEndpoint={imageKitEndpoint}>
                      <Image
                        src={user.universityCard}
                        alt="University Card"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </ImageKitProvider>
                  </div>
                </CardContent>
              </Card>

              {/* Role Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Role Configuration</CardTitle>
                  <CardDescription>Manage your account permissions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Active Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Current Role: <span className="font-semibold text-primary">{user.role}</span>
                      </p>
                    </div>
                    <Switch checked={isRoleActive} onCheckedChange={setIsRoleActive} />
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                    Note: Changing your primary role requires administrative approval.
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Request Role Change
                  </Button>
                </CardFooter>
              </Card>
            </div>

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
