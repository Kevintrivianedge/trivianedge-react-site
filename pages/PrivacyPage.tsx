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
              This policy explains what information TrivianEdge collects, how we use it, and the controls we apply to protect it. We keep this policy practical and easy to read. Our handling approach is aligned with applicable privacy obligations, including PIPEDA (Canada) and GDPR principles where relevant.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Information We Collect</h2>
            <p className="text-muted leading-relaxed">
              We collect information you provide directly, such as your name, company name, email address, and request details when you submit forms. We also collect basic analytics signals such as page views, device/browser context, and general region to help us improve website performance and user experience.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">How We Use Your Information</h2>
            <p className="text-muted leading-relaxed">
              We use submitted information to respond to inquiries, handle service requests, and share relevant follow-up communication. We do not sell your personal information. We only share data with service providers that support core operations such as website infrastructure, communications delivery, and analytics processing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Retention and Access</h2>
            <p className="text-muted leading-relaxed">
              We retain personal data only as long as needed for the purpose it was collected, or as required by law. You may request access, correction, or deletion of your information by contacting us. We will review and respond to requests within a reasonable period.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Data Security</h2>
            <p className="text-muted leading-relaxed">
              We apply practical technical and organizational safeguards, including encrypted transport, restricted API exposure, and monitored cloud infrastructure controls. No online system is risk-free, but we continuously improve controls to reduce operational and security risk.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Contact</h2>
            <p className="text-muted leading-relaxed">
              For privacy requests or questions, contact us at{' '}
              <a href="mailto:info@trivianedge.com" className="underline hover:text-cyan-400 transition-colors">info@trivianedge.com</a>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
            <p className="text-cyan-400 text-sm font-mono">
              This page is reviewed periodically to reflect service, legal, and operational updates.
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
