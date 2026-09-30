import personalPhoto from '../../images/1.jpeg';
import { developmentBackground, education } from '../data/timeline.js';

export default function DevelopmentBackground() {
  return (
    <>
      <section className="section background theme-light" id="about" aria-labelledby="background-title">
        <div className="shell">
          <div className="background__head">
            <span className="label" data-reveal>
              <span className="label__dot" />
              12 / Before QA
            </span>
            <h2 className="section-title" id="background-title" data-reveal>
              BEFORE <span className="heading-lime">QA.</span>
            </h2>
          </div>

          <div className="background__grid">
            <div className="background__intro">
              <p className="background__meta mono" data-reveal>
                {developmentBackground.role} · {developmentBackground.company}
                <br />
                {developmentBackground.period}
              </p>

              {developmentBackground.story.map((paragraph) => (
                <p className="body-lg" key={paragraph} data-reveal>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="background__projects" data-reveal="stagger">
              <h3 className="background__sublabel">Projects</h3>
              <ul className="projects">
                {developmentBackground.projects.map((project) => (
                  <li className="project" key={project.name} data-cursor="EXPLORE">
                    <a className="project__link" href={project.url} target="_blank" rel="noopener noreferrer">
                      <span className="project__name">{project.name} <span aria-hidden="true">↗</span></span>
                      <span className="project__detail">{project.detail}</span>
                      <span className="sr-only">Opens in a new tab</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="background__stacks" data-reveal="stagger">
            {developmentBackground.stacks.map((stack) => (
              <div className="stack" key={stack.label}>
                <h3 className="stack__label">{stack.label}</h3>
                <ul className="stack__items">
                  {stack.items.map((item) => (
                    <li key={item} className="mono">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="background__personal">
            <figure className="background__portrait" data-reveal="media">
              <img src={personalPhoto} alt="Shakti sitting on a motorcycle with a guitar" width="720" height="1600" loading="lazy" decoding="async" data-reveal-media />
            </figure>
            <div className="background__personal-copy" data-reveal>
              <span className="label"><span className="label__dot" />Beyond the screen</span>
              <h3>A DIFFERENT<br />PERSPECTIVE.</h3>
              <p className="body-lg">A moment away from the keyboard.</p>
            </div>
          </div>
          <div className="rule" data-reveal="rule" />
        </div>
      </section>

      <section className="section section--tight education theme-light" id="education" aria-labelledby="education-title">
        <div className="shell education__grid">
          <span className="label" data-reveal>
            <span className="label__dot" />
            13 / Education
          </span>
          <div>
            <h2 className="section-title education__title" id="education-title" data-reveal>
              <span className="heading-lime">EDUCATION</span>
            </h2>
            {education.map((entry) => (
              <p className="education__entry" key={entry.degree} data-reveal>
                <span className="education__degree">{entry.degree}</span>
                <span className="education__institution body-lg">{entry.institution}</span>
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
