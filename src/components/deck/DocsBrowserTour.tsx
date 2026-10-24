import React, { useEffect, useRef, useState } from 'react';
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue } from
'framer-motion';
import { ArrowLeft, ArrowRight, Globe, Lock, Plus, RotateCw, Search, X } from 'lucide-react';

const DOCS_URL = 'code.claude.com/docs';
const SCROLL_SECONDS = 5;

const TYPE_MS_PER_CHAR = 70;

// Scroll, short pause, scroll again — a quick skim rather than a steady crawl.
const SCROLL_STOPS = [0, 0.3, 0.3, 0.65, 0.65, 1];
const SCROLL_TIMES = [0, 0.22, 0.32, 0.58, 0.68, 1];

type Step = 'open' | 'point' | 'type' | 'submit' | 'load' | 'scroll' | 'done';

type DocsBrowserTourProps = {
  onDone: () => void;
};

/**
 * Mock browser that types the docs URL, opens a docs page and scrolls it.
 * Plays once on mount and calls `onDone` when finished; the parent unmounts it
 * inside AnimatePresence so the window animates away.
 */
export function DocsBrowserTour({ onDone }: DocsBrowserTourProps) {
  const [step, setStep] = useState<Step>('open');
  const [typed, setTyped] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let timer: number | undefined;
    const next = (s: Step, ms: number) => {
      timer = window.setTimeout(() => setStep(s), ms);
    };

    switch (step) {
      case 'open':
        next('point', 800);
        break;
      case 'point':
        next('type', 1100);
        break;
      case 'type':
        if (typed < DOCS_URL.length) {
          timer = window.setTimeout(() => setTyped(typed + 1), TYPE_MS_PER_CHAR);
        } else {
          next('submit', 400);
        }
        break;
      case 'submit':
        next('load', 600);
        break;
      case 'load':
        next('scroll', 900);
        break;
      case 'done':
        timer = window.setTimeout(() => onDoneRef.current(), 700);
        break;
    }
    return () => window.clearTimeout(timer);
  }, [step, typed]);

  const showPage = step === 'load' || step === 'scroll' || step === 'done';

  return (
    <motion.div
      className="absolute inset-0 z-10 flex items-center justify-center bg-fg/30"
      style={{ perspective: 1400 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.15 } }}>

      <motion.div
        className="flex h-[84vh] w-[86vw] flex-col overflow-hidden rounded-[1vw] border border-white/10 bg-[#1c1c1f] shadow-[0_3vw_8vw_rgba(0,0,0,0.6)]"
        // Opens like an iris: a small pill in the centre unfolds into the full
        // window while it tilts up into place.
        initial={{
          opacity: 0,
          scale: 0.86,
          y: '6vh',
          rotateX: 16,
          clipPath: 'inset(44% 36% 44% 36% round 3vw)'
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          clipPath: 'inset(0% 0% 0% 0% round 1vw)'
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
          y: '4vh',
          clipPath: 'inset(40% 30% 40% 30% round 3vw)',
          transition: { duration: 0.55, ease: [0.55, 0, 0.75, 0] }
        }}
        transition={{
          default: { type: 'spring', stiffness: 110, damping: 18, mass: 0.9 },
          opacity: { duration: 0.25 },
          clipPath: { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
        }}>

        <BrowserChrome showPage={showPage} loading={step === 'load'} />
        <div className="relative min-h-0 flex-1 bg-[#fbfaf8]">
          <AnimatePresence>
            {step === 'load' &&
            <motion.div
              key="progress"
              className="absolute left-0 top-0 z-20 h-[0.25vw] bg-coral"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.3, 0.7, 0.4, 1] }} />

            }
          </AnimatePresence>

          <AnimatePresence>
            {!showPage && <NewTabPage key="newtab" step={step} typed={typed} />}
          </AnimatePresence>

          {showPage &&
          <DocsPage scrolling={step === 'scroll'} onScrolled={() => setStep('done')} />
          }

          <AnimatePresence>
            {step === 'submit' &&
            <motion.div
              key="keycap"
              className="absolute bottom-[3vh] right-[2vw] z-20 flex items-center gap-[0.6vw] rounded-[0.6vw] border border-black/10 bg-[#1c1c1f] px-[1vw] py-[0.6vw] font-mono text-[0.95vw] text-white shadow-lg"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: [0.8, 1.08, 0.94, 1] }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.45 }}>

                <span className="rounded-[0.3vw] border border-white/20 px-[0.4vw]">⏎</span>
                Enter
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>);

}

