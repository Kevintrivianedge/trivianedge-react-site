import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// Dotted canvas globe showing Toronto HQ and the six talent hubs, with arcs
// from HQ to each hub. Replaces the static SVG world map. No dependencies:
// a Fibonacci-sphere point cloud projected orthographically each frame.
// Pauses when off-screen or when the tab is hidden; renders one static frame
// under prefers-reduced-motion.

export interface GlobePoint {
  label: string;
  lat: number;
  lon: number;
  hq?: boolean;
}

export const GLOBE_POINTS: GlobePoint[] = [
  { label: 'Toronto', lat: 43.65, lon: -79.38, hq: true },
  { label: 'Philippines', lat: 14.6, lon: 121.0 },
  { label: 'Vietnam', lat: 10.8, lon: 106.7 },
  { label: 'Sri Lanka', lat: 6.9, lon: 79.9 },
  { label: 'Turkey', lat: 41.0, lon: 29.0 },
  { label: 'South Africa', lat: -33.9, lon: 18.4 },
  { label: 'Costa Rica', lat: 9.9, lon: -84.1 },
];

const DOTS_DESKTOP = 1200;
const DOTS_MOBILE = 600;
const FRAME_MS = 1000 / 30; // 30fps is plenty for a slow rotation
const ALPHA_BUCKETS = 6;
const TILT = 0.38; // radians, tilts the north pole toward the viewer
const ACCENT = '77, 188, 159'; // logo jade #4DBC9F

type Vec3 = [number, number, number];

const fromLatLon = (lat: number, lon: number): Vec3 => {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lon * Math.PI) / 180;
  return [Math.cos(phi) * Math.sin(lambda), Math.sin(phi), Math.cos(phi) * Math.cos(lambda)];
};

const COS_TILT = Math.cos(TILT), SIN_TILT = Math.sin(TILT);
const ARC_STEPS = 40;

// Trig for the yaw is computed once per frame, not once per point.
const rotator = (yaw: number) => {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  return ([x, y, z]: Vec3): Vec3 => {
    const z1 = -x * sy + z * cy;
    return [x * cy + z * sy, y * COS_TILT - z1 * SIN_TILT, y * SIN_TILT + z1 * COS_TILT];
  };
};

// Spherical interpolation, lifted off the surface mid-arc.
const arcPoint = (a: Vec3, b: Vec3, t: number): Vec3 => {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const s = Math.sin(omega) || 1;
  const wa = Math.sin((1 - t) * omega) / s;
  const wb = Math.sin(t * omega) / s;
  const lift = 1 + 0.22 * Math.sin(Math.PI * t) * (omega / Math.PI + 0.3);
  return [(a[0] * wa + b[0] * wb) * lift, (a[1] * wa + b[1] * wb) * lift, (a[2] * wa + b[2] * wb) * lift];
};

