// Bildschirmfotos für das Reel „Handy in der Hand“ (iPhone-Größe 390x844 @3). Lokal: node marketing/reel/handy-auslosen/shots.js http://localhost:8766/
const fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const OUT = path.join(__dirname, 'shots');
const BASE = process.argv[2] || 'https://wichtellos.de/';
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 753 }, deviceScaleFactor: 3 }); // 844 minus Status- und Adresszeile
  const p = await c.newPage();
  await p.goto(BASE); await p.evaluate(() => localStorage.clear()); await p.reload();
  const toForm = async () => { await p.$eval('#people', (e) => e.closest('.card').scrollIntoView({ block: 'start' })); await p.evaluate(() => window.scrollBy(0, -12)); };
  await toForm(); await p.screenshot({ path: path.join(OUT, '1-leer.png') });
  for (let i = 0; i < 3; i++) await p.tap('#add-person');
  const names = ['Anna', 'Ben', 'Clara', 'David', 'Emma', 'Finn'];
  const rows = await p.$$('#people .person');
  for (let i = 0; i < names.length; i++) {
    await (await rows[i].$('input')).fill(names[i]);
    if (i === 2) { await toForm(); await p.screenshot({ path: path.join(OUT, '2-halb.png') }); }
  }
  await toForm(); await p.screenshot({ path: path.join(OUT, '3-namen.png') });
  const btn = await p.$('button[type=submit]'); await btn.scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, 200));
  const bb = await btn.boundingBox(); fs.writeFileSync(path.join(OUT, 'knopf.json'), JSON.stringify(bb));
  await p.screenshot({ path: path.join(OUT, '4-knopf.png') });
  await btn.tap(); await p.waitForTimeout(400); await p.evaluate(() => window.scrollTo(0, 0));
  await p.screenshot({ path: path.join(OUT, '5-ergebnis.png') });
  await p.waitForTimeout(4500); await p.screenshot({ path: path.join(OUT, '5b-ergebnis.png') });
  const links = await p.evaluate(() => JSON.parse(localStorage.getItem('wichtellos-result')).links);
  const q = await c.newPage(); await q.goto(links[1].url); await q.waitForTimeout(500);
  await q.screenshot({ path: path.join(OUT, '6-link.png') });
  await q.tap('#reveal-btn'); await q.waitForTimeout(1300);
  await q.$eval('.reveal', (e) => e.scrollIntoView({ block: 'start' })); await q.evaluate(() => window.scrollBy(0, -10));
  await q.screenshot({ path: path.join(OUT, '7-aufgedeckt.png') });
  await b.close(); console.log(fs.readdirSync(OUT).join(', '));
})();
