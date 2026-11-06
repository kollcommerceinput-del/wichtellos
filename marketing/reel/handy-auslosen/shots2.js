// Website-Bildschirme für das Reel in Tonis Handy-Format (360 CSS-px breit @3 = 1080), lange Seiten zum Wischen.
const fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const OUT = path.join(__dirname, 'lang'); fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || 'http://localhost:8766/';
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ ...devices['Galaxy S9+'], viewport: { width: 360, height: 637 }, deviceScaleFactor: 3 });
  const p = await c.newPage();
  await p.goto(BASE); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
  await p.fill('#group', 'Büro-Wichteln'); await p.fill('#budget', '15 €');
  for (let i = 0; i < 3; i++) await p.tap('#add-person');
  const names = ['Anna', 'Ben', 'Clara', 'David', 'Emma', 'Finn'];
  const rows = await p.$$('#people .person');
  for (let i = 0; i < names.length; i++) await (await rows[i].$('input')).fill(names[i]);
  await p.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
  await p.waitForTimeout(500);
  // Positionen merken (für Wischen + Tipp-Punkt)
  const pos = await p.evaluate(() => {
    const y = (s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { y: r.top + scrollY, x: r.left + r.width / 2, h: r.height }; };
    return { gruppe: y('#group'), namen: y('#people'), knopf: y('button[type=submit]') };
  });
  await p.screenshot({ path: path.join(OUT, 'a-formular.png'), fullPage: true });
  await p.tap('button[type=submit]'); await p.waitForTimeout(4500); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  const ergebnis = await p.evaluate(() => { const e = document.querySelector('.share-wa, [data-share=wa], a[href*="wa.me"]'); if (!e) return null; const r = e.getBoundingClientRect(); return { y: r.top + scrollY, x: r.left + r.width / 2 }; });
  await p.screenshot({ path: path.join(OUT, 'b-ergebnis.png'), fullPage: true });
  const links = await p.evaluate(() => JSON.parse(localStorage.getItem('wichtellos-result')).links);
  const anna = links.find((l) => l.name === 'Anna') || links[0];
  // geheimer Link in „Edge“ (dunkel, wie auf Tonis Handy)
  const d = await b.newContext({ ...devices['Galaxy S9+'], viewport: { width: 360, height: 587 }, deviceScaleFactor: 3, colorScheme: 'dark' });
  const q = await d.newPage(); await q.goto(anna.url); await q.waitForTimeout(800);
  const btn = await q.evaluate(() => { const r = document.querySelector('#reveal-btn').getBoundingClientRect(); return { y: r.top + scrollY, x: r.left + r.width / 2 }; });
  await q.screenshot({ path: path.join(OUT, 'c-link.png') });
  await q.tap('#reveal-btn'); await q.waitForTimeout(4500);
  await q.screenshot({ path: path.join(OUT, 'd-aufgedeckt.png') });
  const ziel = await q.textContent('#r-target');
  fs.writeFileSync(path.join(OUT, 'pos.json'), JSON.stringify({ ...pos, ergebnis, btn, ziel, anna: anna.name }, null, 1));
  await b.close(); console.log('ok', ziel, JSON.stringify(pos));
})();
