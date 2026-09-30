import { gsap, ScrollTrigger, EASE_OUT_EXPO } from './gsapSetup.js';
import { splitWords } from '../utils/split.js';

/**
 * Word-by-word scroll reveal (opacity + slight blur), used for the big
 * editorial statements. Returns the created tween so callers can kill it.
 */
export function revealWords(element, options = {}) {
  if (!element) return null;
  const words = splitWords(element);
  if (!words.length) return null;

  const {
    trigger = element,
    start = 'top 82%',
    end = 'bottom 55%',
    inactive = 0.14,
    scrub = 0.6,
    y = 18,
    stagger = 0.06,
  } = options;

  gsap.set(words, { opacity: inactive, y });

  return gsap.to(words, {
    opacity: 1,
    y: 0,
    ease: 'none',
    stagger,
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
    },
  });
}

/** Characters rising out of their clipping mask — entrance style reveal. */
export function revealLines(elements, options = {}) {
  const { trigger, delay = 0, duration = 1.1, stagger = 0.08 } = options;
  gsap.set(elements, { yPercent: 115, opacity: 0 });
  return gsap.to(elements, {
    yPercent: 0,
    opacity: 1,
    duration,
    delay,
    stagger,
    ease: EASE_OUT_EXPO,
    scrollTrigger: trigger ? { trigger, start: 'top 80%' } : undefined,
  });
}

/** Generic container reveal: children translate up with a stagger. */
export function revealGroup(container, options = {}) {
  if (!container) return null;
  const targets = options.targets || container.children;
  const { y = 34, delay = 0, duration = 1, stagger = 0.07, trigger } = options;

  return gsap.from(targets, {
    y,
    opacity: 0,
    duration,
    delay,
    stagger,
    ease: EASE_OUT_EXPO,
    scrollTrigger: trigger ? { trigger, start: 'top 82%', once: true } : undefined,
  });
}

/** Media reveal: clipped wrapper + scale(1.08) → 1, the classic premium move. */
export function revealMedia(wrapper, media, options = {}) {
  if (!wrapper || !media) return null;
  const { trigger = wrapper, start = 'top 85%' } = options;

  gsap.set(wrapper, { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set(media, { scale: 1.12, yPercent: 8 });

  const tl = gsap.timeline({
    scrollTrigger: { trigger, start, once: true },
  });

  tl.to(wrapper, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: EASE_OUT_EXPO }, 0)
    .to(media, { scale: 1, yPercent: 0, duration: 1.5, ease: EASE_OUT_EXPO }, 0)
    .add(() => {
      wrapper.style.clipPath = '';
    });

  return tl;
}

/** Scroll-scrubbed horizontal rule (line grows from left to right). */
export function revealRule(rule, options = {}) {
  if (!rule) return null;
  gsap.set(rule, { scaleX: 0 });
  return gsap.to(rule, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: rule,
      start: 'top 92%',
      end: 'top 55%',
      scrub: 0.5,
      ...options.scrollTrigger,
    },
  });
}

export function killTriggersIn(scope) {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (scope && trigger.trigger && scope.contains(trigger.trigger)) trigger.kill();
  });
}
