import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ReadyContext } from './context/ReadyContext.jsx';
import { initReveals } from './animations/reveals.js';
import { ScrollTrigger } from './animations/gsapSetup.js';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import { lockScroll, unlockScroll } from './utils/scrollLock.js';

import Preloader from './components/Preloader.jsx';
import Navigation from './components/Navigation.jsx';
import MobileMenu from './components/MobileMenu.jsx';
import CustomCursor from './components/CustomCursor.jsx';

import Hero from './sections/Hero.jsx';
import Intro from './sections/Intro.jsx';
import TestingServices from './sections/TestingServices.jsx';
import QAExperience from './sections/QAExperience.jsx';
import QAProcess from './sections/QAProcess.jsx';
import BugReportDemo from './sections/BugReportDemo.jsx';
import TestCaseDemo from './sections/TestCaseDemo.jsx';
import APITesting from './sections/APITesting.jsx';
import DatabaseTesting from './sections/DatabaseTesting.jsx';
import DebuggingLayers from './sections/DebuggingLayers.jsx';
import ExperienceTimeline from './sections/ExperienceTimeline.jsx';
import Skills from './sections/Skills.jsx';
import DevelopmentBackground from './sections/DevelopmentBackground.jsx';
import Philosophy from './sections/Philosophy.jsx';
import TestingMatrix from './sections/TestingMatrix.jsx';
import Toolbox from './sections/Toolbox.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';
import NotFound from './pages/NotFound.jsx';

function useCurrentPath() {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  );

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return path;
}

export default function App() {
  const path = useCurrentPath();
  const notFound = !['/', '/index.html', ''].includes(path);

  const [loaderDone, setLoaderDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pageRef = useRef(null);
  const revealsRef = useRef(null);

  const ready = notFound || loaderDone;

  useSmoothScroll({ enabled: ready });

  const handleReady = useCallback(() => setLoaderDone(true), []);

  /* Global declarative reveals, scoped to the page so they can be reverted. */
  useLayoutEffect(() => {
    if (!ready || !pageRef.current) return undefined;
    revealsRef.current?.revert();
    revealsRef.current = initReveals(pageRef.current);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refresh);
      revealsRef.current?.revert();
      revealsRef.current = null;
    };
  }, [ready, notFound]);

  /* Lock page scroll while the fullscreen menu is open. */
  useEffect(() => {
    if (!menuOpen) return undefined;
    lockScroll('menu-open');
    return () => unlockScroll('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [menuOpen]);

  return (
    <ReadyContext.Provider value={ready}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {!notFound ? <Preloader onReady={handleReady} /> : null}


      <Navigation ready={ready} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} ready={ready} />

      <div className={`page ${menuOpen ? 'is-pushed' : ''}`} ref={pageRef}>
        <main id="main">
          {notFound ? (
            <NotFound />
          ) : (
            <>
              <Hero ready={ready} />
              <Intro />
              <TestingServices />
              <QAExperience />
              <QAProcess />
              <BugReportDemo />
              <TestCaseDemo />
              <APITesting />
              <DatabaseTesting />
              <DebuggingLayers />
              <ExperienceTimeline />
              <Skills />
              <DevelopmentBackground />
              <Philosophy />
              <TestingMatrix />
              <Toolbox />
              <Contact />
            </>
          )}
        </main>

        <Footer />
      </div>

      <div className="grain" aria-hidden="true" />
      <CustomCursor />
    </ReadyContext.Provider>
  );
}