function BrowserChrome({ showPage, loading }: {showPage: boolean;loading: boolean;}) {
  return (
    <div className="shrink-0 font-heading">
      {/* Tab strip */}
      <div className="flex items-end gap-[0.8vw] px-[1vw] pt-[0.8vw]">
        <div className="flex items-center gap-[0.45vw] pb-[0.7vw] pr-[0.6vw]">
          <span className="h-[0.75vw] w-[0.75vw] rounded-full bg-[#ff5f57]" />
          <span className="h-[0.75vw] w-[0.75vw] rounded-full bg-[#febc2e]" />
          <span className="h-[0.75vw] w-[0.75vw] rounded-full bg-[#28c840]" />
        </div>
        <div className="flex w-[16vw] items-center gap-[0.6vw] rounded-t-[0.6vw] bg-[#2a2a2e] px-[0.9vw] py-[0.55vw] text-[0.85vw] text-[#e6e4df]">
          <AnimatePresence mode="wait" initial={false}>
            {showPage ?
            <motion.span
              key="docs"
              className="flex items-center gap-[0.5vw]"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}>

                <span className="h-[0.8vw] w-[0.8vw] rounded-[0.2vw] bg-coral" />
                Claude Code Docs
              </motion.span> :

            <motion.span key="new" exit={{ opacity: 0, y: -4 }}>
                New Tab
              </motion.span>
            }
          </AnimatePresence>
          <X className="ml-auto h-[0.8vw] w-[0.8vw] text-[#9a9894]" />
        </div>
        <Plus className="mb-[0.6vw] h-[0.9vw] w-[0.9vw] text-[#9a9894]" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-[1vw] bg-[#2a2a2e] px-[1vw] py-[0.6vw] text-[#9a9894]">
        <ArrowLeft className="h-[1vw] w-[1vw]" />
        <ArrowRight className="h-[1vw] w-[1vw] opacity-50" />
        <motion.span
          animate={loading ? { rotate: 360 } : { rotate: 0 }}
          transition={loading ? { duration: 0.8, ease: 'linear', repeat: Infinity } : { duration: 0 }}>

          <RotateCw className="h-[1vw] w-[1vw]" />
        </motion.span>
        <div className="flex flex-1 items-center gap-[0.6vw] rounded-full bg-[#161618] px-[1vw] py-[0.45vw] text-[0.95vw]">
          {showPage ?
          <>
              <Lock className="h-[0.85vw] w-[0.85vw] text-[#c9c7c2]" />
              <motion.span layoutId="docs-url" className="font-mono text-[#f4f3ef]">
                {DOCS_URL}
              </motion.span>
            </> :

          <>
              <Search className="h-[0.85vw] w-[0.85vw]" />
              <span>Search or type a URL</span>
            </>
          }
        </div>
      </div>
    </div>);

}

function NewTabPage({ step, typed }: {step: Step;typed: number;}) {
  const focused = step === 'type' || step === 'submit';
  const text = DOCS_URL.slice(0, typed);
  const showSuggestions = focused && typed >= 3;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center bg-gradient-to-b from-[#fbfaf8] to-[#f1eee8] pt-[20vh] font-heading"
      exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
      transition={{ duration: 0.35 }}>

      <p className="mb-[3vh] text-[2.4vw] font-semibold tracking-[-0.03em] text-[#1f1e1d]">
        Where to next?
      </p>

      <div className="relative w-[44vw]">
        <motion.div
          className="relative z-10 overflow-hidden rounded-[1.6vw] border bg-white"
          animate={{
            borderColor: focused ? 'rgba(196,97,63,0.9)' : 'rgba(0,0,0,0.1)',
            boxShadow: focused ?
            '0 0.6vw 2.4vw rgba(196,97,63,0.18)' :
            '0 0.3vw 1.2vw rgba(0,0,0,0.06)'
          }}>

          <div className="flex items-center gap-[0.8vw] px-[1.4vw] py-[1vw] text-[1.25vw]">
            <Search className="h-[1.2vw] w-[1.2vw] text-[#8a8884]" />
            {focused ?
            <span className="flex items-center">
                {/* Shared layout only once typing ends; while typing, the growing width
                    would otherwise be animated as a scale and squash the text. */}
                <motion.span
                layoutId={step === 'submit' ? 'docs-url' : undefined}
                className="font-mono text-[#1f1e1d]">

                  {text}
                </motion.span>
                {/* Text caret: solid while keys are landing, blinking once idle. */}
                <motion.span
                key={step === 'type' ? 'typing' : 'idle'}
                className="ml-[0.1vw] inline-block h-[1.5vw] w-[0.14vw] rounded-full bg-coral"
                animate={step === 'type' ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
                transition={
                step === 'type' ?
                { duration: 0 } :
                { duration: 1, times: [0, 0.5, 0.55, 1], repeat: Infinity }
                } />

              </span> :

            <span className="text-[#8a8884]">Search or type a URL</span>
            }
          </div>

          <AnimatePresence>
            {showSuggestions &&
            <motion.ul
              className="border-t border-black/5 pb-[0.6vw] text-[1vw] text-[#1f1e1d]"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>

                <motion.li
                className="mx-[0.6vw] mt-[0.6vw] flex items-center gap-[0.8vw] rounded-[0.8vw] px-[0.8vw] py-[0.7vw]"
                animate={{
                  backgroundColor: step === 'submit' ? 'rgba(196,97,63,0.22)' : 'rgba(0,0,0,0.045)'
                }}>

                  <Globe className="h-[1vw] w-[1vw] text-coral" />
                  <span className="font-mono">
                    <span className="font-semibold">{text}</span>
                    <span className="text-[#8a8884]">{DOCS_URL.slice(typed)}</span>
                  </span>
                  <span className="ml-auto text-[0.85vw] text-[#8a8884]">Claude Code Docs</span>
                </motion.li>
                {['claude code docs', 'claude code skills'].map((s, i) =>
              <motion.li
                key={s}
                className="mx-[0.6vw] flex items-center gap-[0.8vw] px-[0.8vw] py-[0.6vw] text-[#55534f]"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * (i + 1) }}>

                    <Search className="h-[1vw] w-[1vw] text-[#8a8884]" />
                    {s}
                  </motion.li>
              )}
              </motion.ul>
            }
          </AnimatePresence>
        </motion.div>

        <FakeCursor step={step} />
      </div>
    </motion.div>);

}

