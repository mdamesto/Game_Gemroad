"use client";

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://www.datocms-assets.com/95630/1684431817-primland-aerial-1.jpg?auto=format&w=1920')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="animate-fade-in relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="font-serif text-cream leading-tight">
          <span className="block text-5xl md:text-7xl lg:text-8xl tracking-wide">
            IN THE HEART
          </span>
          <span className="block mt-1 text-lg md:text-xl tracking-[0.3em] text-cream/70 font-sans uppercase">
            of
          </span>
          <span className="block mt-1 text-3xl md:text-5xl lg:text-6xl italic tracking-wide">
            The Blue Ridge Mountains
          </span>
        </h1>

        <p className="mt-6 max-w-md text-base md:text-lg text-cream/70 font-sans tracking-wide">
          Journey to the ultimate adventure paradise.
        </p>

        <button
          onClick={onExplore}
          className="mt-10 group relative inline-flex items-center gap-2 rounded-full border border-cream/40 bg-cream/5 px-8 py-3 text-sm tracking-[0.2em] text-cream uppercase backdrop-blur-sm transition-all duration-300 hover:bg-cream/15 hover:border-cream/70"
        >
          Explore the map
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-y-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
