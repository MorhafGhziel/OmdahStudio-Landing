"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAdmin } from "@/lib/admin-context";
import { WorkForm } from "./ui/WorkForm";

interface Work {
  _id?: string;
  id: string;
  title: string;
  category: string;
  image: string;
  video?: string;
  video2?: string;
  client: string;
  year: string;
  description?: string;
  services?: string[];
  featured?: boolean;
  link?: string;
}

export function Works() {
  const { isAdmin } = useAdmin();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredWork, setHoveredWork] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [showForm, setShowForm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchWorks = async () => {
    try {
      const response = await fetch("/api/works");
      if (response.ok) {
        const data = await response.json();
        if (data.works && Array.isArray(data.works)) {
          setWorks(data.works);
        }
      }
    } catch (error) {
      console.error("Error fetching works:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const featuredWork = works.find((work) => work.featured);
  const gridWorks = works.filter((work) => !work.featured);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          try {
            if (entry.isIntersecting) {
              video.muted = false;
              setIsMuted(false);
              video.play().catch(() => {
                video.muted = true;
                setIsMuted(true);
                video.play().catch(() => {});
              });
            } else {
              if (!video.paused) {
                video.pause();
              }
            }
          } catch (error) {
            console.log("Video intersection observer error:", error);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [featuredWork?.video]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const video = videoRef.current;
      if (video) {
        if (!document.fullscreenElement) {
          video.controls = false;
          video.style.objectFit = "cover";
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  if (loading) {
    return (
      <section
        id="works"
        className="py-16 sm:py-20 md:py-32 bg-black text-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center py-12">
            <div className="relative w-12 h-12">
              <motion.div
                className="absolute inset-0 border-4 border-white/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-0 border-4 border-transparent border-t-white rounded-full"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="works"
      className="py-16 sm:py-20 md:py-32 bg-black text-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Center glowing circle */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] sm:w-[120vw] md:w-[1200px] h-[140vw] sm:h-[120vw] md:h-[1200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] blur-[60px]" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_60%)] blur-[80px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] bg-center" />
        </div>
      </div>

      <div className="w-full relative">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-ibm-plex-sans-arabic text-white/90">
              أعمالنا
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-ibm-plex-sans-arabic font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 text-white"
          >
            مشاريعنا المميزة
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-white/60 max-w-[90%] sm:max-w-2xl mx-auto font-ibm-plex-sans-arabic"
          >
            نفتخر بعرض مجموعة من أفضل أعمالنا التي تعكس إبداعنا وتميزنا
          </motion.p>
        </div>

        {/* Featured Work */}
        {featuredWork && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 sm:mb-12 md:mb-16"
          >
            <div
              ref={containerRef}
              className="relative group px-4 sm:px-6 md:px-8"
            >
              <div
                className="relative h-[500px] w-full overflow-hidden bg-black rounded-2xl"
                onClick={() => {
                  const video = videoRef.current;
                  if (video) {
                    video.muted = false;
                    video.play().catch(() => {
                      console.log("Manual play failed");
                    });
                  }
                }}
              >
                {featuredWork.video ? (
                  <>
                    {/* Minimal Loading State */}
                    {videoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}

                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full"
                      playsInline
                      preload="auto"
                      controls={false}
                      muted
                      style={{
                        backgroundColor: "black",
                        objectFit: "cover",
                      }}
                      onLoadStart={() => {
                        console.log("Video loading started");
                        setVideoLoading(true);
                      }}
                      onCanPlay={() => {
                        console.log("Video can play");
                        setVideoLoading(false);
                      }}
                      onPlay={() => {
                        console.log("Video playing");
                        setIsPlaying(true);
                      }}
                      onPause={() => {
                        console.log("Video paused");
                        setIsPlaying(false);
                      }}
                      onEnded={() => {
                        console.log("Video ended");
                        setIsPlaying(false);
                      }}
                      onError={(e) => {
                        const video = e.currentTarget;
                        const error = video.error;
                        console.group("🎥 Video Error Details");
                        console.error("Featured Work:", featuredWork?.title);
                        console.error("Video URL:", featuredWork?.video);
                        console.error("Video currentSrc:", video.currentSrc);
                        console.error(
                          "Video networkState:",
                          video.networkState
                        );
                        console.error("Video readyState:", video.readyState);
                        if (error) {
                          console.error("MediaError code:", error.code);
                          console.error("MediaError message:", error.message);
                          const errorMessages = {
                            1: "MEDIA_ERR_ABORTED - The user aborted the video",
                            2: "MEDIA_ERR_NETWORK - A network error occurred",
                            3: "MEDIA_ERR_DECODE - The video could not be decoded",
                            4: "MEDIA_ERR_SRC_NOT_SUPPORTED - The video format is not supported",
                          };
                          console.error(
                            "Error meaning:",
                            errorMessages[
                              error.code as keyof typeof errorMessages
                            ] || "Unknown error"
                          );
                        }
                        console.groupEnd();
                        setVideoLoading(false);
                        setVideoError(true);
                      }}
                    >
                      {featuredWork.video && (
                        <>
                          {featuredWork.video.startsWith("http") ? (
                            <>
                              {/* Use proxy for all HTTP URLs (Blob Storage, IDrive e2, etc.) */}
                              <source
                                src={`/api/video-proxy?url=${encodeURIComponent(
                                  featuredWork.video
                                )}`}
                                type="video/mp4"
                              />
                              <source
                                src={`/api/video-proxy?url=${encodeURIComponent(
                                  featuredWork.video
                                )}`}
                                type="video/quicktime"
                              />
                            </>
                          ) : (
                            <>
                              {featuredWork.video.endsWith(".mp4") && (
                                <>
                                  <source
                                    src={`/api/video/${featuredWork.video.replace(
                                      "/videos/",
                                      ""
                                    )}`}
                                    type="video/mp4"
                                  />
                                  <source
                                    src={featuredWork.video}
                                    type="video/mp4"
                                  />
                                </>
                              )}
                              {featuredWork.video.endsWith(".mov") && (
                                <>
                                  <source
                                    src={`/api/video/${featuredWork.video.replace(
                                      "/videos/",
                                      ""
                                    )}`}
                                    type="video/quicktime"
                                  />
                                  <source
                                    src={featuredWork.video}
                                    type="video/quicktime"
                                  />
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                      Your browser does not support the video tag.
                    </video>

                    {/* Play/Pause Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const video = videoRef.current;
                        if (video) {
                          if (isPlaying) {
                            video.pause();
                          } else {
                            video.muted = false;
                            setIsMuted(false);
                            video.play().catch(() => {
                              video.muted = true;
                              setIsMuted(true);
                              video.play().catch(() => {});
                            });
                          }
                        }
                      }}
                      className="absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200 z-30 cursor-pointer"
                    >
                      {isPlaying ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const video = videoRef.current;
                        if (video) {
                          video.muted = !video.muted;
                          setIsMuted(video.muted);
                        }
                      }}
                      className="absolute top-4 right-20 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200 z-30 cursor-pointer"
                    >
                      {isMuted ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const video = videoRef.current;
                        if (video) {
                          video.controls = true;
                          video.style.objectFit = "contain";

                          if (video.requestFullscreen) {
                            video.requestFullscreen();
                          } else if (
                            (
                              video as HTMLVideoElement & {
                                webkitRequestFullscreen?: () => void;
                              }
                            ).webkitRequestFullscreen
                          ) {
                            (
                              video as HTMLVideoElement & {
                                webkitRequestFullscreen: () => void;
                              }
                            ).webkitRequestFullscreen();
                          } else if (
                            (
                              video as HTMLVideoElement & {
                                msRequestFullscreen?: () => void;
                              }
                            ).msRequestFullscreen
                          ) {
                            (
                              video as HTMLVideoElement & {
                                msRequestFullscreen: () => void;
                              }
                            ).msRequestFullscreen();
                          }
                        }
                      }}
                      className="absolute top-4 right-36 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200 z-30 cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                      </svg>
                    </button>
                  </>
                ) : videoError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                    <div className="text-center">
                      <p className="text-sm mb-2">Video not available</p>
                      <p className="text-xs text-white/60">
                        Showing image instead
                      </p>
                    </div>
                    <Image
                      src={featuredWork.image}
                      alt={featuredWork.title}
                      fill
                      className="object-cover -z-10"
                    />
                  </div>
                ) : (
                  <Image
                    src={featuredWork.image}
                    alt={featuredWork.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center px-4 sm:px-6 md:px-8"
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEditingWork(null);
                setShowForm(true);
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded-lg transition-all font-ibm-plex-sans-arabic font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              إضافة عمل جديد
            </button>
          </motion.div>
        )}

        {/* Grid Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="px-4 sm:px-6 md:px-8"
        >
          <div className="scrollable-works flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory">
            {gridWorks.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="group flex-shrink-0 w-[280px] sm:w-[300px] md:w-[400px] snap-center"
                onMouseEnter={() => setHoveredWork(work.id)}
                onMouseLeave={() => setHoveredWork(null)}
              >
                <div className="relative w-full h-[280px] sm:h-[300px] md:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden bg-black/50">
                  {work.image && work.image.trim() ? (
                    <Image
                      src={
                        work.image.startsWith("http") &&
                        work.image.includes("idrivee2.com")
                          ? `/api/image-proxy?url=${encodeURIComponent(
                              work.image
                            )}`
                          : work.image
                      }
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        console.error("Image failed to load:", work.image);
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/40 font-ibm-plex-sans-arabic">
                      <p className="text-sm">لا توجد صورة</p>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-4 sm:p-6 pb-8">
                    <div className="flex items-center justify-center mb-4 w-full">
                      <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-ibm-plex-sans-arabic text-white/90">
                        {work.category}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl md:text-2xl font-ibm-plex-sans-arabic font-bold text-white mb-4 text-center">
                      {work.title}
                    </h4>

                    <div className="text-xs text-white/60 font-ibm-plex-sans-arabic mb-4">
                      {work.client}
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (work.link) {
                          window.location.href = work.link;
                        }
                      }}
                      className="px-6 py-3 bg-white text-black font-ibm-plex-sans-arabic text-sm font-semibold rounded-full hover:bg-white/90 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
                      style={{ zIndex: 10 }}
                    >
                      عرض التفاصيل
                    </button>
                  </div>

                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-50">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Edit button clicked for:", work.title);
                            setEditingWork(work);
                            setShowForm(true);
                          }}
                          className="px-3 py-1 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600 transition-all text-xs font-semibold shadow-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const token = localStorage.getItem("adminToken");
                            if (!token) {
                              alert("Not authenticated");
                              return;
                            }

                            if (
                              confirm(
                                "Are you sure you want to delete this work?"
                              )
                            ) {
                              try {
                                const response = await fetch(
                                  `/api/works?id=${work._id}`,
                                  {
                                    method: "DELETE",
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );

                                if (response.ok) {
                                  await fetchWorks();
                                } else {
                                  const error = await response.json();
                                  alert(error.error || "Failed to delete work");
                                }
                              } catch (error) {
                                console.error("Error deleting work:", error);
                                alert("Failed to delete work");
                              }
                            }
                          }}
                          className="px-3 py-1 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition-all text-xs font-semibold shadow-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredWork === work.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {isAdmin && showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
              setEditingWork(null);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-ibm-plex-sans-arabic text-white">
                {editingWork ? "Edit Work" : "Add New Work"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingWork(null);
                }}
                className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all cursor-pointer"
              >
                ×
              </button>
            </div>
            <WorkForm
              key={editingWork?._id || editingWork?.id || "new"}
              work={editingWork}
              onSave={async (workData) => {
                const token = localStorage.getItem("adminToken");
                if (!token) {
                  alert("Not authenticated. Please login again.");
                  return;
                }

                try {
                  const url = "/api/works";
                  const method = editingWork ? "PUT" : "POST";

                  console.log("Saving work:", {
                    method,
                    workData,
                    editingWork,
                  });

                  const response = await fetch(url, {
                    method,
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(
                      editingWork
                        ? { ...workData, _id: editingWork._id }
                        : workData
                    ),
                  });

                  const responseData = await response.json();

                  if (response.ok) {
                    console.log("Work saved successfully:", responseData);
                    setShowForm(false);
                    setEditingWork(null);
                    await fetchWorks();
                  } else {
                    console.error("Failed to save work:", responseData);
                    alert(
                      responseData.error ||
                        responseData.details?.[0]?.message ||
                        "Failed to save work"
                    );
                  }
                } catch (error) {
                  console.error("Error saving work:", error);
                  alert(
                    "Failed to save work: " +
                      (error instanceof Error ? error.message : "Unknown error")
                  );
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingWork(null);
              }}
              onVideoUpload={async (file) => {
                const token = localStorage.getItem("adminToken");
                if (!token) throw new Error("Not authenticated");

                const getUploadUrlResponse = await fetch(
                  "/api/videos/upload-url",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      filename: file.name,
                      contentType: file.type || "video/mp4",
                    }),
                  }
                );

                if (!getUploadUrlResponse.ok) {
                  const errorData = await getUploadUrlResponse
                    .json()
                    .catch(() => ({}));
                  const errorMessage =
                    errorData.message ||
                    errorData.error ||
                    "Failed to get upload URL";
                  throw new Error(errorMessage);
                }

                const { uploadUrl, url } = await getUploadUrlResponse.json();

                const uploadResponse = await fetch(uploadUrl, {
                  method: "PUT",
                  body: file,
                  headers: {
                    "Content-Type": file.type || "video/mp4",
                  },
                });

                if (!uploadResponse.ok) {
                  throw new Error(
                    `Upload failed with status ${uploadResponse.status}`
                  );
                }

                return url;
              }}
              onImageUpload={async (file) => {
                const token = localStorage.getItem("adminToken");
                if (!token) throw new Error("Not authenticated");

                if (file.size > 4 * 1024 * 1024) {
                  const getUploadUrlResponse = await fetch("/api/upload-url", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      filename: file.name,
                      contentType: file.type || "image/png",
                    }),
                  });

                  if (!getUploadUrlResponse.ok) {
                    const errorData = await getUploadUrlResponse
                      .json()
                      .catch(() => ({}));
                    const errorMessage =
                      errorData.message ||
                      errorData.error ||
                      "Failed to get upload URL";
                    throw new Error(errorMessage);
                  }

                  const { uploadUrl, url } = await getUploadUrlResponse.json();

                  const uploadResponse = await fetch(uploadUrl, {
                    method: "PUT",
                    body: file,
                    headers: {
                      "Content-Type": file.type || "image/png",
                    },
                  });

                  if (!uploadResponse.ok) {
                    throw new Error(
                      `Upload failed with status ${uploadResponse.status}`
                    );
                  }

                  return url;
                }

                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/upload", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  body: formData,
                });

                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  const errorMessage =
                    errorData.message ||
                    errorData.error ||
                    "Failed to upload image";
                  throw new Error(errorMessage);
                }

                const data = await response.json();
                return data.url;
              }}
            />
          </motion.div>
        </div>
      )}
    </section>
  );
}
