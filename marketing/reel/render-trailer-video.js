// YouTube-Video zum Podcast-Trailer (Folge 0) – Toni 13.11.: „Werbung auf YouTube wie der Trailer bei Spotify, dass es ab 1. losgeht“.
// Ton = fertiger Trailer marketing/podcast/trailer/onni-trailer.mp3 (56 s, Stimmen + Musik). Bilder: Tonis Bilder (Video 2026-11-12, Folge 02/03).
// Bildwechsel nach den Startzeiten der Trailer-Teile (aus szene.json + ton-*.wav berechnet, Stand 13.11.). Texte oben, nie auf Onni.
//   node marketing/reel/render-trailer-video.js  -> trailer-video/onni-trailer-youtube.mp4
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const VB = 'G:/Video bauen Projekte/';
const V12 = VB + 'Video 2026-11-12/', F2 = VB + 'Folge 02 – Onni und das Kuscheltier/', F3 = VB + 'Folge 03 – Onni und der Keks/';
const OUT = path.join(__dirname, 'trailer-video');
const TON = path.join(ROOT, 'marketing', 'podcast', 'trailer', 'onni-trailer.mp3');
const ENDE = 56.12;
// [Start s, Bild, Text]
const SZ = [
  [0, V12 + '1.jpg', '<h1>Tief im <em>Norden</em> …</h1><p>im verschneiten Wichtelwald</p>'],
  [5.4, V12 + '2.jpg', '<h1>… wohnt ein kleiner <em>Wichtel</em></h1><p>so groß wie ein Daumen 👍</p>'],
  [11.0, F3 + 'eingefuegt-20261112155148.jpg', '<h1>Das ist <em>Onni</em> 👋</h1>'],
  [13.8, F2 + 'onni-riecht.jpg', '<h1>Seine Nase riecht <em>alles</em> 👃</h1>'],
  [18.1, F3 + 'eingefuegt-20261112162854.jpg', '<h1><em>Kakao</em>, frische <em>Kekse</em> … 🍪</h1>'],
  [24.2, V12 + '504e4658-19bc-4173-b09c-b460c0fe68f6.jpg', '<h1>… und ein <em>Zuhause</em> 🏡</h1>'],
  [25.7, V12 + '8d8af412-eb58-4e15-8412-290a2825208c.jpg', '<h1>„Steig auf, <em>Onni!</em>“ 🦉</h1>'],
  [31.2, F3 + 'eingefuegt-20261112160143.jpg', '<h1>Ab <em>1. Dezember</em></h1><p>jeden Abend eine Geschichte</p>'],
  [36.2, V12 + '816cc703-a500-452a-9531-c0908ebf079f.jpg', '<h1><em>24 Türchen</em> bis Heiligabend 🌙</h1><p>zum Einkuscheln &amp; Einschlafen</p>'],
  [41.2, F3 + 'eingefuegt-20261112172409.jpg', '<h1>Bis zum <em>1. Dezember!</em> 👋</h1>'],
  [44.9, V12 + '2fe72207-a0cc-4149-b44f-4dd5c5da7526.jpg', '<h1 style="font-size:74px">🎧 Onnis <em>Adventskalender</em></h1><p>Spotify · Amazon Music · YouTube</p><div class="url">wichtellos.de</div><p class="folgt">Folgt uns 🔔</p>'],
];
const LEN = SZ.map(([s], i) => (i < SZ.length - 1 ? SZ[i + 1][0] : ENDE) - s);
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.box{position:absolute;top:170px;left:70px;right:70px;background:rgba(255,248,240,.95);border-radius:40px;padding:26px 36px 32px;box-shadow:0 14px 34px rgba(0,0,0,.45)}
h1{font-size:76px;line-height:1.1;margin:0;font-weight:600}h1 em{font-style:normal;color:#c62828}
p{font-size:50px;margin:12px 0 0}.url{display:inline-block;background:#c62828;color:#fff;font-size:58px;padding:8px 40px;border-radius:999px;margin-top:16px}
.folgt{font-size:54px}
</style></head><body><div class="box">${inner}</div></body></html>`;

(async () => {
  const tmp = path.join(OUT, 'tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [i, [, , html]] of SZ.entries()) {
    await p.setContent(page(html));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(tmp, `t${i}.png`), omitBackground: true });
  }
  await b.close();
  const n = SZ.length, args = [], fc = [];
  SZ.forEach(([, f]) => args.push('-i', f));
  SZ.forEach((_, i) => args.push('-loop', '1', '-i', path.join(tmp, `t${i}.png`)));
  args.push('-i', TON);
  SZ.forEach((_, i) => {
    const fr = Math.round(LEN[i] * 30), z = i % 2 ? `1.10-0.10*on/${fr}` : `1.0+0.10*on/${fr}`;
    fc.push(`[${i}:v]scale=1188:2112:force_original_aspect_ratio=increase:flags=lanczos,crop=1188:2112,zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${fr}:s=1080x1920:fps=30,setsar=1,format=yuv420p[s${i}]`);
  });
  fc.push(`${SZ.map((_, i) => `[s${i}]`).join('')}concat=n=${n}:v=1:a=0[bild]`);
  let prev = 'bild';
  SZ.forEach(([s], i) => {
    const e = s + LEN[i];
    fc.push(`[${n + i}:v]format=rgba,fade=t=in:st=${(s + 0.1).toFixed(2)}:d=0.25:alpha=1[t${i}]`);
    fc.push(`[${prev}][t${i}]overlay=0:0:enable='between(t,${(s + 0.1).toFixed(2)},${(e - 0.001).toFixed(3)})'[o${i}]`);
    prev = `o${i}`;
  });
  fc.push(`[${prev}]format=yuv420p[vout]`);
  const ziel = path.join(OUT, 'onni-trailer-youtube.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args, '-filter_complex', fc.join(';'), '-map', '[vout]', '-map', `${2 * n}:a`, '-t', ENDE.toFixed(2),
    '-c:v', 'libx264', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', ziel], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig: ' + ziel);
})();
