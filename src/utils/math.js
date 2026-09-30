export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function clamp(min, max, value) {
  return Math.min(max, Math.max(min, value));
}

export function mapRange(inMin, inMax, outMin, outMax, value) {
  const span = inMax - inMin;
  const t = span === 0 ? 0 : (value - inMin) / span;
  return outMin + clamp(0, 1, t) * (outMax - outMin);
}

export function normalize(value, min, max) {
  const span = max - min;
  return clamp(0, 1, span === 0 ? 0 : (value - min) / span);
}

/* Frame-rate independent smoothing (used by the shared animation loop). */
export function damp(current, target, lambda, dt) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function roundTo(value, decimals = 2) {
  const p = 10 ** decimals;
  return Math.round(value * p) / p;
}
