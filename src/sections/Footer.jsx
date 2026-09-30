import { useLocalTime } from '../hooks/useLocalTime.js';
import { scrollToTarget } from '../utils/scrollStore.js';
import { contact } from '../data/contact.js';

export default function Footer() {
  const time = useLocalTime();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <span className="footer__name">SHAKTI DANGOL</span>
          <span className="footer__role">Junior Software QA Engineer</span>
          <span className="footer__location">{contact.location}</span>
        </div>

        <div className="footer__meta">
          <div className="footer__time">
            <span className="footer__key">LOCAL TIME</span>
            <span className="footer__value mono">
              {time} <span className="footer__tz">NPT</span>
            </span>
          </div>

          <div className="footer__time">
            <span className="footer__key">YEAR</span>
            <span className="footer__value mono">{year}</span>
          </div>

          <button
            type="button"
            className="footer__top"
            data-cursor="link"
            onClick={() => scrollToTarget('#top', { duration: 1.4 })}
          >
            BACK TO TOP <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
