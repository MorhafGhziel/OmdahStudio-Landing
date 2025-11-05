"use client";

import { Skeleton } from "./skeleton";

export function WorksSkeleton() {
  return (
    <section
      id="works"
      className="py-16 sm:py-20 md:py-32 bg-black text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] blur-[60px]" />
      </div>

      <div className="w-full relative">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6 md:px-8">
          <Skeleton className="h-6 w-24 mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-12 sm:h-16 md:h-20 w-3/4 max-w-2xl mx-auto mb-3 bg-white/10" />
          <Skeleton className="h-6 w-full max-w-xl mx-auto bg-white/10" />
        </div>

        <div className="mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6 md:px-8">
          <Skeleton className="h-[500px] w-full rounded-2xl bg-white/10" />
        </div>

        <div className="px-4 sm:px-6 md:px-8">
          <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-hidden pb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[400px]"
              >
                <Skeleton className="h-[280px] sm:h-[300px] md:h-[400px] w-full rounded-xl sm:rounded-2xl bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

