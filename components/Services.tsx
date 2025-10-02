"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

interface ServiceType {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

const services: ServiceType[] = [
  {
    id: "01",
    title: "حملات ترويجية",
    category: "تسويق",
    description: "تخطيط وتنفيذ حملات تسويقية متكاملة تحقق أهداف عملك",
    image: "/images/Service1.png",
  },
  {
    id: "02",
    title: "تصوير منتجات",
    category: "تصوير",
    description: "تصوير احترافي يظهر منتجاتك بأفضل شكل ممكن",
    image: "/images/Service1.png",
  },
  {
    id: "03",
    title: "تغطيات",
    category: "توثيق",
    description: "تغطية شاملة للفعاليات والمناسبات بأعلى جودة",
    image: "/images/Service1.png",
  },
  {
    id: "04",
    title: "كتابة محتوى",
    category: "محتوى",
    description: "محتوى إبداعي يعبر عن هوية علامتك التجارية",
    image: "/images/Service1.png",
  },
  {
    id: "05",
    title: "تصميم ثلاثي الأبعاد",
    category: "3D",
    description: "تصاميم ثلاثية الأبعاد احترافية تضيف عمقاً لمشروعك",
    image: "/images/Service1.png",
  },
  {
    id: "06",
    title: "موشن جرافيك",
    category: "حركة",
    description: "رسوم متحركة تجذب الانتباه وتوصل رسالتك بفعالية",
    image: "/images/Service1.png",
  },
];

// Group services into pairs
// Group services into rows with different layouts
const serviceRows = services.reduce<
  { services: ServiceType[]; layout: "standard" | "featured" | "split" }[]
>((acc, service, index) => {
  const rowIndex = Math.floor(index / 2);
  if (index % 2 === 0) {
    // Start a new row
    acc.push({
      services: [service],
      // Alternate between different layout types
      layout:
        rowIndex === 0 ? "featured" : rowIndex === 1 ? "split" : "standard",
    });
  } else {
    // Add to existing row
    acc[acc.length - 1].services.push(service);
  }
  return acc;
}, []);

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="services"
      ref={ref}
      className="py-32 bg-black text-black min-h-screen"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-right"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-kufam tracking-widest text-black/40 mb-4"
          >
            خدماتنا
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-8xl font-kufam font-bold text-white"
          >
            ما نقدمه لكم
          </motion.h2>
        </motion.div>

        <div className="space-y-12">
          {/* Mobile View */}
          <div className="md:hidden space-y-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="relative w-full"
                style={{ height: 400 }}
              >
                <ServiceCard
                  service={service}
                  isHovered={true}
                  onHover={() => {}}
                  onLeave={() => {}}
                  isInView={isInView}
                  index={index}
                  layout="standard"
                />
              </motion.div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block space-y-12">
            {serviceRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-8">
                {row.services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    className="relative"
                    animate={{
                      width:
                        hoveredId === service.id
                          ? "55%"
                          : hoveredId === row.services[index === 0 ? 1 : 0]?.id
                          ? "45%"
                          : row.layout === "featured"
                          ? index === 0
                            ? "60%"
                            : "40%"
                          : row.layout === "split"
                          ? index === 0
                            ? "65%"
                            : "35%"
                          : index === 0
                          ? "55%"
                          : "45%",
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      height: 600,
                    }}
                  >
                    <ServiceCard
                      service={service}
                      isHovered={hoveredId === service.id}
                      onHover={() => setHoveredId(service.id)}
                      onLeave={() => setHoveredId(null)}
                      isInView={isInView}
                      index={rowIndex * 2 + index}
                      layout={row.layout}
                    />
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: ServiceType;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  isInView: boolean;
  index: number;
  layout: "standard" | "featured" | "split";
}

function ServiceCard({
  service,
  isHovered,
  onHover,
  onLeave,
  index,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative group cursor-pointer overflow-hidden rounded-xl w-full h-full border-1 border-white/30"
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-all duration-700"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        {/* Content Container */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="max-w-[90%] mb-4">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.4 }}
              className="text-sm font-kufam text-white/80 mb-2"
            >
              {service.category}
            </motion.div>

            {/* Title */}
            <h3 className="text-2xl font-kufam font-bold text-white mb-4">
              {service.title}
            </h3>

            {/* Description and Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <p className="text-white/90 font-kufam line-clamp-2">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {["جودة عالية", "تسليم سريع", "دعم مستمر"].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{
                      duration: 0.3,
                      delay: isHovered ? i * 0.1 : 0,
                    }}
                    className="px-3 py-1 backdrop-blur-sm rounded-full text-sm font-kufam bg-white/10 text-white/90"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 px-6 py-2 font-kufam rounded-full transition-colors bg-white/90 text-black hover:bg-white"
              >
                جودة عالية
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
