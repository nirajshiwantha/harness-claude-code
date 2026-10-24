import React, { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type RevealProps = {
  index?: number;
  className?: string;
  children: ReactNode;
};

/** Subtle staged entrance for SECONDARY slide content only. */
export function Reveal({ index = 0, className, children }: RevealProps) {
  const reduce = useReducedMotion();
  const frozen =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('freezeAnimations');
  const skip = reduce || frozen;

  return (
    <motion.div
      className={className}
      initial={skip ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: 0.1 + index * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }}>
      
      {children}
    </motion.div>);

}