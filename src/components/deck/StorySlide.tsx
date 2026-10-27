import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { DocsBrowserTour } from './DocsBrowserTour';
import { Reveal } from './Reveal';
import { SlideFrame } from './SlideFrame';
import type { StoryStep } from '../../types/deck';

type StorySlideProps = {
  steps: StoryStep[];
};

type Segment = {
  text: string;
  accent?: boolean;
};

const DEMO: Segment[] = [
{ text: 'Let’s go to the ' },
{ text: 'demo', accent: true },
{ text: '.' }];


// How long the recap stays on screen before it clears away.
const HOLD_MS = 10000;
// Pause between the last card leaving and the browser opening.
const BEFORE_BROWSER_MS = 2000;
// Gap between each item leaving or returning, and how long one item takes.
const STAGGER_S = 0.1;
const ITEM_S = 0.55;
// Beat between the browser closing and the closing line being typed.
const AFTER_BROWSER_MS = 1100;
const TYPE_MS_PER_CHAR = 70;

type Stage = 'show' | 'leaving' | 'browser' | 'closing' | 'typing' | 'done';

const DEMO_LENGTH = DEMO.reduce((sum, seg) => sum + seg.text.length, 0);

export function StorySlide({ steps }: StorySlideProps) {
  const reduce = useReducedMotion();
  const frozen = new URLSearchParams(window.location.search).has('freezeAnimations');

  const last = steps.length - 1;
  // Cards and arrows alternate (card 0, arrow 0, card 1, ...); the heading
  // shares position 0 with the first card.
  const lastPosition = last * 2;

  const [stage, setStage] = useState<Stage>('show');
  const [typed, setTyped] = useState(0);
  const closeBrowser = useCallback(() => setStage('closing'), []);

  useEffect(() => {
    if (frozen || reduce) return;
    let timer: number | undefined;

    if (stage === 'show') {
      timer = window.setTimeout(() => setStage('leaving'), HOLD_MS);
    } else if (stage === 'leaving') {
      const lastGoneMs = (lastPosition * STAGGER_S + ITEM_S) * 1000;
      timer = window.setTimeout(() => setStage('browser'), lastGoneMs + BEFORE_BROWSER_MS);
    } else if (stage === 'closing') {
      timer = window.setTimeout(() => setStage('typing'), AFTER_BROWSER_MS);
    } else if (stage === 'typing') {
      timer =
      typed < DEMO_LENGTH ?
      window.setTimeout(() => setTyped(typed + 1), TYPE_MS_PER_CHAR) :
      window.setTimeout(() => setStage('done'), 0);
    }

    return () => window.clearTimeout(timer);
  }, [stage, typed, reduce, frozen, lastPosition]);

  const away = stage !== 'show';
  const inBrowser = stage === 'browser';
  const showDemo = stage === 'typing' || stage === 'done';

  // Cards and arrows lift, blur and fade out one by one from the last card back
  // to the first, which takes the heading with it. They stay gone afterwards;
  // the closing line takes their place.
  const itemMotion = (position: number) => ({
    animate: away ?
    { opacity: 0, y: -24, scale: 0.94, filter: 'blur(8px)' } :
    { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    transition: {
      duration: ITEM_S,
      delay: stage === 'leaving' ? (lastPosition - position) * STAGGER_S : 0,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  });

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        className="relative h-full w-full"
        animate={
        inBrowser ?
        { opacity: 0.35, scale: 0.96, filter: 'blur(6px)' } :
        { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>

        <SlideFrame>
          {/* SlideFrame adds a top margin for its own header; this is the header,
              kept here so it can leave together with the cards. */}
          <motion.header className="-mt-[4.5vh] shrink-0" {...itemMotion(0)}>
            <p className="font-mono text-[1.1vw] uppercase tracking-[0.18em] text-coral">
              Recap
            </p>
            <h2 className="mt-[1.2vh] text-[3.4vw] font-semibold leading-[1.05] tracking-[-0.025em]">
              One repo, one story
            </h2>
          </motion.header>
          <div className="mt-[4.5vh] flex flex-1 items-center">
            <ol className="flex w-full items-stretch">
              {steps.map((step, i) =>
              <React.Fragment key={step.kind}>
                  <motion.div className="flex flex-1" {...itemMotion(i * 2)}>
                    <Reveal index={i} className="flex-1">
                      <li className="flex h-full flex-col rounded-[1vw] border border-line bg-panel p-[2vw]">
                        <span className="font-mono text-[1vw] text-dim">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="mt-[2vh] text-[2.4vw] font-semibold tracking-[-0.02em]">
                          {step.kind}
                        </span>
                        <span className="mt-[1.2vh] font-mono text-[1.2vw] text-coral-soft">
                          {step.name}
                        </span>
                        <span className="mt-[1.6vh] text-[1.35vw] leading-snug text-dim">
                          {step.description}
                        </span>
                      </li>
                    </Reveal>
                  </motion.div>
                  {i < last &&
                <motion.li
                  className="flex items-center px-[0.8vw] text-coral"
                  aria-hidden="true"
                  {...itemMotion(i * 2 + 1)}>
                      <ArrowRight className="h-[2vw] w-[2vw]" strokeWidth={2} />
                    </motion.li>
                }
                </React.Fragment>
              )}
            </ol>
          </div>
        </SlideFrame>

        {showDemo &&
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-[6vw] pb-[8vh]">
            <p className="font-mono text-[1.1vw] uppercase tracking-[0.18em] text-coral">Up next</p>
            <h2 className="mt-[1.2vh] min-h-[6vw] max-w-[78vw] font-heading text-[5.6vw] font-semibold leading-[1] tracking-[-0.04em]">
              {renderTyped(DEMO, typed)}
              <motion.span
              aria-hidden="true"
              className="ml-[0.06em] inline-block h-[0.8em] w-[0.08em] translate-y-[0.08em] bg-coral"
              animate={stage === 'done' && !reduce ? { opacity: [1, 0, 1] } : { opacity: 1 }}
              transition={
              stage === 'done' && !reduce ?
              { duration: 1.1, repeat: Infinity, ease: 'linear' } :
              { duration: 0 }
              } />

            </h2>
          </div>
        }
      </motion.div>

      <AnimatePresence>
        {inBrowser && <DocsBrowserTour key="tour" onDone={closeBrowser} />}
      </AnimatePresence>
    </div>);

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
