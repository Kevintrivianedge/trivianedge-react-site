import React, { useState } from 'react';
import { TalentHub } from '../types';

// Simplified Mercator-ish coordinate mapper
// Converts [lng, lat] to [x%, y%] on the SVG viewBox
const project = (lng: number, lat: number): [number, number] => {
  const x = ((lng + 180) / 360) * 100;
  // Slightly compressed latitude to better fit typical world-map aspect ratio
  const y = ((90 - lat) / 180) * 100;
  return [x, y];
};

// [lng, lat] for each talent hub capital city (approximate centroids)
const HUB_COORDS: Record<string, [number, number]> = {
  lka: [80.7, 7.9],    // Sri Lanka – Colombo
  phl: [121.8, 12.9],  // Philippines – Manila
  vnm: [108.0, 15.9],  // Vietnam – Hanoi/HCMC midpoint
  tur: [35.2, 38.9],   // Turkey – Ankara
  zaf: [25.0, -29.0],  // South Africa – Johannesburg
  cri: [-84.1, 9.9],   // Costa Rica – San José
};

interface WorldMapSVGProps {
  hubs: TalentHub[];
  onHubClick?: (hub: TalentHub) => void;
}

const WorldMapSVG: React.FC<WorldMapSVGProps> = ({ hubs, onHubClick }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredHub = hubs.find(h => h.id === hoveredId) ?? null;

  return (
    <div className="relative w-full select-none">
      {/* SVG world outline — a very simplified path set */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-auto opacity-90"
        aria-label="Interactive world map showing TrivianEdge talent hubs"
        role="img"
      >
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Simplified continental outlines ──────────────────────── */}
        {/* North America */}
        <path
          d="M 105 85 L 190 80 L 215 95 L 230 115 L 220 140 L 240 155 L 245 170 L 220 190 L 205 210 L 185 235 L 170 250 L 155 255 L 145 245 L 160 230 L 158 215 L 140 200 L 125 195 L 110 185 L 100 170 L 90 150 L 95 125 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Greenland */}
        <path
          d="M 175 30 L 205 28 L 210 45 L 195 60 L 175 58 Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1"
        />
        {/* Central America */}
        <path
          d="M 185 235 L 193 245 L 195 258 L 188 260 L 180 250 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* South America */}
        <path
          d="M 210 265 L 240 255 L 265 265 L 275 285 L 285 310 L 280 340 L 265 375 L 245 395 L 225 390 L 210 370 L 200 340 L 195 310 L 200 285 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Europe */}
        <path
          d="M 430 65 L 470 60 L 495 70 L 505 85 L 490 100 L 475 105 L 460 115 L 445 110 L 435 100 L 425 88 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Africa */}
        <path
          d="M 435 140 L 470 135 L 495 145 L 510 165 L 515 195 L 510 230 L 500 260 L 485 290 L 465 315 L 445 320 L 425 310 L 410 280 L 405 250 L 410 220 L 415 190 L 420 165 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Middle East */}
        <path
          d="M 510 120 L 545 115 L 565 125 L 570 140 L 555 155 L 535 155 L 515 145 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Central Asia */}
        <path
          d="M 545 90 L 620 85 L 660 95 L 670 115 L 650 130 L 620 135 L 585 130 L 555 120 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* South Asia (India) */}
        <path
          d="M 610 145 L 650 140 L 665 155 L 670 175 L 660 195 L 645 205 L 630 200 L 615 185 L 608 165 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Southeast Asia */}
        <path
          d="M 700 155 L 730 150 L 755 160 L 765 178 L 755 195 L 735 200 L 710 192 L 698 175 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* East Asia / China */}
        <path
          d="M 670 100 L 730 90 L 770 98 L 790 115 L 800 135 L 790 152 L 765 158 L 735 155 L 705 145 L 680 132 L 665 115 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Japan */}
        <path
          d="M 805 115 L 820 110 L 828 122 L 820 133 L 808 130 Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1"
        />
        {/* Australia */}
        <path
          d="M 755 305 L 810 295 L 845 310 L 855 340 L 845 365 L 820 378 L 790 375 L 760 360 L 748 335 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />

        {/* ── Talent Hub Markers ────────────────────────────────────── */}
        {hubs.map((hub) => {
          const coords = HUB_COORDS[hub.id];
          if (!coords) return null;
          const [px, py] = project(coords[0], coords[1]);
          const cx = (px / 100) * 1000;
          const cy = (py / 100) * 500;
          const isHovered = hoveredId === hub.id;

          return (
            <g
              key={hub.id}
              onClick={() => onHubClick?.(hub)}
              onMouseEnter={() => setHoveredId(hub.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={`${hub.country} talent hub: ${hub.specialty}`}
            >
              {/* Outer pulse ring */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 22 : 16}
                fill="rgba(34,211,238,0.08)"
                stroke="rgba(34,211,238,0.3)"
                strokeWidth="1"
                style={{ transition: 'r 0.3s ease' }}
              />
              {/* Inner dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 8 : 5}
                fill={isHovered ? '#22d3ee' : 'rgba(34,211,238,0.7)'}
                style={{ transition: 'r 0.3s ease, fill 0.3s ease' }}
              />
              {/* Pulsing animation ring */}
              {isHovered && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={28}
                  fill="none"
                  stroke="rgba(34,211,238,0.2)"
                  strokeWidth="1.5"
                  className="animate-ping"
                />
              )}
              {/* Flag label */}
              <text
                x={cx}
                y={cy - 22}
                textAnchor="middle"
                fontSize={isHovered ? '18' : '14'}
                style={{ transition: 'font-size 0.2s ease', userSelect: 'none' }}
              >
                {hub.flag}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip / info card */}
      {hoveredHub && (
        <div className="absolute top-4 right-4 glass p-5 rounded-2xl border border-cyan-500/30 max-w-xs pointer-events-none animate-fade-in shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{hoveredHub.flag}</span>
            <div>
              <p className="font-bold text-text text-sm">{hoveredHub.country}</p>
              <p className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest">{hoveredHub.specialty}</p>
            </div>
          </div>
          <p className="text-muted text-xs leading-relaxed line-clamp-3">{hoveredHub.description}</p>
          <p className="mt-3 text-[10px] font-bold text-muted uppercase tracking-widest">{hoveredHub.timeZoneAlignment}</p>
        </div>
      )}
    </div>
  );
};

export default WorldMapSVG;
