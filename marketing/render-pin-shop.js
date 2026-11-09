// Pinterest-Pin (1000x1500) für /wichtel-tassen/ (09.11.): echte Produktfotos aus fotos/merch/shop/ (keine KI-Bilder),
// 2×2-Raster Tasse / Teddy / T-Shirt / große Tasse, darunter Titel + roter Balken. → marketing/pins3d/pin-shop.png
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const SHOP = path.join(ROOT, 'fotos', 'merch', 'shop');
const img = (f) => 'data:image/webp;base64,' + fs.readFileSync(path.join(SHOP, f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
// Champion-Tasse, Glückspilz-Teddy, Königin-Shirt, Bargeld große Tasse
const BILDER = ['31-3283492984258d6f.webp', '897-32834927e9882040.webp', '6-3283492929305c32.webp', '1470-32834927e6d65860.webp'];

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1000px;height:1500px;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;position:relative;text-align:center}
.grid{position:absolute;top:30px;left:30px;right:30px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:28px;background:#f2f2f2;box-shadow:0 6px 18px rgba(0,0,0,.08)}
.text{position:absolute;top:1010px;left:50px;right:50px}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:84px;line-height:1.04;margin:0}
.line{width:160px;height:8px;border-radius:4px;background:#f2b705;margin:20px auto}
p{font-size:44px;line-height:1.3;margin:0;color:#6d5d57}
.foot{position:absolute;bottom:0;left:0;right:0;background:#c62828;color:#fff;padding:36px 40px 42px}
.url{font-family:Fredoka,sans-serif;font-size:60px}
.tag{font-size:32px;opacity:.9;margin-top:6px}
</style></head><body>
<div class="grid">${BILDER.map((b) => `<img src="${img(b)}">`).join('')}</div>
<div class="text"><h1>Wichtel-Tassen, Shirts &amp; Teddys</h1><div class="line"></div><p>Lustige Wichtelgeschenke mit Spruch</p></div>
<div class="foot"><div class="url">wichtellos.de</div><div class="tag">Alle Motive ansehen →</div></div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  await p.setContent(html);
  await p.evaluate(() => document.fonts.ready);
  const out = path.join(__dirname, 'pins3d', 'pin-shop.png');
  await p.screenshot({ path: out });
  await b.close();
  console.log(out);
})();
