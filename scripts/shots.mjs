import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const out = path.resolve(root, '.shots');
const PORT = 4174;
const BASE = `http://localhost:${PORT}`;

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];

const SECTIONS = [
  ['01-hero', null],
  ['02-intro', '#intro'],
  ['03-services', '#services'],
  ['04-work', '#work'],
  ['05-process', '#process'],
  ['06-bug', '#artifacts'],
  ['07-testcase', '#testcase'],
  ['08-api', '#api'],
  ['09-database', '#database'],
  ['10-debug', '#debug'],
  ['11-experience', '#experience'],
  ['12-skills', '#skills'],
  ['13-about', '#about'],
  ['14-philosophy', '#philosophy'],
  ['15-matrix', '#matrix'],
  ['16-toolbox', '#toolbox'],
  ['17-contact', '#contact'],
];

async function waitForServer(retries = 40) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const response = await fetch(BASE);
      if (response.ok) return;
    } catch {
      /* not ready */
    }
    await sleep(250);
  }
  throw new Error('server never came up');
}

async function waitForPreloader(page) {
  await page.waitForFunction(() => !document.querySelector('.preloader'), { timeout: 12000 });
}

async function main() {
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  const server = spawn(
    process.execPath,
    [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  server.stderr.on('data', (d) => process.stderr.write(d));

  const browser = await puppeteer.launch({
    executablePath: CHROME_CANDIDATES.find((c) => fs.existsSync(c)),
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
  });

  try {
    await waitForServer();

    /* ---------- DESKTOP ---------- */
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto(BASE, { waitUntil: 'networkidle2' });
    await waitForPreloader(page);
    await sleep(2200);
    await page.screenshot({ path: path.join(out, '01-hero.png') });

    for (const [name, selector] of SECTIONS.slice(1)) {
      if (!selector) continue;
      await page.evaluate((sel) => {
        document.querySelector(sel)?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }, selector);
      await sleep(1400);
      await page.screenshot({ path: path.join(out, `${name}.png`) });
    }

    /* Hover states */
    await page.evaluate(() => document.querySelector('#services')?.scrollIntoView({ block: 'center' }));
    await sleep(900);
    const service = await page.$('.service');
    if (service) {
      await service.hover();
      await sleep(700);
      await page.screenshot({ path: path.join(out, '18-service-hover.png') });
    }

    await page.evaluate(() => document.querySelector('#skills')?.scrollIntoView({ block: 'start' }));
    await sleep(900);
    const skill = await page.$('.skill__trigger');
    if (skill) {
      await skill.hover();
      await sleep(900);
      await page.screenshot({ path: path.join(out, '19-skill-open.png') });
    }

    await page.close();

    /* ---------- MOBILE ---------- */
    const mobile = await browser.newPage();
    await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await mobile.goto(BASE, { waitUntil: 'networkidle2' });
    await waitForPreloader(mobile);
    await sleep(2000);
    await mobile.screenshot({ path: path.join(out, '20-mobile-permission.png') });

    const skip = await mobile.$('.motion-permission .btn--ghost');
    if (skip) {
      await skip.click();
      await sleep(800);
    }
    await mobile.screenshot({ path: path.join(out, '20-mobile-hero.png') });

    await mobile.$eval('.nav__burger', (el) => el.click());
    await sleep(1300);
    await mobile.screenshot({ path: path.join(out, '21-mobile-menu.png') });

    await mobile.$eval('.menu__link[href="#skills"]', (el) => el.click());
    await sleep(2400);
    await mobile.screenshot({ path: path.join(out, '22-mobile-skills.png') });

    await mobile.evaluate(() => document.querySelector('#contact')?.scrollIntoView({ block: 'start' }));
    await sleep(1400);
    await mobile.screenshot({ path: path.join(out, '23-mobile-contact.png') });
    await mobile.close();

    /* ---------- TABLET ---------- */
    const tablet = await browser.newPage();
    await tablet.setViewport({ width: 834, height: 1112, isMobile: false, hasTouch: true, deviceScaleFactor: 1.5 });
    await tablet.goto(BASE, { waitUntil: 'networkidle2' });
    await waitForPreloader(tablet);
    await sleep(2000);
    await tablet.screenshot({ path: path.join(out, '24-tablet-hero.png') });
    await tablet.evaluate(() => document.querySelector('#work')?.scrollIntoView({ block: 'start' }));
    await sleep(1400);
    await tablet.screenshot({ path: path.join(out, '25-tablet-work.png') });
    await tablet.close();

    console.log(`screenshots written to ${out}`);
  } finally {
    await browser.close();
    server.kill();
  }
}

main();
