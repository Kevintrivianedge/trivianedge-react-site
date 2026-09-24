import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Check,
  Cloud,
  FileText,
  Fingerprint,
  Layers,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import InquiryForm from './InquiryForm';
import { AZURE_METRICS, M365_METRICS, MICROSOFT_PARTNER, partnerBadgeLabel, type PartnerMetric } from '../constants/microsoftPartner';

interface PremiumCloudShowcaseProps {
  /** Override the CTA. When omitted, the built-in inquiry modal opens. */
  onRequestAccess?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.08 },
  }),
};

const pillars = [
  // Billing claims require CSP reselling; see MICROSOFT_PARTNER.cspActive.
  MICROSOFT_PARTNER.cspActive
    ? {
        icon: FileText,
        title: 'Consolidated Billing',
        body: 'One predictable invoice for all enterprise cloud assets.',
      }
    : {
        icon: FileText,
        title: 'Single Point of Accountability',
        body: 'One partner accountable for your entire Microsoft estate.',
      },
  {
    icon: Layers,
    title: 'White-Glove Migration',
    body: 'A dedicated transition team and a planned, phased cut-over, so staff keep working during tenant moves.',
  },
  {
    icon: ShieldCheck,
    title: 'License Governance',
    body: 'Quarterly audits to eliminate unused seats and optimize commitment tiers.',
  },
];

/* ---------- Visual accents ---------- */

interface Capability {
  icon: React.ElementType;
  label: string;
}

