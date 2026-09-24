import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import Accordion from '../../components/Accordion';
import RelatedLinks from '../../components/RelatedLinks';
import { serviceSchema, faqSchema, breadcrumbSchema } from '../../utils/seo';
import { MICROSOFT_PARTNER } from '../../constants/microsoftPartner';
import { BOOKING_URL } from '../../constants';

// Claims policy (see constants/company.ts): Microsoft AI Cloud Partner Program
// member, not CSP, so no licence resale or billing claims. Google is a
// capability, not a partnership. Timelines are "typical", never promised.

const URL = 'https://www.trivianedge.com/services/cloud';

const OFFERINGS = [
  {
    title: 'Microsoft 365 and Copilot',
    text: 'Tenant setup and clean-up, email and file migration, Teams and SharePoint structure, licence right-sizing, and Copilot readiness: data permissions, sensitivity labels and a staged rollout so Copilot only sees what each person should see.',
  },
  {
    title: 'Microsoft Azure',
    text: 'Landing zones, workload migration from on-premises or other clouds, hybrid connectivity, backup and recovery, and regular cost reviews to remove idle resources and choose the right reservations.',
  },
  {
    title: 'Google Workspace',
    text: 'Workspace setup and administration, Gmail, Drive and Calendar migration, shared-drive structure, and security settings for growing teams.',
  },
  {
    title: 'Google Cloud',
    text: 'Architecture and migration of workloads to Google Cloud, identity and access design, and day-to-day operations for teams that run on Google.',
  },
  {
    title: 'Microsoft ↔ Google migrations',
    text: 'Moves in either direction: Google Workspace to Microsoft 365, or Microsoft 365 to Google Workspace. Mail, calendars, files and identities move in phases, so people keep working during the switch.',
  },
  {
    title: 'Identity and security baseline',
    text: 'Multi-factor authentication for everyone, conditional access, admin-role clean-up, device policies and a written security baseline you can show auditors and customers.',
  },
];

const STEPS = [
  { n: '01', title: 'Assess', text: 'We inventory your tenant or cloud estate: users, licences, data, apps, security settings and costs.' },
  { n: '02', title: 'Plan', text: 'You get a written plan with scope, cut-over steps, risks and a written estimate. Nothing moves until you approve it.' },
  { n: '03', title: 'Migrate or fix', text: 'We do the work in phases with a rollback path at each step, and keep staff working throughout.' },
  { n: '04', title: 'Run', text: 'Optional managed service: user changes, security monitoring, updates and a monthly review of cost and risk.' },
];

const FAQS = [
  {
    question: 'What cloud services does TrivianEdge provide?',
    answer:
      'TrivianEdge plans, migrates, secures and manages Microsoft 365, Microsoft Copilot, Azure, Google Workspace and Google Cloud for growing companies. That includes migrations between Microsoft and Google, identity and security baselines, and ongoing managed support.',
  },
  {
    question: 'Is TrivianEdge a Microsoft partner?',
    answer:
      'Yes. TrivianEdge is a member of the Microsoft AI Cloud Partner Program (Partner ID 7154428) and a Microsoft Commercial Marketplace publisher.',
  },
  {
    question: 'Does TrivianEdge sell Microsoft or Google licences?',
    answer:
      'Not at the moment. You keep buying licences through your current provider or directly from Microsoft or Google, and TrivianEdge sets up, secures and manages the environment. We also review your licences and tell you where you are over-paying.',
  },
  {
    question: 'Can you migrate us from Google Workspace to Microsoft 365, or the other way?',
    answer:
      'Yes. We migrate mail, calendars, files and user accounts in either direction, in planned phases, so staff keep working during the move. Every migration starts with an inventory and a written cut-over plan that you approve before any data moves.',
  },
  {
    question: 'How long does a Microsoft 365 or Google Workspace migration take?',
    answer:
      'It depends on the number of users, the amount of data and how many apps are connected. After the assessment we give you a written timeline and estimate, so you know the dates before anything starts.',
  },
  {
    question: 'Is TrivianEdge only for Canadian companies?',
    answer:
      'No. TrivianEdge is based in Toronto and works with companies in Canada, the United States, the UK, Australia and the Middle East. Most cloud work is done remotely.',
  },
];

