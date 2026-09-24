import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import RelatedLinks from '../components/RelatedLinks';
import { INDUSTRIES } from '../constants/industries';
import { breadcrumbSchema, SEO_CONFIG } from '../utils/seo';

const IndustriesIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const pageUrl = `${SEO_CONFIG.siteUrl}/industries`;

  return (
    <>
      <SEOHead
        title="Industries We Serve | TrivianEdge"
        description="BPO, RPO, bespoke software, and AI development for logistics, SaaS, healthcare, education, fintech, e-commerce, and legal services companies."
        keywords="industries served, outsourcing by industry, BPO RPO industry solutions, TrivianEdge industries"
        canonical={pageUrl}
        schema={[
          breadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Industries', url: pageUrl },
          ]),
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

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Industries TrivianEdge works with</h1>
          <p className="text-muted text-lg md:text-xl leading-relaxed max-w-2xl">
            Every industry outsources differently. Here is how TrivianEdge's BPO, RPO, bespoke software, and AI development services apply to the industries we work in most.
          </p>
        </div>

        <RelatedLinks
          links={INDUSTRIES.map(i => ({ label: i.name, desc: i.tagline, to: `/industries/${i.slug}` }))}
        />
      </div>
    </>
  );
};

export default IndustriesIndexPage;
