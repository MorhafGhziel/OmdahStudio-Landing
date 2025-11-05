"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import { ProjectDetailsSkeleton } from "@/components/ui/ProjectDetailsSkeleton";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  video?: string;
  video2?: string;
  client: string;
  year: string;
  link: string;
  description: string;
  services: string[];
}

interface ProjectDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { slug } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch("/api/works");
        if (response.ok) {
          const data = await response.json();
          if (data.works && Array.isArray(data.works)) {
            const foundProject = data.works.find(
              (work: Project) => work.link === `/works/${slug}`
            );
            if (foundProject) {
              console.log("Found project:", foundProject.title);
              console.log("Video URL:", foundProject.video);
              console.log("Video2 URL:", foundProject.video2);
            }
            setProject(foundProject || null);
          }
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return <ProjectDetailsSkeleton />;
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex flex-col pt-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/10 via-neutral-600/5 to-neutral-900/10" />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neutral-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-neutral-300/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      <div className="py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/50">
            {project.video && project.video.trim() ? (
              <div className="w-full h-full flex gap-4">
                <video
                  className="flex-1 h-full object-cover rounded-2xl"
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  onError={(e) => {
                    const video = e.target as HTMLVideoElement;
                    const error = video.error;
                    console.error("Video error details:", {
                      code: error?.code,
                      message: error?.message,
                      networkState: video.networkState,
                      readyState: video.readyState,
                      currentSrc: video.currentSrc,
                      src: video.src,
                    });
                    console.error("Project video URL:", project.video);
                    if (error) {
                      console.error("MediaError code:", error.code);
                      console.error("MediaError message:", error.message);
                    }
                  }}
                  onLoadStart={() => {
                    console.log("Video loading started:", project.video);
                  }}
                  onCanPlay={() => {
                    console.log("Video can play:", project.video);
                  }}
                  onLoadedMetadata={() => {
                    console.log("Video metadata loaded:", project.video);
                  }}
                >
                  {project.video && (
                    <>
                      {project.video.startsWith('http') ? (
                        <>
                          <source src={`/api/video-proxy?url=${encodeURIComponent(project.video)}`} type="video/mp4" />
                          <source src={`/api/video-proxy?url=${encodeURIComponent(project.video)}`} type="video/quicktime" />
                        </>
                      ) : (
                        <>
                          {project.video.endsWith('.mp4') && (
                            <>
                              <source src={`/api/video/${project.video.replace('/videos/', '')}`} type="video/mp4" />
                              <source src={project.video} type="video/mp4" />
                            </>
                          )}
                          {project.video.endsWith('.mov') && (
                            <>
                              <source src={`/api/video/${project.video.replace('/videos/', '')}`} type="video/quicktime" />
                              <source src={project.video} type="video/quicktime" />
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                  Your browser does not support the video tag.
                </video>
                {project.video2 && (
                  <video
                    className="flex-1 h-full object-cover rounded-2xl"
                    loop
                    playsInline
                    controls
                    preload="metadata"
                    onError={(e) => {
                      const video = e.target as HTMLVideoElement;
                      const error = video.error;
                      console.error("Video2 error details:", {
                        code: error?.code,
                        message: error?.message,
                        networkState: video.networkState,
                        readyState: video.readyState,
                        currentSrc: video.currentSrc,
                        src: video.src,
                      });
                      console.error("Project video2 URL:", project.video2);
                      if (error) {
                        console.error("MediaError code:", error.code);
                        console.error("MediaError message:", error.message);
                      }
                    }}
                    onLoadStart={() => {
                      console.log("Video2 loading started:", project.video2);
                    }}
                    onCanPlay={() => {
                      console.log("Video2 can play:", project.video2);
                    }}
                    onLoadedMetadata={() => {
                      console.log("Video2 metadata loaded:", project.video2);
                    }}
                  >
                    {project.video2 && (
                      <>
                        {project.video2.startsWith('http') ? (
                          <>
                            <source src={`/api/video-proxy?url=${encodeURIComponent(project.video2)}`} type="video/mp4" />
                            <source src={`/api/video-proxy?url=${encodeURIComponent(project.video2)}`} type="video/quicktime" />
                          </>
                        ) : (
                          <>
                            {project.video2.endsWith('.mp4') && (
                              <>
                                <source src={`/api/video/${project.video2.replace('/videos/', '')}`} type="video/mp4" />
                                <source src={project.video2} type="video/mp4" />
                              </>
                            )}
                            {project.video2.endsWith('.mov') && (
                              <>
                                <source src={`/api/video/${project.video2.replace('/videos/', '')}`} type="video/quicktime" />
                                <source src={project.video2} type="video/quicktime" />
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : project.image && project.image.trim() ? (
              <Image
                src={
                  project.image.startsWith("http") &&
                  project.image.includes("idrivee2.com")
                    ? `/api/image-proxy?url=${encodeURIComponent(project.image)}`
                    : project.image
                }
                alt={project.title}
                fill
                className="object-cover rounded-2xl"
                onError={(e) => {
                  console.error("Image failed to load:", project.image);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white/40 font-ibm-plex-sans-arabic">
                <p>لا توجد صورة أو فيديو متاح</p>
              </div>
            )}
          </div>

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
