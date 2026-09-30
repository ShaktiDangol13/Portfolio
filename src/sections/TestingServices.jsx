import { services } from '../data/services.js';

export default function TestingServices() {
  return (
    <section className="section section--tight services theme-light" id="services" aria-labelledby="services-title">
      <div className="shell">
        <div className="services__head">
          <span className="label" data-reveal>
            <span className="label__dot" />
            02 / Coverage
          </span>
          <h2 className="section-title services__title" id="services-title" data-reveal>
            WHAT I <span className="heading-lime">TEST</span>
          </h2>
        </div>

        <ol className="services__list" data-reveal="stagger">
          {services.map((service) => (
            <li className="service" key={service.index} data-cursor="EXPLORE">
              <span className="service__index" aria-hidden="true">
                {service.index}
              </span>
              <div className="service__content">
                <h3 className="service__title">{service.title}</h3>
                <p className="service__description">{service.description}</p>
              </div>
              <span className="service__arrow" aria-hidden="true">
                ↘
              </span>
              <span className="service__line" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
