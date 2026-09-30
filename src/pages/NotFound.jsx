import { scrollToTarget } from '../utils/scrollStore.js';

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="shell notfound__inner">
        <span className="chip chip--accent">TEST FAILED</span>

        <h1 className="notfound__title">
          PAGE
          <br />
          NOT FOUND.
        </h1>

        <dl className="notfound__report">
          <div>
            <dt>Expected</dt>
            <dd>A valid page.</dd>
          </div>
          <div>
            <dt>Actual</dt>
            <dd>404.</dd>
          </div>
          <div>
            <dt>Severity</dt>
            <dd>Low</dd>
          </div>
          <div>
            <dt>Action</dt>
            <dd>Return Home.</dd>
          </div>
        </dl>

        <button
          type="button"
          className="btn btn--solid"
          data-cursor="link"
          onClick={() => scrollToTarget('#top', { duration: 1 })}
        >
          RETURN HOME
          <span className="btn__arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
