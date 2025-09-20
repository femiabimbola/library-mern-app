"use client";

import {
  upload,
  ImageKitInvalidRequestError,
  ImageKitAbortError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
  Image,
  ImageKitProvider,
} from "@imagekit/next";
import { useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { FormError } from "./FormMessage";

interface UploadResponse {
  url?: string;
  filePath?: string;
}

interface UploadAuthParams {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}

interface MediaUploadProps {
  field: {
    onChange: (value: string) => void;
  };
  folder?: string;
}

const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

export const MediaUpload = ({ field, folder }: MediaUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string>("");
  const [uploadedMediaType, setUploadedMediaType] = useState<"image" | "video" | null>(null);

  const handleUpload = async (file: File, onChange: (value: string) => void) => {
    setError("");

    // Check file size (1MB = 1,048,576 bytes)
    const MAX_FILE_SIZE = 1048576;
    if (file.size > MAX_FILE_SIZE) {
      setUploadStatus("File size exceeds 1MB limit");
      return;
    }

    setUploadedMediaType(file.type.startsWith("video/") ? "video" : "image");

    // Fetch auth parameters
    const authResponse = await fetch(`${frontendUrl}/api/auth/imagekit`);
    if (!authResponse.ok) {
      setError("Failed to get upload auth parameters");
      return;
    }

    const authData: UploadAuthParams = await authResponse.json();

    try {
      const response: UploadResponse = await upload({
        file,
        fileName: file.name,
        signature: authData.signature,
        token: authData.token,
        expire: authData.expire,
        publicKey: authData.publicKey,
        folder: folder || "/Uploads",
        onProgress: (event) => {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentage);
          setUploadStatus(`Uploading... ${percentage}%`);
        },
      });

      if (!response.url) {
        setError("Upload succeeded but no URL returned");
        return;
      }

      setUploadStatus("File uploaded successfully!");
      setUploadedMediaUrl(response.url);
      onChange(response.url);
      setUploadProgress(100);
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

  const handleFileChange = () => {
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      handleUpload(file, field.onChange);
    }
  };

  return (
    <div className="space-y-4">
      <FormError message={error} />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-primary/80 text-white"
      />
      {uploadProgress > 0 && uploadProgress < 100 && <Progress value={uploadProgress} className="w-full bg-white" />}
      {uploadStatus && <p className="text-sm text-white/70">{uploadStatus}</p>}

      {uploadedMediaUrl && (
        <>
          {uploadedMediaType === "image" ? (
            <ImageKitProvider urlEndpoint={imageKitEndpoint}>
              <Image src={uploadedMediaUrl} alt="Uploaded Image" width={800} height={400} className="rounded-md" />
            </ImageKitProvider>
          ) : (
            <video src={uploadedMediaUrl} controls width={800} height={400} className="rounded-md" />
          )}
        </>
      )}
    </div>
  );
};
