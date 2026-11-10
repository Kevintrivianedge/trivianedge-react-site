import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CalendarDays, ClipboardList, MapPin } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import InquiryForm, { INQUIRY_SERVICES } from '../components/InquiryForm';
import { BOOKING_URL } from '../constants';
import { buildLocalBusinessSchema, breadcrumbSchema, SEO_CONFIG } from '../utils/seo';

const ContactPage: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const service = params.get('service') ?? undefined;
  const source = params.get('source') ?? '/contact';
  const selectedService = Object.entries(INQUIRY_SERVICES).find(([id]) => id === service)?.[1];

  return (
    <>
      <SEOHead
        title="Contact TrivianEdge | Book a Call or Send an Inquiry"
        description="Start a booking or inquiry with TrivianEdge. Tell us what you need and we will respond with the next step."
        keywords="contact TrivianEdge, book a call, BPO inquiry, offshore team consultation, outsourcing quote Canada"
        structuredData={[
          buildLocalBusinessSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            '@id': `${SEO_CONFIG.siteUrl}/contact#webpage`,
            name: 'Contact TrivianEdge',
            description: 'Book a call or submit an inquiry to TrivianEdge for BPO, offshore software development, IT outsourcing, and global talent services.',
            url: `${SEO_CONFIG.siteUrl}/contact`,
            isPartOf: { '@type': 'WebSite', '@id': `${SEO_CONFIG.siteUrl}/#website` },
          },
          breadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Contact', url: `${SEO_CONFIG.siteUrl}/contact` },
          ]),
        ]}
      />

      <div className="min-h-screen bg-background px-4 pb-20 pt-28 text-text md:px-6 md:pt-36">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">Contact TrivianEdge</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">Let’s talk about what you need.</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">Tell us about a role, team, or software project. Pick a time to talk or send us the details.</p>
            {selectedService && (
              <p className="mt-4 text-sm text-muted">Your selected service <strong className="ml-1 text-text">{selectedService}</strong></p>
            )}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <section aria-labelledby="book-heading" className="flex flex-col rounded-3xl border border-border bg-surface p-6 md:p-8">
              <CalendarDays className="h-6 w-6 text-cyan-700 dark:text-cyan-400" aria-hidden />
              <h2 id="book-heading" className="mt-4 text-2xl font-bold">Book a 15-minute call</h2>
              <p className="mb-6 mt-2 text-muted">Choose a time in Microsoft Bookings. You’ll receive a Teams invite to discuss your needs with Kevin Vaz.</p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 font-bold text-black hover:bg-cyan-300">
                Choose a time <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </section>
            <section aria-labelledby="send-heading" className="flex flex-col rounded-3xl border border-border bg-surface p-6 md:p-8">
              <ClipboardList className="h-6 w-6 text-cyan-700 dark:text-cyan-400" aria-hidden />
              <h2 id="send-heading" className="mt-4 text-2xl font-bold">Send a project brief</h2>
              <p className="mb-6 mt-2 text-muted">Share what you need and we’ll reply with the next step, usually within one business day.</p>
              <a href="#project-brief" className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-3 font-bold hover:bg-background">
                Write a brief <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </section>
          </div>

          <div className="mt-12 grid items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <section id="project-brief" aria-labelledby="brief-heading" className="min-w-0 scroll-mt-28">
              <h2 id="brief-heading" className="mb-4 text-2xl font-bold">Tell us what you’re working on</h2>
              <InquiryForm key={search} service={service} source={source} />
            </section>
            <aside aria-labelledby="direct-heading" className="min-w-0 rounded-3xl border border-border p-6">
              <h2 id="direct-heading" className="text-lg font-bold">Contact us directly</h2>
              <div className="mt-4 space-y-3 text-sm text-muted">
                <p><a href="tel:+18883472489" className="hover:underline">+1 888 347 2489</a></p>
                <p><a href="mailto:kevin.v@trivianedge.com" className="break-words hover:underline">kevin.v@trivianedge.com</a></p>
                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />37 Wiggens Ct, Toronto, ON M1B 1K3, Canada</p>
                <p><Link to="/trust" className="hover:underline">Security and compliance</Link></p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};


export default ContactPage;
