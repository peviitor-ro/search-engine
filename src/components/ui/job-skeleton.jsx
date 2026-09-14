import * as React from "react";
import { cn } from "@/lib/utils";

const JobSkeleton = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "h-full bg-white border border-[#e5e7eb] rounded-xl overflow-hidden flex flex-col md:flex-row md:items-stretch w-full shadow-sm",
        className
      )}
      ref={ref}
      {...props}
    >
      <div className="flex-1 p-5">
        {/* Title & Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="h-5 bg-gray-200 rounded-md w-3/5 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse" />
        </div>

        {/* Company & Location */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="h-4 bg-gray-200 rounded w-2/5 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          </div>
        </div>

        {/* Salary & Date */}
        <div className="flex items-center justify-between gap-3 flex-wrap w-full mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-gray-100 rounded-md animate-pulse" />
          <div className="h-6 w-20 bg-gray-100 rounded-md animate-pulse" />
          <div className="h-6 w-14 bg-gray-100 rounded-md animate-pulse" />
          <div className="h-6 w-24 bg-gray-100 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Action button sidebar */}
      <div className="bg-[#f9fafb] border-t md:border-t-0 md:border-l border-[#f3f4f6] md:px-6 py-3 md:py-0 flex items-center justify-center min-w-[68px]">
        <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
});
JobSkeleton.displayName = "JobSkeleton";

export { JobSkeleton };
export default JobSkeleton;
