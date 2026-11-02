// Pinterest-Pins (1000x1500) mit Onni für die Kinder-/Druck-Inhalte nach marketing/pins-onni/
//   ausmalbilder  -> /wichtel-ausmalbilder/            (Collage aus 4 Ausmalbildern)
//   sticker       -> /wichtel-ausmalbilder/#sticker    (8 WhatsApp-Sticker)
//   wichtelnamen  -> /wichteltuer/#wichtelname         (Namenswolke + Onni)
//   tuer-vorlagen -> /wichteltuer/                     (Brief, Urkunde, Türschilder)
// Bilder: KI aus Google Flow -> beim Hochladen auf Pinterest „KI-modifiziert“ markieren, Themen + Alt-Text setzen.
// node marketing/render-pins-onni.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'pins-onni');
const ONNI = path.join(__dirname, 'onni');
const png = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(ONNI, f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const CSS = `@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1000px;height:1500px;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;position:relative;text-align:center}
body::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 30px 40px,rgba(242,183,5,.55) 0 4px,transparent 5px),radial-gradient(circle at 150px 120px,rgba(198,40,40,.3) 0 3px,transparent 4px),radial-gradient(circle at 90px 200px,rgba(31,111,74,.3) 0 3px,transparent 4px);background-size:240px 240px}
.stripe{position:absolute;top:0;left:0;right:0;height:22px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
.badge{display:inline-block;background:#1f6f4a;color:#fff;font-family:Fredoka,sans-serif;font-size:40px;padding:10px 34px;border-radius:999px}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:96px;line-height:1.02;margin:18px 0 0}
h1 em{font-style:normal;color:#c62828}
.line{width:160px;height:9px;border-radius:5px;background:#f2b705;margin:24px auto}
.sub{font-size:44px;line-height:1.3;margin:0;color:#6d5d57}
.head{position:absolute;left:50px;right:50px;top:70px}
.stage{position:absolute;left:0;right:0}
.foot{position:absolute;bottom:0;left:0;right:0;background:#c62828;color:#fff;padding:36px 40px 42px}
.url{font-family:Fredoka,sans-serif;font-size:62px}
.tag{font-size:32px;opacity:.92;margin-top:4px}
.sheet{position:absolute;background:#fff;padding:14px;border-radius:10px;box-shadow:0 14px 34px rgba(43,27,23,.22)}
.sheet img{display:block;width:100%;height:auto}
.onni{position:absolute;filter:drop-shadow(0 10px 16px rgba(43,27,23,.25))}`;

const doc = (body) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="stripe"></div>${body}</body></html>`;
const foot = (cta) => `<div class="foot"><div class="url">wichtellos.de</div><div class="tag">${cta}</div></div>`;

const PINS = {
  ausmalbilder: doc(`<div class="head"><span class="badge">Gratis zum Ausdrucken</span>
<h1>Wichtel-<br><em>Ausmalbilder</em></h1><div class="line"></div><p class="sub">6 Motive als A4-PDF – für Kita, Schule & zu Hause</p></div>
<div class="stage" style="top:560px;height:790px">
  <div class="sheet" style="left:40px;top:60px;width:370px;transform:rotate(-7deg)"><img src="${png('ausmal-baum.png')}"></div>
  <div class="sheet" style="left:590px;top:50px;width:370px;transform:rotate(6deg)"><img src="${png('ausmal-kekse.png')}"></div>
  <div class="sheet" style="left:300px;top:10px;width:400px;transform:rotate(-1deg);z-index:2"><img src="${png('ausmal-geschenk.png')}"></div>
  <img class="onni" src="${png('sticker-winkt.png')}" style="left:10px;top:500px;width:270px;z-index:3">
</div>${foot('6 Ausmalbilder kostenlos herunterladen →')}`),

  sticker: doc(`<div class="head"><span class="badge">Kostenlos</span>
<h1>Wichtel-Sticker<br>für <em>WhatsApp</em></h1><div class="line"></div><p class="sub">8 süße Sticker von Wichtel Onni</p></div>
<div class="stage" style="top:540px;height:800px;display:grid;grid-template-columns:repeat(4,1fr);gap:4px 0;padding:0 40px;align-content:center">
  ${['winkt', 'geschenk', 'psst', 'daumen', 'herz', 'schlaeft', 'jubel', 'lupe'].map((s, i) =>
    `<img src="${png(`sticker-${s}.png`)}" style="width:240px;transform:rotate(${[-6, 4, -3, 6, 5, -5, 3, -4][i]}deg);filter:drop-shadow(0 8px 12px rgba(43,27,23,.2))">`).join('')}
</div>${foot('Sticker gratis herunterladen →')}`),

  wichtelnamen: doc(`<div class="head"><span class="badge">Für die Wichteltür</span>
<h1>Wie heißt<br>dein <em>Wichtel?</em></h1><div class="line"></div><p class="sub">36 Wichtelnamen mit Bedeutung – plus Begrüßungsbrief</p></div>
<div class="stage" style="top:590px;height:720px">
  ${[['Onni', 70, 60, 20, '#c62828', 6], ['Lumi', 52, 150, 650, '#1f6f4a', -4], ['Pelle', 48, 40, 690, '#2b1b17', 5], ['Svea', 50, 330, 640, '#c62828', -6],
     ['Nisse', 46, 520, 40, '#1f6f4a', -5], ['Ronja', 46, 395, 40, '#2b1b17', 4], ['Pippa', 48, 250, 30, '#c62828', -4],
     ['Tomte', 42, 560, 650, '#c62828', 3], ['Smilla', 44, 230, 700, '#1f6f4a', 7]]
    .map(([n, s, t, l, c, r]) => `<span style="position:absolute;top:${t}px;left:${l}px;font-family:Fredoka,sans-serif;font-size:${s}px;color:${c};background:#fff;padding:8px 26px;border-radius:999px;box-shadow:0 8px 20px rgba(43,27,23,.12);transform:rotate(${r}deg)">${n}</span>`).join('')}
  <img class="onni" src="${png('sticker-winkt.png')}" style="left:320px;top:250px;width:360px">
</div>${foot('Namen-Generator ausprobieren →')}`),

  'tuer-vorlagen': doc(`<div class="head"><span class="badge">Gratis zum Ausdrucken</span>
<h1>Wichteltür-<br><em>Vorlagen</em></h1><div class="line"></div><p class="sub">Begrüßungsbrief, Abschiedsbrief, Urkunde & Türschilder</p></div>
<div class="stage" style="top:580px;height:760px">
  <div class="sheet" style="left:40px;top:60px;width:390px;transform:rotate(-6deg);padding:8px"><img src="${png('tuer-begruessung-vorschau.png')}"></div>
  <div class="sheet" style="left:570px;top:60px;width:390px;transform:rotate(5deg);padding:8px"><img src="${png('tuer-schilder-vorschau.png')}"></div>
  <div class="sheet" style="left:300px;top:10px;width:400px;transform:rotate(-1deg);z-index:2;padding:8px"><img src="${png('tuer-urkunde-vorschau.png')}"></div>
  <img class="onni" src="${png('sticker-schlaeft.png')}" style="left:720px;top:500px;width:260px;z-index:3">
</div>${foot('Alle Vorlagen kostenlos →')}`),
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  for (const [name, html] of Object.entries(PINS)) {
    await p.setContent(html, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `pin-${name}.png`) });
  }
  await b.close();
  console.log(Object.keys(PINS).length + ' Pins in ' + OUT);
})();
