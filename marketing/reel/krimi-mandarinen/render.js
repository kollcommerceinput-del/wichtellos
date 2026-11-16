// TikTok/Reel-Krimi „Wer war das?!“ – bemalte Mandarinen, Spuren (Filzstift, blaue Nase), Onni ertappt (Toni 16.11.)
// Bilder aus Folge 10 („G:\Video bauen Projekte\Folge 10 – Onni und die Mandarinen-Gesichter“). Texte ohne Kasten (Toni 15.11.)
// Stimme: node marketing/podcast/podcast-szene.js …/krimi-mandarinen/szene.json   →   node render.js → krimi-mandarinen.mp4
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require(path.join(__dirname, '../../../node_modules/playwright'));
const P = 'G:/Video bauen Projekte/Folge 10 – Onni und die Mandarinen-Gesichter/', AUDIO_AB = 0.3, H_ = (f) => path.join(__dirname, f);
const B = [ // [Bild, bis Sekunde, Zoom]
  ['bild-14.jpg', 0.75, 0.05], ['bild-12.jpg', 1.45, 0.05], ['bild-13.jpg', 2.2, 0.05], ['bild-05.jpg', 3.6, 0.08],
  ['bild-10.jpg', 6.05, 0.1], ['bild-16.jpg', 8.95, 0.08], ['bild-18.jpg', 10.0, 0.18], ['bild-15.jpg', 13.0, 0.06], ['bild-19.jpg', 15.2, 0.04],
];
const TEXTE = [
  ['Heute Morgen<br>im Wohnzimmer … 😳', 0, 2.2], ['Wer war das?! 🕵️', 2.2, 3.6], ['Spur 1:<br>ein Filzstift 🖊️', 3.6, 6.05],
  ['Spur 2:<br>eine blaue Nase 🔵', 6.05, 8.95], ['ERTAPPT! 😂', 8.95, 10.0], ['Ab 1. Dezember:<br>jede Nacht ein Streich 🎄', 10.0, 13.0],
  ['Folgt uns! 👉', 13.0, 15.2],
];
const FPS = 30, W = 1080, H = 1920, tmp = H_('tmp'); fs.mkdirSync(tmp, { recursive: true });
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(__dirname, '../../../assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
(async () => {
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: W, height: H } });
  for (const [i, [t]] of TEXTE.entries()) {
    await pg.setContent(`<style>@font-face{font-family:F;src:url(${font})}body{margin:0;background:transparent}
      div{position:absolute;top:170px;left:60px;right:60px;text-align:center;font:600 80px/1.2 F,'Segoe UI Emoji';color:#fff;
      text-shadow:0 0 6px #000,0 0 16px #000,0 0 28px #000c,0 4px 10px #000;padding:28px 20px}</style><div>${t}</div>`);
    await pg.screenshot({ path: path.join(tmp, `text-${i}.png`), omitBackground: true });
  }
  await br.close();
  const ai = [], fl = [], cat = []; let von = 0;
  B.forEach(([f, bis, zs], i) => {
    const d = +(bis - von).toFixed(3); von = bis; const n = Math.round(d * FPS);
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(d), '-i', P + f);
    fl.push(`[${i}:v]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2},` +
      `zoompan=z='1+${zs}*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS},trim=duration=${d},setpts=PTS-STARTPTS,setsar=1[b${i}]`);
    cat.push(`[b${i}]`);
  });
  let n = B.length; fl.push(`${cat.join('')}concat=n=${B.length}:v=1:a=0[v0]`); let last = 'v0';
  TEXTE.forEach(([, a, e], i) => {
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(e), '-i', path.join(tmp, `text-${i}.png`));
    const fi = a === 0 ? '' : `fade=t=in:st=${a}:d=0.1:alpha=1,`;
    fl.push(`[${n}:v]format=rgba,${fi}fade=t=out:st=${(e - 0.1).toFixed(2)}:d=0.1:alpha=1[t${i}]`, `[${last}][t${i}]overlay=0:0:enable='between(t,${a},${e})'[v${i + 1}]`);
    last = `v${i + 1}`; n++;
  });
  ai.push('-ss', String(AUDIO_AB), '-i', H_('stimme.mp3'));
  const dauer = B[B.length - 1][1];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...ai, '-filter_complex', fl.join(';'), '-map', `[${last}]`, '-map', `${n}:a`,
    '-t', dauer.toFixed(2), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart',
    H_('krimi-mandarinen.mp4')], { stdio: 'inherit' });
  console.log('fertig', dauer.toFixed(1), 's');
})();
