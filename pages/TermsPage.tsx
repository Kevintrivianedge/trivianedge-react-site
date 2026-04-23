import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Logo from '../components/Logo';

const TermsPage: React.FC = () => {
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
          <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20">
            <FileText className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-text">Terms of Engagement</h1>
            <p className="text-muted text-sm font-mono mt-1">TrivianEdge Global Terms of Service</p>
          </div>
        </div>

        <div className="glass p-10 md:p-16 rounded-[3rem] border-border space-y-8">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-violet-400 mb-2">Last Updated</p>
            <p className="text-muted">March 2026</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Overview</h2>
            <p className="text-muted leading-relaxed">
              These terms govern the use of TrivianEdge Global's website, services, and the Trivian Aria platform. By accessing our website or using our services, you agree to be bound by these terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Use of Services</h2>
            <p className="text-muted leading-relaxed">
              TrivianEdge provides global talent solutions, managed IT services, AI & business process automation, remote operations consulting, and finance & back-office managed services. Specific service agreements and deliverables are governed by individual statements of work agreed upon between TrivianEdge and each client.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Trivian Aria Early Access</h2>
            <p className="text-muted leading-relaxed">
              The Trivian Aria platform is currently in Phase 1 development. Early access is provided on a best-effort basis. Features, availability, and terms of the free tier are subject to change as the product develops. TrivianEdge reserves the right to modify, suspend, or discontinue any aspect of the service with reasonable notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Intellectual Property</h2>
            <p className="text-muted leading-relaxed">
              All content on this website including text, graphics, logos, and software is the property of TrivianEdge Global and is protected by applicable intellectual property laws. Unauthorized use is prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Limitation of Liability</h2>
            <p className="text-muted leading-relaxed">
              TrivianEdge Global shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the fees paid by you in the three months preceding the claim.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <p className="text-violet-400 text-sm font-mono">
              Full terms in development. Contact{' '}
              <a href="mailto:info@trivianedge.com" className="underline hover:text-white transition-colors">
                info@trivianedge.com
              </a>{' '}
              for legal enquiries.
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

export default TermsPage;
