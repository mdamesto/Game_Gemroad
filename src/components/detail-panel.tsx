"use client";

import { useEffect, useState } from "react";
import type { Area } from "@/data/areas";
import { categoryColors } from "@/data/areas";
import ImageGallery from "./image-gallery";

interface DetailPanelProps {
  area: Area | null;
  onClose: () => void;
}

export default function DetailPanel({ area, onClose }: DetailPanelProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (area) {
      setVisible(true);
      setClosing(false);
    }
  }, [area]);

  useEffect(() => {
    if (!area) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !galleryOpen) handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [area, galleryOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      onClose();
    }, 250);
  };

  if (!visible || !area) return null;

  const accentColor = categoryColors[area.category];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={handleClose}
        style={{ animation: "fade-in 0.2s ease-out" }}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-[#1a1f1a]/90 backdrop-blur-xl border-l border-white/5 overflow-y-auto custom-scrollbar ${
          closing ? "animate-slide-out" : "animate-slide-in"
        }`}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-cream/70 hover:text-cream hover:bg-white/20 transition-all text-lg"
          aria-label="Close panel"
        >
          &times;
        </button>

        {/* Content */}
        <div className="p-6 pt-14">
          {/* Eyebrow */}
          <span
            className="text-xs font-sans tracking-[0.25em] uppercase"
            style={{ color: accentColor }}
          >
            {area.eyebrow}
          </span>

          {/* Title */}
          <h2 className="mt-2 font-serif text-3xl text-cream leading-tight">
            {area.title}
          </h2>

          {/* Main image */}
          <div className="mt-5 overflow-hidden rounded-lg aspect-video relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={area.image}
              alt={area.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Description */}
          <p className="mt-5 text-sm leading-relaxed text-cream/70 font-sans">
            {area.description}
          </p>

          {/* Gallery thumbnails */}
          {area.gallery.length > 1 && (
            <div className="mt-5">
              <h3 className="text-xs font-sans tracking-[0.2em] uppercase text-cream/50 mb-3">
                Gallery
              </h3>
              <div className="flex gap-2 overflow-x-auto">
                {area.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setGalleryIndex(i);
                      setGalleryOpen(true);
                    }}
                    className="flex-shrink-0 overflow-hidden rounded-md w-20 h-14 opacity-70 hover:opacity-100 transition-opacity ring-1 ring-white/10 hover:ring-white/30"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${area.title} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {area.tags && area.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {area.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cream/60 font-sans"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Explore button */}
          <button
            className="mt-8 w-full rounded-full py-3 text-sm tracking-[0.15em] uppercase font-sans transition-all hover:brightness-110"
            style={{ backgroundColor: accentColor, color: "#fffbe7" }}
          >
            Explore this area
          </button>

          <div className="h-8" />
        </div>
      </aside>

      <ImageGallery
        images={area.gallery}
        open={galleryOpen}
        initialIndex={galleryIndex}
        onClose={() => setGalleryOpen(false)}
      />
    </>
  );
}