// Shows real metrics from constants/microsoftPartner.ts when any are filled in;
// otherwise shows what we deliver, so the panel never displays invented numbers.
const MetricsPanel: React.FC<{ caption: string; metrics: PartnerMetric[]; fallback: Capability[] }> = ({
  caption,
  metrics,
  fallback,
}) => {
  const live = metrics.filter((m): m is PartnerMetric & { value: string } => m.value !== null);
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{caption}</div>
      {live.length > 0 ? (
        <ul className="space-y-3.5">
          {live.map(({ label, value, fill }, i) => (
            <li key={label}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-zinc-400">{label}</span>
                <span className="font-mono tabular-nums text-zinc-200">{value}</span>
              </div>
              {fill !== undefined && (
                <div className="h-px w-full bg-white/[0.06]">
                  <motion.div
                    className="h-px bg-gradient-to-r from-zinc-500 to-white"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(100, Math.max(0, fill))}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: EASE, delay: 0.2 + i * 0.1 }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {fallback.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center justify-between py-2.5 text-xs first:pt-0 last:pb-0">
              <span className="flex items-center gap-2 text-zinc-300">
                <Icon className="h-3.5 w-3.5 text-zinc-500" strokeWidth={1.5} aria-hidden />
                {label}
              </span>
              <Check className="h-3.5 w-3.5 text-emerald-400/90" strokeWidth={2} aria-label="Included" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const M365_CAPABILITIES: Capability[] = [
  { icon: Users, label: 'Seat provisioning & lifecycle' },
  { icon: Fingerprint, label: 'Entra ID identity & MFA' },
  { icon: ShieldCheck, label: 'Conditional access policies' },
  { icon: Bot, label: 'Copilot readiness & rollout' },
];

const AZURE_CAPABILITIES: Capability[] = [
  { icon: Server, label: 'Landing zone & workload design' },
  { icon: Layers, label: 'Hybrid & on-prem connectivity' },
  { icon: ShieldCheck, label: 'Compliance baseline alignment' },
  { icon: FileText, label: 'Cost & reservation review' },
];

/* ---------- Product card ---------- */

interface ProductCardProps {
  index: number;
  eyebrow: string;
  icon: React.ElementType;
  title: string;
  highlights: string[];
  visual: React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({ index, eyebrow, icon: Icon, title, highlights, visual }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Cursor-tracked specular highlight, written to CSS vars to avoid re-renders.
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.article
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      onPointerMove={handleMove}
      className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-[#09090b] p-8 transition-colors duration-500 hover:border-zinc-700 md:p-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.06), transparent 60%)',
        }}
      />
      <div aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Icon className="h-4 w-4 text-zinc-200" strokeWidth={1.5} aria-hidden />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">{eyebrow}</span>
        </div>

        <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h3>

        <ul className="mt-6 space-y-3">
          {highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 text-sm text-zinc-400">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300" strokeWidth={1.75} aria-hidden />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-10">{visual}</div>
      </div>
    </motion.article>
  );
};

/* ---------- Modal ---------- */

const AccessModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-access-title"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0c0c0f] p-6 shadow-2xl md:p-10"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <h2 id="portfolio-access-title" className="mb-6 text-2xl font-semibold tracking-tight text-white">
              Request Portfolio Access
            </h2>
            <InquiryForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------- Main ---------- */

const PremiumCloudShowcase: React.FC<PremiumCloudShowcaseProps> = ({ onRequestAccess }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const reduce = useReducedMotion();

  const handleCta = () => (onRequestAccess ? onRequestAccess() : setModalOpen(true));
  const closeModal = useCallback(() => setModalOpen(false), []);

  // Deep link from the homepage hero badge (/services#microsoft-cloud).
  useEffect(() => {
    if (window.location.hash !== `#${MICROSOFT_PARTNER.anchor}`) return;
    const t = window.setTimeout(
      () => document.getElementById(MICROSOFT_PARTNER.anchor)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }),
      120,
    );
    return () => window.clearTimeout(t);
  }, [reduce]);

  return (
    <section id={MICROSOFT_PARTNER.anchor} className="scroll-mt-24 relative isolate overflow-hidden bg-[#09090b] px-4 py-24 text-white sm:px-6 md:py-36">
      {/* Ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[1100px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(161,161,170,0.18), transparent)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top, black 30%, transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] text-zinc-400 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                {!reduce && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="uppercase">{partnerBadgeLabel()}</span>
            </span>
            {(MICROSOFT_PARTNER.partnerId || MICROSOFT_PARTNER.verifyUrl) && (
              <p className="mt-3 font-mono text-[11px] tracking-wide text-zinc-500">
                {MICROSOFT_PARTNER.partnerId && <>Partner ID {MICROSOFT_PARTNER.partnerId}</>}
                {MICROSOFT_PARTNER.partnerId && MICROSOFT_PARTNER.verifyUrl && ' · '}
                {MICROSOFT_PARTNER.verifyUrl && (
                  <a
                    href={MICROSOFT_PARTNER.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-zinc-700 underline-offset-4 transition hover:text-zinc-300"
                  >
                    Verify on Microsoft
                  </a>
                )}
              </p>
            )}
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-8 bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-transparent md:text-6xl"
          >
            Cloud Infrastructure.
            <br />
            Orchestrated.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg"
          >
            TrivianEdge delivers enterprise-grade Microsoft 365, Azure, and cloud workspace provisioning with
            white-glove governance,{' '}
            {MICROSOFT_PARTNER.cspActive ? 'single-invoice simplicity' : 'one accountable partner'}, and zero friction.
          </motion.p>
        </header>

        {/* Product cards */}
        <div className="mt-20 grid gap-6 md:mt-28 md:grid-cols-2">
          <ProductCard
            index={0}
            eyebrow="Enterprise Workspace & Productivity"
            icon={Sparkles}
            title="Microsoft 365 & Copilot"
            highlights={['Full suite deployment', 'Copilot AI integration', 'Automated user onboarding']}
            visual={<MetricsPanel caption="Microsoft 365 · Managed tenants" metrics={M365_METRICS} fallback={M365_CAPABILITIES} />}
          />
          <ProductCard
            index={1}
            eyebrow="Scalable Cloud Architecture"
            icon={Cloud}
            title="Azure & Hybrid Infrastructure"
            highlights={[
              'Infrastructure optimization',
              'Compliance alignment',
              MICROSOFT_PARTNER.cspActive ? 'Direct distributor-backed SLA' : 'Microsoft-aligned support & escalation',
            ]}
            visual={<MetricsPanel caption="Azure · Managed environments" metrics={AZURE_METRICS} fallback={AZURE_CAPABILITIES} />}
          />
        </div>

        {/* Value pillars */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-6 grid overflow-hidden rounded-3xl border border-zinc-800 md:grid-cols-3"
        >
          {pillars.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className={`p-8 ${i > 0 ? 'border-t border-zinc-800 md:border-l md:border-t-0' : ''}`}
            >
              <Icon className="h-5 w-5 text-zinc-300" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-5 text-sm font-semibold tracking-tight text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="relative mt-24 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 via-zinc-950 to-[#09090b] px-6 py-16 text-center md:mt-32 md:px-16 md:py-20"
        >
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-40 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.12), transparent)' }}
          />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            Access the TrivianEdge Software Catalog
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
            Explore specialized enterprise terms, multi-seat provisioning models, and customized cloud architecture
            reviews.
          </p>
          <motion.button
            type="button"
            onClick={handleCta}
            whileTap={{ scale: 0.97 }}
            className="group relative mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_30px_rgba(255,255,255,0.12)] transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
          >
            Request Portfolio Access
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden
            />
          </motion.button>
        </motion.div>
      </div>

      {!onRequestAccess && <AccessModal open={modalOpen} onClose={closeModal} />}
    </section>
  );
};

export default PremiumCloudShowcase;
