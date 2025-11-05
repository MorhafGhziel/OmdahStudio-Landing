"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import { AboutOmdahSkeleton } from "./ui/AboutOmdahSkeleton";

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  storyTitle: string;
}

const defaultHero: HeroContent = {
  title: "معك عُمدة",
  subtitle: "ما يعتمد عليه مشروعك",
  description: "شركة سعودية، نشتغل على المحتوى المرئي. نشتغل ببساطة، والبساطة هي قوتنا.",
  ctaText: "اكتشف خدماتنا",
  storyTitle: "قصتنا",
};

export function AboutOmdah() {
  const [mounted, setMounted] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHero);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<keyof HeroContent | null>(null);
  const [tempValue, setTempValue] = useState("");
  const { isAdmin } = useAdmin();

  useEffect(() => {
    setMounted(true);
    
    // Fetch content from database
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content");
        if (response.ok) {
          const data = await response.json();
          if (data.content?.hero) {
            setHeroContent({ ...defaultHero, ...data.content.hero });
          }
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  const handleSave = async (field: keyof HeroContent) => {
    try {
      const token = localStorage.getItem("adminToken");
      const updatedContent = { ...heroContent, [field]: tempValue };
      
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section: "hero",
          data: updatedContent,
        }),
      });

      if (response.ok) {
        setHeroContent(updatedContent);
        setEditingField(null);
      } else {
        alert("فشل حفظ التغييرات");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const startEditing = (field: keyof HeroContent) => {
    setEditingField(field);
    setTempValue(heroContent[field]);
  };

  return (
    <motion.section
      id="about"
      className="relative min-h-[100svh] flex items-center justify-center bg-black text-white overflow-hidden py-16 sm:py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {loading ? (
        <AboutOmdahSkeleton />
      ) : (
        <>
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
          <div className="text-center">
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
              <div className="relative flex items-center gap-3 justify-center">
                {editingField === "title" ? (
                  <>
                    <button
                      onClick={() => handleSave("title")}
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </>
                ) : (
                  isAdmin && (
                    <button
                      onClick={() => startEditing("title")}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                  )
                )}
                {editingField === "title" ? (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-ibm-plex-sans-arabic text-white bg-white/10 border border-white/30 rounded px-4 py-2 w-full"
                    dir="rtl"
                    autoFocus
                  />
                ) : (
                  <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-ibm-plex-sans-arabic text-white leading-[1.3] pt-2 pb-1">
                    {heroContent.title}
                  </h1>
                )}
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl md:text-3xl font-ibm-plex-sans-arabic text-white/90 mt-8 sm:mt-12 flex items-center gap-3 justify-center"
            >
              {editingField === "subtitle" ? (
                <>
                  <button
                    onClick={() => handleSave("subtitle")}
                    className="px-3 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                  >
                    حفظ
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                  >
                    إلغاء
                  </button>
                </>
              ) : (
                isAdmin && (
                  <button
                    onClick={() => startEditing("subtitle")}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                )
              )}
              {editingField === "subtitle" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="text-xl sm:text-2xl md:text-3xl font-ibm-plex-sans-arabic text-white bg-white/10 border border-white/30 rounded px-4 py-2 flex-1 text-center"
                  dir="rtl"
                  autoFocus
                />
              ) : (
                <div>{heroContent.subtitle}</div>
              )}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 sm:mt-16 flex items-center gap-3 justify-center"
            >
              {editingField === "ctaText" ? (
                <>
                  <button
                    onClick={() => handleSave("ctaText")}
                    className="px-3 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                  >
                    حفظ
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                  >
                    إلغاء
                  </button>
                </>
              ) : (
                isAdmin && (
                  <button
                    onClick={() => startEditing("ctaText")}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                )
              )}
              {editingField === "ctaText" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="text-lg sm:text-xl font-ibm-plex-sans-arabic text-black bg-white border border-black/30 rounded px-4 py-2"
                  dir="rtl"
                  autoFocus
                />
              ) : (
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
                  <span className="relative">{heroContent.ctaText}</span>
                </motion.button>
              )}
            </motion.div>

            {/* Our Story Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-24 sm:mt-32 md:mt-40"
            >
                <div className="max-w-2xl mx-auto text-center">
                  <div className="flex items-center gap-3 justify-center mb-6">
                  {editingField === "storyTitle" ? (
                    <>
                      <button
                        onClick={() => handleSave("storyTitle")}
                        className="px-3 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </>
                  ) : (
                    isAdmin && (
                      <button
                        onClick={() => startEditing("storyTitle")}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                      >
                        Edit
                      </button>
                    )
                  )}
                  {editingField === "storyTitle" ? (
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-2xl sm:text-3xl md:text-4xl font-ibm-plex-sans-arabic text-white bg-white/10 border border-white/30 rounded px-4 py-2 flex-1 text-center"
                      dir="rtl"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-ibm-plex-sans-arabic text-white">
                      {heroContent.storyTitle}
                    </h3>
                  )}
                </div>
                <div className="relative">
                  <div className="flex items-start gap-3 justify-center">
                    {editingField === "description" ? (
                      <>
                        <button
                          onClick={() => handleSave("description")}
                          className="px-3 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </>
                    ) : (
                      isAdmin && (
                        <button
                          onClick={() => startEditing("description")}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                        >
                          Edit
                        </button>
                      )
                    )}
                    {editingField === "description" ? (
                      <textarea
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="text-lg sm:text-xl text-white bg-white/10 border border-white/30 rounded px-4 py-2 flex-1"
                        dir="rtl"
                        rows={3}
                        autoFocus
                      />
                    ) : (
                      <p
                        className="text-lg sm:text-xl text-white/80 leading-relaxed font-ibm-plex-sans-arabic flex-1"
                        dir="rtl"
                      >
                        {heroContent.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
        </>
      )}

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
