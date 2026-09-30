import { useLayoutEffect, useRef } from 'react';
import { gsap, EASE_OUT_EXPO, REDUCED } from '../animations/gsapSetup.js';
import { useReady } from '../context/ReadyContext.jsx';
import { dbDemo } from '../data/artifacts.js';

export default function DatabaseTesting() {
  const ready = useReady();
  const rootRef = useRef(null);
  const codeRef = useRef(null);

  useLayoutEffect(() => {
    if (!ready || !rootRef.current || !codeRef.current) return undefined;

    const node = codeRef.current;
    const fullText = dbDemo.query.join('\n');
    const rows = Array.from(rootRef.current.querySelectorAll('[data-db-row]'));
    const caption = rootRef.current.querySelector('[data-db-caption]');

    if (REDUCED()) {
      node.textContent = fullText;
      gsap.set([...rows, caption].filter(Boolean), { clearProps: 'all', opacity: 1 });
      return undefined;
    }

    node.textContent = '';
    gsap.set(rows, { opacity: 0, y: 12 });
    if (caption) gsap.set(caption, { opacity: 0 });

    const state = { count: 0 };
    const tl = gsap.timeline({
      scrollTrigger: { trigger: rootRef.current.querySelector('.db__editor'), start: 'top 72%', once: true },
    });

    tl.to(state, {
      count: fullText.length,
      duration: 1.7,
      ease: 'none',
      onUpdate: () => {
        node.textContent = fullText.slice(0, Math.floor(state.count));
      },
    })
      .to(caption, { opacity: 1, duration: 0.4, ease: EASE_OUT_EXPO })
      .to(
        rows,
        { opacity: 1, y: 0, duration: 0.6, ease: EASE_OUT_EXPO, stagger: 0.1 },
        '-=0.1'
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [ready]);

  return (
    <section className="section db theme-light" id="database" aria-labelledby="db-title" ref={rootRef}>
      <div className="shell">
        <div className="db__grid">
          <div className="db__editor" data-cursor="OPEN">
            <div className="terminal__bar">
              <span className="chip chip--accent">{dbDemo.badge}</span>
              <span className="terminal__caption">query.sql</span>
            </div>
            <pre className="db__code">
              <code ref={codeRef} />
            </pre>

            <div className="db__result">
              <p className="db__caption" data-db-caption>
                Result set
              </p>
              <div className="db__table-wrap">
                <table className="db__table">
                  <thead>
                    <tr>
                      {dbDemo.columns.map((column) => (
                        <th key={column} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dbDemo.rows.map((row) => (
                      <tr key={row[0]} data-db-row>
                        {row.map((cell, i) => (
                          <td key={`${cell}-${i}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="db__copy">
            <span className="label" data-reveal>
              <span className="label__dot" />
              08 / Database testing
            </span>
            <h2 className="section-title" id="db-title" data-reveal>
              FOLLOW
              <br />
              THE <span className="heading-lime">DATA.</span>
            </h2>
            <p className="db__statement" data-reveal>
              {dbDemo.statement}
            </p>

            <ul className="db__checks" data-reveal="stagger">
              {dbDemo.checks.map((check) => (
                <li key={check} className="mono">
                  {check}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
