import { useEffect, useRef, useState } from 'react';
import { navLinks } from '../data/nav.js';
import { contact } from '../data/contact.js';
import { scrollToTarget } from '../utils/scrollStore.js';

function Link({ link, onNavigate, onClick }) {
  return (
    <a
      className="nav__link"
      href={link.href}
      data-cursor="link"
      onClick={(event) => {
        event.preventDefault();
        onNavigate(link.href);
        onClick?.();
      }}
    >
      <span className="nav__link-index">{link.index}</span>
      <span className="nav__link-label">{link.label}</span>
      <span className="nav__link-line" aria-hidden="true" />
    </a>
  );
}

export default function Navigation({ ready, menuOpen, setMenuOpen }) {
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const measure = () => {
      const y = window.scrollY;
      setCompact(y > 40);
      setHidden(y > 420 && y > lastY.current + 6);
      if (Math.abs(y - lastY.current) > 8) lastY.current = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    measure();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = (href) => {
    scrollToTarget(href, { offset: -20, duration: 1.3 });
  };

  return (
    <>
      <header
        className={`nav ${compact ? 'is-compact' : ''} ${hidden && !menuOpen ? 'is-hidden' : ''} ${
          ready ? 'is-ready' : ''
        } ${menuOpen ? 'is-menu-open' : ''}`}
      >
        <a
          className="nav__brand"
          href="#top"
          data-cursor="link"
          aria-label="Shakti Dangol — back to top"
          onClick={(event) => {
            event.preventDefault();
            navigate('#top');
          }}
        >
          <span className="nav__brand-full">SHAKTI DANGOL</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} link={link} onNavigate={navigate} />
          ))}
        </nav>

        <div className="nav__right">
          <a className="nav__cta" href={`mailto:${contact.email}`} data-cursor="link">
            <span className="nav__cta-dot" aria-hidden="true" />
            LET&apos;S TALK
          </a>

          <button
            type="button"
            className={`nav__burger ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            data-cursor="link"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  );
}
