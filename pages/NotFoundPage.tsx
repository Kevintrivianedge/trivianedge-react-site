import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist or may have moved."
        noIndex
      />

      <div className="bg-background min-h-screen text-text px-4 md:px-6 py-24 md:py-32 flex items-center">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-8">
            <Compass className="w-3 h-3" />
            404 — Page not found
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            This page doesn't exist.
          </h1>
          <p className="text-muted text-lg leading-relaxed mb-10">
            The link you followed may be broken, or the page may have moved. Try one of these instead.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button"
            >
              Back to home
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button-secondary"
            >
              View services
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button-secondary"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
