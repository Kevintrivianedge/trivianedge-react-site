/**
 * TrivianEdge Algorithm Intelligence System
 *
 * HONEST DISCLAIMER: No public API exists to detect real-time Google/Bing/Yahoo
 * algorithm updates. What this system does — which is exactly what professional
 * SEO tools like Semrush, Ahrefs, and Lighthouse do — is:
 *   1. Detect which crawling bot is visiting (from user-agent string)
 *   2. Measure Core Web Vitals (LCP, CLS, INP) that ranking algorithms evaluate
 *   3. Detect network quality and adapt loading strategy
 *   4. Provide adaptive recommendations based on measured signals
 *   5. Store trend data in localStorage for historical comparison
 *
 * Recommendations are based on publicly documented ranking signals from each engine.
 */

export interface AlgorithmSignals {
  engine: 'google' | 'bing' | 'yahoo' | 'unknown';
  coreWebVitals: {
    lcp: number;   // Largest Contentful Paint (ms)
    fid: number;   // First Input Delay (ms) — legacy, kept for compat
    cls: number;   // Cumulative Layout Shift (unitless score)
    inp: number;   // Interaction to Next Paint (ms)
  };
  crawlBudgetOptimized: boolean;
  schemaValid: boolean;
  mobileScore: number;       // 0–100
  pageSpeedScore: number;    // 0–100
  networkQuality: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  timestamp: number;
}

const VITALS_STORAGE_KEY = 'trivian_seo_vitals_v1';
const DEV = typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;

function log(...args: unknown[]): void {
  if (DEV) {
    console.info('[SEO]', ...args);
  }
}

/** Engine-specific SEO hints (based on publicly documented preferences) */
const ENGINE_HINTS: Record<
  AlgorithmSignals['engine'],
  { prioritySchemas: string[]; recommendedKeywords: string[]; maxTitleLength: number }
> = {
  google: {
    prioritySchemas: ['Organization', 'WebSite', 'Article', 'BreadcrumbList', 'FAQPage'],
    recommendedKeywords: ['AI staffing', 'global talent pipeline', 'remote workforce solutions'],
    maxTitleLength: 60,
  },
  bing: {
    // Bing tends to prefer shorter, more keyword-dense titles and descriptions
    prioritySchemas: ['Organization', 'WebSite', 'Service'],
    recommendedKeywords: ['global talent Canada', 'AI workforce', 'remote team management'],
    maxTitleLength: 55,
  },
  yahoo: {
    // Yahoo uses Bing's index, so similar preferences apply
    prioritySchemas: ['Organization', 'WebSite', 'Service'],
    recommendedKeywords: ['talent solutions Canada', 'AI operations', 'global remote teams'],
    maxTitleLength: 55,
  },
  unknown: {
    prioritySchemas: ['Organization', 'WebSite'],
    recommendedKeywords: ['TrivianEdge', 'global talent', 'AI staffing'],
    maxTitleLength: 60,
  },
};

