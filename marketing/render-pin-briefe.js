// Pinterest-Pin (1000x1500) für die „24 Briefe von Onni“ (/wichteltuer/#briefe): Titelseite + Briefseite schräg übereinander.
// Bilder aus marketing/kofi-briefe/ (Screenshots der Vorlage aus G:\wichtellos-content). Ausgabe: marketing/pins-onni/pin-briefe.png
// Beim Hochladen als KI-Inhalt kennzeichnen.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const img = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'kofi-briefe', f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1000px;height:1500px;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;position:relative;text-align:center}
.top{position:absolute;top:56px;left:50px;right:50px}
.badge{display:inline-block;background:#1f6f4a;color:#fff;font-family:Fredoka,sans-serif;font-size:34px;padding:8px 26px;border-radius:999px}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:92px;line-height:1.02;margin:22px 0 0;color:#2b1b17}
h1 span{color:#c62828}
p{font-size:40px;line-height:1.3;margin:18px 0 0;color:#6d5d57}
.c{position:absolute;width:470px;border-radius:14px;box-shadow:0 18px 40px rgba(43,27,23,.28);background:#fff}
.c1{left:50px;top:520px;transform:rotate(-5deg)}
.c2{right:50px;top:580px;transform:rotate(4deg)}
.foot{position:absolute;bottom:0;left:0;right:0;background:#c62828;color:#fff;padding:36px 40px 42px}
.url{font-family:Fredoka,sans-serif;font-size:62px}
.tag{font-size:32px;opacity:.9;margin-top:6px}
</style></head><body>
<div class="top"><span class="badge">Kostenlos als PDF</span><h1>24 Briefe<br>von <span>Onni</span></h1><p>Wichtelpost für die Wichteltür<br>vom 1. bis 24. Dezember</p></div>
<img class="c c1" src="${img('vorschau-titel.png')}"><img class="c c2" src="${img('vorschau-briefe.png')}">
<div class="foot"><div class="url">wichtellos.de</div><div class="tag">Jetzt ausdrucken →</div></div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  await p.setContent(html);
  await p.evaluate(() => document.fonts.ready);
  const out = path.join(__dirname, 'pins-onni', 'pin-briefe.png');
  await p.screenshot({ path: out });
  await b.close();
  console.log(out);
})();
