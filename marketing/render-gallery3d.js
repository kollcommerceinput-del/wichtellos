// Erklär-Galerie mit dem 3D-Wichtel: 8 Folien zum Wischen + automatisches Video
//   marketing/social/wichtel3d/ig-NN.png  1080x1350 (Instagram-/Facebook-Karussell, LinkedIn-Dokument)
//   marketing/social/wichtel3d/tt-NN.png  1080x1920 (TikTok-Fotomodus, Instagram-Story)
//   marketing/social/wichtel3d/pin-NN.png 1000x1500 (Pinterest-Karussell)
//   marketing/social/wichtel3d/galerie.mp4 1080x1920, 3 s je Folie mit Überblendung, ohne Ton (Reel/TikTok/Shorts – Musik in der App)
// node marketing/render-gallery3d.js   (Bilder: KI aus Google Flow -> beim Posten „Mit KI erstellt“ angeben)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'social', 'wichtel3d');
const STILLS = path.join(__dirname, 'reel', 'wichtel3d', 'stills');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const img = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(STILLS, f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

// x = waagrechter Ausschnitt, focus = Bildpunkt (Anteil der Bildhöhe: Gesicht + Gegenstand), der bei 55 % des Fotobereichs landet
const SLIDES = [
  { f: 'werkstatt.jpg', x: '72%', focus: 0.5, title: 'Wichteln?<br>Ganz simpel.', text: 'Online auslosen – kostenlos, ohne Anmeldung', swipe: true },
  { f: 'feder.jpg', x: '50%', focus: 0.6, kicker: 'Schritt 1', title: 'Namen eintragen', text: 'Gruppe, Budget und Datum – dann alle, die mitmachen. Ohne App.' },
  { f: 'los.jpg', x: '50%', focus: 0.56, kicker: 'Schritt 2', title: 'Auslosen', text: 'Ein Klick – niemand zieht sich selbst, Paare kannst du ausschließen.' },
  { f: 'umschlag.jpg', x: '50%', focus: 0.53, kicker: 'Schritt 3', title: 'Geheimen Link schicken', text: 'Per WhatsApp, E-Mail oder SMS – jeder sieht nur, wen er beschenkt.' },
  { f: 'lupe.jpg', x: '50%', focus: 0.55, kicker: 'Extra', title: 'Heimlicher Tipp', text: '„Mag Tee“, „keine Socken“ – nur dein Wichtel sieht es.' },
  { f: 'kinder.jpg', x: '50%', focus: 0.62, kicker: 'Extra', title: 'Lose zum Ausdrucken', text: 'Mit QR-Code für die Feier – oder ganz ohne Handy für Kinder.' },
  { f: 'geschenk.jpg', x: '50%', focus: 0.66, kicker: 'Schritt 4', title: 'Geheimnis lüften', text: 'Link antippen, sehen, wen man beschenkt – und los geht\'s.' },
  { f: 'feier.jpg', x: '50%', focus: 0.55, cta: true, title: 'Bereit zum Wichteln?', text: 'Kostenlos auslosen auf' },
];

const SIZES = { ig: [1080, 1350], tt: [1080, 1920], pin: [1000, 1500] };

const html = (s, i, n, W, H, fmt) => {
  const panel = fmt === 'tt' ? 580 : fmt === 'pin' ? 540 : 520;   // Höhe des Textbereichs
  const bottomPad = fmt === 'tt' ? 300 : 0;                         // TikTok/Story: unten Platz für App-Bedienelemente
  const photoH = H - panel - bottomPad + 60;
  const dots = Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:${W}px;height:${H}px;overflow:hidden;position:relative;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;text-align:center}
.photo{position:absolute;top:0;left:0;width:${W}px;height:${photoH}px;object-fit:cover;object-position:${s.x} 0}
.fade{position:absolute;top:${photoH - 160}px;left:0;right:0;height:160px;background:linear-gradient(rgba(255,248,240,0),#fff8f0)}
.stripe{position:absolute;top:0;left:0;right:0;height:16px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
.brand{position:absolute;top:40px;right:40px;background:rgba(255,248,240,.92);border-radius:999px;padding:10px 26px;font-family:Fredoka,sans-serif;font-size:34px}
.brand b{color:#c62828;font-weight:600}
.panel{position:absolute;left:70px;right:70px;top:${photoH - 40}px;height:${panel - 70}px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.kicker{display:inline-block;background:#c62828;color:#fff;font-family:Fredoka,sans-serif;font-size:36px;padding:8px 28px;border-radius:999px;margin-bottom:22px}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:${s.swipe ? (fmt === 'ig' ? 86 : 96) : 80}px;line-height:1.04;margin:0}
.line{width:140px;height:8px;border-radius:4px;background:#f2b705;margin:${fmt === 'ig' ? 18 : 26}px auto}
p{font-size:${fmt === 'ig' ? 38 : 42}px;line-height:1.35;margin:0;color:#6d5d57;max-width:900px}
.url{margin-top:28px;background:#c62828;color:#fff;font-family:Fredoka,sans-serif;font-size:64px;padding:18px 54px;border-radius:999px}
.swipe{margin-top:18px;font-family:Fredoka,sans-serif;font-size:38px;color:#c62828}
.dots{position:absolute;left:0;right:0;bottom:${bottomPad + 34}px;display:flex;gap:14px;justify-content:center}
.dots i{width:16px;height:16px;border-radius:50%;background:#e3d6cc}.dots i.on{background:#c62828;width:44px;border-radius:8px}
</style></head><body>
<img class="photo" src="${img(s.f)}"><div class="fade"></div><div class="stripe"></div>
<div class="brand">Wichtel<b>Los</b></div>
<div class="panel">
  ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}
  <h1>${s.title}</h1><div class="line"></div><p>${s.text}</p>
  ${s.cta ? '<div class="url">wichtellos.de</div>' : ''}
  ${s.swipe ? '<div class="swipe">Wisch weiter 👉</div>' : ''}
</div>
<div class="dots">${dots}</div>
</body></html>`;
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [fmt, [W, H]] of Object.entries(SIZES)) {
    const p = await b.newPage({ viewport: { width: W, height: H } });
    for (const [i, s] of SLIDES.entries()) {
      await p.setContent(html(s, i, SLIDES.length, W, H, fmt));
      await p.evaluate(() => document.fonts.ready);
      await p.evaluate((focus) => { // Ausschnitt so legen, dass der Fokuspunkt bei 55 % der Fotohöhe liegt
        const im = document.querySelector('.photo'); const W = im.clientWidth, H = im.clientHeight;
        const sc = Math.max(W / im.naturalWidth, H / im.naturalHeight), ih = im.naturalHeight * sc;
        const off = Math.max(0, Math.min(ih - H, focus * ih - 0.55 * H));
        im.style.objectPosition = im.style.objectPosition || getComputedStyle(im).objectPosition.split(' ')[0] + ' ' + (-off) + 'px';
      }, s.focus);
      await p.screenshot({ path: path.join(OUT, `${fmt}-${String(i + 1).padStart(2, '0')}.png`) });
    }
    await p.close();
  }
  await b.close();

  // Video aus den Hochformat-Folien: 3 s je Folie, 0,6 s Überblendung, ohne Ton
  const D = 3, XF = 0.6, n = SLIDES.length;
  const args = ['-y', '-loglevel', 'error'];
  for (let i = 1; i <= n; i++) args.push('-loop', '1', '-framerate', '30', '-t', String(D + XF), '-i', path.join(OUT, `tt-${String(i).padStart(2, '0')}.png`));
  const fc = [];
  for (let i = 0; i < n; i++) fc.push(`[${i}:v]format=yuv420p,setsar=1[s${i}]`);
  let prev = 's0';
  for (let i = 1; i < n; i++) {
    fc.push(`[${prev}][s${i}]xfade=transition=fade:duration=${XF}:offset=${(i * D).toFixed(2)}[x${i}]`);
    prev = `x${i}`;
  }
  const out = path.join(OUT, 'galerie.mp4');
  args.push('-filter_complex', fc.join(';'), '-map', `[${prev}]`, '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', out);
  execFileSync(FFMPEG, args, { stdio: 'inherit' });
  console.log(`${n} Folien × ${Object.keys(SIZES).length} Formate + galerie.mp4 in ${OUT}`);
})();
