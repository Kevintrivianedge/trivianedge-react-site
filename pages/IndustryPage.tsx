import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AlertCircle, Building2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Accordion from '../components/Accordion';
import RelatedLinks from '../components/RelatedLinks';
import { INDUSTRIES } from '../constants/industries';
import { CASE_STUDIES } from '../constants/proof';
import { breadcrumbSchema, faqSchema, SEO_CONFIG } from '../utils/seo';

const IndustryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const industry = INDUSTRIES.find(i => i.slug === slug);

  if (!industry) {
    return (
      <div className="py-32 px-4 md:px-6 min-h-screen flex items-center justify-center bg-background text-text">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Industry not found</h1>
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-muted hover:text-cyan-400 transition-colors mx-auto group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to services</span>
          </button>
        </div>
      </div>
    );
  }

  const pageUrl = `${SEO_CONFIG.siteUrl}/industries/${industry.slug}`;
  const caseStudy = CASE_STUDIES.find(c => c.client === industry.relatedCaseStudyClient);
  const otherIndustries = INDUSTRIES.filter(i => i.slug !== industry.slug);

  return (
    <>
      <SEOHead
        title={`${industry.name} | TrivianEdge`}
        description={`${industry.tagline} BPO, RPO, AI, and software delivery for ${industry.name.toLowerCase()} companies.`}
        canonical={pageUrl}
        schema={[
          breadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Services', url: `${SEO_CONFIG.siteUrl}/services` },
            { name: industry.name, url: pageUrl },
          ]),
          faqSchema(industry.faqs),
        ]}
      />

      <div className="bg-background min-h-screen text-text px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
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
              Industries we serve
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">{industry.name}</h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed">{industry.tagline}</p>
          </div>

          <p className="text-muted text-lg leading-relaxed max-w-3xl mb-16">{industry.description}</p>

          {/* Challenges */}
          <div className="glass p-8 md:p-10 rounded-[2rem] border-border mb-16 reveal">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-cyan-600" /> What we hear from {industry.name.toLowerCase()} teams</h2>
            <ul className="space-y-3">
              {industry.challenges.map(item => (
                <li key={item} className="flex gap-3 text-muted leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How we help */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">How TrivianEdge helps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {industry.howWeHelp.map((item, idx) => (
                <Link
                  key={item.service}
                  to={item.href}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  className="glass p-7 rounded-[1.75rem] border-border reveal card-lift group flex flex-col"
                >
                  <h3 className="font-bold text-lg mb-2 flex items-center justify-between gap-2">
                    {item.service}
                    <ArrowRight className="w-4 h-4 text-cyan-500 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Common roles */}
          <div className="glass p-8 rounded-[2rem] border-border mb-16 reveal">
            <h2 className="text-lg font-bold mb-4">Common roles we place</h2>
            <div className="flex flex-wrap gap-2">
              {industry.commonRoles.map(role => (
                <span key={role} className="px-3 py-1.5 rounded-lg border border-border text-sm text-text bg-surface">{role}</span>
              ))}
            </div>
          </div>

          {caseStudy && (
            <div className="glass p-8 md:p-10 rounded-[2rem] border-border mb-16 reveal">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">Related case study</p>
              <h2 className="text-2xl font-bold mb-3">{caseStudy.client}</h2>
              <p className="text-muted leading-relaxed mb-4">{caseStudy.outcome}</p>
              <Link to="/proof" className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:underline">
                Read the full case study <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
            <Accordion items={industry.faqs} />
          </div>

          <RelatedLinks
            title="Other industries"
            links={otherIndustries.map(i => ({ label: i.name, desc: i.tagline, to: `/industries/${i.slug}` }))}
          />

          <div className="glass p-8 md:p-10 rounded-[2rem] border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-16 reveal">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tell us about your {industry.name.toLowerCase()} operation</h2>
              <p className="text-muted">We'll scope a plan based on what you actually need.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold premium-button whitespace-nowrap">
              Start the conversation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndustryPage;
