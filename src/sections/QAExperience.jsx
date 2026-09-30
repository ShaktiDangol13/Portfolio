import { experienceFeature } from '../data/experience.js';

export default function QAExperience() {
  const { company, role, location, period, summary, clusters } = experienceFeature;

  return (
    <section className="section work theme-green" id="work" aria-labelledby="work-title">
      <div className="shell">
        <div className="work__head">
          <span className="label" data-reveal>
            <span className="label__dot" />
            03 / Selected QA work
          </span>
          <h2 className="section-title" id="work-title" data-reveal="chars">
            SELECTED QA WORK
          </h2>
        </div>

        <article className="feature" data-reveal>
          <header className="feature__header">
            <p className="feature__eyebrow">Current experience</p>
            <h3 className="feature__company">{company}</h3>
          </header>

          <div className="feature__meta">
            <div className="feature__meta-item">
              <span className="feature__meta-key">Role</span>
              <span className="feature__meta-value">{role}</span>
            </div>
            <div className="feature__meta-item">
              <span className="feature__meta-key">Location</span>
              <span className="feature__meta-value">{location}</span>
            </div>
            <div className="feature__meta-item">
              <span className="feature__meta-key">Period</span>
              <span className="feature__meta-value">{period}</span>
            </div>
          </div>

          <p className="feature__summary body-lg">{summary}</p>

          <div className="feature__clusters">
            {clusters.map((cluster) => (
              <div className="cluster" key={cluster.id}>
                <h4 className="cluster__label">{cluster.label}</h4>
                <ul className="cluster__items">
                  {cluster.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
