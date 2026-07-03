import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PostSkelton = () => {
  return (
     <Card  className="border border-gray-200 dark:border-gray-800 shadow-sm">
          {/* Header */}
          <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>

          {/* Content */}
          <CardContent className="p-4 pt-2 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Image placeholder */}
            <Skeleton className="w-full h-48 rounded-lg" />

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-12 rounded-full" />
                <Skeleton className="h-8 w-12 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>

            {/* Comment input */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="flex-1 h-9 rounded-full" />
            </div>
          </CardContent>
        </Card>
  )
}

export default PostSkelton
