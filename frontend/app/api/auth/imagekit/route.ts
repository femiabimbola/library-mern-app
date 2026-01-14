
import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_URL_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_URL_PUBLIC_KEY as string,
    });
    return NextResponse.json({ token, expire, signature, publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_URL_PUBLIC_KEY });
  } catch (error) {
    console.error('Error generating auth parameters:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth parameters' },
      { status: 500 }
    );
  }
}