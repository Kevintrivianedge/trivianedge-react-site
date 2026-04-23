import React from 'react';

interface TickerItem {
  label: string;
  value?: string;
}

interface MarqueeTickerProps {
  items: TickerItem[];
  speed?: number;
  /** reverse scrolling direction */
  reverse?: boolean;
}

const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ items, speed = 35, reverse = false }) => {
  // Triplicate the list so the seamless loop never shows a gap
  const list = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden w-full py-5 border-y border-border/40">
      {/* Edge fade masks */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
          width: 'max-content',
        }}
      >
        {list.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-6 text-sm"
          >
            {item.value && (
              <span className="font-bold text-cyan-400 tabular-nums">{item.value}</span>
            )}
            <span className="text-muted font-medium">{item.label}</span>
            <span className="mx-3 text-border select-none opacity-60">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeTicker;
