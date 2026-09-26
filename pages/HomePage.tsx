import React, { lazy, Suspense } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { TALENT_HUBS, STEPS, BOOKING_URL } from '../constants';
import { CASE_STUDIES } from '../constants/proof';
import { MICROSOFT_PARTNER, partnerBadgeLabel } from '../constants/microsoftPartner';
import { PILLARS, HERO_FACTS, HOME_FAQS } from '../constants/home';
import { TalentHub } from '../types';
import Accordion from '../components/Accordion';
import InquiryForm from '../components/InquiryForm';

// The globe is canvas-only and purely visual, so it loads after the hero text.
const OpsGlobe = lazy(() => import('../components/OpsGlobe'));

// Real named clients only, each linking to the live site we delivered.
// width/height are intrinsic sizes to avoid CLS.
// Logo files are pre-rendered white on transparent (crests keep their interior detail via
// luminance-to-alpha), so no CSS filter is applied. A brightness-0 silhouette flattens crests into blobs.
// Crests render a touch taller than wordmarks so their detail stays legible at the same visual weight.
const TRUST_CLIENTS = [
  { name: 'Capricorn College', logo: '/logos/capricorn-college.webp', href: 'https://www.capricorncollegeholbrook.lk/', width: 86, height: 64, crest: true },
  { name: 'Cargo Login', logo: '/logos/cargo-login.webp', href: 'https://www.cargo-login.com/', width: 62, height: 64 },
  { name: 'Keynotive', logo: '/logos/keynotive.webp', href: 'https://www.keynotive.io/', width: 201, height: 160 },
  { name: 'Hub-Flx', logo: '/logos/hub-flx.webp', href: 'https://www.hub-flx.com/', width: 250, height: 64 },
  { name: 'Keynesia International School', logo: '/logos/keynesia-international-school.webp', href: 'https://keynesiasrilanka.com', width: 69, height: 64, crest: true },
  { name: 'MellieBugs', logo: '/logos/melliebugs.webp', href: 'https://melliebugs.com', width: 64, height: 64, crest: true },
];

// Full write-ups for the case-study cards. Clients without one fall back to /proof.
const CASE_STUDY_LINKS: Record<string, string> = {
  'Cargo Login': '/blog/cargo-login-case-study',
  Keynotive: '/blog/keynotive-case-study',
  'Hub-Flx': '/blog/hub-flx-case-study',
};

const EASE = [0.16, 1, 0.3, 1] as const;

const SectionHead: React.FC<{ label: string; title: React.ReactNode; intro?: string; dark?: boolean }> = ({ label, title, intro, dark }) => (
  <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-12 md:mb-16">
    <p className={`lg:col-span-3 text-[11px] font-bold uppercase tracking-[0.25em] pt-3 ${dark ? 'text-cyan-400' : 'text-cyan-700 dark:text-cyan-400'}`}>
      {label}
    </p>
    <div className="lg:col-span-9">
      <h2 className={`display-section font-semibold ${dark ? 'text-white' : 'text-text'}`}>{title}</h2>
      {intro && <p className={`mt-5 text-lg max-w-2xl leading-relaxed ${dark ? 'text-white/60' : 'text-muted'}`}>{intro}</p>}
    </div>
  </div>
);

