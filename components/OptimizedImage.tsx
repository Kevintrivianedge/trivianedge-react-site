import React, { ImgHTMLAttributes } from 'react';
import { getWebPUrl, getAvifUrl, generateSizes } from '../utils/imageOptimization';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  responsive?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

/**
 * OptimizedImage Component
 * Serves modern image formats (AVIF, WebP) with PNG/JPG fallback
 * Implements responsive sizing and lazy loading
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  responsive = true,
  sizes,
  width,
  height,
  loading = 'lazy',
  className = '',
  ...props
}) => {
  const webpSrc = getWebPUrl(src);
  const avifSrc = getAvifUrl(src);
  const responsiveSizes = responsive ? (sizes || generateSizes()) : undefined;

  // Prevent layout shift with aspect ratio
  const aspectRatioStyle = width && height ? { aspectRatio: `${width} / ${height}` } : {};

  return (
    <picture>
      {/* AVIF: Smallest, best compression */}
      <source srcSet={avifSrc} type="image/avif" sizes={responsiveSizes} />

      {/* WebP: Good compression, broad support */}
      <source srcSet={webpSrc} type="image/webp" sizes={responsiveSizes} />

      {/* Fallback: Original format */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        width={width}
        height={height}
        className={`max-w-full h-auto ${className}`}
        style={aspectRatioStyle}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;
