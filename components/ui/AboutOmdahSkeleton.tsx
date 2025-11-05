"use client";

import { Skeleton } from "./skeleton";

export function AboutOmdahSkeleton() {
  return (
    <section
      id="about"
      className="relative min-h-[100svh] flex items-center justify-center bg-black text-white overflow-hidden py-16 sm:py-20"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111] to-black" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-[90%] sm:max-w-3xl lg:max-w-5xl mx-auto">
          <div className="text-center">
            <Skeleton className="h-16 sm:h-20 md:h-24 lg:h-28 w-3/4 max-w-2xl mx-auto mb-6 bg-white/10" />
            <Skeleton className="h-8 sm:h-10 md:h-12 w-2/3 max-w-xl mx-auto mb-8 bg-white/10" />
            <Skeleton className="h-12 w-48 mx-auto mb-12 sm:mb-16 rounded-lg bg-white/10" />

            <div className="mt-24 sm:mt-32 md:mt-40">
              <Skeleton className="h-10 sm:h-12 md:h-14 w-48 mx-auto mb-6 bg-white/10" />
              <Skeleton className="h-20 sm:h-24 w-full max-w-2xl mx-auto bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2">
        <Skeleton className="w-6 h-10 rounded-full bg-white/10" />
      </div>
    </section>
  );
}

