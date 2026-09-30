import { useEffect, useRef, useState } from 'react';
import { gsap, EASE_OUT_EXPO, REDUCED } from '../animations/gsapSetup.js';
import { onFrame } from '../animations/loop.js';
import { clamp, lerp } from '../utils/math.js';
import { splitChars } from '../utils/split.js';
import { lockScroll, unlockScroll } from '../utils/scrollLock.js';
import { contact } from '../data/contact.js';

const MIN_DURATION = 1700;
const HARD_STOP = 5000;

function collectAssets() {
  const tasks = [];

  if (document.fonts?.ready) tasks.push(document.fonts.ready);

  if (document.readyState !== 'complete') {
    tasks.push(
      new Promise((resolve) => {
        window.addEventListener('load', resolve, { once: true });
      })
    );
  }

  document.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    tasks.push(
      new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      })
    );
  });

  return tasks;
}

/**
 * Full-screen loader.
 * Progress = min(time floor, real asset completion), then visually
 * interpolated so the number never ticks in fixed steps.
 */
export default function Preloader({ onReady }) {
  const rootRef = useRef(null);
  const nameRef = useRef(null);
  const numberRef = useRef(null);
  const barRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    lockScroll('loader');
    return () => unlockScroll('loader');
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const name = nameRef.current;
    const number = numberRef.current;
    const bar = barRef.current;
    if (!root || !name || !number || !bar) return undefined;

    const chars = splitChars(name, { slot: true });
    const tasks = collectAssets();
    const total = Math.max(tasks.length, 1);
    let resolved = 0;

    const mark = () => {
      resolved += 1;
    };
    tasks.forEach((task) => task.then(mark, mark));

    const startedAt = performance.now();
    const state = { target: 0, shown: 0 };
    let finished = false;
    let unsubscribe = null;
    let hardStopTimer = null;

    const finish = () => {
      if (finished) return;
      finished = true;
      if (unsubscribe) unsubscribe();
      if (hardStopTimer) window.clearTimeout(hardStopTimer);

      number.textContent = '100';
      bar.style.transform = 'scaleX(1)';

      if (REDUCED()) {
        gsap.set(root, { autoAlpha: 0 });
        unlockScroll('loader');
        setHidden(true);
        onReady?.();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          unlockScroll('loader');
          setHidden(true);
          onReady?.();
        },
      });

      tl.to({}, { duration: 0.18 })
        // the name separates
        .to(
          chars,
          {
            yPercent: -130,
            opacity: 0,
            duration: 0.85,
            ease: EASE_OUT_EXPO,
            stagger: { each: 0.028, from: 'center' },
          },
          0
        )
        .to('.preloader__meta', { opacity: 0, y: -14, duration: 0.5, ease: 'power2.out' }, 0)
        .to('.preloader__bar', { scaleX: 0, transformOrigin: 'right center', duration: 0.6, ease: 'power3.inOut' }, 0.15)
        .to('.preloader__number', { yPercent: -40, opacity: 0, duration: 0.6, ease: EASE_OUT_EXPO }, 0.1)
        // loader exits upward, revealing the page beneath
        .to(root, { yPercent: -101, duration: 1.05, ease: EASE_OUT_EXPO }, 0.42);
    };

    unsubscribe = onFrame((_time, dt) => {
      if (finished) return;
      const elapsed = performance.now() - startedAt;
      const timeProgress = clamp(0, 1, elapsed / MIN_DURATION);
      const assetProgress = resolved / total;
      const progress = Math.min(timeProgress, assetProgress);

      state.target = Math.max(state.target, progress * 100);
      state.shown = lerp(state.shown, state.target, 1 - Math.exp(-7 * Math.max(dt, 0.001)));

      const display = state.shown >= 99.5 ? 100 : state.shown;
      number.textContent = String(Math.floor(display)).padStart(2, '0');
      bar.style.transform = `scaleX(${(display / 100).toFixed(4)})`;

      if (display >= 100 && progress >= 1) finish();
    });

    hardStopTimer = window.setTimeout(() => {
      resolved = total;
      finish();
    }, HARD_STOP);

    return () => {
      if (unsubscribe) unsubscribe();
      if (hardStopTimer) window.clearTimeout(hardStopTimer);
      document.body.classList.remove('is-loading');
    };
  }, [onReady]);

  if (hidden) return null;

  return (
    <div className="preloader" ref={rootRef} role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="preloader__inner">
        <div className="preloader__top">
          <span className="preloader__meta label">Loading</span>
          <span className="preloader__meta label">{contact.location}</span>
        </div>

        <div className="preloader__center">
          <h1 className="preloader__name" ref={nameRef}>
            SHAKTI DANGOL
          </h1>
        </div>

        <div className="preloader__bottom">
          <span className="preloader__number" ref={numberRef}>
            00
          </span>
          <div className="preloader__bar" ref={barRef} aria-hidden="true" />
          <span className="preloader__meta label">Junior Software QA Engineer</span>
        </div>
      </div>
    </div>
  );
}
