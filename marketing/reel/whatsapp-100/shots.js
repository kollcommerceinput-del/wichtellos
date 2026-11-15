// Scharfe Bildschirmfotos (390x753 @3) für Reel „POV: Du sollst das Wichteln organisieren“ (Toni 15.11.)
// Server: cd website && python -m http.server 8766   dann: node marketing/reel/whatsapp-100/shots.js
const fs = require('fs'), path = require('path');
const { chromium, devices } = require(path.join(__dirname, '../../../node_modules/playwright'));
const OUT = path.join(__dirname, 'shots'), BASE = process.argv[2] || 'http://localhost:8766/';
const ENTWURF = { group: 'Wichtel-Gruppe 🎁', budget: '30,00 €', date: '2026-12-24', msg: 'Strengt euch an, der Wichtel beobachtet alles von seiner kleinen Tür aus! 👀',
  people: ['Anna', 'Ben', 'Clara'], tips: ['Liebt Schokolade und spannende Bücher', 'Mag Kaffee, hasst Lakritz', 'Freut sich über alles, was glitzert'], exclusions: [] };
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 753 }, deviceScaleFactor: 3 });
  const p = await c.newPage();
  await p.goto(BASE); await p.evaluate((d) => { localStorage.clear(); localStorage.setItem('wichtellos-draft', JSON.stringify(d)); }, ENTWURF); await p.reload();
  await p.$eval('#group', (e) => e.closest('.card').scrollIntoView({ block: 'start' })); await p.evaluate(() => window.scrollBy(0, -10));
  await p.waitForTimeout(400); await p.screenshot({ path: path.join(OUT, '1-formular.png') });
  await p.$eval('#people', (e) => e.closest('.card').scrollIntoView({ block: 'start' })); await p.evaluate(() => window.scrollBy(0, -10));
  await p.screenshot({ path: path.join(OUT, '2-namen.png') });
  const btn = await p.$('button[type=submit]'); await btn.scrollIntoViewIfNeeded(); await btn.tap();
  await p.waitForTimeout(4500); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(OUT, '3-ergebnis.png') });
  const links = await p.evaluate(() => JSON.parse(localStorage.getItem('wichtellos-result')).links);
  const q = await c.newPage(); await q.goto(links[1].url); await q.waitForTimeout(600);
  await q.screenshot({ path: path.join(OUT, '4-link.png') });
  await q.tap('#reveal-btn'); await q.waitForTimeout(1500);
  await q.$eval('.reveal', (e) => e.scrollIntoView({ block: 'start' })); await q.evaluate(() => window.scrollBy(0, -10));
  await q.screenshot({ path: path.join(OUT, '5-aufgedeckt.png') });
  await b.close(); console.log(fs.readdirSync(OUT).join(', '));
})();