const OpsGlobe: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const golden = Math.PI * (3 - Math.sqrt(5));
    const count = window.innerWidth <= 768 ? DOTS_MOBILE : DOTS_DESKTOP;
    const dots: Vec3[] = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r];
    });
    const hq = GLOBE_POINTS.find(p => p.hq)!;
    const hqVec = fromLatLon(hq.lat, hq.lon);
    const pins = GLOBE_POINTS.map(p => ({ ...p, v: fromLatLon(p.lat, p.lon) }));
    // Arcs are fixed on the sphere, so slerp them once; frames only rotate.
    const arcs = pins.map(p => (p.hq ? [] : Array.from({ length: ARC_STEPS + 1 }, (_, i) => arcPoint(hqVec, p.v, i / ARC_STEPS))));
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const frameMs = isMobile ? FRAME_MS * 1.5 : FRAME_MS;

    let size = 0;
    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.min(rect.width, rect.height);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Start facing roughly between the Americas and Asia so most arcs are visible.
    let yaw = 1.2;
    let raf = 0;
    let visible = true;
    let started = false; // first frame waits for idle-after-load; see start()
    let animating = false; // rotation waits for first interaction or a quiet delay
    let last = performance.now();

    // Dots are drawn in a few alpha buckets, one path each, instead of one
    // fillStyle change per dot; this is the bulk of the per-frame cost.
    const buckets: number[][] = Array.from({ length: ALPHA_BUCKETS }, () => []);

    const draw = (now: number) => {
      if (!reduceMotion && visible && animating) raf = requestAnimationFrame(draw);
      const dt = now - last;
      if (dt < frameMs && !reduceMotion && animating) return;
      last = now;
      if (!reduceMotion && animating) yaw += Math.min(dt, 64) * 0.00012;
      const rotate = rotator(yaw);

      const w = canvas.width, h = canvas.height;
      const R = size * dpr * 0.42;
      const cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      // Soft limb glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.25);
      glow.addColorStop(0, `rgba(${ACCENT}, 0.10)`);
      glow.addColorStop(1, `rgba(${ACCENT}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Point cloud; back hemisphere dimmed rather than hidden for depth.
      for (const b of buckets) b.length = 0;
      for (const d of dots) {
        const [x, y, z] = rotate(d);
        const bi = z > 0 ? 1 + Math.min(ALPHA_BUCKETS - 2, Math.floor(z * (ALPHA_BUCKETS - 1))) : 0;
        buckets[bi].push(cx + x * R, cy - y * R);
      }
      buckets.forEach((pts, bi) => {
        if (!pts.length) return;
        const alpha = bi === 0 ? 0.05 : 0.18 + (bi / (ALPHA_BUCKETS - 1)) * 0.5;
        const s = (bi === 0 ? 0.9 : 1.3) * dpr;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i += 2) ctx.rect(pts[i] - s / 2, pts[i + 1] - s / 2, s, s);
        ctx.fill();
      });

      // Arcs HQ → hubs with a travelling pulse
      const phase = reduceMotion ? 0.6 : (now / 2600) % 1;
      pins.forEach((p, i) => {
        if (p.hq) return;
        ctx.beginPath();
        const arc = arcs[i].map(rotate);
        let penDown = false;
        for (const [x, y, z] of arc) {
          if (z < -0.15) { penDown = false; continue; }
          const px = cx + x * R, py = cy - y * R;
          if (!penDown) { ctx.moveTo(px, py); penDown = true; } else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(${ACCENT}, 0.35)`;
        ctx.lineWidth = 1 * dpr;
        ctx.stroke();

        const t = (phase + i * 0.17) % 1;
        const [x, y, z] = arc[Math.round(t * ARC_STEPS)];
        if (z > -0.15) {
          ctx.fillStyle = `rgba(${ACCENT}, 0.95)`;
          ctx.beginPath();
          ctx.arc(cx + x * R, cy - y * R, 2.2 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Pins + labels (front hemisphere only)
      ctx.font = `${500} ${11 * dpr}px Manrope, system-ui, sans-serif`;
      for (const p of pins) {
        const [x, y, z] = rotate(p.v);
        if (z <= 0.05) continue;
        const px = cx + x * R, py = cy - y * R;
        ctx.fillStyle = p.hq ? '#ffffff' : `rgb(${ACCENT})`;
        ctx.beginPath();
        ctx.arc(px, py, (p.hq ? 4 : 3) * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${ACCENT}, ${0.5 * z})`;
        ctx.beginPath();
        ctx.arc(px, py, (p.hq ? 9 : 7) * dpr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${0.35 + z * 0.55})`;
        ctx.fillText(p.hq ? `${p.label} · HQ` : p.label, px + 12 * dpr, py + 4 * dpr);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      cancelAnimationFrame(raf);
      if (visible && started) { last = performance.now(); raf = requestAnimationFrame(draw); }
    });
    io.observe(canvas);
    const onVisibility = () => {
      visible = !document.hidden;
      cancelAnimationFrame(raf);
      if (visible && started) { last = performance.now(); raf = requestAnimationFrame(draw); }
    };
    document.addEventListener('visibilitychange', onVisibility);
    // Draw one static frame when idle, then rotate only after the visitor
    // interacts (or after a quiet delay), keeping the load window free of
    // per-frame work.
    let idleId = 0;
    let delayId = 0;
    const INTERACTIONS = ['pointerdown', 'pointermove', 'scroll', 'keydown', 'touchstart'] as const;
    const animate = () => {
      if (animating) return;
      animating = true;
      INTERACTIONS.forEach(e => window.removeEventListener(e, animate));
      window.clearTimeout(delayId);
      if (started && visible) { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(draw); }
    };
    const start = () => {
      const ric = (window as any).requestIdleCallback as ((cb: () => void, o?: { timeout: number }) => number) | undefined;
      const kick = () => {
        started = true;
        last = 0;
        raf = requestAnimationFrame(draw);
        if (reduceMotion) return;
        INTERACTIONS.forEach(e => window.addEventListener(e, animate, { once: true, passive: true }));
        delayId = window.setTimeout(animate, 6000);
      };
      idleId = ric ? ric(kick, { timeout: 2500 }) : window.setTimeout(kick, 1200);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', start);
      ((window as any).cancelIdleCallback ?? window.clearTimeout)(idleId);
      window.clearTimeout(delayId);
      INTERACTIONS.forEach(e => window.removeEventListener(e, animate));
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Globe showing TrivianEdge headquarters in Toronto connected to talent hubs in the Philippines, Vietnam, Sri Lanka, Turkey, South Africa, and Costa Rica"
      className={`block w-full h-full ${className}`}
    />
  );
};

export default OpsGlobe;
