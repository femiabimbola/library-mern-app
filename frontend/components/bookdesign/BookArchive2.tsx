
import {Image, ImageKitProvider } from "@imagekit/next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface BookCoverProps {
  id: string | number;
  title: string;
  author: string;
  uploadedImageUrl: string;
}

const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

export const BookArchive = ({ id, uploadedImageUrl, title, author }: BookCoverProps) => {
  return (
    <Link href={`/books/${id}`} className="block">
      <Card className="group h-full overflow-hidden border-none bg-transparent shadow-none transition-all hover:-translate-y-2">
        <CardContent className="p-0">
          {/* Book Container with 3D shadow effect */}
          {/* <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md shadow-md transition-shadow group-hover:shadow-2xl"> */}
          <div className="relative h-[500px] w-[300px] overflow-hidden rounded-r-lg rounded-l-sm shadow-lg transition-shadow duration-300 group-hover:shadow-2xl">
            <ImageKitProvider urlEndpoint={imageKitEndpoint}>
              <Image
                width={400}
                height={600}
                src={uploadedImageUrl}
                alt={`Book cover for ${title}`}
                transformation={[{ height: "500", width: "300", quality: 80 }]} // SERVER-SIDE RESIZING
                loading="lazy"
                // lqip={{ active: true }} // Low-quality image placeholder while loading
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </ImageKitProvider>
            
            {/* Subtle "Spine" overlay for realism */}
            <div className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-black/20 to-transparent" />
            
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </CardContent>

        <CardHeader className="px-1 py-3">
          <CardTitle 
            className="line-clamp-2 text-base font-bold leading-tight text-slate-900 dark:text-slate-100" 
            title={title}
          >
            {title}
          </CardTitle>
          <CardDescription className="text-sm font-medium text-muted-foreground">
            {author}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};