const HomePage: React.FC<{ setSelectedHub: (hub: TalentHub | null) => void }> = ({ setSelectedHub }) => {
  const reduceMotion = useReducedMotion();
  const reveal = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, ease: EASE },
  };

  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section aria-label="Introduction" className="hero-dark relative overflow-hidden px-4 sm:px-6 pt-32 md:pt-40 pb-0" style={{ background: 'var(--te-gradient-hero)' }}>
        {/* Hairline grid — reads as an engineering surface, fades out at the edges */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 60% 40%, #000 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 60% 40%, #000 30%, transparent 75%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          <div className="lg:col-span-7">
            {MICROSOFT_PARTNER.enabled && (
              <div className="mb-8">
                <Link
                  to={`/services#${MICROSOFT_PARTNER.anchor}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur transition-colors hover:border-white/30 hover:text-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
                  {partnerBadgeLabel()}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            )}

            {/* The one gradient headline on the page (colour system rule 07). */}
            <h1 className="display-hero font-semibold te-gradient-text">
              One partner for cloud, AI and offshore teams.
            </h1>

            <p className="mt-8 text-lg md:text-xl text-[#B4BCBA] max-w-xl leading-relaxed">
              Most companies juggle a cloud reseller, a software agency and a staffing firm. TrivianEdge is a Toronto-based technology
              partner that does all three, under one contract, with one person to call.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-4 font-bold text-black transition-colors hover:bg-cyan-300"
              >
                Book a 15-minute call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 font-bold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Send us a quick brief
              </a>
            </div>
            <p className="mt-4 text-sm text-white/45">Free, no obligation, and we usually reply the same business day.</p>
          </div>

          <div className="lg:col-span-5 relative aspect-square w-full max-w-[560px] mx-auto">
            <Suspense fallback={null}>
              <OpsGlobe />
            </Suspense>
          </div>
        </div>

        {/* Fact rail — plain, verifiable statements (also easy for AI search to quote) */}
        <dl className="relative max-w-7xl mx-auto mt-12 lg:mt-4 grid grid-cols-2 md:grid-cols-4 border-t border-white/10">
          {HERO_FACTS.map((f, i) => (
            <div key={f.k} className={`py-6 md:py-8 ${i % 2 ? 'pl-5 md:pl-8' : ''} ${i > 0 ? 'md:pl-8 md:border-l md:border-white/10' : ''} ${i % 2 ? 'border-l border-white/10' : ''}`}>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-white/40">{f.k}</dt>
              <dd className="mt-2 text-lg md:text-xl font-semibold text-white">{f.v}</dd>
            </div>
          ))}
        </dl>

        {/* Client strip: real named clients, each linking to the live site we delivered. */}
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-10 border-t border-white/10 py-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 shrink-0">Trusted by</p>
          {/* Three copies so the -33.333% loop is seamless; copies 2-3 are hidden from assistive tech. */}
          <div className="marquee-viewport flex-1 min-w-0" role="group" aria-label="Clients">
            <div className="marquee-track">
              {[0, 1, 2].map(rep => (
                <ul key={rep} className="flex items-center gap-14 md:gap-16 pr-14 md:pr-16" aria-hidden={rep > 0 || undefined}>
                  {TRUST_CLIENTS.map(c => (
                    <li key={c.name} className="shrink-0">
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${c.name} (opens in a new tab)`}
                      tabIndex={rep > 0 ? -1 : undefined}
                      className="block opacity-60 hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300"
                    >
                      <img src={c.logo} alt="" width={c.width} height={c.height} loading="lazy" className={`${c.crest ? 'h-9 md:h-10' : 'h-7 md:h-8'} w-auto object-contain`} />
                    </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. SERVICES — editorial rows, not cards ===== */}
      <section id="services" aria-labelledby="services-heading" className="section-shell px-4 md:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div id="services-heading">
            <SectionHead
              label="What we do"
              title={<>Three services. <span className="text-muted">One contract.</span></>}
              intro="Hiring three vendors is like renovating a house with three contractors who never talk to each other. Every problem lands in the gap between them, and you end up as the project manager. We're the general contractor: one contract, one point of contact, and nothing falls between the cracks."
            />
          </div>

          <div className="border-t border-border">
            {PILLARS.map(p => (
              <m.article key={p.id} {...reveal} className="group relative grid lg:grid-cols-12 gap-6 lg:gap-10 py-10 md:py-14 border-b border-border">
                <p className="lg:col-span-3 text-sm font-semibold text-muted tabular-nums">{p.kicker}</p>
                <div className="lg:col-span-5">
                  <h3 className="text-2xl md:text-3xl font-semibold text-text leading-tight">
                    <Link to={p.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-muted leading-relaxed max-w-md">{p.answer}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-700 dark:text-cyan-400">
                    {p.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </span>
                </div>
                <ul className="lg:col-span-4 space-y-2.5 text-text/80">
                  {p.items.map(item => (
                    <li key={item} className="flex gap-3 text-[15px]">
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-cyan-400" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
              </m.article>
            ))}
          </div>

          {/* Hubs — the old map's job, done as a compact, clickable index */}
          <m.div {...reveal} className="mt-12 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <p className="text-sm text-muted shrink-0">Talent hubs:</p>
            <ul className="flex flex-wrap gap-2">
              {TALENT_HUBS.map(hub => (
                <li key={hub.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedHub(hub)}
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:border-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-400"
                  >
                    {hub.country}
                  </button>
                </li>
              ))}
            </ul>
            <Link to="/savings-calculator" className="md:ml-auto text-sm font-bold text-cyan-700 dark:text-cyan-400 hover:underline underline-offset-4">
              Estimate your savings →
            </Link>
          </m.div>
        </div>
      </section>

      {/* ===== 3. PROOF ===== */}
      <section id="proof" aria-labelledby="proof-heading" className="section-dark section-shell px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div id="proof-heading">
            <SectionHead dark label="Client work" title={<>Real engagements. <span className="text-white/45">Plain outcomes.</span></>} />
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
            {CASE_STUDIES.map(study => (
              <m.article key={study.client} {...reveal} className="bg-[#07090a] p-8 md:p-10 flex flex-col">
                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-400">{study.sector}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{study.client}</h3>
                <p className="mt-5 text-white/65 leading-relaxed">{study.outcome}</p>
                <ul className="mt-auto pt-8 flex flex-wrap gap-2">
                  {study.highlights.map(h => (
                    <li key={h} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">{h}</li>
                  ))}
                </ul>
                <Link
                  to={CASE_STUDY_LINKS[study.client] ?? '/proof'}
                  className="mt-8 inline-flex items-center gap-1.5 self-start text-sm font-bold text-cyan-400 hover:underline underline-offset-4"
                  aria-label={`Read the ${study.client} case study`}
                >
                  Read the case study <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </m.article>
            ))}
          </div>
          <div className="mt-12 flex flex-col md:flex-row md:items-center gap-6">
            <p className="text-lg text-white/80">Facing something similar? Let's talk it through.</p>
            <div className="md:ml-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <Link to="/proof" className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-white hover:underline underline-offset-4">
                All case studies <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-bold text-black transition-colors hover:bg-cyan-300"
              >
                Book a 15-minute call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. HOW IT WORKS ===== */}
      <section id="how-it-works" aria-labelledby="how-heading" className="section-shell px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div id="how-heading">
            <SectionHead label="How it works" title="From first call to live team in around 30 days." />
          </div>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {STEPS.map(step => (
              <m.li key={step.number} {...reveal} className="border-t border-text/80 pt-6">
                <span className="[font-family:var(--font-display)] text-5xl font-light text-cyan-700 dark:text-cyan-400 tabular-nums">{step.number}</span>
                <h3 className="mt-5 text-lg font-semibold text-text">{step.title}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{step.description}</p>
              </m.li>
            ))}
          </ol>
          <m.div {...reveal} className="mt-14 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-text px-7 py-4 font-bold text-background transition-opacity hover:opacity-90"
            >
              Start with step 01
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <p className="text-sm text-muted">15 minutes, free, and no sales script.</p>
          </m.div>
        </div>
      </section>

      {/* ===== 5. FAQ ===== */}
      <section id="faq" aria-labelledby="faq-heading" className="section-tint section-shell px-4 md:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-400">FAQ</p>
            <h2 id="faq-heading" className="display-section font-semibold text-text mt-4">Straight answers.</h2>
            <p className="mt-5 text-muted leading-relaxed">
              Not covered here? <Link to="/contact" className="text-text underline underline-offset-4 hover:text-cyan-700">Ask us directly</Link>.
            </p>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={HOME_FAQS} />
          </div>
        </div>
      </section>

      {/* ===== 6. CONTACT ===== */}
      <section id="contact" aria-labelledby="contact-heading" className="section-dark section-shell px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="contact-heading" className="display-section font-semibold text-white">Tell us what you’re trying to fix.</h2>
            <p className="mt-6 text-lg text-white/60 leading-relaxed">
              A cloud migration, an AI build or a new team. Your message goes straight to our founder, Kevin Vaz, not a call centre,
              and we usually reply the same business day with next steps and a rough estimate.
            </p>
            <ul className="mt-8 space-y-2.5 text-white/70">
              {['Free, with no obligation', 'You own 100% of the code we write', 'No foreign entity needed to hire abroad'].map(point => (
                <li key={point} className="flex gap-3">
                  <span className="mt-3 h-px w-4 shrink-0 bg-cyan-400" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-10 space-y-3 text-white/70">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-bold text-cyan-400 hover:underline underline-offset-4">
                Book a 15-minute call <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <p>
                <a href="mailto:kevin.v@trivianedge.com" className="hover:text-white">kevin.v@trivianedge.com</a>
                <span className="mx-2 text-white/30">·</span>
                <a href="tel:+18883472489" className="hover:text-white">+1 888-347-2489</a>
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-white/5 p-6 md:p-10">
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
