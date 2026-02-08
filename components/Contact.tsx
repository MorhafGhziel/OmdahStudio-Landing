"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Contact() {
  return (
    <section
      id="contact"
      className="py-24 sm:py-32 md:py-40 bg-black text-white relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111] to-black" />
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-[30vw] sm:w-[20vw] aspect-square rounded-full bg-gradient-radial from-white/[0.08] to-transparent blur-[80px]"
            initial={{ x: "10%", y: "20%" }}
            animate={{
              x: ["10%", "12%", "10%"],
              y: ["20%", "22%", "20%"],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[25vw] sm:w-[15vw] aspect-square rounded-full bg-gradient-radial from-white/[0.05] to-transparent blur-[60px]"
            initial={{ x: "70%", y: "70%" }}
            animate={{
              x: ["70%", "68%", "70%"],
              y: ["70%", "68%", "70%"],
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Big bold heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-ibm-plex-sans-arabic font-bold leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              عندك فكرة؟
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl text-white/40 font-ibm-plex-sans-arabic"
          >
            خلنا نحولها لواقع
          </motion.p>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-10 sm:mt-14 mb-10 sm:mb-14 h-px w-40 sm:w-56 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          {/* WhatsApp Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Link
              href="https://wa.me/966558960098"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-4 px-10 sm:px-14 py-5 sm:py-6 rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/10 hover:border-white/25 hover:bg-white/[0.12] cursor-pointer transition-all duration-500"
              >
                {/* WhatsApp icon inline */}
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#25D366] transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>

                <span className="font-ibm-plex-sans-arabic text-xl sm:text-2xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
                  راسلنا الحين
                </span>

                <svg
                  className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-all duration-300 group-hover:-translate-x-1 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
