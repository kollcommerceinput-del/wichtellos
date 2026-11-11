// Podcast-Titelbild 3000x3000 (Spotify/Apple): Onni auf Ulla (Folge 1, KI-Bild) + Titel
// node marketing/podcast/render-cover.js [bild] -> marketing/podcast/cover-onni-podcast.jpg
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const R = path.join(__dirname, '..', '..');
const bild = process.argv[2] || 'b07-flug';
const b64 = (f, t) => `data:${t};base64,` + fs.readFileSync(f).toString('base64');
const img = b64(path.join(R, `marketing/reel/adventskalender/folge-01/${bild}.jpg`), 'image/jpeg');
const font = b64(path.join(R, 'assets/fonts/fredoka-latin-600-normal.woff2'), 'font/woff2');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 3 });
  await p.setContent(`<html><head><style>@font-face{font-family:F;src:url(${font})}
  body{margin:0;width:1000px;height:1000px;position:relative;overflow:hidden;font-family:F}
  img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center ${process.env.Y || '55%'}}
  .v{position:absolute;inset:0;background:linear-gradient(rgba(10,20,40,.75),rgba(10,20,40,0) 38%,rgba(10,20,40,0) 70%,rgba(10,20,40,.7))}
  .t{position:absolute;left:40px;right:40px;top:44px;text-align:center;color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.6)}
  .t h1{margin:0;font-size:112px;line-height:.98}
  .u{position:absolute;left:0;right:0;bottom:60px;text-align:center}
  .u span{display:inline-block;background:#c62828;color:#fff;font-size:52px;padding:12px 36px;border-radius:999px}
  .u p{margin:16px 0 0;color:#fff;font-size:38px;text-shadow:0 2px 10px #000}
  .ki{position:absolute;right:14px;bottom:8px;color:rgba(255,255,255,.75);font:15px 'Segoe UI'}</style></head><body>
  <img src="${img}"><div class="v"></div><div class="t"><h1>Onnis<br>Adventskalender</h1></div>
  <div class="u"><span>Gute-Nacht-Geschichten</span><p>24 Türchen · 1.–24. Dezember</p></div><div class="ki">Bild: KI-generiert</div></body></html>`);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(__dirname, 'cover-onni-podcast.jpg'), type: 'jpeg', quality: 88 });
  await b.close(); console.log('ok');
})();
