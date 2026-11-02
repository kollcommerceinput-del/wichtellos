// Reel „Wichteln? Ganz simpel.“ mit dem 3D-Plüsch-Wichtel (KI-Clips aus Google Flow, Omni 1.1 Flash) -> reel-wichtel3d.mp4
// Quellen: wichtel3d/1-umschlag … 4-geschenk.mp4 (1080x1920, 24 fps, je 8 s, mit Umgebungston).
// Die Startbilder kamen aus Gemini: dessen Funkel-Zeichen unten rechts ist in Clip 1–3 nur in den ersten ~2 s sichtbar
// (wird weggeschnitten), in Clip 4 tanzt es über den Boden -> Clip 4 wird auf den oberen Teil gezoomt (Knie aufwärts).
// Texte (Fredoka) als transparente PNGs per Playwright, Schnitt + Überblendungen mit ffmpeg.
// Beim Posten auf Instagram/TikTok „Mit KI erstellt“ kennzeichnen.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const DIR = __dirname;
const ROOT = path.join(DIR, '..', '..');
const SRC = path.join(DIR, 'wichtel3d');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const XF = 0.5;     // Überblendung in s
const END = 3.2;    // Abspann in s
// Szenen: Datei, Startzeit, Länge, Bildfilter, Text
const SCENES = [
  { f: '1-umschlag.mp4', ss: 2.2, d: 5.6, vf: '', cap: 'Wichteln?<br>Ganz simpel.', big: true },
  { f: '2-liste.mp4', ss: 2.2, d: 5.6, vf: '', cap: '1. Namen<br>eintragen ✏️' },
  { f: '3-auslosung.mp4', ss: 2.2, d: 5.6, vf: '', cap: '2. Auslosen – jeder<br>bekommt seinen<br>Geheim-Link 🤫' },
  { f: '4-geschenk.mp4', ss: 0, d: 7.8, vf: 'crop=855:1520:112:0,scale=1080:1920,', cap: '3. Geheimnis lüften<br>&amp; beschenken 🎁' },
];

const css = `@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}html,body{margin:0;background:transparent}
body{width:1080px;height:1920px;position:relative;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif}
.cap{position:absolute;left:60px;right:60px;top:230px;text-align:center;font-family:Fredoka,sans-serif;font-size:92px;line-height:1.1;color:#fff;
  text-shadow:0 4px 18px rgba(0,0,0,.75),0 0 40px rgba(0,0,0,.55)}
.cap.big{font-size:118px}
.end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;
  text-shadow:0 4px 18px rgba(0,0,0,.6)}
.end .url{font-family:Fredoka,sans-serif;font-size:136px}
.end .sub{font-size:56px;line-height:1.4;margin-top:26px}
.end .btn{margin-top:70px;display:inline-block;background:#c62828;color:#fff;font-family:Fredoka,sans-serif;font-size:66px;padding:28px 60px;border-radius:999px;text-shadow:none;box-shadow:0 14px 40px rgba(0,0,0,.35)}`;

async function renderPngs(tmp) {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const shot = async (body, file) => {
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(tmp, file), omitBackground: true });
  };
  for (const [i, s] of SCENES.entries()) await shot(`<div class="cap${s.big ? ' big' : ''}">${s.cap}</div>`, `cap${i}.png`);
  await shot(`<div class="end"><div class="url">wichtellos.de</div><div class="sub">Wichteln online auslosen<br>kostenlos · ohne Anmeldung</div>
    <div class="btn">Link in der Bio 👆</div></div>`, 'end.png');
  await b.close();
}

(async () => {
  const tmp = path.join(DIR, 'tmp-wichtel3d');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp);
  await renderPngs(tmp);

  const args = ['-y', '-hide_banner', '-loglevel', 'warning'];
  SCENES.forEach((s) => args.push('-ss', String(s.ss), '-t', String(s.d), '-i', path.join(SRC, s.f)));
  SCENES.forEach((_, i) => args.push('-loop', '1', '-t', '30', '-i', path.join(tmp, `cap${i}.png`)));
  args.push('-loop', '1', '-t', '30', '-i', path.join(tmp, 'end.png'));
  // Abspann-Hintergrund: letztes Bild von Clip 4 (gezoomt), vorab als Standbild
  const last = SCENES[SCENES.length - 1];
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-sseof', '-0.1', '-i', path.join(SRC, last.f), '-frames:v', '1',
    '-vf', `${last.vf}gblur=sigma=18,eq=brightness=-0.18`, path.join(tmp, 'endbg.png')]);
  args.push('-loop', '1', '-framerate', '30', '-t', String(END), '-i', path.join(tmp, 'endbg.png'));
  const n = SCENES.length, endImg = 2 * n;

  const fc = [];
  // Szenen: Bildfilter, Text mit Ein-/Ausblenden darüber
  SCENES.forEach((s, i) => {
    fc.push(`[${i}:v]${s.vf}fps=30,setsar=1,format=yuv420p[v${i}b]`);
    fc.push(`[${n + i}:v]format=rgba,trim=duration=${s.d},fade=in:st=0.35:d=0.4:alpha=1,fade=out:st=${(s.d - 0.6).toFixed(2)}:d=0.35:alpha=1[c${i}]`);
    fc.push(`[v${i}b][c${i}]overlay=0:0:shortest=1,fps=30,settb=AVTB[v${i}]`);
    fc.push(`[${i}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,atrim=duration=${s.d},asetpts=PTS-STARTPTS[a${i}]`);
  });
  // Abspann: weichgezeichnetes Standbild + Text
  fc.push(`[${endImg + 1}:v]fps=30,setsar=1,format=yuv420p,trim=duration=${END}[eb]`);
  fc.push(`[${endImg}:v]format=rgba,trim=duration=${END},fade=in:st=0.2:d=0.5:alpha=1,fps=30[et]`);
  fc.push(`[eb][et]overlay=0:0:shortest=1,fps=30,settb=AVTB[vend]`);
  fc.push(`anullsrc=r=48000:cl=stereo,aformat=sample_fmts=fltp:channel_layouts=stereo,atrim=duration=${END}[aend]`);
  // Überblendungen Bild + Ton
  let vPrev = 'v0', aPrev = 'a0', t = SCENES[0].d;
  const parts = [...SCENES.slice(1).map((s, k) => ({ v: `v${k + 1}`, a: `a${k + 1}`, d: s.d })), { v: 'vend', a: 'aend', d: END }];
  parts.forEach((pt, k) => {
    const off = (t - XF).toFixed(2);
    fc.push(`[${vPrev}][${pt.v}]xfade=transition=fade:duration=${XF}:offset=${off}[vx${k}]`);
    fc.push(`[${aPrev}][${pt.a}]acrossfade=d=${XF}[ax${k}]`);
    vPrev = `vx${k}`; aPrev = `ax${k}`; t = t - XF + pt.d;
  });
  fc.push(`[${aPrev}]afade=t=out:st=${(t - 1.2).toFixed(2)}:d=1.2[aout]`);

  const out = path.join(DIR, 'reel-wichtel3d.mp4');
  args.push('-filter_complex', fc.join(';'), '-map', `[${vPrev}]`, '-map', '[aout]',
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', '30',
    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out);
  execFileSync(FFMPEG, args, { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig:', out, Math.round(fs.statSync(out).size / 1024) + ' KB, ' + t.toFixed(1) + ' s');
})();
