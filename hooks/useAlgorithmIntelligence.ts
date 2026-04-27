import { useEffect, useState } from 'react';
import { algorithmEngine, AlgorithmSignals } from '../utils/algorithmIntelligence';

export interface AlgorithmIntelligenceResult {
  signals: AlgorithmSignals | null;
  recommendations: string[];
}

export function useAlgorithmIntelligence(): AlgorithmIntelligenceResult {
  const [signals, setSignals] = useState<AlgorithmSignals | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Only run performance observers in development — in production this is a
    // no-op so PerformanceObservers, the 5-second timer, and localStorage writes
    // are not incurred on every real user session.
    if (!import.meta.env.DEV) return;

    const stop = algorithmEngine.startMonitoring((newSignals) => {
      setSignals(newSignals);
      setRecommendations(algorithmEngine.getRecommendations(newSignals));
    });
    return stop;
  }, []);

  return { signals, recommendations };
}
