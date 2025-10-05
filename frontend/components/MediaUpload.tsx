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
  mediaType: "image" | "video";
  previewWidth?: number;
  previewHeight?: number;
}

const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

/**
 * Component to handle uploading a single image or video file to ImageKit.
 * The type of media (image or video) is determined by the `mediaType` prop.
 */
export const MediaUpload = ({
  field,
  folder,
  mediaType,
  previewWidth = 800, // Default value if not provided
  previewHeight = 400, // Default value if not provided
}: MediaUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string>("");
  const [uploadedMediaType, setUploadedMediaType] = useState<"image" | "video" | null>(null);

  // --- Configuration based on mediaType ---

  // Max file size in bytes: 5MB for image, 50MB for video (adjust as needed)
  const MAX_FILE_SIZE = mediaType === "video" ? 52428800 : 5242880; // 50MB vs 5MB
  const MAX_FILE_SIZE_MB = mediaType === "video" ? "50MB" : "5MB";

  const acceptedFiles = mediaType === "video" ? "video/*" : "image/*";
  const currentMediaType = mediaType;
  // ------------------------------------------

  const handleUpload = async (file: File, onChange: (value: string) => void) => {
    setError("");

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadStatus(`File size exceeds ${MAX_FILE_SIZE_MB} limit for ${currentMediaType}s.`);
      return;
    }

    // Basic file type validation (though the 'accept' attribute helps)
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (currentMediaType === "image" && !isImage) {
      setUploadStatus("Only image files are allowed.");
      return;
    }

    if (currentMediaType === "video" && !isVideo) {
      setUploadStatus("Only video files are allowed.");
      return;
    }

    setUploadedMediaType(currentMediaType);

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

      setUploadStatus("File uploaded successfully! 🎉");
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
        accept={acceptedFiles}
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-primary/80 text-white"
      />
      {uploadProgress > 0 && uploadProgress < 100 && <Progress value={uploadProgress} className="w-full bg-white" />}
      {uploadStatus && <p className="text-sm text-white/70">{uploadStatus}</p>}

      {/* Media Preview Section - USES new props */}
      {uploadedMediaUrl && (
        <>
          {uploadedMediaType === "image" ? (
            <ImageKitProvider urlEndpoint={imageKitEndpoint}>
              <Image
                src={uploadedMediaUrl}
                alt="Uploaded Media"
                width={previewWidth} // <-- Using the prop
                height={previewHeight} // <-- Using the prop
                className="rounded-md"
              />
            </ImageKitProvider>
          ) : (
            <video
              src={uploadedMediaUrl}
              controls
              width={previewWidth} // <-- Using the prop
              height={previewHeight} // <-- Using the prop
              className="rounded-md"
            />
          )}
        </>
      )}
    </div>
  );
};
