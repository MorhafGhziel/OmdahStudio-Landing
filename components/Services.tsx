"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

interface ServiceType {
  number: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
}

const services: ServiceType[] = [
  {
    number: "01",
    title: "فيديوهات اعلانية",
    description: "إنتاج عالي ومتوسط المستوى يناسب احتياجات مشروعك",
    tags: ["إنتاج عالي", "إنتاج متوسط", "تصوير احترافي"],
    icon: "📹",
  },
  {
    number: "02",
    title: "حملات ترويجية",
    description: "تخطيط وتنفيذ حملات تسويقية متكاملة تحقق أهداف عملك",
    tags: ["استراتيجية تسويق", "إدارة حملات", "تحليل النتائج"],
    icon: "🎯",
  },
  {
    number: "03",
    title: "تصوير منتجات",
    description: "تصوير احترافي يظهر منتجاتك بأفضل شكل ممكن",
    tags: ["تصوير منتجات", "إضاءة احترافية", "معالجة الصور"],
    icon: "📸",
  },
  {
    number: "04",
    title: "تغطيات",
    description: "تغطية شاملة للفعاليات والمناسبات بأعلى جودة",
    tags: ["فعاليات", "مناسبات", "توثيق"],
    icon: "🎥",
  },
  {
    number: "05",
    title: "كتابة محتوى",
    description: "محتوى إبداعي يعبر عن هوية علامتك التجارية",
    tags: ["نصوص إعلانية", "سيناريو", "وصف منتجات"],
    icon: "✍️",
  },
  {
    number: "06",
    title: "تصميم ثلاثي الأبعاد",
    description: "تصاميم 3D احترافية تضيف عمقاً لمشروعك",
    tags: ["نمذجة", "حركة", "واقع افتراضي"],
    icon: "🎨",
  },
  {
    number: "07",
    title: "موشن جرافيك",
    description: "رسوم متحركة تجذب الانتباه وتوصل رسالتك بفعالية",
    tags: ["انيميشن", "مؤثرات بصرية", "فيديو تفاعلي"],
    icon: "✨",
  },
];

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="py-32 bg-white text-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-right"
        >
          <p className="text-sm font-kufam tracking-widest text-black/40 mb-4">
            خدماتنا
          </p>
          <h2 className="text-6xl md:text-8xl font-kufam font-bold tracking-tight">
            ما نقدمه لكم
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.number}
              service={service}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: ServiceType;
  index: number;
  isInView: boolean;
}

function ServiceCard({ service, index, isInView }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const offsetY = (e.clientY - rect.top - rect.height / 2) * 0.2;
    mouseX.set(offsetX);
    mouseY.set(offsetY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer"
    >
      {/* Black Overlay */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative p-10 border border-black/10 group-hover:border-white/20 transition-colors backdrop-blur-[2px]">
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 0.15 : 0.05,
            color: isHovered ? "#fff" : "#000",
          }}
          transition={{ duration: 0.4 }}
          className="text-8xl font-kufam font-bold mb-6"
        >
          {service.number}
        </motion.div>

        <div className="flex items-center justify-end gap-4 mb-6">
          <motion.h3
            animate={{ color: isHovered ? "#fff" : "#000" }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-kufam font-bold"
          >
            {service.title}
          </motion.h3>
          <span className="text-3xl">{service.icon}</span>
        </div>

        <motion.p
          animate={{
            color: isHovered ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          }}
          transition={{ duration: 0.3 }}
          className="mb-8 leading-relaxed font-kufam text-right"
        >
          {service.description}
        </motion.p>

        <div className="flex flex-wrap gap-2 justify-end">
          {service.tags.map((tag, tagIndex) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.4,
                delay: index * 0.15 + tagIndex * 0.05,
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-2 text-sm border font-kufam transition-colors"
              style={{
                borderColor: isHovered
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.2)",
                color: isHovered ? "#fff" : "#000",
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
