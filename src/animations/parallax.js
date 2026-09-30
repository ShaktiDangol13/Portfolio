import { clamp, lerp } from '../utils/math.js';

/**
 * Pointer / tilt / scroll parallax field.
 * Every object owns its own depth, so the field can mix shallow and deep
 * layers without a separate requestAnimationFrame per element.
 */
export class ParallaxField {
  constructor(items = [], options = {}) {
    this.lerpFactor = options.lerpFactor ?? 0.075;
    this.enabled = options.enabled ?? true;
    this.motion = options.motion;
    this.items = items
      .filter((item) => item && item.el)
      .map((item) => ({
        el: item.el,
        depth: item.depth ?? 0.3,
        tilt: item.tilt ?? 0,
        restX: item.restX ?? 0,
        restY: item.restY ?? 0,
        scrollDepth: item.scrollDepth ?? (item.depth ?? 0.3) * 1.4,
        x: 0,
        y: 0,
        scroll: 0,
        tx: 0,
        ty: 0,
        tScroll: 0,
      }));

    this.pointer = { x: 0, y: 0 };
    this.scrollProgress = 0;
  }

  setPointer(x, y) {
    this.pointer.x = x;
    this.pointer.y = y;
  }

  setScroll(progress) {
    this.scrollProgress = progress;
  }

  update(dt) {
    if (!this.enabled || !this.items.length) return;
    const ease = clamp(0, 1, Math.min(dt * 60 * this.lerpFactor * 10, 1));
    const motion = this.motion?.current || { x: 0, y: 0 };

    for (const item of this.items) {
      item.tx = (this.pointer.x + motion.x) * item.depth * 100 + item.restX;
      item.ty = (this.pointer.y + motion.y) * item.depth * 100 + item.restY;
      item.tScroll = this.scrollProgress * item.scrollDepth * -120;

      item.x = lerp(item.x, item.tx, ease);
      item.y = lerp(item.y, item.ty, ease);
      item.scroll = lerp(item.scroll, item.tScroll, ease);

      const rotate = item.tilt ? item.tilt * item.depth * 6 : 0;
      item.el.style.transform = `translate3d(${item.x.toFixed(2)}px, ${(item.y + item.scroll).toFixed(
        2
      )}px, 0) rotate(${rotate.toFixed(3)}deg)`;
    }
  }

  destroy() {
    this.items.forEach((item) => {
      item.el.style.transform = '';
    });
    this.items = [];
  }
}
