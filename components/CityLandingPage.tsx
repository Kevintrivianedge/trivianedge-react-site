import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Users, Briefcase, Clock, ArrowRight, Globe, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import SEOHead from './SEOHead';
import LocalBusinessSchema from './LocalBusinessSchema';
import { SEO_CONFIG, breadcrumbSchema } from '../utils/seo';
import citiesData from '../data/cities.json';

const CityLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const city = citiesData.cities.find(c => c.slug === slug);

  if (!city) {
    return (
      <div className="py-32 px-4 md:px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text mb-4">Location Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-block px-6 py-3 rounded-lg premium-button font-bold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const pageUrl = `${SEO_CONFIG.siteUrl}/locations/${city.slug}`;
  const pageTitle = `Hire Talent in ${city.name} | TrivianEdge`;
  const pageDescription = `${city.description} Based in ${city.name}, ${city.country}. Access pre-vetted ${city.name} professionals for your team.`;

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={city.keywordFocus.join(', ')}
        ogType="website"
        ogImage={city.imageUrl || SEO_CONFIG.defaultOgImage}
        schema={breadcrumbSchema([
          { name: 'Home', url: SEO_CONFIG.siteUrl },
          { name: 'Locations', url: `${SEO_CONFIG.siteUrl}/locations` },
          { name: city.name, url: pageUrl },
        ])}
      />
      <LocalBusinessSchema city={city} url={pageUrl} />

      <article className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-500/10 to-transparent -z-10" />
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-bold uppercase tracking-widest mb-6"
              >
                ← Back to Home
              </Link>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-text">
                Hire Talent in <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">{city.name}</span>
              </h1>
              <p className="text-xl text-muted leading-relaxed max-w-2xl mb-8">
                {city.description} Our team of {city.teamSize} is ready to extend your operations across time zones.
              </p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-4 gap-6 mb-12"
            >
              <div className="glass p-6 rounded-2xl border-border">
                <Users className="w-8 h-8 text-cyan-400 mb-3" />
                <p className="text-sm text-muted uppercase tracking-widest font-bold mb-2">Team Size</p>
                <p className="text-2xl font-bold text-text">{city.teamSize}</p>
              </div>
              <div className="glass p-6 rounded-2xl border-border">
                <MapPin className="w-8 h-8 text-cyan-400 mb-3" />
                <p className="text-sm text-muted uppercase tracking-widest font-bold mb-2">Location</p>
                <p className="text-lg font-bold text-text">{city.name}</p>
              </div>
              <div className="glass p-6 rounded-2xl border-border">
                <Clock className="w-8 h-8 text-cyan-400 mb-3" />
                <p className="text-sm text-muted uppercase tracking-widest font-bold mb-2">Timezone</p>
                <p className="text-sm font-bold text-text">{city.timezone}</p>
              </div>
              <div className="glass p-6 rounded-2xl border-border">
                <Globe className="w-8 h-8 text-cyan-400 mb-3" />
                <p className="text-sm text-muted uppercase tracking-widest font-bold mb-2">Region</p>
                <p className="text-lg font-bold text-text">{city.country}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-20 md:py-32 px-4 md:px-6 bg-surface/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-text">
                Our {city.name} Expertise
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {city.expertise.map((skill, idx) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="glass p-6 rounded-2xl border-border hover:border-cyan-500/40 transition-colors"
                  >
                    <Briefcase className="w-8 h-8 text-cyan-400 mb-4" />
                    <h3 className="text-lg font-bold text-text mb-2">{skill}</h3>
                    <p className="text-sm text-muted">
                      Pre-vetted specialists in {skill.toLowerCase()} ready to join your team.
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 md:py-32 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text">
                Ready to Scale Your {city.name} Team?
              </h2>
              <p className="text-xl text-muted mb-12 max-w-2xl mx-auto">
                Connect with our {city.name} specialists to discuss your talent needs and how we can support your growth.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="glass p-8 rounded-2xl border-border">
                  <Phone className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                  <p className="text-muted text-sm uppercase tracking-widest font-bold mb-2">Phone</p>
                  <p className="text-lg font-bold text-text">{city.phone}</p>
                </div>
                <div className="glass p-8 rounded-2xl border-border">
                  <Mail className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                  <p className="text-muted text-sm uppercase tracking-widest font-bold mb-2">Email</p>
                  <a href={`mailto:${city.email}`} className="text-lg font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                    {city.email}
                  </a>
                </div>
              </div>

              <a
                href="mailto:kevin.v@trivianedge.com"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg premium-button hover:scale-105 transition-transform"
              >
                Schedule a Call
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Other Locations CTA */}
        <section className="py-20 md:py-32 px-4 md:px-6 bg-surface/50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-text">
              Explore Other Talent Hubs
            </h2>
            <p className="text-muted mb-12 max-w-2xl mx-auto">
              TrivianEdge operates across multiple time zones. Explore our other locations to find the perfect team for your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {citiesData.cities.map(c => (
                <Link
                  key={c.slug}
                  to={`/locations/${c.slug}`}
                  className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${
                    c.slug === city.slug
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                      : 'glass border-border hover:border-cyan-500/40 text-text'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
};

export default CityLandingPage;
