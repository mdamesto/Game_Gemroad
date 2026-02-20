"use client";

import { useCallback, useEffect, useState } from "react";

interface ImageGalleryProps {
  images: string[];
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageGallery({
  images,
  open,
  initialIndex = 0,
  onClose,
}: ImageGalleryProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, prev, next]);

  if (!open || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={onClose}
      style={{ animation: "fade-in 0.2s ease-out" }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl transition-colors z-10"
        aria-label="Close gallery"
      >
        &times;
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-wider font-sans">
        {index + 1} / {images.length}
      </div>

      {/* Previous */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-4 md:left-8 text-white/50 hover:text-white text-4xl transition-colors z-10"
          aria-label="Previous image"
        >
          &#8249;
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`Gallery image ${index + 1}`}
          className="max-h-[85vh] max-w-[90vw] object-contain"
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-4 md:right-8 text-white/50 hover:text-white text-4xl transition-colors z-10"
          aria-label="Next image"
        >
          &#8250;
        </button>
      )}
    </div>
  );
}
