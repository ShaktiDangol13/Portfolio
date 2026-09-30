import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];

const results = [];
let failures = 0;

function check(name, condition, detail = '') {
  const passed = Boolean(condition);
  if (!passed) failures += 1;
  results.push(`${passed ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

function startPreview() {
  const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
  const child = spawn(process.execPath, [viteBin, 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', () => {});
  child.stderr.on('data', (data) => process.stderr.write(data));
  return child;
}

async function waitForServer(retries = 40) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const response = await fetch(BASE);
      if (response.ok) return;
    } catch {
      /* server not ready */
    }
    await sleep(250);
  }
  throw new Error('preview server never came up');
}

function attachDiagnostics(page, bucket) {
  page.on('console', (message) => {
    const type = message.type();
    if (type === 'error' || type === 'warning') bucket.push(`[console.${type}] ${message.text()}`);
  });
  page.on('pageerror', (error) => bucket.push(`[pageerror] ${error.message}`));
  page.on('requestfailed', (request) =>
    bucket.push(`[requestfailed] ${request.url()} — ${request.failure()?.errorText}`)
  );
}

async function waitForPreloader(page) {
  await page.waitForFunction(() => !document.querySelector('.preloader'), { timeout: 12000 });
}

async function scrollThrough(page, steps = 45) {
  await page.evaluate(() => window.focus());
  for (let i = 0; i < steps; i += 1) {
    await page.mouse.wheel({ deltaY: 700 });
    await sleep(150);
  }
}

async function run() {
  const server = startPreview();
  let browser;

  try {
    await waitForServer();

    const executablePath = CHROME_CANDIDATES.find((candidate) =>
      pathToFileSafe(candidate)
    );
    if (!executablePath) throw new Error('No Chrome/Edge executable found');

    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
    });

    /* ---------------- DESKTOP ---------------- */
    const desktop = await browser.newPage();
    await desktop.setViewport({ width: 1440, height: 900 });
    const desktopLogs = [];
    attachDiagnostics(desktop, desktopLogs);

    await desktop.goto(BASE, { waitUntil: 'networkidle2' });

    check('Preloader is present on first paint', await desktop.$('.preloader'));
    await waitForPreloader(desktop);
    check('Preloader completes and unmounts', true);

    await sleep(1600);
    await desktop.evaluate(() => document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; }));
    await desktop.waitForFunction(() => [...document.images].every(img => img.complete));
    check('Both selected photos load in all placements', await desktop.$$eval('img', imgs => imgs.length === 5 && imgs.every(img => img.naturalWidth > 0) && new Set(imgs.map(img => img.src)).size === 2));
    check('Hero floating cards removed', !(await desktop.$('.hero__cards, #top .qa-card')));
    check('Unused motion permission prompt removed', !(await desktop.$('.motion-permission')));
    check('White sections use white backgrounds', await desktop.$$eval('.theme-light', els => els.length >= 9 && els.every(el => getComputedStyle(el).backgroundColor === 'rgb(255, 255, 255)')));
    check('Green sections use green backgrounds and black text', await desktop.$$eval('.theme-green', els => els.length === 4 && els.every(el => { const s = getComputedStyle(el); return s.backgroundColor === 'rgb(205, 245, 100)' && s.color === 'rgb(17, 17, 17)'; })));
    const contrastFailures = await desktop.evaluate(() => {
      const failures = [];
      const luminance = value => {
        const rgb = value.match(/[\d.]+/g).slice(0, 3).map(v => { const s = Number(v) / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; });
        return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
      };
      for (const section of document.querySelectorAll('.theme-light, .theme-green')) {
        const background = luminance(getComputedStyle(section).backgroundColor);
        const probe = document.createElement('span'); section.append(probe);
        for (const token of ['--text-primary', '--text-secondary', '--text-faint', '--accent']) {
          probe.style.color = `var(${token})`;
          const foreground = luminance(getComputedStyle(probe).color);
          const ratio = (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05);
          if (ratio < 4.5) failures.push(`${section.id} ${token}: ${ratio.toFixed(2)}`);
        }
        probe.remove();
      }
      return failures;
    });
    check('New section text colors meet 4.5:1 contrast', contrastFailures.length === 0, contrastFailures.join('; '));
    check('Section heading references resolve', await desktop.$$eval('section[aria-labelledby]', els => els.every(el => document.getElementById(el.getAttribute('aria-labelledby')))));
    check('CV GitHub link applied', Boolean(await desktop.$('a[href="https://github.com/ShaktiDangol13"]')));
    check('CV LinkedIn link applied', Boolean(await desktop.$('a[href="https://www.linkedin.com/in/shakti-dangol-3254083aa/"]')));
    check('CV phone link applied', Boolean(await desktop.$('a[href="tel:+977-9749717321"]')));
    check('Five development projects are linked', await desktop.$$eval('.project__link', els => els.length === 5 && els.every(el => el.href.startsWith('https://') && el.rel.includes('noopener'))));
    const pdf = await fetch(`${BASE}/Shakti-Dangol-CV.pdf`);
    const pdfBytes = Buffer.from(await pdf.arrayBuffer());
    check('Real CV is downloadable', pdf.ok && pdfBytes.length > 100000 && pdfBytes.equals(fs.readFileSync(path.join(root, 'public/Shakti-Dangol-CV.pdf'))));
    await desktop.screenshot({ path: path.join(root, '.shots/section-colors-hero.png') });

    const navReady = await desktop.$eval('.nav', (el) => el.classList.contains('is-ready'));
    check('Navigation reveals after load', navReady);

    const heroText = await desktop.$eval('.hero__title', (el) => el.innerText.replace(/\s+/g, ' ').trim());
    check('Hero shows name', heroText.includes('SHAKTI') && heroText.includes('DANGOL'), heroText);

    const heroRole = await desktop.$eval('.hero__meta', (el) => el.innerText.replace(/\s+/g, ' ').trim());
    check(
      'Hero shows role + specialisms',
      /Junior Software QA Engineer/i.test(heroRole) && /api testing/i.test(heroRole),
      heroRole
    );

    const overflow = await desktop.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    check(
      'No horizontal overflow on desktop',
      overflow.scrollWidth <= overflow.clientWidth + 1,
      `${overflow.scrollWidth} vs ${overflow.clientWidth}`
    );

    /* Keyboard: first tab reaches the skip link */
    await desktop.keyboard.press('Tab');
    const firstFocus = await desktop.evaluate(() => document.activeElement?.className || '');
    check('Skip link is the first tab stop', firstFocus.includes('skip-link'), firstFocus);

    await scrollThrough(desktop);

    const scrollY = await desktop.evaluate(() => window.scrollY);
    check('Page scrolls with smooth scrolling', scrollY > 800, `scrollY=${scrollY}`);

    const contactVisible = await desktop.evaluate(() => {
      const el = document.querySelector('#contact');
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight * 2.5;
    });
    check('Contact section reachable by scrolling', contactVisible);

    const emailLink = await desktop.$eval('.contact__actions a', (el) => el.getAttribute('href'));
    check('Contact email action wired', emailLink === 'mailto:shakti.try99@gmail.com', emailLink);

    const cvLink = await desktop.$eval('a[download]', (el) => el.getAttribute('href'));
    check('CV download link wired', cvLink?.endsWith('.pdf'), cvLink);

    /* Back to top */
    await desktop.evaluate(() => document.querySelector('.footer__top')?.click());
    await sleep(1800);
    const backAtTop = await desktop.evaluate(() => window.scrollY);
    check('Back to top returns to hero', backAtTop < 40, `scrollY=${backAtTop}`);

    /* Anchor navigation */
    await desktop.evaluate(() => {
      document.querySelector('.nav__link[href="#skills"]')?.click();
    });
    await sleep(2200);
    const skillsTop = await desktop.evaluate(
      () => document.querySelector('#skills').getBoundingClientRect().top
    );
    check('Anchor navigation scrolls to SKILLS', Math.abs(skillsTop) < 400, `top=${skillsTop}`);

    /* Interactive demos */
    await desktop.evaluate(() => document.querySelector('#testcase')?.scrollIntoView());
    await sleep(900);
    const tabs = await desktop.$$('.tc__tab');
    if (tabs.length >= 2) {
      await tabs[1].click();
      await sleep(700);
      const active = await desktop.$eval('.tc__tab.is-active', (el) => el.textContent.trim());
      check('Test case scenario switches', active === 'INVALID PASSWORD', active);
      await desktop.keyboard.press('ArrowLeft');
      check('Test tabs support arrow-key navigation', await desktop.$eval('#scenario-tab-valid', el => el.getAttribute('aria-selected') === 'true' && document.activeElement === el));
      check('Test panel is linked to the selected tab', await desktop.$eval('#scenario-panel', el => el.getAttribute('aria-labelledby') === 'scenario-tab-valid'));
    } else {
      check('Test case tabs exist', false, `${tabs.length} tabs`);
    }

    await desktop.evaluate(() => document.querySelector('#skills')?.scrollIntoView());
    await sleep(700);
    const skillTrigger = await desktop.$('.skill__trigger');
    if (skillTrigger) {
      await skillTrigger.click();
      await sleep(700);
      const expanded = await desktop.$eval('.skill__trigger', (el) => el.getAttribute('aria-expanded'));
      check('Skill row expands on interaction', expanded === 'true', String(expanded));
    } else {
      check('Skill rows exist', false);
    }

    const bodyOverflowing = await desktop.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    check('No horizontal overflow after interactions', !bodyOverflowing);

    const desktopErrors = desktopLogs.filter(
      (line) =>
        !line.includes('favicon') &&
        !line.includes('Download the React DevTools') &&
        !line.includes('fonts.googleapis') &&
        !line.includes('fonts.gstatic')
    );
    check('No console/page errors on desktop', desktopErrors.length === 0, desktopErrors.slice(0, 3).join(' | '));

    await desktop.evaluate(() => document.querySelector('#intro').scrollIntoView());
    await sleep(1600);
    await desktop.screenshot({ path: path.join(root, '.shots/section-colors-intro.png') });
    await desktop.mouse.move(650, 480);
    check('Cursor changes to pale lime on white', await desktop.$eval('.cursor__dot', el => getComputedStyle(el).backgroundColor === 'rgb(205, 245, 100)'));
    await desktop.evaluate(() => document.querySelector('#work').scrollIntoView());
    await sleep(1600);
    await desktop.mouse.move(650, 490);
    check('Cursor changes to black on pale lime', await desktop.$eval('.cursor__dot', el => getComputedStyle(el).backgroundColor === 'rgb(17, 17, 17)'));
    await desktop.screenshot({ path: path.join(root, '.shots/section-colors-work.png') });
    await desktop.evaluate(() => document.querySelector('.background__personal').scrollIntoView());
    await sleep(1600);
    await desktop.screenshot({ path: path.join(root, '.shots/section-colors-personal.png') });
    await desktop.close();

    /* ---------------- MOBILE ---------------- */
    const mobile = await browser.newPage();
    await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const mobileLogs = [];
    attachDiagnostics(mobile, mobileLogs);

    await mobile.goto(BASE, { waitUntil: 'networkidle2' });
    await waitForPreloader(mobile);
    await sleep(1400);
    await mobile.screenshot({ path: path.join(root, '.shots/section-colors-mobile.png') });

    const mobileOverflow = await mobile.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    check(
      'No horizontal overflow on mobile',
      mobileOverflow.scrollWidth <= mobileOverflow.clientWidth + 1,
      `${mobileOverflow.scrollWidth} vs ${mobileOverflow.clientWidth}`
    );

    const burgerVisible = await mobile.$eval('.nav__burger', (el) => getComputedStyle(el).display !== 'none');
    check('Burger menu visible on mobile', burgerVisible);

    await mobile.$eval('.nav__burger', (el) => el.click());
    await sleep(1200);
    const menuOpen = await mobile.$eval('.nav__burger', (el) => el.getAttribute('aria-expanded'));
    check('Mobile menu opens', menuOpen === 'true', String(menuOpen));

    const menuLinkCount = await mobile.$$eval('.menu__link', (els) => els.length);
    check('Mobile menu lists all sections', menuLinkCount === 6, `${menuLinkCount} links`);

    await mobile.$eval('.menu__link[href="#work"]', (el) => el.click());
    await sleep(2200);
    const menuClosed = await mobile.$eval('.nav__burger', (el) => el.getAttribute('aria-expanded'));
    check('Mobile menu closes after navigation', menuClosed === 'false', String(menuClosed));

    await mobile.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await sleep(500);
    const touchSession = await mobile.createCDPSession();
    await touchSession.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 650 }] });
    for (let y = 630; y >= 200; y -= 20) {
      await touchSession.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y }] });
      await sleep(20);
    }
    await touchSession.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(700);
    check('Touch swipe scrolls after closing mobile menu', await mobile.evaluate(() => window.scrollY > 100));
    await touchSession.detach();

    const touchTargets = await mobile.$$eval('.contact__actions a', (els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().height))
    );
    check(
      'Contact buttons have comfortable touch height',
      touchTargets.every((h) => h >= 40),
      touchTargets.join(',')
    );

    const mobileErrors = mobileLogs.filter((line) => !line.includes('fonts.g'));
    check('No console/page errors on mobile', mobileErrors.length === 0, mobileErrors.slice(0, 3).join(' | '));

    await mobile.close();

    /* ---------------- REDUCED MOTION ---------------- */
    const reduced = await browser.newPage();
    await reduced.setViewport({ width: 1280, height: 800 });
    await reduced.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const reducedLogs = [];
    attachDiagnostics(reduced, reducedLogs);
    await reduced.goto(BASE, { waitUntil: 'networkidle2' });
    await waitForPreloader(reduced);
    await sleep(900);

    const heroVisibleReduced = await reduced.$eval('.hero__title', (el) => {
      const style = getComputedStyle(el);
      return style.visibility !== 'hidden' && style.opacity !== '0';
    });
    check('Hero renders with reduced motion', heroVisibleReduced);
    check('Reduced-motion philosophy statements do not overlap', await reduced.evaluate(() => {
      const first = document.querySelector('.philo__block--first').getBoundingClientRect();
      const second = document.querySelector('.philo__block--second').getBoundingClientRect();
      return second.top >= first.bottom;
    }));

    await reduced.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(800);
    const contactVisibleReduced = await reduced.evaluate(() => {
      const el = document.querySelector('#contact');
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight + 400;
    });
    check('Content reachable with reduced motion', contactVisibleReduced);

    const reducedErrors = reducedLogs.filter((l) => !l.includes('fonts.g'));
    check('No errors with reduced motion', reducedErrors.length === 0, reducedErrors.slice(0, 3).join(' | '));
    await reduced.close();

    /* Check compact desktop/tablet widths with fully visible, static content. */
    for (const width of [320, 768]) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 900 });
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await page.goto(BASE, { waitUntil: 'networkidle2' });
      await waitForPreloader(page);
      check(`No horizontal overflow at ${width}px`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      check(`Profile photos fit at ${width}px`, await page.$$eval('.hero__portrait, .intro__portrait img, .background__portrait img, .contact__portrait', imgs => imgs.every(img => { const r = img.getBoundingClientRect(); return r.width > 0 && r.right <= innerWidth + 1 && r.left >= -1; })));
      await page.close();
    }

    /* ---------------- 404 ---------------- */
    const notFound = await browser.newPage();
    await notFound.setViewport({ width: 1280, height: 800 });
    const nfLogs = [];
    attachDiagnostics(notFound, nfLogs);
    await notFound.goto(`${BASE}/404`, { waitUntil: 'networkidle2' });
    await sleep(1200);

    const nfText = await notFound.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    check('404 page shows TEST FAILED', /test failed/i.test(nfText));
    check('404 page shows expected/actual report', /expected/i.test(nfText) && /actual/i.test(nfText) && /404/.test(nfText));
    const nfErrors = nfLogs.filter((l) => !l.includes('fonts.g'));
    check('No errors on 404 page', nfErrors.length === 0, nfErrors.slice(0, 3).join(' | '));
    await notFound.$eval('.nav__link[href="#skills"]', el => el.click());
    await notFound.waitForFunction(() => location.pathname === '/');
    check('404 navigation returns to the portfolio', new URL(notFound.url()).hash === '#skills');
    await notFound.close();
  } catch (error) {
    failures += 1;
    results.push(`FAIL  Suite crashed — ${error.message}`);
  } finally {
    if (browser) await browser.close();
    server.kill();
  }

  console.log('\n=== QA SMOKE REPORT ===\n');
  results.forEach((line) => console.log(line));
  console.log(`\n${results.length - failures}/${results.length} checks passed`);
  process.exit(failures ? 1 : 0);
}

function pathToFileSafe(candidate) {
  try {
    return fs.existsSync(candidate);
  } catch {
    return false;
  }
}

run();
