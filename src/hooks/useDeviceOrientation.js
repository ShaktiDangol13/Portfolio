import { useCallback, useEffect, useRef, useState } from 'react';
import { onFrame } from '../animations/loop.js';
import { clamp } from '../utils/math.js';

export function supportsMotionPermission() {
  return typeof window !== 'undefined' && typeof window.DeviceOrientationEvent?.requestPermission === 'function';
}

export function supportsOrientation() {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
}

/**
 * Device tilt → normalised, smoothed motion values (-0.5 … 0.5).
 * gamma drives x, beta drives y. Safe on devices that never grant permission.
 */
export function useDeviceOrientation({ enabled = false, lerpFactor = 0.08 } = {}) {
  const [status, setStatus] = useState('idle'); // idle | granted | denied | unsupported
  const values = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const request = useCallback(async () => {
    if (!supportsOrientation()) {
      setStatus('unsupported');
      return false;
    }
    if (supportsMotionPermission()) {
      try {
        const result = await window.DeviceOrientationEvent.requestPermission();
        if (result !== 'granted') {
          setStatus('denied');
          return false;
        }
      } catch {
        setStatus('denied');
        return false;
      }
    }
    setStatus('granted');
    return true;
  }, []);

  useEffect(() => {
    if (!enabled || status !== 'granted') return undefined;

    const onOrientation = (event) => {
      const gamma = clamp(-45, 45, event.gamma ?? 0);
      const beta = clamp(-45, 45, (event.beta ?? 0) - 45);
      values.current.targetX = gamma / 90;
      values.current.targetY = beta / 90;
    };

    window.addEventListener('deviceorientation', onOrientation, { passive: true });

    const unsubscribe = onFrame((_time, dt) => {
      const speed = Math.min(dt * 60 * lerpFactor * 10, 1);
      values.current.x += (values.current.targetX - values.current.x) * speed;
      values.current.y += (values.current.targetY - values.current.y) * speed;
    });

    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      unsubscribe();
    };
  }, [enabled, status, lerpFactor]);

  return { status, request, values };
}
