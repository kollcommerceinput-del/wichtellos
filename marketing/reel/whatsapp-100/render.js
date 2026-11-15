// TikTok „POV: Du sollst das Wichteln organisieren“ – Werbung für das Auslosen (Toni 15.11.)
// Bilder: zettelchaos.jpg + handy-gross.jpg (Tonis Bilder, Kauderwelsch per handy-reparieren.js ersetzt), shots/ (shots.js)
// Stimme: node marketing/podcast/podcast-szene.js …/whatsapp-100/szene.json   →   node render.js → tiktok-whatsapp-100.mp4
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require(path.join(__dirname, '../../../node_modules/playwright'));
const H_ = (f) => path.join(__dirname, f), AUDIO_AB = 0.3;
const B = [ // [Bild, bis Sekunde, Ausrichtung, Zoom-Stärke]
  ['zettelchaos.jpg', 3.3, 'center', 0.14], ['shots/1-formular.png', 4.5, 'top', 0.03], ['shots/2-namen.png', 6.1, 'top', 0.03],
  ['shots/3-ergebnis.png', 8.1, 'top', 0.03], ['handy-gross.jpg', 10.9, 'center', 0.08], ['shots/5-aufgedeckt.png', 13.1, 'top', 0.03],
  ['tmp/ende-1.png', 16.0, 'center', 0.02], ['tmp/ende-2.png', 17.7, 'center', 0.02],
];
const TEXTE = [
  ['POV: Du sollst das<br>Wichteln organisieren 😩', 0, 3.3], ['Keine Zettel –<br>nur Namen rein ✍️', 3.3, 6.1], ['1 Klick: ausgelost 🎲', 6.1, 8.1],
  ['Geheimer Link per<br>WhatsApp & Mail 📲', 8.1, 10.9], ['100 % geheim –<br>auch für dich 👀', 10.9, 13.1],
];
const FPS = 30, W = 1080, H = 1920, tmp = H_('tmp'); fs.mkdirSync(tmp, { recursive: true });
const ROOT = path.join(__dirname, '../../..');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const hg = 'data:image/jpeg;base64,' + fs.readFileSync(H_('zettelchaos.jpg')).toString('base64');
const PUNKTE = ['Per WhatsApp & E-Mail', 'Bis 100 Personen', 'In 1 Minute ausgelost', 'Geschenkefinder', 'Wichtelnamen-Generator'];
(async () => {
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: W, height: H } });
  for (const [i, [t]] of TEXTE.entries()) {
    await pg.setContent(`<style>@font-face{font-family:F;src:url(${font})}body{margin:0;background:transparent}
      div{position:absolute;top:170px;left:60px;right:60px;text-align:center;font:600 76px/1.2 F,'Segoe UI Emoji';color:#fff;
      text-shadow:0 0 18px #000c,0 4px 10px #000c;padding:28px 20px;border-radius:36px;background:#000b}</style><div>${t}</div>`);
    await pg.screenshot({ path: path.join(tmp, `text-${i}.png`), omitBackground: true });
  }
  for (const n of [1, 2]) {
    await pg.setContent(`<style>@font-face{font-family:F;src:url(${font})}body{margin:0;width:${W}px;height:${H}px;overflow:hidden;font-family:F,'Segoe UI Emoji'}
      .bg{position:absolute;inset:-40px;background:url(${hg}) center/cover;filter:blur(14px) brightness(.45)}
      .k{position:absolute;left:90px;right:90px;top:330px;background:#fff8f0;border-radius:48px;padding:64px 70px;box-shadow:0 20px 60px #0008;border-top:14px solid #c62828}
      h1{margin:0 0 40px;font-size:100px;color:#c62828;text-align:center;font-weight:600}
      p{margin:0 0 26px;font-size:58px;color:#2b1b17}p b{color:#1f6f4a}.m{color:#6d5d57;text-align:center;margin-top:36px}
      .j{position:absolute;left:80px;right:80px;top:1460px;background:#c62828;color:#fff;font-size:78px;text-align:center;padding:34px 0;border-radius:999px;box-shadow:0 12px 40px #0009}</style>
      <div class="bg"></div><div class="k"><h1>wichtellos.de 🎁</h1>${PUNKTE.map((x) => `<p><b>✓</b> ${x}</p>`).join('')}<p class="m">… und vieles mehr!</p></div>
      ${n === 2 ? '<div class="j">Jetzt bist du dran! 👉</div>' : ''}`);
    await pg.screenshot({ path: path.join(tmp, `ende-${n}.png`) });
  }
  await br.close();
  const ai = [], fl = [], cat = []; let von = 0;
  B.forEach(([f, bis, aus, zs], i) => {
    const d = +(bis - von).toFixed(3); von = bis; const n = Math.round(d * FPS);
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(d), '-i', H_(f));
    const y = aus === 'top' ? '0' : `(ih-${H * 2})/2`;
    fl.push(`[${i}:v]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2}:(iw-${W * 2})/2:${y},` +
      `zoompan=z='1+${zs}*on/${n}':x='iw/2-(iw/zoom/2)':y='${aus === 'top' ? 0 : 'ih/2-(ih/zoom/2)'}':d=1:s=${W}x${H}:fps=${FPS},trim=duration=${d},setpts=PTS-STARTPTS,setsar=1[b${i}]`);
    cat.push(`[b${i}]`);
  });
  let n = B.length; fl.push(`${cat.join('')}concat=n=${B.length}:v=1:a=0[v0]`); let last = 'v0';
  TEXTE.forEach(([, a, e], i) => {
    ai.push('-loop', '1', '-framerate', String(FPS), '-t', String(e), '-i', path.join(tmp, `text-${i}.png`));
    const fi = a === 0 ? '' : `fade=t=in:st=${a}:d=0.12:alpha=1,`;
    fl.push(`[${n}:v]format=rgba,${fi}fade=t=out:st=${(e - 0.12).toFixed(2)}:d=0.12:alpha=1[t${i}]`, `[${last}][t${i}]overlay=0:0:enable='between(t,${a},${e})'[v${i + 1}]`);
    last = `v${i + 1}`; n++;
  });
  ai.push('-ss', String(AUDIO_AB), '-i', H_('stimme.mp3'));
  const dauer = B[B.length - 1][1];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...ai, '-filter_complex', fl.join(';'), '-map', `[${last}]`, '-map', `${n}:a`,
    '-t', dauer.toFixed(2), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
    H_('tiktok-whatsapp-100.mp4')], { stdio: 'inherit' });
  console.log('fertig', dauer.toFixed(1), 's');
})();
