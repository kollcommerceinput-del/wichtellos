// Reel „24 Briefe von Onni“ + Ausmalbilder (1080x1920, 13 s, Spieluhr-Ton gemeinfrei) -> marketing/reel/reel-briefe.mp4
// Szenen ~1,8 s (Toni: Videos knapp halten). Bilder: Briefe-Vorlage aus G:\wichtellos-content (Flat-Onni, KI-unterstützt)
// werden beim ersten Lauf nach marketing/reel/briefe/ fotografiert; Ausmalbilder aus marketing/onni/. Beim Posten „Mit KI erstellt“.
// node marketing/reel/render-reel-briefe.js            (Standbilder: ... "1,3,5,7,9,10.5,12")
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const SRC = 'file:///G:/wichtellos-content/produkte/2026-wichtelbriefe/wichtelbriefe.html';
const IMG = path.join(__dirname, 'briefe');
const FPS = 30, T0 = 2.2, STEP = 1.8;
const SCENES = [ // [Bild, Kopfzeile, Unterzeile]
  ['brief-1.png', '1. Dezember', 'Onni zieht ein'],
  ['brief-6.png', 'Nikolaus', 'Stiefel geputzt – schau mal nach!'],
  ['brief-8.png', 'Geheimbotschaft', 'in Spiegelschrift'],
  ['steckbrief.png', 'Steckbrief', 'Lieblingskekse selbst eintragen'],
];
const MAL = ['ausmal-baum.png', 'ausmal-tuer.png', 'ausmal-kekse.png'];
const T_MAL = T0 + SCENES.length * STEP, T_END = T_MAL + STEP + 0.2, DUR = T_END + 2.2;
const data = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

