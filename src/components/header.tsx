"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="font-serif text-2xl tracking-[0.25em] text-cream uppercase">
        Primland
      </div>
      <button className="rounded-full border border-cream/60 px-6 py-2 text-sm tracking-wider text-cream uppercase transition-all hover:bg-cream/10 hover:border-cream">
        Inquire
      </button>
    </header>
  );
}
