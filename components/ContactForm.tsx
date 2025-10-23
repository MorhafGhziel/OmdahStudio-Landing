"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  subject: z.string().min(5, "الموضوع يجب أن يكون 5 أحرف على الأقل"),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        form.reset();
      } else {
        setSubmitStatus("error");
        console.error("Form submission error:", {
          status: response.status,
          statusText: response.statusText,
          result: result
        });
      }
    } catch (error) {
      setSubmitStatus("error");
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 sm:p-10 md:p-12 shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 font-ibm-plex-sans-arabic text-lg font-semibold mb-3 block">
                    الاسم
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="أدخل اسمك الكامل"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-2 focus:ring-white/20 font-ibm-plex-sans-arabic h-14 text-lg rounded-xl transition-all duration-300 hover:bg-white/15"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 font-ibm-plex-sans-arabic mt-2" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 font-ibm-plex-sans-arabic text-lg font-semibold mb-3 block">
                    البريد الإلكتروني
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-2 focus:ring-white/20 font-ibm-plex-sans-arabic h-14 text-lg rounded-xl transition-all duration-300 hover:bg-white/15"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 font-ibm-plex-sans-arabic mt-2" />
                </FormItem>
              )}
            />

            {/* Subject Field */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 font-ibm-plex-sans-arabic text-lg font-semibold mb-3 block">
                    الموضوع
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="أدخل موضوع الرسالة"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-2 focus:ring-white/20 font-ibm-plex-sans-arabic h-14 text-lg rounded-xl transition-all duration-300 hover:bg-white/15"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 font-ibm-plex-sans-arabic mt-2" />
                </FormItem>
              )}
            />

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 font-ibm-plex-sans-arabic text-lg font-semibold mb-3 block">
                    الرسالة
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="أدخل رسالتك هنا... أخبرنا عن مشروعك ورؤيتك"
                      rows={6}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-2 focus:ring-white/20 font-ibm-plex-sans-arabic resize-none text-lg rounded-xl transition-all duration-300 hover:bg-white/15"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 font-ibm-plex-sans-arabic mt-2" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-4"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-white to-white/90 text-black hover:from-white/95 hover:to-white/85 font-ibm-plex-sans-arabic text-xl py-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  "إرسال الرسالة"
                )}
              </Button>
            </motion.div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-center font-ibm-plex-sans-arabic text-lg backdrop-blur-sm"
              >
                ✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-center font-ibm-plex-sans-arabic text-lg backdrop-blur-sm"
              >
                ❌ حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.
              </motion.div>
            )}
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
