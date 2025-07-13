'use client';

import { upload, ImageKitInvalidRequestError, ImageKitAbortError, ImageKitUploadNetworkError, ImageKitServerError, Image, ImageKitProvider } from '@imagekit/next';

import { useState, useRef } from 'react';

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

const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

export const ImageUpload2 = () => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const handleUpload = async () => {
    if (!fileInputRef.current?.files || fileInputRef.current.files.length === 0) {
      setUploadStatus('Please select a file');
      return;
    }

    const file = fileInputRef.current.files[0];

    // Fetch auth parameters
    const authResponse = await fetch(`${frontendUrl}/api/auth/imagekit`);
    if (!authResponse.ok) {
      setUploadStatus('Failed to get upload auth parameters');
      return;
    }
    const authData: UploadAuthParams = await authResponse.json();
    console.log(authData)

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
        setUploadStatus('Upload succeeded but no URL returned');
        return;
      }

      setUploadStatus('File uploaded successfully!');
      setUploadedImageUrl(response.url);
      setUploadProgress(100);
    } catch (error) {
      setUploadProgress(0);
      if (error instanceof ImageKitInvalidRequestError) {
        setUploadStatus('Invalid request: ' + error.message);
      } else if (error instanceof ImageKitAbortError) {
        setUploadStatus('Upload aborted');
      } else if (error instanceof ImageKitUploadNetworkError) {
        setUploadStatus('Network error during upload');
      } else if (error instanceof ImageKitServerError) {
        setUploadStatus('Server error: ' + error.message);
      } else {
        setUploadStatus('Unknown error: ' + (error as Error).message);
      }
    }
  };

  return (
    <div>
      {/* <h2>Upload an Image</h2> */}
      <input type="file" ref={fileInputRef} accept="image/*" />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <progress value={uploadProgress} max="100">{uploadProgress}%</progress>
      )}
      {uploadedImageUrl && (
        <ImageKitProvider urlEndpoint={imageKitEndpoint}>
        <Image
          src={uploadedImageUrl}
          alt="Uploaded Image"
          width={200}
          height={200}
          transformation={[{ height: '200', width: '200', crop: 'force' }]}
        />
      </ImageKitProvider>
      )}
    </div>
  );
}