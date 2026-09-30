import portrait from '../../images/WhatsApp Image 2026-09-30 at 12.36.31 AM.jpeg';
import bikePortrait from '../../images/1.jpeg';
import { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from '../animations/gsapSetup.js';
import { heroEntrance, heroMetaReveal, heroScrollMotion, prepareHero } from '../animations/heroAnimation.js';
import { heroMeta } from '../data/hero.js';

export default function Hero({ ready }) {
  const sectionRef = useRef(null);
  const nameARef = useRef(null);
  const nameBRef = useRef(null);
  /* Entrance + scroll-driven typography */
  useLayoutEffect(() => {
    if (!ready) return undefined;

    const lines = prepareHero([nameARef.current, nameBRef.current]);
    const entrance = heroEntrance(lines, { delay: 0.12 });
    const scrollTween = heroScrollMotion(lines, sectionRef.current);

    const meta = Array.from(sectionRef.current.querySelectorAll('[data-hero-meta]'));
    const metaTween = heroMetaReveal(meta);

    const openLines = () => {
      sectionRef.current?.querySelectorAll('.hero__line').forEach((el) => {
        el.style.overflow = 'visible';
      });
    };
    const timer = window.setTimeout(openLines, 1800);

    ScrollTrigger.refresh();

    return () => {
      window.clearTimeout(timer);
      entrance?.kill();
      metaTween?.kill();
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
    };
  }, [ready]);

  return (
    <section className="hero" id="top" ref={sectionRef} aria-label="Introduction">
      <div className="hero__scene" aria-hidden="true">
        <img src={bikePortrait} alt="" width="720" height="1600" fetchPriority="high" />
      </div>
      <div className="hero__inner shell">
        <div className="hero__top">
          <span className="label" data-hero-meta>
            <span className="label__dot" />
            Portfolio — {heroMeta.location}
          </span>
          <p className="hero__statement" data-hero-meta>
            {heroMeta.statement}
          </p>
        </div>

        <h1 className="hero__title">
          <span className="hero__line" ref={nameARef}>
            SHAKTI
          </span>
          <span className="hero__row">
            <span className="hero__line" ref={nameBRef}>
              DANGOL
            </span>
            <span className="hero__role" data-hero-meta>
              QA ENGINEER
            </span>
          </span>
        </h1>

        <div className="hero__bottom">
          <div className="hero__identity" data-hero-meta>
            <img className="hero__portrait" src={portrait} alt="Shakti Dangol" width="1280" height="1280" fetchPriority="high" />
            <div className="hero__meta">
            <span className="hero__meta-role">{heroMeta.role}</span>
            <span className="hero__meta-special">
              {heroMeta.specialisms.join(' · ')}
            </span>
            </div>
          </div>

          <div className="hero__availability" data-hero-meta>
            <span className="hero__pulse" aria-hidden="true" />
            {heroMeta.availability}
          </div>

        </div>
      </div>
    </section>
  );
}