async function capture(b) {
  // Briefe aus der Vorlage fotografieren (2x schärfer): Titelseite, Briefe 1/6/8, Steckbrief
  fs.mkdirSync(IMG, { recursive: true });
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  await p.goto(SRC, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const pages = await p.$$('section.seite');
  await pages[0].screenshot({ path: path.join(IMG, 'titel.png') });
  const briefe = await p.$$('article.brief:not(.steckbrief)');
  for (const n of [1, 6, 8]) await briefe[n - 1].screenshot({ path: path.join(IMG, `brief-${n}.png`) });
  await (await p.$('article.steckbrief')).screenshot({ path: path.join(IMG, 'steckbrief.png') });
  await p.close();
}

const html = () => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:1920px;overflow:hidden;position:relative;background:#fff8f0;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.stripe{position:absolute;top:0;left:0;right:0;height:24px;z-index:5;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
.scene{position:absolute;inset:0;opacity:0}
.badge{display:inline-block;background:#1f6f4a;color:#fff;font-size:46px;padding:10px 38px;border-radius:999px}
h1{font-size:120px;line-height:1.02;margin:18px 0 0;font-weight:600}h1 em{font-style:normal;color:#c62828}
.sub{font-family:'Segoe UI',system-ui,sans-serif;color:#6d5d57;font-size:54px;margin:22px 0 0}
.card{position:absolute;border-radius:22px;box-shadow:0 22px 50px rgba(43,27,23,.28);background:#fff}
.top{position:absolute;left:50px;right:50px;top:300px}
.num{display:inline-block;background:#c62828;color:#fff;font-size:60px;padding:10px 42px;border-radius:999px}
.url{display:inline-block;background:#c62828;color:#fff;font-size:80px;padding:20px 56px;border-radius:999px}
</style></head><body><div class="stripe"></div>
<div class="scene" id="s0"><div class="top" id="t0"><span class="badge">Kostenlos als PDF</span><h1>Euer Wichtel<br>schreibt <em>24 Briefe</em></h1></div>
  <img class="card" id="c0" src="${data(path.join(IMG, 'titel.png'))}" style="width:700px;left:190px;top:780px"></div>
${SCENES.map(([f, h, s], i) => `<div class="scene" id="b${i}"><div class="top" id="h${i}"><span class="num">${h}</span><p class="sub" style="font-size:60px;color:#2b1b17">${s}</p></div>
  <img class="card" id="i${i}" src="${data(path.join(IMG, f))}" style="width:1000px;left:40px;top:830px"></div>`).join('')}
<div class="scene" id="m"><div class="top" id="hm"><span class="num">Dazu: 6 Ausmalbilder</span><p class="sub" style="font-size:60px;color:#2b1b17">mit Onni zum Ausdrucken</p></div>
  ${MAL.map((f, i) => `<img class="card" id="m${i}" src="${data(path.join(ROOT, 'marketing', 'onni', f))}" style="width:440px;left:${[60, 320, 580][i]}px;top:${[860, 800, 860][i]}px">`).join('')}</div>
<div class="scene" id="e"><img class="card" id="ce" src="${data(path.join(IMG, 'titel.png'))}" style="width:520px;left:280px;top:220px">
  <div style="position:absolute;left:50px;right:50px;top:1080px"><h1 style="font-size:100px">Kostenlos<br>ausdrucken</h1>
  <div class="url" style="margin-top:44px">wichtellos.de</div><p class="sub">→ Wichteltür</p></div></div>
</body></html>`;

function frame(t, n, T0, STEP, T_MAL, T_END) {
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const back = (x) => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const F = 0.15;
  const vis = (id, a, b) => { const o = Math.min(clamp((t - a) / F), clamp((b - t) / F)); document.getElementById(id).style.opacity = o; };
  const $ = (id) => document.getElementById(id).style;
  vis('s0', -1, T0);
  $('t0').transform = `translateY(${(1 - back((t - 0.1) / 0.45)) * 120}px)`;
  $('c0').transform = `rotate(${-4 + t * 2}deg) scale(${0.9 + back((t - 0.3) / 0.5) * 0.1})`;
  for (let i = 0; i < n; i++) {
    const a = T0 + i * STEP;
    vis(`b${i}`, a, a + STEP);
    $(`h${i}`).transform = `translateY(${(1 - back((t - a - 0.1) / 0.35)) * 90}px)`;
    $(`i${i}`).transform = `rotate(${(i % 2 ? 2 : -2)}deg) scale(${1.04 - clamp((t - a) / STEP) * 0.06})`;
  }
  vis('m', T_MAL, T_END);
  $('hm').transform = `translateY(${(1 - back((t - T_MAL - 0.1) / 0.35)) * 90}px)`;
  [-8, 0, 8].forEach((r, i) => { $(`m${i}`).transform = `rotate(${r}deg) scale(${back((t - T_MAL - 0.1 - i * 0.12) / 0.4)})`; });
  vis('e', T_END, 99);
  $('ce').transform = `rotate(${Math.sin(t * 3) * 3}deg) scale(${back((t - T_END - 0.1) / 0.45)})`;
}

(async () => {
  const stills = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
  const tmp = path.join(__dirname, 'briefe-frames');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  if (!fs.existsSync(path.join(IMG, 'steckbrief.png'))) await capture(b);
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html(), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(`window.frame = ${frame.toString()}`);
  const times = stills || Array.from({ length: Math.round(FPS * DUR) }, (_, i) => i / FPS);
  for (const [i, t] of times.entries()) {
    await p.evaluate(([t, n, a, s, m, e]) => window.frame(t, n, a, s, m, e), [t, SCENES.length, T0, STEP, T_MAL, T_END]);
    await p.screenshot({ path: path.join(tmp, stills ? `still-${t}.png` : `f${String(i).padStart(4, '0')}.png`) });
  }
  await b.close();
  if (stills) { console.log('Standbilder in ' + tmp); return; }
  const wav = path.join(tmp, 'ton.wav');
  execFileSync('python', [path.join(__dirname, 'spieluhr.py'), wav, String(DUR)], { stdio: 'inherit' });
  const out = path.join(__dirname, 'reel-briefe.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.png'), '-i', wav,
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
    '-af', `afade=t=out:st=${(DUR - 1).toFixed(1)}:d=1`, '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig: ' + out + ' (' + DUR.toFixed(1) + ' s)');
})();
