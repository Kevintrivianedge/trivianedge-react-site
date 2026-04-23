import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, Package, Shield, ChevronRight, X } from 'lucide-react';

type TabId = 'hiring' | 'onboarding' | 'development' | 'compliance';

interface DrawerData {
  title: string;
  lines: string[];
}

interface Card {
  label: string;
  value: string;
  sub: string;
  color: string;
  drawer: DrawerData;
}

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  cards: Card[];
}

const TABS: Tab[] = [
  {
    id: 'hiring',
    label: 'Hiring Pipeline',
    icon: <Users className="w-4 h-4" />,
    cards: [
      {
        label: 'Active searches',
        value: '12',
        sub: 'Across 4 countries',
        color: 'text-cyan-400',
        drawer: {
          title: 'Active Hiring Searches',
          lines: [
            '3 × Full-Stack Engineers (Vietnam)',
            '2 × Customer Support Leads (Philippines)',
            '2 × Data Scientists (Sri Lanka)',
            '2 × Cloud DevOps (Turkey)',
            '2 × Finance Analysts (South Africa)',
            '1 × Product Manager (Costa Rica)',
          ],
        },
      },
      {
        label: 'Candidates shortlisted',
        value: '47',
        sub: 'Ready for client review',
        color: 'text-violet-400',
        drawer: {
          title: 'Shortlist Breakdown',
          lines: [
            'Technical screen passed: 47/112',
            'Culture-fit score ≥ 85%: 43/47',
            'Timezone alignment confirmed: 47/47',
            'Reference checks complete: 31/47',
          ],
        },
      },
      {
        label: 'Avg. time to shortlist',
        value: '5 days',
        sub: 'From role brief',
        color: 'text-emerald-400',
        drawer: {
          title: 'Speed Benchmark',
          lines: [
            'Industry average: 18–25 days',
            'TrivianEdge target: ≤ 7 days',
            'Current run rate: 5 days',
            'Fastest placement: 3 days (Q1 2025)',
          ],
        },
      },
      {
        label: 'Placements this quarter',
        value: '28',
        sub: '94% retention at 90 days',
        color: 'text-orange-400',
        drawer: {
          title: 'Placement Quality',
          lines: [
            'Placements confirmed: 28',
            '90-day retention: 94%',
            'Client satisfaction score: 4.8/5',
            'Re-hire requests: 7 (from 5 clients)',
          ],
        },
      },
    ],
  },
  {
    id: 'onboarding',
    label: 'Onboarding Status',
    icon: <Zap className="w-4 h-4" />,
    cards: [
      {
        label: 'In onboarding',
        value: '9',
        sub: 'Active integrations',
        color: 'text-cyan-400',
        drawer: {
          title: 'Onboarding Pipeline',
          lines: [
            'Week 1 (orientation): 3 hires',
            'Week 2 (system access + tooling): 2 hires',
            'Week 3 (workflow integration): 2 hires',
            'Week 4 (performance baseline): 2 hires',
          ],
        },
      },
      {
        label: 'Compliance docs filed',
        value: '100%',
        sub: 'Zero exceptions',
        color: 'text-emerald-400',
        drawer: {
          title: 'Compliance Checklist',
          lines: [
            'Local employment contracts: ✓',
            'Tax/payroll registration: ✓',
            'Benefits enrollment: ✓',
            'IP and NDA agreements: ✓',
            'Data protection acknowledgment: ✓',
          ],
        },
      },
      {
        label: 'Avg. first-day readiness',
        value: '97%',
        sub: 'Tools, access, context',
        color: 'text-violet-400',
        drawer: {
          title: 'Day-1 Readiness Score',
          lines: [
            'System access provisioned: ✓',
            'Communication tools setup: ✓',
            'Workflow context delivered: ✓',
            'Manager intro call completed: ✓',
            'KPIs documented and shared: ✓',
          ],
        },
      },
      {
        label: 'Avg. time to productivity',
        value: '8 days',
        sub: 'From first day',
        color: 'text-orange-400',
        drawer: {
          title: 'Productivity Timeline',
          lines: [
            'Days 1–2: context + access',
            'Days 3–5: supervised task execution',
            'Days 6–8: independent delivery starts',
            'Day 9+: full velocity integration',
          ],
        },
      },
    ],
  },
  {
    id: 'development',
    label: 'Delivery',
    icon: <Package className="w-4 h-4" />,
    cards: [
      {
        label: 'Active sprints',
        value: '6',
        sub: 'Across 3 clients',
        color: 'text-cyan-400',
        drawer: {
          title: 'Sprint Overview',
          lines: [
            'Client A — Backend API (Sprint 4/6)',
            'Client B — Mobile UI (Sprint 2/4)',
            'Client B — Data pipeline (Sprint 1/3)',
            'Client C — Dashboard v2 (Sprint 3/5)',
            'Client C — DevOps infra (Sprint 2/4)',
            'Client C — Auth service (Sprint 1/2)',
          ],
        },
      },
      {
        label: 'On-time delivery rate',
        value: '96%',
        sub: 'Last 6 sprints',
        color: 'text-emerald-400',
        drawer: {
          title: 'Delivery Performance',
          lines: [
            'Sprints completed on time: 23/24',
            'Average delay when missed: 0.8 days',
            'Root cause: scope change (not capacity)',
            'Client escalations: 0',
          ],
        },
      },
      {
        label: 'Code review pass rate',
        value: '91%',
        sub: 'First-pass approval',
        color: 'text-violet-400',
        drawer: {
          title: 'Code Quality Gate',
          lines: [
            'First-pass approvals: 91%',
            'Automated test coverage: 84%',
            'Security scan: 0 critical findings',
            'Peer review SLA (24h): 99% met',
          ],
        },
      },
      {
        label: 'Features shipped (QTD)',
        value: '114',
        sub: 'Across all clients',
        color: 'text-orange-400',
        drawer: {
          title: 'Feature Velocity',
          lines: [
            'Q2 target: 100 features',
            'Q2 actual: 114 features (+14%)',
            'Bug-to-feature ratio: 0.11',
            'Client-reported defects: 3 (all P3)',
          ],
        },
      },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: <Shield className="w-4 h-4" />,
    cards: [
      {
        label: 'Jurisdictions managed',
        value: '6',
        sub: 'Active countries',
        color: 'text-cyan-400',
        drawer: {
          title: 'Jurisdiction Coverage',
          lines: [
            'Philippines (Labor Code, SSS, PhilHealth)',
            'Sri Lanka (EPF, ETF, Inland Revenue)',
            'Vietnam (SI, HI, UI, Labour Code)',
            'Turkey (SGK, Income Tax, Labor Law)',
            'South Africa (UIF, PAYE, BCEA)',
            'Costa Rica (CCSS, INS, Labor Code)',
          ],
        },
      },
      {
        label: 'Payroll accuracy rate',
        value: '99.8%',
        sub: 'Across all employees',
        color: 'text-emerald-400',
        drawer: {
          title: 'Payroll Integrity',
          lines: [
            'Payroll runs processed: 312',
            'Errors requiring correction: 1',
            'Avg. payroll processing time: 2 days',
            'On-time salary delivery: 100%',
          ],
        },
      },
      {
        label: 'Audits passed',
        value: '4/4',
        sub: 'Zero findings',
        color: 'text-violet-400',
        drawer: {
          title: 'Audit Trail',
          lines: [
            'Q1 payroll audit: Passed',
            'Q1 data privacy review: Passed',
            'Annual labor compliance audit: Passed',
            'SOC 2 readiness review: Passed',
            'Next audit: Q3 2026',
          ],
        },
      },
      {
        label: 'Open compliance risks',
        value: '0',
        sub: 'All risks resolved',
        color: 'text-orange-400',
        drawer: {
          title: 'Risk Register',
          lines: [
            'High-severity items: 0',
            'Medium-severity items: 0',
            'Low-severity (monitoring): 2',
            'Last risk resolved: 14 days ago',
          ],
        },
      },
    ],
  },
];

const TransparencyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('hiring');
  const [openDrawer, setOpenDrawer] = useState<DrawerData | null>(null);

  const currentTab = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="glass rounded-[2.5rem] border border-border p-8 md:p-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-1">
          Transparency Dashboard
        </p>
        <h3 className="text-xl md:text-2xl font-bold text-text">
          Real-time visibility into your global teams
        </h3>
        <p className="text-muted text-sm mt-1">
          Click any metric for the audit trail behind it.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                : 'border-border text-muted hover:border-border hover:text-text'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {currentTab.cards.map((card, i) => (
            <motion.button
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.2 }}
              onClick={() => setOpenDrawer(card.drawer)}
              className="text-left p-5 rounded-2xl bg-surface border border-border hover:border-cyan-500/30 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/0 group-hover:bg-cyan-500/5 blur-2xl transition-colors pointer-events-none" />
              <p className={`text-2xl md:text-3xl font-bold mb-1 ${card.color}`}>
                {card.value}
              </p>
              <p className="text-xs font-bold text-text leading-tight mb-1">{card.label}</p>
              <p className="text-[10px] text-muted">{card.sub}</p>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-muted group-hover:text-cyan-400 transition-colors font-bold uppercase tracking-widest">
                View audit trail <ChevronRight className="w-3 h-3" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {openDrawer && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-text text-sm">{openDrawer.title}</h4>
              <button
                onClick={() => setOpenDrawer(null)}
                aria-label="Close"
                className="p-1 rounded-lg text-muted hover:text-text transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-2">
              {openDrawer.lines.map((line, i) => (
                <li key={i} className="text-sm text-muted flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransparencyDashboard;
