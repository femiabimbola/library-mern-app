"use client";

import {
  upload,
  Image,
  ImageKitProvider,
  Video,
  ImageKitInvalidRequestError,
  ImageKitAbortError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { FormError } from "./FormMessage";
import { Button } from "./ui/button";

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

interface UploadResponse {
  url?: string; // Changed to optional to match SDK's response type
  filePath?: string;
}

interface UploadAuthParams {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");


  const handleUpload = async () => {
    setError("");
    if (
      !fileInputRef.current?.files ||
      fileInputRef.current.files.length === 0
    ) {
      setError("Please select a file");
      return;
    }

    const file = fileInputRef.current.files[0];

    const authResponse = await fetch(`${frontendUrl}/api/auth/imagekit`);

    if (!authResponse.ok) {
      setError("Failed to get upload auth parameters");
      return;
    }

    const authData: UploadAuthParams = await authResponse.json();
    console.log(authData);

    try {
      const response: UploadResponse = await upload({
        file,
        fileName: file.name,
        signature: authData.signature,
        token: authData.token,
        expire: authData.expire,
        publicKey: authData.publicKey,
        folder: "/library-uploads",
        onProgress: (event) => {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentage);
          setUploadStatus(`Uploading... ${percentage}%`);
        },
      });
    } catch (error) {
      setUploadProgress(0);
      if (error instanceof ImageKitInvalidRequestError) {
        setError("Invalid request: " + error.message);
      } else if (error instanceof ImageKitAbortError) {
        setError("Upload aborted");
      } else if (error instanceof ImageKitUploadNetworkError) {
        setError("Network error during upload");
      } else if (error instanceof ImageKitServerError) {
        setError("Server error: " + error.message);
      } else {
        setError("Unknown error: " + (error as Error).message);
      }
    }
  };

  return (
    <>
      <FormError message={error} />
      <button onClick={handleUpload} className="upload-btn" type="button">
         <input type="file" ref={fileInputRef} accept="image/*" />
      </button>
      <ImageKitProvider urlEndpoint={imageKitEndpoint}>
       { uploadedImageUrl &&  <Image
          src={uploadedImageUrl}
          alt="Uploaded Image"
          // width={200}
          // height={200}
          transformation={[{ height: '300', width: '500', crop: 'force' }]}
        /> }
     
      </ImageKitProvider>
    </>
  );
};
