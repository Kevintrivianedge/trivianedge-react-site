import React, { useState } from 'react';
import world from '@svg-maps/world';
import { TalentHub } from '../types';

const project = (lng: number, lat: number): [number, number] => {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return [x, y];
};

const HUB_COORDS: Record<string, [number, number]> = {
  lka: [80.7, 7.9],
  phl: [121.8, 12.9],
  vnm: [108.0, 15.9],
  tur: [35.2, 38.9],
  zaf: [25.0, -29.0],
  cri: [-84.1, 9.9],
};

interface WorldMapSVGProps {
  hubs: TalentHub[];
  onHubClick?: (hub: TalentHub) => void;
}

const WorldMapSVG: React.FC<WorldMapSVGProps> = ({ hubs, onHubClick }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredHub = hubs.find(h => h.id === hoveredId) ?? null;
  const [viewX, viewY, viewWidth, viewHeight] = world.viewBox.split(' ').map(Number);

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={world.viewBox}
        className="w-full h-auto opacity-90"
        aria-label="Interactive world map showing TrivianEdge talent hubs"
        role="img"
      >
        {world.locations.map((location) => (
          <path
            key={location.id}
            d={location.path}
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="0.9"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {hubs.map((hub) => {
          const coords = HUB_COORDS[hub.id];
          if (!coords) return null;
          const [px, py] = project(coords[0], coords[1]);
          const cx = viewX + (px / 100) * viewWidth;
          const cy = viewY + (py / 100) * viewHeight;
          const isHovered = hoveredId === hub.id;

          return (
            <g
              key={hub.id}
              onClick={() => onHubClick?.(hub)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onHubClick?.(hub);
                }
              }}
              onMouseEnter={() => setHoveredId(hub.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              aria-label={`${hub.country} talent hub: ${hub.specialty}`}
            >
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 22 : 16}
                fill="rgba(34,211,238,0.08)"
                stroke="rgba(34,211,238,0.3)"
                strokeWidth="1"
                style={{ transition: 'r 0.3s ease' }}
              />
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 8 : 5}
                fill={isHovered ? '#22d3ee' : 'rgba(34,211,238,0.7)'}
                style={{ transition: 'r 0.3s ease, fill 0.3s ease' }}
              />
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

      <p className="mt-2 text-[10px] text-muted/70 text-right">Map data © MapSVG (CC BY 4.0)</p>

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
