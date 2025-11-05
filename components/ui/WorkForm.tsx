"use client";

import { useState, useEffect } from "react";

interface Work {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  client: string;
  year: string;
  description?: string;
  image?: string;
  video?: string;
  video2?: string;
  featured?: boolean;
  services?: string[];
  link?: string;
}

interface WorkFormProps {
  work?: Work | null;
  onSave: (work: Work) => void;
  onCancel: () => void;
  onVideoUpload?: (file: File) => Promise<string>;
  onImageUpload?: (file: File) => Promise<string>;
}

export function WorkForm({
  work,
  onSave,
  onCancel,
  onVideoUpload,
  onImageUpload,
}: WorkFormProps) {
  const [formData, setFormData] = useState<Work>({
    title: "",
    category: "",
    client: "",
    year: "",
    description: "",
    image: "",
    video: "",
    video2: "",
    featured: false,
    services: [],
  });

  const [servicesText, setServicesText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (work) {
      setFormData({
        title: work.title || "",
        category: work.category || "",
        client: work.client || "",
        year: work.year || "",
        description: work.description || "",
        image: work.image || "",
        video: work.video || "",
        video2: work.video2 || "",
        featured: work.featured || false,
        services: work.services || [],
        _id: work._id,
        id: work.id,
        link: work.link,
      });
      setServicesText((work.services || []).join("\n"));
    }
  }, [work]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const services = servicesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const workToSave = {
        ...formData,
        services,
      };

      onSave(workToSave);
    } catch (error) {
      console.error("Error saving work:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onVideoUpload) return;

    setUploadingVideo(true);
    try {
      const url = await onVideoUpload(file);
      setFormData((prev) => ({ ...prev, video: url }));
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleVideo2Upload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !onVideoUpload) return;

    setUploadingVideo(true);
    try {
      const url = await onVideoUpload(file);
      setFormData((prev) => ({ ...prev, video2: url }));
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    setUploadingImage(true);
    try {
      const url = await onImageUpload(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
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
          placeholder="أدخل عنوان العمل"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
            Client <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.client}
            onChange={(e) =>
              setFormData({ ...formData, client: e.target.value })
            }
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
            required
            minLength={1}
            placeholder="اسم العميل"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
            Year <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: e.target.value })
            }
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
            required
            minLength={1}
            placeholder="السنة"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 h-20 resize-none"
          required
          minLength={1}
          placeholder="أدخل وصف العمل"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
          Services (one per line)
        </label>
        <textarea
          value={servicesText}
          onChange={(e) => setServicesText(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 h-20 resize-none"
          placeholder="خدمة 1&#10;خدمة 2&#10;خدمة 3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
          Image URL
        </label>
        <input
          type="text"
          value={formData.image}
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.value })
          }
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
          placeholder="/images/example.png"
        />
        {onImageUpload && (
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/80 cursor-pointer"
            />
            {uploadingImage && (
              <p className="text-xs text-white/50 mt-1">Uploading...</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
          Video URL
        </label>
        <input
          type="text"
          value={formData.video}
          onChange={(e) =>
            setFormData({ ...formData, video: e.target.value })
          }
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
          placeholder="https://..."
        />
        {onVideoUpload && (
          <div className="mt-2">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              disabled={uploadingVideo}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/80 cursor-pointer"
            />
            {uploadingVideo && (
              <p className="text-xs text-white/50 mt-1">Uploading...</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
          Video 2 URL (optional)
        </label>
        <input
          type="text"
          value={formData.video2}
          onChange={(e) =>
            setFormData({ ...formData, video2: e.target.value })
          }
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
          placeholder="https://..."
        />
        {onVideoUpload && (
          <div className="mt-2">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideo2Upload}
              disabled={uploadingVideo}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/80 cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({ ...formData, featured: e.target.checked })
          }
          className="w-4 h-4 cursor-pointer"
        />
        <label
          htmlFor="featured"
          className="text-sm font-medium text-white/80 font-ibm-plex-sans-arabic cursor-pointer"
        >
          Featured Work
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-ibm-plex-sans-arabic cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 font-ibm-plex-sans-arabic cursor-pointer"
        >
          {loading ? "Saving..." : work ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

