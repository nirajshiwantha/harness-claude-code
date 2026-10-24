import React from 'react';

import { CodeBlock } from './CodeBlock';
import { Reveal } from './Reveal';
import { RichText } from './RichText';
import { SlideFrame } from './SlideFrame';
import type { CodeContent } from '../../types/deck';

export function CodeSlide({ eyebrow, title, bullets, filename, code }: CodeContent) {
  return (
    <SlideFrame eyebrow={eyebrow} title={title}>
      <div className="grid flex-1 grid-cols-[1fr_1.05fr] items-start gap-[4vw]">
        <ul className="flex flex-col gap-[2.6vh]">
          {bullets.map((b, i) =>
          <Reveal key={b} index={i}>
              <li className="flex gap-[1vw] text-[1.55vw] leading-snug text-fg-soft">
                <span className="font-mono text-[1.1vw] leading-[2] text-coral">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <RichText text={b} />
                </span>
              </li>
            </Reveal>
          )}
        </ul>
        <CodeBlock code={code} filename={filename} />
      </div>
    </SlideFrame>);

}