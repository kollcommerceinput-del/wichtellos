// YouTube-Short „Die Wichteltür – ein Brauch aus dem Norden“ (Toni 15.11.; Fakten nach de.wikipedia.org/wiki/Wichtel, eigener Text)
// Ruhig: weiche Überblendungen (0,5 s), langsamer Zoom, Erzählerstimme ohne Musik. node render.js → youtube-wichteltuer-brauch.mp4
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require(path.join(__dirname, '../../../node_modules/playwright'));
const H_ = (f) => path.join(__dirname, f), X = 0.5;
const B = [ // [Datei, bis Sekunde]
  ['bilder/01-tuer-zu.jpg', 7.6], ['bilder/02-geht-auf.jpg', 12.3], ['bilder/03-onni-schnee.jpg', 19.3], ['bilder/04-schnee-clip.mp4', 22.3],
  ['bilder/05-haus-onni.jpg', 29.2], ['bilder/06-tuer-glitzer.jpg', 34.3], ['bilder/07-abends-keks.jpg', 40.9], ['bilder/08-morgens-ueberraschung.jpg', 45.0],
  ['bilder/09-schnell-weg.jpg', 52.9], ['bilder/10-flug.jpg', 57.8], ['bilder/11-winkt.jpg', 66.0],
];
const TEXTE = [ // oben, ohne Kasten
  ['Die Wichteltür 🚪<br>ein Brauch aus dem Norden', 0.4, 7.4], ['„Wicht“ = ein kleines Wesen', 12.5, 19.1],
  ['Dänemark: Nisse<br>Schweden: Tomte', 19.5, 29.0], ['Nissedør = Wichteltür', 29.4, 34.1],
  ['Ab 1. Dezember:<br>Onnis Adventskalender ✨', 58.0, 66.0],
];
const FPS = 30, W = 1080, H = 1920, tmp = H_('tmp'); fs.mkdirSync(tmp, { recursive: true });
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(__dirname, '../../../assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
(async () => {
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: W, height: H } });
  for (const [i, [t]] of TEXTE.entries()) {
    await pg.setContent(`<style>@font-face{font-family:F;src:url(${font})}body{margin:0;background:transparent}
      div{position:absolute;top:170px;left:60px;right:60px;text-align:center;font:600 74px/1.2 F,'Segoe UI Emoji';color:#fff;
      text-shadow:0 0 6px #000,0 0 16px #000,0 0 28px #000c,0 4px 10px #000;padding:28px 20px}</style><div>${t}</div>`);
    await pg.screenshot({ path: path.join(tmp, `text-${i}.png`), omitBackground: true });
  }
  await br.close();
  const ai = [], fl = []; let von = 0;
  B.forEach(([f, bis], i) => {
    const D = +(bis - von).toFixed(3), L = i < B.length - 1 ? D + X : D; von = bis; const n = Math.round(L * FPS);
    if (f.endsWith('.mp4')) {
      ai.push('-i', H_(f));
      fl.push(`[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS},tpad=stop_mode=clone:stop_duration=2,trim=duration=${L},setpts=PTS-STARTPTS,setsar=1,format=yuv420p[b${i}]`);
    } else {
      ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(L), '-i', H_(f));
      fl.push(`[${i}:v]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2},` +
        `zoompan=z='1+0.06*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS},trim=duration=${L},setpts=PTS-STARTPTS,setsar=1,format=yuv420p[b${i}]`);
    }
  });
  let last = 'b0';
  for (let i = 1; i < B.length; i++) { fl.push(`[${last}][b${i}]xfade=transition=fade:duration=${X}:offset=${B[i - 1][1]}[x${i}]`); last = `x${i}`; }
  let n = B.length;
  TEXTE.forEach(([, a, e], i) => {
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(e), '-i', path.join(tmp, `text-${i}.png`));
    fl.push(`[${n}:v]format=rgba,fade=t=in:st=${a}:d=0.4:alpha=1,fade=t=out:st=${(e - 0.4).toFixed(2)}:d=0.4:alpha=1[t${i}]`, `[${last}][t${i}]overlay=0:0:enable='between(t,${a},${e})'[v${i}]`);
    last = `v${i}`; n++;
  });
  ai.push('-i', H_('stimme.mp3'));
  const dauer = B[B.length - 1][1];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...ai, '-filter_complex', fl.join(';'), '-map', `[${last}]`, '-map', `${n}:a`,
    '-t', dauer.toFixed(2), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
    H_('youtube-wichteltuer-brauch.mp4')], { stdio: 'inherit' });
  console.log('fertig', dauer.toFixed(1), 's');
})();
