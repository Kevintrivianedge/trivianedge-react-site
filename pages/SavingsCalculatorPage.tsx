import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Calculator,
  TrendingDown,
  Share2,
  Copy,
  CheckCircle2,
  ArrowRight,
  Linkedin,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { API_ENDPOINTS } from '../constants/api';
import { BOOKING_URL } from '../constants';
import { SEO_CONFIG, breadcrumbSchema, buildWebPageSchema } from '../utils/seo';

const PAGE_URL = `${SEO_CONFIG.siteUrl}/savings-calculator`;
const SAVINGS_RATE = 0.4; // matches TrivianEdge's published average client savings

const ROLE_TYPES = [
  'Software Developer',
  'Customer Support',
  'Finance & Accounting',
  'HR & Recruiting',
  'Operations',
  'Mixed Team',
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

const SavingsCalculatorPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const [roleType, setRoleType] = useState(ROLE_TYPES[0]);
  const [costPerHire, setCostPerHire] = useState(90000);
  const [hireCount, setHireCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const [leadForm, setLeadForm] = useState({ name: '', company: '', email: '' });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const { annualCost, offshoreCost, annualSavings, threeYearSavings } = useMemo(() => {
    const totalLocalCost = Math.max(0, costPerHire) * Math.max(0, hireCount);
    const offshore = totalLocalCost * (1 - SAVINGS_RATE);
    const savings = totalLocalCost * SAVINGS_RATE;
    return {
      annualCost: totalLocalCost,
      offshoreCost: offshore,
      annualSavings: savings,
      threeYearSavings: savings * 3,
    };
  }, [costPerHire, hireCount]);

  const shareText = `I could save ${formatCurrency(annualSavings)}/year building a ${roleType.toLowerCase()} team with TrivianEdge's offshore model. See what you'd save: ${PAGE_URL}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard permission denied or unavailable — no-op, button stays as-is.
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'TrivianEdge Savings Calculator', text: shareText, url: PAGE_URL });
      } catch {
        // User cancelled the native share sheet — no-op.
      }
    } else {
      handleCopy();
    }
  };

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PAGE_URL)}`;

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);
    setLeadError(null);

    try {
      const response = await fetch(API_ENDPOINTS.INQUIRY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name,
          company: leadForm.company,
          email: leadForm.email,
          need: 'Savings calculator estimate',
          timeline: '2-4 weeks',
          message: `Savings calculator result — role: ${roleType}, hires: ${hireCount}, current annual cost per hire: ${formatCurrency(costPerHire)}. Estimated offshore cost: ${formatCurrency(offshoreCost)}/yr. Estimated savings: ${formatCurrency(annualSavings)}/yr (${formatCurrency(threeYearSavings)} over 3 years).`,
        }),
      });

      const data = (await response.json()) as { success: boolean; error?: string };

      if (data.success) {
        setLeadSubmitted(true);
      } else {
        setLeadError(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('[SavingsCalculatorPage] submission error:', err);
      setLeadError('Unable to submit right now. Please try again or email kevin.v@trivianedge.com.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Offshore Hiring Savings Calculator | TrivianEdge"
        description="See exactly how much you could save building an offshore team with TrivianEdge. Enter your role, headcount, and cost for an instant free estimate."
        keywords="offshore hiring cost calculator, outsourcing savings calculator, offshore team cost savings, BPO savings calculator, RPO cost savings"
        canonical={PAGE_URL}
        structuredData={[
          buildWebPageSchema({
            name: 'Offshore Hiring Savings Calculator',
            description: 'Free calculator estimating annual and 3-year savings from building an offshore team with TrivianEdge, based on role type, headcount, and current cost per hire.',
            url: PAGE_URL,
            breadcrumb: [
              { name: 'Home', url: SEO_CONFIG.siteUrl },
              { name: 'Savings Calculator', url: PAGE_URL },
            ],
          }),
          breadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Savings Calculator', url: PAGE_URL },
          ]),
        ]}
      />

      <div className="bg-background min-h-screen text-text">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2">
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
            <li className="text-border">/</li>
            <li className="text-text font-medium">Savings Calculator</li>
          </ol>
        </nav>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
          className="pt-8 pb-12 px-4 md:px-6 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-text/70 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Calculator className="w-3 h-3" />
              Free tool
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-5 leading-tight">
              What Could You <span className="text-cyan-400">Save?</span>
            </h1>
            <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
              Enter your role, headcount, and current cost. We'll estimate what an offshore team through TrivianEdge could save you a year — based on our clients' average 40% savings.
            </p>
          </div>
        </motion.section>

        {/* Calculator */}
        <section className="px-4 md:px-6 pb-24">
          <div className="max-w-3xl mx-auto grid gap-6">
            {/* Inputs */}
            <div className="glass rounded-[2rem] p-6 md:p-10 border-border">
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="calc-role" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Role type</label>
                  <select
                    id="calc-role"
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text focus:outline-none focus:border-cyan-500/40 transition-colors appearance-none cursor-pointer"
                  >
                    {ROLE_TYPES.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="calc-count" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Number of hires</label>
                  <input
                    id="calc-count"
                    type="number"
                    min={1}
                    value={hireCount}
                    onChange={(e) => setHireCount(Number(e.target.value) || 1)}
                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text focus:outline-none focus:border-cyan-500/40 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="calc-cost" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Current annual cost per hire (USD)</label>
                <input
                  id="calc-cost"
                  type="number"
                  min={0}
                  step={1000}
                  value={costPerHire}
                  onChange={(e) => setCostPerHire(Number(e.target.value) || 0)}
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text focus:outline-none focus:border-cyan-500/40 transition-colors"
                  placeholder="90000"
                />
                <p className="text-muted text-xs mt-2">Include salary plus benefits, so the comparison is apples to apples.</p>
              </div>
            </div>

            {/* Result */}
            <div
              aria-live="polite"
              className="rounded-[2rem] p-6 md:p-10 text-center relative overflow-hidden section-dark"
            >
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400 mb-4">Estimated result</p>
              <p className="text-white/60 text-sm mb-2">You could save</p>
              <p className="text-4xl md:text-6xl font-bold text-white mb-2">
                {formatCurrency(annualSavings)}
                <span className="text-lg md:text-2xl text-white/50 font-medium"> / year</span>
              </p>
              <p className="text-white/50 text-sm mb-8">
                {formatCurrency(threeYearSavings)} over 3 years, offshore cost estimate {formatCurrency(offshoreCost)}/yr vs. {formatCurrency(annualCost)}/yr today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm premium-button btn-magnetic micro-press-button"
                >
                  <Share2 className="w-4 h-4" />
                  Share your result
                </button>
                <a
                  href={linkedInShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm premium-button-secondary btn-magnetic micro-press-button !text-white border-white/20 hover:border-white/40 hover:bg-white/5"
                >
                  <Linkedin className="w-4 h-4" />
                  Share on LinkedIn
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm premium-button-secondary btn-magnetic micro-press-button !text-white border-white/20 hover:border-white/40 hover:bg-white/5"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy result'}
                </button>
              </div>

              <p className="text-white/60 text-xs mt-8 max-w-md mx-auto">
                Estimate based on TrivianEdge's average client savings of 40%. Actual savings vary by role, region, and scope — talk to us for a precise quote.
              </p>
            </div>

            {/* Lead capture */}
            <div className="glass border-gradient-animated relative rounded-[2rem] p-6 md:p-10 border-border">
              {leadSubmitted ? (
                <div className="text-center py-4" role="status">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                    <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text mb-2">Sent.</h2>
                  <p className="text-muted text-sm max-w-sm mx-auto">
                    We'll follow up with a breakdown for your {roleType.toLowerCase()} team, and how a real engagement compares to this estimate.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-cyan-500" />
                    <h2 className="text-lg font-bold text-text">Get the full breakdown emailed to you</h2>
                  </div>
                  <p className="text-muted text-sm mb-6">No spam. Just this estimate, in writing, from a real person.</p>
                  <form onSubmit={handleLeadSubmit} className="grid sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="Your name"
                      aria-label="Your name"
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:text-muted/70 focus:outline-none focus:border-cyan-500/40 transition-colors"
                    />
                    <input
                      type="text"
                      required
                      value={leadForm.company}
                      onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                      placeholder="Company"
                      aria-label="Company"
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:text-muted/70 focus:outline-none focus:border-cyan-500/40 transition-colors"
                    />
                    <input
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="you@company.com"
                      aria-label="Email"
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:text-muted/70 focus:outline-none focus:border-cyan-500/40 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="sm:col-span-3 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all disabled:opacity-70 premium-button"
                    >
                      {leadSubmitting ? 'Sending...' : 'Email me this breakdown'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                  {leadError && <p className="text-sm text-rose-700 dark:text-rose-400 font-medium mt-3" role="alert">{leadError}</p>}
                </>
              )}
            </div>

            <p className="text-center text-muted text-sm">
              Prefer to talk it through? <Link to="/contact" className="text-cyan-500 hover:underline">Send a full inquiry</Link>{' '}
              or <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">book a 15-minute call</a>.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default SavingsCalculatorPage;
