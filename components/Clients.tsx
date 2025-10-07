"use client";

import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const clients = [
  {
    name: "STC Bank",
    logo: "/images/StcBank.png",
  },
  {
    name: "Zid",
    logo: "/images/zid.png",
  },
  {
    name: "Pangaea",
    logo: "/images/pangaea.png",
  },
  {
    name: "Safeside",
    logo: "/images/safeside.png",
  },
  {
    name: "Al Dammam",
    logo: "/images/aldammam.png",
  },
  {
    name: "Slope",
    logo: "/images/slope.png",
  },
  {
    name: "Deal",
    logo: "/images/deal.png",
  },
  {
    name: "شفل",
    logo: "/images/شفل.png",
  },
  {
    name: "AMF",
    logo: "/images/AMFlogo.png",
  },
  {
    name: "Unknown Room",
    logo: "/images/Unknown-Room.png",
  },
];

// Split clients into two rows for better distribution
const row1 = [...clients.slice(0, 6), ...clients.slice(0, 6)];
const row2 = [...clients.slice(6), ...clients.slice(6)];

export function Clients() {
  const [isHovered, setIsHovered] = useState(false);
  const row1Controls = useAnimationControls();
  const row2Controls = useAnimationControls();
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [row1Position, setRow1Position] = useState(0);
  const [row2Position, setRow2Position] = useState(-100);

  useEffect(() => {
    const startAnimations = () => {
      row1Controls.start({
        x: [`${row1Position}%`, "-100%"],
        transition: {
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        },
      });
      row2Controls.start({
        x: [`${row2Position}%`, "0%"],
        transition: {
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        },
      });
    };

    startAnimations();
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    row1Controls.stop();
    row2Controls.stop();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    // Get current position and continue from there
    if (row1Ref.current) {
      const currentX = row1Ref.current.style.transform.match(
        /translateX\(([^)]+)\)/
      );
      if (currentX) {
        const currentPosition = parseFloat(currentX[1].replace("%", ""));
        setRow1Position(currentPosition);
        row1Controls.start({
          x: [`${currentPosition}%`, "-100%"],
          transition: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
        });
      }
    }

    if (row2Ref.current) {
      const currentX = row2Ref.current.style.transform.match(
        /translateX\(([^)]+)\)/
      );
      if (currentX) {
        const currentPosition = parseFloat(currentX[1].replace("%", ""));
        setRow2Position(currentPosition);
        row2Controls.start({
          x: [`${currentPosition}%`, "0%"],
          transition: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
        });
      }
    }
  };

  return (
    <section
      id="clients"
      className="py-8 sm:py-12 md:py-16 bg-black text-white"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-ibm-plex-sans-arabic font-semibold mb-3 sm:mb-4">
            عملائنا
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-ibm-plex-sans-arabic">
            نفخر بالعمل مع مجموعة من العملاء المميزين
          </p>
        </div>

        {/* Clients Rows */}
        <div
          className="space-y-8 sm:space-y-12 md:space-y-16 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Row 1 - Right to Left */}
          <div className="relative h-20 sm:h-24 md:h-28 lg:h-32">
            <motion.div
              ref={row1Ref}
              className="flex items-center absolute"
              animate={row1Controls}
              style={{
                width: "200%",
              }}
            >
              <div className="flex items-center">
                {row1.map((client, index) => (
                  <motion.div
                    key={`${client.name}-${index}`}
                    className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 px-4 sm:px-6 md:px-8"
                    whileHover={{
                      scale: 1.1,
                      zIndex: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="h-20 sm:h-24 md:h-28 lg:h-32 bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300 hover:bg-white/10">
                      <div className="relative h-full flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          fill
                          className="object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center">
                {row1.map((client, index) => (
                  <motion.div
                    key={`${client.name}-${index}-duplicate`}
                    className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 px-4 sm:px-6 md:px-8"
                    whileHover={{
                      scale: 1.1,
                      zIndex: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="h-20 sm:h-24 md:h-28 lg:h-32 bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300 hover:bg-white/10">
                      <div className="relative h-full flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          fill
                          className="object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Row 2 - Left to Right */}
          <div className="relative h-20 sm:h-24 md:h-28 lg:h-32">
            <motion.div
              ref={row2Ref}
              className="flex items-center absolute"
              animate={row2Controls}
              style={{
                width: "200%",
              }}
            >
              <div className="flex items-center">
                {row2.map((client, index) => (
                  <motion.div
                    key={`${client.name}-${index}`}
                    className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 px-4 sm:px-6 md:px-8"
                    whileHover={{
                      scale: 1.1,
                      zIndex: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="h-20 sm:h-24 md:h-28 lg:h-32 bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300 hover:bg-white/10">
                      <div className="relative h-full flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          fill
                          className="object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center">
                {row2.map((client, index) => (
                  <motion.div
                    key={`${client.name}-${index}-duplicate`}
                    className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 px-4 sm:px-6 md:px-8"
                    whileHover={{
                      scale: 1.1,
                      zIndex: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="h-20 sm:h-24 md:h-28 lg:h-32 bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300 hover:bg-white/10">
                      <div className="relative h-full flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          fill
                          className="object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
