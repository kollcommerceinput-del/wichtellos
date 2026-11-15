// TikTok „POV: winziger Mitbewohner“ – Wichteltür geht auf, Onni winkt, Bett, Brief, Tür zu (Toni 15.11., max. 12 s)
// Bilder: „G:\Video bauen Projekte\TikTok Wichteltür“, Stimme stimme.mp3 (podcast-szene.js szene.json, tempo 1.4)
// node render.js  → tiktok-wichteltuer.mp4 (1080×1920)
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require(path.join(__dirname, '../../../node_modules/playwright'));
const P = 'G:/Video bauen Projekte/TikTok Wichteltür/';
const AUDIO_AB = 0.3;             // Stimme 0,3 s früher beginnen lassen
const B = [ // [Bild, bis Sekunde]
  ['A-tuer-zu.jpg', 1.7], ['C-geht-auf.jpg', 2.6], ['E-winkt.jpg', 3.15], ['D-arme-auf.jpg', 3.7], ['F-steht.jpg', 4.15],
  ['G-glitzer.jpg', 4.6], ['J-bett.jpg', 5.65], ['I-brief-schreiben.jpg', 7.8], ['K-tuer-brief-licht.jpg', 9.6], ['B-tuer-brief.jpg', 11.8],
];
const TEXTE = [ // [Text, von, bis] – immer oben, nie mittig
  ['POV:<br>Plötzlich hast du einen<br>winzigen Mitbewohner 🤏', 0, 2.75],
  ['Der Wichtel ist da! 🎉', 2.75, 3.7],
  ['Komm rein! 🚪', 3.7, 4.55],
  ['Schlafplatz: Socke 🧦', 4.55, 5.65],
  ['Hobby: Chaos stiften … 😈', 5.65, 6.85],
  ['… und Briefe schreiben 📝', 6.85, 7.8],
  ['24 Wichtel-Streiche 🎄<br>Ab 1. Dezember!', 7.8, 11.8],
];
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
  let von = 0;
  B.forEach(([f, bis], i) => {
    const d = +(bis - von).toFixed(3); von = bis;
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(d), '-i', P + f);
    const n = Math.round(d * FPS);
    fl.push(`[${i}:v]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2},` +
      `zoompan=z='1+0.06*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS},trim=duration=${d},setpts=PTS-STARTPTS,setsar=1[b${i}]`);
    cat.push(`[b${i}]`);
  });
  let n = B.length;
  fl.push(`${cat.join('')}concat=n=${B.length}:v=1:a=0[v0]`);
  let last = 'v0';
  TEXTE.forEach(([, a, e], i) => {
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(e), '-i', path.join(tmp, `text-${i}.png`));
    const fi = a === 0 ? '' : `fade=t=in:st=${a}:d=0.12:alpha=1,`;
    fl.push(`[${n}:v]format=rgba,${fi}fade=t=out:st=${(e - 0.12).toFixed(2)}:d=0.12:alpha=1[t${i}]`, `[${last}][t${i}]overlay=0:0:enable='between(t,${a},${e})'[v${i + 1}]`);
    last = `v${i + 1}`; n++;
  });
  ai.push('-ss', String(AUDIO_AB), '-i', path.join(__dirname, 'stimme.mp3'));
  const dauer = B[B.length - 1][1];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...ai, '-filter_complex', fl.join(';'), '-map', `[${last}]`, '-map', `${n}:a`,
    '-t', dauer.toFixed(2), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
    path.join(__dirname, 'tiktok-wichteltuer.mp4')], { stdio: 'inherit' });
  console.log('fertig', dauer.toFixed(1), 's');
})();