const CloudServicesPage: React.FC = () => (
  <>
    <SEOHead
      title="Microsoft & Google Cloud Services in Canada | TrivianEdge"
      description="TrivianEdge plans, migrates, secures and manages Microsoft 365, Copilot, Azure, Google Workspace and Google Cloud. Toronto-based Microsoft AI Cloud Partner Program member."
      keywords="Microsoft 365 migration Canada, Microsoft cloud partner Toronto, Copilot rollout, Azure migration Canada, Google Workspace migration, Google Workspace to Microsoft 365, Google Cloud services Canada, managed cloud services Toronto"
      canonical={URL}
      structuredData={[
        serviceSchema('Microsoft & Google Cloud Services', 'Cloud Migration and Managed Cloud Services', URL),
        faqSchema(FAQS),
        breadcrumbSchema([
          { name: 'Home', url: 'https://www.trivianedge.com' },
          { name: 'Services', url: 'https://www.trivianedge.com/services' },
          { name: 'Cloud', url: URL },
        ]),
      ]}
    />

    <div className="bg-background text-text">
      {/* Hero: answer first */}
      <section className="hero-mesh border-b border-border px-4 sm:px-6 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-muted mb-8">
            <Link to="/" className="hover:text-text">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/services" className="hover:text-text">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-text">Cloud</span>
          </nav>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-400 mb-5">Cloud services</p>
          <h1 className="display-hero font-semibold">Microsoft and Google cloud services, set up and run properly.</h1>
          <p className="mt-8 text-lg md:text-xl text-muted leading-relaxed max-w-3xl">
            TrivianEdge plans, migrates, secures and manages Microsoft 365, Copilot, Azure, Google Workspace and Google Cloud
            for growing companies that don't have a full in-house IT team. We're based in Toronto and are a member of the
            Microsoft AI Cloud Partner Program (Partner ID {MICROSOFT_PARTNER.partnerId}).
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-4 font-bold text-black hover:bg-cyan-300 transition-colors">
              Book a 15-minute call <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="#how-it-works" className="inline-flex items-center justify-center rounded-full border border-border px-7 py-4 font-bold hover:bg-surface transition-colors">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="section-shell px-4 sm:px-6" aria-labelledby="cloud-what">
        <div className="max-w-6xl mx-auto">
          <h2 id="cloud-what" className="display-section font-semibold mb-4">What we do in the cloud</h2>
          <p className="text-muted text-lg max-w-3xl mb-12">
            One team for both platforms. Many companies run Microsoft and Google side by side; we look after both, and move
            you from one to the other when it makes sense.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-3xl overflow-hidden">
            {OFFERINGS.map(o => (
              <article key={o.title} className="bg-background p-8">
                <h3 className="text-xl font-semibold mb-3">{o.title}</h3>
                <p className="text-muted leading-relaxed">{o.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section-tint section-shell px-4 sm:px-6 scroll-mt-24" aria-labelledby="cloud-how">
        <div className="max-w-6xl mx-auto">
          <h2 id="cloud-how" className="display-section font-semibold mb-12">How a cloud project works</h2>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {STEPS.map(s => (
              <li key={s.n} className="border-t border-text/60 pt-6">
                <span className="[font-family:var(--font-display)] text-4xl font-light text-cyan-700 dark:text-cyan-400 tabular-nums">{s.n}</span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* One partner */}
      <section className="section-shell px-4 sm:px-6" aria-labelledby="cloud-why">
        <div className="max-w-4xl mx-auto">
          <h2 id="cloud-why" className="display-section font-semibold mb-6">Why use TrivianEdge for cloud</h2>
          <ul className="space-y-4 text-lg text-muted leading-relaxed">
            <li><strong className="text-text">One partner for cloud, software and people.</strong> The same team that runs your Microsoft 365 or Google tenant can build the AI tools on top of it and staff the people who use them.</li>
            <li><strong className="text-text">Written plans before any work.</strong> You see the scope, the steps and the estimated cost before anything starts.</li>
            <li><strong className="text-text">Security first.</strong> Every engagement starts with multi-factor authentication, admin clean-up and a security baseline.</li>
            <li><strong className="text-text">Plain answers.</strong> On managed plans, a monthly review in plain English: what changed, what it costs, and what we recommend next.</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-tint section-shell px-4 sm:px-6 border-t border-border" aria-labelledby="cloud-faq">
        <div className="max-w-3xl mx-auto">
          <h2 id="cloud-faq" className="display-section font-semibold mb-10">Cloud questions, answered</h2>
          <Accordion items={FAQS} />
        </div>
      </section>

      <RelatedLinks
        title="Related services"
        links={[
          { label: 'AI development', desc: 'Copilot extensions, AI agents and automations built on your Microsoft or Google data.', to: '/services/ai-development' },
          { label: 'Custom software development', desc: 'Web applications and internal tools, built by dedicated engineering teams.', to: '/services/it-outsourcing' },
          { label: 'Security and compliance', desc: 'How TrivianEdge handles data, access and compliance.', to: '/trust' },
          { label: 'All services', desc: 'Cloud, AI and software, and global teams in one place.', to: '/services' },
        ]}
      />
    </div>
  </>
);

export default CloudServicesPage;
