import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Clock, Wifi, MessageSquare, GraduationCap, Code2, Globe2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Accordion from '../components/Accordion';
import RelatedLinks from '../components/RelatedLinks';
import { TALENT_HUBS } from '../constants';
import { CASE_STUDIES } from '../constants/proof';
import { breadcrumbSchema, faqSchema, SEO_CONFIG } from '../utils/seo';
import { slugifyCountry } from '../utils/talent';
import { TalentHub } from '../types';

/** Builds the per-hub FAQ set from data already published elsewhere on the site (TALENT_HUBS, EOR wording) rather than inventing hub-specific numbers we can't back up. */
function buildHubFaqs(hub: TalentHub) {
  return [
    {
      question: `Why hire in ${hub.country}?`,
      answer: hub.description,
    },
    {
      question: `What roles do TrivianEdge clients typically fill from ${hub.country}?`,
      answer: `${hub.country} is one of our six talent hubs, specializing in ${hub.specialty.toLowerCase()}. Common stacks and skill sets we place from here include ${hub.popularTech.join(', ')}.`,
    },
    {
      question: `What's the time zone overlap with ${hub.country}?`,
      answer: `${hub.timeZoneAlignment}. We match working hours to your business, not the other way around.`,
    },
    {
      question: `What's English proficiency and communication like in ${hub.country}?`,
      answer: hub.communication,
    },
    {
      question: `Do I need to set up a local entity to hire in ${hub.country}?`,
      answer: `No. TrivianEdge coordinates employment through in-country employer-of-record and payroll partners, so you hire in ${hub.country} without registering a local company, opening a foreign payroll account, or navigating ${hub.country} employment law yourself.`,
    },
    {
      question: `How long does it take to deploy a team in ${hub.country}?`,
      answer: `${hub.country} follows TrivianEdge's standard 30-day deployment model — sourcing, screening, legal setup, payroll, and onboarding included.`,
    },
  ];
}

const TalentHubPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const hub = TALENT_HUBS.find(h => slugifyCountry(h.country) === slug);

  if (!hub) {
    return (
      <div className="py-32 px-4 md:px-6 min-h-screen flex items-center justify-center bg-background text-text">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Talent hub not found</h1>
          <button
            onClick={() => navigate('/#talent-hubs')}
            className="flex items-center gap-2 text-muted hover:text-cyan-400 transition-colors mx-auto group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to talent hubs</span>
          </button>
        </div>
      </div>
    );
  }

  const faqs = buildHubFaqs(hub);
  const pageUrl = `${SEO_CONFIG.siteUrl}/talent/${slugifyCountry(hub.country)}`;
  const relatedCaseStudy = CASE_STUDIES.find(c => c.approach.includes(hub.country) || c.challenge.includes(hub.country));
  const otherHubs = TALENT_HUBS.filter(h => h.id !== hub.id).slice(0, 3);

  return (
    <>
      <SEOHead
        title={`Hire in ${hub.country} | Offshore Talent via TrivianEdge`}
        description={`Hire ${hub.specialty.toLowerCase()} talent in ${hub.country} in 30 days. Time zone fit, English proficiency, employment structure, and typical roles — no foreign entity required.`}
        canonical={pageUrl}
        schema={[
          breadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Talent hubs', url: `${SEO_CONFIG.siteUrl}/#talent-hubs` },
            { name: hub.country, url: pageUrl },
          ]),
          faqSchema(faqs),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${pageUrl}#service`,
            name: `Offshore talent sourcing — ${hub.country}`,
            description: hub.description,
            areaServed: { '@type': 'Country', name: hub.country },
            provider: { '@type': 'Organization', '@id': `${SEO_CONFIG.siteUrl}/#organization`, name: 'TrivianEdge' },
            serviceType: hub.specialty,
          },
        ]}
      />

      <div className="bg-background min-h-screen text-text">
        {/* Hero */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${hub.gradient} border-b border-border`}>
          <div className="absolute inset-0 bg-background/85" />
          <div className="max-w-5xl mx-auto px-4 md:px-6 pt-16 pb-14 md:pt-24 md:pb-20 relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted hover:text-cyan-500 transition-colors mb-10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Back</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={`https://flagcdn.com/w80/${hub.flagCode}.png`}
                width={56}
                height={42}
                alt={hub.country}
                className="rounded-md object-cover shadow-md"
              />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">{hub.specialty}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Hire in {hub.country} in 30 days.</h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed max-w-3xl">{hub.description}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-20">
          {/* Info grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="glass p-7 rounded-[1.75rem] border-border reveal">
              <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                <Wifi className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className="font-bold text-lg mb-2">Digital infrastructure</h2>
              <p className="text-muted text-sm leading-relaxed">{hub.infrastructure}</p>
            </div>
            <div className="glass p-7 rounded-[1.75rem] border-border reveal" style={{ transitionDelay: '60ms' }}>
              <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className="font-bold text-lg mb-2">Communication & culture</h2>
              <p className="text-muted text-sm leading-relaxed">{hub.communication}</p>
            </div>
            <div className="glass p-7 rounded-[1.75rem] border-border reveal" style={{ transitionDelay: '120ms' }}>
              <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className="font-bold text-lg mb-2">Time zone alignment</h2>
              <p className="text-muted text-sm leading-relaxed">{hub.timeZoneAlignment}</p>
            </div>
            <div className="glass p-7 rounded-[1.75rem] border-border reveal" style={{ transitionDelay: '180ms' }}>
              <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className="font-bold text-lg mb-2">Education focus</h2>
              <p className="text-muted text-sm leading-relaxed">{hub.educationFocus}</p>
            </div>
          </div>

          {/* Cities + tech */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="glass p-7 rounded-[1.75rem] border-border reveal">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-600" /> Key cities</h2>
              <div className="flex flex-wrap gap-2">
                {hub.keyCities.map(city => (
                  <span key={city} className="px-3 py-1.5 rounded-lg border border-border text-sm text-text bg-surface">{city}</span>
                ))}
              </div>
            </div>
            <div className="glass p-7 rounded-[1.75rem] border-border reveal" style={{ transitionDelay: '60ms' }}>
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Code2 className="w-4 h-4 text-cyan-600" /> Typical tech & skills</h2>
              <div className="flex flex-wrap gap-2">
                {hub.popularTech.map(tech => (
                  <span key={tech} className="px-3 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-sm text-cyan-700 font-mono">{tech}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Employment structure */}
          <div className="glass p-8 md:p-10 rounded-[2rem] border-border mb-16 reveal">
            <h2 className="text-2xl font-bold mb-4">How hiring in {hub.country} actually works</h2>
            <div className="space-y-3 text-muted leading-relaxed">
              <p>You never register a local company or open a foreign payroll account. TrivianEdge coordinates employment in {hub.country} through in-country employer-of-record and payroll partners, and manages that relationship end to end — one point of contact for you.</p>
              <p>Standard deployment runs on TrivianEdge's 30-day model: sourcing, screening, legal setup, payroll, and onboarding. Cost is scoped per role and typically lands well below the equivalent fully loaded cost of a direct North American hire — <Link to="/savings-calculator" className="text-cyan-600 hover:underline font-medium">model it against your own roles on the savings calculator</Link> rather than a flat headline percentage.</p>
            </div>
          </div>

          {relatedCaseStudy && (
            <div className="glass p-8 md:p-10 rounded-[2rem] border-border mb-16 reveal">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">Related case study</p>
              <h2 className="text-2xl font-bold mb-3">{relatedCaseStudy.client}</h2>
              <p className="text-muted leading-relaxed mb-4">{relatedCaseStudy.outcome}</p>
              <Link to="/proof" className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:underline">
                Read the full case study <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4 text-center">Frequently asked questions</h2>
            <p className="text-muted text-center mb-10">Everything you need to know about hiring in {hub.country} with TrivianEdge.</p>
            <Accordion items={faqs} />
          </div>

          <RelatedLinks
            title="Other talent hubs"
            links={[
              ...otherHubs.map(h => ({ label: h.country, desc: h.specialty, to: `/talent/${slugifyCountry(h.country)}` })),
              { label: 'BPO services', desc: 'Turn this talent into a fully managed offshore team.', to: '/services/bpo' },
            ]}
          />

          {/* CTA */}
          <div className="glass p-8 md:p-10 rounded-[2rem] border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-16 reveal">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Globe2 className="w-5 h-5 text-cyan-600" /> Ready to hire in {hub.country}?</h2>
              <p className="text-muted">Tell us the roles you need and we'll scope a plan within 30 days.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold premium-button whitespace-nowrap">
              Start your search <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TalentHubPage;
