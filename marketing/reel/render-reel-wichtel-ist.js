// Reel „Hast du schon mal was vom Wichtel gehört?“ (Toni 12.11.): schnelle Schnitte, je Satz ein Bild, Erzähler spricht alles.
// Stimme: wichtel-ist/stimme/buendel-0-11.wav (1 Anfrage, Charon, flott) – Schnittpunkte aus den Sprechpausen (SCHNITT, Sekunden im Original).
// Bilder: Tonis Bilder aus G:\Video bauen Projekte (Video 2026-11-12, Folge 02, Folge 03). Texte oben, nie mittig auf Onni.
//   node marketing/reel/render-reel-wichtel-ist.js tiktok   (Stimme 1,2-fach)  |  insta (1,05-fach)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const VB = 'G:/Video bauen Projekte/';
const V12 = VB + 'Video 2026-11-12/', F2 = VB + 'Folge 02 – Onni und das Kuscheltier/', F3 = VB + 'Folge 03 – Onni und der Keks/';
const SND = path.join(__dirname, 'sounds-pixabay');
const BASE = path.join(__dirname, 'wichtel-ist');
const MODUS = process.argv[2] === 'insta' ? 'insta' : 'tiktok';
const TEMPO = MODUS === 'insta' ? 1.05 : 1.2;

