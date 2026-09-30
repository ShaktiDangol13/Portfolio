import { useEffect, useRef, useState } from 'react';
import { getReducedMotion } from '../hooks/useReducedMotion.js';
import { matrixColumns, matrixDemoValues, matrixRows } from '../data/toolbox.js';

const STATES = ['PASS', 'FAIL', 'CHECKING'];

/** Decorative demonstration matrix — not real project results. */
export default function TestingMatrix() {
  const rootRef = useRef(null);
  const [values, setValues] = useState(matrixDemoValues);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting && !getReducedMotion()),
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return undefined;

    const id = window.setInterval(() => {
      setValues((current) => {
        const next = current.map((row) => [...row]);
        const rowIndex = Math.floor(Math.random() * next.length);
        const colIndex = Math.floor(Math.random() * next[rowIndex].length);
        const options = STATES.filter((state) => state !== next[rowIndex][colIndex]);
        next[rowIndex][colIndex] = options[Math.floor(Math.random() * options.length)];
        return next;
      });
    }, 1400);

    return () => window.clearInterval(id);
  }, [running]);

  return (
    <section className="section section--tight matrix theme-light" id="matrix" aria-labelledby="matrix-title" ref={rootRef}>
      <div className="shell">
        <div className="matrix__head">
          <span className="label" data-reveal>
            <span className="label__dot" />
            15 / Coverage view
          </span>
          <h2 className="section-title" id="matrix-title" data-reveal>
            TESTING <span className="heading-lime">MATRIX</span>
          </h2>
          <p className="matrix__disclaimer mono" data-reveal>
            DEMO CONTENT — ILLUSTRATIVE ONLY, NOT REAL PROJECT RESULTS
          </p>
        </div>

        <div className="matrix__wrap" data-reveal="clip">
          <table className="matrix__table">
            <caption className="sr-only">
              Demonstration testing matrix comparing UI, API and database checks
            </caption>
            <thead>
              <tr>
                <th scope="col" className="matrix__corner">
                  SCENARIO
                </th>
                {matrixColumns.map((column) => (
                  <th scope="col" key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row, rowIndex) => (
                <tr key={row}>
                  <th scope="row">{row}</th>
                  {values[rowIndex].map((value, colIndex) => (
                    <td key={`${row}-${matrixColumns[colIndex]}`}>
                      <span
                        className={`matrix__cell is-${value.toLowerCase()}`}
                        aria-label={value}
                      >
                        {value}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
