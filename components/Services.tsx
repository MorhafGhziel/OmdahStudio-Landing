"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ServiceCard } from "./ui/ServiceCard";
import { useAdmin } from "@/lib/admin-context";
import { ServiceType } from "@/lib/types";

interface ServicesContent {
  badge: string;
  title: string;
  description: string;
  ctaText: string;
}

const defaultServicesContent: ServicesContent = {
  badge: "خدماتنا",
  title: "ما نقدمه لكم",
  description: "حلول إبداعية متكاملة تواكب احتياجاتك وتتجاوز توقعاتك",
  ctaText: "تواصل معنا الآن",
};

export function Services() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(
    null
  );
  const [servicesContent, setServicesContent] = useState<ServicesContent>(
    defaultServicesContent
  );
  const [editingField, setEditingField] = useState<
    keyof ServicesContent | null
  >(null);
  const [tempValue, setTempValue] = useState("");
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");

        if (!response.ok) {
          console.error(
            "API response not ok:",
            response.status,
            response.statusText
          );
          setServices([]);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data && data.services && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          console.error("Invalid response format:", data);
          setServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content");
        if (response.ok) {
          const data = await response.json();
          if (data.content?.services) {
            setServicesContent({
              ...defaultServicesContent,
              ...data.content.services,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching services content:", error);
      }
    };

    fetchServices();
    fetchContent();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/services?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setServices(services.filter((service) => service.id !== id));
      } else {
        alert("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    }
  };

  const handleSave = async () => {
    // Refresh services after save
    const response = await fetch("/api/services");
    const data = await response.json();
    if (response.ok) {
      setServices(data.services);
    }
    setShowAddForm(false);
    setEditingService(null);
  };

  const handleContentSave = async (field: keyof ServicesContent) => {
    try {
      const token = localStorage.getItem("adminToken");
      const updatedContent = { ...servicesContent, [field]: tempValue };

      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section: "services",
          data: updatedContent,
        }),
      });

      if (response.ok) {
        setServicesContent(updatedContent);
        setEditingField(null);
      } else {
        alert("فشل حفظ التغييرات");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const startEditing = (field: keyof ServicesContent) => {
    setEditingField(field);
    setTempValue(servicesContent[field]);
  };

  if (loading) {
    return (
      <section
        id="services"
        className="py-16 sm:py-20 md:py-32 bg-black text-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative">
          <div className="text-center">
            <div className="text-white text-xl">Loading services...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] blur-[60px]" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] blur-[80px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] bg-center" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block relative"
          >
            <div className="flex items-center gap-2 justify-center">
              {editingField === "badge" ? (
                <>
                  <button
                    onClick={() => handleContentSave("badge")}
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
                    onClick={() => startEditing("badge")}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                )
              )}
              {editingField === "badge" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-ibm-plex-sans-arabic text-white/90 border border-white/30"
                  dir="rtl"
                  autoFocus
                />
              ) : (
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-ibm-plex-sans-arabic text-white/90">
                  {servicesContent.badge}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 justify-center mt-4 sm:mt-6 mb-3 sm:mb-4"
          >
            {editingField === "title" ? (
              <>
                <button
                  onClick={() => handleContentSave("title")}
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
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-ibm-plex-sans-arabic font-bold text-white bg-white/10 border border-white/30 rounded px-4 py-2 flex-1 text-center"
                dir="rtl"
                autoFocus
              />
            ) : (
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-ibm-plex-sans-arabic font-bold text-white">
                {servicesContent.title}
              </h2>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-start gap-3 justify-center"
          >
            {editingField === "description" ? (
              <>
                <button
                  onClick={() => handleContentSave("description")}
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
                className="text-base sm:text-lg text-white/60 bg-white/10 border border-white/30 rounded px-4 py-2 flex-1 max-w-[90%] sm:max-w-2xl font-ibm-plex-sans-arabic"
                dir="rtl"
                rows={2}
                autoFocus
              />
            ) : (
              <p className="text-base sm:text-lg text-white/60 max-w-[90%] sm:max-w-2xl mx-auto font-ibm-plex-sans-arabic">
                {servicesContent.description}
              </p>
            )}
          </motion.div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded-lg transition-all font-ibm-plex-sans-arabic font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              إضافة خدمة جديدة
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {services.map((service, index) => (
            <div key={service.id} className="relative group">
              <ServiceCard
                service={service}
                index={index}
                isHovered={hoveredService === service.id}
                isSelected={selectedService === service.id}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                onClick={() =>
                  setSelectedService(
                    selectedService === service.id ? null : service.id
                  )
                }
              />

              {/* Admin Controls Overlay */}
              {isAdmin && (
                <div className="absolute top-2 right-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingService(service)}
                      className="p-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600 transition-all text-xs font-semibold shadow-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition-all text-xs font-semibold shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 flex items-center gap-3 justify-center cursor-pointer"
        >
          {editingField === "ctaText" ? (
            <>
              <button
                onClick={() => handleContentSave("ctaText")}
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
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-ibm-plex-sans-arabic font-semibold rounded-full bg-white text-black border border-black/30"
              dir="rtl"
              autoFocus
            />
          ) : (
            <button
              onClick={() => {
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                  contactSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="
              px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-ibm-plex-sans-arabic font-semibold rounded-full
              bg-white text-black
              hover:bg-white/90
              transition-all duration-300 transform hover:scale-105
              shadow-lg hover:shadow-xl
              active:scale-95
              cursor-pointer
            "
            >
              {servicesContent.ctaText}
            </button>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingService) && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setShowAddForm(false);
            setEditingService(null);
          }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}

// Service Form Component
function ServiceForm({
  service,
  onClose,
  onSave,
}: {
  service: ServiceType | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    title: service?.title || "",
    category: service?.category || "",
    description: service?.description || "",
    features: service?.features.join(", ") || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const features = formData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        features,
      };

      const url = service ? "/api/services" : "/api/services";
      const method = service ? "PUT" : "POST";

      const requestBody = service ? { id: service.id, ...payload } : payload;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        onSave();
      } else {
        const errorData = await response.json();
        console.error("Failed to save service:", errorData);

        // Show detailed error message
        if (errorData.details && Array.isArray(errorData.details)) {
          const errorMessages = errorData.details
            .map((issue: { message?: string }) => issue.message)
            .join("\n");
          alert(`Failed to save service:\n${errorMessages}`);
        } else {
          alert(
            `Failed to save service: ${errorData.error || "Unknown error"}`
          );
        }
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-6 font-ibm-plex-sans-arabic text-white">
          {service ? "Edit Service" : "Add New Service"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              required
              minLength={1}
              placeholder="أدخل عنوان الخدمة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
              Category <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              required
              minLength={1}
              placeholder="أدخل الفئة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
              Description <span className="text-red-400">*</span> (Minimum 10
              characters)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 h-20 resize-none"
              required
              minLength={10}
              placeholder="أدخل وصف الخدمة (10 أحرف على الأقل)"
            />
            <p className="text-xs text-white/50 mt-1">
              {formData.description.length} / 10 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
              Features (comma separated) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) =>
                setFormData({ ...formData, features: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              placeholder="ميزة 1, ميزة 2, ميزة 3"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-ibm-plex-sans-arabic"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 font-ibm-plex-sans-arabic"
            >
              {loading ? "Saving..." : service ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
