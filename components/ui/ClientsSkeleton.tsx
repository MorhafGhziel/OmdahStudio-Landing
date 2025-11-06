"use client";

import { Skeleton } from "./skeleton";

export function ClientsSkeleton() {
  return (
    <section
      id="clients"
      className="py-16 sm:py-20 md:py-32 bg-black text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)] blur-[60px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <Skeleton className="h-6 w-24 mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-12 sm:h-16 md:h-20 w-3/4 max-w-2xl mx-auto mb-3 bg-white/10" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-white/10" />
        </div>

        <div className="space-y-10 sm:space-y-12 md:space-y-16 overflow-hidden">
          <div className="relative h-32 sm:h-36 md:h-40 lg:h-44">
            <div className="flex gap-4 sm:gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-32 sm:h-36 md:h-40 lg:h-44 w-44 sm:w-52 md:w-60 lg:w-72 rounded-xl sm:rounded-2xl bg-white/10 flex-shrink-0"
                />
              ))}
            </div>
          </div>

          <div className="relative h-32 sm:h-36 md:h-40 lg:h-44">
            <div className="flex gap-4 sm:gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-32 sm:h-36 md:h-40 lg:h-44 w-44 sm:w-52 md:w-60 lg:w-72 rounded-xl sm:rounded-2xl bg-white/10 flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

