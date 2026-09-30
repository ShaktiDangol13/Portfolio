import { useEffect, useRef } from 'react';
import { onFrame } from '../animations/loop.js';

/**
 * Normalised pointer position (-0.5 → 0.5) with interpolation.
 * Values are written into the provided ref object, never snapped.
 */
export function usePointerPosition(ref, { lerpFactor = 0.09, enabled = true } = {}) {
  const target = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;

    ref.current = ref.current || { x: 0, y: 0 };

    const onMove = (event) => {
      target.current.x = event.clientX / window.innerWidth - 0.5;
      target.current.y = event.clientY / window.innerHeight - 0.5;
      target.current.active = true;
    };

    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
      target.current.active = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    const unsubscribe = onFrame((_time, dt) => {
      const speed = Math.min(dt * 60 * lerpFactor * 10, 1);
      ref.current.x += (target.current.x - ref.current.x) * speed;
      ref.current.y += (target.current.y - ref.current.y) * speed;
    });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      unsubscribe();
    };
  }, [enabled, lerpFactor, ref]);
}
