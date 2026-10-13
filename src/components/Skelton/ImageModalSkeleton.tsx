import { Skeleton } from "@/components/ui/skeleton";

// Loading component
export default function ImageModalSkeleton() {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh]">
        <div className="absolute top-4 right-4 z-10">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="w-full h-[80vh] rounded-lg" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
