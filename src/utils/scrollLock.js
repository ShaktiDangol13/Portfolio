import { getLenis } from './scrollStore.js';

/*
 * Centralised scroll locking.
 * Keeps html + body overflow in sync (needed because Lenis scrolls the
 * documentElement) and stops Lenis while locked. Locks are reference-counted
 * by id so the preloader and the mobile menu never unlock each other.
 */
const holders = new Set();

function apply() {
  const locked = holders.size > 0;
  document.documentElement.classList.toggle('is-locked', locked);
  document.body.classList.toggle('is-locked', locked);

  const lenis = getLenis();
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export function lockScroll(id) {
  holders.add(id);
  apply();
}

export function unlockScroll(id) {
  holders.delete(id);
  apply();
}
