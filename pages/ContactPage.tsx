import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Phone, Mail } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import InquiryForm from '../components/InquiryForm';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Contact TrivianEdge | Book a Call or Send an Inquiry"
        description="Start a booking or inquiry with TrivianEdge. Tell us what you need and we will respond with the next step."
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

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-6">
                <CalendarDays className="w-3 h-3" />
                Booking and inquiry flow
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Start the conversation.
              </h1>
              <p className="text-muted text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
                Tell us what you want to build, outsource, or fix. Use the form for a real inquiry, or contact us directly if you need a faster response.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-10">
                <div className="glass p-6 rounded-3xl border-border">
                  <p className="text-xs uppercase tracking-widest font-bold text-muted mb-2">Response</p>
                  <p className="text-text font-semibold">Same business day when possible</p>
                </div>
                <div className="glass p-6 rounded-3xl border-border">
                  <p className="text-xs uppercase tracking-widest font-bold text-muted mb-2">Direct line</p>
                  <a href="tel:+18882028513" className="text-text font-semibold hover:text-cyan-500 transition-colors">+1 888 202 8513</a>
                </div>
                <div className="glass p-6 rounded-3xl border-border">
                  <p className="text-xs uppercase tracking-widest font-bold text-muted mb-2">Email</p>
                  <a href="mailto:info@trivianedge.com" className="text-text font-semibold hover:text-cyan-500 transition-colors">info@trivianedge.com</a>
                </div>
              </div>

              <div className="space-y-4 text-sm text-muted max-w-2xl">
                <p>Use this page if you want to talk about hiring, outsourcing, AI delivery, or a market entry plan.</p>
                <p>If you need compliance, security, or operating-model details first, review the <Link to="/trust" className="text-cyan-500 hover:underline">Trust page</Link>.</p>
              </div>
            </div>

            <div>
              <InquiryForm />
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-4">
            <a href="tel:+18882028513" className="glass p-6 rounded-3xl border-border flex items-center gap-4 hover:border-cyan-500/30 transition-colors">
              <Phone className="w-5 h-5 text-cyan-500" />
              <span>Prefer to call? Use the direct line.</span>
            </a>
            <a href="mailto:info@trivianedge.com" className="glass p-6 rounded-3xl border-border flex items-center gap-4 hover:border-cyan-500/30 transition-colors">
              <Mail className="w-5 h-5 text-cyan-500" />
              <span>Prefer email? Send the team a message.</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;