function FakeCursor({ step }: {step: Step;}) {
  const visible = step === 'open' || step === 'point';
  return (
    <motion.div
      className="pointer-events-none absolute z-20"
      initial={{ left: '115%', top: '520%', opacity: 0 }}
      animate={
      step === 'open' ?
      { left: '115%', top: '520%', opacity: 1 } :
      {
        left: ['115%', '34%', '34%'],
        top: ['520%', '45%', '45%'],
        scale: [1, 1, 0.8, 1],
        opacity: visible ? 1 : 0
      }
      }
      transition={
      step === 'point' ?
      { duration: 1, times: [0, 0.7, 1], ease: [0.45, 0, 0.2, 1] } :
      { duration: 0.3 }
      }>

      {step === 'point' &&
      <motion.span
        className="absolute -left-[1.2vw] -top-[1.2vw] h-[2.4vw] w-[2.4vw] rounded-full border-[0.15vw] border-coral"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0, 1.6], opacity: [0, 0.9, 0] }}
        transition={{ duration: 1.1, times: [0, 0.7, 1] }} />

      }
      <svg viewBox="0 0 24 24" className="h-[1.8vw] w-[1.8vw] drop-shadow-md">
        <path
          d="M4 2l15 10.5-6.6 1.4L16 21l-2.8 1.3-3.6-7.2L4 19.5z"
          fill="#1f1e1d"
          stroke="white"
          strokeWidth="1.4"
          strokeLinejoin="round" />

      </svg>
    </motion.div>);

}

type DocSection = {
  id: string;
  title: string;
  body: string;
  code: string;
  label: string;
};

// A stand-in for the real docs page, written to echo the layers in this talk.
const SECTIONS: DocSection[] = [
{
  id: 'memory',
  title: 'CLAUDE.md',
  label: 'CLAUDE.md',
  body: 'Project memory Claude reads at the start of every session. Put build commands and team conventions here, and keep it short.',
  code: '# CLAUDE.md\n- Build: dotnet build\n- Test: dotnet test\n- Data access: Dapper, not EF Core'
},
{
  id: 'skills',
  title: 'Skills',
  label: '.claude/skills/add-endpoint/SKILL.md',
  body: 'Reusable playbooks in a folder with a SKILL.md. Claude loads one only when the task needs it, so the detail lives here instead of in CLAUDE.md.',
  code: '---\nname: add-endpoint\ndescription: Add an API endpoint our way\n---\n1. Repository method + SQL\n2. Controller action with validation'
},
{
  id: 'subagents',
  title: 'Subagents',
  label: '.claude/agents/code-reviewer.md',
  body: 'Specialists with their own context window, tools and instructions. They do the reading and hand back only a summary.',
  code: '---\nname: code-reviewer\ntools: Read, Grep, Glob\n---\nReport findings by severity.'
},
{
  id: 'hooks',
  title: 'Hooks',
  label: '.claude/settings.json',
  body: 'Commands that run at fixed points, such as after every edit. They run every time, whatever the model decides.',
  code: '"PostToolUse": [{\n  "matcher": "Edit|Write",\n  "hooks": [{ "type": "command", "command": "dotnet format" }]\n}]'
},
{
  id: 'mcp',
  title: 'MCP',
  label: 'terminal',
  body: 'Connect Claude to your systems — work items, databases and internal docs — through the Model Context Protocol.',
  code: '$ claude mcp add'
},
{
  id: 'plugins',
  title: 'Plugins',
  label: 'Claude Code',
  body: 'Package skills, subagents, hooks and MCP servers into one installable unit, so the whole team gets the same setup.',
  code: '> /plugin'
}];


