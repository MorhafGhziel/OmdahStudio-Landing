"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

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

  const navItems = [
    { name: "أعمالنا", href: "#work" },
    { name: "خدماتنا", href: "#services" },
    { name: "من نحن", href: "#about" },
    { name: "اتصل بنا", href: "#contact" },
  ];

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
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex items-center gap-12"
            >
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="relative text-base font-kufam font-medium tracking-wide transition-all duration-300 block transform group-hover:-translate-y-0.5 text-white hover:text-gray-300"
                  >
                    {item.name}
                  </Link>
                  <div className="absolute -bottom-1 right-0 w-full h-0.5 origin-right transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 bg-white" />
                </div>
              ))}
            </motion.div>

            <Link href="/" className="relative group">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <Image
                  src="/icons/WhiteLogo.svg"
                  alt="Omdah Logo"
                  width={120}
                  height={40}
                  className="h-18 w-auto"
                />
                <motion.div
                  className="absolute -bottom-1 right-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>

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
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : 50,
              }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-kufam font-bold tracking-tighter transition-colors text-white hover:text-white/60"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
