// Schnelle Fassung (Insta/TikTok, Toni 15.11.) zum YouTube-Short „Wichteltür – Brauch aus dem Norden“: harte Schnitte, ~16,3 s
// Stimme: node marketing/podcast/podcast-szene.js …/schnell/szene.json   →   node render-schnell.js → schnell/wichteltuer-brauch-schnell.mp4
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require(path.join(__dirname, '../../../node_modules/playwright'));
const H_ = (f) => path.join(__dirname, f), AUDIO_AB = 0.3;
const B = [ // [Datei, bis Sekunde, Zoom]
  ['bilder/01-tuer-zu.jpg', 2.15, 0.08], ['bilder/02-geht-auf.jpg', 3.0, 0.05], ['bilder/12-arme-auf.jpg', 3.96, 0.05],
  ['bilder/04-schnee-clip.mp4', 5.4, 0], ['bilder/06-tuer-glitzer.jpg', 6.83, 0.05], ['bilder/13-keksteller.jpg', 8.67, 0.06],
  ['bilder/08-morgens-ueberraschung.jpg', 10.13, 0.1], ['bilder/09-schnell-weg.jpg', 11.22, 0.08], ['bilder/10-flug.jpg', 12.8, 0.05], ['bilder/11-winkt.jpg', 16.3, 0.05],
];
const TEXTE = [
  ['Kennst du die Wichteltür? 🚪', 0, 2.15], ['Dahinter wohnt …<br>ein Wichtel! 👀', 2.15, 3.96], ['Dänemark: Nisse<br>Seine Tür: Nissedør', 3.96, 6.83],
  ['Abends: Kekse 🍪', 6.83, 8.67], ['Morgens: angebissen! 😱', 8.67, 10.13], ['Gesehen? Nie!', 10.13, 11.22], ['Ab 1. Dezember:<br>Onni zieht ein ✨', 11.22, 14.1], ['Folgt uns,<br>damit ihr nichts verpasst! 👉', 14.1, 16.3],
];
const FPS = 30, W = 1080, H = 1920, tmp = H_('tmp'); fs.mkdirSync(tmp, { recursive: true });
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(__dirname, '../../../assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
(async () => {
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: W, height: H } });
  for (const [i, [t]] of TEXTE.entries()) {
    await pg.setContent(`<style>@font-face{font-family:F;src:url(${font})}body{margin:0;background:transparent}
      div{position:absolute;top:170px;left:60px;right:60px;text-align:center;font:600 78px/1.2 F,'Segoe UI Emoji';color:#fff;
      text-shadow:0 0 6px #000,0 0 16px #000,0 0 28px #000c,0 4px 10px #000;padding:28px 20px}</style><div>${t}</div>`);
    await pg.screenshot({ path: path.join(tmp, `s-text-${i}.png`), omitBackground: true });
  }
  await br.close();
  const ai = [], fl = [], cat = []; let von = 0;
  B.forEach(([f, bis, zs], i) => {
    const d = +(bis - von).toFixed(3); von = bis; const n = Math.round(d * FPS);
    if (f.endsWith('.mp4')) { ai.push('-i', H_(f)); fl.push(`[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS},trim=duration=${d},setpts=PTS-STARTPTS,setsar=1[b${i}]`); }
    else {
      ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(d), '-i', H_(f));
      fl.push(`[${i}:v]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2},` +
        `zoompan=z='1+${zs}*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS},trim=duration=${d},setpts=PTS-STARTPTS,setsar=1[b${i}]`);
    }
    cat.push(`[b${i}]`);
  });
  let n = B.length; fl.push(`${cat.join('')}concat=n=${B.length}:v=1:a=0[v0]`); let last = 'v0';
  TEXTE.forEach(([, a, e], i) => {
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(e), '-i', path.join(tmp, `s-text-${i}.png`));
    const fi = a === 0 ? '' : `fade=t=in:st=${a}:d=0.1:alpha=1,`;
    fl.push(`[${n}:v]format=rgba,${fi}fade=t=out:st=${(e - 0.1).toFixed(2)}:d=0.1:alpha=1[t${i}]`, `[${last}][t${i}]overlay=0:0:enable='between(t,${a},${e})'[v${i + 1}]`);
    last = `v${i + 1}`; n++;
  });
  ai.push('-ss', String(AUDIO_AB), '-i', H_('schnell/stimme.mp3'));
  const dauer = B[B.length - 1][1];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...ai, '-filter_complex', fl.join(';'), '-map', `[${last}]`, '-map', `${n}:a`,
    '-t', dauer.toFixed(2), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart',
    H_('schnell/wichteltuer-brauch-schnell.mp4')], { stdio: 'inherit' });
  console.log('fertig', dauer.toFixed(1), 's');
})();
