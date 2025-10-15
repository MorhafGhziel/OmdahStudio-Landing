"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";

// Import the works data from the Works component
const works = [
  {
    id: "01",
    title: "Deal",
    category: "تسويق",
    image: "/images/jedeal.png",
    video: "/api/video/jedeal.mov",
    client: "Deal",
    year: "2024",
    featured: true,
    link: "/works/jedeal",
    description:
      "تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Deal، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية",
    services: [
      "تطوير الهوية البصرية",
      "إنتاج فيديوهات ترويجية",
      "تصميم المواد التسويقية",
      "حملة تسويقية شاملة",
    ],
  },
  {
    id: "02",
    title: "تغطية فعالية تجارية",
    category: "توثيق",
    image: "/images/zid.png",
    client: "Zid",
    year: "2024",
    link: "/works/zid",
    description:
      "تغطية شاملة لفعالية إطلاق منتج جديد، مع إنتاج فيديو ترويجي ومحتوى لوسائل التواصل الاجتماعي",
    services: [
      "تغطية الفعالية",
      "إنتاج فيديو ترويجي",
      "محتوى وسائل التواصل الاجتماعي",
      "تصوير احترافي",
    ],
  },
  {
    id: "03",
    title: "إنتاج وثائقي",
    category: "وثائقيات",
    image: "/images/pangaea.png",
    client: "Pangaea",
    year: "2023",
    link: "/works/pangaea",
    description:
      "إنتاج فيلم وثائقي قصير يحكي قصة نجاح شركة ناشئة في مجال التكنولوجيا المالية",
    services: [
      "إنتاج فيلم وثائقي",
      "كتابة السيناريو",
      "التصوير والمونتاج",
      "الصوت والموسيقى",
    ],
  },
  {
    id: "04",
    title: "Sabahik",
    category: "تسويق",
    image: "/images/sabahk.png",
    video: "/api/video/Sabahik.mov",
    client: "Sabahik",
    year: "2024",
    link: "/works/sabahik",
    description:
      "تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Sabahik، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية",
    services: [
      "تطوير الهوية البصرية",
      "إنتاج فيديوهات ترويجية",
      "تصميم المواد التسويقية",
      "حملة تسويقية شاملة",
    ],
  },
  {
    id: "05",
    title: "Safeside",
    category: "3D",
    image: "/images/safesidee.png",
    video: "/api/video/Safeside.mp4",
    video2: "/api/video/Safeside2.mov",
    client: "Safeside",
    year: "2023",
    link: "/works/safeside",
    description:
      "تصميم ثلاثي الأبعاد لمشروع معماري ضخم، مع إنتاج فيديو تفاعلي للعرض",
    services: [
      "تصميم ثلاثي الأبعاد",
      "النمذجة المعمارية",
      "إنتاج فيديو تفاعلي",
      "العرض المرئي",
    ],
  },
  {
    id: "06",
    title: "Shakkah",
    category: "تسويق",
    image: "/images/Shakkah.png",
    video: "/api/video/Shakkah.mov",
    client: "Shakkah",
    year: "2024",
    link: "/works/shakkah",
    description:
      "تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Shakkah، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية",
    services: [
      "تطوير الهوية البصرية",
      "إنتاج فيديوهات ترويجية",
      "تصميم المواد التسويقية",
      "حملة تسويقية شاملة",
    ],
  },
];

interface ProjectDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { slug } = use(params);
  const project = works.find((work) => work.link === `/works/${slug}`);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex flex-col pt-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/10 via-neutral-600/5 to-neutral-900/10" />

        {/* Animated background circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neutral-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-neutral-300/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      {/* Video Section */}
      <div className="py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden rounded-2xl">
            {project.video ? (
              <div className="w-full h-full flex gap-4">
                <video
                  className="flex-1 h-full object-cover rounded-2xl"
                  loop
                  playsInline
                  controls
                >
                  <source src={project.video} type="video/mp4" />
                  <source src={project.video} type="video/quicktime" />
                </video>
                {project.video2 && (
                  <video
                    className="flex-1 h-full object-cover rounded-2xl"
                    loop
                    playsInline
                    controls
                  >
                    <source src={project.video2} type="video/mp4" />
                    <source src={project.video2} type="video/quicktime" />
                  </video>
                )}
              </div>
            ) : (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover rounded-2xl"
              />
            )}
          </div>

          {/* Content Under Video */}
          <div className="mt-12 space-y-8 px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-ibm-plex-sans-arabic font-bold text-white mb-6">
                تفاصيل المشروع
              </h2>
              <p className="text-lg text-white/70 font-ibm-plex-sans-arabic max-w-2xl mx-auto leading-relaxed">
                {project.description}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-ibm-plex-sans-arabic font-bold text-white mb-4">
                  الخدمات المقدمة
                </h3>
                <ul className="space-y-3 text-white/80 font-ibm-plex-sans-arabic">
                  {project.services.map((service, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-white/40 rounded-full mr-3"></div>
                      {service}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-ibm-plex-sans-arabic font-bold text-white mb-4">
                  معلومات المشروع
                </h3>
                <div className="space-y-3 text-white/80 font-ibm-plex-sans-arabic">
                  <div className="flex justify-between">
                    <span className="font-semibold">السنة:</span>
                    <span>{project.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">الفئة:</span>
                    <span>{project.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">العميل:</span>
                    <span>{project.client}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
