// Reel „Ab 1. Dezember ist es so weit“ (Toni 09.11.): Veo-Clip Onni + Eule im Schneewald (F:\Download → adventskalender/ab-dezember/clip.mp4),
// Texte oben, Schluss = letztes Bild steht + Karte Onnis Adventskalender. Stimme/Geräusche danach mit stimme-reel.js (ab-dezember/stimme.json).
// node marketing/reel/render-reel-ab-dezember.js   -> adventskalender/ab-dezember/reel-ab-dezember.mp4 (stumm)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const DIR = path.join(__dirname, 'adventskalender', 'ab-dezember');
const CLIP = path.join(DIR, 'clip.mp4');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const SCHNITT = 7.1, STEHT = 3.4, LAENGE = SCHNITT + STEHT;   // Veo blendet ab ~7,2 s aus → vorher einfrieren

// [von, bis, HTML]
const TEXTE = [
  [0.2, 1.0, '<div class="top"><div class="big">Psst … 🤫</div></div>'],
  [1.0, 3.9, '<div class="top">Ab <span class="gelb">1. Dezember</span><br>ist es so weit …</div>'],
  [3.9, SCHNITT, '<div class="top">… dann kommt der Wichtel<br>aus dem <span class="gelb">Wichtelwald</span> 🌲</div>'],
  [SCHNITT, LAENGE, '<div class="karte"><div class="k1">Onnis</div><div class="k2">Adventskalender</div><p>24 Wichtel-Geschichten<br>ab 1. Dezember – jeden Tag eine</p><div class="url">wichtellos.de</div></div>'],
];

const html = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,'Segoe UI Emoji',sans-serif;text-align:center}
.top{position:absolute;left:40px;right:40px;top:200px;color:#fff;font-size:86px;line-height:1.15;text-shadow:0 4px 20px rgba(0,0,0,.95),0 0 5px #000}
.top .big{font-size:130px;color:#f2b705}
.gelb{color:#f2b705}
.karte{position:absolute;left:80px;right:80px;top:170px;background:rgba(255,248,240,.95);border-radius:48px;padding:50px 40px 56px;color:#2b1b17;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.k1{font-size:76px;color:#6d5d57;line-height:1}.k2{font-size:108px;color:#c62828;line-height:1.05}
.karte p{font-family:'Segoe UI',sans-serif;font-size:50px;line-height:1.3;margin:26px 0 0;color:#2b1b17}
.url{display:inline-block;margin-top:34px;background:#c62828;color:#fff;font-size:80px;padding:14px 60px;border-radius:999px}
.ki{position:absolute;right:28px;bottom:36px;color:rgba(255,255,255,.75);font-family:'Segoe UI',sans-serif;font-size:26px}
</style></head><body>${inner}<div class="ki">Video: KI-generiert</div></body></html>`;

(async () => {
  const tmp = path.join(DIR, 'tmp');
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const ov = [];
  for (const [i, [, , inner]] of TEXTE.entries()) {
    await p.setContent(html(inner));
    await p.evaluate(() => document.fonts.ready);
    ov.push(path.join(tmp, `o${i}.png`));
    await p.screenshot({ path: ov[i], omitBackground: true });
  }
  await b.close();
  const inp = ['-i', CLIP], fc = [`[0:v]trim=0:${SCHNITT},setpts=PTS-STARTPTS,fps=30,tpad=stop_mode=clone:stop_duration=${STEHT},format=yuv420p[v0]`];
  TEXTE.forEach(([von, bis], i) => {
    inp.push('-loop', '1', '-t', String(LAENGE), '-i', ov[i]);
    fc.push(`[${i + 1}:v]format=rgba,fade=t=in:st=${von}:d=0.25:alpha=1${bis < LAENGE ? `,fade=t=out:st=${bis - 0.2}:d=0.2:alpha=1` : ''}[t${i}]`);
    fc.push(`[v${i}][t${i}]overlay=0:0:shortest=1[v${i + 1}]`);
  });
  const out = path.join(DIR, 'reel-ab-dezember.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inp, '-filter_complex', fc.join(';'), '-map', `[v${TEXTE.length}]`, '-t', String(LAENGE),
    '-c:v', 'libx264', '-crf', '19', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'inherit' });
  // Veo-Ton (Wind/Schnee) für stimme.json, nur bis zum Schnitt
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', CLIP, '-vn', '-t', String(SCHNITT), '-af', `afade=t=out:st=${SCHNITT - 0.6}:d=0.6`, '-ar', '48000', '-ac', '2', path.join(DIR, 'veo-ton.wav')]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(out);
})();
