import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ARIA_FEATURES } from '../constants/ariaFeatures';

const AriaSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ company: '', email: '', size: '1-10' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json() as { success: boolean; error?: string };
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('[AriaSection] Early access submission error:', err);
      setError('Unable to submit. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="aria" aria-label="Trivian Aria HR Platform" className="py-16 md:py-32 px-4 md:px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-cyan-500/5 to-violet-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20 reveal">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Now in Development — Phase 1
          </span>
          <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] font-['Space_Grotesk'] text-text">
            Meet Trivian Aria.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">HR on Autopilot.</span>
          </h2>
          <p className="text-muted text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-6">
            Trivian Aria is TrivianEdge's proprietary AI-powered HRIS platform — built to eliminate the Ops-HR language gap from within. We've begun Phase 1 development and are opening early access to select companies completely free.
          </p>
          <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
            Aria brings together AI-powered HR management, full employee lifecycle tracking, automated payroll, leave management, a Kanban recruitment pipeline, real-time analytics, and a built-in AI assistant — all in a single unified platform built on React, TypeScript, and Supabase.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {ARIA_FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="reveal glass p-8 rounded-[2.5rem] border-border bg-surface hover:border-cyan-500/30 transition-all duration-300 group relative overflow-hidden tilt-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="p-3 rounded-2xl bg-surface border border-border inline-flex mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text mb-3 font-['Space_Grotesk']">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Early Access CTA + Form */}
        <div className="reveal glass p-12 md:p-16 rounded-[3rem] border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">

            {/* Left: CTA copy */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 border border-cyan-500/20">
                Early Access
              </span>
              <h3 className="text-3xl md:text-5xl font-bold mb-6 text-text font-['Space_Grotesk'] leading-tight">
                Free for up to<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">10 Employees.</span>
              </h3>
              <p className="text-muted text-base leading-relaxed mb-4">
                Phase 1 is live. Companies can sign up for early access and use Trivian Aria completely free for teams of up to 10 employees — no credit card required, no strings attached.
              </p>
              <ul className="space-y-3">
                {['No credit card required', 'Full Phase 1 feature set', 'Priority onboarding support', 'Free forever for ≤ 10 employees'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Form */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                  <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <CheckCircle2 className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-text font-['Space_Grotesk']">You're on the list.</h4>
                  <p className="text-muted text-sm leading-relaxed max-w-xs">
                    We'll reach out with your early access credentials shortly. Welcome to the future of HR.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-widest uppercase text-muted mb-2">Company Name</label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-sm text-text placeholder-muted focus:outline-none focus:border-cyan-500/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-widest uppercase text-muted mb-2">Work Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-sm text-text placeholder-muted focus:outline-none focus:border-cyan-500/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-widest uppercase text-muted mb-2">Company Size</label>
                    <select
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-sm text-text focus:outline-none focus:border-cyan-500/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>
                  {error && (
                    <p className="text-rose-400 text-sm font-mono">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative overflow-hidden bg-btn-bg text-btn-text font-bold py-4 px-8 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale"
                  >
                    {submitting ? 'Submitting...' : 'Request Early Access — It\'s Free'}
                    {!submitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AriaSection;
