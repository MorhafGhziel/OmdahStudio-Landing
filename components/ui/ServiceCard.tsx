"use client";

import { motion } from "framer-motion";

interface ServiceType {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
}

interface ServiceCardProps {
  service: ServiceType;
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export function ServiceCard({
  service,
  index,
  isHovered,
  isSelected,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div
        className={`
        group/card relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm
        border border-white/10 h-full
        transition-all duration-500 ease-out
        ${isHovered ? "bg-white/10" : "bg-white/5"}
        ${isSelected ? "bg-white/15" : ""}
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
  );
}
