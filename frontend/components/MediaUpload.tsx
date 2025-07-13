'use client';

import { upload, ImageKitInvalidRequestError, ImageKitAbortError, ImageKitUploadNetworkError, ImageKitServerError, Image, ImageKitProvider } from '@imagekit/next';
import { useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { FormError } from './FormMessage';

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

const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

export const ImageUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>("");
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const handleUpload = async (file: File) => {
    setError("");
    // Check file size (1MB = 1,048,576 bytes)
    const MAX_FILE_SIZE = 1048576;
    if (file.size > MAX_FILE_SIZE) {
      setUploadStatus('File size exceeds 1MB limit');
      return;
    }

    // Fetch auth parameters
    const authResponse = await fetch(`${frontendUrl}/api/auth/imagekit`);
    if (!authResponse.ok) {
      setError('Failed to get upload auth parameters');
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
        folder: '/Uploads',
        onProgress: (event) => {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentage);
          setUploadStatus(`Uploading... ${percentage}%`);
        },
      });

      if (!response.url) {
        setError('Upload succeeded but no URL returned');
        return;
      }

      setUploadStatus('File uploaded successfully!');
      setUploadedImageUrl(response.url);
      setUploadProgress(100);
    } catch (error) {
      setUploadProgress(0);
      if (error instanceof ImageKitInvalidRequestError) {
        setError('Invalid request: ' + error.message);
      } else if (error instanceof ImageKitAbortError) {
        setError('Upload aborted');
      } else if (error instanceof ImageKitUploadNetworkError) {
        setError('Network error during upload');
      } else if (error instanceof ImageKitServerError) {
        setError('Server error: ' + error.message);
      } else {
        setError('Unknown error: ' + (error as Error).message);
      }
    }
  };

  const handleFileChange = () => {
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <FormError message={error} />
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 "
      />
       {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress value={uploadProgress} className="w-full bg-white" />
      )}
      {uploadStatus && <p className="text-sm text-muted-foreground">{uploadStatus}</p>}

      {uploadedImageUrl && (
        <ImageKitProvider urlEndpoint={imageKitEndpoint}>
          <Image
            src={uploadedImageUrl}
            alt="Uploaded Image"
            width={800}
            height={400}
            // transformation={[{ height: '200', width: '200', crop: 'force' }]}
            className="rounded-md"
          />
        </ImageKitProvider>
      )}
    </div>
  );
}