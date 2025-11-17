"use client";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/ErrorFallBack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

import { ImageKitProvider } from "@imagekit/next";

import { useRouter } from "next/navigation";
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

const SettingPage = () => {
  const router = useRouter();
  const { user, isLoading, error } = useUserStore();
  const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

  if (!user) {
    return null; // Redirect will handle this
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Additional information about your account</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <ImageKitProvider urlEndpoint={imageKitEndpoint}>
              <Image src={user.universityCard} alt="Uploaded Media" width={42} height={52} className="rounded-md" />
            </ImageKitProvider>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default SettingPage;
