import { Skeleton } from "./SkeletonBase";

export function ListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[30%] min-w-[100px]" />
                        <Skeleton className="h-3 w-[50%] min-w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>
            ))}
        </div>
    );
}
