"use client";

import { Skeleton } from "./skeleton";

export function ContactSkeleton() {
  return (
    <section
      id="contact"
      className="py-16 sm:py-20 md:py-24 bg-black text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111] to-black" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          <Skeleton className="h-6 w-32 mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-12 sm:h-16 md:h-20 w-3/4 max-w-2xl mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-white/10" />
        </div>

        <div className="max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-lg bg-white/10" />
            <Skeleton className="h-12 w-full rounded-lg bg-white/10" />
            <Skeleton className="h-32 w-full rounded-lg bg-white/10" />
            <Skeleton className="h-12 w-full rounded-lg bg-white/10" />
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-3xl mx-auto">
            <Skeleton className="h-32 rounded-2xl bg-white/10" />
            <Skeleton className="h-32 rounded-2xl bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

