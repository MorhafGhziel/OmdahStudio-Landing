"use client";

import { motion } from "framer-motion";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section
      id="contact"
      className="py-16 sm:py-20 md:py-24 bg-black text-white relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111] to-black" />

        {/* Glowing orbs */}
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

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm text-sm sm:text-base font-ibm-plex-sans-arabic text-white/90 border border-white/20">
              تواصل معنا
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-ibm-plex-sans-arabic font-bold mt-6 sm:mt-8 mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80 pb-4"
          >
            التواصل
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-[90%] sm:max-w-3xl mx-auto font-ibm-plex-sans-arabic leading-relaxed"
          >
            لنبدأ مشروعك معاً. نحن هنا لمساعدتك في إنجاز رؤيتك الإبداعية
          </motion.p>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-3xl mx-auto">
            {/* Email */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 sm:p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-ibm-plex-sans-arabic text-white/90 mb-3 font-semibold">
                البريد الإلكتروني
              </h3>
              <p className="text-white/70 font-ibm-plex-sans-arabic text-lg">
                info@omdah.sa
              </p>
            </motion.div>

            {/* Response Time */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 sm:p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-ibm-plex-sans-arabic text-white/90 mb-3 font-semibold">
                وقت الرد
              </h3>
              <p className="text-white/70 font-ibm-plex-sans-arabic text-lg">
                خلال 24 ساعة
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
