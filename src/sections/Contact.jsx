import portrait from '../../images/WhatsApp Image 2026-09-30 at 12.36.31 AM.jpeg';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { onFrame } from '../animations/loop.js';
import { lerp, clamp } from '../utils/math.js';
import { splitChars } from '../utils/split.js';
import { usePointerPosition } from '../hooks/usePointerPosition.js';
import { useMediaQuery, useReducedMotion } from '../hooks/useReducedMotion.js';
import { useReady } from '../context/ReadyContext.jsx';
import { contact, contactActions } from '../data/contact.js';

const LINES = ["LET'S MAKE", 'SOFTWARE BETTER.'];

export default function Contact() {
  const ready = useReady();
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const pointerRef = useRef({ x: 0, y: 0 });
  const stageRef = useRef(null);

  usePointerPosition(pointerRef, { enabled: ready && !reduced && finePointer, lerpFactor: 0.07 });

  useLayoutEffect(() => {
    if (!stageRef.current) return undefined;
    const hosts = Array.from(stageRef.current.querySelectorAll('.contact__line'));
    const slots = hosts.flatMap((host) =>
      splitChars(host, { slot: true }).map((char) => char.parentElement)
    );
    return undefined;
  }, []);

  /* Individual letters respond to the pointer with staggered depth. */
  useEffect(() => {
    if (!ready || reduced || !finePointer || !stageRef.current) return undefined;

    const hosts = Array.from(stageRef.current.querySelectorAll('.contact__line'));
    const chars = hosts.flatMap((host) => Array.from(host.querySelectorAll('.split-char')));
    const state = chars.map(() => ({ x: 0, y: 0 }));

    const unsubscribe = onFrame((_time, dt) => {
      const { x, y } = pointerRef.current;
      const ease = clamp(0, 1, Math.min(dt * 60 * 0.16, 1));

      chars.forEach((char, index) => {
        const wave = 0.55 + (index % 5) * 0.28;
        const depthX = x * 46 * wave;
        const depthY = y * 34 * wave;

        state[index].x = lerp(state[index].x, depthX, ease);
        state[index].y = lerp(state[index].y, depthY, ease);

        char.style.transform = `translate3d(${state[index].x.toFixed(2)}px, ${state[index].y.toFixed(
          2
        )}px, 0)`;
      });
    });

    return () => {
      unsubscribe();
      chars.forEach((char) => {
        char.style.transform = '';
      });
    };
  }, [ready, reduced, finePointer]);

  return (
    <section className="section contact theme-green" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <span className="label" data-reveal>
          <span className="label__dot" />
          17 / Contact
        </span>

        <h2 className="contact__title" id="contact-title" data-reveal ref={stageRef}>
          {LINES.map((line) => (
            <span className="contact__line" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <div className="contact__grid">
          <div className="contact__copy" data-reveal>
            <img className="contact__portrait" src={portrait} alt="Shakti Dangol" width="1280" height="1280" loading="lazy" />
            <p className="body-lg">Looking for Junior Software QA opportunities and teams that care about product quality.</p>
          </div>

          <ul className="contact__actions" data-reveal="stagger">
            {contactActions.map((action) => (
              <li key={action.key}>
                <a
                  className="btn btn--outline"
                  href={action.href}
                  data-cursor="OPEN"
                  {...(action.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  {...(action.download ? { download: '' } : {})}
                >
                  <span className="btn__label">{action.label}</span>
                  <span className="btn__arrow" aria-hidden="true">
                    {action.external ? '↗' : action.download ? '↓' : '→'}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="contact__note mono" data-reveal>
          <a href={`mailto:${contact.email}`}>{contact.email}</a> · {contact.location}
          <span className="contact__phone"><a href={`tel:${contact.phone}`}>{contact.phone}</a></span>
        </p>
      </div>
    </section>
  );
}
