"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AboutOmdah() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={
            !isMobile
              ? {
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }
              : {}
          }
          transition={
            !isMobile
              ? {
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "linear",
                }
              : {}
          }
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: isMobile ? "30px 30px" : "60px 60px",
          }}
        />

        {mounted && (
          <>
            <div
              className={`absolute rounded-full bg-white/5 ${
                isMobile
                  ? "w-[250px] h-[250px] blur-[50px]"
                  : "w-[500px] h-[500px] blur-[100px]"
              }`}
              style={{
                left: isMobile ? "10%" : "20%",
                top: isMobile ? "10%" : "20%",
              }}
            />
            <div
              className={`absolute rounded-full bg-white/5 ${
                isMobile
                  ? "w-[150px] h-[150px] blur-[40px]"
                  : "w-[300px] h-[300px] blur-[80px]"
              }`}
              style={{
                right: isMobile ? "10%" : "20%",
                bottom: isMobile ? "10%" : "20%",
              }}
            />
          </>
        )}

        {mounted && (
          <>
            {!isMobile &&
              [...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute border border-white/10"
                  style={{
                    width: 300 + i * 200,
                    height: 300 + i * 200,
                    left: "50%",
                    top: "50%",
                    x: "-50%",
                    y: "-50%",
                    rotate: i * 15,
                  }}
                  animate={{
                    rotate: [i * 15, i * 15 + 360],
                  }}
                  transition={{
                    duration: 30,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              ))}
          </>
        )}

        {mounted && (
          <div className="absolute inset-0">
            {[...Array(isMobile ? 4 : 8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20"
                style={{
                  left: `${15 + i * (isMobile ? 20 : 10)}%`,
                  top: `${20 + (i % 3) * 15}%`,
                }}
                animate={
                  !isMobile
                    ? {
                        opacity: [0.2, 0.5, 0.2],
                      }
                    : {}
                }
                transition={
                  !isMobile
                    ? {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                        ease: "linear",
                      }
                    : {}
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-8 font-ibm-plex-sans-arabic"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            معك عُمدة
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-2xl md:text-3xl font-ibm-plex-sans-arabic mb-8 text-white"
          >
            ما يعتمد عليه مشروعك
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed font-ibm-plex-sans-arabic"
            dir="rtl"
          >
            شركة سعودية، نشتغل على المحتوى المرئي. نشتغل ببساطة، والبساطة هي
            قوتنا.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={() => {
                const servicesSection = document.getElementById("services");
                if (servicesSection) {
                  servicesSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-white text-black font-ibm-plex-sans-arabic text-xl hover:bg-white/90 transition-all cursor-pointer"
            >
              اكتشف خدماتنا
            </motion.button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        className="absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        {!isMobile && (
          <>
            <motion.div
              className="relative"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <span className="text-xs font-ibm-plex-sans-arabic text-white/80 tracking-[0.2em] uppercase">
                Scroll
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </motion.div>

            <div className="relative w-6 h-10 border border-white/40 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-white/5" />

              <motion.div
                className="absolute top-1 left-1/2 w-1 h-3 bg-white rounded-full -translate-x-1/2"
                animate={{
                  y: [0, 20, 0],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-white/40 rounded-full"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.section>
  );
}
