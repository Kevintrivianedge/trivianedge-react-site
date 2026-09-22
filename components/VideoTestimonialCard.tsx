import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoTestimonialCardProps {
  videoUrl: string;
  posterUrl?: string;
  name: string;
  title: string;
  company: string;
  quote: string;
  index?: number;
}

export const VideoTestimonialCard: React.FC<VideoTestimonialCardProps> = ({
  videoUrl,
  posterUrl,
  name,
  title,
  company,
  quote,
  index = 0,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(
        (videoRef.current.currentTime / videoRef.current.duration) * 100
      );
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime =
        (newProgress / 100) * videoRef.current.duration;
      setProgress(newProgress);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="rounded-2xl overflow-hidden border border-border bg-slate-900/50 backdrop-blur group hover:border-cyan-500/30 transition-colors duration-300"
    >
      {/* Video container */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          muted={isMuted}
          className="w-full h-full object-cover"
        />

        {/* Overlay gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          animate={{ opacity: isPlaying ? 0.3 : 0.6 }}
          transition={{ duration: 0.3 }}
        />

        {/* Play button */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-cyan-400/90 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-7 h-7 text-black ml-1" fill="black" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Controls */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
          animate={{ opacity: isPlaying ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-slate-600 rounded-full appearance-none cursor-pointer accent-cyan-400 mb-3"
          />

          {/* Control buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handlePlayPause}
              className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
              )}
            </motion.button>

            <motion.button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Quote section */}
      <div className="p-6 space-y-4">
        <motion.blockquote
          className="text-text italic text-base leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.2 }}
        >
          "{quote}"
        </motion.blockquote>

        {/* Metadata */}
        <motion.div
          className="pt-4 border-t border-border/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.3 }}
        >
          <p className="font-semibold text-text text-sm">{name}</p>
          <p className="text-muted text-xs">{title} at {company}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VideoTestimonialCard;
