import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="glass rounded-2xl border-border overflow-hidden"
          >
            <button
              id={`faq-trigger-${i}`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-text font-semibold hover:text-cyan-400 transition-colors"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
            >
              <span>{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 text-cyan-400"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.span>
            </button>
            {/* Answer stays in the DOM even when collapsed (height/opacity animated,
                not conditionally mounted) so crawlers that don't execute JS or click
                interactions — GPTBot, ClaudeBot, PerplexityBot — can still read it.
                aria-hidden keeps screen readers from announcing it while collapsed
                (CSS clipping alone doesn't remove content from the a11y tree) without
                removing it from the raw HTML those crawlers read. */}
            <motion.div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              aria-hidden={!isOpen}
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-5 text-muted leading-relaxed">
                {item.answer}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
