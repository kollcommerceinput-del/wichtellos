// Erzeugt Vorschaubilder (1200x630) je Ratgeberseite nach og/<slug>.png – build.py nimmt sie automatisch als og:image
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'og');
const svg = (f) => fs.readFileSync(path.join(ROOT, 'grafik', f), 'utf8');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

// [Slug = Pfad ohne Schrägstriche, Pose, Titel, Untertitel]
const PAGES = [
  ['wichtelgeschenke-unter-5-euro', 'wichtel-geschenk.svg', 'Wichtelgeschenke unter 5 €', '12 kleine Ideen mit großer Wirkung'],
  ['wichtelgeschenke-unter-10-euro', 'wichtel-geschenk.svg', 'Wichtelgeschenke unter 10 €', '12 Ideen – auch für Kollegen'],
  ['wichtelgeschenke-unter-15-euro', 'wichtel-geschenk.svg', 'Wichtelgeschenke unter 15 €', '12 Ideen mit etwas mehr Spielraum'],
  ['wichtelgeschenke-unter-20-euro', 'wichtel-geschenk.svg', 'Wichtelgeschenke unter 20 €', '12 Ideen für Familie & Freunde'],
  ['wichtelgeschenke-unter-30-euro', 'wichtel-geschenk.svg', 'Wichtelgeschenke unter 30 €', '12 Ideen mit Wow-Effekt'],
  ['geschenkfinder', 'wichtel-lupe.svg', 'Geschenkfinder fürs Wichteln', 'Über 100 Ideen nach Alter, Budget & Interessen'],
  ['wichtelgeschenke-fuer-kinder', 'wichtel-winkt.svg', 'Wichtelgeschenke für Kinder', 'Ideen von 3 bis 12 Jahren und für Teens'],
  ['wichtelgeschenke-selber-machen', 'wichtel-geschenk.svg', 'Wichtelgeschenke selber machen', 'Einfache DIY-Ideen mit Anleitung'],
  ['wichteln-wuerfeln-regeln', 'wichtel-wuerfel.svg', 'Wichteln mit Würfeln', 'Regeln, Ablauf & Varianten'],
  ['schrottwichteln', 'wichtel-wuerfel.svg', 'Schrottwichteln', 'Regeln & 24 lustige Ideen'],
  ['wichteln-einladung-vorlage', 'wichtel-geschenk.svg', 'Einladung zum Aushängen', 'Wir wichteln! Vorlage mit Teilnehmerliste'],
  ['wichteln-im-buero', 'wichtel-winkt.svg', 'Wichteln im Büro', 'Regeln, Budget & Ablauf fürs Team'],
  ['wichteln-schule-kita', 'wichtel-geschenk.svg', 'Wichteln in Schule & Kita', 'Ablauf, Elternbrief & Lose ohne Handy'],
  ['weihnachtsfeier-ideen', 'wichtel-winkt.svg', 'Weihnachtsfeier-Ideen', '10 Ideen fürs Team – vom Markt bis online'],
  ['wichtelgedichte', 'wichtel-geschenk.svg', 'Wichtelgedichte', 'Kurze Reime für die Geschenk-Karte'],
  ['woher-kommt-wichteln', 'wichtel-lupe.svg', 'Woher kommt Wichteln?', 'Wichtel, Julklapp & Secret Santa'],
  ['wichteltuer', 'wichtel-geschenk.svg', 'Wichteltür', 'Ideen, 24 Streiche & Zubehör für den Advent'],
];

const html = ([, pose, title, sub]) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1200px;height:630px;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;position:relative;overflow:hidden}
.stripe{position:absolute;top:0;left:0;right:0;height:22px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
.lights{position:absolute;top:22px;left:0;right:0;display:flex}.lights svg{width:50%;height:auto;display:block}
.pose{position:absolute;left:70px;top:150px;width:300px;height:340px;display:flex;align-items:center;justify-content:center}
.pose svg{height:340px;width:auto}
.txt{position:absolute;left:420px;right:70px;top:150px;height:340px;display:flex;flex-direction:column;justify-content:center}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:76px;line-height:1.05;margin:0}
.line{width:130px;height:8px;border-radius:4px;background:#f2b705;margin:26px 0}
p{font-size:38px;line-height:1.25;margin:0;color:#6d5d57}
.foot{position:absolute;bottom:0;left:0;right:0;height:86px;background:#c62828;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 70px}
.url{font-family:Fredoka,sans-serif;font-size:44px}
.tag{font-size:26px;opacity:.92}
</style></head><body>
<div class="stripe"></div><div class="lights">${svg('lichterkette.svg')}${svg('lichterkette.svg')}</div>
<div class="pose">${svg(pose)}</div>
<div class="txt"><h1>${title}</h1><div class="line"></div><p>${sub}</p></div>
<div class="foot"><span class="url">wichtellos.de</span><span class="tag">Wichteln online auslosen · kostenlos</span></div>
</body></html>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const pg of PAGES) {
    await p.setContent(html(pg));
    await p.evaluate(() => document.fonts.ready);
    const fits = await p.evaluate(() => { const t = document.querySelector('.txt'); return t.scrollHeight <= t.clientHeight + 1; });
    if (!fits) console.warn('Text zu lang:', pg[0]);
    await p.screenshot({ path: path.join(OUT, `${pg[0]}.png`) });
  }
  await b.close();
  console.log(PAGES.length + ' Vorschaubilder in og/');
})();
