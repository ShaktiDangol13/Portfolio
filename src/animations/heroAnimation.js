import { gsap, ScrollTrigger, EASE_OUT_EXPO, REDUCED } from './gsapSetup.js';
import { splitChars } from '../utils/split.js';
import { clamp, mapRange } from '../utils/math.js';

/**
 * Hero typography.
 *
 * 1. Entrance — characters rise out of the line mask, staggered from the
 *    centre so the name assembles organically.
 * 2. Scroll — a cosine curve drives a per-character displacement, rotation,
 *    scale and fade on the *outer* slot, so entrance and scroll never write
 *    to the same transform.
 */
export function prepareHero(charsHosts) {
  return charsHosts.map((host) => {
    const chars = splitChars(host, { slot: true });
    return { host, chars, slots: chars.map((char) => char.parentElement) };
  });
}

export function heroEntrance(lines, { delay = 0 } = {}) {
  const reduced = REDUCED();
  const all = lines.flatMap((line) => line.chars);
  if (!all.length) return null;

  if (reduced) {
    gsap.set(all, { yPercent: 0, opacity: 1, rotate: 0 });
    return null;
  }

  gsap.set(all, { yPercent: 125, opacity: 0, rotate: 5 });

  return gsap.to(all, {
    yPercent: 0,
    opacity: 1,
    rotate: 0,
    duration: 1.4,
    delay,
    ease: EASE_OUT_EXPO,
    stagger: { each: 0.034, from: 'center' },
  });
}

export function heroScrollMotion(lines, trigger) {
  if (!trigger || REDUCED()) return undefined;

  const slots = lines.flatMap((line) => line.slots || []);
  if (!slots.length) return undefined;
  const total = slots.length;

  const state = { progress: 0 };

  return gsap.to(state, {
    progress: 1,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: () => {
        const progress = state.progress;
        slots.forEach((slot, i) => {
          const normalizedIndex = total > 1 ? i / (total - 1) : 0;
          const curve = Math.abs(Math.cos(normalizedIndex * Math.PI));

          // Mathematical curve: edges travel further than the centre.
          const initialY = -55 * curve;
          const currentY = initialY * progress;
          const rotation = mapRange(0, 1, -7, 7, curve) * progress;
          const scale = 1 - 0.07 * curve * progress;
          const fade = 1 - clamp(0, 1, mapRange(0.3, 1, 0, 1, progress)) * (0.3 + curve * 0.7);

          slot.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) rotate(${rotation.toFixed(
            2
          )}deg) scale(${scale.toFixed(4)})`;
          slot.style.opacity = clamp(0, 1, fade).toFixed(3);
        });
      },
    },
  });
}

export function heroMetaReveal(metaNodes) {
  if (!metaNodes.length || REDUCED()) return null;
  return gsap.from(metaNodes, {
    y: 24,
    opacity: 0,
    duration: 1.1,
    delay: 0.6,
    ease: EASE_OUT_EXPO,
    stagger: 0.08,
  });
}

export { ScrollTrigger };
