// Pinterest-Profil-Titelbild (1920x1080) mit dem 3D-Wichtel -> marketing/pinterest-cover-3d.png
// Hintergrund: Werkstatt-Standbild (KI, ohne Gemini-Zeichen), links Text auf abgedunkeltem Verlauf.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const bg = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'reel', 'wichtel3d', 'stills', 'werkstatt.jpg')).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1920px;height:1080px;overflow:hidden;position:relative;font-family:'Segoe UI',system-ui,sans-serif;color:#fff}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%}
.shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(30,14,8,.88) 0%,rgba(30,14,8,.72) 34%,rgba(30,14,8,.15) 55%,rgba(30,14,8,0) 65%)}
.stripe{position:absolute;top:0;left:0;right:0;height:18px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
.text{position:absolute;left:120px;top:0;bottom:0;width:900px;display:flex;flex-direction:column;justify-content:center}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:112px;line-height:1.04;margin:0;text-shadow:0 4px 24px rgba(0,0,0,.5)}
.line{width:170px;height:10px;border-radius:5px;background:#f2b705;margin:38px 0}
p{font-size:40px;line-height:1.5;margin:0;opacity:.95;white-space:nowrap}
.url{margin-top:52px;align-self:flex-start;background:#c62828;font-family:Fredoka,sans-serif;font-size:58px;padding:22px 56px;border-radius:999px;box-shadow:0 14px 40px rgba(0,0,0,.4)}
</style></head><body>
<img class="bg" src="${bg}"><div class="shade"></div><div class="stripe"></div>
<div class="text"><h1>Wichteln online<br>auslosen 🎁</h1><div class="line"></div>
<p>Kostenlos · ohne Anmeldung · per WhatsApp<br>Geschenkideen · Wichtelspiele · Selbermachen</p>
<div class="url">wichtellos.de</div></div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.setContent(html);
  await p.evaluate(() => document.fonts.ready);
  const out = path.join(__dirname, 'pinterest-cover-3d.png');
  await p.screenshot({ path: out });
  await b.close();
  console.log('fertig:', out);
})();
