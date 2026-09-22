import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 z-50 origin-left"
      style={{ width: `${progress}%` }}
      transition={{ type: 'tween', duration: 0.1 }}
    />
  );
};

export default ScrollProgressBar;
