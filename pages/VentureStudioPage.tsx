import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Sparkles } from 'lucide-react';

type FormState = {
  fullName: string;
  email: string;
  company: string;
  industry: string;
  industryOther: string;
  businessModel: string;
  ideaSummary: string;
  problem: string;
  users: string;
  readinessLevel: string;
  stage: string;
  timeline: string;
  aiDepth: string;
  founderCommitment: string;
};

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  company: '',
  industry: '',
  industryOther: '',
  businessModel: '',
  ideaSummary: '',
  problem: '',
  users: '',
  readinessLevel: '',
  stage: '',
  timeline: '',
  aiDepth: '',
  founderCommitment: '',
};

const STEPS = [
  { id: 'founder', label: 'Founder Profile' },
  { id: 'problem', label: 'Problem + Market' },
  { id: 'readiness', label: 'Build Readiness' },
  { id: 'review', label: 'Review + Submit' },
] as const;

const INDUSTRY_LABELS: Record<string, string> = {
  fintech: 'FinTech',
  healthtech: 'HealthTech',
  'b2b-saas': 'B2B SaaS',
  logistics: 'Logistics',
  ecommerce: 'Ecommerce',
  edtech: 'EdTech',
  other: 'Other',
};

const STEP_GUIDANCE = [
  {
    title: 'Basic founder details',
    hint: 'Takes about 30 seconds. This helps us route your submission quickly.',
  },
  {
    title: 'Problem and first users',
    hint: 'Keep this practical. One clear problem and one clear user segment is enough.',
  },
  {
    title: 'Execution readiness',
    hint: 'Answer based on your current reality, not your target state.',
  },
  {
    title: 'Quick final check',
    hint: 'Confirm details and submit. We handle the follow-up workflow from here.',
  },
] as const;

const INDUSTRY_WEIGHT: Record<string, number> = {
  fintech: 20,
  healthtech: 18,
  'b2b-saas': 16,
  logistics: 14,
  ecommerce: 12,
  edtech: 12,
  other: 10,
};

const READINESS_WEIGHT: Record<string, number> = {
  validated: 25,
  discovery: 17,
  exploratory: 10,
};

const STAGE_WEIGHT: Record<string, number> = {
  'early-users': 20,
  prototype: 14,
  concept: 8,
};

const TIMELINE_WEIGHT: Record<string, number> = {
  'under-4-weeks': 10,
  'one-quarter': 7,
  exploratory: 4,
};

const AI_WEIGHT: Record<string, number> = {
  'core-ai': 15,
  'ai-assisted': 10,
  'open-to-discovery': 6,
};

const COMMITMENT_WEIGHT: Record<string, number> = {
  'full-time': 10,
  'part-time': 7,
  undecided: 3,
};

const BUSINESS_MODEL_BONUS: Record<string, number> = {
  b2b: 3,
  b2c: 2,
  marketplace: 2,
  hybrid: 2,
  other: 1,
};

const getQualificationTier = (score: number) => {
  if (score >= 82) {
    return {
      title: 'Priority Build Candidate',
      note: 'Strong fit for the free MVP lane. We should schedule a founder call this week.',
      tone: 'text-emerald-400',
    };
  }
  if (score >= 62) {
    return {
      title: 'Potential Candidate',
      note: 'Promising idea. We will likely run a short strategy checkpoint before build approval.',
      tone: 'text-cyan-400',
    };
  }
  return {
    title: 'Needs More Validation',
    note: 'The concept may need tighter scope and market validation before entering the free MVP lane.',
    tone: 'text-amber-400',
  };
};


const trackAnalytics = (event: string, payload: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  const eventPayload = {
    ...payload,
    source: 'venture_studio',
    ts: new Date().toISOString(),
  };

  const w = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    amplitude?: { track?: (eventName: string, params?: Record<string, unknown>) => void };
  };

  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...eventPayload });
  }
  if (typeof w.gtag === 'function') {
    w.gtag('event', event, eventPayload);
  }
  if (w.amplitude?.track) {
    w.amplitude.track(event, eventPayload);
  }

  // Server-side event ingestion for persistent analytics storage.
  fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      event,
      payload: eventPayload,
      sessionId: getSessionId(),
    }),
  }).catch(() => {
    // Intentionally ignore network failures to keep UX non-blocking.
  });
};

