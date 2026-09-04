import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import RelatedLinks from '../components/RelatedLinks';
import { CASE_STUDIES, TESTIMONIALS } from '../constants/proof';
import { breadcrumbSchema, reviewSchema, SEO_CONFIG } from '../utils/seo';

const ProofPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Proof | TrivianEdge Case Studies and Client Feedback"
        description="Case studies, testimonials, and proof of delivery from TrivianEdge's global outsourcing and talent operations work."
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
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="w-3 h-3" />
              Proof over promises
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Case studies that show how the model works.</h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed">
              These are the kinds of engagements TrivianEdge is built for: cross-border operations, faster hiring, lower overhead, and clearer execution.
            </p>
            <p className="text-muted/70 text-sm leading-relaxed mt-4">
              Team sizes and timelines below reflect TrivianEdge's standard engagement model for that kind of work. Percentage figures elsewhere on this site (e.g., "up to 40% cost savings") describe typical ranges across our engagements, not a single formal audited study — ask us for a custom estimate against your own roles.
            </p>
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