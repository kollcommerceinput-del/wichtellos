// Reel „Wichtel-Zubehör“ (1080x1920, 10 s, MIT Ton: selbst synthetisierte Spieluhr „Jingle Bells“, gemeinfrei)
// -> marketing/reel/reel-zubehoer.mp4   Szenen ~2,5 s (Toni: Videos knapp halten)
// Foto: 3D-Wichteltür (KI, Google Flow) -> „Mit KI erstellt“ angeben. Seite hat Werbelinks -> Text mit „Werbung“.
// node marketing/reel/render-reel-zubehoer.js     (Standbilder: ... "1.5,4,6.8,9.2")
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const FPS = 30, DUR = 10;
const jpg = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'wichtel3d', 'stills', f)).toString('base64');
const png = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'marketing', 'onni', f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const KLEIN = ['Wichteltür', 'Mini-Möbel', 'Lichterkette', 'Briefkasten', 'Wichtelbett', 'Laterne', 'Briefpapier', 'Leiter', 'Kunstschnee'];
const GROSS = ['Wichtelhaus mit Licht', 'Wichteldorf', 'Komplettset', 'Puppenhaus', 'Wichtel-Kostüm'];

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:1920px;overflow:hidden;position:relative;background:#fff8f0;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.stripe{position:absolute;top:0;left:0;right:0;height:24px;z-index:5;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
.scene{position:absolute;inset:0;opacity:0}
.badge{display:inline-block;background:#1f6f4a;color:#fff;font-size:44px;padding:10px 36px;border-radius:999px}
h1{font-size:110px;line-height:1.02;margin:18px 0 0;font-weight:600}h1 em{font-style:normal;color:#c62828}
.sub{font-family:'Segoe UI',system-ui,sans-serif;color:#6d5d57;font-size:48px;margin:24px 0 0}
.chips{position:absolute;left:50px;right:50px;top:720px;display:flex;flex-wrap:wrap;gap:22px;justify-content:center}
.chips span{background:#fff;border-radius:999px;padding:16px 34px;font-size:52px;box-shadow:0 10px 24px rgba(43,27,23,.12);display:inline-block}
.chips span:nth-child(3n+1){color:#c62828}.chips span:nth-child(3n+2){color:#1f6f4a}
.url{display:inline-block;background:#c62828;color:#fff;font-size:84px;padding:20px 60px;border-radius:999px}
img.onni{position:absolute;filter:drop-shadow(0 14px 20px rgba(43,27,23,.25))}
</style></head><body><div class="stripe"></div>
<div class="scene" id="s1"><img id="ph" src="${jpg('tuer.jpg')}" style="position:absolute;left:0;top:0;width:1080px;height:1150px;object-fit:cover;object-position:50% 30%;transform-origin:50% 0">
  <div style="position:absolute;left:0;right:0;top:950px;height:220px;background:linear-gradient(rgba(255,248,240,0),#fff8f0)"></div>
  <div id="t1" style="position:absolute;left:60px;right:60px;top:1130px"><span class="badge">38 Ideen</span><h1>Wichtel-<em>Zubehör</em></h1><p class="sub">für die Wichteltür</p></div></div>
<div class="scene" id="s2"><div style="position:absolute;left:60px;right:60px;top:240px"><span class="badge">Klein & günstig</span><h1 style="font-size:96px">Damit der Wichtel<br><em>einziehen</em> kann</h1></div>
  <div class="chips">${KLEIN.map((k, i) => `<span id="k${i}">${k}</span>`).join('')}</div></div>
<div class="scene" id="s3"><div style="position:absolute;left:60px;right:60px;top:240px"><span class="badge">Die große Wichtelwelt</span><h1 style="font-size:96px">Wenn es etwas<br><em>mehr</em> sein darf</h1></div>
  <div class="chips">${GROSS.map((k, i) => `<span id="g${i}">${k}</span>`).join('')}</div></div>
<div class="scene" id="s4"><img class="onni" id="on" src="${png('sticker-geschenk.png')}" style="width:560px;left:260px;top:330px">
  <div style="position:absolute;left:0;right:0;top:1000px"><div class="url">wichtellos.de</div><p class="sub">Alle 38 Ideen mit Link zu Amazon</p></div></div>
</body></html>`;

function frame(t, nK, nG) {
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const back = (x) => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const F = 0.2;
  const vis = (id, a, b) => { document.getElementById(id).style.opacity = Math.min(clamp((t - a) / F), clamp((b - t) / F)); };
  vis('s1', -1, 2.6); vis('s2', 2.6, 5.3); vis('s3', 5.3, 7.9); vis('s4', 7.9, 99);
  document.getElementById('ph').style.transform = `scale(${1 + t * 0.03})`;
  document.getElementById('t1').style.transform = `translateY(${(1 - back((t - 0.2) / 0.5)) * 120}px)`;
  for (let i = 0; i < nK; i++) document.getElementById(`k${i}`).style.transform = `scale(${back((t - 2.75 - i * 0.12) / 0.3)}) rotate(${Math.sin(t * 3 + i) * 2}deg)`;
  for (let i = 0; i < nG; i++) document.getElementById(`g${i}`).style.transform = `scale(${back((t - 5.45 - i * 0.15) / 0.3)}) rotate(${Math.sin(t * 3 + i) * 2}deg)`;
  document.getElementById('on').style.transform = `scale(${back((t - 8) / 0.4)}) rotate(${Math.sin(t * 6) * 5}deg)`;
}

(async () => {
  const stills = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
  const tmp = path.join(__dirname, 'zub-frames');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(HTML, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(`window.frame = ${frame.toString()}`);
  const times = stills || Array.from({ length: FPS * DUR }, (_, i) => i / FPS);
  for (const [i, t] of times.entries()) {
    await p.evaluate(([t, a, c]) => window.frame(t, a, c), [t, KLEIN.length, GROSS.length]);
    await p.screenshot({ path: path.join(tmp, stills ? `still-${t}.png` : `f${String(i).padStart(4, '0')}.png`) });
  }
  await b.close();
  if (stills) { console.log('Standbilder in ' + tmp); return; }
  const wav = path.join(tmp, 'ton.wav');
  execFileSync('python', [path.join(__dirname, 'spieluhr.py'), wav, String(DUR)], { stdio: 'inherit' });
  const out = path.join(__dirname, 'reel-zubehoer.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.png'), '-i', wav,
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig: ' + out);
})();
