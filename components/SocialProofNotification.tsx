import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateRandomProofEvent } from './AITestimonialGenerator';

interface Notification {
  id: string;
  user: string;
  action: string;
}

export const SocialProofNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const addNotification = () => {
      const event = generateRandomProofEvent();
      const notification = {
        id: event.id,
        user: event.user,
        action: event.action,
      };

      setNotifications(prev => [...prev, notification]);

      const timer = setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== event.id));
      }, 5000);

      return () => clearTimeout(timer);
    };

    const interval = setInterval(addNotification, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-slate-800/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-text">
                <span className="font-semibold text-cyan-400">{notification.user}</span>
                {' '}
                <span className="text-muted">{notification.action}</span>
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SocialProofNotification;
