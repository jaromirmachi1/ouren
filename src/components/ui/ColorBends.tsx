/**
 * Color Bends background — adapted from React Bits (https://reactbits.dev/backgrounds/color-bends)
 * Three.js shader with customizable color bands and motion.
 */
import { useEffect, useRef, type CSSProperties } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { getPerformanceTier } from '../../utils/performance';

const MAX_COLORS = 8 as const;

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  for (int j = 0; j < 5; j++) {
    if (j >= uIterations - 1) break;
    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q += (rr - q) * 0.15;
  }

  vec3 col = vec3(0.0);
  float a = 1.0;

  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;
    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, kMix);
      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
      sumCol += uColors[i] * w;
      cover = max(cover, w);
    }
    col = clamp(sumCol, 0.0, 1.0);
    a = uTransparent > 0 ? cover : 1.0;
  }

  col *= uIntensity;

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  vec3 rgb = (uTransparent > 0) ? col * a : col;
  gl_FragColor = vec4(rgb, a);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const Container = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
`;

export type ColorBendsProps = {
  className?: string;
  style?: CSSProperties;
  rotation?: number;
  speed?: number;
  colors?: string[];
  transparent?: boolean;
  autoRotate?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
  iterations?: number;
  intensity?: number;
  bandWidth?: number;
};

function hexToVec3(hex: string) {
  const h = hex.replace('#', '').trim();
  const v =
    h.length === 3
      ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
      : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
}

export function ColorBends({
  className,
  style,
  rotation = 90,
  speed = 0.2,
  colors = [],
  transparent = true,
  autoRotate = 0,
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  mouseInfluence = 0.6,
  parallax = 0.5,
  noise = 0.12,
  iterations = 3,
  intensity = 1.35,
  bandWidth = 6,
}: ColorBendsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rotationRef = useRef(rotation);
  const autoRotateRef = useRef(autoRotate);
  const pointerTargetRef = useRef(new THREE.Vector2(0, 0));
  const pointerCurrentRef = useRef(new THREE.Vector2(0, 0));
  const isVisibleRef = useRef(true);
  const isDocumentVisibleRef = useRef(true);
  const lowTierRef = useRef(getPerformanceTier() === 'low');

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const isLowTier = lowTierRef.current;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));

    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uRot: { value: new THREE.Vector2(1, 0) },
        uColorCount: { value: 0 },
        uColors: { value: uColorsArray },
        uTransparent: { value: transparent ? 1 : 0 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: mouseInfluence },
        uParallax: { value: parallax },
        uNoise: { value: noise },
        uIterations: { value: iterations },
        uIntensity: { value: intensity },
        uBandWidth: { value: bandWidth },
      },
      premultipliedAlpha: true,
      transparent: true,
    });

    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      alpha: true,
    });

    rendererRef.current = renderer;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(isLowTier ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, transparent ? 0 : 1);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    const handleResize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      (material.uniforms.uCanvas.value as THREE.Vector2).set(w, h);
    };

    handleResize();

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    resizeObserverRef.current = ro;

    let pointerFrame = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.parentElement?.getBoundingClientRect() ?? container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      const y = -(((event.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      pointerTargetRef.current.set(x, y);
    };

    if (!isLowTier) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    } else {
      material.uniforms.uMouseInfluence.value = 0;
      material.uniforms.uNoise.value = 0;
      material.uniforms.uIterations.value = Math.min(iterations, 2);
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );

    visibilityObserver.observe(container);

    const onDocumentVisibility = () => {
      isDocumentVisibleRef.current = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', onDocumentVisibility);

    let frameIndex = 0;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      if (!isVisibleRef.current || !isDocumentVisibleRef.current) {
        return;
      }

      if (isLowTier) {
        frameIndex += 1;
        if (frameIndex % 2 !== 0) {
          return;
        }
      }

      const dt = clock.getDelta();
      const elapsed = clock.elapsedTime;
      material.uniforms.uTime.value = elapsed;

      const deg = (rotationRef.current % 360) + autoRotateRef.current * elapsed;
      const rad = (deg * Math.PI) / 180;
      material.uniforms.uRot.value.set(Math.cos(rad), Math.sin(rad));

      if (!isLowTier) {
        pointerFrame += 1;
        if (pointerFrame % 2 === 0) {
          pointerCurrentRef.current.lerp(pointerTargetRef.current, Math.min(1, dt * 8));
          (material.uniforms.uPointer.value as THREE.Vector2).copy(pointerCurrentRef.current);
        }
      }

      renderer.render(scene, camera);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onDocumentVisibility);
      resizeObserverRef.current?.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const material = materialRef.current;
    const renderer = rendererRef.current;

    if (!material) {
      return;
    }

    rotationRef.current = rotation;
    autoRotateRef.current = autoRotate;
    material.uniforms.uSpeed.value = speed;
    material.uniforms.uScale.value = scale;
    material.uniforms.uFrequency.value = frequency;
    material.uniforms.uWarpStrength.value = warpStrength;
    material.uniforms.uMouseInfluence.value = lowTierRef.current ? 0 : mouseInfluence;
    material.uniforms.uParallax.value = parallax;
    material.uniforms.uNoise.value = lowTierRef.current ? 0 : noise;
    material.uniforms.uIterations.value = lowTierRef.current ? Math.min(iterations, 2) : iterations;
    material.uniforms.uIntensity.value = intensity;
    material.uniforms.uBandWidth.value = bandWidth;

    const arr = (colors || []).filter(Boolean).slice(0, MAX_COLORS).map(hexToVec3);

    for (let i = 0; i < MAX_COLORS; i++) {
      const vec = (material.uniforms.uColors.value as THREE.Vector3[])[i];
      if (i < arr.length) {
        vec.copy(arr[i]);
      } else {
        vec.set(0, 0, 0);
      }
    }

    material.uniforms.uColorCount.value = arr.length;
    material.uniforms.uTransparent.value = transparent ? 1 : 0;

    if (renderer) {
      renderer.setClearColor(0x000000, transparent ? 0 : 1);
    }
  }, [
    autoRotate,
    bandWidth,
    colors,
    frequency,
    intensity,
    iterations,
    mouseInfluence,
    noise,
    parallax,
    rotation,
    scale,
    speed,
    transparent,
    warpStrength,
  ]);

  return <Container className={className} ref={containerRef} style={style} />;
}
