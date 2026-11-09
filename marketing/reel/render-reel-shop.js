// Reel „Wichtel-Tassen, Shirts & Teddys“ (Toni 09.11.): echte Produktfotos aus fotos/merch/shop/ (keine KI), ~10,5 s, ohne Ton.
// Champion-Tasse → schnelle Folge Teddy/Shirt/große Tasse/Hoodie (je ~1 s, reinschieben) → 2×2-Raster + wichtellos.de.
// Fotos sind nur 400 px → Karten höchstens ~640 px breit, sonst unscharf.
// node marketing/reel/render-reel-shop.js            -> marketing/reel/shop/reel-shop.mp4
// node marketing/reel/render-reel-shop.js 1.0 4.2    -> nur Standbilder
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const OUT = path.join(__dirname, 'shop');
const FPS = 30;
const SHOP = path.join(ROOT, 'fotos', 'merch', 'shop');
const img = (f) => 'data:image/webp;base64,' + fs.readFileSync(path.join(SHOP, f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

// [Bild, Produkt, Spruch, ab Sekunde]
const KARTEN = [
  ['31-3283492984258d6f.webp', 'Tasse', 'Wichtel-Champion', 0.0],
  ['897-32834927e9882040.webp', 'Teddy', 'Wichtel-Glückspilz', 2.2],
  ['6-3283492929305c32.webp', 'T-Shirt', 'Wichtel-Königin', 3.3],
  ['1470-32834927e6d65860.webp', 'Große Tasse', 'Lieber Wichtel … bitte Bargeld', 4.4],
  ['20-328349280dcff4ac.webp', 'Hoodie', 'Wichtel-Legende', 5.5],
];
const RASTER = 6.8, LAENGE = 10.6;
const RASTER_BILDER = ['31-3283492984258d6f.webp', '897-32834927e9882040.webp', '6-3283492929305c32.webp', '1470-32834927e6d65860.webp'];
const TEXTE = [[0, 2.2, 'Wichtelgeschenk<br>gesucht? 🎁'], [2.2, RASTER, 'Tassen, Shirts &amp; Teddys<br><small>mit Spruch</small>'], [RASTER, 99, 'Alle Motive auf<br><small>wichtellos.de</small>']];

const stage = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#fff8f0;font-family:Fredoka,'Segoe UI Emoji',sans-serif;color:#2b1b17;text-align:center}
#text{position:absolute;left:40px;right:40px;top:150px;height:300px;display:flex;align-items:center;justify-content:center}
#text div{background:#c62828;color:#fff;font-size:92px;line-height:1.08;padding:24px 56px;border-radius:46px;box-shadow:0 10px 30px rgba(0,0,0,.22)}
#text small{font-size:70px;color:#ffe9a8}
.karte{position:absolute;left:190px;top:690px;width:700px;background:#fff;border-radius:48px;padding:30px 30px 34px;box-shadow:0 24px 60px rgba(0,0,0,.18);opacity:0}
.karte img{display:block;width:640px;height:640px;border-radius:28px}
.karte .art{display:inline-block;margin-top:24px;background:#1D3B2C;color:#fff;font-size:44px;padding:8px 34px;border-radius:999px}
.karte .spruch{font-family:'Segoe UI',sans-serif;font-size:42px;color:#6d5d57;margin-top:14px}
#raster{position:absolute;left:60px;right:60px;top:560px;display:grid;grid-template-columns:1fr 1fr;gap:28px;opacity:0}
#raster img{width:100%;aspect-ratio:1;border-radius:32px;background:#fff;box-shadow:0 10px 26px rgba(0,0,0,.12)}
#url{position:absolute;left:0;right:0;bottom:190px;opacity:0}
#url span{display:inline-block;background:#c62828;color:#fff;font-size:96px;padding:22px 80px;border-radius:999px;box-shadow:0 12px 30px rgba(0,0,0,.2)}
#url p{font-family:'Segoe UI',sans-serif;font-size:50px;color:#6d5d57;margin:0}
</style></head><body>
<div id="text"><div></div></div>
${KARTEN.map(([b, a, s], i) => `<div class="karte" id="k${i}"><img src="${img(b)}"><div class="art">${a}</div><div class="spruch">${s}</div></div>`).join('')}
<div id="raster">${RASTER_BILDER.map((b) => `<img src="${img(b)}">`).join('')}</div>
<div id="url"><p>☕ Tasse · 👕 Shirt · 🧥 Hoodie · 🧸 Teddy</p></div>
</body></html>`;

const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - (1 - x) ** 3);

(async () => {
  const nur = process.argv.slice(2).map(Number);
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(stage);
  await p.evaluate(() => document.fonts.ready);
  const ff = nur.length ? null : spawn(FFMPEG, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', path.join(OUT, 'reel-shop.mp4')], { stdio: ['pipe', 'ignore', 'inherit'] });
  const N = Math.round(LAENGE * FPS);
  for (let i = 0; i < N; i++) {
    const t = i / FPS;
    // Karten: reinschieben von rechts (0,35 s), stehen, nach links raus, wenn die nächste kommt
    const karten = KARTEN.map(([, , , ab], k) => {
      const bis = k + 1 < KARTEN.length ? KARTEN[k + 1][3] : RASTER;
      if (t < ab || t >= bis + 0.35) return { o: 0, x: 0, s: 1 };
      const rein = k === 0 ? Math.min(1, t / 0.45) : ease((t - ab) / 0.35);
      const raus = t >= bis ? ease((t - bis) / 0.35) : 0;
      const x = k === 0 ? 0 : (1 - rein) * 1100;
      const s = (k === 0 ? 0.9 + 0.1 * ease(t / 0.45) : 1) + 0.03 * Math.min(1, (t - ab) / 1.2);
      return { o: k === 0 ? rein * (1 - raus) : 1 - raus, x: x - raus * 1100, s };
    });
    const r = Math.min(1, Math.max(0, (t - RASTER) / 0.4));
    const u = Math.min(1, Math.max(0, (t - RASTER - 0.5) / 0.35));
    const tx = TEXTE.find(([a, z]) => t >= a && t < z)[2];
    await p.evaluate(({ karten, r, u, tx }) => {
      karten.forEach((k, i) => { const e = document.getElementById('k' + i); e.style.opacity = k.o; e.style.transform = `translateX(${k.x}px) scale(${k.s})`; });
      const ra = document.getElementById('raster'); ra.style.opacity = r; ra.style.transform = `scale(${0.92 + 0.08 * r})`;
      const ur = document.getElementById('url'); ur.style.opacity = u; ur.style.transform = `translateY(${(1 - u) * 60}px)`;
      const d = document.querySelector('#text div'); if (d.innerHTML !== tx) d.innerHTML = tx;
    }, { karten, r: 1 - (1 - r) ** 3, u: 1 - (1 - u) ** 3, tx });
    if (nur.length) {
      if (nur.some((s) => Math.abs(s - t) < 0.5 / FPS)) await p.screenshot({ path: path.join(OUT, `standbild-${t.toFixed(1)}.png`) });
      if (t > Math.max(...nur)) break;
    } else {
      const buf = await p.screenshot({ type: 'jpeg', quality: 93 });
      if (!ff.stdin.write(buf)) await new Promise((res) => ff.stdin.once('drain', res));
    }
  }
  if (ff) { ff.stdin.end(); await new Promise((res) => ff.on('close', res)); }
  await b.close();
  console.log(nur.length ? 'Standbilder in ' + OUT : path.join(OUT, 'reel-shop.mp4'));
})();
