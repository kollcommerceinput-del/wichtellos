// Social-Bilder für /wichtel-zubehoer/ (02.11.) -> marketing/social/zubehoer/
//   pin.png        1000x1500  Pinterest-Pin
//   ig-01..03.png  1080x1350  Instagram-Karussell (Titel, kleines Zubehör, große Wichtelwelt)
//   story.png      1080x1920  Story fürs Highlight „Zubehör“ (Bildmitte ≈46 % frei für den Link-Sticker)
// Foto: 3D-Wichteltür (KI, Google Flow) -> „KI-modifiziert“ markieren. Seite enthält Werbelinks -> Instagram-Text mit „Werbung“.
// node marketing/render-zubehoer-social.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'social', 'zubehoer');
const jpg = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'reel', 'wichtel3d', 'stills', f)).toString('base64');
const png = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'onni', f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const CSS = (W, H) => `@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:${W}px;height:${H}px;overflow:hidden;position:relative;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;text-align:center}
.stripe{position:absolute;top:0;left:0;right:0;height:20px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px);z-index:3}
.photo{position:absolute;left:0;right:0;top:0;width:100%;object-fit:cover}
.fade{position:absolute;left:0;right:0;height:180px;background:linear-gradient(rgba(255,248,240,0),#fff8f0)}
h1{font-family:Fredoka,sans-serif;font-weight:600;line-height:1.02;margin:0}
h1 em{font-style:normal;color:#c62828}
.line{width:150px;height:9px;border-radius:5px;background:#f2b705;margin:22px auto}
.sub{color:#6d5d57;margin:0}
.badge{display:inline-block;background:#1f6f4a;color:#fff;font-family:Fredoka,sans-serif;padding:8px 30px;border-radius:999px}
.foot{position:absolute;bottom:0;left:0;right:0;background:#c62828;color:#fff;font-family:Fredoka,sans-serif}
.chips{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
.chips span{background:#fff;border-radius:999px;padding:12px 26px;font-family:Fredoka,sans-serif;font-size:40px;box-shadow:0 8px 20px rgba(43,27,23,.1)}
.chips span:nth-child(3n+1){color:#c62828}.chips span:nth-child(3n+2){color:#1f6f4a}
.brand{position:absolute;top:44px;right:44px;background:rgba(255,248,240,.92);border-radius:999px;padding:8px 24px;font-family:Fredoka,sans-serif;font-size:34px;z-index:3}
.brand b{color:#c62828;font-weight:600}`;
const doc = (W, H, body) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>${CSS(W, H)}</style></head><body><div class="stripe"></div>${body}</body></html>`;

const KLEIN = ['Wichteltür', 'Mini-Möbel', 'Lichterkette', 'Briefkasten', 'Wichtelbett', 'Laterne', 'Briefpapier', 'Leiter', 'Kunstschnee', 'Wichtelküche'];
const GROSS = ['Wichtelhaus mit Licht', 'Wichteldorf', 'Komplettset', 'Puppenhaus', 'Wichtel-Kostüm'];

const FILES = {
  'pin.png': [1000, 1500, `<img class="photo" src="${jpg('tuer.jpg')}" style="height:900px;object-position:50% 30%"><div class="fade" style="top:720px"></div>
<div style="position:absolute;left:50px;right:50px;top:860px"><span class="badge" style="font-size:38px">38 Ideen</span>
<h1 style="font-size:96px;margin-top:18px">Wichtel-<em>Zubehör</em></h1><div class="line"></div>
<p class="sub" style="font-size:42px">Tür, Mini-Möbel, Licht & Wichtel-Post – bis zum leuchtenden Wichteldorf</p></div>
<div class="foot" style="padding:34px 40px 40px"><div style="font-size:62px">wichtellos.de</div><div style="font-size:32px;opacity:.92;font-family:'Segoe UI'">Alle Ideen ansehen →</div></div>`],

  'ig-01.png': [1080, 1350, `<img class="photo" src="${jpg('tuer.jpg')}" style="height:860px;object-position:50% 30%"><div class="fade" style="top:680px"></div>
<div class="brand">Wichtel<b>Los</b></div>
<div style="position:absolute;left:60px;right:60px;top:800px"><span class="badge" style="font-size:38px">Für die Wichteltür</span>
<h1 style="font-size:100px;margin-top:18px">Wichtel-<em>Zubehör</em></h1><div class="line"></div>
<p class="sub" style="font-size:42px">38 Ideen – vom Mini-Briefkasten bis zum Wichteldorf</p>
<p style="font-family:Fredoka;font-size:38px;color:#c62828;margin-top:26px">Wisch weiter 👉</p></div>`],

  'ig-02.png': [1080, 1350, `<div class="brand">Wichtel<b>Los</b></div>
<div style="position:absolute;left:60px;right:60px;top:150px"><span class="badge" style="font-size:38px">Klein & günstig</span>
<h1 style="font-size:84px;margin-top:20px">Damit der Wichtel<br><em>einziehen</em> kann</h1><div class="line"></div></div>
<div class="chips" style="position:absolute;left:60px;right:60px;top:560px">${KLEIN.map((k) => `<span>${k}</span>`).join('')}</div>
<img src="${png('sticker-geschenk.png')}" style="position:absolute;left:390px;bottom:40px;width:300px;filter:drop-shadow(0 12px 16px rgba(43,27,23,.25))">`],

  'ig-03.png': [1080, 1350, `<div class="brand">Wichtel<b>Los</b></div>
<div style="position:absolute;left:60px;right:60px;top:150px"><span class="badge" style="font-size:38px">Die große Wichtelwelt</span>
<h1 style="font-size:84px;margin-top:20px">Wenn es etwas<br><em>mehr</em> sein darf</h1><div class="line"></div></div>
<div class="chips" style="position:absolute;left:60px;right:60px;top:560px">${GROSS.map((k) => `<span>${k}</span>`).join('')}</div>
<div style="position:absolute;left:0;right:0;top:880px"><div style="display:inline-block;background:#c62828;color:#fff;font-family:Fredoka;font-size:64px;padding:18px 54px;border-radius:999px">wichtellos.de</div>
<p class="sub" style="font-size:38px;margin-top:22px">Alle 38 Ideen: Link im Profil</p></div>
<img src="${png('sticker-jubel.png')}" style="position:absolute;right:40px;bottom:30px;width:230px;filter:drop-shadow(0 12px 16px rgba(43,27,23,.25))">`],

  'story.png': [1080, 1920, `<img class="photo" src="${jpg('tuer.jpg')}" style="height:820px;object-position:50% 30%"><div class="fade" style="top:640px"></div>
<div class="brand" style="top:90px">Wichtel<b>Los</b></div>
<div style="position:absolute;left:60px;right:60px;top:1020px"><span class="badge" style="font-size:40px">38 Ideen</span>
<h1 style="font-size:104px;margin-top:20px">Wichtel-<em>Zubehör</em></h1><div class="line"></div>
<p class="sub" style="font-size:44px">Tür, Mini-Möbel, Licht, Wichtel-Post – bis zum leuchtenden Wichteldorf</p>
<p style="font-family:Fredoka;font-size:44px;color:#c62828;margin-top:40px">Alle Ideen – Link antippen 👆</p></div>`],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [name, [W, H, body]] of Object.entries(FILES)) {
    const p = await b.newPage({ viewport: { width: W, height: H } });
    await p.setContent(doc(W, H, body), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, name) });
    await p.close();
  }
  await b.close();
  console.log(Object.keys(FILES).length + ' Bilder in ' + OUT);
})();
