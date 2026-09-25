import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../constants/api';
import { BOOKING_URL } from '../constants';
import { getCsrfToken, addCsrfTokenToFormData } from '../utils/csrf';
import { storeFailedSubmission } from '../utils/serviceWorkerRegistry';

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
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step1Valid = form.name.trim() !== '' && form.company.trim() !== '' && form.email.trim() !== '';

  const submitInquiry = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const formDataWithCsrf = addCsrfTokenToFormData(form);
      const response = await fetch(API_ENDPOINTS.INQUIRY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataWithCsrf),
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
      const formDataWithCsrf = addCsrfTokenToFormData(form);
      try {
        await storeFailedSubmission(API_ENDPOINTS.INQUIRY, formDataWithCsrf);
        setError('You appear to be offline. Your submission will be sent automatically when you reconnect.');
        setSubmitted(true);
        setForm(initialState);
      } catch (storageError) {
        console.error('[InquiryForm] failed to store offline submission:', storageError);
        setError('Unable to submit right now. Please try again or email kevin.v@trivianedge.com.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (step1Valid) setStep(2);
      return;
    }
    await submitInquiry();
  };

  const handleSkipAndSend = async () => {
    if (!step1Valid) return;
    await submitInquiry();
  };

  if (submitted) {
    return (
      <div className="glass p-10 rounded-[2rem] border-border text-center" role="status">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
          <CheckCircle2 className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-2xl font-bold text-text mb-3">Got it. Thanks.</h3>
        <p className="text-muted leading-relaxed max-w-md mx-auto">
          Your brief is with our founder, and we usually reply the same business day. If you'd rather not wait, pick a time that suits you.
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold premium-button"
        >
          Book a 15-minute call
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-8 md:p-10 rounded-[2rem] border-border space-y-5">
      <div className="flex items-center gap-2 mb-1" aria-hidden="true">
        <span className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-cyan-500' : 'bg-border'}`} />
        <span className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-cyan-500' : 'bg-border'}`} />
      </div>

      {step === 1 && (
        <>
          <div>
            <label htmlFor="inquiry-name" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Name</label>
            <input
              id="inquiry-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:opacity-100 focus:outline-none transition-colors"
              placeholder="Your name"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inquiry-company" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Company</label>
              <input
                id="inquiry-company"
                type="text"
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:opacity-100 focus:outline-none transition-colors"
                placeholder="Company name"
              />
            </div>
            <div>
              <label htmlFor="inquiry-email" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Email</label>
              <input
                id="inquiry-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:opacity-100 focus:outline-none transition-colors"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="inquiry-need" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Primary need</label>
            <div className="relative">
              <select
                id="inquiry-need"
                value={form.need}
                onChange={(e) => setForm({ ...form, need: e.target.value })}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 pr-10 text-sm text-text focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option>Build a team</option>
                <option>Microsoft or Google cloud</option>
                <option>Build bespoke software</option>
                <option>Outsource IT</option>
                <option>Hire RPO support</option>
                <option>Explore AI services</option>
                <option>Talk through a market entry plan</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          <p className="text-xs text-muted">
            One more short step for optional details, or{' '}
            <button
              type="button"
              onClick={handleSkipAndSend}
              disabled={!step1Valid || submitting}
              className="underline text-cyan-500 hover:text-cyan-400 disabled:opacity-50 disabled:no-underline"
            >
              skip straight to sending
            </button>.
          </p>
        </>
      )}

      {step === 2 && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inquiry-timeline" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Timing</label>
              <div className="relative">
                <select
                  id="inquiry-timeline"
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 pr-10 text-sm text-text focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option>Immediately</option>
                  <option>1-2 weeks</option>
                  <option>2-4 weeks</option>
                  <option>30+ days</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>
            <div>
              <label htmlFor="inquiry-company-size" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Company size <span className="normal-case font-normal">(optional)</span></label>
              <div className="relative">
                <select
                  id="inquiry-company-size"
                  value={form.companySize}
                  onChange={(e) => setForm({ ...form, companySize: e.target.value })}
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 pr-10 text-sm text-text focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Prefer not to say</option>
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>201-1000 employees</option>
                  <option>1000+ employees</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="inquiry-headcount" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">People needed <span className="normal-case font-normal">(optional)</span></label>
              <div className="relative">
                <select
                  id="inquiry-headcount"
                  value={form.headcount}
                  onChange={(e) => setForm({ ...form, headcount: e.target.value })}
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 pr-10 text-sm text-text focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Not sure yet</option>
                  <option>1 person</option>
                  <option>2-5 people</option>
                  <option>6-15 people</option>
                  <option>16-50 people</option>
                  <option>50+ people</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>
            <div>
              <label htmlFor="inquiry-market" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Country / market <span className="normal-case font-normal">(optional)</span></label>
              <input
                id="inquiry-market"
                type="text"
                value={form.market}
                onChange={(e) => setForm({ ...form, market: e.target.value })}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:opacity-100 focus:outline-none transition-colors"
                placeholder="e.g. Philippines, GCC"
              />
            </div>
            <div>
              <label htmlFor="inquiry-budget" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Est. monthly budget <span className="normal-case font-normal">(optional)</span></label>
              <div className="relative">
                <select
                  id="inquiry-budget"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 pr-10 text-sm text-text focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Prefer not to say</option>
                  <option>Under $5,000</option>
                  <option>$5,000-$15,000</option>
                  <option>$15,000-$50,000</option>
                  <option>$50,000+</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="inquiry-message" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Message <span className="normal-case font-normal">(optional)</span></label>
            <textarea
              id="inquiry-message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text placeholder:opacity-100 focus:outline-none transition-colors min-h-[120px]"
              placeholder="What are you trying to build or fix?"
            />
          </div>
        </>
      )}

      {error && (
        <p
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 px-4 py-3 text-sm font-medium"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <button
          type="submit"
          disabled={submitting || (step === 1 && !step1Valid)}
          className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all disabled:opacity-70 premium-button flex-1"
          aria-busy={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : step === 1 ? (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Request a call back
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </div>
    </form>
  );
};

export default InquiryForm;