export class AlgorithmIntelligenceEngine {
  private signals: AlgorithmSignals;
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.signals = {
      engine: 'unknown',
      coreWebVitals: { lcp: 0, fid: 0, cls: 0, inp: 0 },
      crawlBudgetOptimized: true,
      schemaValid: false,
      mobileScore: 80,
      pageSpeedScore: 75,
      networkQuality: 'unknown',
      timestamp: Date.now(),
    };
  }

  /**
   * Detect the crawling bot from the user-agent string.
   * Returns 'unknown' for real human visitors — which is the expected default.
   */
  detectEngine(): AlgorithmSignals['engine'] {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('googlebot') || ua.includes('google-inspectiontool')) return 'google';
    if (ua.includes('bingbot') || ua.includes('msnbot')) return 'bing';
    if (ua.includes('yahoo! slurp') || ua.includes('slurp')) return 'yahoo';
    return 'unknown';
  }

  /**
   * Detect network quality using the Network Information API.
   * Falls back to 'unknown' if the API is not available.
   */
  detectNetworkQuality(): AlgorithmSignals['networkQuality'] {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
    };
    const conn = nav.connection;
    if (!conn?.effectiveType) return 'unknown';
    const type = conn.effectiveType as AlgorithmSignals['networkQuality'];
    return type || 'unknown';
  }

  /**
   * Measure Core Web Vitals using the PerformanceObserver API.
   * These are the exact signals Google, Bing, and other engines use for ranking.
   *
   * LCP threshold:  Good < 2500ms, Needs Improvement < 4000ms, Poor >= 4000ms
   * CLS threshold:  Good < 0.1,    Needs Improvement < 0.25,   Poor >= 0.25
   * INP threshold:  Good < 200ms,  Needs Improvement < 500ms,  Poor >= 500ms
   */
  async measureCoreWebVitals(): Promise<{ lcp: number; cls: number; inp: number }> {
    return new Promise((resolve) => {
      const vitals = { lcp: 0, cls: 0, inp: 0 };
      let clsValue = 0;
      let resolved = false;

      const tryResolve = () => {
        if (!resolved) {
          resolved = true;
          resolve({ ...vitals, cls: clsValue });
        }
      };

      // Measure LCP
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
          vitals.lcp = lastEntry.startTime;
          log('LCP:', `${vitals.lcp.toFixed(0)}ms`, vitals.lcp < 2500 ? '✅ Good' : vitals.lcp < 4000 ? '⚠️ Needs improvement' : '❌ Poor');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch {
        log('LCP measurement not supported');
      }

      // Measure CLS
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value ?? 0;
            }
          }
          vitals.cls = clsValue;
          log('CLS:', clsValue.toFixed(4), clsValue < 0.1 ? '✅ Good' : clsValue < 0.25 ? '⚠️ Needs improvement' : '❌ Poor');
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch {
        log('CLS measurement not supported');
      }

      // Measure INP (Interaction to Next Paint) — uses 'event' entry type
      // INP is calculated as the max duration of discrete interactions (click, keydown, pointerdown)
      try {
        const inpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as Array<PerformanceEntry & { processingStart?: number; processingEnd?: number; startTime: number; duration: number }>;
          for (const entry of entries) {
            // INP = time from input until next frame is painted (processingStart - startTime + render time)
            const interactionDuration = entry.duration ?? 0;
            if (interactionDuration > vitals.inp) {
              vitals.inp = interactionDuration;
            }
          }
          log('INP:', `${vitals.inp.toFixed(0)}ms`, vitals.inp < 200 ? '✅ Good' : vitals.inp < 500 ? '⚠️ Needs improvement' : '❌ Poor');
        });
        inpObserver.observe({ entryTypes: ['event'], durationThreshold: 16 } as PerformanceObserverInit);
        this.observers.push(inpObserver);
      } catch {
        log('INP measurement not supported');
      }

      // Resolve after a short window to capture initial vitals
      setTimeout(() => {
        tryResolve();
      }, 5000);
    });
  }

  /**
   * Auto-optimize meta tags based on the detected engine.
   * Returns a map of meta tag names to their optimized values.
   */
  autoOptimizeMeta(currentMeta: Record<string, string>): Record<string, string> {
    const engine = this.signals.engine;
    const hints = ENGINE_HINTS[engine];
    const optimized = { ...currentMeta };

    // Truncate title for engines that prefer shorter titles (Bing/Yahoo)
    if (optimized.title && optimized.title.length > hints.maxTitleLength) {
      optimized.title = optimized.title.slice(0, hints.maxTitleLength - 3) + '...';
      log(`Title truncated to ${hints.maxTitleLength} chars for ${engine}`);
    }

    // Bing/Yahoo prefer more explicit keyword-in-title patterns
    if ((engine === 'bing' || engine === 'yahoo') && optimized.description) {
      log(`Engine ${engine}: prioritizing schemas:`, hints.prioritySchemas.join(', '));
    }

    return optimized;
  }

  /**
   * Get engine-specific structured data and keyword hints.
   */
  getEngineHints(): { prioritySchemas: string[]; recommendedKeywords: string[] } {
    const hints = ENGINE_HINTS[this.signals.engine];
    return {
      prioritySchemas: hints.prioritySchemas,
      recommendedKeywords: hints.recommendedKeywords,
    };
  }

  /**
   * Generate human-readable SEO recommendations based on current signals.
   */
  getRecommendations(signals: AlgorithmSignals): string[] {
    const recs: string[] = [];
    const { lcp, cls, inp } = signals.coreWebVitals;

    if (lcp > 4000) recs.push('❌ LCP is poor (>4s). Optimize images and reduce render-blocking resources.');
    else if (lcp > 2500) recs.push('⚠️ LCP needs improvement (2.5–4s). Consider lazy-loading below-fold images.');
    else if (lcp > 0) recs.push('✅ LCP is good (<2.5s).');

    if (cls > 0.25) recs.push('❌ CLS is poor (>0.25). Reserve space for dynamic content and images.');
    else if (cls > 0.1) recs.push('⚠️ CLS needs improvement (0.1–0.25). Add explicit dimensions to images.');
    else recs.push('✅ CLS is good (<0.1).');

    if (inp > 500) recs.push('❌ INP is poor (>500ms). Reduce JavaScript execution time on interactions.');
    else if (inp > 200) recs.push('⚠️ INP needs improvement (200–500ms). Optimize event handlers.');
    else recs.push('✅ INP is good (<200ms).');

    if (signals.networkQuality === 'slow-2g' || signals.networkQuality === '2g') {
      recs.push('📡 Slow network detected. Aggressive lazy loading and image compression recommended.');
    }

    if (signals.engine !== 'unknown') {
      recs.push(`🤖 Detected bot: ${signals.engine}. Priority schemas: ${ENGINE_HINTS[signals.engine].prioritySchemas.join(', ')}.`);
    }

    if (!signals.schemaValid) {
      recs.push('📋 Structured data validation recommended. Use Google Rich Results Test.');
    }

    return recs;
  }

  /**
   * Report vitals to a hypothetical analytics endpoint.
   * Currently just logs in dev mode — extend to send to your analytics provider.
   */
  reportVitals(vitals: object): void {
    log('Vitals report:', vitals);
    // In production, you would POST to your analytics endpoint:
    // fetch('/api/vitals', { method: 'POST', body: JSON.stringify(vitals) });
  }

  /**
   * Store detected vitals in localStorage for trend analysis.
   */
  private persistVitals(signals: AlgorithmSignals): void {
    try {
      const existing = JSON.parse(localStorage.getItem(VITALS_STORAGE_KEY) ?? '[]') as AlgorithmSignals[];
      const updated = [...existing.slice(-49), signals]; // Keep last 50 records
      localStorage.setItem(VITALS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage may not be available
    }
  }

  /**
   * Start continuous monitoring. Measures vitals once, then logs a summary.
   * Returns a cleanup function that disconnects all observers.
   *
   * @param callback - Called whenever new signals are available.
   */
  startMonitoring(callback: (signals: AlgorithmSignals) => void): () => void {
    // Disconnect any observers from a previous monitoring session (HMR-safe — fixes #15).
    this.observers.forEach((o) => o.disconnect());
    this.observers = [];

    // Detect engine and network on start
    this.signals.engine = this.detectEngine();
    this.signals.networkQuality = this.detectNetworkQuality();
    this.signals.timestamp = Date.now();

    log('Engine detected:', this.signals.engine);
    log('Network quality:', this.signals.networkQuality);

    // Measure vitals after page load
    const measure = async () => {
      const { lcp, cls, inp } = await this.measureCoreWebVitals();
      this.signals.coreWebVitals = { lcp, cls, inp, fid: 0 };

      // Estimate scores based on vitals (rough heuristic)
      const lcpScore = lcp === 0 ? 80 : Math.max(0, Math.min(100, Math.round(100 - (lcp - 2500) / 40)));
      const clsScore = Math.max(0, Math.min(100, Math.round(100 - cls * 400)));
      this.signals.pageSpeedScore = Math.round((lcpScore + clsScore) / 2);
      this.signals.mobileScore = this.signals.pageSpeedScore - 5; // Mobile is slightly lower
      this.signals.schemaValid = document.querySelectorAll('script[type="application/ld+json"]').length > 0;

      this.persistVitals(this.signals);
      callback({ ...this.signals });

      const recs = this.getRecommendations(this.signals);
      log('SEO Recommendations:', '\n' + recs.join('\n'));
      this.reportVitals(this.signals.coreWebVitals);
    };

    // Start measurement after DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', measure);
    } else {
      measure();
    }

    return () => {
      this.observers.forEach((o) => o.disconnect());
      this.observers = [];
    };
  }
}

/** Singleton instance for app-wide usage */
export const algorithmEngine = new AlgorithmIntelligenceEngine();
