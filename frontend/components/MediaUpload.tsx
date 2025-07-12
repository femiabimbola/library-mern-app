"use client";

import { upload, Image, ImageKitProvider, Video } from "@imagekit/next";
import { useRef, useState } from "react";
import { FormError } from "./FormMessage";

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

const authenticator = async () => {
  try {
    const response = await fetch(`${frontendUrl}/api/auth/imagekit`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }
    const data = await response.json();
    const { signature, expire, token } = data;
    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

export const MediaUpload = () => {
  const [error, setError] = useState<string | undefined>("");

  const onSuccess = (res: any) => {};
  setError("");

  return (
    <>
      <FormError message={error} />;
      <ImageKitProvider urlEndpoint={imageKitEndpoint}></ImageKitProvider>
    </>
  );
};
