import { useState } from 'react';
import { debuggingLayers } from '../data/toolbox.js';

/**
 * Failure-layer stack. Hover, focus or tap a layer to see what a defect at
 * that level usually looks like.
 */
export default function DebuggingLayers() {
  const [active, setActive] = useState(0);
  const current = debuggingLayers[active];

  return (
    <section className="section section--tight layers theme-green" id="debug" aria-labelledby="layers-title">
      <div className="shell">
        <div className="layers__grid">
          <div className="layers__copy">
            <span className="label" data-reveal>
              <span className="label__dot" />
              09 / Investigation
            </span>
            <h2 className="section-title" id="layers-title" data-reveal="chars">
              FIND THE
              <br />
              FAILURE LAYER.
            </h2>

            <div className="layers__detail" aria-live="polite" data-reveal>
              <span className="layers__detail-index">
                {String(active + 1).padStart(2, '0')} / {String(debuggingLayers.length).padStart(2, '0')}
              </span>
              <p className="layers__detail-label">{current.label}</p>
              <p className="layers__detail-example">{current.example}</p>
            </div>
          </div>

          <ol className="layers__stack" data-reveal="stagger">
            {debuggingLayers.map((layer, index) => (
              <li key={layer.id} className={index === active ? 'is-active' : ''}>
                <button
                  type="button"
                  className="layer"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  aria-pressed={index === active}
                  data-cursor="EXPLORE"
                >
                  <span className="layer__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="layer__label">{layer.label}</span>
                  <span className="layer__example">{layer.example}</span>
                </button>
                {index < debuggingLayers.length - 1 ? (
                  <span className="layers__arrow" aria-hidden="true">
                    ↓
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