const SZ = [
  [V12 + '1.jpg', '<h1>Hast du schon mal was vom <em>Wichtel</em> gehört? 🤫</h1>'],
  [V12 + '2.jpg', '<h1>Ein Wichtel ist so groß wie ein <em>Daumen</em> 👍</h1>'],
  [F3 + 'flur-onni-rechts.jpg', '<h1>Die Mütze rutscht ihm <em>immer</em> über die Augen</h1>'],
  [F2 + 'onni-riecht.jpg', '<h1>Aber seine Nase riecht <em>alles!</em> 👃</h1>'],
  [V12 + '8d8af412-eb58-4e15-8412-290a2825208c.jpg', '<h1>Er reist auf einer <em>Schneeeule</em> 🦉</h1>'],
  [V12 + '612d5b5b-41a8-417e-88f1-b9ac003d7b81.jpg', '<h1>… schlüpft <em>unter der Tür</em> durch</h1>'],
  [F3 + 'eingefuegt-20261112160143.jpg', '<h1>… wohnt hinter einer <em>winzigen Tür</em> 🚪</h1>'],
  [F3 + 'eingefuegt-20261112162854.jpg', '<h1>Er nascht <em>Kekskrümel</em> 🍪</h1>'],
  [F3 + 'eingefuegt-20261112164501.jpg', '<h1>… macht <em>Streiche</em> 😏</h1>'],
  [F3 + 'eingefuegt-20261112173032.jpg', '<h1>… schreibt euch <em>Briefe</em> ✉️</h1>'],
  [F2 + 'onni-schlaeft.jpg', '<h1>Aber <em>niemand</em> darf ihn sehen!</h1>'],
  [V12 + '2fe72207-a0cc-4149-b44f-4dd5c5da7526.jpg', '<h1 style="font-size:84px">Am 1. Dezember<br>geht\'s <em>los!</em> 🎄</h1><p>Folgt uns 🔔 · Liken ❤️</p><p class="frage">Habt ihr schon eine Wichteltür? 💬</p>'],
];
// Schnittpunkte im Original-Ton (Anfang jedes Satzes), Ende der Stimme
const SCHNITT = [0.23, 2.0, 4.1, 6.05, 8.5, 10.48, 12.05, 14.2, 15.75, 16.9, 18.5, 20.4], STIMM_ENDE = 22.95, VOR = 0.15, NACH = 2.4;
const t = (o) => (o - SCHNITT[0]) / TEMPO + VOR;           // Original-Zeit -> Video-Zeit
const START = SCHNITT.map((o, i) => (i ? t(o) : 0));
const DUR = t(STIMM_ENDE) + NACH;
const LEN = START.map((s, i) => (i < START.length - 1 ? START[i + 1] : DUR) - s);
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.box{position:absolute;top:170px;left:70px;right:70px;background:rgba(255,248,240,.95);border-radius:40px;padding:26px 36px 32px;box-shadow:0 14px 34px rgba(0,0,0,.45)}
h1{font-size:76px;line-height:1.1;margin:0;font-weight:600}h1 em{font-style:normal;color:#c62828}
p{font-size:54px;margin:14px 0 0}.frage{font-size:46px;background:#c62828;color:#fff;border-radius:999px;padding:8px 24px;display:inline-block}
</style></head><body><div class="box">${inner}</div></body></html>`;

(async () => {
  const tmp = path.join(BASE, 'tmp-' + MODUS);
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [i, [, html]] of SZ.entries()) {
    await p.setContent(page(html));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(tmp, `t${i}.png`), omitBackground: true });
  }
  await b.close();
  const args = [], fc = [];
  SZ.forEach(([f]) => args.push('-i', f));
  SZ.forEach((_, i) => args.push('-loop', '1', '-i', path.join(tmp, `t${i}.png`)));
  const n = SZ.length;
  SZ.forEach((_, i) => {
    const fr = Math.round(LEN[i] * 30), z = i % 2 ? `1.12-0.12*on/${fr}` : `1.0+0.12*on/${fr}`;
    fc.push(`[${i}:v]scale=1188:2112:force_original_aspect_ratio=increase:flags=lanczos,crop=1188:2112,zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${fr}:s=1080x1920:fps=30,setsar=1,format=yuv420p[s${i}]`);
  });
  fc.push(`${SZ.map((_, i) => `[s${i}]`).join('')}concat=n=${n}:v=1:a=0[bild]`);
  let prev = 'bild';
  SZ.forEach((_, i) => {
    const e = i < n - 1 ? START[i + 1] : DUR;
    fc.push(`[${n + i}:v]format=rgba[t${i}]`);
    fc.push(`[${prev}][t${i}]overlay=0:0:enable='between(t,${START[i].toFixed(3)},${(e - 0.001).toFixed(3)})'[o${i}]`);
    prev = `o${i}`;
  });
  fc.push(`[${prev}]format=yuv420p[vout]`);
  // Ton: Stimme (beschleunigt), Plopp bei jedem Schnitt, Eule, Glitzer bei „niemand“, Glöckchen am Schluss
  const A = 2 * n;
  args.push('-i', path.join(BASE, 'stimme', 'buendel-0-11.wav'));
  fc.push(`[${A}:a]atrim=${SCHNITT[0]}:${STIMM_ENDE},asetpts=PTS-STARTPTS,atempo=${TEMPO},aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(VOR * 1000)}:all=1[stimme]`);
  const fx = [];
  START.slice(1).forEach((s) => fx.push(['plopp', s, 0.5, -16]));
  fx.push(['fluegel', START[4], LEN[4], -10], ['glitzer', START[10], 1.2, -14], ['gloeckchen', START[11] + 0.1, 1.8, -10]);
  fx.forEach(([f]) => args.push('-i', path.join(SND, f + '.mp3')));
  const mix = ['[stimme]'];
  fx.forEach(([, s, d, db], j) => {
    fc.push(`[${A + 1 + j}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${d.toFixed(2)},asetpts=PTS-STARTPTS,volume=${db}dB,afade=t=out:st=${Math.max(d - 0.2, 0).toFixed(2)}:d=0.2,adelay=${Math.round(s * 1000)}:all=1[f${j}]`);
    mix.push(`[f${j}]`);
  });
  fc.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,apad=whole_dur=${DUR.toFixed(2)},atrim=0:${DUR.toFixed(2)},loudnorm=I=-14:TP=-1.5[aout]`);
  const ziel = path.join(BASE, `wichtel-ist-${MODUS}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args, '-filter_complex', fc.join(';'), '-map', '[vout]', '-map', '[aout]', '-t', DUR.toFixed(2),
    '-c:v', 'libx264', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', ziel], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${ziel} (${DUR.toFixed(1)} s) – Schnitte: ${START.map((v) => v.toFixed(1)).join(', ')}`);
})();
