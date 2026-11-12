// Reel „Überwachungskamera erwischt Wichtel“ (Toni 12.11.: „richtig witzig, aber auch spannend“, Idee 1 von 3).
// Nachtsicht-Look (grau-grün, Rauschen, Vignette, ● REC, laufende Uhrzeit), Texte oben, Abspann in Farbe.
// Bilder aus G:\Video bauen Projekte\Folge 02 – Onni und das Kuscheltier (Tonis Bilder; Flur leer/mit Onni = gleicher Ausschnitt).
//   node marketing/reel/render-reel-kamera.js 18   -> kamera/kamera-18.mp4
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const BILD = 'G:/Video bauen Projekte/Folge 02 – Onni und das Kuscheltier/';
const SND = path.join(__dirname, 'sounds-pixabay');
const OUT = path.join(__dirname, 'kamera');
const TAGE = +(process.argv[2] || 18);

// [Bild, Dauer, Kamera?, Zoom-Ziel (x,y in 0..1) oder null, Uhrzeit-Start in s ab 03:12:00, Kamera-Name]
const SZ = [
  ['Flur_eeae6d0c.jpg', 2.6, true, null, 4, 'KAMERA 2 · FLUR'],
  ['flur-onni-hinten.jpg', 1.9, true, null, 7, 'KAMERA 2 · FLUR'],
  ['flur-onni-vorn.jpg', 3.0, true, [0.68, 0.58], 9, 'KAMERA 2 · FLUR'],
  ['Wohnzimmer_Weihnachtsbaum_9d6b7a94.jpg', 1.8, true, null, 2071, 'KAMERA 1 · WOHNZIMMER'],
  ['onni-schlaeft.jpg', 2.6, true, [0.52, 0.62], 2074, 'KAMERA 1 · WOHNZIMMER'],
  ['onni-streichelt.jpg', 3.4, false, null, 0, ''],
];
const TEXTE = [
  '<h1 style="font-size:66px">Unsere Kamera hat heute Nacht etwas <em>aufgenommen</em> …</h1>',
  '<h1>Moment … was war <em>DAS?!</em> 😳</h1>',
  '<h1>Er glaubt, wir sehen ihn <em>nicht</em> 😂</h1>',
  '<h1>35 Minuten später …</h1>',
  '<h1 style="font-size:68px">… schläft er beim Teddy. 😴</h1><p>Als wär nichts gewesen.</p>',
  `<h1>Noch <em>${TAGE} Tage</em> –</h1><p>dann zieht er bei euch ein!</p><div class="url">Folgt uns! 🔔</div>`,
];
const START = SZ.map((_, i) => SZ.slice(0, i).reduce((a, s) => a + s[1], 0));
const DUR = START.at(-1) + SZ.at(-1)[1];
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const css = `@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.box{position:absolute;top:230px;left:70px;right:70px;background:rgba(255,248,240,.94);border-radius:40px;padding:26px 36px 32px;box-shadow:0 14px 34px rgba(0,0,0,.45)}
h1{font-size:80px;line-height:1.1;margin:0;font-weight:600}h1 em{font-style:normal;color:#c62828}
p{font-size:52px;line-height:1.2;margin:12px 0 0}
.url{display:inline-block;background:#c62828;color:#fff;font-size:58px;padding:8px 40px;border-radius:999px;margin-top:16px}
.hud{position:absolute;inset:0;font-family:Consolas,'Courier New',monospace;color:#e8ffe8;text-shadow:0 0 6px rgba(0,0,0,.8);font-size:46px;text-align:left}
.rec{position:absolute;top:70px;left:70px;font-weight:700}.rec b{color:#ff3b30}
.zeit{position:absolute;top:70px;right:70px}.cam{position:absolute;bottom:90px;left:70px;font-size:40px;opacity:.9}
.ecke{position:absolute;width:90px;height:90px;border:6px solid rgba(232,255,232,.8)}`;
const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${inner}</body></html>`;

(async () => {
  const tmp = path.join(OUT, 'tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const shot = async (name, inner) => {
    await p.setContent(page(inner));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(tmp, name), omitBackground: true });
  };
  for (const [i, t] of TEXTE.entries()) await shot(`t${i}.png`, `<div class="box">${t}</div>`);
  // HUD je Kamera-Szene und Sekunde (REC blinkt, Uhr läuft)
  const ecken = '<div class="ecke" style="top:40px;left:40px;border-right:0;border-bottom:0"></div><div class="ecke" style="top:40px;right:40px;border-left:0;border-bottom:0"></div>' +
    '<div class="ecke" style="bottom:40px;left:40px;border-right:0;border-top:0"></div><div class="ecke" style="bottom:40px;right:40px;border-left:0;border-top:0"></div>';
  const hud = [];
  for (const [i, [, d, cam, , t0, name]] of SZ.entries()) {
    if (!cam) continue;
    for (let s = 0; s < Math.ceil(d); s++) {
      const sek = 3 * 3600 + 12 * 60 + t0 + s, hh = String(Math.floor(sek / 3600)).padStart(2, '0'), mm = String(Math.floor(sek / 60) % 60).padStart(2, '0'), ss = String(sek % 60).padStart(2, '0');
      const f = `hud${i}-${s}.png`;
      await shot(f, `<div class="hud">${ecken}<div class="rec">${s % 2 ? '&nbsp;' : '<b>●</b>'} REC</div><div class="zeit">13.11.2026 ${hh}:${mm}:${ss}</div><div class="cam">${name}</div></div>`);
      hud.push([f, START[i] + s, Math.min(START[i] + s + 1, START[i] + d)]);
    }
  }
  await b.close();

  const args = [], fc = [];
  SZ.forEach(([f]) => args.push('-i', BILD + f));  // Einzelbild: zoompan macht daraus d Sekunden
  const T0 = SZ.length; TEXTE.forEach((_, i) => args.push('-loop', '1', '-i', path.join(tmp, `t${i}.png`)));
  const H0 = T0 + TEXTE.length; hud.forEach(([f]) => args.push('-loop', '1', '-i', path.join(tmp, f)));
  SZ.forEach(([, d, cam, ziel], i) => {
    const fr = Math.round(d * 30);
    const z = ziel ? `1.0+0.45*on/${fr}` : `1.0+0.05*on/${fr}`;
    const x = ziel ? `iw*${ziel[0]}-(iw/zoom/2)` : 'iw/2-(iw/zoom/2)', y = ziel ? `ih*${ziel[1]}-(ih/zoom/2)` : 'ih/2-(ih/zoom/2)';
    const look = cam ? ',hue=s=0,colorchannelmixer=rr=0.55:gg=0.95:bb=0.55,eq=contrast=1.15:brightness=0.06:gamma=1.25,noise=alls=22:allf=t,vignette=PI/4' : '';
    fc.push(`[${i}:v]scale=1188:2112:force_original_aspect_ratio=increase:flags=lanczos,crop=1188:2112,zoompan=z='${z}':x='${x}':y='${y}':d=${fr}:s=1080x1920:fps=30,setsar=1${look},format=yuv420p[s${i}]`);
  });
  fc.push(`${SZ.map((_, i) => `[s${i}]`).join('')}concat=n=${SZ.length}:v=1:a=0[bild]`);
  let prev = 'bild';
  hud.forEach(([, a, e], j) => {
    fc.push(`[${H0 + j}:v]format=rgba[h${j}]`);
    fc.push(`[${prev}][h${j}]overlay=0:0:enable='between(t,${a.toFixed(2)},${(e - 0.001).toFixed(3)})'[hh${j}]`);
    prev = `hh${j}`;
  });
  TEXTE.forEach((_, i) => {
    const a = START[i] + 0.15, e = i === TEXTE.length - 1 ? DUR : START[i + 1];
    fc.push(`[${T0 + i}:v]format=rgba[t${i}]`);
    fc.push(`[${prev}][t${i}]overlay=0:0:enable='between(t,${a.toFixed(2)},${e.toFixed(2)})'[o${i}]`);
    prev = `o${i}`;
  });
  fc.push(`[${prev}]format=yuv420p[vout]`);
  // Ton: leises Rauschen-artiges Uhrticken im Flur, Schritte als Onni auftaucht, Spannung beim Zoom, Plopp, Glöckchen am Schluss
  const TON = [['uhr', 0, START[3], -16], ['laufen-holz', START[1] + 0.1, 1.6, -8], ['spannung', START[2], 3.0, -6], ['uhr', START[3], START[5] - START[3], -18],
    ['plopp', START[4] + 0.2, 1.0, -6], ['gloeckchen', START[5] + 0.2, 1.8, -10]];
  const A0 = H0 + hud.length;
  TON.forEach(([f]) => args.push('-i', path.join(SND, f + '.mp3')));
  const mix = [];
  TON.forEach(([, t, d, db], j) => {
    fc.push(`[${A0 + j}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${d.toFixed(2)},asetpts=PTS-STARTPTS,volume=${db}dB,afade=t=out:st=${Math.max(d - 0.3, 0).toFixed(2)}:d=0.3,adelay=${Math.round(t * 1000)}:all=1[a${j}]`);
    mix.push(`[a${j}]`);
  });
  fc.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,apad=whole_dur=${DUR.toFixed(2)},atrim=0:${DUR.toFixed(2)},loudnorm=I=-14:TP=-1.5[aout]`);
  const ziel = path.join(OUT, `kamera-${TAGE}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args, '-filter_complex', fc.join(';'), '-map', '[vout]', '-map', '[aout]', '-t', DUR.toFixed(2),
    '-c:v', 'libx264', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', ziel], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${ziel} (${DUR.toFixed(1)} s) – Szenen ab ${START.map((v) => v.toFixed(1)).join(', ')}`);
})();