const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'ssr-session';
  const key = 'venture_studio_session_id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = `vs-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(key, created);
  return created;
};

const getCalendlyHook = (name: string, email: string) => {
  const params = new URLSearchParams();
  if (name) params.set('name', name);
  if (email) params.set('email', email);
  return `https://calendly.com/trivianedge/venture-studio-intro?${params.toString()}`;
};

const getGoogleCalendarHook = (name: string, ideaSummary: string) => {
  const params = new URLSearchParams({
    text: 'TrivianEdge Venture Studio Discovery Call',
    details: `Founder: ${name || 'N/A'}\nIdea: ${ideaSummary || 'N/A'}\nGoal: MVP Qualification`,
  });
  return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
};
const VentureStudioPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingLinks, setBookingLinks] = useState<{
    primaryProvider: string;
    primaryUrl: string;
    fallbackProvider: string;
    fallbackUrl: string;
  } | null>(null);
  const [crmStatus, setCrmStatus] = useState<{ attempted: boolean; success: boolean; status?: number } | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const submittedRef = useRef(false);
  const stepRef = useRef(0);

  const readinessScore = useMemo(() => {
    const weighted =
      (INDUSTRY_WEIGHT[form.industry] ?? 0) +
      (READINESS_WEIGHT[form.readinessLevel] ?? 0) +
      (STAGE_WEIGHT[form.stage] ?? 0) +
      (TIMELINE_WEIGHT[form.timeline] ?? 0) +
      (AI_WEIGHT[form.aiDepth] ?? 0) +
      (COMMITMENT_WEIGHT[form.founderCommitment] ?? 0) +
      (BUSINESS_MODEL_BONUS[form.businessModel] ?? 0);

    const signalPenalty = !form.problem || !form.users ? 8 : 0;
    return Math.max(0, Math.min(100, weighted - signalPenalty));
  }, [form]);

  const tier = useMemo(() => getQualificationTier(readinessScore), [readinessScore]);

  const resolvedIndustry = useMemo(() => {
    if (form.industry === 'other') {
      return form.industryOther.trim() || 'Other';
    }
    return INDUSTRY_LABELS[form.industry] ?? form.industry;
  }, [form.industry, form.industryOther]);

  const onChange = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-CA';
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const response = await fetch('/api/venture/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: {
            ...form,
            industry: resolvedIndustry,
          },
          score: readinessScore,
          tier: tier.title,
          locale,
          timezone,
        }),
      });

      const result = await response.json() as {
        success: boolean;
        error?: string;
        qualified?: boolean;
        booking?: {
          primaryProvider: string;
          primaryUrl: string;
          fallbackProvider: string;
          fallbackUrl: string;
        };
        crm?: { attempted: boolean; success: boolean; status?: number };
      };

      if (!response.ok || !result.success) {
        setSubmitError(result.error ?? 'Unable to submit right now. Please try again.');
        trackAnalytics('venture_submit_failed', {
          status: response.status,
          error: result.error ?? 'unknown',
        });
        return;
      }

      setBookingLinks(result.booking ?? null);
      setCrmStatus(result.crm ?? null);
      setSubmitted(true);
      submittedRef.current = true;
      setCurrentStep(STEPS.length);
      trackAnalytics('venture_submit', {
        score: readinessScore,
        tier: tier.title,
        industry: resolvedIndustry,
        readiness: form.readinessLevel,
        qualified: result.qualified ?? false,
      });
    } catch {
      setSubmitError('Network error while submitting. Please try again in a moment.');
      trackAnalytics('venture_submit_failed', {
        status: 'network_error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const stepValidations: Array<() => boolean> = [
    () => Boolean(
      form.fullName &&
      form.email &&
      form.company &&
      form.industry &&
      (form.industry !== 'other' || form.industryOther.trim())
    ),
    () => Boolean(form.ideaSummary && form.problem && form.users && form.businessModel),
    () => Boolean(form.readinessLevel && form.stage && form.timeline && form.aiDepth && form.founderCommitment),
    () => true,
  ];

  const goNextStep = () => {
    if (!stepValidations[currentStep]()) return;
    const nextStep = Math.min(currentStep + 1, STEPS.length - 1);
    trackAnalytics('venture_step_completed', {
      step_id: STEPS[currentStep].id,
      step_index: currentStep + 1,
    });
    setCurrentStep(nextStep);
  };

  const goPrevStep = () => {
    const nextStep = Math.max(currentStep - 1, 0);
    setCurrentStep(nextStep);
  };

  useEffect(() => {
    if (currentStep < STEPS.length) {
      trackAnalytics('venture_step_view', {
        step_id: STEPS[currentStep].id,
        step_index: currentStep + 1,
      });
      stepRef.current = currentStep;
    }
  }, [currentStep]);

  useEffect(() => {
    const onUnload = () => {
      if (!submittedRef.current) {
        trackAnalytics('venture_funnel_dropoff', {
          step_id: STEPS[stepRef.current].id,
          step_index: stepRef.current + 1,
        });
      }
    };

    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
      if (!submittedRef.current) {
        trackAnalytics('venture_funnel_dropoff', {
          step_id: STEPS[stepRef.current].id,
          step_index: stepRef.current + 1,
        });
      }
    };
  }, []);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Venture Studio Qualification Submission');
    const body = encodeURIComponent(
      [
        `Name: ${form.fullName}`,
        `Email: ${form.email}`,
        `Company: ${form.company}`,
        `Industry: ${resolvedIndustry}`,
        `Idea Summary: ${form.ideaSummary}`,
        `Problem: ${form.problem}`,
        `Users: ${form.users}`,
        `Stage: ${form.stage}`,
        `Timeline: ${form.timeline}`,
        `AI Depth: ${form.aiDepth}`,
        `Founder Commitment: ${form.founderCommitment}`,
        `Qualification Score: ${readinessScore}`,
        `Tier: ${tier.title}`,
      ].join('\n')
    );

    return `mailto:info@trivianedge.com?subject=${subject}&body=${body}`;
  }, [form, readinessScore, tier.title, resolvedIndustry]);

  return (
    <section className="section-shell px-4 md:px-6" aria-label="Venture Studio MVP qualification">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" />
            Venture Studio
          </div>
          <h1 className="display-hero text-5xl md:text-7xl font-bold text-text mb-5">
            Build your MVP with us.
            <br />
            <span className="text-holo">Simple process. No red tape.</span>
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-3xl mx-auto">
            Tell us your idea in plain English. Think of this like a quick fit check before we start building together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-6">
          <form onSubmit={onSubmit} className="glass rounded-[2rem] p-7 md:p-9 border border-border space-y-5">
            <h2 className="display-section text-3xl font-bold text-text">Founder Intake</h2>

            {!submitted && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-muted">
                  <span>Qualification Progress</span>
                  <span>Step {currentStep + 1} of {STEPS.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {STEPS.map((step, idx) => (
                    <div key={step.id} className={`h-1.5 rounded-full ${idx <= currentStep ? 'bg-cyan-400' : 'bg-border'}`} />
                  ))}
                </div>
                <p className="text-xs text-muted">{STEPS[currentStep].label}</p>
                <div className="rounded-xl border border-border/70 bg-surface/60 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-widest font-bold text-cyan-400 mb-1">{STEP_GUIDANCE[currentStep].title}</p>
                  <p className="text-xs text-muted">{STEP_GUIDANCE[currentStep].hint}</p>
                </div>
              </div>
            )}

            {!submitted && currentStep === 0 && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">Full Name</span>
                    <input required placeholder="Jane Founder" value={form.fullName} onChange={(e) => onChange('fullName', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">Email</span>
                    <input type="email" required placeholder="jane@company.com" value={form.email} onChange={(e) => onChange('email', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text" />
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2 block">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">Company</span>
                    <input required placeholder="Acme Labs" value={form.company} onChange={(e) => onChange('company', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">Industry</span>
                    <select required value={form.industry} onChange={(e) => onChange('industry', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text">
                      <option value="">Select</option>
                      <option value="fintech">FinTech</option>
                      <option value="healthtech">HealthTech</option>
                      <option value="b2b-saas">B2B SaaS</option>
                      <option value="logistics">Logistics</option>
                      <option value="ecommerce">Ecommerce</option>
                      <option value="edtech">EdTech</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>

                {form.industry === 'other' && (
                  <label className="space-y-2 block">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">Your Industry</span>
                    <input
                      required
                      placeholder="For example: Construction Tech"
                      value={form.industryOther}
                      onChange={(e) => onChange('industryOther', e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text"
                    />
                  </label>
                )}
              </>
            )}

            {!submitted && currentStep === 1 && (
              <>
                <label className="space-y-2 block">
                  <span className="text-xs uppercase tracking-widest font-bold text-muted">Idea Summary</span>
                  <textarea required placeholder="AI co-pilot for field service reporting." value={form.ideaSummary} onChange={(e) => onChange('ideaSummary', e.target.value)} rows={3} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text" />
                </label>

                <label className="space-y-2 block">
                  <span className="text-xs uppercase tracking-widest font-bold text-muted">What problem are you solving?</span>
                  <textarea required placeholder="Teams lose hours writing manual reports and miss critical updates." value={form.problem} onChange={(e) => onChange('problem', e.target.value)} rows={3} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text" />
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2 block">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">Who are the first users?</span>
                    <input required placeholder="Ops managers at 50 to 500 person service companies" value={form.users} onChange={(e) => onChange('users', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">Business Model</span>
                    <select required value={form.businessModel} onChange={(e) => onChange('businessModel', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text">
                      <option value="">Select</option>
                      <option value="b2b">B2B</option>
                      <option value="b2c">B2C</option>
                      <option value="marketplace">Marketplace</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>
              </>
            )}

            {!submitted && currentStep === 2 && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">Readiness Level</span>
                    <select required value={form.readinessLevel} onChange={(e) => onChange('readinessLevel', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text">
                      <option value="">Select</option>
                      <option value="validated">Validated demand with real signals</option>
                          <option value="discovery">Some early validation in progress</option>
                      <option value="exploratory">Exploratory concept</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">Current Stage</span>
                    <select required value={form.stage} onChange={(e) => onChange('stage', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text">
                      <option value="">Select</option>
                      <option value="concept">Concept only</option>
                      <option value="prototype">Prototype exists</option>
                      <option value="early-users">Early users/customers</option>
                    </select>
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">Target MVP Timeline</span>
                    <select required value={form.timeline} onChange={(e) => onChange('timeline', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text">
                      <option value="">Select</option>
                      <option value="under-4-weeks">Under 4 weeks</option>
                      <option value="one-quarter">Within one quarter</option>
                      <option value="exploratory">Still exploratory</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted">AI Role In Product</span>
                    <select required value={form.aiDepth} onChange={(e) => onChange('aiDepth', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text">
                      <option value="">Select</option>
                      <option value="core-ai">Core AI product</option>
                      <option value="ai-assisted">AI-assisted workflow</option>
                      <option value="open-to-discovery">Open to discovery</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-muted">Founder Commitment</span>
                  <select required value={form.founderCommitment} onChange={(e) => onChange('founderCommitment', e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text">
                    <option value="">Select</option>
                    <option value="full-time">Full-time focus</option>
                    <option value="part-time">Part-time focus</option>
                    <option value="undecided">Still deciding</option>
                  </select>
                </label>
              </>
            )}

            {!submitted && currentStep === 3 && (
              <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
                <p className="text-xs uppercase tracking-widest font-bold text-muted">Final Review</p>
                <p className="text-sm text-muted"><span className="font-semibold text-text">Founder:</span> {form.fullName} ({form.email})</p>
                <p className="text-sm text-muted"><span className="font-semibold text-text">Company:</span> {form.company} • {resolvedIndustry}</p>
                <p className="text-sm text-muted"><span className="font-semibold text-text">Idea:</span> {form.ideaSummary}</p>
                <p className="text-sm text-muted"><span className="font-semibold text-text">Readiness:</span> {form.readinessLevel} • {form.timeline}</p>
              </div>
            )}

            {!submitted && (
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={goPrevStep}
                  disabled={currentStep === 0}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border text-text font-semibold disabled:opacity-40"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <button type="button" onClick={goNextStep} className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl premium-button micro-press-button font-bold">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl premium-button micro-press-button font-bold disabled:opacity-60">
                    Submit Qualification
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {submitError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 px-4 py-3 text-sm">
                {submitError}
              </div>
            )}

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.45 }}
                className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6"
              >
                <p className="text-xs uppercase tracking-widest font-bold text-cyan-400 mb-2">Submission Received</p>
                <h3 className="text-2xl font-bold text-text mb-2">Your Venture Studio packet is confirmed.</h3>
                <p className="text-sm text-muted">Next step: pick a booking option below and lock in your founder call.</p>
              </motion.div>
            )}
          </form>

          <aside className="glass rounded-[2rem] p-7 md:p-9 border border-border h-fit">
            <p className="text-xs uppercase tracking-widest font-bold text-muted mb-2">Weighted Qualification Signal</p>
            <p className="text-5xl font-bold text-text mb-4">{readinessScore}<span className="text-xl text-muted">/100</span></p>
            <h3 className={`text-2xl font-bold mb-3 ${tier.tone}`}>{tier.title}</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">{tier.note}</p>

            <div className="rounded-xl border border-border p-4 mb-6 space-y-2">
              <p className="text-xs uppercase tracking-widest font-bold text-muted">How We Score Fit</p>
              <p className="text-xs text-muted">Readiness + traction carry the highest weight.</p>
              <p className="text-xs text-muted">Industry fit and AI scope are secondary multipliers.</p>
              <p className="text-xs text-muted">Timeline and commitment increase priority.</p>
            </div>

            <ul className="space-y-3 text-sm text-muted mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Fast founder response</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Clear MVP scope</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Real user problem fit</li>
            </ul>

            {submitted ? (
              <div className="space-y-3">
                <a
                  href={bookingLinks?.primaryUrl ?? getCalendlyHook(form.fullName, form.email)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAnalytics('venture_calendar_hook_click', { provider: bookingLinks?.primaryProvider ?? 'calendly', score: readinessScore })}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl premium-button micro-press-button font-bold text-sm w-full"
                >
                  <CalendarDays className="w-4 h-4" />
                  Book Via {bookingLinks?.primaryProvider === 'google-calendar' ? 'Google Calendar' : 'Calendly'}
                </a>
                <a
                  href={bookingLinks?.fallbackUrl ?? getGoogleCalendarHook(form.fullName, form.ideaSummary)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAnalytics('venture_calendar_hook_click', { provider: bookingLinks?.fallbackProvider ?? 'google-calendar', score: readinessScore })}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-text font-semibold text-sm w-full"
                >
                  Add To Google Calendar
                </a>
                <a href={mailtoHref} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-text font-semibold text-sm w-full">
                  Send Qualification Packet
                </a>
                {crmStatus?.attempted && (
                  <p className="text-xs text-muted text-center">
                    CRM handoff: {crmStatus.success ? 'Lead synced successfully.' : `Webhook returned status ${crmStatus.status ?? 'unknown'}.`}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted">Complete the funnel to unlock calendar booking hooks and submission export.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default VentureStudioPage;
