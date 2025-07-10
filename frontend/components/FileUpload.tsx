"use client"

import { Image, Video, ImageKitProvider, upload }  from '@imagekit/next';
import { useRef, useState } from 'react';

const imageKitEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT!

const authenticator = async () => {
  try {
    const  response = await fetch(`${imageKitEndpoint}/api/auth/imagekit`)
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
}

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({ onFileChange }: Props) => {

  const ikUploadRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<{ filePath : string } | null>(null);


  const onSuccess = ( res:any) => {
    setFile(res)
    onFileChange(res.filePath);
  }

  return (
    // <ImageKitProvider
    //   publicKey={publicKey}
    //   urlEndpoint={imageKitEndpoint}
    //   authenticator={authenticator}
    // >
      <div></div>
    // </ImageKitProvider>
  )

}

export default FileUpload;