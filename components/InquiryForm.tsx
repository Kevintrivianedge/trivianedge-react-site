import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { API_ENDPOINTS } from '../constants/api';

type InquiryFormState = {
  name: string;
  company: string;
  email: string;
  need: string;
  timeline: string;
  companySize: string;
  headcount: string;
  market: string;
  budget: string;
  message: string;
};

const initialState: InquiryFormState = {
  name: '',
  company: '',
  email: '',
  need: 'Build a team',
  timeline: '2-4 weeks',
  companySize: '',
  headcount: '',
  market: '',
  budget: '',
  message: '',
};

const InquiryForm: React.FC = () => {
  const [form, setForm] = useState<InquiryFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.INQUIRY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json() as { success: boolean; error?: string };

      if (data.success) {
        setSubmitted(true);
        setForm(initialState);
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('[InquiryForm] submission error:', err);
      setError('Unable to submit right now. Please try again or email kevin.v@trivianedge.com.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass p-10 rounded-[2rem] border-border text-center" role="status">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
          <CheckCircle2 className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-2xl font-bold text-text mb-3">Inquiry received.</h3>
        <p className="text-muted leading-relaxed max-w-md mx-auto">
          We will review your request and get back to you shortly with the next step.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-8 md:p-10 rounded-[2rem] border-border space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inquiry-name" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Name</label>
          <input
            id="inquiry-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:text-muted/70 focus:outline-none focus:border-cyan-500/40 transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="inquiry-company" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Company</label>
          <input
            id="inquiry-company"
            type="text"
            required
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:text-muted/70 focus:outline-none focus:border-cyan-500/40 transition-colors"
            placeholder="Company name"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inquiry-email" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Email</label>
          <input
            id="inquiry-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:text-muted/70 focus:outline-none focus:border-cyan-500/40 transition-colors"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label htmlFor="inquiry-need" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Primary need</label>
          <select
            id="inquiry-need"
            value={form.need}
            onChange={(e) => setForm({ ...form, need: e.target.value })}
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text focus:outline-none focus:border-cyan-500/40 transition-colors appearance-none cursor-pointer"
          >
            <option>Build a team</option>
            <option>Build bespoke software</option>
            <option>Outsource IT</option>
            <option>Hire RPO support</option>
            <option>Explore AI services</option>
            <option>Talk through a market entry plan</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inquiry-timeline" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Timing</label>
          <select
            id="inquiry-timeline"
            value={form.timeline}
            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text focus:outline-none focus:border-cyan-500/40 transition-colors appearance-none cursor-pointer"
          >
            <option>Immediately</option>
            <option>1-2 weeks</option>
            <option>2-4 weeks</option>
            <option>30+ days</option>
          </select>
        </div>
        <div>
          <label htmlFor="inquiry-company-size" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Company size</label>
          <select
            id="inquiry-company-size"
            value={form.companySize}
            onChange={(e) => setForm({ ...form, companySize: e.target.value })}
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text focus:outline-none focus:border-cyan-500/40 transition-colors appearance-none cursor-pointer"
          >
            <option value="">Prefer not to say</option>
            <option>1-10 employees</option>
            <option>11-50 employees</option>
            <option>51-200 employees</option>
            <option>201-1000 employees</option>
            <option>1000+ employees</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="inquiry-headcount" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">People needed</label>
          <select
            id="inquiry-headcount"
            value={form.headcount}
            onChange={(e) => setForm({ ...form, headcount: e.target.value })}
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text focus:outline-none focus:border-cyan-500/40 transition-colors appearance-none cursor-pointer"
          >
            <option value="">Not sure yet</option>
            <option>1 person</option>
            <option>2-5 people</option>
            <option>6-15 people</option>
            <option>16-50 people</option>
            <option>50+ people</option>
          </select>
        </div>
        <div>
          <label htmlFor="inquiry-market" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Country / market</label>
          <input
            id="inquiry-market"
            type="text"
            value={form.market}
            onChange={(e) => setForm({ ...form, market: e.target.value })}
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:text-muted/70 focus:outline-none focus:border-cyan-500/40 transition-colors"
            placeholder="e.g. Philippines, GCC"
          />
        </div>
        <div>
          <label htmlFor="inquiry-budget" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Est. monthly budget</label>
          <select
            id="inquiry-budget"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text focus:outline-none focus:border-cyan-500/40 transition-colors appearance-none cursor-pointer"
          >
            <option value="">Prefer not to say</option>
            <option>Under $5,000</option>
            <option>$5,000-$15,000</option>
            <option>$15,000-$50,000</option>
            <option>$50,000+</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="inquiry-message" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Message</label>
        <textarea
          id="inquiry-message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:text-muted/70 focus:outline-none focus:border-cyan-500/40 transition-colors min-h-[120px]"
          placeholder="What are you trying to build or fix?"
        />
      </div>

      {error && <p className="text-sm text-rose-700 dark:text-rose-400 font-medium" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all disabled:opacity-70 premium-button"
      >
        {submitting ? 'Sending...' : 'Request a call back'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

export default InquiryForm;