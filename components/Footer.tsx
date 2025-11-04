"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/admin-context";

interface FooterContent {
  tagline: string;
  contactHeading: string;
  whatsappUrl: string;
  instagramUrl: string;
  email: string;
  copyrightText: string;
}

const defaultFooter: FooterContent = {
  tagline: "ما يعتمد عليه مشروعك",
  contactHeading: "تواصل معنا",
  whatsappUrl: "https://wa.me/966558960098",
  instagramUrl: "https://www.instagram.com/omdah.sa",
  email: "Info@omdah.sa",
  copyrightText: "© {year} عمدة. جميع الحقوق محفوظة",
};

export const Footer = () => {
  const { isAdmin } = useAdmin();
  const [footerContent, setFooterContent] = useState<FooterContent>(defaultFooter);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const response = await fetch("/api/content");
        if (response.ok) {
          const data = await response.json();
          if (data.content && data.content.footer) {
            setFooterContent(data.content.footer);
          }
        }
      } catch (error) {
        console.error("Error fetching footer content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterContent();
  }, []);

  const startEditing = (field: string) => {
    setEditingField(field);
    setTempValue(footerContent[field as keyof FooterContent] || "");
  };

  const handleSave = async (field: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const updatedContent = {
        ...footerContent,
        [field]: tempValue,
      };

      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section: "footer",
          data: updatedContent,
        }),
      });

      if (response.ok) {
        setFooterContent(updatedContent);
        setEditingField(null);
      } else {
        alert("فشل حفظ التعديلات");
      }
    } catch (error) {
      console.error("Error saving footer content:", error);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  if (loading) {
    return (
      <footer className="w-full bg-[#0a0a0a] text-white py-8 sm:py-12 border-t border-gray-400/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center py-8">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin border-t-white"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const currentYear = new Date().getFullYear();
  const copyrightText = footerContent.copyrightText.replace("{year}", currentYear.toString());

  return (
    <footer className="w-full bg-[#0a0a0a] text-white py-8 sm:py-12 border-t border-gray-400/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <Image
              src="/icons/logo_white_v2.svg"
              alt="Omdah Logo"
              width={100}
              height={33}
              className="mb-3 sm:mb-4 w-[100px] sm:w-[120px] h-auto"
            />
            <div className="flex items-center gap-2">
              {editingField === "tagline" ? (
                <>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleSave("tagline")}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </>
                  )}
                </>
              ) : (
                isAdmin && (
                  <button
                    onClick={() => startEditing("tagline")}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                )
              )}
              {editingField === "tagline" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="text-sm sm:text-base text-gray-400 font-ibm-plex-sans-arabic text-center md:text-right max-w-[280px] md:max-w-none bg-white/10 border border-white/30 rounded px-2 py-1"
                  dir="rtl"
                  autoFocus
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-400 font-ibm-plex-sans-arabic text-center md:text-right max-w-[280px] md:max-w-none">
                  {footerContent.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-end gap-3 sm:gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              {editingField === "contactHeading" ? (
                <>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleSave("contactHeading")}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </>
                  )}
                </>
              ) : (
                isAdmin && (
                  <button
                    onClick={() => startEditing("contactHeading")}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                )
              )}
              {editingField === "contactHeading" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="text-lg sm:text-xl font-ibm-plex-sans-arabic bg-white/10 border border-white/30 rounded px-2 py-1"
                  dir="rtl"
                  autoFocus
                />
              ) : (
                <h3 className="text-lg sm:text-xl mb-1 sm:mb-2 font-ibm-plex-sans-arabic">
                  {footerContent.contactHeading}
                </h3>
              )}
            </div>

            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex justify-center md:justify-end gap-4 items-center">
                {/* WhatsApp */}
                <div className="flex items-center gap-1">
                  {isAdmin && editingField === "whatsappUrl" && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleSave("whatsappUrl")}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  )}
                  {isAdmin && editingField !== "whatsappUrl" && (
                    <button
                      onClick={() => startEditing("whatsappUrl")}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                  {editingField === "whatsappUrl" ? (
                    <input
                      type="url"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-xs bg-white/10 border border-white/30 rounded px-2 py-1 w-40"
                      placeholder="https://wa.me/..."
                      autoFocus
                    />
                  ) : (
                    <Link
                      href={footerContent.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity p-1"
                    >
                      <Image
                        src="/icons/whatsapp.svg"
                        alt="WhatsApp"
                        className="w-7 sm:w-8 h-auto"
                        width={32}
                        height={32}
                      />
                    </Link>
                  )}
                </div>

                {/* Instagram */}
                <div className="flex items-center gap-1">
                  {isAdmin && editingField === "instagramUrl" && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleSave("instagramUrl")}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  )}
                  {isAdmin && editingField !== "instagramUrl" && (
                    <button
                      onClick={() => startEditing("instagramUrl")}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                  {editingField === "instagramUrl" ? (
                    <input
                      type="url"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-xs bg-white/10 border border-white/30 rounded px-2 py-1 w-40"
                      placeholder="https://instagram.com/..."
                      autoFocus
                    />
                  ) : (
                    <Link
                      href={footerContent.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity p-1"
                    >
                      <Image
                        src="/icons/instagra.svg"
                        alt="Instagram"
                        className="w-6 sm:w-7 h-auto"
                        width={32}
                        height={32}
                      />
                    </Link>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                {editingField === "email" ? (
                  <>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleSave("email")}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  isAdmin && (
                    <button
                      onClick={() => startEditing("email")}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                  )
                )}
                {editingField === "email" ? (
                  <input
                    type="email"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="hover:text-gray-300 transition-colors font-ibm-plex-sans-arabic text-sm sm:text-base bg-white/10 border border-white/30 rounded px-2 py-1"
                    autoFocus
                  />
                ) : (
                  <Link
                    href={`mailto:${footerContent.email}`}
                    className="hover:text-gray-300 transition-colors font-ibm-plex-sans-arabic text-sm sm:text-base"
                  >
                    {footerContent.email}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-800 text-center text-xs sm:text-sm text-gray-400">
          <div className="flex items-center justify-center gap-2">
            {editingField === "copyrightText" ? (
              <>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => handleSave("copyrightText")}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs cursor-pointer"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </>
                )}
              </>
            ) : (
              isAdmin && (
                <button
                  onClick={() => startEditing("copyrightText")}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
                >
                  Edit
                </button>
              )
            )}
            {editingField === "copyrightText" ? (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="text-xs sm:text-sm text-gray-400 font-ibm-plex-sans-arabic bg-white/10 border border-white/30 rounded px-2 py-1 flex-1 max-w-md"
                dir="rtl"
                placeholder="Use {year} for current year"
                autoFocus
              />
            ) : (
              <p className="font-ibm-plex-sans-arabic">{copyrightText}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
