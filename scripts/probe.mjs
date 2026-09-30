import puppeteer from 'puppeteer-core';

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
});
const p = await b.newPage();
await p.setViewport({ width: 500, height: 240 });
await p.setContent(
  '<body style="margin:0;background:#fff"><h1 style="font:900 72px sans-serif;padding:60px">KLMN-3391</h1></body>'
);
await p.screenshot({ path: 'D:/projects/shakti/.shots/probe-klmn.png' });
await b.close();
console.log('probe written');
