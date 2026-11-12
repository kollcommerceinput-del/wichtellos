// Pinterest-Pin (1000x1500) „Mit eurem Wichtelnamen“ (12.11., Werbung für die Spreadshop-Motive „Mein Wichtel heißt …“).
// Zwei Karten: helles Motiv mit Beispielname „Lena“, dunkles Motiv mit „Opa Karl“ – zeigt, dass der Name selbst eingetragen wird.
// Druckdateien aus marketing/merch/onni-serie/ (eigene Grafik, keine KI). → marketing/pins3d/pin-wichtelname.png
// node marketing/render-pin-wichtelname.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const SERIE = path.join(__dirname, 'merch', 'onni-serie');
const png = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(SERIE, f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1000px;height:1500px;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;position:relative;text-align:center}
.kopf{position:absolute;top:56px;left:50px;right:50px}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:88px;line-height:1.02;margin:0}
h1 em{font-style:normal;color:#c62828}
.line{width:160px;height:8px;border-radius:4px;background:#f2b705;margin:22px auto 0}
.karten{position:absolute;top:330px;left:30px;right:30px;display:grid;grid-template-columns:1fr 1fr;gap:24px}
.karte{border-radius:32px;padding:40px 22px 44px;box-shadow:0 10px 26px rgba(0,0,0,.12)}
.hell{background:#fff}
.dunkel{background:#1D3B2C}
.karte img{width:100%;display:block}
.name{font-family:Fredoka,sans-serif;font-size:66px;line-height:1;margin-top:-6px}
.hell .name{color:#c62828}
.dunkel .name{color:#f2b705}
.text{position:absolute;top:1005px;left:60px;right:60px}
p{font-size:42px;line-height:1.3;margin:0;color:#6d5d57}
p b{color:#2b1b17}
.foot{position:absolute;bottom:0;left:0;right:0;background:#c62828;color:#fff;padding:34px 40px 40px}
.url{font-family:Fredoka,sans-serif;font-size:60px}
.tag{font-size:32px;opacity:.92;margin-top:6px}
</style></head><body>
<div class="kopf"><h1>Mit eurem<br><em>Wichtelnamen</em> ✏️</h1><div class="line"></div></div>
<div class="karten">
  <div class="karte hell"><img src="${png('mein-wichtel-heisst-frei.png')}"><div class="name">Lena</div></div>
  <div class="karte dunkel"><img src="${png('mein-wichtel-heisst-frei-fuer-dunkle-stoffe.png')}"><div class="name">Opa Karl</div></div>
</div>
<div class="text"><p><b>Tasse, Shirt, Hoodie &amp; Teddy</b> – den Namen eures Wichtels tragt ihr im Shop selbst ein.</p></div>
<div class="foot"><div class="url">wichtellos.de</div><div class="tag">Jetzt Namen eintragen →</div></div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  await p.setContent(html);
  await p.evaluate(() => document.fonts.ready);
  const out = path.join(__dirname, 'pins3d', 'pin-wichtelname.png');
  await p.screenshot({ path: out });
  await b.close();
  console.log('fertig: ' + out);
})();
