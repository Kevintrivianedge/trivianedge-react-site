import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Code2, Clock } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Accordion from '../components/Accordion';
import RelatedLinks from '../components/RelatedLinks';
import { SERVICE_COUNTRY_COMBOS } from '../constants/serviceCountryCombos';
import { TALENT_HUBS } from '../constants';
import { breadcrumbSchema, faqSchema, SEO_CONFIG } from '../utils/seo';
import { slugifyCountry } from '../utils/talent';

const ServiceCountryPage: React.FC = () => {
  const { service, country } = useParams<{ service: string; country: string }>();
  const navigate = useNavigate();
  const combo = SERVICE_COUNTRY_COMBOS.find(c => c.service === service && c.countrySlug === country);
  const hub = combo ? TALENT_HUBS.find(h => h.id === combo.hubId) : undefined;

  if (!combo || !hub) {
    return (
      <div className="py-32 px-4 md:px-6 min-h-screen flex items-center justify-center bg-background text-text">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Combination not found</h1>
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

  const pageUrl = `${SEO_CONFIG.siteUrl}/services/${combo.service}/${combo.countrySlug}`;
  const otherCombos = SERVICE_COUNTRY_COMBOS.filter(c => !(c.service === combo.service && c.countrySlug === combo.countrySlug));

  return (
    <>
      <SEOHead
        title={combo.metaTitle ?? `${combo.serviceName} in ${hub.country} | TrivianEdge`}
        description={`${combo.serviceName} teams sourced from ${hub.country} — ${hub.specialty.toLowerCase()}, ${hub.timeZoneAlignment}. Deployed in 30 days, no foreign entity required.`}
        canonical={pageUrl}
        schema={[
          breadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: combo.serviceName, url: `${SEO_CONFIG.siteUrl}${combo.serviceHref}` },
            { name: hub.country, url: pageUrl },
          ]),
          faqSchema(combo.faqs),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${pageUrl}#service`,
            name: `${combo.serviceName} — ${hub.country}`,
            description: combo.angle,
            areaServed: { '@type': 'Country', name: hub.country },
            provider: { '@type': 'Organization', '@id': `${SEO_CONFIG.siteUrl}/#organization`, name: 'TrivianEdge' },
            serviceType: combo.serviceName,
          },
        ]}
      />

      <div className={`bg-background min-h-screen text-text`}>
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
                loading="lazy"
                className="rounded-md object-cover shadow-md"
              />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">{hub.country} · {hub.specialty}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">{combo.serviceName} in {hub.country}</h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed max-w-3xl">{combo.angle}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="glass p-7 rounded-[1.75rem] border-border reveal">
              <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className="font-bold text-lg mb-2">Time zone alignment</h2>
              <p className="text-muted text-sm leading-relaxed">{hub.timeZoneAlignment}</p>
            </div>
            <div className="glass p-7 rounded-[1.75rem] border-border reveal" style={{ transitionDelay: '60ms' }}>
              <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className="font-bold text-lg mb-2">Deployment timeline</h2>
              <p className="text-muted text-sm leading-relaxed">TrivianEdge's standard 30-day deployment model — sourcing, screening, legal setup, payroll, and onboarding included.</p>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border-border mb-16 reveal">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Code2 className="w-4 h-4 text-cyan-600" /> Typical roles for this pairing</h2>
            <div className="flex flex-wrap gap-2">
              {combo.typicalRoles.map(role => (
                <span key={role} className="px-3 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-sm text-cyan-700">{role}</span>
              ))}
            </div>
          </div>

          <div className="glass p-8 md:p-10 rounded-[2rem] border-border mb-16 reveal">
            <h2 className="text-2xl font-bold mb-4">How hiring works</h2>
            <p className="text-muted leading-relaxed">You never register a local company or open a foreign payroll account. TrivianEdge coordinates employment in {hub.country} through in-country employer-of-record and payroll partners, and manages that relationship end to end — one point of contact for you. Cost is scoped per role; <Link to="/savings-calculator" className="text-cyan-600 hover:underline font-medium">model it against your own roles on the savings calculator</Link> rather than a flat headline percentage.</p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
            <Accordion items={combo.faqs} />
          </div>

          <RelatedLinks
            title="Related"
            links={[
              { label: `Full ${hub.country} profile`, desc: 'Infrastructure, communication, education, and tech stack for this hub.', to: `/talent/${slugifyCountry(hub.country)}` },
              { label: `${combo.serviceName} overview`, desc: `See the complete ${combo.serviceName} service page.`, to: combo.serviceHref },
              ...otherCombos.slice(0, 2).map(c => ({ label: `${c.serviceName} in ${TALENT_HUBS.find(h => h.id === c.hubId)?.country ?? ''}`, desc: c.angle, to: `/services/${c.service}/${c.countrySlug}` })),
            ]}
          />

          <div className="glass p-8 md:p-10 rounded-[2rem] border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-16 reveal">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to build a {combo.serviceName} team in {hub.country}?</h2>
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

export default ServiceCountryPage;
