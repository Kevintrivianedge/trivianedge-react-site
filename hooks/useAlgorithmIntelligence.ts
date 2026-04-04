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
    const stop = algorithmEngine.startMonitoring((newSignals) => {
      setSignals(newSignals);
      setRecommendations(algorithmEngine.getRecommendations(newSignals));
    });
    return stop;
  }, []);

  return { signals, recommendations };
}
