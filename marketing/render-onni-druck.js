// Druckvorlagen mit Onni (dem WichtelLos-Wichtel) als A4-PDF nach fotos/onni/
//   ausmal-<name>.pdf + ausmalbilder-alle.pdf  – Ausmalbilder (Quelle marketing/onni/ausmal-*.png, KI-Linienbilder aus Google Flow)
//   tuer-begruessung.pdf, tuer-abschied.pdf     – Wichtelbriefe, 4 pro Seite (A6) zum Ausschneiden
//   tuer-urkunde.pdf, tuer-schilder.pdf         – Urkunde und kleine Türschilder
// node marketing/render-onni-druck.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'fotos', 'onni');
const ONNI = path.join(__dirname, 'onni');
const png = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(ONNI, f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const AUSMAL = ['geschenk', 'baum', 'laterne', 'kekse', 'los', 'tuer'];

const CSS = `@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
@page{size:A4;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:'Segoe UI',system-ui,sans-serif;color:#2b1b17}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always}
.page:last-child{page-break-after:auto}
.fred{font-family:Fredoka,sans-serif;font-weight:600}
.foot{position:absolute;left:0;right:0;bottom:8mm;text-align:center;font-size:8.5pt;color:#8a7a72}
/* Ausmalbild */
.am .name{position:absolute;top:12mm;left:15mm;right:15mm;font-size:20pt;display:flex;gap:4mm;align-items:flex-end}
.am .name span{flex:1;border-bottom:1.2pt solid #2b1b17;height:9mm}
.am img{position:absolute;top:28mm;left:15mm;width:180mm;height:241mm;object-fit:contain}
/* 4 kleine Briefe (A6) pro Seite */
.grid4{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;width:210mm;height:297mm}
.grid4>div{border:0.6pt dashed #c9b8ae;padding:9mm 9mm 7mm;position:relative}
.brief h2{font-family:Fredoka,sans-serif;font-weight:600;font-size:19pt;margin:0 0 4mm;color:#c62828}
.brief p{font-size:12pt;line-height:1.42;margin:0 0 3mm}
.brief .line{display:inline-block;min-width:30mm;border-bottom:0.8pt solid #2b1b17}
.brief img{position:absolute;right:6mm;bottom:5mm;width:33mm}
.brief .gruss{font-family:Fredoka,sans-serif;font-weight:600;font-size:14pt;margin-top:4mm}
/* Urkunde */
.urk{display:flex;flex-direction:column;align-items:center;text-align:center;padding:24mm 22mm}
.urk .rahmen{position:absolute;inset:10mm;border:3pt solid #c62828;border-radius:8mm}
.urk .rahmen2{position:absolute;inset:13mm;border:1pt solid #f2b705;border-radius:6mm}
.urk h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:40pt;color:#c62828;margin:6mm 0 2mm}
.urk .sub{font-size:14pt;color:#6d5d57;margin:0 0 10mm}
.urk img{width:62mm;margin:2mm 0 8mm}
.urk p{font-size:15pt;line-height:1.5;margin:0 0 4mm}
.urk .big{display:block;width:130mm;border-bottom:1.2pt solid #2b1b17;height:14mm;margin:2mm auto 8mm}
.urk .foot{bottom:16mm}
.urk .sig{display:flex;gap:24mm;margin-top:14mm;font-size:11pt;color:#6d5d57}
.urk .sig div{width:60mm;border-top:1pt solid #2b1b17;padding-top:2mm}
/* Türschilder: 6 pro Seite */
.grid6{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);width:210mm;height:297mm}
.grid6>div{border:0.6pt dashed #c9b8ae;display:flex;align-items:center;justify-content:center;padding:8mm}
.schild{width:84mm;height:70mm;border:2.4pt solid #c62828;border-radius:6mm;background:#fff8f0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4mm}
.schild img{height:30mm;margin-bottom:2mm}
.schild b{font-family:Fredoka,sans-serif;font-weight:600;font-size:15pt;line-height:1.15;color:#c62828}
.schild small{font-size:9.5pt;color:#6d5d57;margin-top:1.5mm}`;

const doc = (body) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`;
const FOOT = '<div class="foot">Onni, der Wichtel von wichtellos.de · kostenlos für zu Hause, Kita und Schule</div>';

const ausmal = (n) => `<div class="page am"><div class="name fred">Mein Wichtel heißt:<span></span></div>
<img src="${png(`ausmal-${n}.png`)}">${FOOT}</div>`;

const begr = () => `<div class="brief"><h2>Hallo, ihr Lieben!</h2>
<p>Ich bin <span class="line"></span>, euer Wichtel. Heute Nacht bin ich bei euch eingezogen, weil es hier so gemütlich ist.</p>
<p>Bis Weihnachten wohne ich hinter meiner kleinen Tür. Sehen werdet ihr mich nie – aber ihr werdet merken, dass ich da bin. Ich habe nämlich viel Quatsch im Kopf!</p>
<p>Wenn ihr mir schreiben wollt, legt einen Brief vor meine Tür. Ich antworte, so oft ich kann.</p>
<p class="gruss">Euer Wichtel</p><img src="${png('sticker-winkt.png')}"></div>`;

const absch = () => `<div class="brief"><h2>Frohe Weihnachten!</h2>
<p>Heute ist Heiligabend – und für mich wird es Zeit, nach Hause zu ziehen. Ich hatte so eine schöne Zeit bei euch!</p>
<p>Danke für eure Briefe, die Kekse und dass ihr meine Tür nie aufgemacht habt. Ich habe euch ein kleines Abschiedsgeschenk dagelassen.</p>
<p>Nächstes Jahr komme ich wieder. Versprochen!</p>
<p class="gruss">Euer <span class="line"></span></p><img src="${png('sticker-geschenk.png')}"></div>`;

const urkunde = () => `<div class="page urk"><div class="rahmen"></div><div class="rahmen2"></div>
<h1>Wichtel-Urkunde</h1><p class="sub">für die allerbesten Wichtel-Freunde</p>
<img src="${png('sticker-herz.png')}">
<p>Hiermit ernenne ich</p><span class="big"></span>
<p>zum offiziellen Wichtel-Freund.<br>Du hast meine Tür nie geöffnet, mir Briefe geschrieben<br>und Kekse dagelassen – danke, das war wichtel-stark!</p>
<div class="sig"><div>Datum</div><div>Dein Wichtel</div></div>${FOOT}</div>`;

const SCHILDER = [
  ['sticker-schlaeft.png', 'Psst!<br>Hier schläft ein Wichtel', 'Bitte nicht klopfen'],
  ['sticker-winkt.png', 'Willkommen<br>bei Wichtels', 'Tür bitte nicht öffnen'],
  ['sticker-psst.png', 'Geheim!', 'Nur für Wichtel'],
  ['sticker-geschenk.png', 'Briefkasten', 'Briefe für den Wichtel hier ablegen'],
  ['sticker-herz.png', 'Hier wohnt<br><span style="display:inline-block;width:52mm;border-bottom:1.2pt solid #2b1b17;height:7mm"></span>', 'unser Wichtel'],
  ['sticker-lupe.png', 'Bin gleich zurück!', 'Wichtel unterwegs'],
];
const schilder = () => `<div class="page"><div class="grid6">${SCHILDER.map(([img, b, s]) =>
  `<div><div class="schild"><img src="${png(img)}"><b>${b}</b><small>${s}</small></div></div>`).join('')}</div></div>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage();
  const pdf = async (name, body) => {
    await p.setContent(doc(body), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(OUT, name), format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log(name, Math.round(fs.statSync(path.join(OUT, name)).size / 1024) + ' KB');
  };
  for (const n of AUSMAL) await pdf(`ausmal-${n}.pdf`, ausmal(n));
  await pdf('ausmalbilder-alle.pdf', AUSMAL.map(ausmal).join(''));
  await pdf('tuer-begruessung.pdf', `<div class="page"><div class="grid4">${[1, 2, 3, 4].map(() => `<div>${begr()}</div>`).join('')}</div></div>`);
  await pdf('tuer-abschied.pdf', `<div class="page"><div class="grid4">${[1, 2, 3, 4].map(() => `<div>${absch()}</div>`).join('')}</div></div>`);
  await pdf('tuer-urkunde.pdf', urkunde());
  await pdf('tuer-schilder.pdf', schilder());
  // Vorschaubilder der Wichteltür-Vorlagen für die Website
  for (const [name, body] of [['tuer-begruessung', `<div class="page"><div class="grid4">${[1, 2, 3, 4].map(() => `<div>${begr()}</div>`).join('')}</div></div>`],
    ['tuer-abschied', `<div class="page"><div class="grid4">${[1, 2, 3, 4].map(() => `<div>${absch()}</div>`).join('')}</div></div>`],
    ['tuer-urkunde', urkunde()], ['tuer-schilder', schilder()]]) {
    const q = await b.newPage({ viewport: { width: 794, height: 1123 } });
    await q.setContent(doc(body), { waitUntil: 'load' });
    await q.evaluate(() => document.fonts.ready);
    await q.screenshot({ path: path.join(ONNI, `${name}-vorschau.png`) });
    await q.close();
  }
  await b.close();
})();
