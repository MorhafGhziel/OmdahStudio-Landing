"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditControl, EditableText } from "@/components/admin/EditableText";
import { AdminButton } from "@/components/admin/Field";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { useAdmin } from "@/lib/admin-context";
import { useSection } from "@/lib/content";
import { authHeaders, useServices } from "@/lib/data";
import { EASE } from "@/lib/motion";
import type { ServiceType } from "@/lib/types";
import { arabicIndex, cn } from "@/lib/utils";

export function Services() {
  const { copy, setField } = useSection("services");
  const { services, loading, refresh } = useServices();
  const { isAdmin } = useAdmin();

  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ServiceType | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const remove = async (service: ServiceType) => {
    if (!window.confirm(`حذف "${service.title}"؟`)) return;
    await fetch(`/api/services?id=${service.id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    refresh();
  };

  return (
    <section id="services" className="border-t border-hairline">
      <div className="gutter py-20 sm:py-24 lg:py-32">
        {/* Wall label */}
        <Reveal className="flex items-center gap-6 border-b border-hairline pb-5">
          <EditableText
            value={copy.badge}
            onSave={(v) => setField("badge", v)}
            className="t-label-ar shrink-0 text-clay"
          />
          <span className="t-label text-smoke">What We Do</span>
          <span className="t-serif ms-auto text-2xl text-smoke">02</span>
        </Reveal>

        {/* Heading */}
        <div className="grid grid-cols-12 gap-y-8 pt-12 sm:pt-16">
          <div className="col-span-12 lg:col-span-6">
            <EditableText
              as="h2"
              value={copy.title}
              onSave={(v) => setField("title", v)}
              className="t-h1 text-chalk"
            >
              <WordReveal text={copy.title} />
            </EditableText>
          </div>
          <Reveal delay={0.15} className="col-span-12 lg:col-span-5 lg:col-start-8">
            <EditableText
              as="p"
              value={copy.description}
              onSave={(v) => setField("description", v)}
              multiline
              className="t-lead text-ash"
            />
          </Reveal>
        </div>

        {isAdmin && (
          <div className="mt-10">
            <AdminButton
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              + خدمة جديدة
            </AdminButton>
          </div>
        )}

        {/* The index */}
        <div className="mt-14 border-t border-hairline sm:mt-20">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-b border-hairline py-7">
                  <div className="sheen h-7 w-2/3 rounded-xs" />
                </div>
              ))
            : services.map((service, i) => {
                const key = String(service._id ?? service.id);
                const isOpen = openId === key;

                return (
                  <Reveal
                    key={key}
                    delay={Math.min(i, 6) * 0.04}
                    className="border-b border-hairline"
                  >
                    <div
                      className={cn(
                        "group relative transition-colors duration-500",
                        isOpen && "bg-ink-3"
                      )}
                    >
                      <button
                        onClick={() => setOpenId(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-4 px-2 py-6 text-start sm:gap-8 sm:py-8"
                      >
                        <span className="t-serif w-10 shrink-0 text-xl text-smoke sm:text-2xl">
                          {arabicIndex(service.id)}
                        </span>

                        <span className="t-h3 flex-1 text-chalk transition-transform duration-500 group-hover:-translate-x-1">
                          {service.title}
                        </span>

                        <span className="t-label-ar hidden shrink-0 text-smoke sm:block">
                          {service.category}
                        </span>

                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                            isOpen
                              ? "border-clay bg-clay text-chalk"
                              : "border-hairline text-smoke group-hover:border-chalk group-hover:text-chalk"
                          )}
                        >
                          {isOpen ? (
                            <Minus className="size-4" />
                          ) : (
                            <Plus className="size-4" />
                          )}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.55, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-12 gap-y-6 px-2 pb-9 sm:ps-[4.5rem]">
                              <p className="t-body col-span-12 measure text-ash lg:col-span-7">
                                {service.description}
                              </p>

                              <ul className="col-span-12 flex flex-wrap content-start gap-2 lg:col-span-4 lg:col-start-9">
                                {service.features.map((feature) => (
                                  <li
                                    key={feature}
                                    className="rounded-full border border-hairline bg-ink-3 px-3.5 py-1.5 text-[0.8125rem] text-ash"
                                  >
                                    {feature}
                                  </li>
                                ))}
                              </ul>

                              {isAdmin && (
                                <div className="col-span-12 flex gap-2">
                                  <AdminButton
                                    variant="ghost"
                                    onClick={() => {
                                      setEditing(service);
                                      setFormOpen(true);
                                    }}
                                  >
                                    <Pencil className="me-1.5 inline size-3" />
                                    تعديل
                                  </AdminButton>
                                  <AdminButton
                                    variant="danger"
                                    onClick={() => remove(service)}
                                  >
                                    <Trash2 className="me-1.5 inline size-3" />
                                    حذف
                                  </AdminButton>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
        </div>

        <Reveal
          delay={0.1}
          className="mt-14 flex items-center justify-center gap-3 sm:mt-20"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {copy.ctaText}
            <ButtonArrow />
          </Button>

          {/* Detached: a <button> cannot contain another one. */}
          <EditControl
            value={copy.ctaText}
            onSave={(v) => setField("ctaText", v)}
            label="تعديل نص الزر"
          />
        </Reveal>
      </div>

      <ServiceForm
        open={formOpen}
        service={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          refresh();
        }}
      />
    </section>
  );
}
