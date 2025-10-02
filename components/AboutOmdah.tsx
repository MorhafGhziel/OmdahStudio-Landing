"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AboutOmdah() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Modern Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glowing Orbs */}
        {mounted && (
          <>
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full bg-white/5 blur-[100px]"
              animate={{
                x: ["-25%", "25%"],
                y: ["-25%", "25%"],
              }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{
                left: "20%",
                top: "20%",
              }}
            />
            <motion.div
              className="absolute w-[300px] h-[300px] rounded-full bg-white/5 blur-[80px]"
              animate={{
                x: ["25%", "-25%"],
                y: ["25%", "-25%"],
              }}
              transition={{
                duration: 12,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{
                right: "20%",
                bottom: "20%",
              }}
            />
          </>
        )}

        {/* Geometric Lines */}
        {mounted && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-white/10"
                style={{
                  width: 200 + i * 200,
                  height: 200 + i * 200,
                  left: "50%",
                  top: "50%",
                  x: "-50%",
                  y: "-50%",
                  rotate: i * 15,
                }}
                animate={{
                  rotate: [i * 15, i * 15 + 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 20 + i * 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}
          </>
        )}

        {/* Floating Particles */}
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Title */}
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-8 font-kufam"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            معك عُمدة
          </motion.h1>

          {/* Tagline with Gradient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-2xl md:text-3xl font-kufam mb-8 text-white"
          >
            ما يعتمد عليه مشروعك
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed font-kufam"
            dir="rtl"
          >
            شركة سعودية، نشتغل على المحتوى المرئي. نشتغل ببساطة، والبساطة هي
            قوتنا.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="flex justify-center"
          >
            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-white text-black font-kufam text-xl hover:bg-white/90 transition-all"
            >
              اكتشف خدماتنا
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <motion.span
          className="text-xs tracking-widest text-white/70 font-kufam"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          اسحب للأسفل
        </motion.span>

        <div className="relative w-6 h-10 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-1 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2"
            animate={{
              y: [0, 28, 0],
              opacity: [0, 1, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.div
          className="absolute -z-10 w-20 h-20 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.section>
  );
}
