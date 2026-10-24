import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function CoverSlide() {
  const reduce = useReducedMotion();

  return (
    <section className="flex h-full w-full flex-col bg-ink px-[6vw] py-[6vh] font-heading text-fg">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[1.6vw] text-dim">
          <span className="text-coral">$</span> claude
          <motion.span
            aria-hidden="true"
            className="ml-[0.4vw] inline-block h-[1.4vw] w-[0.7vw] translate-y-[0.2vw] bg-coral"
            animate={reduce ? undefined : { opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }} />
          
        </p>
      </div>

      <div className="flex flex-1 items-center justify-between gap-[4vw]">
        <div>
          <h1 className="text-[7.4vw] font-semibold leading-[0.95] tracking-[-0.045em]">
            Harnessing
            <br />
            <span className="text-coral">Claude Code</span>
          </h1>
          <p className="mt-[4vh] max-w-[46vw] text-[2vw] leading-snug text-dim">
            From better setup and hidden settings to agents
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line pt-[2.4vh] font-mono text-[1.15vw] text-dim">
        <span>Niraj Ranasinghe · 28 October 2026</span>
        <span>code.claude.com/docs</span>
      </div>
    </section>);

}