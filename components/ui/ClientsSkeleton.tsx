"use client";

import { Skeleton } from "./skeleton";

export function ClientsSkeleton() {
  return (
    <section
      id="clients"
      className="py-8 sm:py-12 md:py-16 bg-black text-white"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <Skeleton className="h-10 sm:h-12 md:h-16 w-48 mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-white/10" />
        </div>

        <div className="space-y-8 sm:space-y-12 md:space-y-16 overflow-hidden">
          <div className="relative h-28 sm:h-32 md:h-36 lg:h-40">
            <div className="flex gap-4 sm:gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-28 sm:h-32 md:h-36 lg:h-40 w-40 sm:w-48 md:w-56 lg:w-64 rounded-lg sm:rounded-xl bg-white/10 flex-shrink-0"
                />
              ))}
            </div>
          </div>

          <div className="relative h-28 sm:h-32 md:h-36 lg:h-40">
            <div className="flex gap-4 sm:gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-28 sm:h-32 md:h-36 lg:h-40 w-40 sm:w-48 md:w-56 lg:w-64 rounded-lg sm:rounded-xl bg-white/10 flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

