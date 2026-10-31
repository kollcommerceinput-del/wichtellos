// Echte Bildschirmaufnahmen der Live-Seite für das Reel (Fantasienamen, Handy-Ansicht 390 px @2x)
const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');
const OUT = path.join(__dirname, 'shots');
const BASE = process.argv[2] || 'https://wichtellos.de/';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const c = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  const p = await c.newPage();
  await p.goto(BASE);
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await p.fill('#group', 'Büro-Weihnachten 2026');
  await p.fill('#budget', '15 €');
  for (let i = 0; i < 2; i++) await p.tap('#add-person');
  const names = ['Anna', 'Ben', 'Clara', 'Dirk', 'Emil'];
  const rows = await p.$$('#people .person');
  for (let i = 0; i < names.length; i++) await (await rows[i].$('input')).fill(names[i]);
  // Tipp bei Anna zeigen
  await (await rows[0].$('.tip-btn')).tap();
  await (await p.$$('#people .tip-input'))[0].fill('mag Tee, keine Süßigkeiten');
  await p.$eval('#people', (e) => e.closest('.card').scrollIntoView({ block: 'start' }));
  await p.evaluate(() => window.scrollBy(0, -12));
  await p.screenshot({ path: path.join(OUT, '1-namen.png') });

  await p.tap('button[type=submit]');
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(OUT, '2-ergebnis.png') });
  await p.tap('#print-lose');
  await p.waitForSelector('#view-print:not([hidden]) .los svg');
  await p.$eval('#lose', (e) => e.scrollIntoView({ block: 'start' }));
  await p.evaluate(() => window.scrollBy(0, -10));
  await p.screenshot({ path: path.join(OUT, '3-lose.png') });

  // Druckbogen als Bild (A4)
  const d = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  await d.goto(BASE);
  await d.evaluate((r) => localStorage.setItem('wichtellos-result', r), await p.evaluate(() => localStorage.getItem('wichtellos-result')));
  await d.reload();
  await d.click('#show-last');
  await d.click('#print-lose');
  await d.waitForSelector('#view-print:not([hidden]) .los svg');
  await d.emulateMedia({ media: 'print' });
  await d.screenshot({ path: path.join(OUT, '4-druckbogen.png'), fullPage: false });

  // Aufdecken: Link von Clara (bekommt ggf. Annas Tipp) – wir nehmen den, der Anna zieht
  const links = await p.evaluate(() => JSON.parse(localStorage.getItem('wichtellos-result')).links);
  let shot = false;
  for (const l of links) {
    const q = await c.newPage();
    await q.goto(l.url);
    await q.tap('#reveal-btn');
    await q.waitForTimeout(1100);
    const target = await q.textContent('#r-target');
    if (target === 'Anna' || (!shot && l === links[links.length - 1])) {
      await q.$eval('.reveal', (e) => e.scrollIntoView({ block: 'start' }));
      await q.evaluate(() => window.scrollBy(0, -10));
      await q.screenshot({ path: path.join(OUT, '5-aufgedeckt.png') });
      shot = true;
      await q.close();
      break;
    }
    await q.close();
  }
  await b.close();
  console.log('Aufnahmen:', fs.readdirSync(OUT).join(', '));
})();
