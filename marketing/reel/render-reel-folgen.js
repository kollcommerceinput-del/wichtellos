// Follower-Reel „Verpass kein Türchen“ (Toni 08.11.: „was posten, damit uns mehr abonnieren“), 1080x1920, ~11 s, ohne Musik/Ton
// (Musik wählt Toni in der App). Gleiche Datei für Instagram und TikTok.
// node marketing/reel/render-reel-folgen.js -> adventskalender/folgen/reel-folgen.mp4
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const AK = path.join(__dirname, 'adventskalender');
const OUT = path.join(AK, 'folgen');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const FPS = 30;

// [Bild, Dauer s, HTML]
const SZENEN = [
  [path.join(AK, 'folge-07/b13-gutenacht.jpg'), 2.2, '<div class="top"><div class="big">Ab 1. Dezember …</div></div>'],
  [path.join(AK, 'folge-01/b07-flug.jpg'), 1.5, '<div class="top">… erzählt Onni<br>jeden Tag</div>'],
  [path.join(AK, 'folge-03/b04-kekse.jpg'), 1.5, '<div class="top">eine neue<br>Wichtel-Geschichte</div>'],
  [path.join(AK, 'folge-05/b05-chaos.jpg'), 1.5, '<div class="top">zum Anschauen<br>und Vorlesen</div>'],
  [path.join(AK, 'folge-06/b09-flur-glitzer.jpg'), 1.8, '<div class="top"><div class="big">24 Türchen</div>24 Abenteuer</div>'],
  [path.join(AK, 'folge-06/b16-kuscheln.jpg'), 2.8, '<div class="end"><h1>Jetzt folgen,</h1><p>damit du kein Türchen verpasst!</p><div class="knopf">+ Folgen</div><div class="handle">@wichtellos</div></div>'],
];

const html = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;text-align:center}
.top{position:absolute;left:60px;right:60px;top:200px;color:#fff;font-size:84px;line-height:1.15;text-shadow:0 4px 18px rgba(0,0,0,.85),0 0 4px #000}
.top .big{font-size:120px;color:#f2b705;margin-bottom:10px}
.end{position:absolute;left:70px;right:70px;top:480px;background:rgba(255,248,240,.95);border-radius:44px;padding:56px 40px;color:#2b1b17}
.end h1{font-size:108px;line-height:1.05;margin:0;color:#c62828}.end p{font-size:62px;line-height:1.2;color:#2b1b17;margin:22px 0 0}
.knopf{display:inline-block;background:#c62828;color:#fff;font-size:84px;padding:16px 64px;border-radius:999px;margin-top:40px}
.handle{font-size:66px;color:#6d5d57;margin-top:26px}
.ki{position:absolute;right:30px;bottom:40px;color:rgba(255,255,255,.75);font-family:'Segoe UI',sans-serif;font-size:28px}
</style></head><body>${inner}</body></html>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = path.join(OUT, 'tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp);
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  const overlays = [];
  for (const [i, [, , inner]] of SZENEN.entries()) {
    await pg.setContent(html(inner + '<div class="ki">Bilder: KI-generiert</div>'));
    await pg.evaluate(() => document.fonts.ready);
    const f = path.join(tmp, `o${i}.png`);
    await pg.screenshot({ path: f, omitBackground: true });
    overlays.push(f);
  }
  await br.close();

  const inputs = [], fc = [];
  let total = 0;
  SZENEN.forEach(([bild, d], i) => {
    total += d;
    const n = Math.round(d * FPS);
    inputs.push('-loop', '1', '-t', String(d), '-i', bild, '-loop', '1', '-t', String(d), '-i', overlays[i]);
    fc.push(`[${2 * i}:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,` +
      `zoompan=z='1+0.08*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=1080x1920:fps=${FPS},setsar=1[b${i}]`);
    fc.push(`[b${i}][${2 * i + 1}:v]overlay=0:0:shortest=1,trim=duration=${d},setpts=PTS-STARTPTS[v${i}]`);
  });
  fc.push(`${SZENEN.map((_, i) => `[v${i}]`).join('')}concat=n=${SZENEN.length}:v=1:a=0,format=yuv420p[vout]`);
  inputs.push('-f', 'lavfi', '-t', total.toFixed(2), '-i', 'anullsrc=r=48000:cl=stereo');  // stille Tonspur (manche Apps wollen eine)
  const out = path.join(OUT, 'reel-folgen.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc.join(';'), '-map', '[vout]', '-map', `${2 * SZENEN.length}:a`,
    '-t', total.toFixed(2), '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-r', String(FPS), '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${out} (${total.toFixed(1)} s, ${Math.round(fs.statSync(out).size / 1024)} KB)`);
})();
