import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, REDUCED } from '../animations/gsapSetup.js';
import { useReady } from '../context/ReadyContext.jsx';
import { qaProcess } from '../data/experience.js';

/**
 * Sticky process journey: the left panel stays while the steps scroll past,
 * the connecting line fills with scroll progress and the active step drives
 * the metadata in the sticky panel.
 */
export default function QAProcess() {
  const ready = useReady();
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (!ready || !rootRef.current) return undefined;

    const steps = Array.from(rootRef.current.querySelectorAll('.pstep'));
    const line = rootRef.current.querySelector('.process__line-fill');
    const triggers = [];

    steps.forEach((step, index) => {
      const trigger = gsap.timeline({
        scrollTrigger: {
          trigger: step,
          start: 'top 62%',
          end: 'bottom 62%',
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        },
      });
      triggers.push(trigger.scrollTrigger);
    });

    let lineTween = null;
    if (line && !REDUCED()) {
      gsap.set(line, { scaleY: 0, transformOrigin: 'top center' });
      lineTween = gsap.to(line, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current.querySelector('.process__steps'),
          start: 'top 60%',
          end: 'bottom 75%',
          scrub: 0.4,
        },
      });
    } else if (line) {
      gsap.set(line, { scaleY: 1 });
    }

    return () => {
      triggers.forEach((trigger) => trigger?.kill());
      lineTween?.scrollTrigger?.kill();
      lineTween?.kill();
    };
  }, [ready]);

  const current = qaProcess[active];

  return (
    <section className="section process theme-light" id="process" aria-labelledby="process-title" ref={rootRef}>
      <div className="shell process__grid">
        <div className="process__sticky">
          <span className="label">
            <span className="label__dot" />
            04 / QA process
          </span>
          <h2 className="section-title process__title" id="process-title">
            HOW A
            <br />
            DEFECT IS
            <br />
            <span className="heading-lime">FOUND</span>
          </h2>

          <div className="process__indicator" aria-hidden="true">
            <div className="process__counter">
              <span className="process__counter-current">{current.step}</span>
              <span className="process__counter-total">/ 07</span>
            </div>
            <p className="process__current">{current.title}</p>
            <div className="process__progress">
              <span className="process__progress-bar" style={{ transform: `scaleX(${(active + 1) / qaProcess.length})` }} />
            </div>
          </div>
        </div>

        <ol className="process__steps">
          <span className="process__line" aria-hidden="true">
            <span className="process__line-fill" />
          </span>

          {qaProcess.map((step, index) => (
            <li
              className={`pstep ${index === active ? 'is-active' : ''}`}
              key={step.step}
              data-cursor="EXPLORE"
            >
              <div className="pstep__marker" aria-hidden="true">
                <span>{step.step}</span>
              </div>
              <div className="pstep__body">
                <h3 className="pstep__title">{step.title}</h3>
                <p className="pstep__detail">{step.detail}</p>
                <ul className="pstep__tags">
                  {step.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
