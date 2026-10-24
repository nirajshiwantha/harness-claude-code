import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { DocsBrowserTour } from './DocsBrowserTour';

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
const HOLD_MS = 8000;
// Beat between the headline emptying and the browser opening.
const BEFORE_BROWSER_MS = 400;
// Beat between the browser closing and the demo line being typed.
const AFTER_BROWSER_MS = 1100;
const DELETE_MS_PER_CHAR = 25;
const TYPE_MS_PER_CHAR = 70;

type Stage = 'hold' | 'deleting' | 'browser' | 'closing' | 'typing' | 'done';

const lengthOf = (segments: Segment[]) =>
segments.reduce((sum, s) => sum + s.text.length, 0);

export function ClosingSlide() {
  const reduce = useReducedMotion();
  const frozen = new URLSearchParams(window.location.search).has('freezeAnimations');

  const [stage, setStage] = useState<Stage>('hold');
  const [count, setCount] = useState(lengthOf(HOMEWORK));
  const closeBrowser = useCallback(() => setStage('closing'), []);

  useEffect(() => {
    if (frozen) return;
    let timer: number | undefined;

    if (stage === 'hold') {
      timer = window.setTimeout(() => {
        if (reduce) {
          setCount(lengthOf(DEMO));
          setStage('done');
        } else {
          setStage('deleting');
        }
      }, HOLD_MS);
    } else if (stage === 'deleting') {
      timer =
      count > 0 ?
      window.setTimeout(() => setCount(count - 1), DELETE_MS_PER_CHAR) :
      window.setTimeout(() => setStage('browser'), BEFORE_BROWSER_MS);
    } else if (stage === 'closing') {
      timer = window.setTimeout(() => setStage('typing'), AFTER_BROWSER_MS);
    } else if (stage === 'typing') {
      timer =
      count < lengthOf(DEMO) ?
      window.setTimeout(() => setCount(count + 1), TYPE_MS_PER_CHAR) :
      window.setTimeout(() => setStage('done'), 0);
    }

    return () => window.clearTimeout(timer);
  }, [stage, count, reduce, frozen]);

  const showHomework = stage === 'hold' || stage === 'deleting';
  const showDemo = !showHomework;
  const showCursor = stage !== 'hold';
  const segments = showHomework ? HOMEWORK : DEMO;
  const inBrowser = stage === 'browser';

  return (
    <section className="relative h-full w-full overflow-hidden bg-ink font-heading text-fg">
      <motion.div
        className="flex h-full w-full flex-col justify-between px-[6vw] py-[6vh]"
        animate={
        inBrowser ?
        { opacity: 0.35, scale: 0.96, filter: 'blur(6px)' } :
        { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>

        <div className="flex items-center justify-between">
          <p className="font-mono text-[1.1vw] uppercase tracking-[0.18em] text-coral">
            {showDemo ? 'Up next' : 'Your homework'}
          </p>
        </div>

        <h2 className="min-h-[11.2vw] max-w-[78vw] text-[5.6vw] font-semibold leading-[1] tracking-[-0.04em]">
          {renderTyped(segments, count)}
          {showCursor &&
          <motion.span
            aria-hidden="true"
            className="ml-[0.06em] inline-block h-[0.8em] w-[0.08em] translate-y-[0.08em] bg-coral"
            animate={
            !reduce && stage !== 'deleting' && stage !== 'typing' ?
            { opacity: [1, 0, 1] } :
            { opacity: 1 }
            }
            transition={
            !reduce && stage !== 'deleting' && stage !== 'typing' ?
            { duration: 1.1, repeat: Infinity, ease: 'linear' } :
            { duration: 0 }
            } />

          }
        </h2>

        <div className="flex justify-end border-t border-line pt-[3vh]">
          <span className="text-right font-mono text-[1.25vw] text-dim">
            code.claude.com/docs
            <br />
            <span className="text-fg-soft">see “Extend Claude Code”</span>
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {inBrowser && <DocsBrowserTour key="tour" onDone={closeBrowser} />}
      </AnimatePresence>
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
