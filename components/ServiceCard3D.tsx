import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface ServiceCard3DProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  metric: string;
  accent: string;
  link?: string;
  index?: number;
}

export const ServiceCard3D: React.FC<ServiceCard3DProps> = ({
  icon,
  title,
  description,
  metric,
  accent,
  link,
  index = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = ((e.clientY - rect.top - centerY) / centerY) * 10;
    const y = ((e.clientX - rect.left - centerX) / centerX) * -10;

    setRotateX(x);
    setRotateY(y);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative h-full"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 32, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: (index || 0) * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="glass rounded-[2rem] p-6 md:p-8 h-full border border-border hover:border-cyan-500/30 transition-colors duration-300 cursor-pointer group"
        animate={{
          rotateX,
          rotateY,
          y: rotateX !== 0 ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow:
            rotateX !== 0
              ? `0 20px 60px rgba(77, 188, 159, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              : '0 4px 12px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          animate={{
            scale: rotateX !== 0 ? 1.1 : 1,
            opacity: rotateX !== 0 ? 0.3 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon with 3D effect */}
          <motion.div
            className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center ${accent} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}
            animate={{
              scale: rotateX !== 0 ? 1.1 : 1,
              rotateZ: rotateY * 0.5,
            }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{
              background: `linear-gradient(135deg, rgba(77, 188, 159, 0.2) 0%, rgba(0, 150, 130, 0.05) 100%)`,
            }}
          >
            {icon}
          </motion.div>

          {/* Title */}
          <h3 className="text-xl font-bold text-text mb-3 group-hover:text-cyan-400 transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted text-sm mb-6 leading-relaxed">
            {description}
          </p>

          {/* Metric badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/25 text-cyan-400 text-xs font-bold tracking-wider mb-6"
            animate={{
              y: rotateX !== 0 ? -2 : 0,
              scale: rotateX !== 0 ? 1.05 : 1,
            }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {metric}
          </motion.div>

          {/* Link/CTA */}
          {link && (
            <motion.a
              href={link}
              className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors group/link"
              animate={{
                x: rotateX !== 0 ? 4 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              Learn more
              <motion.div
                animate={{
                  x: rotateX !== 0 ? 4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </motion.div>
            </motion.a>
          )}
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-[2rem] opacity-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)`,
            transform: `translate(${rotateY * 2}px, ${rotateX * 2}px)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ServiceCard3D;
