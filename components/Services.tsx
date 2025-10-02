"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ServiceType {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
}

const services: ServiceType[] = [
  {
    id: "01",
    title: "حملات ترويجية",
    category: "تسويق",
    description: "تخطيط وتنفيذ حملات تسويقية متكاملة تحقق أهداف عملك",
    icon: "📈",
  },
  {
    id: "02",
    title: "تصوير منتجات",
    category: "تصوير",
    description: "تصوير احترافي يظهر منتجاتك بأفضل شكل ممكن",
    icon: "📸",
  },
  {
    id: "03",
    title: "تغطيات",
    category: "توثيق",
    description: "تغطية شاملة للفعاليات والمناسبات بأعلى جودة",
    icon: "🎥",
  },
  {
    id: "04",
    title: "كتابة محتوى",
    category: "محتوى",
    description: "محتوى إبداعي يعبر عن هوية علامتك التجارية",
    icon: "✍️",
  },
  {
    id: "05",
    title: "تصميم ثلاثي الأبعاد",
    category: "3D",
    description: "تصاميم ثلاثية الأبعاد احترافية تضيف عمقاً لمشروعك",
    icon: "🎨",
  },
  {
    id: "06",
    title: "موشن جرافيك",
    category: "حركة",
    description: "رسوم متحركة تجذب الانتباه وتوصل رسالتك بفعالية",
    icon: "🎬",
  },
];

export function Services() {
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <section
      id="services"
      className="py-16 md:py-20 bg-gradient-to-b from-black to-zinc-900 text-white"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-4"
          >
            <span className="text-sm font-kufam text-white/80">خدماتنا</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-kufam font-bold text-white mb-6"
          >
            ما نقدمه لكم
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/60 max-w-2xl mx-auto"
          >
            حلول إبداعية متكاملة تواكب احتياجاتك وتتجاوز توقعاتك
          </motion.p>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group"
            >
              <ServiceItem
                service={service}
                isActive={activeService === service.id}
                onClick={() =>
                  setActiveService(
                    activeService === service.id ? null : service.id
                  )
                }
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 bg-white text-black font-kufam font-semibold rounded-full hover:bg-white/90 transition-colors duration-300">
            العمدة معك{" "}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

interface ServiceItemProps {
  service: ServiceType;
  isActive: boolean;
  onClick: () => void;
}

function ServiceItem({ service, isActive, onClick }: ServiceItemProps) {
  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-800/50 border border-white/10"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-4xl md:text-5xl">{service.icon}</div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-kufam text-white/50">
                  {service.id}
                </span>
                <span className="px-3 py-1 text-xs font-kufam bg-white/10 rounded-full text-white/80">
                  {service.category}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-kufam font-bold text-white">
                {service.title}
              </h3>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-white/60"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isActive ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-6 border-t border-white/10 mt-6">
            <p className="text-white/70 font-kufam text-lg leading-relaxed">
              {service.description}
            </p>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex gap-2">
                {["جودة عالية", "تسليم سريع", "دعم مستمر"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-kufam bg-white/10 rounded-full text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
