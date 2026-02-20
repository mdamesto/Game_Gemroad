"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { areas, categoryColors } from "@/data/areas";
import type { Area } from "@/data/areas";
import DetailPanel from "./detail-panel";

// ── Constants ──────────────────────────────────────────────────────
const TERRAIN_W = 0.4;
const TERRAIN_H = 0.27;
const CAM_Y_MIN = 0.06;
const CAM_Y_MAX = 0.35;
const CAM_Y_DEFAULT = 0.18;
const BIRD_COUNT = 14;
const CLOUD_COUNT = 30;
const BG_COLOR = 0x0a2a4a;

// ── Noise helpers (for terrain displacement) ───────────────────────
function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function noise2D(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = seededRandom(ix + iy * 157.0);
  const b = seededRandom(ix + 1 + iy * 157.0);
  const c = seededRandom(ix + (iy + 1) * 157.0);
  const d = seededRandom(ix + 1 + (iy + 1) * 157.0);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

function fbm(x: number, y: number, octaves: number): number {
  let v = 0,
    amp = 0.5,
    freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * noise2D(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return v;
}

// ── Terrain height (must match vertex displacement) ────────────────
function getTerrainHeight(wx: number, wz: number): number {
  const u = wx / TERRAIN_W + 0.5;
  const v = wz / TERRAIN_H + 0.5;
  const cx = (u - 0.5) * 2;
  const cy = (v - 0.5) * 2;
  const edgeDist = Math.max(Math.abs(cx), Math.abs(cy));
  const landMask = Math.max(0, 1 - smoothstepFn(0.55, 0.95, edgeDist));
  const n1 = fbm(wx * 25, wz * 25, 5) * 0.025;
  const n2 = fbm(wx * 60 + 10, wz * 60 + 10, 3) * 0.008;
  const ridge = Math.abs(fbm(wx * 40 + 5, wz * 40 + 5, 4) - 0.5) * 0.02;
  const centerMountain = Math.max(0, 1 - Math.hypot(u - 0.45, v - 0.45) * 4) * 0.02;
  const snowMountain = Math.max(0, 1 - Math.hypot(u - 0.65, v - 0.2) * 3.5) * 0.018;
  const forestLow = Math.max(0, 1 - Math.hypot(u - 0.25, v - 0.35) * 3) * 0.005;
  return (n1 + n2 + ridge + centerMountain + snowMountain + forestLow) * landMask;
}

function smoothstepFn(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ── Component ──────────────────────────────────────────────────────
export interface CameraState {
  x: number;
  y: number;
  z: number;
}

export interface SceneTweaks {
  terrainRoughness: number;
  terrainMetalness: number;
  oceanRoughness: number;
  oceanMetalness: number;
  sunIntensity: number;
  ambientIntensity: number;
  fogDensity: number;
}

export const DEFAULT_TWEAKS: SceneTweaks = {
  terrainRoughness: 0.82,
  terrainMetalness: 0.0,
  oceanRoughness: 0.95,
  oceanMetalness: 0.0,
  sunIntensity: 1.0,
  ambientIntensity: 0.7,
  fogDensity: 1.2,
};

interface ThreeMapProps {
  mapSrc?: string;
  segments?: number;
  wireframe?: boolean;
  showTexture?: boolean;
  showMarkers?: boolean;
  showOverlay?: boolean;
  showClouds?: boolean;
  showBirds?: boolean;
  tweaks?: SceneTweaks;
  onCameraMove?: (state: CameraState) => void;
  cameraSync?: CameraState | null;
}

export default function ThreeMap({ mapSrc = "/map.jpg", segments = 512, wireframe = false, showTexture = true, showMarkers = true, showOverlay = true, showClouds = true, showBirds = true, tweaks = DEFAULT_TWEAKS, onCameraMove, cameraSync }: ThreeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    terrainMat: THREE.MeshStandardMaterial;
    markers: { mesh: THREE.Mesh; area: Area; label: THREE.Sprite }[];
    birds: { mesh: THREE.Group; vel: THREE.Vector3; reset: () => THREE.Vector3 }[];
    clouds: { mesh: THREE.Mesh; shadow: THREE.Mesh; vel: THREE.Vector3; reset: () => THREE.Vector3 }[];
    oceanMat: THREE.MeshStandardMaterial;
    sun: THREE.DirectionalLight;
    ambient: THREE.AmbientLight;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    clock: THREE.Clock;
    animId: number;
    loadedTexture: THREE.Texture | null;
  } | null>(null);

  const [activeArea, setActiveArea] = useState<Area | null>(null);
  const isDragging = useRef(false);
  const dragPrev = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const initScene = useCallback((container: HTMLDivElement) => {
    const w = container.clientWidth;
    const h = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(BG_COLOR);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG_COLOR, 1.2);

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.001, 10);
    camera.position.set(0, CAM_Y_DEFAULT, 0.08);
    camera.lookAt(0, 0, -0.02);

    // Lights — stronger directional for visible relief shading
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff8e8, 1.0);
    sun.position.set(0.3, 0.4, -0.2);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x8ab4f8, 0.25);
    fill.position.set(-0.2, 0.3, 0.3);
    scene.add(fill);

    // ── Terrain with texture + displacement ──────────────────────
    const loader = new THREE.TextureLoader();
    const seg = segments;
    const terrainGeo = new THREE.PlaneGeometry(TERRAIN_W, TERRAIN_H, seg, seg);
    terrainGeo.rotateX(-Math.PI / 2);

    // FBM noise vertex displacement
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      const u = x / TERRAIN_W + 0.5;
      const v = z / TERRAIN_H + 0.5;

      // Edge falloff — coastline drops to ocean
      const cx = (u - 0.5) * 2;
      const cy = (v - 0.5) * 2;
      const edgeDist = Math.max(Math.abs(cx), Math.abs(cy));
      const landMask = Math.max(0, 1 - smoothstepFn(0.55, 0.95, edgeDist));

      const n1 = fbm(x * 25, z * 25, 5) * 0.025;
      const n2 = fbm(x * 60 + 10, z * 60 + 10, 3) * 0.008;
      const ridge = Math.abs(fbm(x * 40 + 5, z * 40 + 5, 4) - 0.5) * 0.02;
      const centerMountain = Math.max(0, 1 - Math.hypot(u - 0.45, v - 0.45) * 4) * 0.02;
      const snowMountain = Math.max(0, 1 - Math.hypot(u - 0.65, v - 0.2) * 3.5) * 0.018;
      const forestLow = Math.max(0, 1 - Math.hypot(u - 0.25, v - 0.35) * 3) * 0.005;

      const height = (n1 + n2 + ridge + centerMountain + snowMountain + forestLow) * landMask;
      posAttr.setY(i, height);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.82,
      metalness: 0.0,
      wireframe,
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    scene.add(terrain);

    // Load texture (initial)
    loader.load(mapSrc, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      state.loadedTexture = tex;
      terrainMat.map = tex;
      terrainMat.needsUpdate = true;
    });

    // Ocean base plane
    const oceanGeo = new THREE.PlaneGeometry(2, 2);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x082540,
      roughness: 0.95,
      metalness: 0.0,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.y = -0.002;
    scene.add(ocean);

    // ── Markers ──────────────────────────────────────────────────
    const markers: { mesh: THREE.Mesh; area: Area; label: THREE.Sprite }[] = [];

    areas.forEach((area) => {
      const color = new THREE.Color(categoryColors[area.category]);

      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.002, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfffbe7 })
      );
      const terrainH = getTerrainHeight(area.position3D.x, area.position3D.z);
      const pinY = terrainH + 0.012;
      pin.position.set(area.position3D.x, pinY, area.position3D.z);

      // Vertical stem from terrain to pin
      const stemLen = pinY - terrainH;
      const stemGeo = new THREE.CylinderGeometry(0.0003, 0.0003, stemLen, 4);
      const stem = new THREE.Mesh(
        stemGeo,
        new THREE.MeshBasicMaterial({ color: 0xfffbe7, transparent: true, opacity: 0.4 })
      );
      stem.position.set(area.position3D.x, terrainH + stemLen / 2, area.position3D.z);
      scene.add(stem);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.004, 16, 16),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 })
      );
      glow.position.copy(pin.position);
      scene.add(glow);

      const ringGeo = new THREE.RingGeometry(0.004, 0.0048, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ring = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
        })
      );
      ring.position.set(area.position3D.x, pinY - 0.001, area.position3D.z);
      ring.userData.phase = Math.random() * Math.PI * 2;
      scene.add(ring);

      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      ctx.font = "500 26px Georgia, serif";
      ctx.fillStyle = "#fffbe7";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.95)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 2;
      ctx.fillText(area.title, 256, 42);

      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(canvas),
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })
      );
      label.scale.set(0.045, 0.006, 1);
      label.position.set(area.position3D.x, pinY + 0.008, area.position3D.z);
      scene.add(label);

      pin.userData = { area, ring, glow, stem };
      scene.add(pin);
      markers.push({ mesh: pin, area, label });
    });

    // ── Birds ────────────────────────────────────────────────────
    const birds: {
      mesh: THREE.Group;
      vel: THREE.Vector3;
      reset: () => THREE.Vector3;
    }[] = [];
    for (let i = 0; i < BIRD_COUNT; i++) {
      const group = new THREE.Group();
      group.add(createBird());
      const reset = (): THREE.Vector3 => {
        const angle = Math.random() * Math.PI * 2;
        const r = 0.1 + Math.random() * 0.08;
        group.position.set(
          Math.cos(angle) * r,
          0.04 + Math.random() * 0.04,
          Math.sin(angle) * r
        );
        const speed = 0.006 + Math.random() * 0.01;
        const tgt = new THREE.Vector3(
          (Math.random() - 0.5) * 0.12,
          0.04 + Math.random() * 0.03,
          (Math.random() - 0.5) * 0.12
        );
        group.lookAt(tgt);
        return tgt.sub(group.position).normalize().multiplyScalar(speed);
      };
      const vel = reset();
      scene.add(group);
      birds.push({ mesh: group, vel, reset });
    }

    // ── Clouds + projected shadows ─────────────────────────────────
    const SHADOW_OFFSET = 0.002; // hover just above terrain surface
    const clouds: {
      mesh: THREE.Mesh;
      shadow: THREE.Mesh;
      vel: THREE.Vector3;
      reset: () => THREE.Vector3;
    }[] = [];
    for (let i = 0; i < CLOUD_COUNT; i++) {
      // Cumulus only — varied sizes
      const sizeRoll = Math.random();
      let cloudW: number, density: number;
      if (sizeRoll < 0.35) {
        cloudW = 0.012 + Math.random() * 0.015;
        density = 0.2 + Math.random() * 0.15;
      } else if (sizeRoll < 0.75) {
        cloudW = 0.03 + Math.random() * 0.03;
        density = 0.3 + Math.random() * 0.15;
      } else {
        cloudW = 0.06 + Math.random() * 0.04;
        density = 0.4 + Math.random() * 0.2;
      }
      const cloudH = cloudW * (0.5 + Math.random() * 0.4);
      const altitude = 0.04 + Math.random() * 0.04;

      const cloud = createCloudMesh(cloudW, cloudH, density * 0.5);
      const shadow = createCloudShadowMesh(cloudW * 1.2, cloudH * 1.2, density * 1.2);
      scene.add(shadow);

      const startOnMap = i < CLOUD_COUNT / 2;
      const speed = 0.0008 + Math.random() * 0.002;

      const reset = (): THREE.Vector3 => {
        if (startOnMap && cloud.position.length() === 0) {
          cloud.position.set(
            (Math.random() - 0.5) * TERRAIN_W * 0.8,
            altitude,
            (Math.random() - 0.5) * TERRAIN_H * 0.8
          );
        } else {
          cloud.position.set(
            -(TERRAIN_W * 0.5 + Math.random() * 0.08),
            altitude,
            (Math.random() - 0.5) * TERRAIN_H * 0.9
          );
        }
        const sh = getTerrainHeight(cloud.position.x, cloud.position.z);
        shadow.position.set(cloud.position.x, sh + SHADOW_OFFSET, cloud.position.z);
        return new THREE.Vector3(speed, 0, (Math.random() - 0.5) * 0.0004);
      };
      const vel = reset();
      scene.add(cloud);
      clouds.push({ mesh: cloud, shadow, vel, reset });
    }

    // ── Nimbostratus — high altitude, large, thin, slow ──────────
    const NIMBO_COUNT = 5;
    for (let i = 0; i < NIMBO_COUNT; i++) {
      const nw = 0.15 + Math.random() * 0.15;
      const nh = nw * (0.3 + Math.random() * 0.2);
      const density = 0.08 + Math.random() * 0.1;
      const altitude = 0.1 + Math.random() * 0.06;

      const nimbo = createCloudMesh(nw, nh, density);
      // No terrain shadow for nimbostratus — too high & diffuse
      const dummyShadow = new THREE.Mesh();
      dummyShadow.visible = false;

      const speed = 0.0003 + Math.random() * 0.0005;
      const startOnMap = i < 3;

      const reset = (): THREE.Vector3 => {
        if (startOnMap && nimbo.position.length() === 0) {
          nimbo.position.set(
            (Math.random() - 0.5) * TERRAIN_W,
            altitude,
            (Math.random() - 0.5) * TERRAIN_H
          );
        } else {
          nimbo.position.set(
            -(TERRAIN_W * 0.6 + Math.random() * 0.1),
            altitude,
            (Math.random() - 0.5) * TERRAIN_H
          );
        }
        return new THREE.Vector3(speed, 0, (Math.random() - 0.5) * 0.0001);
      };
      const vel = reset();
      scene.add(nimbo);
      clouds.push({ mesh: nimbo, shadow: dummyShadow, vel, reset });
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-10, -10);
    const clock = new THREE.Clock();

    const state = {
      renderer,
      scene,
      camera,
      terrainMat,
      oceanMat,
      sun,
      ambient,
      markers,
      birds,
      clouds,
      raycaster,
      mouse,
      clock,
      animId: 0,
      loadedTexture: null as THREE.Texture | null,
    };

    // ── Render loop ──────────────────────────────────────────────
    const animate = () => {
      state.animId = requestAnimationFrame(animate);
      const dt = state.clock.getDelta();
      const elapsed = state.clock.getElapsedTime();

      // Pulse rings
      state.markers.forEach(({ mesh }) => {
        const ring = mesh.userData.ring as THREE.Mesh;
        if (ring) {
          const phase = (ring.userData.phase as number) || 0;
          const t = ((elapsed + phase) % 2.5) / 2.5;
          ring.scale.set(1 + t * 2, 1, 1 + t * 2);
          (ring.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - t);
        }
      });

      // Birds
      state.birds.forEach((bird) => {
        bird.mesh.position.add(bird.vel.clone().multiplyScalar(dt));
        const b = bird.mesh.children[0];
        if (b && b.children.length >= 3) {
          const flap = Math.sin(elapsed * 5 + bird.mesh.id * 1.7) * 0.45;
          b.children[1].rotation.z = flap;
          b.children[2].rotation.z = -flap;
        }
        bird.mesh.rotation.z =
          Math.sin(elapsed * 0.7 + bird.mesh.id) * 0.08;
        if (bird.mesh.position.length() > 0.22) bird.vel.copy(bird.reset());
      });

      // Clouds + shadows — drift right, shadow follows terrain height
      state.clouds.forEach((cloud) => {
        const delta = cloud.vel.clone().multiplyScalar(dt);
        cloud.mesh.position.add(delta);
        const sx = cloud.mesh.position.x;
        const sz = cloud.mesh.position.z;
        const th = getTerrainHeight(sx, sz);
        cloud.shadow.position.set(sx, th + 0.004, sz);
        if (cloud.mesh.position.x > TERRAIN_W * 0.7)
          cloud.vel.copy(cloud.reset());
      });

      // Hover detection
      state.raycaster.setFromCamera(state.mouse, state.camera);
      const hits = state.raycaster.intersectObjects(
        state.markers.map((m) => m.mesh),
        false
      );
      state.markers.forEach(({ label, mesh }) => {
        (label.material as THREE.SpriteMaterial).opacity =
          THREE.MathUtils.lerp(
            (label.material as THREE.SpriteMaterial).opacity,
            0,
            0.12
          );
        const g = mesh.userData.glow as THREE.Mesh;
        if (g)
          (g.material as THREE.MeshBasicMaterial).opacity =
            THREE.MathUtils.lerp(
              (g.material as THREE.MeshBasicMaterial).opacity,
              0.3,
              0.1
            );
      });
      if (hits.length > 0) {
        const hit = state.markers.find((m) => m.mesh === hits[0].object);
        if (hit) {
          (hit.label.material as THREE.SpriteMaterial).opacity =
            THREE.MathUtils.lerp(
              (hit.label.material as THREE.SpriteMaterial).opacity,
              1,
              0.25
            );
          const g = hit.mesh.userData.glow as THREE.Mesh;
          if (g)
            (g.material as THREE.MeshBasicMaterial).opacity =
              THREE.MathUtils.lerp(
                (g.material as THREE.MeshBasicMaterial).opacity,
                0.7,
                0.15
              );
        }
      }

      renderer.render(scene, camera);
    };

    animate();
    sceneRef.current = state;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    initScene(container);
    const handleResize = () => {
      const s = sceneRef.current;
      if (!s || !container) return;
      s.camera.aspect = container.clientWidth / container.clientHeight;
      s.camera.updateProjectionMatrix();
      s.renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      const s = sceneRef.current;
      if (s) {
        cancelAnimationFrame(s.animId);
        s.renderer.dispose();
        container.removeChild(s.renderer.domElement);
        sceneRef.current = null;
      }
    };
  }, [initScene]);

  // Swap texture when mapSrc changes
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    const loader = new THREE.TextureLoader();
    loader.load(mapSrc, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = s.renderer.capabilities.getMaxAnisotropy();
      if (s.loadedTexture) s.loadedTexture.dispose();
      s.loadedTexture = tex;
      s.terrainMat.map = tex;
      s.terrainMat.needsUpdate = true;
    });
  }, [mapSrc]);

  // Sync scene tweaks
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    s.terrainMat.roughness = tweaks.terrainRoughness;
    s.terrainMat.metalness = tweaks.terrainMetalness;
    s.terrainMat.needsUpdate = true;
    s.oceanMat.roughness = tweaks.oceanRoughness;
    s.oceanMat.metalness = tweaks.oceanMetalness;
    s.oceanMat.needsUpdate = true;
    s.sun.intensity = tweaks.sunIntensity;
    s.ambient.intensity = tweaks.ambientIntensity;
    if (s.scene.fog instanceof THREE.FogExp2) {
      s.scene.fog.density = tweaks.fogDensity;
    }
  }, [tweaks]);

  // Sync wireframe, texture & marker toggles
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    s.terrainMat.wireframe = wireframe;
    s.terrainMat.map = showTexture ? s.loadedTexture : null;
    s.terrainMat.needsUpdate = true;
    for (const m of s.markers) {
      m.mesh.visible = showMarkers;
      m.label.visible = showMarkers;
      const g = m.mesh.userData.glow as THREE.Mesh | undefined;
      const stem = m.mesh.userData.stem as THREE.Mesh | undefined;
      const ring = m.mesh.userData.ring as THREE.Mesh | undefined;
      if (g) g.visible = showMarkers;
      if (stem) stem.visible = showMarkers;
      if (ring) ring.visible = showMarkers;
    }
    for (const c of s.clouds) {
      c.mesh.visible = showClouds;
      c.shadow.visible = showClouds;
    }
    for (const b of s.birds) {
      b.mesh.visible = showBirds;
    }
  }, [wireframe, showTexture, showMarkers, showClouds, showBirds]);

  // Sync camera from the other split view
  useEffect(() => {
    const s = sceneRef.current;
    if (!s || !cameraSync) return;
    s.camera.position.set(cameraSync.x, cameraSync.y, cameraSync.z);
    s.camera.lookAt(cameraSync.x, 0, cameraSync.z - 0.06);
  }, [cameraSync]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    hasMoved.current = false;
    dragPrev.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const s = sceneRef.current;
    if (!s) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      s.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      s.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    if (!isDragging.current) return;
    const dx = e.clientX - dragPrev.current.x;
    const dy = e.clientY - dragPrev.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved.current = true;
    const panSpeed = s.camera.position.y * 0.7;
    s.camera.position.x -= (dx / window.innerWidth) * panSpeed;
    s.camera.position.z -= (dy / window.innerHeight) * panSpeed;
    const limitX = TERRAIN_W * 0.45;
    const limitZ = TERRAIN_H * 0.45;
    s.camera.position.x = THREE.MathUtils.clamp(
      s.camera.position.x,
      -limitX,
      limitX
    );
    s.camera.position.z = THREE.MathUtils.clamp(
      s.camera.position.z,
      -limitZ,
      limitZ
    );
    s.camera.lookAt(s.camera.position.x, 0, s.camera.position.z - 0.06);
    dragPrev.current = { x: e.clientX, y: e.clientY };
    onCameraMove?.({ x: s.camera.position.x, y: s.camera.position.y, z: s.camera.position.z });
  }, [onCameraMove]);

  const handlePointerUp = useCallback(() => {
    const wasClick = !hasMoved.current;
    isDragging.current = false;
    if (wasClick) {
      const s = sceneRef.current;
      if (!s) return;
      s.raycaster.setFromCamera(s.mouse, s.camera);
      const hits = s.raycaster.intersectObjects(
        s.markers.map((m) => m.mesh),
        false
      );
      if (hits.length > 0) {
        const hit = s.markers.find((m) => m.mesh === hits[0].object);
        if (hit) setActiveArea(hit.area);
      }
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const s = sceneRef.current;
    if (!s) return;
    s.camera.position.y = THREE.MathUtils.clamp(
      s.camera.position.y + (e.deltaY > 0 ? 0.008 : -0.008),
      CAM_Y_MIN,
      CAM_Y_MAX
    );
    s.camera.lookAt(s.camera.position.x, 0, s.camera.position.z - 0.06);
    onCameraMove?.({ x: s.camera.position.x, y: s.camera.position.y, z: s.camera.position.z });
  }, [onCameraMove]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", prevent, { passive: false });
    return () => el.removeEventListener("wheel", prevent);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        ref={containerRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          isDragging.current = false;
        }}
        onWheel={handleWheel}
      />
      {showOverlay && <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />}




      <DetailPanel area={activeArea} onClose={() => setActiveArea(null)} />
    </section>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────



function createBird(): THREE.Group {
  const g = new THREE.Group();
  const c = 0x1a1a2a;
  const bodyGeo = new THREE.ConeGeometry(0.0005, 0.003, 4);
  bodyGeo.rotateX(Math.PI / 2);
  g.add(new THREE.Mesh(bodyGeo, new THREE.MeshBasicMaterial({ color: c })));
  const wGeo = new THREE.PlaneGeometry(0.005, 0.0012);
  const wMat = new THREE.MeshBasicMaterial({
    color: c,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });
  const lw = new THREE.Mesh(wGeo, wMat);
  lw.position.set(-0.002, 0, 0);
  g.add(lw);
  const rw = new THREE.Mesh(wGeo.clone(), wMat.clone());
  rw.position.set(0.002, 0, 0);
  g.add(rw);
  const s = 0.2 + Math.random() * 0.3;
  g.scale.set(s, s, s);
  return g;
}

/** Generate a soft cumulus cloud canvas texture. */
function makeCloudCanvas(r: number, g: number, b: number): HTMLCanvasElement {
  const size = 512;
  const cvs = document.createElement("canvas");
  cvs.width = size;
  cvs.height = size;
  const ctx = cvs.getContext("2d")!;

  const blobCount = 10 + Math.floor(Math.random() * 8);
  for (let i = 0; i < blobCount; i++) {
    const bx = size * 0.2 + Math.random() * size * 0.6;
    const by = size * 0.2 + Math.random() * size * 0.6;
    const br = size * 0.08 + Math.random() * size * 0.18;
    const grd = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    grd.addColorStop(0, `rgba(${r},${g},${b},0.5)`);
    grd.addColorStop(0.3, `rgba(${r},${g},${b},0.25)`);
    grd.addColorStop(0.65, `rgba(${r},${g},${b},0.06)`);
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);
  }

  ctx.globalCompositeOperation = "destination-in";
  const maskGrd = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size * 0.48
  );
  maskGrd.addColorStop(0, "rgba(255,255,255,1)");
  maskGrd.addColorStop(0.5, "rgba(255,255,255,0.8)");
  maskGrd.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = maskGrd;
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = "source-over";
  return cvs;
}

/** White cloud mesh. */
function createCloudMesh(w: number, h: number, density: number): THREE.Mesh {
  const cvs = makeCloudCanvas(255, 255, 255);
  const geo = new THREE.PlaneGeometry(w, h);
  geo.rotateX(-Math.PI / 2);
  return new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(cvs),
      transparent: true,
      opacity: density,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: false,
    })
  );
}

/** Dark shadow projected on terrain beneath a cloud. */
function createCloudShadowMesh(w: number, h: number, shadowAlpha: number): THREE.Mesh {
  const cvs = makeCloudCanvas(0, 0, 0);
  const geo = new THREE.PlaneGeometry(w, h);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(cvs),
    transparent: true,
    opacity: Math.min(shadowAlpha, 0.7),
    depthWrite: false,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  return new THREE.Mesh(geo, mat);
}
