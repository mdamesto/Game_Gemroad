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
        className="flex-1 h-1 accent-cream/60"
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
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-[10px] font-sans tracking-widest uppercase text-cream/40">
          {label}
        </span>
      )}

      {/* Map select */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-cream/50 w-14">Map</span>
        <div className="flex gap-1">
          {MAP_OPTIONS.map((m) => (
            <button
              key={m.value}
              onClick={() => onChange({ ...settings, mapSrc: m.value })}
              className={`px-2 py-0.5 rounded text-[10px] font-sans transition-all ${
                settings.mapSrc === m.value
                  ? "bg-cream/15 text-cream"
                  : "text-cream/40 hover:text-cream/70"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Segments select */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-cream/50 w-14">Segments</span>
        <div className="flex gap-1">
          {SEGMENT_OPTIONS.map((seg) => (
            <button
              key={seg}
              onClick={() => onChange({ ...settings, segments: seg })}
              className={`px-2 py-0.5 rounded text-[10px] font-sans transition-all ${
                settings.segments === seg
                  ? "bg-cream/15 text-cream"
                  : "text-cream/40 hover:text-cream/70"
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.wireframe}
            onChange={(e) =>
              onChange({ ...settings, wireframe: e.target.checked })
            }
            className="accent-cream/60 w-3 h-3"
          />
          <span className="text-[10px] text-cream/50 font-sans">Wireframe</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showTexture}
            onChange={(e) =>
              onChange({ ...settings, showTexture: e.target.checked })
            }
            className="accent-cream/60 w-3 h-3"
          />
          <span className="text-[10px] text-cream/50 font-sans">Texture</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showMarkers}
            onChange={(e) =>
              onChange({ ...settings, showMarkers: e.target.checked })
            }
            className="accent-cream/60 w-3 h-3"
          />
          <span className="text-[10px] text-cream/50 font-sans">Markers</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showOverlay}
            onChange={(e) =>
              onChange({ ...settings, showOverlay: e.target.checked })
            }
            className="accent-cream/60 w-3 h-3"
          />
          <span className="text-[10px] text-cream/50 font-sans">Overlay</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showClouds}
            onChange={(e) =>
              onChange({ ...settings, showClouds: e.target.checked })
            }
            className="accent-cream/60 w-3 h-3"
          />
          <span className="text-[10px] text-cream/50 font-sans">Clouds</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showBirds}
            onChange={(e) =>
              onChange({ ...settings, showBirds: e.target.checked })
            }
            className="accent-cream/60 w-3 h-3"
          />
          <span className="text-[10px] text-cream/50 font-sans">Birds</span>
        </label>
      </div>

      {/* Scene tweaks */}
      <details className="mt-2 group">
        <summary className="text-[10px] font-sans tracking-widest uppercase text-cream/40 cursor-pointer hover:text-cream/60 list-none flex items-center gap-1">
          <span className="text-[8px] group-open:rotate-90 transition-transform">&#9654;</span>
          Scene values
        </summary>
        <div className="mt-2 flex flex-col gap-1.5">
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

          {/* Debug panel */}
          <div className="fixed bottom-6 left-6 z-40">
            {panelOpen ? (
              <div className="rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 p-4 min-w-[260px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-sans tracking-widest uppercase text-cream/70">
                    Debug
                  </span>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="text-cream/40 hover:text-cream text-sm leading-none"
                  >
                    &times;
                  </button>
                </div>

                {/* Split toggle */}
                <label className="flex items-center gap-2 cursor-pointer mb-3 pb-3 border-b border-white/10">
                  <input
                    type="checkbox"
                    checked={split}
                    onChange={(e) => setSplit(e.target.checked)}
                    className="accent-cream/60 w-3 h-3"
                  />
                  <span className="text-[10px] text-cream/50 font-sans uppercase tracking-wider">
                    Split view
                  </span>
                </label>

                {/* Settings */}
                {!split && (
                  <ViewPanel settings={leftSettings} onChange={setLeftSettings} />
                )}
                {split && (
                  <div className="flex flex-col gap-3">
                    <ViewPanel
                      label="Left"
                      settings={leftSettings}
                      onChange={setLeftSettings}
                    />
                    <div className="border-t border-white/10" />
                    <ViewPanel
                      label="Right"
                      settings={rightSettings}
                      onChange={setRightSettings}
                    />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setPanelOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/40 text-cream/50 backdrop-blur-sm hover:bg-black/60 hover:text-cream transition-all text-xs font-sans"
              >
                ⚙
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
