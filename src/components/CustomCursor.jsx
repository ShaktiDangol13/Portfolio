import { useEffect, useRef, useState } from 'react';
import { onFrame } from '../animations/loop.js';
import { clamp, lerp } from '../utils/math.js';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/**
 * Context-sensitive cursor: a small dot, a trailing ring, and a label that
 * appears over interactive content (VIEW / OPEN / EXPLORE / DRAG).
 * Disabled entirely on touch devices.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const labelTextRef = useRef('');
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const media = window.matchMedia(FINE_POINTER);
    setEnabled(media.matches);

    const onChange = (event) => setEnabled(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    document.body.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    const labelEl = labelRef.current;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };
    const ringPos = { x: target.x, y: target.y };
    let visible = false;
    let overLink = false;
    let colorScope = null;

    const updateColors = (element) => {
      const scope = element?.closest('.theme-light, .theme-green') || document.documentElement;
      if (scope === colorScope) return;
      colorScope = scope;
      const colors = getComputedStyle(scope);
      const cursorColor = scope.classList.contains('theme-light') ? '#cdf564' : colors.getPropertyValue('--accent');
      dot.style.backgroundColor = cursorColor;
      ring.style.borderColor = cursorColor;
      labelEl.style.color = colors.getPropertyValue('--text-primary');
    };

    const onScroll = () => {
      if (visible) updateColors(document.elementFromPoint(target.x, target.y));
    };

    const applyLabel = (next) => {
      if (labelTextRef.current === next) return;
      labelTextRef.current = next;
      setLabel(next);
    };

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      updateColors(event.target instanceof Element ? event.target : null);

      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      const hit = event.target instanceof Element ? event.target.closest('[data-cursor]') : null;
      const raw = hit?.getAttribute('data-cursor') || '';
      overLink = raw === 'link';
      applyLabel(overLink ? '' : raw);
      document.body.classList.toggle('is-cursor-active', Boolean(hit));
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      document.body.classList.remove('is-cursor-active');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    const unsubscribe = onFrame((_time, dt) => {
      const fast = Math.min(dt * 60 * 0.42, 1);
      const slow = Math.min(dt * 60 * 0.17, 1);

      pos.x = lerp(pos.x, target.x, fast);
      pos.y = lerp(pos.y, target.y, fast);
      ringPos.x = lerp(ringPos.x, target.x, slow);
      ringPos.y = lerp(ringPos.y, target.y, slow);

      const hasLabel = Boolean(labelTextRef.current);
      const scale = hasLabel ? 1.15 : overLink ? 1.3 : 1;

      dot.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(
        1
      )}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x.toFixed(1)}px, ${ringPos.y.toFixed(
        1
      )}px, 0) translate(-50%, -50%) scale(${clamp(0.5, 3, scale).toFixed(3)})`;

      if (labelEl) {
        labelEl.style.transform = `translate3d(${ringPos.x.toFixed(1)}px, ${ringPos.y.toFixed(
          1
        )}px, 0) translate(34px, 26px)`;
        labelEl.style.opacity = hasLabel ? '1' : '0';
      }
    });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      unsubscribe();
      document.body.classList.remove('is-cursor-active', 'has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor" aria-hidden="true">
      <span className="cursor__dot" ref={dotRef} />
      <span className="cursor__ring" ref={ringRef} />
      <span className="cursor__label" ref={labelRef}>
        {label}
      </span>
    </div>
  );
}
