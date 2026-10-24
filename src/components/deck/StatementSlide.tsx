import React from 'react';

import { Reveal } from './Reveal';

type StatementSlideProps = {
  eyebrow?: string;
  statement: string;
  support: string;
};

export function StatementSlide({ eyebrow, statement, support }: StatementSlideProps) {
  return (
    <section className="flex h-full w-full flex-col justify-between bg-coral px-[6vw] py-[6vh] font-heading text-oncoral">
      <div className="flex items-center justify-between">
        {eyebrow && <p className="font-mono text-[1.1vw] uppercase tracking-[0.18em]">{eyebrow}</p>}
      </div>
      <div>
        <h2 className="max-w-[80vw] text-[5.8vw] font-semibold leading-[1] tracking-[-0.04em]">
          {statement}
        </h2>
        <Reveal index={2}>
          <p className="mt-[5vh] text-[2.1vw] font-medium text-oncoral/75">{support}</p>
        </Reveal>
      </div>
      <p className="font-mono text-[1vw]">$ claude · Harnessing Claude Code</p>
    </section>);

}