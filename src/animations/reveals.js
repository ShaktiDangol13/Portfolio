import { gsap, ScrollTrigger, EASE_OUT_EXPO, REDUCED } from './gsapSetup.js';
import { splitChars } from '../utils/split.js';

/**
 * Declarative scroll reveals.
 * Markup drives the motion language via data-reveal attributes, so sections
 * stay declarative instead of each carrying bespoke animation code.
 *
 * data-reveal            → translate up + fade
 * data-reveal="rule"     → horizontal line grows from the left
 * data-reveal="clip"     → content unclips from the bottom
 * data-reveal="media"    → wrapper unclips, media settles from scale(1.1)
 * data-reveal="stagger"  → direct children stagger in
 * data-reveal="chars"    → characters rise out of their mask
 * data-reveal="scale"    → subtle scale-in
 */
export function initReveals(scope) {
  const reduced = REDUCED();
  const ctx = gsap.context(() => {
    const nodes = gsap.utils.toArray('[data-reveal]', scope);

    nodes.forEach((node) => {
      const type = node.dataset.reveal || 'up';

      if (reduced) {
        gsap.set(node, { clearProps: 'all', opacity: 1, y: 0, scaleX: 1, scale: 1 });
        return;
      }

      if (type === 'rule') {
        gsap.set(node, { scaleX: 0, transformOrigin: 'left center' });
        gsap.to(node, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: node, start: 'top 95%', end: 'top 60%', scrub: 0.4 },
        });
        return;
      }

      if (type === 'media') {
        const media = node.querySelector('[data-reveal-media]') || node.firstElementChild;
        gsap.set(node, { clipPath: 'inset(100% 0% 0% 0%)' });
        if (media) gsap.set(media, { scale: 1.1, yPercent: 6 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: node, start: 'top 86%', once: true } });
        tl.to(node, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: EASE_OUT_EXPO }, 0);
        if (media) tl.to(media, { scale: 1, yPercent: 0, duration: 1.4, ease: EASE_OUT_EXPO }, 0);
        return;
      }

      if (type === 'chars') {
        const chars = splitChars(node);
        gsap.set(chars, { yPercent: 118 });
        gsap.to(chars, {
          yPercent: 0,
          duration: 1.1,
          ease: EASE_OUT_EXPO,
          stagger: 0.028,
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        });
        return;
      }

      if (type === 'stagger') {
        const children = Array.from(node.children);
        gsap.set(children, { y: 40, opacity: 0 });
        gsap.to(children, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: EASE_OUT_EXPO,
          stagger: 0.07,
          scrollTrigger: { trigger: node, start: 'top 84%', once: true },
        });
        return;
      }

      if (type === 'scale') {
        gsap.set(node, { scale: 0.94, opacity: 0 });
        gsap.to(node, {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: EASE_OUT_EXPO,
          scrollTrigger: { trigger: node, start: 'top 86%', once: true },
        });
        return;
      }

      if (type === 'clip') {
        gsap.set(node, { clipPath: 'inset(0% 0% 100% 0%)', y: 24 });
        gsap.to(node, {
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          duration: 1.1,
          ease: EASE_OUT_EXPO,
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        });
        return;
      }

      gsap.set(node, { y: 44, opacity: 0 });
      gsap.to(node, {
        y: 0,
        opacity: 1,
        duration: 1.05,
        ease: EASE_OUT_EXPO,
        scrollTrigger: { trigger: node, start: 'top 88%', once: true },
      });
    });
  }, scope);

  ScrollTrigger.refresh();
  return ctx;
}
