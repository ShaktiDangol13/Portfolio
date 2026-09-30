import { useEffect } from 'react';
import { onFrame } from '../animations/loop.js';

/** Subscribe a component to the single shared animation loop. */
export function useFrame(callback, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    return onFrame(callback);
  }, [callback, enabled]);
}
