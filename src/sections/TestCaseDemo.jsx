import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, EASE_OUT_EXPO, REDUCED } from '../animations/gsapSetup.js';
import { testCase } from '../data/artifacts.js';

/**
 * Interactive demo test case. Switching scenario animates the content out
 * and back in so the change reads as a deliberate state transition.
 */
export default function TestCaseDemo() {
  const [index, setIndex] = useState(0);
  const contentRef = useRef(null);
  const tabRefs = useRef([]);
  const variant = testCase.variants[index];

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return undefined;

    const targets = node.querySelectorAll('[data-tc-field]');
    if (REDUCED()) {
      gsap.set(targets, { clearProps: 'all', opacity: 1, y: 0 });
      return undefined;
    }

    const tween = gsap.fromTo(
      targets,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: EASE_OUT_EXPO, stagger: 0.05 }
    );

    return () => tween.kill();
  }, [index]);

  const onTabKeyDown = (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % testCase.variants.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index + testCase.variants.length - 1) % testCase.variants.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = testCase.variants.length - 1;
    else return;
    event.preventDefault();
    setIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const next = () => setIndex((current) => (current + 1) % testCase.variants.length);

  return (
    <section className="section section--tight testcase theme-light" id="testcase" aria-labelledby="tc-title">
      <div className="shell">
        <div className="artifacts__head">
          <span className="label" data-reveal>
            <span className="label__dot" />
            06 / Test design
          </span>
          <h2 className="section-title" id="tc-title" data-reveal>
            A TEST CASE, <span className="heading-lime">ANIMATED</span>
          </h2>
        </div>

        <article className="tc" data-reveal data-cursor="OPEN">
          <header className="tc__header">
            <span className="chip chip--accent">{testCase.badge}</span>
            <div className="tc__tabs" role="tablist" aria-label="Test case scenario" onKeyDown={onTabKeyDown}>
              {testCase.variants.map((item, i) => (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  id={`scenario-tab-${item.key}`}
                  aria-controls="scenario-panel"
                  tabIndex={i === index ? 0 : -1}
                  ref={(node) => { tabRefs.current[i] = node; }}
                  aria-selected={i === index}
                  className={`tc__tab ${i === index ? 'is-active' : ''}`}
                  onClick={() => setIndex(i)}
                  data-cursor="link"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </header>

          <div className="tc__body" id="scenario-panel" role="tabpanel" aria-labelledby={`scenario-tab-${variant.key}`} tabIndex={0} ref={contentRef} key={variant.key}>
            <div className="tc__meta" data-tc-field>
              <span className="tc__id">{testCase.id}</span>
              <span className="tc__feature">Feature: {testCase.feature}</span>
            </div>

            <div className="tc__main">
              <div className="tc__block" data-tc-field>
                <h4 className="tc__label">Scenario</h4>
                <p className="tc__value">{variant.scenario}</p>
                <h4 className="tc__label">Precondition</h4>
                <p className="tc__value">{testCase.precondition}</p>
              </div>

              <div className="tc__block" data-tc-field>
                <h4 className="tc__label">Steps</h4>
                <ol className="tc__steps">
                  {variant.steps.map((step, i) => (
                    <li key={step}>
                      <span className="tc__step-num">{String(i + 1).padStart(2, '0')}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="tc__block tc__block--expected" data-tc-field>
                <h4 className="tc__label">Expected</h4>
                <p className="tc__value">{variant.expected}</p>
              </div>

              <div className="tc__status" data-tc-field>
                <span className="tc__status-label">Status</span>
                <span className="tc__status-value is-pass">{variant.status}</span>
              </div>
            </div>

            <button type="button" className="tc__next" onClick={next} data-cursor="link" data-tc-field>
              NEXT SCENARIO
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
