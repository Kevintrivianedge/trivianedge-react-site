import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ExternalLink, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import RelatedLinks from '../components/RelatedLinks';
import { CASE_STUDIES, TESTIMONIALS } from '../constants/proof';
import { INDUSTRIES } from '../constants/industries';
import { breadcrumbSchema, reviewSchema, SEO_CONFIG } from '../utils/seo';

// Same figures as the homepage stats showcase — kept in one place there would be
// ideal, but these numbers are operating-model constants restated for a reader
// landing directly on /proof without having seen the homepage first.
const PROOF_STATS = [
  { value: '30', unit: 'days', label: 'Avg. time to deploy', description: 'From intake to a working team' },
  { value: 'Up to 40', unit: '%', label: 'Cost savings', description: 'vs. equivalent North American hires' },
  { value: '6', unit: 'hubs', label: 'Talent hubs', description: 'Philippines, Vietnam, Sri Lanka, Turkey, South Africa, Costa Rica' },
  { value: '24/7', unit: '', label: 'Ops coverage', description: 'Global timezone alignment' },
];

const ProofPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Proof | TrivianEdge Case Studies and Client Feedback"
        description="Case studies, testimonials, and proof of delivery from TrivianEdge's global outsourcing and talent operations work."
        keywords="TrivianEdge case studies, outsourcing client testimonials, BPO case study, RPO case study, offshore software development case study"
        canonical={`${SEO_CONFIG.siteUrl}/proof`}
        schema={[
          breadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Proof', url: `${SEO_CONFIG.siteUrl}/proof` },
          ]),
          ...TESTIMONIALS.map(reviewSchema),
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
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="w-3 h-3" />
              Proof over promises
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Case studies that show how the model works.</h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed">
              These are the kinds of engagements TrivianEdge is built for: cross-border operations, faster hiring, lower overhead, and clearer execution.
            </p>
            <div id="methodology" className="mt-6 p-5 rounded-2xl border border-border bg-surface/60 scroll-mt-24">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-2">Methodology note</p>
              <p className="text-muted/80 text-sm leading-relaxed">
                Team sizes and timelines above reflect TrivianEdge's standard engagement model for that kind of work. Percentage figures elsewhere on this site (e.g., "up to 40% cost savings") describe the typical range across our engagements (comparing fully loaded offshore cost, including compliance, payroll administration, and management overhead, against the equivalent fully loaded cost of a direct North American hire), not a single formal audited study. <Link to="/savings-calculator" className="text-cyan-600 hover:underline font-medium">Run your own roles through the savings calculator</Link> for a number specific to your situation.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {PROOF_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-cyan-400/20 bg-surface backdrop-blur-sm p-6 relative group hover:border-cyan-400/40 transition-colors duration-300"
                style={{ boxShadow: '0 8px 32px rgba(77, 188, 159, 0.06)' }}
              >
                <span className="text-[10px] uppercase tracking-widest text-muted font-semibold block mb-4">
                  {stat.label}
                </span>
                <div className="mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-cyan-700 dark:text-cyan-400">
                    {stat.value}
                  </span>
                  <span className="text-lg md:text-xl text-text opacity-70 ml-2">{stat.unit}</span>
                </div>
                <p className="text-xs text-muted">{stat.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-16">
            {CASE_STUDIES.map((study, idx) => (
              <article key={study.client} style={{ transitionDelay: `${idx * 80}ms` }} className="glass p-8 rounded-[2rem] border-border reveal flex flex-col">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">{study.sector}</p>
                <h2 className="text-2xl font-bold mb-4">{study.client}</h2>
                <div className="space-y-4 text-muted leading-relaxed text-sm md:text-base">
                  <p><strong className="text-text">Challenge:</strong> {study.challenge}</p>
                  <p><strong className="text-text">Approach:</strong> {study.approach}</p>
                  <div className="grid sm:grid-cols-2 gap-3 py-1">
                    <p className="text-xs"><strong className="text-text block uppercase tracking-widest mb-1">Team</strong>{study.team}</p>
                    <p className="text-xs"><strong className="text-text block uppercase tracking-widest mb-1">Timeline</strong>{study.timeline}</p>
                  </div>
                  <p><strong className="text-text">Result:</strong> {study.outcome}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto pt-6">
                  {study.highlights.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full border border-border text-[10px] font-bold uppercase tracking-widest text-muted">
                      {item}
                    </span>
                  ))}
                </div>
                {(() => {
                  const industry = INDUSTRIES.find(i => i.relatedCaseStudyClient === study.client);
                  return industry ? (
                    <Link to={`/industries/${industry.slug}`} className="text-cyan-600 text-xs font-bold hover:underline mt-4 inline-flex items-center gap-1">
                      More on {industry.name} <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : null;
                })()}
              </article>
            ))}
          </div>

          <div className="mb-16 reveal">
            <h2 className="text-3xl font-bold mb-6">Client feedback</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {TESTIMONIALS.map((item, idx) => (
                <blockquote key={item.author + item.role} style={{ transitionDelay: `${idx * 80}ms` }} className="glass p-8 rounded-[2rem] border-border reveal">
                  <p className="text-lg leading-relaxed text-text mb-6">“{item.quote}”</p>
                  <footer className="text-sm text-muted">
                    <span className="font-semibold text-text">{item.author}</span>, {item.role}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>

          <RelatedLinks
            title="Explore the services behind these results"
            links={[
              { label: 'BPO', desc: 'Outsourced operations teams like the one that unblocked Cargo Login.', to: '/services/bpo' },
              { label: 'RPO', desc: 'Embedded recruiting for direct hires across six talent hubs.', to: '/services/rpo' },
              { label: 'AI development', desc: 'Custom AI and LLM integration work built by offshore engineering teams.', to: '/services/ai-development' },
              { label: 'IT outsourcing', desc: 'Bespoke software development, like the Capricorn College platform rebuild.', to: '/services/it-outsourcing' },
            ]}
          />

          <div className="glass p-8 md:p-10 rounded-[2rem] border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6 reveal">
            <div>
              <h2 className="text-2xl font-bold mb-2">Need the operating model, not just the story?</h2>
              <p className="text-muted">Review the trust page for security and compliance details, then send an inquiry when you are ready.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/trust" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold premium-button">
                Trust page <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-border text-text font-bold premium-button-secondary">
                Contact us <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProofPage;