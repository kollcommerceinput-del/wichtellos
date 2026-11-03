// Reel „5 Wichtelgeschenke unter 10 €, die keiner wegwirft“ (1080x1920, 13,5 s, mit Spieluhr-Ton, gemeinfrei)
// -> marketing/reel/reel-unter10.mp4   Szenen ~1,8 s (Toni: Videos knapp halten)
// Ideen aus gifts.py (bürotauglich, alle bis 10 €). Keine Preise/Amazon-Fotos, nur Emojis.
// Foto Szene 1: 3D-Geschenk (KI, Google Flow) -> „Mit KI erstellt“ angeben. Seite hat Werbelinks -> Text mit „Werbung“.
// node marketing/reel/render-reel-unter10.js     (Standbilder: ... "1,3,5,7,9,10.5,12.5")
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const FPS = 30, DUR = 13.5, T0 = 2.2, STEP = 1.8;
const jpg = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'wichtel3d', 'stills', f)).toString('base64');
const png = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'marketing', 'onni', f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const GIFTS = [
  ['☕', 'Kakao am Stiel', 'In heiße Milch rühren – fertig', '#fde7e7'],
  ['🧦', 'Kuschelsocken', 'Warm, weich, lustige Muster', '#e3f1ea'],
  ['🕯️', 'Duftkerze', 'Zimt oder Tanne – sofort Weihnachten', '#fff1cc'],
  ['🌵', 'Mini-Pflanze', 'Braucht kaum Pflege', '#e3f1ea'],
  ['🍫', 'Gourmet-Schokolade', 'Statt der Standardtafel', '#fde7e7'],
];
const END = T0 + GIFTS.length * STEP;

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:1920px;overflow:hidden;position:relative;background:#fff8f0;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.stripe{position:absolute;top:0;left:0;right:0;height:24px;z-index:5;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
.scene{position:absolute;inset:0;opacity:0}
.badge{display:inline-block;background:#1f6f4a;color:#fff;font-size:44px;padding:10px 36px;border-radius:999px}
h1{font-size:110px;line-height:1.02;margin:18px 0 0;font-weight:600}h1 em{font-style:normal;color:#c62828}
.sub{font-family:'Segoe UI',system-ui,sans-serif;color:#6d5d57;font-size:52px;margin:24px 0 0}
.num{position:absolute;top:150px;left:0;right:0}
.num span{display:inline-block;background:#c62828;color:#fff;font-size:64px;padding:12px 44px;border-radius:999px}
.disc{position:absolute;left:190px;top:330px;width:700px;height:700px;border-radius:50%}
.emo{position:absolute;left:0;right:0;top:420px;font-size:440px;line-height:1;font-family:'Segoe UI Emoji',sans-serif}
.gt{position:absolute;left:50px;right:50px;top:1120px}
.url{display:inline-block;background:#c62828;color:#fff;font-size:84px;padding:20px 60px;border-radius:999px}
img.onni{position:absolute;filter:drop-shadow(0 14px 20px rgba(43,27,23,.25))}
.dots{position:absolute;left:0;right:0;bottom:120px;display:flex;gap:22px;justify-content:center}
.dots i{width:34px;height:34px;border-radius:50%;background:#e6d8cf;display:block}
</style></head><body><div class="stripe"></div>
<div class="scene" id="s0"><div style="position:absolute;left:0;top:0;width:1080px;height:1150px;overflow:hidden"><img id="ph" src="${jpg('geschenk.jpg')}" style="position:absolute;left:0;top:0;width:1080px;height:1150px;object-fit:cover;object-position:50% 40%;transform-origin:50% 0"></div>
  <div style="position:absolute;left:0;right:0;top:950px;height:220px;background:linear-gradient(rgba(255,248,240,0),#fff8f0)"></div>
  <div id="t0" style="position:absolute;left:50px;right:50px;top:1110px"><span class="badge">Wichteln 2026</span><h1>5 Geschenke<br>unter <em>10 €</em></h1><p class="sub">die keiner wegwirft</p></div></div>
${GIFTS.map(([e, n, t, c], i) => `<div class="scene" id="g${i}"><div class="num"><span>${i + 1} / ${GIFTS.length}</span></div>
  <div class="disc" style="background:${c}"></div><div class="emo" id="e${i}">${e}</div>
  <div class="gt" id="n${i}"><h1 style="font-size:${n.length > 14 ? 96 : 116}px">${n}</h1><p class="sub">${t}</p></div>
  <img class="onni" src="${png('sticker-daumen.png')}" style="width:250px;right:40px;top:860px"></div>`).join('')}
<div class="dots" id="dots">${GIFTS.map((_, i) => `<i id="d${i}"></i>`).join('')}</div>
<div class="scene" id="s9"><img class="onni" id="on" src="${png('sticker-geschenk.png')}" style="width:560px;left:260px;top:300px">
  <div style="position:absolute;left:50px;right:50px;top:930px"><h1 style="font-size:92px">Über <em>100 Ideen</em><br>im Geschenkfinder</h1>
  <div class="url" style="margin-top:50px">wichtellos.de</div><p class="sub">Nach Budget, Alter & Büro filtern</p></div></div>
</body></html>`;

function frame(t, n, T0, STEP, END) {
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const back = (x) => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const F = 0.15;
  const vis = (id, a, b) => { const o = Math.min(clamp((t - a) / F), clamp((b - t) / F)); document.getElementById(id).style.opacity = o; return o; };
  vis('s0', -1, T0);
  document.getElementById('ph').style.transform = `scale(${1 + t * 0.04})`;
  document.getElementById('t0').style.transform = `translateY(${(1 - back((t - 0.15) / 0.45)) * 120}px)`;
  for (let i = 0; i < n; i++) {
    const a = T0 + i * STEP;
    vis(`g${i}`, a, a + STEP);
    document.getElementById(`e${i}`).style.transform = `scale(${back((t - a - 0.05) / 0.35)}) rotate(${Math.sin(t * 4 + i) * 4}deg)`;
    document.getElementById(`n${i}`).style.transform = `translateY(${(1 - back((t - a - 0.2) / 0.35)) * 90}px)`;
    document.getElementById(`d${i}`).style.background = t >= a ? '#c62828' : '#e6d8cf';
  }
  document.getElementById('dots').style.opacity = t > T0 && t < END ? 1 : 0;
  vis('s9', END, 99);
  document.getElementById('on').style.transform = `scale(${back((t - END - 0.1) / 0.4)}) rotate(${Math.sin(t * 6) * 5}deg)`;
}

(async () => {
  const stills = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
  const tmp = path.join(__dirname, 'u10-frames');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(HTML, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(`window.frame = ${frame.toString()}`);
  const times = stills || Array.from({ length: Math.round(FPS * DUR) }, (_, i) => i / FPS);
  for (const [i, t] of times.entries()) {
    await p.evaluate(([t, n, a, s, e]) => window.frame(t, n, a, s, e), [t, GIFTS.length, T0, STEP, END]);
    await p.screenshot({ path: path.join(tmp, stills ? `still-${t}.png` : `f${String(i).padStart(4, '0')}.png`) });
  }
  await b.close();
  if (stills) { console.log('Standbilder in ' + tmp); return; }
  const wav = path.join(tmp, 'ton.wav');
  execFileSync('python', [path.join(__dirname, 'spieluhr.py'), wav, String(DUR)], { stdio: 'inherit' });
  const out = path.join(__dirname, 'reel-unter10.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.png'), '-i', wav,
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig: ' + out);
})();
