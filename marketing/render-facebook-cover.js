// Facebook-Titelbild (Toni 18.11.: „wir haben alles und noch mehr“) 1640x924: Desktop zeigt die mittleren ~624 px Höhe,
// Handy das ganze Bild → alle Texte im mittleren Band. node marketing/render-facebook-cover.js [bild] -> marketing/facebook-titelbild.jpg
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const b64 = (f) => fs.readFileSync(path.join(ROOT, f)).toString('base64');
const font = 'data:font/woff2;base64,' + b64('assets/fonts/fredoka-latin-600-normal.woff2');
const quelle = process.argv[2] || 'website/fotos/wichtel3d-werkstatt-1152.webp';
const bild = `data:image/${quelle.endsWith('.jpg') ? 'jpeg' : 'webp'};base64,` + b64(quelle);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
html,body{margin:0;width:1640px;height:924px;overflow:hidden;font-family:Fredoka,sans-serif}
.bg{position:absolute;inset:0;background:url(${bild}) 80% 55%/cover no-repeat}
.dim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(20,12,8,.82) 0%,rgba(20,12,8,.65) 45%,rgba(20,12,8,.05) 70%)}
.box{position:absolute;left:90px;top:47%;transform:translateY(-50%);width:900px;text-align:left;color:#fff}
h1{font-size:104px;margin:0;line-height:1;text-shadow:0 6px 24px rgba(0,0,0,.8)}
h1 b{color:#ffcf4a}
.sub{font-size:34px;white-space:nowrap;margin:10px 0 0;color:#ffe9a8;text-shadow:0 4px 16px rgba(0,0,0,.85)}
.pills{display:grid;grid-template-columns:auto auto;justify-content:start;gap:12px 14px;margin-top:24px}
.pills span{background:rgba(255,255,255,.94);color:#2b1b17;font-size:31px;padding:8px 22px;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.35)}
.url{display:inline-block;background:#c62828;color:#fff;font-size:40px;padding:6px 34px;border-radius:999px;margin-top:24px}
.ki{position:absolute;right:28px;bottom:22px;color:rgba(255,255,255,.7);font-family:'Segoe UI',sans-serif;font-size:20px}
</style></head><body><div class="bg"></div><div class="dim"></div>
<div class="box"><h1>Wichtel<b>Los</b></h1><p class="sub">Wichteln online auslosen – kostenlos &amp; ohne Anmeldung</p>
<div class="pills"><span>🎲 Auslosen per Link</span><span>🎁 Geschenkideen</span><span>🎄 Onnis Adventskalender</span><span>☕ Wichtel-Shop</span></div>
<div class="url">wichtellos.de</div></div>
<div class="ki">Bild: KI-generiert</div></body></html>`;
(async () => {
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1640, height: 924 } });
  await pg.setContent(html); await pg.evaluate(() => document.fonts.ready);
  const out = path.join(__dirname, 'facebook-titelbild.jpg');
  await pg.screenshot({ path: out, type: 'jpeg', quality: 90 }); await br.close();
  console.log('fertig:', out);
})();
