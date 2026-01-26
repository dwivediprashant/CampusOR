import { Skeleton } from "./SkeletonBase";

export function ChartSkeleton() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
                <Skeleton className="h-6 w-[200px]" />
            </div>
            <div className="flex items-end justify-between space-x-2 h-[300px] w-full pt-8">
                {[...Array(12)].map((_, i) => (
                    <Skeleton key={i} className="w-full rounded-t-md" style={{ height: `${((i * 37) % 60) + 20}%` }} />
                ))}
            </div>
        </div>
    );
}
