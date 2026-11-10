// Eltern-Video „Wichtel-Streiche: 5 Ideen, in 2 Minuten aufgebaut“ (Toni 10.11., YouTube, NICHT „für Kinder“).
// Bilder aus den Onni-Folgen + Handy-Aufnahme Streichplan (/wichteltuer/#streiche), langsamer Zoom + Texte.
// Stimme/Geräusche danach: node marketing/reel/stimme-reel.js streiche-eltern/stimme.json
// Server vorher: cd website && python -m http.server 8766
// node marketing/reel/render-video-streiche-eltern.js -> streiche-eltern/bild.mp4 (stumm)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium, devices } = require('playwright');
const R = path.join(__dirname, '..', '..');
const D = path.join(__dirname, 'streiche-eltern');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const b64 = (f, t) => `data:${t};base64,` + fs.readFileSync(path.isAbsolute(f) ? f : path.join(R, f)).toString('base64');
const font = b64('assets/fonts/fredoka-latin-600-normal.woff2', 'font/woff2');

const CSS = `@font-face{font-family:F;src:url(${font})}
body{margin:0;width:1080px;height:1920px;overflow:hidden;position:relative;font-family:F,'Segoe UI Emoji',sans-serif}
.voll{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.nah{transform:scale(1.35);transform-origin:30% 62%}
.bg{position:absolute;inset:0;background:linear-gradient(#f6efe6,#e9dccb)}
.blatt{position:absolute;left:150px;top:520px;width:780px;box-shadow:0 30px 60px rgba(0,0,0,.25);border-radius:10px;transform:rotate(-2deg)}
.handy{position:absolute;left:190px;top:470px;width:700px;border:18px solid #1d1d1f;border-radius:60px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.3)}
.handy img{width:100%;display:block}
.tipp{position:absolute;width:90px;height:90px;margin:-45px 0 0 -45px;border-radius:50%;border:6px solid rgba(43,27,23,.55);background:rgba(43,27,23,.12)}
.z1{position:absolute;left:60px;top:560px;width:560px;transform:rotate(-4deg);box-shadow:0 20px 50px rgba(0,0,0,.25)}
.z2{position:absolute;right:60px;top:820px;width:560px;transform:rotate(3deg);box-shadow:0 20px 50px rgba(0,0,0,.25)}
.t{position:absolute;left:50px;right:50px;top:170px;text-align:center}
.t span{display:inline-block;background:rgba(255,255,255,.95);color:#c62828;font-size:76px;line-height:1.12;padding:20px 40px;border-radius:36px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.karte{position:absolute;left:90px;right:90px;top:1150px;background:rgba(255,248,240,.96);border-radius:44px;padding:40px;text-align:center;color:#2b1b17;font-size:60px}
.karte b{display:block;color:#fff;background:#c62828;border-radius:999px;font-size:96px;padding:10px 0;margin:20px 0}
.karte small{font-family:'Segoe UI';font-size:36px;color:#6d5d57}
.ki{position:absolute;right:28px;bottom:36px;color:rgba(255,255,255,.85);font:26px 'Segoe UI';text-shadow:0 0 4px #000}`;

(async () => {
  const tmp = path.join(D, 'tmp');
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  // Handy-Aufnahme Streichplan (aufgeklappt)
  const h = await b.newPage({ ...devices['iPhone 13'], viewport: { width: 390, height: 700 }, deviceScaleFactor: 2 });
  await h.goto('http://localhost:8766/wichteltuer/', { waitUntil: 'networkidle' });
  await h.evaluate(() => { const d = document.querySelector('.plan-details'); d.open = true; document.getElementById('streiche').scrollIntoView(); window.scrollBy(0, -20); });
  await h.waitForTimeout(500);
  await h.screenshot({ path: path.join(tmp, 'plan.png') });
  const F = (n, f) => b64(`marketing/reel/adventskalender/folge-0${n}/${f}.jpg`, 'image/jpeg');
  const bild = (f) => b64(f, f.endsWith('.png') ? 'image/png' : 'image/webp');
  const tuer = F(6, 'b03-schneespuren');
  // [Bild-HTML, Text, Dauer s] – Dauer passend zur Stimme (stimme.json)
  const S = [
    [`<img class="voll" src="${tuer}">`, '5 Wichtel-Streiche in 2 Minuten ✨', 4.8],
    [`<img class="voll" src="${F(5, 'b05-chaos')}">`, '1. Socken-Chaos', 3.5],
    [`<img class="voll" src="${F(2, 'b04-teddy')}">`, '2. Kuscheltier-Picknick', 4.7],
    [`<img class="voll" src="${F(4, 'b05-leine')}">`, '3. Waschtag', 4.6],
    [`<img class="voll" src="${F(4, 'b04-schaum')}">`, '4. Schaumbad', 4.9],
    [`<img class="voll" src="${F(6, 'b12-stiefel')}">`, '5. Nikolaus', 5.1],
    [`<div class="bg"></div><div class="handy"><img src="${bild(path.join(tmp, 'plan.png'))}"></div>`, 'Alle 24 Streiche als Plan', 4.4],
    [`<img class="voll" src="${tuer}"><div class="karte"><div>Streichplan gratis</div><b>wichtellos.de</b><small>24 Streiche · Briefe · Ausmalbilder · Wichtelnamen</small></div>`, '', 3.8],
  ];
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const teile = [];
  for (const [i, [inner, txt, d]] of S.entries()) {
    const ki = inner.includes('class="voll') ? '<div class="ki">Bild: KI-generiert</div>' : '';
    await p.setContent(`<html><head><style>${CSS}</style></head><body>${inner}${txt ? `<div class="t"><span>${txt}</span></div>` : ''}${ki}</body></html>`);
    await p.waitForTimeout(250);
    const png = path.join(tmp, `s${i}.png`);
    await p.screenshot({ path: png });
    const n = Math.round(d * 30), mp4 = path.join(tmp, `s${i}.mp4`);
    // langsamer Zoom; Handy-Szene ohne Zoom
    const zoom = (i === 6) ? `zoompan=z=1:d=${n}:s=1080x1920:fps=30`
      : `zoompan=z='1+0.05*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=1080x1920:fps=30`;
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-loop', '1', '-i', png, '-vf', `scale=2160:3840,${zoom},format=yuv420p`,
      '-frames:v', String(n), '-c:v', 'libx264', '-crf', '19', mp4]);
    teile.push(mp4);
  }
  await b.close();
  fs.writeFileSync(path.join(tmp, 'liste.txt'), teile.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n'));
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'liste.txt'), '-c', 'copy', path.join(D, 'bild.mp4')]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(path.join(D, 'bild.mp4'), S.reduce((a, s) => a + s[2], 0).toFixed(1) + ' s');
})();
