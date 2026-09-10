import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Route,
  Satellite,
  FileCheck2,
  PackageCheck,
  Globe2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Accordion from '../components/Accordion';
import RelatedLinks from '../components/RelatedLinks';
import { faqSchema, breadcrumbSchema } from '../utils/seo';

const AETHER_URL = 'https://www.trivianedgeglobal.com';

const FAQS = [
  {
    question: 'What is Aether Logistics OS?',
    answer:
      'Aether Logistics OS is an AI-native freight operating system built by TrivianEdge. It automates end-to-end freight orchestration across 195 countries through an 8-step "Golden Path": intent parsing, compliance validation, route optimization, smart-contract carrier booking, terminal sync, satellite telemetry, customs clearance, and final-mile delivery.',
  },
  {
    question: 'How does Aether turn a shipment request into a booking?',
    answer:
      'Aether\'s Intent Engine parses an unstructured shipment request — email, chat, or voice — into a structured freight order in under 500ms. From there its Route Optimizer balances cost, transit time, and carbon footprint across sea, air, and land corridors before Smart Booking confirms the carrier via an immutable smart contract.',
  },
  {
    question: 'What compliance coverage does Aether provide?',
    answer:
      'A 195-country compliance mesh validates sanctions lists, trade embargoes, and customs requirements before any commitment is made, and pre-clears customs so duties are calculated and settled before the vessel docks.',
  },
  {
    question: 'Does Aether provide shipment tracking?',
    answer:
      'Yes. Its Deep-Ocean Telemetry layer uses LEO satellite and IoT sensors for sub-minute position updates, plus real-time temperature, humidity, and shock monitoring for cold-chain cargo, with electronic proof of delivery (e-POD) at final mile.',
  },
  {
    question: 'Is Aether Logistics OS built by TrivianEdge?',
    answer:
      'Yes. Aether Logistics OS is a product built and operated by TrivianEdge, the same company behind TrivianEdge\'s BPO, offshore software development, global talent services, and Aria OS. It runs as a standalone application at trivianedgeglobal.com.',
  },
  {
    question: 'How much does Aether Logistics OS cost?',
    answer:
      'Aether publishes live pricing inside the product, synced directly from its billing system rather than a static marketing page. Sign up on trivianedgeglobal.com to see current plans and limits.',
  },
];

const GOLDEN_PATH = [
  { step: '01', title: 'Intent Engine', desc: 'Natural language to freight order. AI parses any unstructured shipment request into a precise, structured order in under 500ms.' },
  { step: '02', title: 'Compliance Firewall', desc: 'A 195-country compliance mesh validates sanctions lists, trade embargoes, and customs requirements before a dollar is committed.' },
  { step: '03', title: 'Route Optimizer', desc: 'Balances cost, transit time, and carbon footprint across sea, air, and land corridors in a single optimization pass.' },
  { step: '04', title: 'Smart Booking', desc: 'Automated selection from 200+ global carriers with immutable smart-contract confirmation — no disputed invoices.' },
  { step: '05', title: 'Gated-Sync', desc: 'Direct API integration with port Terminal Operating Systems for automated gate-in/gate-out and verified gross mass confirmation.' },
  { step: '06', title: 'Deep-Ocean Telemetry', desc: 'LEO satellite and IoT cold-chain monitoring deliver sub-minute position, temperature, humidity, and shock data.' },
  { step: '07', title: 'Customs Clearance', desc: 'Automated HS-code classification with direct customs authority API integration. Duties settled before the vessel docks.' },
  { step: '08', title: 'Final Delivery', desc: 'Electronic proof of delivery (e-POD) paired with automated ESG Carbon Green Certificate generation.' },
];

const CAPABILITIES = [
  { icon: Route, title: 'Golden Path Algorithm', desc: 'Proprietary multi-objective optimization finds the best route across cost, time, and carbon in a single run.' },
  { icon: ShieldCheck, title: 'Universal Compliance Mesh', desc: '195-country regulatory database, updated continuously — sanctions, embargoes, and trade restrictions checked automatically.' },
  { icon: Satellite, title: 'Live Telemetry Grid', desc: 'LEO satellite and IoT sensor mesh deliver second-by-second cargo visibility across every ocean and trade lane.' },
  { icon: FileCheck2, title: 'Smart-Contract Booking', desc: 'Immutable, auditable carrier agreements. Reconciliation is fully automated and disputes are architecturally impossible.' },
];

const AetherLogisticsPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="Aether Logistics OS | AI-Native Freight Operating System by TrivianEdge"
        description="Aether Logistics OS by TrivianEdge automates end-to-end freight orchestration across 195 countries — compliance, routing, carrier booking, terminal sync, customs clearance, and final delivery from one AI control tower."
        keywords="Aether Logistics OS, TrivianEdge logistics, AI freight operating system, freight orchestration software, AI supply chain software, automated customs clearance, smart contract freight booking"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Aether Logistics OS',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'Aether Logistics OS automates end-to-end freight orchestration across 195 countries — compliance, routing, carrier booking, terminal sync, customs clearance and final delivery, all from one AI-powered control tower.',
            url: AETHER_URL,
            creator: {
              '@type': 'Organization',
              '@id': 'https://www.trivianedge.com/#organization',
              name: 'TrivianEdge',
            },
            featureList: [
              'AI Intent Engine for natural-language shipment requests',
              'Compliance Firewall across 195 countries',
              'Multi-variable route optimization',
              'Smart-contract carrier booking',
              'Terminal Operating System sync',
              'LEO satellite and IoT telemetry',
              'Automated customs clearance',
              'Final-mile delivery with e-POD and ESG certification',
            ],
          },
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Aether Logistics OS', url: 'https://www.trivianedge.com/ai-ventures/aether-logistics' },
          ]),
        ]}
      />

      <div className="bg-background min-h-screen text-text">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2">
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
            <li className="text-border">/</li>
            <li className="text-text font-medium">Aether Logistics OS</li>
          </ol>
        </nav>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
          className="pt-8 pb-20 px-4 md:px-6 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" />
              A TrivianEdge AI Venture
            </div>
            <h1 className="display-hero text-5xl md:text-7xl font-bold text-text mb-6 leading-tight">
              Aether Logistics OS: the{' '}
              <span className="text-holo">AI-native freight operating system</span>
            </h1>
            <p className="text-muted text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Global trade still runs on fax machines and spreadsheets. Aether collapses the $14 trillion freight industry into a single automated 8-step Golden Path — compliance, routing, booking, telemetry, customs, and delivery, run by one AI control tower. Built by TrivianEdge.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Globe2, label: '195 countries covered' },
                { icon: CheckCircle2, label: '200+ global carriers' },
                { icon: ShieldCheck, label: 'Smart-contract booking' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 px-4 py-2 glass rounded-full border-border text-sm font-medium text-muted">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <a
                href={AETHER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button micro-press-button"
              >
                Launch Aether OS
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold border border-border text-text"
              >
                Talk to TrivianEdge
              </Link>
            </div>
          </div>
        </motion.section>

        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-4 text-center reveal">The 8-Step Golden Path</h2>
            <p className="text-muted text-center max-w-2xl mx-auto mb-12 reveal">
              Every shipment follows the same predictable, fully automated workflow. No exceptions, no manual handoffs.
            </p>
            <div className="space-y-6">
              {GOLDEN_PATH.map((item, idx) => (
                <div key={item.step} style={{ transitionDelay: `${idx * 40}ms` }} className="flex gap-6 reveal">
                  <div className="text-3xl font-bold text-cyan-400/30 leading-none w-12 shrink-0">{item.step}</div>
                  <div className="glass rounded-2xl p-5 border-border flex-1">
                    <h3 className="font-bold text-text mb-1.5">{item.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">Built for the complexity of real-world trade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CAPABILITIES.map(({ icon: Icon, title, desc }, idx) => (
                <div
                  key={title}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  className="glass rounded-2xl p-6 border-border reveal"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-4">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-text mb-2">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">Pricing</h2>
            <p className="text-muted text-lg leading-relaxed mb-6">
              Aether Logistics OS publishes live pricing inside the product, synced directly from its billing system rather than a static marketing page — so what you see at signup is always current.
            </p>
            <a href={AETHER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-cyan-400 font-semibold hover:underline">
              See current plans on Aether Logistics OS <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">How Aether relates to TrivianEdge</h2>
            <p className="text-muted text-lg leading-relaxed">
              Aether Logistics OS is built and operated by TrivianEdge — the same team behind{' '}
              <Link to="/services/bpo" className="text-cyan-400 hover:underline">BPO</Link>,{' '}
              <Link to="/services/it-outsourcing" className="text-cyan-400 hover:underline">IT outsourcing</Link>,{' '}
              <Link to="/services/ai-development" className="text-cyan-400 hover:underline">AI development services</Link>, and{' '}
              <Link to="/ai-ventures/aria" className="text-cyan-400 hover:underline">Aria OS</Link>. Where TrivianEdge staffs and manages offshore teams, Aether is the AI control tower for global freight operations — a standalone production application at{' '}
              <a href={AETHER_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">trivianedgeglobal.com</a>.
            </p>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-4 text-center">Frequently Asked Questions</h2>
            <p className="text-muted text-center mb-10">Everything you need to know about Aether Logistics OS.</p>
            <Accordion items={FAQS} />
          </div>
        </section>

        <RelatedLinks
          links={[
            { label: 'Aria OS', desc: 'TrivianEdge\'s autonomous workforce operating system for HR, payroll, and compliance.', to: '/ai-ventures/aria' },
            { label: 'BPO services', desc: 'TrivianEdge-managed offshore teams for back-office and support functions.', to: '/services/bpo' },
            { label: 'AI development', desc: 'Custom AI products and automation built by TrivianEdge engineers.', to: '/services/ai-development' },
            { label: 'About TrivianEdge', desc: 'The company behind Aether Logistics OS and TrivianEdge\'s outsourcing services.', to: '/about' },
          ]}
        />

        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-4">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">The future of freight is already running</h2>
            <p className="text-muted mb-8">Explore every module — from Intent Engine to Final Mile Delivery.</p>
            <a
              href={AETHER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button micro-press-button"
            >
              Enter the OS
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default AetherLogisticsPage;
