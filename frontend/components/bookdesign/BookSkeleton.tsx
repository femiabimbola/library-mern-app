import { Skeleton } from "@/components/ui/skeleton";

export const BookSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="aspect-[5/6] w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);