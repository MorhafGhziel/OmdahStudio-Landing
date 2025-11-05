"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
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
  const [clientsContent, setClientsContent] = useState<ClientsContent>(defaultClientsContent);
  const [editingField, setEditingField] = useState<keyof ClientsContent | null>(null);
  const [tempValue, setTempValue] = useState("");
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        if (response.ok) {
          const data = await response.json();
          if (data.clients && Array.isArray(data.clients) && data.clients.length > 0) {
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
            setClientsContent({ ...defaultClientsContent, ...data.content.clients });
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
          if (data.clients && Array.isArray(data.clients) && data.clients.length > 0) {
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
      if (data.clients && Array.isArray(data.clients) && data.clients.length > 0) {
        setClients(data.clients);
      }
    }
  };

  if (loading) {
    return <ClientsSkeleton />;
  }

  // Split clients into two rows - first 8 in row1, remaining in row2
  const row1 = [...clients.slice(0, 8), ...clients.slice(0, 8)];
  const row2 = [...clients.slice(8), ...clients.slice(8)];
  return (
    <section
      id="clients"
      className="py-8 sm:py-12 md:py-16 bg-black text-white"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="flex items-center gap-3 justify-center mb-3 sm:mb-4">
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
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-ibm-plex-sans-arabic font-semibold text-white bg-white/10 border border-white/30 rounded px-4 py-2 flex-1 text-center"
                dir="rtl"
                autoFocus
              />
            ) : (
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-ibm-plex-sans-arabic font-semibold">
                {clientsContent.title}
              </h2>
            )}
          </div>
          <div className="flex items-start gap-3 justify-center">
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
                className="text-base sm:text-lg md:text-xl text-gray-400 bg-white/10 border border-white/30 rounded px-4 py-2 flex-1 max-w-2xl font-ibm-plex-sans-arabic"
                dir="rtl"
                rows={2}
                autoFocus
              />
            ) : (
              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-ibm-plex-sans-arabic">
                {clientsContent.description}
              </p>
            )}
          </div>
        </div>

        {/* Admin Button */}
        {isAdmin && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowAdminForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg transition-all font-ibm-plex-sans-arabic font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              إدارة العملاء
            </button>
          </div>
        )}

        {/* Clients Rows */}
        <div className="space-y-8 sm:space-y-12 md:space-y-16 overflow-hidden">
          {/* Row 1 - Right to Left */}
          <div className="relative h-28 sm:h-32 md:h-36 lg:h-40">
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
                    key={`${client._id}-${index}`}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 px-4 sm:px-6 md:px-8 relative group"
                    whileHover={{
                      scale: 1.1,
                      zIndex: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="h-28 sm:h-32 md:h-36 lg:h-40 bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300 hover:bg-white/10">
                      <div className="relative h-full flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          fill
                          className="object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                          unoptimized
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center">
                {row1.map((client, index) => (
                  <motion.div
                    key={`${client._id}-${index}-duplicate`}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 px-4 sm:px-6 md:px-8 relative group"
                    whileHover={{
                      scale: 1.1,
                      zIndex: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="h-28 sm:h-32 md:h-36 lg:h-40 bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300 hover:bg-white/10">
                      <div className="relative h-full flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          fill
                          className="object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                          unoptimized
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Row 2 - Left to Right */}
          <div className="relative h-28 sm:h-32 md:h-36 lg:h-40">
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
                    key={`${client._id}-${index}`}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 px-4 sm:px-6 md:px-8"
                    whileHover={{
                      scale: 1.1,
                      zIndex: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="h-28 sm:h-32 md:h-36 lg:h-40 bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300 hover:bg-white/10">
                      <div className="relative h-full flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          fill
                          className="object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                          unoptimized
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center">
                {row2.map((client, index) => (
                  <motion.div
                    key={`${client._id}-${index}-duplicate`}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 px-4 sm:px-6 md:px-8 relative group"
                    whileHover={{
                      scale: 1.1,
                      zIndex: 10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="h-28 sm:h-32 md:h-36 lg:h-40 bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300 hover:bg-white/10">
                      <div className="relative h-full flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          fill
                          className="object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                          unoptimized
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

      {/* Admin Form Modal */}
      {showAdminForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAdminForm(false)}>
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
                <div key={client._id} className="relative bg-white/5 rounded-lg p-4">
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
