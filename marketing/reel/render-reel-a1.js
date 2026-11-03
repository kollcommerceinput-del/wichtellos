// Reel A1 „Onni lost aus“ (1080x1920, ~13 s): Flow-Clips a1-tuer (Onni kommt aus der Wichteltür, schüttet Lose aus)
// + a2-winken (winkt zwischen den Losen), weiche Überblendung, Text-Einblendungen, Spieluhr + leiser Original-Ton.
// Clips: marketing/reel/wichtel3d/clips-a/ (Google Flow, Omni 1.1 Flash, KI) -> „Mit KI erstellt“ angeben.
// node marketing/reel/render-reel-a1.js            (mit Spieluhr)
// OHNE_MUSIK=1 node marketing/reel/render-reel-a1.js  -> reel-a1-lose-ohne-musik.mp4 (nur Original-Ton der Clips, Musik in der App wählen)
const MUSIK = !process.env.OHNE_MUSIK;
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const CLIPS = path.join(__dirname, 'wichtel3d', 'clips-a');
const C1 = 8.0, C2 = 5.6, XF = 0.4;          // Clip-Längen, Überblendung
const DUR = C1 + C2 - XF;                     // 13,2 s
const HOOK = [0.3, 3.8], CTA = [C1 - XF + 0.5, DUR];
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.box{position:absolute;left:60px;right:60px;top:170px;background:rgba(255,248,240,.94);border-radius:40px;padding:34px 40px 40px;box-shadow:0 14px 34px rgba(0,0,0,.35)}
h1{font-size:96px;line-height:1.05;margin:0;font-weight:600}h1 em{font-style:normal;color:#c62828}
p{font-family:'Segoe UI',system-ui,sans-serif;font-size:50px;color:#6d5d57;margin:18px 0 0}
.url{display:inline-block;background:#c62828;color:#fff;font-size:82px;padding:16px 54px;border-radius:999px;margin-top:26px}
.stripe{position:absolute;top:0;left:0;right:0;height:22px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
</style></head><body>${inner}</body></html>`;

(async () => {
  const tmp = path.join(__dirname, 'a1-tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const shot = async (name, inner) => {
    await p.setContent(page(inner));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(tmp, name), omitBackground: true });
  };
  await shot('stripe.png', '<div class="stripe"></div>');
  await shot('hook.png', '<div class="box"><h1>Zettel ziehen<br>war <em>gestern</em> 😅</h1><p>Psst … Onni hat die Lose dabei</p></div>');
  await shot('cta.png', '<div class="box"><h1>Wichtel<em>Los</em></h1><p style="color:#2b1b17;font-size:56px">Jetzt <b>kostenlos</b> online auslosen –<br>ohne Anmeldung</p><div class="url">wichtellos.de</div></div>');
  await b.close();

  const wav = path.join(tmp, 'ton.wav');
  execFileSync('python', [path.join(__dirname, 'spieluhr.py'), wav, String(DUR)], { stdio: 'inherit' });
  const out = path.join(__dirname, MUSIK ? 'reel-a1-lose.mp4' : 'reel-a1-lose-ohne-musik.mp4');
  const fade = (i, [a, e]) => `[${i}:v]format=rgba,fade=t=in:st=${a}:d=0.3:alpha=1,fade=t=out:st=${(e - 0.3).toFixed(2)}:d=0.3:alpha=1[o${i}]`;
  const fc = [
    `[0:v]trim=0:${C1},setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,fps=30,format=yuv420p[v1]`,
    `[1:v]trim=0:${C2},setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,fps=30,format=yuv420p[v2]`,
    `[v1][v2]xfade=transition=fade:duration=${XF}:offset=${C1 - XF}[v]`,
    `[3:v]loop=loop=-1:size=1,trim=0:${DUR},setpts=PTS-STARTPTS,format=rgba,fade=t=out:st=${(HOOK[1] - 0.3).toFixed(2)}:d=0.3:alpha=1,fade=t=in:st=${HOOK[0]}:d=0.3:alpha=1[o3]`,
    `[4:v]loop=loop=-1:size=1,trim=0:${DUR},setpts=PTS-STARTPTS,format=rgba,fade=t=in:st=${CTA[0].toFixed(2)}:d=0.35:alpha=1[o4]`,
    `[5:v]loop=loop=-1:size=1,trim=0:${DUR},setpts=PTS-STARTPTS[o5]`,
    `[v][o3]overlay=0:0[w1]`, `[w1][o4]overlay=0:0[w2]`, `[w2][o5]overlay=0:0,format=yuv420p[vout]`,
    `[0:a]atrim=0:${C1},asetpts=PTS-STARTPTS[a1]`, `[1:a]atrim=0:${C2},asetpts=PTS-STARTPTS[a2]`,
    `[a1][a2]acrossfade=d=${XF}[orig]`,
    ...(MUSIK ? [`[orig]volume=0.35[origq]`, `[2:a]volume=1.0[mus]`, `[origq][mus]amix=inputs=2:duration=longest:normalize=0,afade=t=out:st=${(DUR - 1).toFixed(2)}:d=1[aout]`]
      : [`[orig]afade=t=out:st=${(DUR - 1).toFixed(2)}:d=1[aout]`]),
  ].join(';');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error',
    '-i', path.join(CLIPS, 'a1-tuer.mp4'), '-i', path.join(CLIPS, 'a2-winken.mp4'), '-i', wav,
    '-i', path.join(tmp, 'hook.png'), '-i', path.join(tmp, 'cta.png'), '-i', path.join(tmp, 'stripe.png'),
    '-filter_complex', fc, '-map', '[vout]', '-map', '[aout]', '-t', String(DUR),
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig: ' + out + ' (' + DUR.toFixed(1) + ' s)');
})();
