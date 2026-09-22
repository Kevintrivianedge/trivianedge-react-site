import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, MapPin } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  skills: string[];
  avatar?: string;
  email?: string;
  linkedin?: string;
}

interface TeamMemberCard3DProps {
  member: TeamMember;
  index?: number;
}

export const TeamMemberCard3D: React.FC<TeamMemberCard3DProps> = ({ member, index = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isFlipped) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = ((e.clientY - rect.top - centerY) / centerY) * 15;
    const y = ((e.clientX - rect.left - centerX) / centerX) * -15;

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
      className="relative h-full perspective"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: (index || 0) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="w-full h-full"
        animate={{
          rotateX,
          rotateY,
          rotateZ: isFlipped ? 180 : 0,
        }}
        onClick={() => setIsFlipped(!isFlipped)}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
        }}
      >
        {/* Front of card */}
        <motion.div
          className="glass rounded-2xl p-6 h-full border border-border hover:border-cyan-500/30 transition-colors duration-300 flex flex-col items-center text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          animate={{
            boxShadow:
              rotateX !== 0
                ? '0 20px 60px rgba(0, 196, 154, 0.2)'
                : '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Avatar placeholder */}
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/30 to-cyan-500/30 flex items-center justify-center mb-4 border border-cyan-400/30"
            animate={{
              scale: isFlipped ? 0 : [1, 1.05, 1],
            }}
            transition={{
              scale: {
                duration: 2,
                repeat: Infinity,
                delay: index,
              },
            }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
          </motion.div>

          {/* Name and role */}
          <h3 className="text-xl font-bold text-text mb-1">{member.name}</h3>
          <p className="text-cyan-400 text-sm font-semibold mb-2">{member.role}</p>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted text-xs mb-4">
            <MapPin className="w-3 h-3" />
            {member.location}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {member.skills.slice(0, 3).map(skill => (
              <span
                key={skill}
                className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Click hint */}
          <motion.p
            className="text-xs text-muted/60 mt-auto"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click to learn more
          </motion.p>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="glass rounded-2xl p-6 h-full border border-border absolute inset-0 flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Bio section */}
          <div className="flex-1 mb-4">
            <h4 className="font-bold text-text mb-2">About</h4>
            <p className="text-muted text-sm leading-relaxed">{member.bio}</p>
          </div>

          {/* Skills - expanded */}
          <div className="mb-4">
            <h4 className="font-bold text-text mb-2 text-sm">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {member.skills.map(skill => (
                <span
                  key={skill}
                  className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex gap-2">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-xs"
              >
                <Mail className="w-3 h-3" />
                Email
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-xs"
              >
                <Linkedin className="w-3 h-3" />
                Profile
              </a>
            )}
          </div>

          {/* Click to flip hint */}
          <p className="text-xs text-muted/60 text-center mt-3">Click to flip</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TeamMemberCard3D;
