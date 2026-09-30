import { useEffect, useRef } from 'react';
import { gsap, EASE_OUT_EXPO } from '../animations/gsapSetup.js';
import { navLinks } from '../data/nav.js';
import { contact } from '../data/contact.js';
import { scrollToTarget } from '../utils/scrollStore.js';
import { lockScroll, unlockScroll } from '../utils/scrollLock.js';

export default function MobileMenu({ open, onClose, ready }) {
  const rootRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const links = root.querySelectorAll('.menu__link');
    const socials = root.querySelectorAll('.menu__social');

    if (firstRender.current) {
      firstRender.current = false;
      gsap.set(root, { autoAlpha: 0 });
      gsap.set(links, { yPercent: 110, opacity: 0 });
      gsap.set(socials, { y: 20, opacity: 0 });
      return undefined;
    }

    if (open) {
      lockScroll('menu');
      gsap.killTweensOf([root, links, socials]);
      const tl = gsap.timeline();
      tl.set(root, { autoAlpha: 1 })
        .fromTo(
          root,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: EASE_OUT_EXPO },
          0
        )
        .to(links, { yPercent: 0, opacity: 1, duration: 0.85, ease: EASE_OUT_EXPO, stagger: 0.055 }, 0.18)
        .to(socials, { y: 0, opacity: 1, duration: 0.7, ease: EASE_OUT_EXPO, stagger: 0.06 }, 0.4);
    } else {
      gsap.killTweensOf([root, links, socials]);
      gsap
        .timeline({
          onComplete: () => gsap.set(root, { autoAlpha: 0 }),
        })
        .to(links, { yPercent: -60, opacity: 0, duration: 0.4, ease: 'power3.in', stagger: 0.03 })
        .to(
          root,
          { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: EASE_OUT_EXPO },
          0.1
        );
    }

    return () => {
      unlockScroll('menu');
    };
  }, [open]);

  useEffect(() => {
    if (!ready) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, ready]);

  const navigate = (href) => {
    onClose();
    window.setTimeout(() => scrollToTarget(href, { offset: -10, duration: 1.3 }), 380);
  };

  return (
    <div
      id="mobile-menu"
      className={`menu ${open ? 'is-open' : ''}`}
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
    >
      <div className="menu__inner">
        <nav className="menu__nav" aria-label="Mobile">
          {navLinks.map((link, i) => (
            <div className="menu__item" key={link.href}>
              <a
                className="menu__link"
                href={link.href}
                tabIndex={open ? 0 : -1}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(link.href);
                }}
              >
                <span className="menu__link-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="menu__link-label">{link.label}</span>
              </a>
            </div>
          ))}
        </nav>

        <div className="menu__footer">
          <a
            className="menu__social"
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            tabIndex={open ? 0 : -1}
            data-cursor="link"
          >
            LINKEDIN
          </a>
          <a
            className="menu__social"
            href={contact.github}
            target="_blank"
            rel="noreferrer noopener"
            tabIndex={open ? 0 : -1}
            data-cursor="link"
          >
            GITHUB
          </a>
          <a
            className="menu__social"
            href={`mailto:${contact.email}`}
            tabIndex={open ? 0 : -1}
            data-cursor="link"
          >
            EMAIL
          </a>
          <span className="menu__social menu__social--muted">{contact.location}</span>
        </div>
      </div>
    </div>
  );
}
