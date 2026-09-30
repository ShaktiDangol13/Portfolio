import { useState } from 'react';
import { skillGroups } from '../data/skills.js';

/**
 * Skills as a large editorial list instead of percentage bars.
 * Pointer hover previews the related concepts; click / keyboard confirms the
 * selection (touch devices only ever use the click path).
 */
export default function Skills() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const openName = hovered || selected;

  const toggle = (name) => {
    if (selected === name) {
      setSelected(null);
      setHovered(null);
      return;
    }
    setSelected(name);
  };

  return (
    <section className="section skills theme-light" id="skills" aria-labelledby="skills-title">
      <div className="shell">
        <div className="skills__head">
          <span className="label" data-reveal>
            <span className="label__dot" />
            11 / Technical skills
          </span>
          <h2 className="section-title" id="skills-title" data-reveal>
            THE <span className="heading-lime">TOOLKIT</span>
          </h2>
        </div>

        <div className="skills__grid">
          <p className="skills__note body-lg" data-reveal>
            Organised by what the skill is used for — not by invented percentages.
          </p>

          <div className="skills__groups">
            {skillGroups.map((group) => (
              <div className="skill-group" key={group.id} data-reveal>
                <h3 className="skill-group__label">{group.label}</h3>

                <ul className="skill-group__list">
                  {group.items.map((item) => {
                    const isOpen = openName === item.name;
                    const panelId = `skill-panel-${item.index}`;
                    return (
                      <li className={`skill ${isOpen ? 'is-open' : ''}`} key={item.name}>
                        <button
                          type="button"
                          className="skill__trigger"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onPointerEnter={(event) => {
                            if (event.pointerType === 'mouse') setHovered(item.name);
                          }}
                          onPointerLeave={() => setHovered((current) => (current === item.name ? null : current))}
                          onFocus={() => setHovered(item.name)}
                          onBlur={() => setHovered((current) => (current === item.name ? null : current))}
                          onClick={() => toggle(item.name)}
                          data-cursor="link"
                        >
                          <span className="skill__index">{item.index}</span>
                          <span className="skill__name">{item.name}</span>
                          <span className="skill__sign" aria-hidden="true" />
                        </button>

                        <div className="skill__panel" id={panelId}>
                          <div className="skill__panel-inner">
                            <ul className="skill__related">
                              {item.related.map((rel) => (
                                <li key={rel}>{rel}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
