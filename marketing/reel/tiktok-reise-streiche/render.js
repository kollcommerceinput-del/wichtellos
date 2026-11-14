// TikTok „Was macht dein Wichtel, wenn du schläfst?“ – 12 Bilder aus „G:\Video bauen Projekte“, Stimme stimme.mp3
// node render.js  → tiktok-reise-streiche.mp4 (1080×1920)
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require(path.join(__dirname, '../../../node_modules/playwright'));
const P = 'G:/Video bauen Projekte/';
const B = [ // [Bild, Dauer s, Bildausschnitt x in % (bei Querformat)]
  ['Folge 01 – Onni zieht ein/eingefuegt-20261110160951.jpg', 0.875],
  ['Folge 01 – Onni zieht ein/eingefuegt-20261110163429.jpg', 0.875],
  ['Video 2026-11-11 Adventskalender/b3-flug.jpg', 0.875],
  ['Folge 01 – Onni zieht ein/eingefuegt-20261110165454.jpg', 0.875],
  ['Folge 03 – Onni und der Keks/eingefuegt-20261112164501.jpg', 0.92, 42],
  ['Folge 04 – Onnis Waschtag/bild-10.jpg', 0.92],
  ['Folge 05 – Onni im Sockenkorb/bild-10.jpg', 0.92],
  ['Folge 05 – Onni im Sockenkorb/bild-16.jpg', 0.92],
  ['Folge 08 – Onni und der Spiegel-Wichtel/bild-16.jpg', 0.92],
  ['Folge 09 – Onni, der Baumeister/bild-11.jpg', 0.92],
  ['Folge 09 – Onni, der Baumeister/bild-07.jpg', 1],
  ['Folge 06 – Onni und der Nikolaus/bild-10.jpg', 2.2],
];
const TEXTE = [['Was macht dein Wichtel,<br>wenn du schläfst? 🤫', 0, 3.3], ['Ab 1.12. · 24 Geschichten<br>Folgen ✨', 9.0, 12.2]];
const FPS = 30, W = 1080, H = 1920, tmp = path.join(__dirname, 'tmp'); fs.mkdirSync(tmp, { recursive: true });
const ROOT = path.join(__dirname, '../../..');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
(async () => {
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: W, height: H } });
  for (const [i, [t]] of TEXTE.entries()) {
    await pg.setContent(`<style>@font-face{font-family:F;src:url(${font})}body{margin:0;background:transparent}
      div{position:absolute;top:170px;left:60px;right:60px;text-align:center;font:600 76px/1.2 F,'Segoe UI Emoji';color:#fff;
      text-shadow:0 0 18px #000c,0 4px 10px #000c;padding:28px 20px;border-radius:36px;background:#0005}</style><div>${t}</div>`);
    await pg.screenshot({ path: path.join(tmp, `text-${i}.png`), omitBackground: true });
  }
  await br.close();
  const ai = [], fl = [], cat = [];
  B.forEach(([f, d, x = 50], i) => {
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(d), '-i', P + f);
    const n = Math.round(d * FPS);
    // auf 9:16 zuschneiden (mit Ausschnitt x), dann langsamer Zoom 1.0 → 1.06
    fl.push(`[${i}:v]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2}:(iw-${W * 2})*${x / 100}:(ih-${H * 2})/2,` +
      `zoompan=z='1+0.06*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS},trim=duration=${d},setpts=PTS-STARTPTS,setsar=1[b${i}]`);
    cat.push(`[b${i}]`);
  });
  let n = B.length;
  fl.push(`${cat.join('')}concat=n=${B.length}:v=1:a=0[v0]`);
  let last = 'v0';
  TEXTE.forEach(([, a, e], i) => {
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(e), '-i', path.join(tmp, `text-${i}.png`));
    fl.push(`[${n}:v]format=rgba,fade=t=in:st=${a}:d=0.3:alpha=1,fade=t=out:st=${e - 0.3}:d=0.3:alpha=1[t${i}]`, `[${last}][t${i}]overlay=0:0:enable='between(t,${a},${e})'[v${i + 1}]`);
    last = `v${i + 1}`; n++;
  });
  ai.push('-i', path.join(__dirname, 'stimme.mp3'));
  const dauer = B.reduce((s, b) => s + b[1], 0);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...ai, '-filter_complex', fl.join(';'), '-map', `[${last}]`, '-map', `${n}:a`,
    '-t', dauer.toFixed(2), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
    path.join(__dirname, 'tiktok-reise-streiche.mp4')], { stdio: 'inherit' });
  console.log('fertig', dauer.toFixed(1), 's');
})();
