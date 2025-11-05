"use client";

import { Skeleton } from "./skeleton";

export function FooterSkeleton() {
  return (
    <footer className="w-full bg-[#0a0a0a] text-white py-8 sm:py-12 border-t border-gray-400/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <Skeleton className="h-8 w-32 mb-4 bg-white/10" />
            <Skeleton className="h-4 w-48 bg-white/10" />
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 sm:gap-4 w-full md:w-auto">
            <Skeleton className="h-6 w-32 bg-white/10 mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
              <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
            </div>
            <Skeleton className="h-5 w-40 bg-white/10" />
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-800">
          <Skeleton className="h-4 w-64 mx-auto bg-white/10" />
        </div>
      </div>
    </footer>
  );
}

