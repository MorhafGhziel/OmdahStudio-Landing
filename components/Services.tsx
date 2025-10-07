"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ServiceType {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
}

const services: ServiceType[] = [
  {
    id: "01",
    title: "حملات ترويجية",
    category: "تسويق",
    description:
      "تخطيط وتنفيذ حملات تسويقية متكاملة تحقق أهداف عملك. نقدم استراتيجيات مبتكرة تضمن وصول رسالتك للجمهور المستهدف.",
    features: ["تحليل السوق", "استراتيجية متكاملة", "متابعة النتائج"],
  },
  {
    id: "02",
    title: "تصوير منتجات",
    category: "تصوير",
    description:
      "تصوير احترافي يظهر منتجاتك بأفضل شكل ممكن. نستخدم أحدث التقنيات والمعدات لإبراز جمال وتفاصيل منتجاتك.",
    features: ["إضاءة احترافية", "خلفيات متنوعة", "تعديل متقن"],
  },
  {
    id: "03",
    title: "تغطيات",
    category: "توثيق",
    description:
      "تغطية شاملة للفعاليات والمناسبات بأعلى جودة. نوثق كل لحظة مهمة بعناية فائقة لنقل الأجواء بشكل مميز.",
    features: ["تصوير فوري", "مونتاج احترافي", "تسليم سريع"],
  },
  {
    id: "04",
    title: "كتابة محتوى",
    category: "محتوى",
    description:
      "محتوى إبداعي يعبر عن هوية علامتك التجارية. نكتب بأسلوب جذاب يناسب جمهورك ويحقق أهدافك التسويقية.",
    features: ["بحث شامل", "محتوى مميز", "تحسين SEO"],
  },
  {
    id: "05",
    title: "تصميم ثلاثي الأبعاد",
    category: "3D",
    description:
      "تصاميم ثلاثية الأبعاد احترافية تضيف عمقاً لمشروعك. نقدم تصورات واقعية تساعد في تسويق منتجاتك بشكل مبتكر.",
    features: ["نمذجة احترافية", "إضاءة واقعية", "حركة سلسة"],
  },
  {
    id: "06",
    title: "موشن جرافيك",
    category: "حركة",
    description:
      "رسوم متحركة تجذب الانتباه وتوصل رسالتك بفعالية. نصمم حركات سلسة وجذابة تجعل محتواك أكثر تفاعلاً.",
    features: ["تصميم مخصص", "حركات سلسة", "صوت احترافي"],
  },
  {
    id: "07",
    title: "وثائقيات",
    category: "توثيق",
    description:
      "إنتاج أفلام وثائقية احترافية تحكي قصصك بطريقة مؤثرة. نقدم رواية بصرية قوية تترك أثراً عميقاً في المشاهد.",
    features: ["سرد احترافي", "تصوير متقن", "مونتاج متطور"],
  },
  {
    id: "08",
    title: "سكتشات",
    category: "إبداع",
    description:
      "تصاميم سكتشات إبداعية تعبر عن أفكارك بطرق مبتكرة. نقدم تصورات فنية تساعد في تطوير مشاريعك الإبداعية.",
    features: ["تصميم فني", "أفكار مبتكرة", "تنفيذ احترافي"],
  },
  {
    id: "09",
    title: "فويس أوفر",
    category: "صوت",
    description:
      "تسجيل صوتي احترافي لجميع أنواع المحتوى. نقدم خدمات تعليق صوتي عالية الجودة تناسب احتياجاتك التسويقية.",
    features: ["تسجيل احترافي", "أصوات متنوعة", "جودة عالية"],
  },
];

export function Services() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <section
      id="services"
      className="py-16 sm:py-20 md:py-32 bg-black text-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Center glowing circle */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] sm:w-[120vw] md:w-[1200px] h-[140vw] sm:h-[120vw] md:h-[1200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] blur-[60px]" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] blur-[80px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] bg-center" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-ibm-plex-sans-arabic text-white/90">
              خدماتنا
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-ibm-plex-sans-arabic font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 text-white"
          >
            ما نقدمه لكم
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-white/60 max-w-[90%] sm:max-w-2xl mx-auto font-ibm-plex-sans-arabic"
          >
            حلول إبداعية متكاملة تواكب احتياجاتك وتتجاوز توقعاتك
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              onClick={() =>
                setSelectedService(
                  selectedService === service.id ? null : service.id
                )
              }
            >
              <div
                className={`
                group/card relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm
                border border-white/10 h-full
                transition-all duration-500 ease-out
                ${hoveredService === service.id ? "bg-white/10" : "bg-white/5"}
                ${selectedService === service.id ? "bg-white/15" : ""}
                hover:border-white/20 hover:scale-[1.02]
                hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]
                sm:hover:shadow-[0_0_35px_-5px_rgba(255,255,255,0.15)]
                md:hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.2)]
                hover:bg-gradient-to-b hover:from-white/10 hover:to-transparent
                before:absolute before:inset-[1px] before:rounded-xl before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500
                hover:before:opacity-100
              `}
              >
                {/* Service Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-5 md:mb-6">
                  <div>
                    <span className="inline-block px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-ibm-plex-sans-arabic bg-white/10 rounded-full text-white/80 mb-2 sm:mb-3">
                      {service.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-ibm-plex-sans-arabic font-bold text-white">
                      {service.title}
                    </h3>
                  </div>
                  <span className="text-sm sm:text-base text-white/50 font-ibm-plex-sans-arabic">
                    {service.id}
                  </span>
                </div>

                {/* Service Description */}
                <p className="text-white/70 font-ibm-plex-sans-arabic text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6 line-clamp-3">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-ibm-plex-sans-arabic bg-white/5 rounded-full text-white/60"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Hover Effect */}
                {/* Card shine effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,white,transparent_70%)] opacity-[0.02]" />
                  <div className="absolute h-[500px] w-64 bg-white/[0.02] -translate-x-[100px] rotate-[-45deg] group-hover/card:translate-x-[400px] transition-transform duration-1000 ease-in-out" />
                </div>

                {/* Border glow */}
                <div className="absolute -inset-[1px] rounded-2xl bg-white/[0.03] blur-sm transition-opacity duration-500 opacity-0 group-hover/card:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button
            className="
            px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-ibm-plex-sans-arabic font-semibold rounded-full
            bg-white text-black
            hover:bg-white/90
            transition-all duration-300 transform hover:scale-105
            shadow-lg hover:shadow-xl
            active:scale-95
          "
          >
            تواصل معنا الآن
          </button>
        </motion.div>
      </div>
    </section>
  );
}
