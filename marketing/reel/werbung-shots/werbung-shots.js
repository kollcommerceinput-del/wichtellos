// Bildschirmfotos für Werbevideos „Wichteln im Büro“ + „Ohne Handy – für Kinder“ (Video-Sitzung 18.11.), Handy 390x753 @3 = 1170x2259
// Server: cd website && python -m http.server 8766   dann: node marketing/reel/werbung-shots/werbung-shots.js
const fs = require('fs'), path = require('path');
const { chromium, devices } = require(path.join(__dirname, '../../../node_modules/playwright'));
const OUT = __dirname, BASE = process.argv[2] || 'http://localhost:8766/';
const LISTE = 'Müller, Anna <anna.mueller@firma.de>; Schulz, Ben <ben.schulz@firma.de>; Weber, Clara <clara.weber@firma.de>; Fischer, David <david.fischer@firma.de>; ' +
  'Wagner, Emma <emma.wagner@firma.de>; Becker, Felix <felix.becker@firma.de>; Hoffmann, Greta <greta.hoffmann@firma.de>; Koch, Hannes <hannes.koch@firma.de>; ' +
  'Richter, Ida <ida.richter@firma.de>; Klein, Jonas <jonas.klein@firma.de>; Wolf, Lena <lena.wolf@firma.de>; Neumann, Max <max.neumann@firma.de>; Braun, Nora <nora.braun@firma.de>';
const KINDER = { group: 'Klasse 2b 🎄', budget: '5 €', date: '2026-12-18', msg: '', people: ['Mia', 'Paul', 'Lina', 'Ben', 'Emma', 'Noah'], tips: [], exclusions: [] };
const auf = async (p, sel) => { await p.$eval(sel, (e) => e.scrollIntoView({ block: 'start' })); await p.evaluate(() => window.scrollBy(0, -10)); await p.waitForTimeout(300); };
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 753 }, deviceScaleFactor: 3 });
  const p = await c.newPage();
  // Büro: Liste in das erste Namensfeld einfügen (echtes paste-Ereignis wie aus Outlook/Teams)
  await p.goto(BASE); await p.evaluate(() => localStorage.clear()); await p.reload();
  await p.fill('#group', 'Weihnachtsfeier Team Vertrieb'); await p.fill('#budget', '20 €');
  await p.evaluate((text) => { const i = document.querySelector('#people input'); i.focus(); const dt = new DataTransfer(); dt.setData('text/plain', text);
    i.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); }, LISTE);
  await p.waitForTimeout(500); await auf(p, '#people');
  await p.screenshot({ path: path.join(OUT, 'buero-liste.png') });
  // Paare ausschließen: aufklappen, Anna ↔ Ben
  await p.$eval('#excl-card', (d) => { d.open = true; });
  await p.selectOption('#ex-a', { index: 1 }); await p.selectOption('#ex-b', { index: 2 }); await p.click('#add-excl'); await p.waitForTimeout(300);
  await auf(p, '#excl-card'); await p.screenshot({ path: path.join(OUT, 'buero-paare.png') });
  const btn = await p.$('button[type=submit]'); await btn.scrollIntoViewIfNeeded(); await btn.tap();
  await p.waitForTimeout(4500); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(OUT, 'buero-ergebnis.png') });
  // Kinder: Lose ohne Handy
  await p.goto(BASE); await p.evaluate((d) => { localStorage.clear(); localStorage.setItem('wichtellos-draft', JSON.stringify(d)); }, KINDER); await p.reload();
  const b2 = await p.$('button[type=submit]'); await b2.scrollIntoViewIfNeeded(); await b2.tap(); await p.waitForTimeout(4500);
  await p.click('#print-lose'); await p.waitForTimeout(800); await p.check('input[name="lose-mode"][value="name"]'); await p.waitForTimeout(600);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(OUT, 'kinder-umschalter.png') });
  // Druckansicht wie auf Papier (A4, Druck-CSS)
  const d = await b.newContext({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  const q = await d.newPage(); await q.goto(BASE);
  await q.evaluate((x) => { localStorage.clear(); localStorage.setItem('wichtellos-draft', JSON.stringify(x)); }, KINDER); await q.reload();
  await q.click('button[type=submit]'); await q.waitForTimeout(4500); await q.click('#print-lose'); await q.waitForTimeout(800);
  await q.check('input[name="lose-mode"][value="name"]'); await q.waitForTimeout(600); await q.emulateMedia({ media: 'print' }); await q.waitForTimeout(400);
  await q.screenshot({ path: path.join(OUT, 'kinder-lose.png') });
  await b.close(); console.log(fs.readdirSync(OUT).filter((f) => f.endsWith('.png')).join(', '));
})();
