import React, { useState } from 'react';
import { ArrowRight, Terminal, Activity } from 'lucide-react';

const TalentAdvisor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!query || loading) return;
    setLoading(true);
    setResult('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are the TrivianEdge Intelligence Engine. A potential client is asking about scaling or talent strategy. Query: "${query}". Provide a concise, high-impact, futuristic executive response (max 80 words). Focus on how TrivianEdge solves the Ops-HR language gap and uses global talent pipelines. Sound elite, confident, and professional.`,
        }),
      });
      const data = await response.json() as { text?: string };
      const text = data.text || "Connection timeout. Please re-initiate uplink.";
      let i = 0;
      const interval = setInterval(() => {
        setResult(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(interval);
          setLoading(false);
        }
      }, 15);
    } catch (error) {
      setResult("Something went wrong. Please try again in a moment.");
      setLoading(false);
    }
  };

  return (
    <div className="reveal glass p-8 md:p-12 rounded-[2.5rem] border-border relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="scan-line" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Terminal className="text-cyan-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-text">Intelligence Engine</h3>
            <p className="text-xs text-cyan-400/60 font-mono tracking-widest uppercase">Consultation Protocol v4.0</p>
          </div>
        </div>
        <p className="text-muted mb-8 text-sm md:text-base leading-relaxed">
          Input your scaling requirements. Our AI will analyze your operational bottlenecks and provide a preliminary execution blueprint.
        </p>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your current scaling friction..."
              className="w-full bg-surface border border-border rounded-2xl p-5 text-sm md:text-base focus:outline-none focus:border-cyan-500/40 transition-all h-32 resize-none font-mono text-text placeholder-muted"
            />
            {loading && (
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400">ANALYZING...</span>
              </div>
            )}
          </div>
          <button 
            onClick={handleAskAI}
            disabled={loading || !query}
            className="group relative overflow-hidden bg-btn-bg text-btn-text font-bold py-4 px-8 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? 'Processing Protocol...' : 'Generate Execution Blueprint'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
        {result && (
          <div className="mt-8 p-6 bg-cyan-500/5 rounded-2xl border border-cyan-500/20 text-text animate-fade-in">
            <div className="flex items-center gap-2 mb-3 text-[10px] font-mono text-cyan-400">
              <Activity className="w-3 h-3" />
              <span>OUTPUT RECEIVED</span>
            </div>
            <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentAdvisor;
