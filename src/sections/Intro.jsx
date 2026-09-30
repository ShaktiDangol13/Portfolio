import portrait from '../../images/WhatsApp Image 2026-09-30 at 12.36.31 AM.jpeg';
import { useLayoutEffect, useRef } from 'react';
import { revealWords } from '../animations/textReveal.js';
import { useReady } from '../context/ReadyContext.jsx';

export default function Intro() {
  const ready = useReady();
  const headlineRef = useRef(null);

  useLayoutEffect(() => {
    if (!ready || !headlineRef.current) return undefined;
    const tween = revealWords(headlineRef.current, {
      start: 'top 78%',
      end: 'bottom 60%',
      inactive: 0.14,
      stagger: 0.05,
    });
    return () => tween?.scrollTrigger?.kill();
  }, [ready]);

  return (
    <section className="section intro theme-light" id="intro" aria-labelledby="intro-title">
      <div className="shell">
        <div className="intro__grid">
          <div className="intro__aside" data-reveal>
            <span className="label">
              <span className="label__dot" />
              01 / About my work
            </span>
            <figure className="intro__portrait">
              <img src={portrait} alt="Portrait of Shakti Dangol" width="1280" height="1280" loading="lazy" decoding="async" />
              <figcaption>SHAKTI DANGOL <span>QA intern · Higain Labs</span></figcaption>
            </figure>
          </div>

          <div className="intro__body">
            <h2 className="lead intro__headline" id="intro-title" ref={headlineRef}>
              I test digital products across the interface, API and database — finding problems
              before they reach users.
            </h2>

            <div className="intro__support">
              <p className="body-lg" data-reveal>
                Software QA intern at Higain Labs with hands-on experience in manual testing, functional testing,
                regression testing, API validation and database validation.
              </p>
              <p className="body-lg" data-reveal>
                Previous development experience helps me understand what happens beyond the
                interface — from HTTP requests and authentication to backend behavior and database
                changes.
              </p>
            </div>
          </div>
        </div>

        <div className="rule" data-reveal="rule" />
      </div>
    </section>
  );
}
