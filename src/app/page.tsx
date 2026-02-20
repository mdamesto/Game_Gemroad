"use client";

import { useCallback, useRef, useState } from "react";
import Hero from "@/components/hero";
import ThreeMap from "@/components/three-map";
import type { CameraState, SceneTweaks } from "@/components/three-map";
import { DEFAULT_TWEAKS } from "@/components/three-map";

interface ViewSettings {
  mapSrc: string;
  segments: number;
  wireframe: boolean;
  showTexture: boolean;
  showMarkers: boolean;
  showOverlay: boolean;
  showClouds: boolean;
  showBirds: boolean;
  tweaks: SceneTweaks;
}

const DEFAULT_SETTINGS: ViewSettings = {
  mapSrc: "/map.jpg",
  segments: 256,
  wireframe: false,
  showTexture: true,
  showMarkers: true,
  showOverlay: true,
  showClouds: true,
  showBirds: true,
  tweaks: { ...DEFAULT_TWEAKS },
};

const MAP_OPTIONS = [
  { value: "/map.jpg", label: "Map 1" },
  { value: "/map2.jpg", label: "Map 2" },
];

const SEGMENT_OPTIONS = [128, 256, 512];

function settingsKey(s: ViewSettings) {
  return `${s.mapSrc}-${s.segments}`;
}

// ── Toggle switch ────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group py-1">
      <span className="text-[11px] text-cream/60 font-sans group-hover:text-cream/90 transition-colors">
        {label}
      </span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-8 h-[18px] rounded-full transition-colors duration-200 ${
          checked ? "bg-main" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-cream shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-[14px]" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

// ── Group label ──────────────────────────────────────────────────────
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] font-sans font-semibold tracking-[0.15em] uppercase text-cream/30 mb-0.5">
      {children}
    </span>
  );
}

// ── Slider row ──────────────────────────────────────────────────────
function TweakSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-cream/50 w-20 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1 accent-main"
      />
      <span className="text-[10px] text-cream/40 w-8 text-right tabular-nums">
        {value.toFixed(2)}
      </span>
    </div>
  );
}

