import { bugReport } from '../data/artifacts.js';

export default function BugReportDemo() {
  return (
    <section className="section section--tight artifacts" id="artifacts" aria-labelledby="bug-title">
      <div className="shell">
        <div className="artifacts__head">
          <span className="label" data-reveal>
            <span className="label__dot" />
            05 / Defect reporting
          </span>
          <h2 className="section-title" id="bug-title" data-reveal="chars">
            WRITTEN TO BE REPRODUCED
          </h2>
          <p className="body-lg artifacts__intro" data-reveal>
            A defect report should let someone else fail the same way, on the first try.
          </p>
        </div>

        <article className="bug" data-cursor="EXPLORE">
          <header className="bug__header" data-reveal>
            <span className="chip chip--accent">{bugReport.badge}</span>
            <span className="bug__id">{bugReport.id}</span>
          </header>

          <h3 className="bug__title" data-reveal>
            {bugReport.title}
          </h3>

          <div className="bug__facts" data-reveal="stagger">
            <div className="fact">
              <span className="fact__key">Environment</span>
              <span className="fact__value">{bugReport.environment}</span>
            </div>
            <div className="fact">
              <span className="fact__key">Severity</span>
              <span className="fact__value fact__value--warn">{bugReport.severity}</span>
            </div>
            <div className="fact">
              <span className="fact__key">Priority</span>
              <span className="fact__value fact__value--warn">{bugReport.priority}</span>
            </div>
          </div>

          <div className="bug__grid">
            <div className="bug__block" data-reveal>
              <h4 className="bug__block-title">Steps</h4>
              <ol className="bug__steps">
                {bugReport.steps.map((step, index) => (
                  <li key={step}>
                    <span className="bug__step-num">{String(index + 1).padStart(2, '0')}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bug__block" data-reveal>
              <h4 className="bug__block-title">Network</h4>
              <div className="terminal">
                <div className="terminal__row terminal__row--req">
                  <span className="terminal__prompt">→</span>
                  <span>{bugReport.request[0]}</span>
                </div>
                <div className="terminal__row terminal__row--res">{bugReport.request[1]}</div>
                <div className="terminal__row">{bugReport.response[0]}</div>
              </div>
            </div>

            <div className="bug__block bug__block--expect" data-reveal>
              <h4 className="bug__block-title">Expected</h4>
              <p>{bugReport.expected}</p>
            </div>

            <div className="bug__block bug__block--actual" data-reveal>
              <h4 className="bug__block-title">Actual</h4>
              <p>{bugReport.actual}</p>
            </div>

            <div className="bug__block bug__block--evidence" data-reveal>
              <h4 className="bug__block-title">Evidence</h4>
              <ul className="chips">
                {bugReport.evidence.map((item) => (
                  <li className="chip" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
