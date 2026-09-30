import { toolbox } from '../data/toolbox.js';

export default function Toolbox() {
  return (
    <section className="section section--tight toolbox theme-light" id="toolbox" aria-labelledby="toolbox-title">
      <div className="shell">
        <div className="toolbox__head">
          <span className="label" data-reveal>
            <span className="label__dot" />
            16 / Tools
          </span>
          <h2 className="section-title" id="toolbox-title" data-reveal>
            MY QA <span className="heading-lime">TOOLBOX</span>
          </h2>
        </div>

        <ul className="toolbox__grid" data-reveal="stagger">
          {toolbox.map((tool, index) => (
            <li className="tool" key={tool.name} data-cursor="OPEN">
              <span className="tool__index mono">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="tool__name">{tool.name}</h3>
              <p className="tool__usage">{tool.usage}</p>
              <p className="tool__detail">{tool.detail}</p>
              <span className="tool__line" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
