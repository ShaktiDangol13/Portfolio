import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, REDUCED } from '../animations/gsapSetup.js';
import { useReady } from '../context/ReadyContext.jsx';
import { timeline } from '../data/timeline.js';

export default function ExperienceTimeline() {
  const ready = useReady();
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (!ready || !rootRef.current) return undefined;

    const items = Array.from(rootRef.current.querySelectorAll('.titem'));
    const line = rootRef.current.querySelector('.timeline__fill');
    const triggers = [];

    items.forEach((item, index) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: item,
          start: 'top 62%',
          end: 'bottom 62%',
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        })
      );
    });

    let lineTween = null;
    if (line) {
      if (REDUCED()) {
        gsap.set(line, { scaleY: 1 });
      } else {
        gsap.set(line, { scaleY: 0, transformOrigin: 'top center' });
        lineTween = gsap.to(line, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current.querySelector('.timeline__list'),
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 0.4,
          },
        });
      }
    }

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      lineTween?.scrollTrigger?.kill();
      lineTween?.kill();
    };
  }, [ready]);

  return (
    <section className="section timeline" id="experience" aria-labelledby="experience-title" ref={rootRef}>
      <div className="shell">
        <div className="timeline__head">
          <span className="label" data-reveal>
            <span className="label__dot" />
            10 / Experience
          </span>
          <h2 className="section-title" id="experience-title" data-reveal="chars">
            EXPERIENCE
          </h2>
        </div>

        <ol className="timeline__list">
          <span className="timeline__line" aria-hidden="true">
            <span className="timeline__fill" />
          </span>

          {timeline.map((item, index) => (
            <li
              className={`titem ${index === active ? 'is-active' : ''}`}
              key={item.id}
              data-cursor="EXPLORE"
            >
              <div className="titem__period">
                <span className="mono">{item.period}</span>
                <span className={`titem__badge ${item.kind === 'QA' ? 'is-qa' : ''}`}>
                  {item.kind}
                </span>
              </div>

              <div className="titem__main">
                <h3 className="titem__company">{item.company}</h3>
                <p className="titem__role">{item.role}</p>
                <p className="titem__location mono">{item.location}</p>
              </div>

              <ul className="titem__notes">
                {item.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
