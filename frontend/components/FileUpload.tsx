"use client"

// import { IKImage, IKVideo, ImageKitProvider, IKUpload } from "imagekitio-next";
import { Image, ImageKitProvider } from '@imagekit/next';

const imageKitEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT!

const authenticator = async () => {
  try {
    const  response = await fetch(`${imageKitEndpoint}/api/auth/imagekit`)
  } catch (error) {
    
  }
}

const FileUpload = () => {
  return (
    <div> The file upload</div>
  )
}

export default FileUpload;