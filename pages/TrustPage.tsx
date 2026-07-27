import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Server, FileCheck } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { TRUST_PILLARS } from '../constants/proof';
import { breadcrumbSchema, SEO_CONFIG } from '../utils/seo';

const TrustPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Trust | Security and Compliance at TrivianEdge"
        description="Security, data handling, compliance posture, and operational controls for TrivianEdge's lead capture and service delivery model."
        canonical={`${SEO_CONFIG.siteUrl}/trust`}
        schema={[
          breadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Trust', url: `${SEO_CONFIG.siteUrl}/trust` },
          ]),
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
              <ShieldCheck className="w-3 h-3" />
              Trust and security
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Security controls that match the sales pitch.</h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed">
              The site is built around simple data capture, restricted API access, and clear privacy handling. No exaggerated certification claims, just the controls that are actually in place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {TRUST_PILLARS.map((pillar, index) => {
              const icons = [Lock, Server, FileCheck, ShieldCheck];
              const Icon = icons[index] ?? ShieldCheck;
              return (
                <section key={pillar.title} style={{ transitionDelay: `${index * 80}ms` }} className="glass p-8 rounded-[2rem] border-border reveal">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{pillar.title}</h2>
                  <ul className="space-y-3 text-muted leading-relaxed text-sm md:text-base">
                    {pillar.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="glass p-8 md:p-10 rounded-[2rem] border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6 reveal">
            <div>
              <h2 className="text-2xl font-bold mb-2">Want a direct response?</h2>
              <p className="text-muted">Use the inquiry flow and we will follow up with the next step.</p>
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

export default TrustPage;