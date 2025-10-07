"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
  {
    name: "Client 1",
    logo: "/images/f2c8e19a-b510-4653-89f4-3ab306ed9139_removalai_preview.png",
  },
  {
    name: "Client 2",
    logo: "/images/e26e1692-ae63-482a-8ab0-0c34c917cc43_removalai_preview.png",
  },
  {
    name: "Client 3",
    logo: "/images/9d1be18b-4426-469d-9076-67e22731bd92_removalai_preview.png",
  },
  {
    name: "Client 4",
    logo: "/images/mylk.png",
  },
  {
    name: "Client 5",
    logo: "/images/09191da8-fe58-4854-8891-c19ea6d9ce30_removalai_preview.png",
  },
  {
    name: "Client 6",
    logo: "/images/02254bd4-0bd2-40c6-ab3d-45fc52844914_removalai_preview.png",
  },
];

// Split clients into two rows - first 8 in row1, remaining 8 in row2
const row1 = [...clients.slice(0, 8), ...clients.slice(0, 8)];
const row2 = [...clients.slice(8), ...clients.slice(8)];

export function Clients() {
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
        <div className="space-y-8 sm:space-y-12 md:space-y-16 overflow-hidden">
          {/* Row 1 - Right to Left */}
          <div className="relative h-20 sm:h-24 md:h-28 lg:h-32">
            <motion.div
              className="flex items-center absolute"
              animate={{
                x: [0, -1600], // Fixed pixel distance
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              style={{
                width: "3200px", // Fixed width for consistent speed
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
              className="flex items-center absolute"
              animate={{
                x: [-1600, 0], // Fixed pixel distance
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              style={{
                width: "3200px", // Fixed width for consistent speed
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
