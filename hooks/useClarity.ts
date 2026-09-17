import { useEffect } from 'react';

interface ClarityWindow extends Window {
  clarity?: {
    event: (eventName: string, eventData?: Record<string, any>) => void;
    [key: string]: any;
  };
}

export const useClarity = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Clarity is initialized via script tag in index.html
      // This hook verifies it's loaded and provides utility functions
      const clarityWindow = window as ClarityWindow;

      if (!clarityWindow.clarity) {
        console.debug('Clarity not yet loaded');
      }
    } catch (error) {
      console.warn('Clarity hook initialization error:', error);
    }
  }, []);

  return {
    // Track custom events via Clarity window API
    trackEvent: (eventName: string, eventData?: Record<string, any>) => {
      try {
        const clarityWindow = window as ClarityWindow;
        if (clarityWindow.clarity?.event) {
          clarityWindow.clarity.event(eventName, eventData);
        }
      } catch (error) {
        console.warn('Clarity event tracking error:', error);
      }
    },

    // Log page view
    logPageView: (pageName: string, metadata?: Record<string, any>) => {
      try {
        const clarityWindow = window as ClarityWindow;
        if (clarityWindow.clarity?.event) {
          clarityWindow.clarity.event('page_view', {
            page: pageName,
            ...metadata,
          });
        }
      } catch (error) {
        console.warn('Clarity page view error:', error);
      }
    },

    // Check if Clarity is available
    isAvailable: (): boolean => {
      const clarityWindow = window as ClarityWindow;
      return Boolean(clarityWindow.clarity);
    },
  };
};

export default useClarity;
