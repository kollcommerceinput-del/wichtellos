// YouTube-Kanalbanner 2560x1440 (Toni 05.11.): großes Onni-Kalenderbild, Text im sicheren Bereich (Mitte 1546x423).
// node marketing/render-youtube-banner.js -> marketing/youtube-banner.jpg
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const b64 = (f) => fs.readFileSync(path.join(ROOT, f)).toString('base64');
const font = 'data:font/woff2;base64,' + b64('assets/fonts/fredoka-latin-600-normal.woff2');
const bild = 'data:image/jpeg;base64,' + b64('marketing/reel/adventskalender/folge-05/b04-kekse.jpg');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
html,body{margin:0;width:2560px;height:1440px;overflow:hidden;font-family:Fredoka,sans-serif}
.bg{position:absolute;inset:0;background:url(${bild}) center 70%/cover no-repeat}
.dim{position:absolute;inset:0;background:radial-gradient(ellipse 900px 330px at 50% 50%,rgba(20,12,8,.62),rgba(20,12,8,.15) 100%)}
.box{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:1500px;text-align:center;color:#fff}
h1{font-size:104px;margin:0;line-height:1;text-shadow:0 6px 24px rgba(0,0,0,.8)}
p{font-size:48px;margin:12px 0 0;color:#ffe9a8;text-shadow:0 4px 16px rgba(0,0,0,.85)}
.url{display:inline-block;background:#c62828;color:#fff;font-size:44px;padding:6px 36px;border-radius:999px;margin-top:16px}
.ki{position:absolute;right:40px;bottom:30px;color:rgba(255,255,255,.7);font-family:'Segoe UI',sans-serif;font-size:30px}
</style></head><body><div class="bg"></div><div class="dim"></div>
<div class="box"><h1>Onnis Adventskalender</h1><p>Jede Nacht ein Türchen – ab 1. Dezember</p><div class="url">wichtellos.de</div></div>
<div class="ki">Bild: KI-generiert</div></body></html>`;
(async () => {
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 2560, height: 1440 } });
  await pg.setContent(html); await pg.evaluate(() => document.fonts.ready);
  const out = path.join(__dirname, 'youtube-banner.jpg');
  await pg.screenshot({ path: out, type: 'jpeg', quality: 88 }); await br.close();
  console.log('fertig:', out, (fs.statSync(out).size / 1e6).toFixed(1), 'MB');
})();
