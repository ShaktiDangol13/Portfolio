import { useLayoutEffect, useRef } from 'react';
import { gsap, EASE_OUT_EXPO, REDUCED } from '../animations/gsapSetup.js';
import { useReady } from '../context/ReadyContext.jsx';
import { apiDemo } from '../data/artifacts.js';

export default function APITesting() {
  const ready = useReady();
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!ready || !rootRef.current) return undefined;

    const lines = Array.from(rootRef.current.querySelectorAll('[data-api-line]'));
    if (!lines.length) return undefined;

    if (REDUCED()) {
      gsap.set(lines, { clearProps: 'all', opacity: 1, y: 0 });
      return undefined;
    }

    gsap.set(lines, { opacity: 0, y: 14 });
    const tween = gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: EASE_OUT_EXPO,
      stagger: 0.09,
      scrollTrigger: { trigger: rootRef.current.querySelector('.api__terminal'), start: 'top 74%', once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ready]);

  return (
    <section className="section api" id="api" aria-labelledby="api-title" ref={rootRef}>
      <div className="shell">
        <div className="api__grid">
          <div className="api__copy">
            <span className="label" data-reveal>
              <span className="label__dot" />
              07 / API testing
            </span>
            <h2 className="section-title" id="api-title" data-reveal="chars">
              BEYOND
              <br />
              THE UI.
            </h2>
            <p className="api__statement" data-reveal>
              Sometimes the bug isn&apos;t on the screen.
            </p>

            <ul className="api__checks" data-reveal="stagger">
              {apiDemo.checks.map((check) => (
                <li key={check}>
                  <span className="api__check-mark" aria-hidden="true">
                    →
                  </span>
                  {check}
                </li>
              ))}
            </ul>
          </div>

          <div className="api__terminal" data-cursor="OPEN">
            <div className="terminal__bar">
              <span className="chip chip--accent">{apiDemo.badge}</span>
              <span className="terminal__dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>

            <div className="terminal__group">
              <p className="terminal__caption" data-api-line>
                REQUEST
              </p>
              <p className="terminal__line terminal__line--accent" data-api-line>
                {apiDemo.request[0]}
              </p>
              <p className="terminal__caption" data-api-line>
                HEADERS
              </p>
              {apiDemo.headers.map((header) => (
                <p className="terminal__line" key={header} data-api-line>
                  {header}
                </p>
              ))}
              <p className="terminal__caption" data-api-line>
                BODY
              </p>
              <pre className="terminal__code" data-api-line>
                <code>{apiDemo.body.join('\n')}</code>
              </pre>
            </div>

            <div className="terminal__group">
              <p className="terminal__caption" data-api-line>
                RESPONSE — SUCCESS
              </p>
              {apiDemo.success.map((line, i) => (
                <p
                  className={`terminal__line ${i === 0 ? 'terminal__line--ok' : ''}`}
                  key={line}
                  data-api-line
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="terminal__group">
              <p className="terminal__caption" data-api-line>
                RESPONSE — FAILURE
              </p>
              {apiDemo.failure.map((line, i) => (
                <p
                  className={`terminal__line ${i === 0 ? 'terminal__line--error' : ''}`}
                  key={line}
                  data-api-line
                >
                  {line}
                </p>
              ))}
              <p className="terminal__caret" data-api-line aria-hidden="true">
                <span />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
