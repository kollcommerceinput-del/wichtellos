// Schnelles TikTok-Reel: je Sprechteil ein Bild + Text oben ohne Kasten (Toni 15./16.11.). Bildwechsel genau beim Satzanfang.
// <ordner>/szene.json (Stimme: node marketing/podcast/podcast-szene.js <abs>/szene.json → stimme.mp3) + <ordner>/bilder.json [[Bild, Text, Zoom], …] je Teil
// node marketing/reel/render-liste.js wichtel-merkst  →  <ordner>/<ordner>.mp4
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require(path.join(__dirname, '../../node_modules/playwright'));
const ORD = path.join(__dirname, process.argv[2]), AUDIO_AB = 0.3, NACH = 0.7, FPS = 30, W = 1080, H = 1920;
const k = JSON.parse(fs.readFileSync(path.join(ORD, 'szene.json'), 'utf8')), BILDER = JSON.parse(fs.readFileSync(path.join(ORD, 'bilder.json'), 'utf8'));
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
// Startzeiten wie in podcast-szene.js
let t = 0.6; const start = [], ende = [];
k.teile.forEach(([rolle, , pause], i) => { const tempo = k.rollen[rolle].tempo || 1, d = dur(path.join(ORD, `ton-${i}.wav`)) / tempo;
  start.push(t - AUDIO_AB); ende.push(t + d - AUDIO_AB); t += d + (pause ?? (k.teile[i + 1]?.[0] === rolle ? 0.5 : 0.35)); });
const gesamt = +(ende.at(-1) + NACH).toFixed(2), wechsel = start.map((s, i) => (i === 0 ? 0 : Math.max(0, s - 0.05)));
const tmp = path.join(ORD, 'tmp'); fs.mkdirSync(tmp, { recursive: true });
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(__dirname, '../../assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
(async () => {
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: W, height: H } });
  for (const [i, [, txt]] of BILDER.entries()) {
    await pg.setContent(`<style>@font-face{font-family:F;src:url(${font})}body{margin:0;background:transparent}
      div{position:absolute;top:170px;left:60px;right:60px;text-align:center;font:600 80px/1.2 F,'Segoe UI Emoji';color:#fff;
      text-shadow:0 0 6px #000,0 0 16px #000,0 0 28px #000c,0 4px 10px #000;padding:28px 20px}
      i{position:absolute;right:36px;bottom:150px;font:600 30px F;color:#fffd;text-shadow:0 0 6px #000}</style><div>${txt}</div><i>Mit KI erstellt</i>`);
    await pg.screenshot({ path: path.join(tmp, `text-${i}.png`), omitBackground: true });
  }
  await br.close();
  const ai = [], fl = [], cat = [];
  BILDER.forEach(([f, , zs], i) => {
    const bis = i + 1 < BILDER.length ? wechsel[i + 1] : gesamt, d = +(bis - wechsel[i]).toFixed(3), n = Math.round(d * FPS);
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(d), '-i', f);
    fl.push(`[${i}:v]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2},` +
      `zoompan=z='1+${zs}*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS},trim=duration=${d},setpts=PTS-STARTPTS,setsar=1[b${i}]`,
      `[${BILDER.length + i}:v]format=rgba[t${i}]`, `[b${i}][t${i}]overlay=0:0:shortest=1[c${i}]`);
    cat.push(`[c${i}]`);
  });
  BILDER.forEach((_, i) => ai.push('-loop', '1', '-framerate', String(FPS), '-t', '30', '-i', path.join(tmp, `text-${i}.png`)));
  fl.push(`${cat.join('')}concat=n=${BILDER.length}:v=1:a=0[v]`);
  ai.push('-ss', String(AUDIO_AB), '-i', path.join(ORD, 'stimme.mp3'));
  const out = path.join(ORD, path.basename(ORD) + '.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...ai, '-filter_complex', fl.join(';'), '-map', '[v]', '-map', `${BILDER.length * 2}:a`,
    '-t', String(gesamt), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log('fertig', out, gesamt, 's, Wechsel:', wechsel.map((w) => w.toFixed(2)).join(' '));
})();