// ── Inline settings panel for one view ──────────────────────────────
function ViewPanel({
  label,
  settings,
  onChange,
}: {
  label?: string;
  settings: ViewSettings;
  onChange: (s: ViewSettings) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <span className="text-[10px] font-sans tracking-widest uppercase text-cream/40">
          {label}
        </span>
      )}

      {/* ── Source ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <GroupLabel>Source</GroupLabel>

        {/* Map select */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-cream/60 w-16 shrink-0">Map</span>
          <div className="flex gap-1">
            {MAP_OPTIONS.map((m) => (
              <button
                key={m.value}
                onClick={() => onChange({ ...settings, mapSrc: m.value })}
                className={`px-2.5 py-1 rounded-md text-[10px] font-sans transition-all ${
                  settings.mapSrc === m.value
                    ? "bg-main/40 text-cream ring-1 ring-main/50"
                    : "bg-white/5 text-cream/40 hover:bg-white/10 hover:text-cream/70"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Segments select */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-cream/60 w-16 shrink-0">Detail</span>
          <div className="flex gap-1">
            {SEGMENT_OPTIONS.map((seg) => (
              <button
                key={seg}
                onClick={() => onChange({ ...settings, segments: seg })}
                className={`px-2.5 py-1 rounded-md text-[10px] font-sans transition-all ${
                  settings.segments === seg
                    ? "bg-main/40 text-cream ring-1 ring-main/50"
                    : "bg-white/5 text-cream/40 hover:bg-white/10 hover:text-cream/70"
                }`}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06]" />

      {/* ── Rendering ──────────────────────────────────────────── */}
      <div className="flex flex-col">
        <GroupLabel>Rendering</GroupLabel>
        <Toggle label="Wireframe" checked={settings.wireframe} onChange={(v) => onChange({ ...settings, wireframe: v })} />
        <Toggle label="Texture" checked={settings.showTexture} onChange={(v) => onChange({ ...settings, showTexture: v })} />
        <Toggle label="Overlay" checked={settings.showOverlay} onChange={(v) => onChange({ ...settings, showOverlay: v })} />
      </div>

      <div className="border-t border-white/[0.06]" />

      {/* ── Elements ───────────────────────────────────────────── */}
      <div className="flex flex-col">
        <GroupLabel>Elements</GroupLabel>
        <Toggle label="Markers" checked={settings.showMarkers} onChange={(v) => onChange({ ...settings, showMarkers: v })} />
        <Toggle label="Clouds" checked={settings.showClouds} onChange={(v) => onChange({ ...settings, showClouds: v })} />
        <Toggle label="Birds" checked={settings.showBirds} onChange={(v) => onChange({ ...settings, showBirds: v })} />
      </div>

      {/* ── Scene tweaks ───────────────────────────────────────── */}
      <details className="group">
        <summary className="text-[9px] font-sans font-semibold tracking-[0.15em] uppercase text-cream/30 cursor-pointer hover:text-cream/50 list-none flex items-center gap-1.5 py-1">
          <span className="text-[8px] group-open:rotate-90 transition-transform duration-200">&#9654;</span>
          Advanced
        </summary>
        <div className="mt-2 flex flex-col gap-1.5 pb-1">
          <TweakSlider label="Terrain rough" value={settings.tweaks.terrainRoughness} min={0} max={1} step={0.01} onChange={(v) => onChange({ ...settings, tweaks: { ...settings.tweaks, terrainRoughness: v } })} />
          <TweakSlider label="Terrain metal" value={settings.tweaks.terrainMetalness} min={0} max={1} step={0.01} onChange={(v) => onChange({ ...settings, tweaks: { ...settings.tweaks, terrainMetalness: v } })} />
          <TweakSlider label="Ocean rough" value={settings.tweaks.oceanRoughness} min={0} max={1} step={0.01} onChange={(v) => onChange({ ...settings, tweaks: { ...settings.tweaks, oceanRoughness: v } })} />
          <TweakSlider label="Ocean metal" value={settings.tweaks.oceanMetalness} min={0} max={1} step={0.01} onChange={(v) => onChange({ ...settings, tweaks: { ...settings.tweaks, oceanMetalness: v } })} />
          <TweakSlider label="Sun" value={settings.tweaks.sunIntensity} min={0} max={3} step={0.05} onChange={(v) => onChange({ ...settings, tweaks: { ...settings.tweaks, sunIntensity: v } })} />
          <TweakSlider label="Ambient" value={settings.tweaks.ambientIntensity} min={0} max={2} step={0.05} onChange={(v) => onChange({ ...settings, tweaks: { ...settings.tweaks, ambientIntensity: v } })} />
          <TweakSlider label="Fog density" value={settings.tweaks.fogDensity} min={0} max={5} step={0.1} onChange={(v) => onChange({ ...settings, tweaks: { ...settings.tweaks, fogDensity: v } })} />
        </div>
      </details>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────
export default function Home() {
  const [showMap, setShowMap] = useState(false);
  const [heroExiting, setHeroExiting] = useState(false);
  const [split, setSplit] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const [leftSettings, setLeftSettings] = useState<ViewSettings>({
    ...DEFAULT_SETTINGS,
  });
  const [rightSettings, setRightSettings] = useState<ViewSettings>({
    ...DEFAULT_SETTINGS,
    segments: 512,
  });

  // Camera sync for split mode
  const [camState, setCamState] = useState<CameraState | null>(null);
  const sourceRef = useRef<"left" | "right" | null>(null);

  const handleExplore = () => {
    setHeroExiting(true);
    setTimeout(() => setShowMap(true), 600);
  };

  const handleLeftCamera = useCallback((state: CameraState) => {
    sourceRef.current = "left";
    setCamState({ ...state });
  }, []);

  const handleRightCamera = useCallback((state: CameraState) => {
    sourceRef.current = "right";
    setCamState({ ...state });
  }, []);

  return (
    <main className="relative min-h-screen">
      {!showMap && (
        <div
          className={`transition-all duration-600 ${
            heroExiting
              ? "opacity-0 -translate-y-12"
              : "opacity-100 translate-y-0"
          }`}
        >
          <Hero onExplore={handleExplore} />
        </div>
      )}

      {showMap && (
        <div className="animate-fade-in">
          {/* Single view */}
          {!split && (
            <ThreeMap
              key={settingsKey(leftSettings)}
              mapSrc={leftSettings.mapSrc}
              segments={leftSettings.segments}
              wireframe={leftSettings.wireframe}
              showTexture={leftSettings.showTexture}
              showMarkers={leftSettings.showMarkers}
              showOverlay={leftSettings.showOverlay}
              showClouds={leftSettings.showClouds}
              showBirds={leftSettings.showBirds}
              tweaks={leftSettings.tweaks}
            />
          )}

          {/* Split view */}
          {split && (
            <div className="flex h-screen w-screen">
              <div className="relative w-1/2 h-full border-r border-white/20">
                <ThreeMap
                  key={`L-${settingsKey(leftSettings)}`}
                  mapSrc={leftSettings.mapSrc}
                  segments={leftSettings.segments}
                  wireframe={leftSettings.wireframe}
                  showTexture={leftSettings.showTexture}
                  showMarkers={leftSettings.showMarkers}
                  showOverlay={leftSettings.showOverlay}
                  showClouds={leftSettings.showClouds}
                  tweaks={leftSettings.tweaks}
                  onCameraMove={handleLeftCamera}
                  cameraSync={
                    sourceRef.current === "right" ? camState : null
                  }
                />
              </div>
              <div className="relative w-1/2 h-full">
                <ThreeMap
                  key={`R-${settingsKey(rightSettings)}`}
                  mapSrc={rightSettings.mapSrc}
                  segments={rightSettings.segments}
                  wireframe={rightSettings.wireframe}
                  showTexture={rightSettings.showTexture}
                  showMarkers={rightSettings.showMarkers}
                  showOverlay={rightSettings.showOverlay}
                  showClouds={rightSettings.showClouds}
                  showBirds={rightSettings.showBirds}
                  tweaks={rightSettings.tweaks}
                  onCameraMove={handleRightCamera}
                  cameraSync={
                    sourceRef.current === "left" ? camState : null
                  }
                />
              </div>
            </div>
          )}

          {/* Settings panel */}
          <div className="fixed bottom-6 left-6 z-40">
            {panelOpen ? (
              <div className="rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/40 p-5 min-w-[280px] max-h-[80vh] overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-cream/80">
                    Settings
                  </span>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="flex items-center justify-center w-6 h-6 rounded-md text-cream/30 hover:text-cream hover:bg-white/10 transition-all text-sm leading-none"
                  >
                    &times;
                  </button>
                </div>

                {/* Split toggle */}
                <div className="mb-4 pb-3 border-b border-white/[0.06]">
                  <Toggle label="Split view" checked={split} onChange={setSplit} />
                </div>

                {/* Settings */}
                {!split && (
                  <ViewPanel settings={leftSettings} onChange={setLeftSettings} />
                )}
                {split && (
                  <div className="flex flex-col gap-4">
                    <ViewPanel
                      label="Left view"
                      settings={leftSettings}
                      onChange={setLeftSettings}
                    />
                    <div className="border-t border-white/[0.08]" />
                    <ViewPanel
                      label="Right view"
                      settings={rightSettings}
                      onChange={setRightSettings}
                    />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setPanelOpen(true)}
                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-black/50 text-cream/40 backdrop-blur-xl border border-white/[0.08] hover:bg-black/70 hover:text-cream hover:border-white/20 hover:scale-105 transition-all shadow-lg shadow-black/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-45 transition-transform duration-300">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
