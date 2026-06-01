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
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <FileText className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-text">Terms of Engagement</h1>
            <p className="text-muted text-sm font-mono mt-1">TrivianEdge Global Terms of Service</p>
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
              These terms govern use of the TrivianEdge website and related service interactions. By accessing this site or engaging our services, you agree to these terms alongside any signed proposal, statement of work, or master agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Use of Services</h2>
            <p className="text-muted leading-relaxed">
              TrivianEdge provides global talent, outsourcing, and operational support services. Scope, timelines, pricing, and delivery responsibilities are defined in client-specific agreements. Website content is informational and does not by itself create a service commitment.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Trivian Aria Early Access</h2>
            <p className="text-muted leading-relaxed">
              Where Trivian Aria early access is offered, it is provided on a best-effort basis. Features and availability may change as the product evolves. We may modify, pause, or discontinue early-access features with reasonable notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Intellectual Property</h2>
            <p className="text-muted leading-relaxed">
              Website content, brand assets, documents, and software elements are owned by TrivianEdge or its licensors and protected by applicable intellectual property laws. You may not copy, republish, or commercially reuse content without prior written permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Limitation of Liability</h2>
            <p className="text-muted leading-relaxed">
              To the extent permitted by law, TrivianEdge is not liable for indirect, incidental, special, or consequential damages arising from website use. Service liability terms for active clients are governed by signed commercial agreements.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Client Responsibilities</h2>
            <p className="text-muted leading-relaxed">
              Clients are responsible for providing accurate business and project information, timely approvals, and authorized points of contact for delivery decisions. Delays in required client inputs may affect delivery timelines.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-4">Governing Terms and Updates</h2>
            <p className="text-muted leading-relaxed">
              We may update these terms from time to time to reflect service and legal changes. Updated terms apply from the date posted on this page unless a signed agreement states otherwise.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
            <p className="text-cyan-400 text-sm font-mono">
              For legal enquiries, contact{' '}
              <a href="mailto:kevin.v@trivianedge.com" className="underline hover:text-white transition-colors">
                kevin.v@trivianedge.com
              </a>{' '}
              and reference "Terms of Engagement" in the subject line.
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
