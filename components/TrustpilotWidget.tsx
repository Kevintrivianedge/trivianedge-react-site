import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (el: HTMLElement, forceReload?: boolean) => void;
    };
  }
}

const TRUSTPILOT_SCRIPT_SRC = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';

// Review Collector TrustBox: invites the visitor to leave a review rather
// than displaying existing star ratings. Loaded on demand (not in index.html)
// since it currently appears on a single page.
const TrustpilotWidget: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const initWidget = () => {
      if (el && window.Trustpilot) {
        window.Trustpilot.loadFromElement(el, true);
      }
    };

    if (window.Trustpilot) {
      initWidget();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TRUSTPILOT_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', initWidget);
      return () => existing.removeEventListener('load', initWidget);
    }

    const script = document.createElement('script');
    script.src = TRUSTPILOT_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', initWidget);
    document.body.appendChild(script);
    return () => script.removeEventListener('load', initWidget);
  }, []);

  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id="56278e9abfbbba0bdcd568bc"
      data-businessunit-id="6aae6f0b4b265b2b9ed96af9"
      data-style-height="52px"
      data-style-width="100%"
      data-token="d103694b-0edb-4849-be3e-4a44c1ace87c"
    >
      <a href="https://www.trustpilot.com/review/trivianedge.com" target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
};

export default TrustpilotWidget;
