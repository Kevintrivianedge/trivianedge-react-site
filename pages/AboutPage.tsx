import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Globe2, Users, Clock, Linkedin } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { TALENT_HUBS } from '../constants';
import { buildWebPageSchema, buildFounderPersonSchema, SEO_CONFIG } from '../utils/seo';

const STATS = [
  { icon: Clock, label: 'Team deployed', value: '30 days' },
  { icon: Building2, label: 'Cost savings vs. local hiring', value: 'Up to 40%' },
  { icon: Globe2, label: 'Time zones covered', value: '6' },
  { icon: Users, label: 'Founded', value: '2023' },
];

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const aboutUrl = `${SEO_CONFIG.siteUrl}/about`;

  return (
    <>
      <SEOHead
        title="About | TrivianEdge"
        description="TrivianEdge is a Toronto-based BPO, RPO, and offshore software development company deploying offshore teams across six global talent hubs in 30 days."
        canonical={aboutUrl}
        structuredData={[
          buildWebPageSchema({
            name: 'About TrivianEdge',
            description: 'TrivianEdge is a Toronto-based BPO, RPO, and offshore software development company deploying offshore teams across six global talent hubs in 30 days.',
            url: aboutUrl,
            breadcrumb: [
              { name: 'Home', url: SEO_CONFIG.siteUrl },
              { name: 'About', url: aboutUrl },
            ],
          }),
          buildFounderPersonSchema(),
        ]}
      />

      <div className="bg-background min-h-screen text-text px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted hover:text-cyan-500 transition-colors mb-10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </button>

          <div className="max-w-3xl mb-14 reveal">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Building2 className="w-3 h-3" />
              About TrivianEdge
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Build the team. Run the system.</h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed">
              TrivianEdge is a Toronto, Ontario-based BPO, RPO, and bespoke software development company. We deploy offshore teams in as little as 30 days, acting as employer of record so clients never need to set up a foreign entity themselves.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {STATS.map((stat) => (
              <div key={stat.label} className="glass p-6 rounded-[1.5rem] border-border text-center reveal">
                <stat.icon className="w-5 h-5 text-cyan-600 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-muted text-xs uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mb-16 reveal">
            <h2 className="display-section text-3xl md:text-4xl font-bold mb-4">What we do</h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              We run four service lines: Business Process Outsourcing (BPO), Recruitment Process Outsourcing (RPO), bespoke software development (custom development, cloud/DevOps, QA, IT outsourcing), and AI development. Clients come to us to build offshore back-office, engineering, or support teams without the overhead of setting up and running a foreign entity themselves.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/services" className="inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-sm premium-button-secondary">All services</Link>
              <Link to="/proof" className="inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-sm premium-button-secondary">Case studies</Link>
              <Link to="/trust" className="inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-sm premium-button-secondary">Security &amp; compliance</Link>
            </div>
          </div>

          <div className="mb-16 reveal">
            <h2 className="display-section text-3xl md:text-4xl font-bold mb-6">Note from our founder</h2>
            <div className="glass p-8 md:p-10 rounded-[2rem] border-border grid md:grid-cols-[auto_1fr] gap-8 items-start">
              <div className="flex md:flex-col items-center md:items-start gap-4 md:w-40">
                <img
                  src="/founder/kevin-vaz.webp"
                  alt="Kevin Vaz, Founder of TrivianEdge"
                  width={128}
                  height={128}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-border"
                  loading="lazy"
                />
                <div>
                  <div className="font-bold">Kevin Vaz</div>
                  <div className="text-muted text-sm mb-2">Founder</div>
                  <a
                    href="https://www.linkedin.com/in/kevin-v-0b714b30/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kevin Vaz on LinkedIn"
                    className="inline-flex items-center gap-1.5 text-cyan-600 hover:underline text-sm font-semibold"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
              <div className="text-muted leading-relaxed space-y-4">
                <p>After 20+ years in outsourcing, I've seen nearly every version of it, and gotten frustrated with most.</p>
                <p>I started on the operations side, running prescription workflows for long-term care facilities, then moved into scaling resource teams for fast-growing software companies. Along the way I rebuilt hiring pipelines that weren't working, cleaned up broken processes, and helped founders move from chaos to clarity, inside banking, insurance, healthcare, IT, and tech, usually when something was already on fire.</p>
                <p>Two decades in, I kept landing on the same conclusion: outsourcing isn't broken, it's outdated. Most models were built for a world before AI, before distributed work was normal, before founders expected their partners to move as fast as they do. The companies I watched struggle weren't failing because offshore talent doesn't work. They were failing because the old playbook doesn't.</p>
                <p>That's why I founded TrivianEdge: to help founders build global teams, automate the operational drag, and put systems in place that run without constant babysitting. Human-first, AI-smart, built for outcomes rather than hours billed.</p>
                <p>I care about founders building something ambitious who are tired of getting stuck on the operational stuff. If that's you, whether you want to talk shop, explore working together, or just trade notes on where this industry is going, I'm easy to reach.</p>
              </div>
            </div>
          </div>

          <div className="mb-16 reveal">
            <h2 className="display-section text-3xl md:text-4xl font-bold mb-6">Meet our Director of Marketing &amp; Sales</h2>
            <div className="glass p-8 md:p-10 rounded-[2rem] border-border grid md:grid-cols-[auto_1fr] gap-8 items-start">
              <div className="flex md:flex-col items-center md:items-start gap-4 md:w-40">
                <img
                  src="/team/velautham-prabaharan.jpg"
                  alt="Velautham Prabaharan, Director of Marketing & Sales at TrivianEdge"
                  width={128}
                  height={128}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-border"
                  loading="lazy"
                />
                <div>
                  <div className="font-bold">Velautham Prabaharan</div>
                  <div className="text-muted text-sm mb-2">Director, Marketing &amp; Sales</div>
                </div>
              </div>
              <div className="text-muted leading-relaxed space-y-4">
                <p>Velautham Prabaharan leads Marketing &amp; Sales at TrivianEdge, where he's responsible for driving business growth, building strategic partnerships, and strengthening our market presence.</p>
                <p>He brings a results-driven track record in business development, client relationship management, and revenue growth, built over years in the financial services sector across Dubai and Sri Lanka. That background gives him sharp instincts for sales strategy, customer acquisition, and market expansion.</p>
                <p>What stands out most is his commitment to delivering real value to clients — paired with the leadership and communication skills to back it up. It's a combination that fits right into TrivianEdge's mission: helping organizations worldwide access innovative technology, outsourcing, and business solutions.</p>
              </div>
            </div>
          </div>

          <div className="mb-16 reveal">
            <h2 className="display-section text-3xl md:text-4xl font-bold mb-4">Where our talent comes from</h2>
            <p className="text-muted text-lg leading-relaxed mb-8 max-w-3xl">
              We source and manage talent across six global hubs, each chosen for a specific strength — engineering depth, operational scale, or time zone coverage.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {TALENT_HUBS.map((hub) => (
                <div key={hub.id} className="glass p-5 rounded-2xl border-border reveal">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={`https://flagcdn.com/w40/${hub.flagCode}.png`}
                      width={20}
                      height={15}
                      alt=""
                      className="rounded-sm object-cover flex-shrink-0"
                    />
                    <span className="font-bold">{hub.country}</span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{hub.specialty}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 md:p-10 rounded-[2rem] border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6 reveal">
            <div>
              <h2 className="text-2xl font-bold mb-2">Want to talk to the team?</h2>
              <p className="text-muted">Reach us directly at <a href="mailto:kevin.v@trivianedge.com" className="text-cyan-600 hover:underline">kevin.v@trivianedge.com</a> or <a href="tel:+18882028513" className="text-cyan-600 hover:underline">+1 888-202-8513</a>.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-bold premium-button">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
