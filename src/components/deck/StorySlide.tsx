import React from 'react';
import { ArrowRight } from 'lucide-react';

import { Reveal } from './Reveal';
import { SlideFrame } from './SlideFrame';
import type { StoryStep } from '../../types/deck';

type StorySlideProps = {
  steps: StoryStep[];
};

export function StorySlide({ steps }: StorySlideProps) {
  return (
    <SlideFrame eyebrow="Recap" title="One repo, one story">
      <div className="flex flex-1 items-center">
        <ol className="flex w-full items-stretch">
          {steps.map((step, i) =>
          <React.Fragment key={step.kind}>
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
              {i < steps.length - 1 &&
            <li className="flex items-center px-[0.8vw] text-coral" aria-hidden="true">
                  <ArrowRight className="h-[2vw] w-[2vw]" strokeWidth={2} />
                </li>
            }
            </React.Fragment>
          )}
        </ol>
      </div>
    </SlideFrame>);

}