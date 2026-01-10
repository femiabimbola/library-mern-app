import { ImageKitProvider } from "@imagekit/next";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface BookCoverProps {
  id: string | number;
  title: string;
  author: string;
  uploadedImageUrl: string;
  coverColor?: string;
}


const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

export const SingleBookCard = ({ id, uploadedImageUrl, title, author, coverColor = "#012B48" }: BookCoverProps) => {
  return (
    <Link href={`/books/${id}`}>
      <ImageKitProvider urlEndpoint={imageKitEndpoint}>
        <Image src={uploadedImageUrl} alt="Uploaded Media" width={250} height={300} className="rounded-md" />
      </ImageKitProvider>
      <p className="book-title ">{title}</p>
      <p className="book-genre ">{author}</p>
    </Link>
  );
};

// Assuming Image is from 'imagekitio-react' based on your provider

export const SingleBookCard2 = ({ id, uploadedImageUrl, title, author }: BookCoverProps) => {
  return (
    <Link href={`/books/${id}`} passHref>
      <Card className="group h-full overflow-hidden rounded-lg transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <CardContent className="p-0">
          <div className=" relative aspect-[5/6] w-full overflow-hidden">
            <ImageKitProvider urlEndpoint={imageKitEndpoint}>
              <Image
                src={uploadedImageUrl}
                alt={`Book cover for ${title}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                fill={true}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </ImageKitProvider>
          </div>
        </CardContent>
        <CardHeader className="p-4">
          <CardTitle className="truncate text-lg font-semibold" title={title}>
            {title}
          </CardTitle>
          <CardDescription>{author}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export const SingleBookCard3 = ({ id, uploadedImageUrl, title, author, coverColor = "#012B48" }: BookCoverProps) => {
  return (
    <Link href={`/books/${id}`} className="block">
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-none">
        <CardContent className="p-0">
          <ImageKitProvider urlEndpoint={imageKitEndpoint}>
            <Image src={uploadedImageUrl} alt={title} width={250} height={300} className="w-full h-auto object-cover" />
          </ImageKitProvider>
        </CardContent>
        <CardHeader style={{ backgroundColor: coverColor }} className="text-white py-4">
          <CardTitle className="text-lg font-semibold truncate">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-300">{author}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
