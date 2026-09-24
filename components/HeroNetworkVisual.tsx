import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Abstract network graphic for the hero background: nodes connected by edges,
 * with pulses traveling along a few edges. Represents the thing this page is
 * actually about (a distributed operations network across six countries,
 * running continuously) rather than being decoration for its own sake — see
 * the design audit note in App.tsx above the hero section for why this
 * replaced a bare mesh-gradient background with no real visual.
 *
 * Deliberately abstract, not a literal map (the real geographic map with
 * pins lives further down the page in WorldMapLazy) — this is texture, not
 * a second copy of that content.
 *
 * The wrapper this renders into (see App.tsx) is already positioned to
 * exclude the text/CTA column via a fixed pixel left-offset, not a
 * percentage, so this component doesn't need to bias node positions away
 * from any particular side — it just fills whatever box it's given. Square
 * viewBox with preserveAspectRatio="slice" would still be wrong here (it
 * crops hard on a wide-but-short container), hence the 4:3-ish default below,
 * closer to the wrapper's actual proportions once the left offset is applied.
 *
 * Node positions are generated once with a seeded PRNG so they're stable
 * across renders/hydration (no layout shift, no hydration mismatch) without
 * hand-coding forty magic-number coordinates.
 */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VB_W = 1000;
const VB_H = 900;
const NODE_COUNT = 16;
// A small margin so nodes/glow don't get clipped right at the box edge.
const X_MIN = VB_W * 0.04;
const X_MAX = VB_W * 0.96;
const Y_MIN = VB_H * 0.06;
const Y_MAX = VB_H * 0.96;

function buildNetwork() {
  const rand = mulberry32(7211);
  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: i,
    x: X_MIN + rand() * (X_MAX - X_MIN),
    y: Y_MIN + rand() * (Y_MAX - Y_MIN),
    r: 2.5 + rand() * 2.5,
  }));

  // Connect each node to its two nearest neighbours, de-duplicated, which
  // produces an organic mesh instead of either a grid or total randomness.
  const edgeKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const edgeSet = new Set<string>();
  const edges: { a: typeof nodes[0]; b: typeof nodes[0] }[] = [];

  for (const node of nodes) {
    const distances = nodes
      .filter((n) => n.id !== node.id)
      .map((n) => ({ n, d: Math.hypot(n.x - node.x, n.y - node.y) }))
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    for (const { n } of distances) {
      const key = edgeKey(node.id, n.id);
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({ a: node, b: n });
      }
    }
  }

  return { nodes, edges };
}

const { nodes, edges } = buildNetwork();
// Multiple edges carry animated pulses for continuous activity feel
const PULSE_EDGE_INDICES = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];

const HeroNetworkVisual: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const pulseEdges = useMemo(
    () => PULSE_EDGE_INDICES.map((i) => edges[i % edges.length]),
    [],
  );

  return (
    <motion.svg
      aria-hidden="true"
      width="100%"
      height="100%"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 pointer-events-none select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <defs>
        <radialGradient id="hero-node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {edges.map(({ a, b }, i) => (
        <line
          key={`edge-${i}`}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeOpacity="0.25"
        />
      ))}

      {nodes.map((n, idx) => (
        <g key={`node-${n.id}`}>
          {/* Pulsing outer glow */}
          {!shouldReduceMotion && (
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r * 5}
              fill="url(#hero-node-glow)"
              opacity="0.15"
            >
              <animate
                attributeName="r"
                values={`${n.r * 5};${n.r * 7};${n.r * 5}`}
                dur="3s"
                begin={`${idx * 0.2}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.1;0.3"
                dur="3s"
                begin={`${idx * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
          )}

          {/* Static glow */}
          <circle cx={n.x} cy={n.y} r={n.r * 5} fill="url(#hero-node-glow)" opacity="0.18" />

          {/* Core node */}
          <circle cx={n.x} cy={n.y} r={n.r} fill="#ffffff" fillOpacity="0.65" />

          {/* Subtle inner glow */}
          <circle cx={n.x} cy={n.y} r={n.r * 0.6} fill="#ffffff" fillOpacity="0.35" />
        </g>
      ))}

      {!shouldReduceMotion &&
        pulseEdges.map(({ a, b }, i) => (
          <g key={`pulse-${i}`}>
            {/* Glow halo */}
            <circle r="6" fill="#4DBC9F" fillOpacity="0">
              <animateMotion
                dur={`${3.5 + (i % 3)}s`}
                begin={`${i * 0.7}s`}
                repeatCount="indefinite"
                path={`M${a.x},${a.y} L${b.x},${b.y}`}
              />
              <animate
                attributeName="fillOpacity"
                values="0;0.3;0.3;0"
                keyTimes="0;0.08;0.9;1"
                dur={`${3.5 + (i % 3)}s`}
                begin={`${i * 0.7}s`}
                repeatCount="indefinite"
              />
            </circle>

            {/* Core pulse */}
            <circle r="3.5" fill="#ffffff">
              <animateMotion
                dur={`${3.5 + (i % 3)}s`}
                begin={`${i * 0.7}s`}
                repeatCount="indefinite"
                path={`M${a.x},${a.y} L${b.x},${b.y}`}
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                keyTimes="0;0.08;0.9;1"
                dur={`${3.5 + (i % 3)}s`}
                begin={`${i * 0.7}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
    </motion.svg>
  );
};

export default HeroNetworkVisual;
