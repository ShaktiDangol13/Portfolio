import { useLayoutEffect, useRef } from 'react';
import { gsap, REDUCED } from '../animations/gsapSetup.js';
import { useReady } from '../context/ReadyContext.jsx';

const LINES = ['QUALITY IS NOT', 'JUST FINDING BUGS.', "IT'S UNDERSTANDING", 'WHY THEY HAPPEN.'];

const SUPPORT = [
  'Interface behaviour',
  'Network requests',
  'API contracts',
  'Database records',
];

/**
 * Editorial statement. The first sentence starts oversized and drifts away
 * while the answer enters and the supporting QA layers surface around it.
 */
export default function Philosophy() {
  const ready = useReady();
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!ready || !rootRef.current || REDUCED()) return undefined;

    const [first, second] = rootRef.current.querySelectorAll('.philo__block');
    const support = rootRef.current.querySelectorAll('.philo__support-item');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: '+=120%',
        scrub: 0.7,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.fromTo(
      first,
      { scale: 1, opacity: 1, yPercent: 0 },
      { scale: 0.72, opacity: 0, yPercent: -22, ease: 'none' },
      0
    )
      .fromTo(
        second,
        { scale: 1.35, opacity: 0, yPercent: 26 },
        { scale: 1, opacity: 1, yPercent: 0, ease: 'none' },
        0.1
      )
      .fromTo(
        support,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, stagger: 0.05, ease: 'none' },
        0.5
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [ready]);

  return (
    <section className="philo theme-green" id="philosophy" aria-labelledby="philosophy-title" ref={rootRef}>
      <div className="philo__inner shell">
        <span className="label philo__label">
          <span className="label__dot" />
          14 / Philosophy
        </span>

        <h2 className="sr-only" id="philosophy-title">
          Quality is not just finding bugs. It&apos;s understanding why they happen.
        </h2>

        <div className="philo__stage" aria-hidden="true">
          <p className="philo__block philo__block--first">
            QUALITY IS NOT
            <br />
            JUST FINDING BUGS.
          </p>
          <p className="philo__block philo__block--second">
            IT&apos;S UNDERSTANDING
            <br />
            WHY THEY HAPPEN.
          </p>
        </div>

        <ul className="philo__support" aria-hidden="true">
          {SUPPORT.map((item) => (
            <li className="philo__support-item" key={item}>
              {item}
            </li>
          ))}
        </ul>

        <noscript>
          <p className="philo__fallback">
            Quality is not just finding bugs. It&apos;s understanding why they happen.
          </p>
        </noscript>
      </div>
    </section>
  );
}
