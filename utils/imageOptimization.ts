/**
 * Image Optimization Utilities
 * Helpers for serving optimized images with modern formats and responsive sizes
 */

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
}

/**
 * Generate srcset for responsive images with different pixel densities
 * Usage: img srcset={generateSrcSet('/image.png')}
 */
export function generateSrcSet(src: string, sizes = [1, 2]): string {
  return sizes.map(size => `${src}?w=${size}x`).join(', ');
}

/**
 * Get WebP version of image URL
 * Converts .png, .jpg, .jpeg to .webp
 */
export function getWebPUrl(src: string): string {
  if (src.includes('?')) {
    return src.replace(/\.(png|jpe?g)(\?|$)/, '.webp$2');
  }
  return src.replace(/\.(png|jpe?g)$/, '.webp');
}

/**
 * Get AVIF version of image URL
 * Converts .png, .jpg, .jpeg to .avif
 */
export function getAvifUrl(src: string): string {
  if (src.includes('?')) {
    return src.replace(/\.(png|jpe?g)(\?|$)/, '.avif$2');
  }
  return src.replace(/\.(png|jpe?g)$/, '.avif');
}

/**
 * Generate sizes attribute for responsive images
 * Example: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
 */
export function generateSizes(breakpoints = {
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw',
}): string {
  return `(max-width: 640px) ${breakpoints.mobile}, (max-width: 1024px) ${breakpoints.tablet}, ${breakpoints.desktop}`;
}

/**
 * Preload critical image for LCP optimization
 */
export function preloadImage(src: string, as = 'image'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  link.type = 'image/webp';
  document.head.appendChild(link);
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): boolean {
  if (typeof document === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  try {
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  } catch {
    return false;
  }
}

/**
 * Recommended image dimensions for common use cases
 */
export const IMAGE_SIZES = {
  hero: { width: 1920, height: 1080 },
  ogImage: { width: 1200, height: 630 },
  twitterImage: { width: 1024, height: 512 },
  teamPhoto: { width: 400, height: 400 },
  logoSmall: { width: 200, height: 200 },
  logoLarge: { width: 400, height: 400 },
  serviceCard: { width: 600, height: 400 },
  thumbnail: { width: 300, height: 300 },
};
