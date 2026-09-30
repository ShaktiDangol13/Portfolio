/**
 * Floating QA artefacts. Purely decorative — hidden from screen readers —
 * but built from real testing vocabulary instead of stock imagery.
 */
export default function QACard({ card }) {
  return (
    <div
      className={`qa-card qa-card--${card.id} qa-card--below-${card.hideBelow || 'always'}`}
      data-depth={card.depth}
      aria-hidden="true"
    >
      <div className="qa-card__head">
        <span className="qa-card__type">{card.type}</span>
        <span className="qa-card__dot" />
      </div>

      {card.title ? <p className="qa-card__title">{card.title}</p> : null}

      {card.lines ? (
        <ul className="qa-card__lines">
          {card.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}

      {card.code ? (
        <pre className="qa-card__code">
          <code>{card.code.join('\n')}</code>
        </pre>
      ) : null}

      {card.meta ? (
        <dl className="qa-card__meta">
          {card.meta.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {card.status ? (
        <span className={`qa-card__status is-${card.status.tone}`}>{card.status.label}</span>
      ) : null}
    </div>
  );
}
