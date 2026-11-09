import React from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { TALENT_HUBS, STEPS, BOOKING_URL } from '../constants';
import { CASE_STUDIES, WEBSITE_PROJECTS } from '../constants/proof';
import { MICROSOFT_PARTNER, partnerBadgeLabel } from '../constants/microsoftPartner';
import { GOOGLE_PARTNER } from '../constants/googlePartner';
import { PILLARS, HERO_FACTS, HOME_FAQS } from '../constants/home';
import { TalentHub } from '../types';
import Accordion from '../components/Accordion';
import InquiryForm from '../components/InquiryForm';

// Full write-ups for the case-study cards. Clients without one fall back to /proof.
const FEATURED_CLIENT = 'Cargo Login';
const FEATURED_WEBSITES = WEBSITE_PROJECTS.filter(project =>
  ['capricorn-college', 'cargo-login', 'melliebugs'].includes(project.id),
);

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
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Offshore outsourcing · Toronto, Canada</p>

            {/* The one gradient headline on the page (colour system rule 07). */}
            <h1 className="display-hero font-semibold te-gradient-text">
              Offshore talent, staff augmentation, and bespoke software development
            </h1>

            <p className="mt-8 text-lg md:text-xl text-[#B4BCBA] max-w-xl leading-relaxed">
              TrivianEdge is a Toronto-based offshore outsourcing company. We source offshore professionals for your existing team,
              build dedicated offshore teams, and develop custom software. We also provide Microsoft and Google cloud services.
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

          <aside className="lg:col-span-5 rounded-3xl border border-white/15 bg-[#0d1b1c] p-6 md:p-8" aria-label="Featured client work">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Client work · Cargo Login</p>
            <p className="mt-4 text-2xl font-semibold text-white">One logistics operation across two time zones</p>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              <li className="rounded-2xl border border-white/15 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Canada</p>
                <p className="mt-2 text-white">Client operations</p>
              </li>
              <li className="rounded-2xl border border-white/15 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Philippines</p>
                <p className="mt-2 text-white">Offshore operations support</p>
              </li>
            </ol>
            <Link to="/blog/cargo-login-case-study" className="mt-6 inline-flex items-center gap-2 font-bold text-cyan-400 hover:underline">
              Read the Cargo Login case study <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </aside>
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

        <div className="relative mx-auto max-w-7xl border-t border-white/10 py-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/65">Selected client work</p>
            <Link to="/proof#websites" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:underline">
              Explore the website portfolio <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ul className="grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-8" aria-label="Client website projects">
            {WEBSITE_PROJECTS.map(client => (
              <li key={client.id} className="min-w-0 bg-[#0b1415]">
                <Link to={`/proof#${client.id}`} aria-label={`View ${client.name} project`} className="flex h-20 items-center justify-center px-3 transition-colors hover:bg-[#183334] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-400 md:h-24">
                  {client.logo ? (
                    <img src={client.logo} alt="" width={client.width} height={client.height} loading="lazy" className={`${client.crest ? 'h-9' : 'h-7'} w-auto max-w-full object-contain`} />
                  ) : (
                    <span className="text-center text-xs font-semibold leading-tight text-white sm:text-sm">{client.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== 2. CORE SERVICES ===== */}
      <section id="services" aria-labelledby="services-heading" className="section-shell px-4 md:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div id="services-heading">
            <SectionHead
              label="What we do"
              title="How can we help?"
              intro="Fill a skills gap, build a team for ongoing work, or give a software project to a delivery partner."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PILLARS.map(service => (
              <article key={service.id} className="flex flex-col rounded-3xl border border-border bg-background p-6 md:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">{service.kicker}</p>
                <h3 className="mt-4 text-2xl font-semibold text-text">{service.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{service.answer}</p>
                <ul className="mb-6 mt-5 list-disc space-y-2 pl-5 text-sm text-text">
                  {service.items.map(item => <li key={item}>{item}</li>)}
                </ul>
                <Link to={service.href} className="mt-auto inline-flex items-center gap-2 self-start font-bold text-cyan-700 hover:underline dark:text-cyan-400">
                  {service.cta} <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </article>
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
            <SectionHead dark label="Client work" title="Websites we’ve built" intro="Explore the public sites we’ve delivered for clients in education, logistics, and retail." />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {FEATURED_WEBSITES.map((project, index) => (
              <Link
                key={project.id}
                to={`/proof#${project.id}`}
                className={`group relative isolate block overflow-hidden rounded-3xl border border-white/15 bg-[#122425] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 ${index === 0 ? 'md:row-span-2' : ''}`}
              >
                <img
                  src={`/portfolio/${project.id}.jpg`}
                  alt=""
                  width={1200}
                  height={750}
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover object-top motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03] ${index === 0 ? 'aspect-[8/5] md:h-full' : 'aspect-[2/1]'}`}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black via-black/85 to-transparent px-5 pb-5 pt-16 md:px-7 md:pb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{project.category}</p>
                    <h3 className="mt-1 text-xl font-bold text-white md:text-2xl">{project.name}</h3>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-white" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link to="/proof#websites" className="inline-flex items-center gap-2 font-bold text-cyan-400 hover:underline">
              View the full website portfolio <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/contact?service=bespoke-software&amp;source=/%23proof" className="font-semibold text-white hover:underline">
              Discuss your website project
            </Link>
          </div>
          <h2 className="mb-6 mt-16 text-2xl font-semibold text-white md:text-3xl">Client case studies</h2>
          <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
            {[...CASE_STUDIES].sort((first, second) => Number(second.client === FEATURED_CLIENT) - Number(first.client === FEATURED_CLIENT)).map(study => (
              <m.article key={study.client} {...reveal} className={`bg-[#07090a] p-8 md:p-10 flex flex-col ${study.client === FEATURED_CLIENT ? "md:col-span-2" : ""}`}>
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
            <SectionHead label="How it works" title="From first call to a clear plan." intro="We agree on the work, milestones, and next steps before we start." />
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

      <section className="section-shell border-t border-border px-4 md:px-6" aria-labelledby="cloud-heading">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">Additional capabilities</p>
          <h2 id="cloud-heading" className="mt-3 text-3xl font-semibold text-text">Microsoft and Google cloud services</h2>
          <p className="mt-4 max-w-2xl text-muted">We plan, migrate, secure and manage Microsoft 365, Azure, Google Workspace and Google Cloud.</p>
          <Link to="/services/cloud" className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-700 hover:underline dark:text-cyan-400">
            Explore cloud services <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
            {(MICROSOFT_PARTNER.enabled || GOOGLE_PARTNER.enabled) && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {MICROSOFT_PARTNER.enabled && (
                <Link
                  to={`/services#${MICROSOFT_PARTNER.anchor}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-text backdrop-blur transition-colors hover:border-cyan-500"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
                  {partnerBadgeLabel()}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
                )}
                {GOOGLE_PARTNER.enabled && (
                  <Link
                    to="/services/cloud"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-text backdrop-blur transition-colors hover:border-cyan-500"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4DBC9F]" aria-hidden />
                    {GOOGLE_PARTNER.badgeLabel}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                )}
              </div>
            )}
        </div>
      </section>

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
              Tell us which role, team or software project you need help with. Your message goes straight to our founder, Kevin Vaz, not a call centre,
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
            <InquiryForm source="/#contact" />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
