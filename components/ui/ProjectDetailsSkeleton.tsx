"use client";

import { Skeleton } from "./skeleton";

export function ProjectDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex flex-col pt-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/10 via-neutral-600/5 to-neutral-900/10" />
      </div>

      <div className="py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <Skeleton className="h-[50vh] w-full rounded-2xl bg-white/10 mb-12" />

          <div className="mt-12 space-y-8 px-8">
            <div className="text-center">
              <Skeleton className="h-8 w-48 mx-auto mb-6 bg-white/10" />
              <Skeleton className="h-24 w-full max-w-2xl mx-auto bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 bg-white/10" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full bg-white/10" />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-32 bg-white/10" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full bg-white/10" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

