import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface RelatedLink {
  label: string;
  desc: string;
  to: string;
}

interface RelatedLinksProps {
  title?: string;
  links: RelatedLink[];
}

/** Cross-links between service/talent/proof pages so users and crawlers can traverse the site's topical graph. */
const RelatedLinks: React.FC<RelatedLinksProps> = ({ title = 'Related', links }) => (
  <section className="py-16 px-4 md:px-6 bg-surface/30">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-text mb-6 reveal">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((item, idx) => (
          <Link
            key={item.to}
            to={item.to}
            style={{ transitionDelay: `${idx * 50}ms` }}
            className="glass p-5 rounded-2xl border-border card-lift reveal group flex flex-col"
          >
            <span className="font-bold text-text mb-1.5 flex items-center justify-between gap-2">
              {item.label}
              <ArrowRight className="w-4 h-4 text-cyan-500 flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="text-muted text-sm leading-relaxed">{item.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default RelatedLinks;
