import React, { type ReactNode } from 'react';

type SlideFrameProps = {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
};

export function SlideFrame({ eyebrow, title, children }: SlideFrameProps) {
  return (
    <section className="flex h-full w-full flex-col bg-ink px-[6vw] py-[5.5vh] font-heading text-fg">
      {/* Title and body are centred together, a little above the true middle, so
          sparse slides don't leave the bottom half empty. */}
      <div className="flex min-h-0 flex-1 flex-col justify-center pb-[4vh]">
        {title &&
        <header className="shrink-0">
            {eyebrow &&
          <p className="font-mono text-[1.1vw] uppercase tracking-[0.18em] text-coral">
                {eyebrow}
              </p>
          }
            <h2 className="mt-[1.2vh] text-[3.4vw] font-semibold leading-[1.05] tracking-[-0.025em]">
              {title}
            </h2>
          </header>
        }
        <div className="mt-[4.5vh] flex min-h-0 flex-col">{children}</div>
      </div>
      <footer className="mt-[2.5vh] flex shrink-0 items-center justify-between font-mono text-[1vw] text-dim">
        <span>
          <span className="text-coral">$</span> claude
        </span>
        <span>Harnessing Claude Code</span>
      </footer>
    </section>);

}