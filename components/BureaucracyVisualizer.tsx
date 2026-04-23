import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown } from 'lucide-react';

interface Region {
  name: string;
  flag: string;
  steps: string[];
}

const REGIONS: Region[] = [
  {
    name: 'Canada',
    flag: '🇨🇦',
    steps: [
      'Federal business incorporation (Corporations Canada)',
      'Provincial business registration',
      'CRA Business Number + payroll account',
      'Provincial Workers Compensation (WCB/WSIB)',
      'Employment Standards Act compliance per province',
      'Benefits administration setup',
      'T4 payroll remittances (bi-weekly)',
      'Record of Employment (ROE) management',
    ],
  },
  {
    name: 'United States',
    flag: '🇺🇸',
    steps: [
      'State-level LLC or Corporation registration',
      'Federal EIN (IRS)',
      'State tax identification number',
      'I-9 / E-Verify employment eligibility',
      'State-specific payroll tax accounts',
      'Workers Compensation insurance per state',
      'FUTA / SUTA employer tax setup',
      'Benefits (ACA compliance, ERISA)',
    ],
  },
  {
    name: 'Philippines',
    flag: '🇵🇭',
    steps: [
      'SEC or DTI business registration',
      'BIR Tax Identification Number',
      'SSS (Social Security System) enrollment',
      'PhilHealth employer account',
      'Pag-IBIG (HDMF) fund registration',
      'DOLE labor standards compliance',
      'Local Government Unit (LGU) permits',
      'Monthly payroll remittance filings',
    ],
  },
  {
    name: 'Sri Lanka',
    flag: '🇱🇰',
    steps: [
      'Companies Act registration (Registrar of Companies)',
      'Inland Revenue Department (IRD) tax number',
      'EPF (Employees Provident Fund) employer setup',
      'ETF (Employees Trust Fund) registration',
      'Department of Labour compliance',
      'Workmen Compensation Act coverage',
      'Shop and Office Employees Act compliance',
      'Quarterly PAYE remittances',
    ],
  },
  {
    name: 'Vietnam',
    flag: '🇻🇳',
    steps: [
      'Business registration with the Department of Planning',
      'Tax code registration (Ministry of Finance)',
      'Social Insurance (SI) employer account',
      'Health Insurance (HI) enrollment',
      'Unemployment Insurance (UI) registration',
      'Labor contract compliance (Labour Code)',
      'Foreign worker work permit (if applicable)',
      'Monthly statutory filings',
    ],
  },
  {
    name: 'UAE',
    flag: '🇦🇪',
    steps: [
      'Trade License (mainland or free zone)',
      'UAE Establishment card',
      'Residence visa processing per employee',
      'Emirates ID for each employee',
      'Labour card (MOHRE)',
      'WPS (Wage Protection System) compliance',
      'Medical insurance for all staff (mandatory)',
      'End-of-service gratuity calculation',
    ],
  },
];

const TRIVIANEDGE_STEPS = [
  'You tell us who you need.',
  'We handle every legal, payroll, and compliance step.',
  'Your hire is up and running in 30 days.',
];

const BureaucracyVisualizer: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(REGIONS[0]);
  const [withTrivianEdge, setWithTrivianEdge] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="glass rounded-[2.5rem] border border-border p-8 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-1">
            Bureaucracy Visualizer
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-text">
            See the red tape we remove
          </h3>
        </div>

        {/* Region selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-3 px-5 py-3 glass rounded-2xl border border-border hover:border-cyan-500/40 transition-all font-bold text-sm text-text min-w-[160px] justify-between"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span>
              {selectedRegion.flag} {selectedRegion.name}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                role="listbox"
                className="absolute right-0 mt-2 w-48 glass rounded-2xl border border-border overflow-hidden z-20 shadow-xl"
              >
                {REGIONS.map(r => (
                  <li
                    key={r.name}
                    role="option"
                    aria-selected={r.name === selectedRegion.name}
                    onClick={() => {
                      setSelectedRegion(r);
                      setDropdownOpen(false);
                      setWithTrivianEdge(false);
                    }}
                    className={`px-5 py-3 cursor-pointer text-sm font-medium transition-colors flex items-center gap-3 ${
                      r.name === selectedRegion.name
                        ? 'text-cyan-400 bg-cyan-500/10'
                        : 'text-muted hover:text-text hover:bg-surface'
                    }`}
                  >
                    <span>{r.flag}</span>
                    {r.name}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span className={`text-sm font-bold transition-colors ${!withTrivianEdge ? 'text-rose-400' : 'text-muted'}`}>
          Without TrivianEdge
        </span>
        <button
          onClick={() => setWithTrivianEdge(v => !v)}
          aria-pressed={withTrivianEdge}
          className={`relative w-14 h-7 rounded-full border transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
            withTrivianEdge ? 'bg-cyan-500/20 border-cyan-500/40' : 'bg-rose-500/10 border-rose-500/30'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow transition-all duration-300 ${
              withTrivianEdge ? 'translate-x-7 bg-cyan-400' : 'translate-x-0 bg-rose-400'
            }`}
          />
        </button>
        <span className={`text-sm font-bold transition-colors ${withTrivianEdge ? 'text-cyan-400' : 'text-muted'}`}>
          With TrivianEdge
        </span>
      </div>

      {/* Step list */}
      <AnimatePresence mode="wait">
        {!withTrivianEdge ? (
          <motion.div
            key="without"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-xs text-muted uppercase tracking-widest font-bold mb-4">
              {selectedRegion.steps.length} compliance requirements to navigate in {selectedRegion.name}
            </p>
            <ul className="space-y-3">
              {selectedRegion.steps.map((step, i) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/15"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-[10px] font-bold text-rose-400">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted leading-snug">{step}</span>
                </motion.li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-rose-400/70 font-medium text-center">
              Each step requires local expertise, time, and ongoing management.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="with"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs text-cyan-400 uppercase tracking-widest font-bold mb-4">
              3 steps. That's it.
            </p>
            <ul className="space-y-3 mb-6">
              {TRIVIANEDGE_STEPS.map((step, i) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.25 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20"
                >
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm text-text font-medium">{step}</span>
                </motion.li>
              ))}
            </ul>
            <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-center">
              <p className="text-cyan-400 font-bold text-sm">
                All {selectedRegion.steps.length} {selectedRegion.name} compliance requirements handled by TrivianEdge.
              </p>
              <p className="text-muted text-xs mt-1">
                You focus on the business. We own the red tape.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BureaucracyVisualizer;
