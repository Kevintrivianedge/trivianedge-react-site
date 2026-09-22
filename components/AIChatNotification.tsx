import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Code2, Users2, ShieldCheck } from 'lucide-react';

interface AINotification {
  id: string;
  title: string;
  message: string;
  icon: React.ReactNode;
  cta?: string;
  link?: string;
}

export const AIChatNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<AINotification | null>(null);

  const notifications: AINotification[] = [
    {
      id: '1',
      title: 'Interested in IT Outsourcing?',
      message: 'Build custom software with dedicated offshore engineers in your timezone.',
      icon: <Code2 className="w-5 h-5" />,
      cta: 'Explore IT Outsourcing',
      link: '/services/it-outsourcing',
    },
    {
      id: '2',
      title: 'Hiring for BPO Support?',
      message: 'We deploy experienced support specialists within 30 days.',
      icon: <Users2 className="w-5 h-5" />,
      cta: 'Learn About BPO',
      link: '/services/bpo',
    },
    {
      id: '3',
      title: 'Looking to Fill Your Pipeline?',
      message: 'Let us run your recruitment process with our RPO solution.',
      icon: <ShieldCheck className="w-5 h-5" />,
      cta: 'See RPO Services',
      link: '/services/rpo',
    },
  ];

  useEffect(() => {
    // Show initial notification after 3 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      setCurrentNotification(notifications[0]);
    }, 3000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!isVisible || !currentNotification) return;

    // Rotate notifications every 8 seconds
    const rotateTimer = setInterval(() => {
      setCurrentNotification(prev => {
        if (!prev) return notifications[0];
        const currentIndex = notifications.findIndex(n => n.id === prev.id);
        const nextIndex = (currentIndex + 1) % notifications.length;
        return notifications[nextIndex];
      });
    }, 8000);

    return () => clearInterval(rotateTimer);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          className="fixed bottom-6 right-6 max-w-sm z-40"
          initial={{ opacity: 0, x: 400, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 400, y: 100 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        >
          <motion.div
            className="glass rounded-2xl border border-cyan-500/30 p-4 shadow-2xl bg-gradient-to-br from-cyan-500/10 to-transparent"
            animate={{
              boxShadow: [
                '0 20px 60px rgba(0, 196, 154, 0.15)',
                '0 20px 80px rgba(0, 196, 154, 0.25)',
                '0 20px 60px rgba(0, 196, 154, 0.15)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <div className="flex gap-3">
              {/* Icon */}
              <motion.div
                className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {currentNotification.icon}
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <motion.div
                  key={currentNotification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <h4 className="font-bold text-text text-sm">
                        {currentNotification.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-muted text-xs leading-relaxed mb-3">
                    {currentNotification.message}
                  </p>
                  {currentNotification.cta && (
                    <a
                      href={currentNotification.link || '#'}
                      className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group"
                    >
                      {currentNotification.cta}
                      <motion.span
                        animate={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </a>
                  )}
                </motion.div>
              </div>

              {/* Close button */}
              <motion.button
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0 text-muted hover:text-text transition-colors p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Progress indicator */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatNotification;
