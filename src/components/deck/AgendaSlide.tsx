import React from 'react';

import { Reveal } from './Reveal';
import { SlideFrame } from './SlideFrame';
import type { AgendaItem } from '../../types/deck';

type AgendaSlideProps = {
  items: AgendaItem[];
};

export function AgendaSlide({ items }: AgendaSlideProps) {
  return (
    <SlideFrame eyebrow="The route" title="Agenda">
      <ol className="grid flex-1 grid-cols-3 grid-rows-2 gap-[1.4vw]">
        {items.map((item, i) =>
        <Reveal
          key={item.number}
          index={i}
          className="flex flex-col justify-between rounded-[1vw] border border-line bg-panel p-[1.8vw]">
          
            <li className="contents">
              <span className="font-mono text-[2.6vw] font-medium leading-none text-coral">
                {item.number}
              </span>
              <span>
                <span className="block text-[1.7vw] font-semibold leading-tight tracking-[-0.01em]">
                  {item.topic}
                </span>
                <span className="mt-[1vh] block text-[1.25vw] leading-snug text-dim">
                  {item.focus}
                </span>
              </span>
            </li>
          </Reveal>
        )}
      </ol>
    </SlideFrame>);

}