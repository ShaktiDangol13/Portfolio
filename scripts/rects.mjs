import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PORT = 4175;
const BASE = `http://localhost:${PORT}`;

async function main() {
  const server = spawn(
    process.execPath,
    [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }
  );

  for (let i = 0; i < 40; i += 1) {
    try {
      const r = await fetch(BASE);
      if (r.ok) break;
    } catch {
      /* wait */
    }
    await sleep(250);
  }

  const browser = await puppeteer.launch({
    executablePath: [
      'C:/Program Files/Google/Chrome/Application/chrome.exe',
      'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    ].find((c) => fs.existsSync(c)),
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => !document.querySelector('.preloader'), { timeout: 12000 });
    await sleep(2500);

    const data = await page.evaluate(() => {
      const pick = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          sel,
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      };
      const selectors = [
        '.hero',
        '.hero__top',
        '.hero__title',
        '.hero__line:first-child',
        '.hero__row',
        '.hero__bottom',
        '.hero__meta',
        '.hero__availability',
        '.hero__scroll',
        '.hero__statement',
        '.qa-card--bug',
        '.qa-card--postman',
        '.qa-card--sql',
        '.qa-card--testcase',
        '.qa-card--network',
        '.qa-card--status',
      ];
      return {
        viewport: { w: window.innerWidth, h: window.innerHeight },
        boxes: selectors.map(pick).filter(Boolean),
      };
    });

    console.log(JSON.stringify(data, null, 2));
  } finally {
    await browser.close();
    server.kill();
  }
}

main();
