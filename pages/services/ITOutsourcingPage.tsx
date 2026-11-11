import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import RelatedLinks from '../../components/RelatedLinks';
import {
  Code2,
  Globe,
  Shield,
  Cloud,
  GitBranch,
  Layers,
  CheckCircle2,
  MapPin,
  Users2,
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import ServiceVideo from '../../components/ServiceVideo';
import Accordion from '../../components/Accordion';
import { serviceSchema, faqSchema, breadcrumbSchema } from '../../utils/seo';

const IT_SERVICES = [
  { icon: Code2, label: 'Custom Software Development' },
  { icon: Globe, label: 'Web & Mobile Applications' },
  { icon: Shield, label: 'Cybersecurity & Compliance' },
  { icon: Cloud, label: 'Cloud Infrastructure & DevOps' },
  { icon: GitBranch, label: 'CI/CD & Engineering Ops' },
  { icon: Layers, label: 'Systems Integration' },
];

const PROJECT_STEPS = [
  { title: 'Define the scope', description: 'Tell us who will use the software, what they need to do, and which systems it needs to work with.' },
  { title: 'Build and review', description: 'Review the work at agreed milestones so your team can give feedback before launch.' },
  { title: 'Launch and hand over', description: 'Get the code and agree on what documentation, training, or ongoing support you need.' },
];

const CAPRICORN_DELIVERABLES = [
  { icon: Globe, title: 'Public website', description: 'Program information, staff directory, and gallery' },
  { icon: Users2, title: 'Secure faculty portal', description: 'A private workspace for faculty' },
  { icon: MapPin, title: 'GPS attendance verification', description: 'On-campus check-ins recorded in real time' },
];

const FAQS = [
  {
    question: 'What is bespoke software development?',
    answer:
      'Bespoke software development means building custom applications, platforms, and internal tools designed specifically around your business, rather than adapting an off-the-shelf product to fit. TrivianEdge builds and maintains bespoke software as a Canada-based engineering partner, with offshore development teams sourced from six global talent hubs and matched to your exact tech stack. We also deliver the IT outsourcing layer around it, cloud infrastructure, DevOps, cybersecurity, and systems integration, so bespoke software can scale into a fully managed technology function instead of a one-off project.',
  },
  {
    question: 'How long does a bespoke software project take?',
    answer:
      'The timeline depends on the scope, integrations, and launch requirements. After the discovery call, we can propose milestones and identify what needs to be decided before we estimate a launch date.',
  },
  {
    question: 'What bespoke software development services does TrivianEdge provide?',
    answer:
      'TrivianEdge builds custom software, including web and mobile applications, internal tools, and systems integrations. A project can also include DevOps, cloud infrastructure, or security support where the scope calls for it.',
  },
  {
    question: 'How much does bespoke software development cost?',
    answer:
      'Cost depends on the features, integrations, and support you need. Share your requirements and we can discuss the scope and prepare an estimate.',
  },
  {
    question: 'Is TrivianEdge a Canadian bespoke software development company?',
    answer:
      'Yes. TrivianEdge is headquartered in Toronto, Ontario, Canada. We are a Canada-based bespoke software development and IT outsourcing company serving clients across North America, the UK, Australia, and the Middle East. Our operations, contracts, and client management are run from Canada, giving you a local partner with global engineering reach.',
  },
  {
    question: 'How do Canadian startups hire offshore developers with TrivianEdge?',
    answer:
      'Canadian startups hire a dedicated offshore development team through TrivianEdge in three steps: a scoping call from our Toronto office, a shortlist of vetted developers from the Philippines, Sri Lanka, Vietnam, Turkey, South Africa, or Costa Rica, and onboarding into your repos and stand-ups in around 30 days. You can start with a single developer and scale; contracts, invoicing, and client management are handled in Canada.',
  },
  {
    question: 'Does TrivianEdge offer offshore software development in the Philippines?',
    answer:
      'Yes. The Philippines is one of TrivianEdge\'s six talent hubs, with strong English and overlap with North American business hours for support-heavy and full-stack roles. Many Canadian clients combine a Philippines team for web, QA, and operations work with engineers from Sri Lanka or Vietnam for backend and AI work, all under one Canadian contract.',
  },
  {
    question: 'What is the difference between bespoke software development and IT outsourcing?',
    answer:
      'Bespoke software development is the specific work of designing and building custom applications for one company. IT outsourcing is the broader practice of delegating technology functions, development, cloud, security, support, to an external provider. TrivianEdge offers both: dedicated offshore teams that build bespoke software, and the managed IT outsourcing layer that keeps it running once it ships.',
  },
  {
    question: 'Can I outsource just one part of my IT function?',
    answer:
      'Absolutely. TrivianEdge scales to your needs. You can outsource a single function like DevOps, QA testing, or backend development, or engage us for a full offshore engineering team building bespoke software from scratch. We build the right model for your stage, whether you are a startup needing your first dedicated developer or an enterprise scaling a distributed team.',
  },
  {
    question: 'How does TrivianEdge ensure code quality and security for offshore teams?',
    answer:
      'All candidates go through a rigorous vetting process including technical assessments, communication evaluations, and background checks. Offshore teams follow your code review processes, use your tooling, and integrate with your project management and CI/CD pipelines. We work within whatever compliance framework your organization already operates under, rather than asserting certifications of our own.',
  },
];

const ITOutsourcingPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="Bespoke Software Development in Canada | TrivianEdge"
        description="TrivianEdge builds custom web applications, internal tools, and systems integrations. Scope a bespoke software project with our Toronto-based team."
        keywords="offshore development company Canada, offshore developers for Canadian startups, offshore dedicated development team, offshore software development Canada Philippines, bespoke software development, bespoke software development Canada, custom software development company, IT outsourcing Canada, offshore software development, offshore development team, software development outsourcing, TrivianEdge bespoke software"
        schema={[
          serviceSchema(
            'Bespoke Software Development',
            'Custom Software Development & IT Outsourcing',
            'https://www.trivianedge.com/services/it-outsourcing',
          ),
          faqSchema(FAQS.map((f) => ({ question: f.question, answer: f.answer }))),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            {
              name: 'Bespoke Software Development',
              url: 'https://www.trivianedge.com/services/it-outsourcing',
            },
          ]),
        ]}
      />

      <div className="bg-background min-h-screen text-text">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2">
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
            <li className="text-border">/</li>
            <li><Link to="/services" className="hover:text-cyan-400 transition-colors">Services</Link></li>
            <li className="text-border">/</li>
            <li className="text-text font-medium">Bespoke Software Development</li>
          </ol>
        </nav>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
          className="relative pt-8 pb-20 px-4 md:px-6 text-center hero-mesh"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-mono tracking-widest uppercase text-cyan-400 mb-4">
              Bespoke Software Development & IT Outsourcing
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              Bespoke software development{' '}
              <span className="text-cyan-400">
                for your business
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
              Commission a custom application, internal tool, or integration. We scope and deliver the project, and you own the code. If you need engineers to work under your direction, explore <Link to="/services/staff-augmentation" className="font-semibold underline">staff augmentation</Link>.
            </p>
            <Link to="/contact?service=bespoke-software&amp;source=/services/it-outsourcing" className="mt-6 inline-flex rounded-2xl px-6 py-3 font-bold premium-button">
              Discuss your software project
            </Link>

            <a href="#software-examples" className="ml-0 mt-4 block font-semibold text-cyan-700 hover:underline dark:text-cyan-400 sm:ml-5 sm:inline-block">
              See software we’ve built
            </a>
            <p className="mt-4 text-sm text-muted">Toronto-based project team · Client-owned code</p>
          </div>
        </motion.section>

        <section id="software-examples" className="scroll-mt-24 px-4 py-16 md:px-6" aria-labelledby="software-case-heading">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">Project examples</p>
            <h2 id="software-case-heading" className="mb-7 mt-3 text-3xl font-bold text-text md:text-4xl">See what we’ve built</h2>
          </div>
          <article className="mx-auto grid max-w-5xl gap-8 rounded-3xl bg-[#0d1b1c] p-6 text-white md:grid-cols-2 md:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Client work · Capricorn College</p>
              <h3 className="mt-4 text-2xl font-bold md:text-3xl">A new school website and a verifiable attendance record</h3>
              <p className="mt-4 leading-relaxed text-white/75">Capricorn College needed to replace an outdated public website and manual teacher attendance. TrivianEdge rebuilt the site and gave school leadership a live record of on-campus check-ins.</p>
              <Link to="/proof#story-capricorn-college" className="mt-6 inline-flex font-bold text-cyan-400 hover:underline">Read the Capricorn College story</Link>
            </div>
            <ul className="relative grid gap-3" aria-label="What we delivered">
              {CAPRICORN_DELIVERABLES.map(({ icon: Icon, title, description }, index) => (
                <motion.li
                  key={title}
                  initial={shouldReduceMotion ? false : { opacity: 0.72, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : index * 0.12 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/15 bg-[#152728] p-4"
                >
                  <span className="rounded-xl bg-cyan-400/10 p-3">
                    <Icon className="h-5 w-5 text-cyan-400" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-white/70">{description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </article>
          <article className="mx-auto mt-5 grid max-w-5xl items-center gap-6 rounded-3xl border border-border bg-surface p-6 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">Product build · TrivianKnot</p>
              <h3 className="mt-4 text-2xl font-bold text-text md:text-3xl">A multilingual platform for Sri Lankan marriage proposals</h3>
              <p className="mt-4 leading-relaxed text-muted">People can create profiles in English, Sinhala, or Tamil, browse proposals, and chat privately when interest is mutual.</p>
              <Link to="/proof#story-trivianknot" className="mt-6 inline-flex font-bold text-cyan-700 hover:underline dark:text-cyan-400">Explore the TrivianKnot walkthrough</Link>
            </div>
            <img src="/portfolio/trivianknot.jpg" alt="TrivianKnot public homepage" width={1200} height={750} loading="lazy" decoding="async" className="w-full rounded-xl border border-border" />
          </article>
          <div className="mx-auto mt-6 flex max-w-5xl flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <Link to="/proof#helpnest" className="text-cyan-700 hover:underline dark:text-cyan-400">See HelpNest</Link>
            <Link to="/proof#trivianedge-global" className="text-cyan-700 hover:underline dark:text-cyan-400">See Aether Logistics OS, in development</Link>
            <Link to="/proof#trivianedge-asia" className="text-cyan-700 hover:underline dark:text-cyan-400">See TrivianEdge Asia, in development</Link>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <ServiceVideo
            videoId="twFcKdWKjW0"
            title="Bring your business idea to life with custom software"
            description="A short introduction to building software around your business needs."
            duration="0:11"
          />
        </div>

        {/* What is Bespoke Software Development */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              What is Bespoke Software Development?
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              Bespoke software development means commissioning an application, platform, or internal tool around how your business works. We can build a new product or integrate with the systems you already use. The scope can also include deployment and ongoing support. For projects that need automation or model integration, explore our{' '}
              <Link
                to="/services/ai-development"
                className="text-cyan-400 hover:underline"
              >
                AI development services
              </Link>.
            </p>
          </div>
        </section>

        {/* Services We Deliver */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              Services We Deliver
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {IT_SERVICES.map(({ icon: Icon, label }, idx) => (
                <div
                  key={label}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  className="glass rounded-2xl p-6 border-border flex flex-col items-center gap-3 text-center reveal"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="font-semibold text-text text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project delivery */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              How your software project works
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {PROJECT_STEPS.map(({ title, description }, idx) => (
                <div
                  key={title}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  className="glass rounded-2xl p-6 border-border reveal"
                >
                  <p className="text-sm font-bold text-cyan-700 dark:text-cyan-400">0{idx + 1}</p>
                  <h3 className="mt-3 text-xl font-bold text-text">{title}</h3>
                  <p className="mt-2 text-muted">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-4 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-muted text-center mb-10">
              Everything you need to know about bespoke software development and IT outsourcing with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        <RelatedLinks
          links={[
            { label: 'AI development', desc: 'Add AI features, RAG, or agentic workflows to the product we build for you.', to: '/services/ai-development' },
            { label: 'IT outsourcing in Costa Rica', desc: 'Nearshore, US-timezone-aligned engineering: roles and typical work.', to: '/services/it-outsourcing/costa-rica' },
            { label: 'Offshore developers in the Philippines', desc: 'Our Philippines talent hub: roles, time-zone overlap, and typical engineering work.', to: '/talent/philippines' },
            { label: 'IT outsourcing in the Philippines', desc: 'English-first offshore developers for web platforms, Salesforce and NetSuite.', to: '/services/it-outsourcing/philippines' },
            { label: 'IT outsourcing in Sri Lanka', desc: 'Our core software engineering hub for custom application development.', to: '/services/it-outsourcing/sri-lanka' },
            { label: 'IT outsourcing in Vietnam', desc: 'Fast-moving custom development from our fastest-growing tech hub.', to: '/services/it-outsourcing/vietnam' },
            { label: 'IT outsourcing in Turkey', desc: 'EU/UK-aligned custom software delivery from our Turkey hub.', to: '/services/it-outsourcing/turkey' },
            { label: 'Education', desc: 'How we build public sites, portals, and verification systems for schools.', to: '/industries/education' },
            { label: 'RPO', desc: 'Hire software engineers directly onto your own team instead of an embedded team.', to: '/services/rpo' },
            { label: 'Case studies', desc: 'See how Hub-Flx and Capricorn College shipped software with TrivianEdge.', to: '/proof' },
          ]}
        />

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Discuss Your Bespoke Software Project
            </h2>
            <p className="text-muted mb-8">
              Cut costs, scale faster, and stay focused on your core product.
            </p>
            <Link
              to="/contact?service=bespoke-software&amp;source=/services/it-outsourcing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button"
            >
              Get a free consultation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default ITOutsourcingPage;