const SIDEBAR = [
{ group: 'Getting started', items: ['Overview', 'Quickstart', 'Common workflows'] },
{ group: 'Build with Claude Code', items: ['Extend Claude Code', 'Skills', 'Subagents', 'Hooks', 'MCP', 'Plugins'] },
{ group: 'Configuration', items: ['Settings', 'Memory', 'Permissions'] },
{ group: 'Reference', items: ['CLI reference', 'Slash commands'] }];


const reveal = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  })
};

function DocsPage({ scrolling, onScrolled }: {scrolling: boolean;onScrolled: () => void;}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const maxScroll = useRef(1);
  const scrollY = useMotionValue(0);
  const [active, setActive] = useState(0);
  const onScrolledRef = useRef(onScrolled);
  onScrolledRef.current = onScrolled;

  useEffect(() => {
    if (!scrolling || !viewportRef.current || !contentRef.current) return;
    const max = Math.max(
      1,
      contentRef.current.scrollHeight - viewportRef.current.clientHeight
    );
    maxScroll.current = max;
    const controls = animate(
      scrollY,
      SCROLL_STOPS.map((s) => -s * max),
      {
        duration: SCROLL_SECONDS,
        times: SCROLL_TIMES,
        ease: 'easeInOut',
        onComplete: () => onScrolledRef.current()
      }
    );
    return () => controls.stop();
  }, [scrolling, scrollY]);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const line = -y + (viewportRef.current?.clientHeight ?? 0) * 0.35;
    let next = 0;
    sectionRefs.current.forEach((el, i) => {
      if (el && el.offsetTop <= line) next = i;
    });
    setActive((prev) => prev === next ? prev : next);
  });

  return (
    <motion.div
      className="absolute inset-0 flex flex-col font-heading text-[#1f1e1d]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}>

      {/* Top nav */}
      <div className="flex shrink-0 items-center gap-[2vw] border-b border-[#e8e5df] bg-white/80 px-[2vw] py-[0.9vw]">
        <span className="flex items-center gap-[0.6vw] text-[1.1vw] font-semibold">
          <span className="h-[1.1vw] w-[1.1vw] rounded-[0.25vw] bg-coral" />
          Claude Code Docs
        </span>
        <nav className="flex gap-[1.6vw] text-[0.9vw] text-[#6b6964]">
          <span>Getting started</span>
          <span className="relative font-medium text-[#1f1e1d]">
            Build
            <span className="absolute -bottom-[1vw] left-0 h-[0.15vw] w-full bg-coral" />
          </span>
          <span>Configuration</span>
          <span>Reference</span>
        </nav>
        <span className="ml-auto flex w-[14vw] items-center gap-[0.6vw] rounded-[0.6vw] border border-[#e8e5df] bg-[#f6f4f0] px-[0.8vw] py-[0.4vw] text-[0.85vw] text-[#8a8884]">
          <Search className="h-[0.85vw] w-[0.85vw]" />
          Search docs
          <span className="ml-auto font-mono text-[0.75vw]">⌘K</span>
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="w-[15vw] shrink-0 border-r border-[#ece9e3] px-[1.6vw] py-[2vh] text-[0.85vw]">
          {SIDEBAR.map((g) =>
          <div key={g.group} className="mb-[2vh]">
              <p className="mb-[0.8vh] font-semibold text-[#1f1e1d]">{g.group}</p>
              {g.items.map((item) =>
            <p
              key={item}
              className={
              item === 'Extend Claude Code' ?
              '-mx-[0.6vw] rounded-[0.4vw] bg-coral/10 px-[0.6vw] py-[0.4vh] font-medium text-coral' :
              'py-[0.4vh] text-[#6b6964]'
              }>

                  {item}
                </p>
            )}
            </div>
          )}
        </aside>

        {/* Main column */}
        <div ref={viewportRef} className="relative min-w-0 flex-1 overflow-hidden">
          <motion.div
            ref={contentRef}
            style={{ y: scrollY }}
            className="relative mx-auto max-w-[44vw] px-[2vw] pb-[8vh] pt-[4vh]"
            initial="hidden"
            animate="show">

            <motion.p variants={reveal} custom={0} className="text-[0.85vw] font-medium text-coral">
              Build with Claude Code
            </motion.p>
            <motion.h1
              variants={reveal}
              custom={1}
              className="mt-[1vh] text-[2.4vw] font-semibold tracking-[-0.03em]">

              Extend Claude Code
            </motion.h1>
            <motion.p variants={reveal} custom={2} className="mt-[1.6vh] text-[1.05vw] leading-relaxed text-[#55534f]">
              Claude Code pairs a model that reasons about your code with tools and the
              extensions you add. Each layer does one job; together they turn a chat into a
              setup the whole team shares.
            </motion.p>

            <motion.div variants={reveal} custom={3} className="mt-[3vh] grid grid-cols-3 gap-[1vw]">
              {[
              ['Always on', 'CLAUDE.md, hooks'],
              ['On demand', 'Skills, subagents'],
              ['Connect & share', 'MCP, plugins']].
              map(([title, body]) =>
              <div key={title} className="rounded-[0.8vw] border border-[#e8e5df] bg-white p-[1vw]">
                  <p className="text-[0.95vw] font-semibold">{title}</p>
                  <p className="mt-[0.5vh] text-[0.85vw] text-[#6b6964]">{body}</p>
                </div>
              )}
            </motion.div>

            {SECTIONS.map((s, i) =>
            <motion.section
              key={s.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              variants={reveal}
              custom={4 + i}
              className="mt-[6vh]">

                <h2 className="group flex items-baseline gap-[0.6vw] text-[1.55vw] font-semibold tracking-[-0.02em]">
                  <span className="font-mono text-[1.1vw] text-coral">#</span>
                  {s.title}
                </h2>
                <p className="mt-[1.2vh] text-[1vw] leading-relaxed text-[#55534f]">{s.body}</p>
                <div className="mt-[2vh] overflow-hidden rounded-[0.8vw] bg-[#1c1c1f] text-[0.85vw]">
                  <div className="flex items-center justify-between border-b border-white/10 px-[1vw] py-[0.6vh] font-mono text-[0.75vw] text-[#9a9894]">
                    <span>{s.label}</span>
                    <span>Copy</span>
                  </div>
                  <pre className="whitespace-pre-wrap px-[1vw] py-[1.4vh] font-mono leading-relaxed text-[#e6e4df]">
                    {s.code}
                  </pre>
                </div>
              </motion.section>
            )}

            <div className="mt-[6vh] flex items-center justify-between rounded-[0.8vw] border border-[#e8e5df] bg-white px-[1.2vw] py-[1.6vh] text-[0.9vw]">
              <span className="text-[#55534f]">Was this page helpful?</span>
              <span className="flex gap-[0.6vw]">
                <span className="rounded-[0.4vw] border border-[#e8e5df] px-[0.8vw] py-[0.3vh]">Yes</span>
                <span className="rounded-[0.4vw] border border-[#e8e5df] px-[0.8vw] py-[0.3vh]">No</span>
              </span>
            </div>
          </motion.div>

          <ScrollThumb scrollY={scrollY} maxScroll={maxScroll} />
        </div>

        {/* On this page */}
        <aside className="w-[13vw] shrink-0 px-[1.4vw] py-[4vh] text-[0.82vw]">
          <p className="mb-[1.2vh] font-semibold">On this page</p>
          <ul className="border-l border-[#e8e5df]">
            {SECTIONS.map((s, i) =>
            <li
              key={s.id}
              className={`relative py-[0.5vh] pl-[0.9vw] transition-colors duration-300 ${
              i === active ? 'font-medium text-coral' : 'text-[#6b6964]'}`
              }>

                {i === active &&
              <motion.span
                layoutId="toc-active"
                className="absolute -left-px top-0 h-full w-[0.15vw] bg-coral"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }} />

              }
                {s.title}
              </li>
            )}
          </ul>
        </aside>
      </div>
    </motion.div>);

}

function ScrollThumb({
  scrollY,
  maxScroll



}: {scrollY: MotionValue<number>;maxScroll: React.MutableRefObject<number>;}) {
  const top = useTransform(scrollY, (y) => `${Math.min(1, -y / maxScroll.current) * 78}%`);
  return (
    <div className="absolute bottom-[1vh] right-[0.4vw] top-[1vh] w-[0.35vw]">
      <motion.div style={{ top }} className="absolute h-[22%] w-full rounded-full bg-black/20" />
    </div>);

}
