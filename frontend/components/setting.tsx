"use client";

import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/ErrorFallBack";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageKitProvider } from "@imagekit/next";
import { format } from "date-fns";

// Store
import { useUserStore } from "@/store/userStore";

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, LogOut, UserCheck, Building2, CalendarDays } from "lucide-react";

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

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Profile Card - set to flex-1 to stretch and fill available space */}
            <Card className="flex flex-col justify-between flex-1">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4">
                  <Avatar className="h-24 w-24">
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
              <CardContent className="text-sm text-muted-foreground space-y-3 pb-6">
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

            {/* Danger Zone - Moved to Left Column */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Personal Information Card - set to flex-1 to match height of left side if needed */}
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your identification details within the university system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
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

            {/* Bottom Grid: University Card & Role Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* University Card Image */}
              <Card className="overflow-hidden flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-base">University ID Card</CardTitle>
                  <CardDescription>Digital copy of your ID</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-6 flex-1 items-center">
                  <div className="relative w-full aspect-3/2 max-w-70 rounded-xl overflow-hidden border shadow-sm">
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
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-base">Role Configuration</CardTitle>
                  <CardDescription>Manage your permissions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base">Active Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Role: <span className="font-semibold text-primary">{user.role}</span>
                      </p>
                    </div>
                    <Switch checked={isRoleActive} onCheckedChange={setIsRoleActive} />
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                    Note: Role changes require administrative approval.
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Request Role Change
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
