import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen text-text px-4 md:px-6 py-16 md:py-32">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted hover:text-cyan-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
        </button>

        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-text">Privacy Protocol</h1>
            <p className="text-muted text-sm font-mono mt-1">TrivianEdge Global Privacy Policy</p>
          </div>
        </div>

        <div className="glass p-10 md:p-16 rounded-[3rem] border-border space-y-8">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-cyan-400 mb-2">Last Updated</p>
            <p className="text-muted">March 2026</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Overview</h2>
            <p className="text-muted leading-relaxed">
              This privacy policy describes how TrivianEdge Global collects, uses, and protects information provided by users of our website and services. We are committed to ensuring that your privacy is protected in compliance with applicable data protection laws including PIPEDA (Canada) and GDPR (where applicable).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Information We Collect</h2>
            <p className="text-muted leading-relaxed">
              We may collect name, company name, email address, and company size when you submit forms on our website (such as the Trivian Aria early access request). We also collect standard website analytics data including page views and general geographic location.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">How We Use Your Information</h2>
            <p className="text-muted leading-relaxed">
              Information submitted through our forms is used solely to respond to your inquiry, process your request for early access, and communicate relevant product updates. We do not sell, trade, or otherwise transfer your personally identifiable information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Data Security</h2>
            <p className="text-muted leading-relaxed">
              We implement industry-standard security measures to protect your personal information. Our infrastructure is hosted on Cloudflare's global edge network with encryption in transit and at rest.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
            <p className="text-cyan-400 text-sm font-mono">
              Full policy in development. Contact{' '}
              <a href="mailto:info@trivianedge.com" className="underline hover:text-white transition-colors">
                info@trivianedge.com
              </a>{' '}
              for privacy enquiries.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Logo onClick={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
