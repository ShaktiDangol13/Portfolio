import gsap from 'gsap';

/*
 * Single shared animation loop.
 * Everything continuous (pointer smoothing, parallax writes, clock updates)
 * subscribes here so the page never runs several competing rAF callbacks.
 */
const subscribers = new Set();
let started = false;

function tick(time, deltaTime) {
  const dt = Math.min(deltaTime / 1000, 0.064);
  subscribers.forEach((fn) => {
    try {
      fn(time, dt);
    } catch (error) {
      console.error('[loop]', error);
    }
  });
}

function ensureRunning() {
  if (started) return;
  started = true;
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function onFrame(callback) {
  ensureRunning();
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}
