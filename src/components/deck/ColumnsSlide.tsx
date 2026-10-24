import React from 'react';

import { CodeBlock } from './CodeBlock';
import { Reveal } from './Reveal';
import { RichText } from './RichText';
import { SlideFrame } from './SlideFrame';
import type { ColumnsContent } from '../../types/deck';

export function ColumnsSlide({ eyebrow, title, intro, columns, note }: ColumnsContent) {
  const gridCols = columns.length === 3 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <SlideFrame eyebrow={eyebrow} title={title}>
      {intro &&
      <p className="-mt-[1.5vh] mb-[3.5vh] max-w-[70vw] text-[1.6vw] leading-snug text-dim">
          <RichText text={intro} />
        </p>
      }

      <div className={`grid ${gridCols} gap-[2vw]`}>
        {columns.map((col, i) =>
        <Reveal
          key={i}
          index={i}
          className="flex flex-col gap-[1.8vh] rounded-[1vw] border border-line bg-panel p-[2.2vw]">
          
            {col.eyebrow &&
          <span className="font-mono text-[1.05vw] text-coral">{col.eyebrow}</span>
          }
            {col.title &&
          <h3 className="text-[1.9vw] font-semibold leading-tight tracking-[-0.01em]">
                {col.title}
              </h3>
          }
            {col.command &&
          <div className="text-[1.25vw] leading-relaxed">
                <RichText text={col.command} />
              </div>
          }
            {col.code && <CodeBlock code={col.code} size="sm" filename=".claude/settings.json" />}
            {col.body &&
          <p className="text-[1.4vw] leading-snug text-dim">
                <RichText text={col.body} />
              </p>
          }
            {col.bullets &&
          <ul className="flex flex-col gap-[1.4vh]">
                {col.bullets.map((b) =>
            <li key={b} className="flex gap-[0.9vw] text-[1.4vw] leading-snug text-fg-soft">
                    <span
                className="mt-[0.6em] h-[0.4vw] w-[0.4vw] shrink-0 bg-coral"
                aria-hidden="true" />
              
                    <span>
                      <RichText text={b} />
                    </span>
                  </li>
            )}
              </ul>
          }
          </Reveal>
        )}
      </div>

      {note &&
      <Reveal
        index={columns.length}
        className="mt-auto border-t border-line pt-[2.4vh] text-[1.45vw] text-fg-soft">
        
          <RichText text={note} />
        </Reveal>
      }
    </SlideFrame>);

}