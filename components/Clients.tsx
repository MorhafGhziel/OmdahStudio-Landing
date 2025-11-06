"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAdmin } from "@/lib/admin-context";
import { ClientsSkeleton } from "./ui/ClientsSkeleton";

interface Client {
  _id: string;
  name: string;
  logo: string;
}

// Default clients are now seeded via API route

interface ClientsContent {
  title: string;
  description: string;
}

const defaultClientsContent: ClientsContent = {
  title: "عملائنا",
  description: "نفخر بالعمل مع مجموعة من العملاء المميزين",
};

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [clientsContent, setClientsContent] = useState<ClientsContent>(
    defaultClientsContent
  );
  const [editingField, setEditingField] = useState<keyof ClientsContent | null>(
    null
  );
  const [tempValue, setTempValue] = useState("");
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        if (response.ok) {
          const data = await response.json();
          if (
            data.clients &&
            Array.isArray(data.clients) &&
            data.clients.length > 0
          ) {
            setClients(data.clients);
          }
          // If empty, API will auto-seed on next request
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content");
        if (response.ok) {
          const data = await response.json();
          if (data.content?.clients) {
            setClientsContent({
              ...defaultClientsContent,
              ...data.content.clients,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching clients content:", error);
      }
    };

    fetchClients();
    fetchContent();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/clients?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh clients from database
        const fetchResponse = await fetch("/api/clients");
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          if (
            data.clients &&
            Array.isArray(data.clients) &&
            data.clients.length > 0
          ) {
            setClients(data.clients);
          } else {
            // If empty after delete, fetch will auto-seed on next load
            setClients([]);
          }
        }
      } else {
        alert("Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Error deleting client");
    }
  };

  const handleContentSave = async (field: keyof ClientsContent) => {
    try {
      const token = localStorage.getItem("adminToken");
      const updatedContent = { ...clientsContent, [field]: tempValue };

      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section: "clients",
          data: updatedContent,
        }),
      });

      if (response.ok) {
        setClientsContent(updatedContent);
        setEditingField(null);
      } else {
        alert("فشل حفظ التغييرات");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const startEditing = (field: keyof ClientsContent) => {
    setEditingField(field);
    setTempValue(clientsContent[field]);
  };

  const handleRefresh = async () => {
    const response = await fetch("/api/clients");
    if (response.ok) {
      const data = await response.json();
      if (
        data.clients &&
        Array.isArray(data.clients) &&
        data.clients.length > 0
      ) {
        setClients(data.clients);
      }
    }
  };

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  if (loading) {
    return <ClientsSkeleton />;
  }

  const row1 = [...clients.slice(0, 8), ...clients.slice(0, 8)];
  const row2 = [...clients.slice(8), ...clients.slice(8)];

  return (
    <section
      id="clients"
      className="py-16 sm:py-20 md:py-32 bg-black text-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] sm:w-[120vw] md:w-[1200px] h-[140vw] sm:h-[120vw] md:h-[1200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)] blur-[60px]" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] blur-[80px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <div className="absolute inset-0 opacity-5 mix-blend-overlay">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] bg-center" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block relative"
          >
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-ibm-plex-sans-arabic text-white/90 border border-white/20">
              عملائنا
            </span>
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
                {clientsContent.title}
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
                {clientsContent.description}
              </p>
            )}
          </motion.div>
        </div>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <button
              onClick={() => setShowAdminForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg transition-all font-ibm-plex-sans-arabic font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              إدارة العملاء
            </button>
          </motion.div>
        )}

        {/* Clients Rows */}
        <div className="space-y-10 sm:space-y-12 md:space-y-16 overflow-hidden relative">
          {/* Row 1 - Right to Left */}
          <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 overflow-hidden">
            <motion.div
              ref={row1Ref}
              className="flex items-center"
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden",
                width: "fit-content",
              }}
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
                repeatDelay: 0,
              }}
            >
              {row1.map((client, index) => (
                <motion.div
                  key={`${client._id}-${index}`}
                  className="flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-72 px-4 sm:px-6 md:px-8 relative group"
                  style={{
                    willChange: "auto",
                  }}
                  whileHover={{
                    zIndex: 10,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-sm border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/10 group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.15)]">
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative h-full flex items-center justify-center">
                      <Image
                        src={client.logo}
                        alt={`${client.name} logo`}
                        fill
                        className="object-contain brightness-0 invert opacity-80 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 transition-all duration-500"
                        unoptimized
                      />
                    </div>
                    <div className="absolute -inset-[1px] rounded-xl sm:rounded-2xl bg-white/[0.03] blur-sm transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Row 2 - Left to Right */}
          <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 overflow-hidden">
            <motion.div
              ref={row2Ref}
              className="flex items-center"
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden",
                width: "fit-content",
              }}
              initial={{ x: "-50%" }}
              animate={{ x: 0 }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
                repeatDelay: 0,
              }}
            >
              {row2.map((client, index) => (
                <motion.div
                  key={`${client._id}-${index}`}
                  className="flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-72 px-4 sm:px-6 md:px-8 relative group"
                  style={{
                    willChange: "auto",
                  }}
                  whileHover={{
                    zIndex: 10,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-sm border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/10 group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.15)]">
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative h-full flex items-center justify-center">
                      <Image
                        src={client.logo}
                        alt={`${client.name} logo`}
                        fill
                        className="object-contain brightness-0 invert opacity-80 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 transition-all duration-500"
                        unoptimized
                      />
                    </div>
                    <div className="absolute -inset-[1px] rounded-xl sm:rounded-2xl bg-white/[0.03] blur-sm transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Admin Form Modal */}
      {showAdminForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAdminForm(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-ibm-plex-sans-arabic text-white">
                إدارة العملاء
              </h2>
              <button
                onClick={() => setShowAdminForm(false)}
                className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
              >
                إغلاق
              </button>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {clients.map((client) => (
                <div
                  key={client._id}
                  className="relative bg-white/5 rounded-lg p-4"
                >
                  <div className="relative h-24 mb-2">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <p className="text-sm text-white text-center mb-2 font-ibm-plex-sans-arabic">
                    {client.name}
                  </p>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="w-full px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs cursor-pointer font-ibm-plex-sans-arabic"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>

            {/* Add Client Form */}
            <ClientForm
              onSave={handleRefresh}
              onClose={() => setShowAdminForm(false)}
              clients={clients}
            />
          </motion.div>
        </div>
      )}
    </section>
  );
}

// Client Form Component
function ClientForm({
  onSave,
  clients,
}: {
  onSave: () => void;
  onClose: () => void;
  clients: Client[];
}) {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      // Auto-upload immediately
      try {
        const token = localStorage.getItem("adminToken");
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          // Auto-generate client name based on existing clients
          const clientNumber = clients.length + 1;
          const autoName = `client-${clientNumber}`;
          setFormData({ name: autoName, logo: data.url });
        } else {
          alert("فشل رفع الصورة");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("حدث خطأ أثناء رفع الصورة");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.logo) {
      alert("يرجى رفع صورة العميل أولاً");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", logo: "" });
        onSave();
      } else {
        const errorData = await response.json();
        alert(`Failed to add client: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Error adding client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
          صورة العميل <span className="text-red-400">*</span>
        </label>
        <div className="space-y-3">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
          />
          <p className="text-xs text-white/50 mt-1">
            يدعم: PNG, JPG, JPEG, GIF, WEBP, SVG
          </p>
          {uploading && (
            <p className="text-sm text-white/60">جاري رفع الصورة...</p>
          )}
          {formData.logo && (
            <div className="flex items-center gap-2">
              <div className="relative w-16 h-16 bg-white/5 rounded overflow-hidden">
                <Image
                  src={formData.logo}
                  alt="Uploaded"
                  fill
                  className="object-contain brightness-0 invert"
                  unoptimized
                />
              </div>
              <span className="text-sm text-white/60">{formData.logo}</span>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, logo: "" });
                }}
                className="px-2 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
              >
                إزالة
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !formData.logo}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer font-ibm-plex-sans-arabic disabled:opacity-50"
        >
          {loading ? "جاري الإضافة..." : "إضافة عميل"}
        </button>
      </div>
    </form>
  );
}
