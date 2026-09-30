import { getReducedMotion } from '../hooks/useReducedMotion.js';

let lenisInstance = null;

export function setLenis(instance) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToTarget(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) {
    if (typeof target === 'string' && target.startsWith('#') && !['/', '/index.html'].includes(window.location.pathname)) {
      window.location.assign(`/${target}`);
    }
    return;
  }

  const behavior = options.smooth === false || getReducedMotion() ? 'auto' : 'smooth';
  const lenis = getLenis();

  if (lenis && !getReducedMotion()) {
    lenis.scrollTo(el, { offset: options.offset ?? 0, duration: options.duration ?? 1.2 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + (options.offset ?? 0);
    window.scrollTo({ top, behavior });
  }
}
