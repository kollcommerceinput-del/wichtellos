// Reel C1 „Onni packt aus: Tasse“ (1080x1920, ~14,9 s): Flow-Clip c1-tasse-gruen (Toni 11.11., Onni im Schnee packt grünes
// Geschenk aus, Tasse mit Dampf). Stummes Bild -> geschenk-tasse/bild.mp4; Stimme + Geräusche danach mit
//   node marketing/reel/stimme-reel.js geschenk-tasse/stimme.json  -> geschenk-tasse/reel-tasse-stimme.mp4
// Seite mit Amazon-Links -> beim Posten „Werbung“ + „Mit KI erstellt“ angeben.
// node marketing/reel/render-reel-c1.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const CLIP = path.join(__dirname, 'wichtel3d', 'clips-a', 'c1-tasse-gruen.mp4');
const OUTDIR = path.join(__dirname, 'geschenk-tasse');
const DUR = 14.9;
const HOOK = [0.3, 4.6], CTA = [9.4, DUR];
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.box{position:absolute;left:60px;right:60px;background:rgba(255,248,240,.94);border-radius:40px;padding:30px 40px 36px;box-shadow:0 14px 34px rgba(0,0,0,.35)}
h1{font-size:90px;line-height:1.05;margin:0;font-weight:600}h1 em{font-style:normal;color:#c62828}
p{font-family:'Segoe UI',system-ui,sans-serif;font-size:46px;color:#6d5d57;margin:14px 0 0}
.url{display:inline-block;background:#c62828;color:#fff;font-size:64px;padding:10px 44px;border-radius:999px;margin-top:16px}
.stripe{position:absolute;top:0;left:0;right:0;height:22px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
</style></head><body>${inner}</body></html>`;

(async () => {
  const tmp = path.join(__dirname, 'c1-tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  fs.mkdirSync(OUTDIR, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const shot = async (name, inner) => {
    await p.setContent(page(inner));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(tmp, name), omitBackground: true });
  };
  await shot('stripe.png', '<div class="stripe"></div>');
  // Hook oben (Onni ist am Anfang klein in der Bildmitte), CTA unten (am Ende hält Onni die Tasse oben ins Bild)
  await shot('hook.png', '<div class="box" style="top:140px"><h1>Wichtelgeschenk<br>unter <em>10 €</em> 🎁</h1><p>Onni packt schon mal aus …</p></div>');
  await shot('cta.png', '<div class="box" style="top:1160px"><h1 style="font-size:70px;white-space:nowrap">Eine <em>Tasse</em> geht immer ☕</h1><p style="color:#2b1b17;font-size:42px;margin-top:8px">Über 100 Ideen nach Budget &amp; Alter</p><div class="url">wichtellos.de</div></div>');
  await b.close();

  const out = path.join(OUTDIR, 'bild.mp4');
  const fc = [
    `[0:v]trim=0:${DUR},setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,fps=30,format=yuv420p[v]`,
    `[1:v]loop=loop=-1:size=1,trim=0:${DUR},setpts=PTS-STARTPTS,format=rgba,fade=t=out:st=${(HOOK[1] - 0.3).toFixed(2)}:d=0.3:alpha=1,fade=t=in:st=${HOOK[0]}:d=0.3:alpha=1[o1]`,
    `[2:v]loop=loop=-1:size=1,trim=0:${DUR},setpts=PTS-STARTPTS,format=rgba,fade=t=in:st=${CTA[0].toFixed(2)}:d=0.35:alpha=1[o2]`,
    `[3:v]loop=loop=-1:size=1,trim=0:${DUR},setpts=PTS-STARTPTS[o3]`,
    `[v][o1]overlay=0:0[w1]`, `[w1][o2]overlay=0:0[w2]`, `[w2][o3]overlay=0:0,format=yuv420p[vout]`,
  ].join(';');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error',
    '-i', CLIP, '-i', path.join(tmp, 'hook.png'), '-i', path.join(tmp, 'cta.png'), '-i', path.join(tmp, 'stripe.png'),
    '-filter_complex', fc, '-map', '[vout]', '-an', '-t', String(DUR),
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig: ' + out + ' (' + DUR.toFixed(1) + ' s)');
})();
