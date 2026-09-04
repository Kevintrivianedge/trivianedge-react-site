import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Scale } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Accordion from '../components/Accordion';
import RelatedLinks from '../components/RelatedLinks';
import { COMPARISONS } from '../constants/comparisons';
import { breadcrumbSchema, faqSchema, SEO_CONFIG } from '../utils/seo';

const ComparisonPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const comparison = COMPARISONS.find(c => c.slug === slug);

  if (!comparison) {
    return (
      <div className="py-32 px-4 md:px-6 min-h-screen flex items-center justify-center bg-background text-text">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Comparison not found</h1>
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

  const pageUrl = `${SEO_CONFIG.siteUrl}/compare/${comparison.slug}`;
  const otherComparisons = COMPARISONS.filter(c => c.slug !== comparison.slug);

  return (
    <>
      <SEOHead
        title={`${comparison.title} | TrivianEdge`}
        description={comparison.subtitle}
        canonical={pageUrl}
        schema={[
          breadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Services', url: `${SEO_CONFIG.siteUrl}/services` },
            { name: comparison.title, url: pageUrl },
          ]),
          faqSchema(comparison.faqs),
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
              <Scale className="w-3 h-3" />
              Compare your options
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">{comparison.title}</h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed">{comparison.subtitle}</p>
          </div>

          {/* Options side by side */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[comparison.optionA, comparison.optionB].map((option) => (
              <div key={option.name} className="glass p-8 rounded-[2rem] border-border reveal">
                <h2 className="text-2xl font-bold mb-3">{option.name}</h2>
                <p className="text-muted leading-relaxed mb-6">{option.summary}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">Good for</p>
                <ul className="space-y-2 mb-6">
                  {option.goodFor.map(item => (
                    <li key={item} className="flex gap-2 text-sm text-muted"><Check className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />{item}</li>
                  ))}
                </ul>
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Trade-offs</p>
                <ul className="space-y-2">
                  {option.tradeoffs.map(item => (
                    <li key={item} className="text-sm text-muted/80">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mb-16 overflow-x-auto">
            <table className="w-full glass rounded-[2rem] border-border reveal overflow-hidden text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-5 font-bold text-text">Factor</th>
                  <th className="text-left p-5 font-bold text-text">{comparison.optionA.name}</th>
                  <th className="text-left p-5 font-bold text-text">{comparison.optionB.name}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row, idx) => (
                  <tr key={row.factor} className={idx % 2 === 0 ? '' : 'bg-surface/40'}>
                    <td className="p-5 font-semibold text-text align-top whitespace-nowrap">{row.factor}</td>
                    <td className="p-5 text-muted align-top">{row.a}</td>
                    <td className="p-5 text-muted align-top">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verdict */}
          <div className="glass p-8 md:p-10 rounded-[2rem] border-border mb-16 reveal">
            <h2 className="text-2xl font-bold mb-4">Which one fits?</h2>
            <p className="text-muted leading-relaxed">{comparison.verdict}</p>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
            <Accordion items={comparison.faqs} />
          </div>

          <RelatedLinks
            title="Other comparisons"
            links={[
              ...otherComparisons.map(c => ({ label: c.title, desc: c.subtitle, to: `/compare/${c.slug}` })),
              { label: comparison.relatedServiceName, desc: `See the full ${comparison.relatedServiceName} service page.`, to: comparison.relatedServiceHref },
            ]}
          />

          <div className="glass p-8 md:p-10 rounded-[2rem] border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-16 reveal">
            <div>
              <h2 className="text-2xl font-bold mb-2">Still not sure which fits your situation?</h2>
              <p className="text-muted">Tell us what you're trying to do and we'll give you a straight answer.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold premium-button whitespace-nowrap">
              Talk it through <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComparisonPage;
