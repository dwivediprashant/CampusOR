import { Skeleton } from "./SkeletonBase";

export function StatSkeleton() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
            </div>
            <div className="mt-2 text-2xl font-bold">
                <Skeleton className="h-8 w-[60px]" />
            </div>
            <div className="mt-1">
                <Skeleton className="h-3 w-[120px]" />
            </div>
        </div>
    );
}
