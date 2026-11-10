// Instagram-Karussell „24 Wichtel-Streiche zum Speichern“ (Toni 10.11.: mehr Reichweite über Speichern)
// Folie 1 Titel, 2–9 je 3 Streiche aus DOOR_PLAN (build.py → marketing/social/streiche-plan.json), 10 Schluss
// node marketing/render-karussell-streiche.js -> marketing/social/streiche/ig-NN.jpg (1080x1350)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const R = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'social', 'streiche');
const b64 = (f, t) => `data:${t};base64,` + fs.readFileSync(path.join(R, f)).toString('base64');
const font = b64('assets/fonts/fredoka-latin-600-normal.woff2', 'font/woff2');
const F = (n, f) => b64(`marketing/reel/adventskalender/folge-0${n}/${f}.jpg`, 'image/jpeg');
const PLAN = JSON.parse(fs.readFileSync(path.join(__dirname, 'social', 'streiche-plan.json'), 'utf8'));
// Hintergrund je Folie (Onni-Folgen, KI-Bilder)
const BG = [F(6, 'b03-schneespuren'), F(5, 'b05-chaos'), F(2, 'b04-teddy'), F(6, 'b12-stiefel'), F(4, 'b05-leine'),
  F(4, 'b04-schaum'), F(3, 'b04-kekse'), F(6, 'b09-flur-glitzer'), F(7, 'b10-singen'), F(1, 'b10-brief')];

const CSS = `@font-face{font-family:F;src:url(${font})}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:1350px;overflow:hidden;position:relative;font-family:F,'Segoe UI Emoji',sans-serif;color:#2b1b17}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
body.mitte{background:#f6efe6}
.mitte .bg{height:760px;object-position:center 62%}
.mitte .dunkel{display:none}
.mitte .karte{bottom:40px}
.dunkel{position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.05) 30%,rgba(0,0,0,.55))}
.kopf{position:absolute;left:60px;right:60px;top:60px;text-align:center}
.kopf span{display:inline-block;background:rgba(255,255,255,.95);color:#c62828;font-size:54px;padding:14px 36px;border-radius:30px;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.karte{position:absolute;left:50px;right:50px;bottom:60px;background:rgba(255,248,240,.97);border-radius:40px;padding:34px 44px;box-shadow:0 20px 50px rgba(0,0,0,.3)}
.s{display:flex;gap:26px;align-items:flex-start;padding:18px 0;border-bottom:3px dashed #e6d6c4}
.s:last-child{border:0}
.tag{flex:0 0 120px;height:120px;border-radius:28px;background:#c62828;color:#fff;text-align:center;line-height:1;padding-top:20px}
.tag b{display:block;font-size:56px}.tag small{font-size:26px}
.s h3{margin:4px 0 6px;font-size:44px;color:#1d3b2c}
.s p{margin:0;font:30px/1.3 'Segoe UI',sans-serif;color:#4a3a34}
.titel{position:absolute;left:60px;right:60px;bottom:90px;text-align:center;color:#fff;text-shadow:0 4px 20px rgba(0,0,0,.6)}
.titel h1{font-size:118px;line-height:1.02;margin:0 0 26px}
.titel .pill{display:inline-block;background:#c62828;color:#fff;font-size:46px;padding:16px 40px;border-radius:999px;text-shadow:none}
.titel p{font-size:42px;margin:26px 0 0}
.cta{text-align:center}
.cta h2{font-size:64px;color:#1d3b2c;margin:0 0 14px}
.cta p{font:34px/1.35 'Segoe UI',sans-serif;margin:0 0 24px;color:#4a3a34}
.cta b{display:block;background:#c62828;color:#fff;font-size:76px;border-radius:999px;padding:12px 0}
.ki{position:absolute;right:24px;top:20px;color:rgba(255,255,255,.9);font:22px 'Segoe UI';text-shadow:0 0 4px #000}`;

const folien = [];
folien.push(`<div class="titel"><h1>24 Wichtel-Streiche</h1><span class="pill">🔖 Zum Speichern</span><p>Für jeden Tag im Advent – je 2 Minuten Aufbau ➜</p></div>`);
for (let i = 0; i < 8; i++) {
  const drei = PLAN.slice(i * 3, i * 3 + 3).map(([t, txt], j) => {
    const tag = i * 3 + j + 1;
    return `<div class="s"><div class="tag"><b>${tag}.</b><small>Dez.</small></div><div><h3>${t}</h3><p>${txt}</p></div></div>`;
  }).join('');
  folien.push(`<div class="kopf"><span>🔖 Wichtel-Streiche · Tag ${i * 3 + 1}–${i * 3 + 3}</span></div><div class="karte">${drei}</div>`);
}
folien.push(`<div class="karte cta"><h2>Alle 24 als Plan zum Ausdrucken</h2><p>Dazu Begrüßungsbrief, 24 Briefe vom Wichtel,<br>Ausmalbilder & Wichtelnamen – kostenlos.</p><b>wichtellos.de</b><p style="margin:22px 0 0">Link in der Bio · Speichern nicht vergessen 🔖</p></div>`);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, inner] of folien.entries()) {
    await p.setContent(`<html><head><style>${CSS}</style></head><body class="${i > 0 && i < 9 ? 'mitte' : ''}"><img class="bg" src="${BG[i]}"><div class="dunkel"></div>${inner}<div class="ki">Bild: KI-generiert</div></body></html>`);
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(OUT, `ig-${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 90 });
  }
  await b.close();
  console.log(OUT, folien.length, 'Folien');
})();
