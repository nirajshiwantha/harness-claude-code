import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Segment = {
  text: string;
  accent?: boolean;
};

const HOMEWORK: Segment[] = [
{ text: 'Write ' },
{ text: 'one skill', accent: true },
{ text: ' for something you repeat every week.' }];


const DEMO: Segment[] = [
{ text: 'Let’s go to the ' },
{ text: 'demo', accent: true },
{ text: '.' }];


// How long the homework line stays before it is typed away.
const HOLD_MS = 10000;
const DELETE_MS_PER_CHAR = 25;
const PAUSE_MS = 500;
const TYPE_MS_PER_CHAR = 70;

type Phase = 'hold' | 'deleting' | 'typing' | 'done';

const lengthOf = (segments: Segment[]) =>
segments.reduce((sum, s) => sum + s.text.length, 0);

export function ClosingSlide() {
  const reduce = useReducedMotion();
  const frozen = new URLSearchParams(window.location.search).has('freezeAnimations');

  const [phase, setPhase] = useState<Phase>('hold');
  const [count, setCount] = useState(lengthOf(HOMEWORK));

  useEffect(() => {
    if (frozen) return;
    let timer: number;

    if (phase === 'hold') {
      timer = window.setTimeout(() => {
        if (reduce) {
          setCount(lengthOf(DEMO));
          setPhase('done');
        } else {
          setPhase('deleting');
        }
      }, HOLD_MS);
    } else if (phase === 'deleting') {
      timer =
      count > 0 ?
      window.setTimeout(() => setCount(count - 1), DELETE_MS_PER_CHAR) :
      window.setTimeout(() => setPhase('typing'), PAUSE_MS);
    } else if (phase === 'typing') {
      timer =
      count < lengthOf(DEMO) ?
      window.setTimeout(() => setCount(count + 1), TYPE_MS_PER_CHAR) :
      window.setTimeout(() => setPhase('done'), 0);
    }

    return () => window.clearTimeout(timer);
  }, [phase, count, reduce, frozen]);

  const showDemo = phase === 'typing' || phase === 'done';
  const segments = showDemo ? DEMO : HOMEWORK;

  return (
    <section className="flex h-full w-full flex-col justify-between bg-ink px-[6vw] py-[6vh] font-heading text-fg">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[1.1vw] uppercase tracking-[0.18em] text-coral">
          {showDemo ? 'Up next' : 'Your homework'}
        </p>
      </div>

      <h2 className="min-h-[11.2vw] max-w-[78vw] text-[5.6vw] font-semibold leading-[1] tracking-[-0.04em]">
        {renderTyped(segments, count)}
        {phase !== 'hold' &&
        <motion.span
          aria-hidden="true"
          className="ml-[0.06em] inline-block h-[0.8em] w-[0.08em] translate-y-[0.08em] bg-coral"
          animate={phase === 'done' && !reduce ? { opacity: [1, 0, 1] } : undefined}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }} />

        }
      </h2>

      <div className="flex justify-end border-t border-line pt-[3vh]">
        <span className="text-right font-mono text-[1.25vw] text-dim">
          code.claude.com/docs
          <br />
          <span className="text-fg-soft">see “Extend Claude Code”</span>
        </span>
      </div>
    </section>);

}

/** Renders the first `count` characters of the segments, keeping each segment's style. */
function renderTyped(segments: Segment[], count: number) {
  let remaining = count;
  return segments.map((segment, i) => {
    const visible = segment.text.slice(0, Math.max(0, remaining));
    remaining -= segment.text.length;
    if (!visible) return null;
    return segment.accent ?
    <span key={i} className="text-coral">{visible}</span> :
    <React.Fragment key={i}>{visible}</React.Fragment>;
  });
}
