// Reel „Onni für Kinder“ (1080x1920, 9,5 s, ohne Ton – Musik in der App) -> marketing/reel/reel-onni.mp4
// Szenen: Onni stellt sich vor · Ausmalbilder · WhatsApp-Sticker · Wichtelnamen · Abspann wichtellos.de
// Bilder: Onni-Sticker/Ausmalbilder aus Google Flow (KI) -> beim Posten „Mit KI erstellt“ angeben.
// node marketing/reel/render-reel-onni.js            (Standbilder zur Kontrolle: ... "1,3,5,7,9")
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const ONNI = path.join(ROOT, 'marketing', 'onni');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const FPS = 30, DUR = 9.5;
const png = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(ONNI, f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const STICKERS = ['winkt', 'geschenk', 'psst', 'daumen', 'herz', 'schlaeft', 'jubel', 'lupe'];
const NAMES = [['Onni', -330, -330, '#c62828'], ['Lumi', 310, -300, '#1f6f4a'], ['Pelle', -350, -40, '#2b1b17'], ['Svea', 330, -20, '#c62828'],
  ['Nisse', -320, 250, '#1f6f4a'], ['Pippa', 320, 260, '#c62828'], ['Smilla', -40, -440, '#1f6f4a'], ['Tomte', 0, 470, '#2b1b17']];

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:1920px;overflow:hidden;position:relative;background:#fff8f0;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
body::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 30px 40px,rgba(242,183,5,.55) 0 5px,transparent 6px),radial-gradient(circle at 150px 120px,rgba(198,40,40,.3) 0 4px,transparent 5px),radial-gradient(circle at 90px 200px,rgba(31,111,74,.3) 0 4px,transparent 5px);background-size:240px 240px}
.stripe{position:absolute;top:0;left:0;right:0;height:24px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
.scene{position:absolute;inset:0;opacity:0}
.title{position:absolute;left:60px;right:60px;top:230px;font-size:104px;line-height:1.02}
.title em{font-style:normal;color:#c62828}
.sub{position:absolute;left:80px;right:80px;top:500px;font-size:50px;color:#6d5d57;font-family:'Segoe UI',system-ui,sans-serif}
.badge{display:inline-block;background:#1f6f4a;color:#fff;font-size:44px;padding:10px 36px;border-radius:999px;position:absolute;top:120px;left:50%;transform:translateX(-50%)}
.abs{position:absolute;left:50%;top:50%}
.sheet{background:#fff;padding:14px;border-radius:12px;box-shadow:0 16px 36px rgba(43,27,23,.22)}
.sheet img{display:block;width:100%}
.name{font-size:62px;background:#fff;padding:10px 34px;border-radius:999px;box-shadow:0 10px 24px rgba(43,27,23,.14);white-space:nowrap}
.url{display:inline-block;background:#c62828;color:#fff;font-size:92px;padding:22px 64px;border-radius:999px}
img.onni{filter:drop-shadow(0 14px 20px rgba(43,27,23,.25))}
</style></head><body><div class="stripe"></div>
<div class="scene" id="s1"><div class="title">Hallo, ich bin<br><em>Onni!</em></div><div class="sub">Der Wichtel von wichtellos.de</div>
  <img class="abs onni" id="o1" src="${png('sticker-winkt.png')}" style="width:640px"></div>
<div class="scene" id="s2"><span class="badge">Gratis zum Ausdrucken</span><div class="title" style="top:220px">Wichtel-<br><em>Ausmalbilder</em></div>
  ${['baum', 'geschenk', 'kekse'].map((n, i) => `<div class="abs sheet" id="a${i}" style="width:${i === 1 ? 430 : 380}px"><img src="${png(`ausmal-${n}.png`)}"></div>`).join('')}</div>
<div class="scene" id="s3"><span class="badge">Kostenlos</span><div class="title" style="top:220px">Sticker für<br><em>WhatsApp</em></div>
  ${STICKERS.map((s, i) => `<img class="abs onni" id="k${i}" src="${png(`sticker-${s}.png`)}" style="width:250px">`).join('')}</div>
<div class="scene" id="s4"><span class="badge">Für die Wichteltür</span><div class="title" style="top:220px">Wie heißt<br>dein <em>Wichtel?</em></div>
  <img class="abs onni" id="o4" src="${png('sticker-winkt.png')}" style="width:420px">
  ${NAMES.map(([n, , , c], i) => `<div class="abs name" id="n${i}" style="color:${c}">${n}</div>`).join('')}</div>
<div class="scene" id="s5"><img class="abs onni" id="o5" src="${png('sticker-jubel.png')}" style="width:600px">
  <div style="position:absolute;left:0;right:0;top:1180px"><div class="url">wichtellos.de</div>
  <div class="sub" style="position:static;margin-top:34px">Ausmalbilder · Sticker · Wichtelnamen<br>kostenlos für Kita, Schule & zu Hause</div></div></div>
</body></html>`;

// Animation je Zeitpunkt t (Sekunden) – deterministisch, damit jedes Bild exakt gerendert wird
function frame(t, STICKERS_N, NAMES_POS) {
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const back = (x) => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const set = (id, x, y, s, r, o = 1) => { const el = document.getElementById(id); el.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)`; el.style.opacity = o; };
  const F = 0.18; // schnelle Überblendung
  const vis = (id, a, b) => { const el = document.getElementById(id); el.style.opacity = Math.min(clamp((t - a) / F), clamp((b - t) / F)); };
  vis('s1', 0, 1.7); vis('s2', 1.7, 3.7); vis('s3', 3.7, 5.9); vis('s4', 5.9, 7.9); vis('s5', 7.9, 99);
  // 1: Onni hüpft rein und winkt
  set('o1', 0, 200 + (1 - ease((t - 0.05) / 0.4)) * 700, back((t - 0.05) / 0.4), Math.sin(t * 8) * 7);
  // 2: drei Ausmalbilder fliegen herein
  [[-270, 230, -8, 1.75], [0, 180, -1, 1.9], [270, 240, 7, 2.05]].forEach(([x, y, r, a], i) => {
    const p = ease((t - a) / 0.35); set(`a${i}`, x + (1 - p) * (i - 1) * 900, y + (1 - p) * 900, 0.85 + 0.15 * p, r + (1 - p) * 20); });
  // 3: Sticker poppen nacheinander auf (4x2)
  for (let i = 0; i < STICKERS_N; i++) { const x = -375 + (i % 4) * 250, y = 60 + Math.floor(i / 4) * 330, a = 3.75 + i * 0.09;
    set(`k${i}`, x, y, back((t - a) / 0.3), [-6, 4, -3, 6, 5, -5, 3, -4][i] + Math.sin(t * 4 + i) * 3); }
  // 4: Onni in der Mitte, Namen schweben heraus
  set('o4', 0, 200, back((t - 5.95) / 0.3), Math.sin(t * 6) * 4);
  NAMES_POS.forEach(([x, y], i) => { const p = back((t - 6.05 - i * 0.08) / 0.3); set(`n${i}`, x * clamp(p), 200 + y * clamp(p), p, Math.sin(t * 3 + i) * 4); });
  // 5: Abspann
  set('o5', 0, -320 + Math.sin(t * 8) * 10, back((t - 7.95) / 0.4), Math.sin(t * 6) * 5);
}

(async () => {
  const stills = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
  const tmp = path.join(__dirname, 'onni-frames');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(HTML, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(`window.frame = ${frame.toString()}`);
  const times = stills || Array.from({ length: FPS * DUR }, (_, i) => i / FPS);
  for (const [i, t] of times.entries()) {
    await p.evaluate(([t, n, pos]) => window.frame(t, n, pos), [t, STICKERS.length, NAMES.map(([, x, y]) => [x, y])]);
    await p.screenshot({ path: path.join(tmp, stills ? `still-${t}.png` : `f${String(i).padStart(4, '0')}.png`) });
  }
  await b.close();
  if (stills) { console.log('Standbilder in ' + tmp); return; }
  const out = path.join(__dirname, 'reel-onni.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.png'),
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig: ' + out);
})();
