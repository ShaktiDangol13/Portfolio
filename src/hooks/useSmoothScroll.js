import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { setLenis } from '../utils/scrollStore.js';
import { getReducedMotion } from './useReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling wired into the GSAP ticker so scroll position and
 * ScrollTrigger always resolve in the same frame.
 */
export function useSmoothScroll({ enabled = true } = {}) {
  useEffect(() => {
    // Touch devices use native scrolling; desktop wheel smoothing stays optional.
    if (!enabled || getReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return undefined;

    const lenis = new Lenis({
      lerp: 0.095,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    setLenis(lenis);

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const fontsReady = document.fonts?.ready?.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      fontsReady?.catch(() => {});
      gsap.ticker.remove(raf);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      setLenis(null);
    };
  }, [enabled]);
}
