"use client";

import { motion } from "framer-motion";

export function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-12 h-12">
        <motion.div
          className="absolute inset-0 border-4 border-white/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-transparent border-t-white rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
