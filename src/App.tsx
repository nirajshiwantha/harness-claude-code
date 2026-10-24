import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { slides } from './deckSlides';
import { useScreenInit } from './useScreenInit';

// Host <-> deck sync messages. Do NOT change these strings.
const MP_SLIDE_CHANGED = 'MP_SLIDE_CHANGED';
const MP_NAVIGATE_SLIDE = 'MP_NAVIGATE_SLIDE';

// Length of the slide-to-slide cross-dissolve.
const DISSOLVE_SECONDS = 0.4;

/**
 * Deck harness — DO NOT EDIT. Owns the single `slideIndex` navigation state,
 * keyboard + host-driven navigation, and the host-sync postMessage, and renders
 * exactly one full-bleed slide at a time. Build slides in deckSlides.tsx (in
 * presentation order) and keep canvas.manifest.js in sync — never reimplement
 * navigation or host-sync here or inside a slide.
 */
export function App() {
  const total = slides.length;
  const seeded =
  (useScreenInit() as {slideIndex?: number;} | undefined)?.slideIndex ?? 0;
  const [slideIndex, setSlideIndex] = useState(() => clampIndex(seeded, total));

  const navigate = useCallback((direction: 1 | -1) => {
    setSlideIndex((prev) => clampIndex(prev + direction, total));
  }, [total]);

  // Keyboard navigation (preview + present mode).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
      event.key === 'ArrowRight' ||
      event.key === ' ' ||
      event.key === 'PageDown')
      {
        event.preventDefault();
        navigate(1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  // Host-driven navigation (e.g. present mode) via postMessage into the iframe.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== MP_NAVIGATE_SLIDE) return;
      navigate(event.data.direction === 'prev' ? -1 : 1);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [navigate]);

  // Mirror every real slide change to the host (skip the initial render) so the
  // editor filmstrip / present mode stay in lockstep with in-deck navigation.
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    window.parent.postMessage({ type: MP_SLIDE_CHANGED, slideIndex }, '*');
  }, [slideIndex]);

  const current = slides[clampIndex(slideIndex, total)];
  const SlideComponent = current?.component;
  const freezeAnimations = new URLSearchParams(window.location.search).has(
    'freezeAnimations'
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      {/* Cross-dissolve: `mode="sync"` keeps BOTH slides mounted and stacked for
           the whole transition. The incoming slide fades in on top while the
           outgoing one holds full opacity underneath, so something is always
           fully covering the stage and the background never shows through
           mid-transition (no white or black flash). The outgoing slide only
           unmounts after the incoming one is completely opaque, and it keeps
           its settled state while it waits — AnimatePresence preserves the
           mounted instance rather than remounting it. */}
      <AnimatePresence initial={!freezeAnimations} mode="sync">
        <motion.div
          key={slideIndex}
          className="absolute inset-0"
          initial={freezeAnimations ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={
          freezeAnimations ?
          undefined :
          {
            opacity: 0,
            transition: { duration: 0.1, delay: DISSOLVE_SECONDS }
          }
          }
          transition={{ duration: DISSOLVE_SECONDS, ease: 'easeInOut' }}>
          
          {SlideComponent ? <SlideComponent /> : null}
        </motion.div>
      </AnimatePresence>
    </div>);

}

function clampIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(total - 1, Math.max(0, index));
}