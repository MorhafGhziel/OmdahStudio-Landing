"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AboutOmdah() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.section
      id="about"
      className="relative min-h-[100svh] flex items-center justify-center bg-black text-white overflow-hidden py-16 sm:py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111] to-black" />

        {/* Glowing orbs */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-[40vw] sm:w-[25vw] aspect-square rounded-full bg-gradient-radial from-white/[0.15] to-transparent blur-[100px]"
            initial={{ x: "20%", y: "30%" }}
            animate={{
              x: ["20%", "22%", "20%"],
              y: ["30%", "32%", "30%"],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[35vw] sm:w-[20vw] aspect-square rounded-full bg-gradient-radial from-white/[0.1] to-transparent blur-[80px]"
            initial={{ x: "60%", y: "60%" }}
            animate={{
              x: ["60%", "58%", "60%"],
              y: ["60%", "58%", "60%"],
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Animated lines */}
        <div className="absolute inset-0">
          {mounted &&
            [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{
                  top: `${30 + i * 20}%`,
                  left: 0,
                  right: 0,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scaleX: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1,
                }}
              />
            ))}
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-[90%] sm:max-w-3xl lg:max-w-5xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Main Title */}
            <motion.div
              className="relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="absolute -inset-2 sm:-inset-4 rounded-lg bg-white/[0.02] blur-sm"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-ibm-plex-sans-arabic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80 leading-[1.3] pt-2 pb-1">
                معك عُمدة
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl md:text-3xl font-ibm-plex-sans-arabic text-white/90"
            >
              ما يعتمد عليه مشروعك
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-ibm-plex-sans-arabic"
              dir="rtl"
            >
              شركة سعودية، نشتغل على المحتوى المرئي. نشتغل ببساطة، والبساطة هي
              قوتنا.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="pt-4 sm:pt-6"
            >
              <motion.button
                onClick={() => {
                  const servicesSection = document.getElementById("contact");
                  if (servicesSection) {
                    servicesSection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                }}
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer px-8 sm:px-12 py-3 sm:py-4 bg-white text-black font-ibm-plex-sans-arabic text-lg sm:text-xl rounded-lg sm:rounded-xl overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
                <span className="relative">اكتشف خدماتنا</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3"
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-5 sm:w-6 h-8 sm:h-10 border border-white/20 rounded-full p-1.5"
        >
          <motion.div
            className="w-full h-2 bg-white/40 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
