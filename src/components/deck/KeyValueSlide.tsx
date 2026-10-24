import React from 'react';

import { CodeBlock } from './CodeBlock';
import { Reveal } from './Reveal';
import { RichText } from './RichText';
import { SlideFrame } from './SlideFrame';
import type { KeyValueContent } from '../../types/deck';

export function KeyValueSlide({
  eyebrow,
  title,
  rows,
  layout = 'rows',
  monoKeys = false,
  note,
  leadCode,
  code,
  codeCaption
}: KeyValueContent) {
  return (
    <SlideFrame eyebrow={eyebrow} title={title}>
      {leadCode &&
      <div className="mb-[3.5vh]">
          <CodeBlock code={leadCode} />
        </div>
      }

      {layout === 'grid' ?
      <div className="grid grid-cols-3 gap-[1.6vw]">
          {rows.map((row, i) =>
        <Reveal
          key={row.key}
          index={i}
          className="flex flex-col rounded-[1vw] border border-line bg-panel p-[2vw]">
          
              <span className="font-mono text-[1vw] text-coral">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-[1.6vh] text-[2vw] font-semibold tracking-[-0.01em]">
                {row.key}
              </span>
              <span className="mt-[1vh] text-[1.4vw] leading-snug text-dim">
                <RichText text={row.value} />
              </span>
            </Reveal>
        )}
        </div> :

      <div className="flex flex-col border-t border-line">
          {rows.map((row, i) =>
        <Reveal
          key={row.key}
          index={i}
          className="grid grid-cols-[38%_1fr] items-baseline gap-[3vw] border-b border-line py-[2vh]">
          
              <div
            className={
            monoKeys ?
            'font-mono text-[1.3vw] text-coral-soft' :
            'text-[1.6vw] font-semibold'
            }>
            
                {row.key}
              </div>
              <div className="text-[1.5vw] leading-snug text-dim">
                <RichText text={row.value} />
              </div>
            </Reveal>
        )}
        </div>
      }

      {code &&
      <Reveal index={rows.length} className="mt-[3.5vh]">
          <CodeBlock code={code} size="sm" filename="env" />
          {codeCaption &&
        <p className="mt-[1.6vh] text-[1.35vw] text-dim">
              <RichText text={codeCaption} />
            </p>
        }
        </Reveal>
      }

      {note &&
      <Reveal
        index={rows.length + 1}
        className="mt-[4vh] rounded-[0.8vw] bg-panel px-[2vw] py-[2.2vh] text-[1.45vw] text-fg-soft">
        
          <RichText text={note} />
        </Reveal>
      }
    </SlideFrame>);

}