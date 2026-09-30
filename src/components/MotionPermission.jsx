import { useEffect, useState } from 'react';
import { supportsMotionPermission, supportsOrientation } from '../hooks/useDeviceOrientation.js';
import { getReducedMotion } from '../hooks/useReducedMotion.js';

const STORAGE_KEY = 'sd-motion-choice';

/**
 * Tasteful tilt-permission card. Shown only on touch devices that can
 * actually report orientation; skipping (or denying) leaves the site
 * completely functional. The orientation listener itself lives in App so
 * motion survives after this card is dismissed.
 */
export default function MotionPermission({ onRequest, onDecision }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getReducedMotion() || !supportsOrientation()) return undefined;
    /* Only touch devices can tilt — never show this on a desktop pointer. */
    if (!window.matchMedia?.('(pointer: coarse)').matches) return undefined;
    if (window.sessionStorage.getItem(STORAGE_KEY)) return undefined;

    const timer = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const decide = async (choice) => {
    window.sessionStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);

    if (choice === 'enable') {
      const granted = await onRequest();
      onDecision?.(granted ? 'granted' : 'denied');
    } else {
      onDecision?.('skipped');
    }
  };

  if (!visible) return null;

  return (
    <div className="motion-permission" role="dialog" aria-label="Motion permission">
      <div className="motion-permission__copy">
        <span className="label">
          <span className="label__dot" />
          Motion
        </span>
        <p className="motion-permission__title">THIS SITE MOVES WITH YOU.</p>
        <p className="motion-permission__hint">
          {supportsMotionPermission()
            ? 'Allow device tilt to move the interface. Nothing is stored and you can skip this.'
            : 'Tilt your device to shift the interface. Nothing is stored and you can skip this.'}
        </p>
      </div>
      <div className="motion-permission__actions">
        <button type="button" className="btn btn--solid" onClick={() => decide('enable')}>
          ENABLE MOTION
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => decide('skip')}>
          SKIP
        </button>
      </div>
    </div>
  );
}
