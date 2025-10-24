"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith("/works/");
  const { isAdmin, logout } = useAdmin();

  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.5)"]
  );

  const headerBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(12px)"]
  );

  const handleSmoothScroll = (href: string) => {
    const elementId = href.replace("#", "");
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const navItems = useMemo(
    () => [
      { name: "اتصل بنا", href: "#contact" },
      { name: "أعمالنا", href: "#works" },
      { name: "عملائنا", href: "#clients" },
      { name: "خدماتنا", href: "#services" },
      { name: "من نحن", href: "#about" },
    ],
    []
  );

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.replace("#", ""));
      const scrollPosition = window.scrollY + 200; // Offset for better detection
      let currentSection = "";

      // Find the section that is currently in view
      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          // Check if the section is in view
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = sections[i];
            break;
          }
          // If we're past the last section, select it
          else if (i === sections.length - 1 && scrollPosition >= sectionTop) {
            currentSection = sections[i];
          }
        }
      }

      // If no section is found, default to the first one
      if (!currentSection && sections.length > 0) {
        currentSection = sections[0];
      }

      setActiveSection(currentSection);
    };

    // Set initial active section
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  return (
    <>
      <motion.nav
        style={{
          backgroundColor: headerBg,
          backdropFilter: headerBlur,
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Back Button - Only show on project pages */}
            {isProjectPage && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => {
                  window.location.href = "/#works";
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white font-ibm-plex-sans-arabic text-sm font-semibold rounded-full hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للأعمال
              </motion.button>
            )}

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex items-center gap-12"
            >
              {navItems.map((item) => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;

                return (
                  <div key={item.name} className="relative group">
                    <button
                      onClick={() => handleSmoothScroll(item.href)}
                      className={`relative text-base font-ibm-plex-sans-arabic font-medium tracking-wide transition-all duration-300 block transform group-hover:-translate-y-0.5 cursor-pointer ${
                        isActive
                          ? "text-white"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </button>
                    <div
                      className={`absolute -bottom-1 right-0 w-full h-0.5 origin-right transition-transform duration-300 ${
                        isActive
                          ? "scale-x-100 bg-white"
                          : "scale-x-0 group-hover:scale-x-100 bg-white"
                      }`}
                    />
                  </div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center gap-4"
            >
              <Image
                src="/icons/logo_white_v2.svg"
                alt="Omdah Logo"
                width={120}
                height={40}
                className="h-26 w-auto"
              />

              {/* Admin Logout Button */}
              {isAdmin && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={logout}
                  className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30 transition-all font-ibm-plex-sans-arabic border border-red-500/30"
                >
                  Logout
                </motion.button>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <Image
                src="/icons/menu.svg"
                alt="Menu"
                width={24}
                height={24}
                className="w-6 h-6 invert"
              />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : "100%",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-0 z-40 md:hidden bg-black"
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {navItems.map((item, index) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  x: isOpen ? 0 : 50,
                }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => {
                    handleSmoothScroll(item.href);
                    setIsOpen(false);
                  }}
                  className={`text-3xl font-ibm-plex-sans-arabic font-bold tracking-tighter transition-colors cursor-pointer ${
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
