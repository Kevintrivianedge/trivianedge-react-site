import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: { label: string; value: string }[];
}

interface Profile {
  title: string;
  tagline: string;
  traits: string[];
  hubs: string[];
  color: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'How does your team prefer to make decisions?',
    options: [
      { label: 'Fast — bias toward action, iterate later', value: 'fast' },
      { label: 'Structured — clear frameworks and documented outcomes', value: 'structured' },
      { label: 'Deliberate — thorough analysis before committing', value: 'deliberate' },
    ],
  },
  {
    id: 2,
    question: 'How does your team communicate day-to-day?',
    options: [
      { label: 'Async-first — Slack, Notion, no unnecessary calls', value: 'async' },
      { label: 'Hybrid — daily standups, async for everything else', value: 'hybrid' },
      { label: 'Synchronous — regular video check-ins and live collaboration', value: 'sync' },
    ],
  },
  {
    id: 3,
    question: 'How much independence do you give your team?',
    options: [
      { label: 'High — set goals and get out of the way', value: 'high' },
      { label: 'Balanced — clear ownership with regular reviews', value: 'balanced' },
      { label: 'Managed — close oversight with defined SLAs', value: 'managed' },
    ],
  },
  {
    id: 4,
    question: 'Where is your core team based?',
    options: [
      { label: 'Americas (US, Canada, LatAm)', value: 'americas' },
      { label: 'Europe, UK, Middle East, Africa', value: 'emea' },
      { label: 'Asia-Pacific (Australia, NZ, SEA)', value: 'apac' },
    ],
  },
];

const PROFILES: Record<string, Profile> = {
  agile: {
    title: 'Agile Global Builder',
    tagline: 'You move fast. Your team needs to keep up — across any time zone.',
    traits: [
      'Bias toward execution over perfection',
      'Comfortable with ambiguity and rapid iteration',
      'Needs talent who take initiative without hand-holding',
    ],
    hubs: ['Vietnam 🇻🇳', 'Costa Rica 🇨🇷'],
    color: 'text-cyan-400',
  },
  structured: {
    title: 'Structured Scale Partner',
    tagline: 'You run a tight ship. Your team needs discipline and accountability.',
    traits: [
      'Process-driven with strong documentation culture',
      'Needs reliable delivery with clear KPIs',
      'Values communication precision and follow-through',
    ],
    hubs: ['Philippines 🇵🇭', 'South Africa 🇿🇦'],
    color: 'text-violet-400',
  },
  precision: {
    title: 'High-Precision Engineer',
    tagline: 'You build for longevity. Your team needs technical depth and rigor.',
    traits: [
      'Prefers deep thinkers over fast executors',
      'Quality-first culture with strong code review practices',
      'Values engineering judgment over pure speed',
    ],
    hubs: ['Sri Lanka 🇱🇰', 'Turkey 🇹🇷'],
    color: 'text-emerald-400',
  },
};

function resolveProfile(answers: Record<number, string>): Profile {
  const speed = answers[1];
  const independence = answers[3];

  if (speed === 'fast' || independence === 'high') return PROFILES.agile;
  if (speed === 'deliberate' || independence === 'managed') return PROFILES.precision;
  return PROFILES.structured;
}

const CultureSyncQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / QUESTIONS.length) * 100;
  const profile = done ? resolveProfile(answers) : null;

  function handleSelect(value: string) {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(i => i + 1), 200);
    } else {
      setTimeout(() => setDone(true), 200);
    }
  }

  function reset() {
    setAnswers({});
    setCurrentQuestion(0);
    setDone(false);
  }

  return (
    <div className="glass rounded-[2.5rem] border border-border p-8 md:p-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-1">
          Culture-Sync Quiz
        </p>
        <h3 className="text-xl md:text-2xl font-bold text-text">
          Find your team fit profile
        </h3>
        <p className="text-muted text-sm mt-1">
          4 questions. We'll show you the talent that matches how you work.
        </p>
      </div>

      {/* Progress bar */}
      {!done && (
        <div className="mb-8">
          <div className="flex justify-between text-[10px] text-muted font-mono mb-2">
            <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      )}

      {/* Question or Result */}
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <h4 className="text-lg md:text-xl font-bold text-text mb-6">{q.question}</h4>
            <div className="space-y-3">
              {q.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 font-medium text-sm ${
                    answers[q.id] === opt.value
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                      : 'border-border text-muted hover:border-cyan-500/30 hover:text-text hover:bg-surface'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                      answers[q.id] === opt.value ? 'border-cyan-400 bg-cyan-400' : 'border-border'
                    }`} />
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {profile && (
              <>
                <div className="p-6 rounded-2xl bg-surface border border-border mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">
                    Your Team Fit Profile
                  </p>
                  <h4 className={`text-2xl font-bold mb-2 ${profile.color}`}>
                    {profile.title}
                  </h4>
                  <p className="text-muted text-sm leading-relaxed">{profile.tagline}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {profile.traits.map((trait, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted">{trait}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">
                    Best-fit talent hubs for your team
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {profile.hubs.map(hub => (
                      <span
                        key={hub}
                        className="px-4 py-2 rounded-xl bg-surface border border-border text-sm font-bold text-text"
                      >
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#contact"
                    onClick={e => {
                      e.preventDefault();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-btn-bg text-btn-text rounded-xl font-bold text-sm hover:bg-cyan-400 hover:text-white transition-all"
                  >
                    Build my team <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 px-6 py-3 glass text-muted rounded-xl font-bold text-sm hover:text-text transition-all border border-border"
                  >
                    <RotateCcw className="w-4 h-4" /> Retake
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CultureSyncQuiz;
