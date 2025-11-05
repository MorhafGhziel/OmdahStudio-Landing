"use client";

import { Skeleton } from "./skeleton";

export function ServicesSkeleton() {
  return (
    <section
      id="services"
      className="py-16 sm:py-20 md:py-32 bg-black text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] blur-[60px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <Skeleton className="h-6 w-24 mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-12 sm:h-16 md:h-20 w-3/4 max-w-2xl mx-auto mb-3 bg-white/10" />
          <Skeleton className="h-6 w-full max-w-xl mx-auto bg-white/10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative">
              <Skeleton className="h-[300px] sm:h-[350px] w-full rounded-xl bg-white/10" />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Skeleton className="h-12 w-48 mx-auto rounded-full bg-white/10" />
        </div>
      </div>
    </section>
  );
}

