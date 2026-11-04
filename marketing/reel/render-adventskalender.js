// Onnis Adventskalender – Video je Folge (1080x1920): Bilder mit langsamer Kamerafahrt, Untertitel, Erzählstimme.
// node marketing/reel/render-adventskalender.js 1            -> adventskalender/folge-01/folge-01.mp4
// Stimme: adventskalender/folge-NN/ton-1.wav … (je Absatz eine Datei; Platzhalter platzhalter-N.wav, solange Tonis Aufnahme fehlt)
// Bilder: adventskalender/folge-NN/b*.jpg (3D-Onni aus Google Flow, KI) – beim Posten „Mit KI erstellt“, Kinder-Haken bei YouTube.
// Keine Musik automatisch (Toni 03.11.); MUSIK=1 legt leise Spieluhr darunter.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const N = String(process.argv[2] || '1').padStart(2, '0');
const DIR = path.join(__dirname, 'adventskalender', `folge-${N}`);
const cfg = JSON.parse(fs.readFileSync(path.join(DIR, 'folge.json'), 'utf8'));
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

// Länge einer WAV-Datei (PCM) aus dem Kopf lesen
function wavDur(f) {
  const b = fs.readFileSync(f);
  let o = 12, rate = 0, block = 0;
  while (o < b.length - 8) {
    const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') { rate = b.readUInt32LE(o + 12); block = b.readUInt16LE(o + 20); }
    if (id === 'data') return sz / (rate * block);
    o += 8 + sz + (sz % 2);
  }
  throw new Error('WAV ohne data: ' + f);
}

const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;text-align:center}
.sub{position:absolute;left:70px;right:70px;bottom:250px;color:#fff;font-size:58px;line-height:1.22;text-shadow:0 3px 12px rgba(0,0,0,.85),0 0 3px #000}
.top{position:absolute;left:0;right:0;top:120px}
.tag{display:inline-block;background:#c62828;color:#fff;font-size:44px;padding:12px 40px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.4)}
.title{color:#fff;font-size:92px;line-height:1.05;margin-top:24px;text-shadow:0 4px 18px rgba(0,0,0,.8)}
.end{position:absolute;left:60px;right:60px;top:640px;background:rgba(255,248,240,.95);border-radius:44px;padding:50px 40px;color:#2b1b17}
.end h1{font-size:96px;margin:0}.end p{font-family:'Segoe UI',sans-serif;font-size:50px;color:#6d5d57;margin:18px 0 0}
.url{display:inline-block;background:#c62828;color:#fff;font-size:78px;padding:14px 52px;border-radius:999px;margin-top:28px}
.ki{position:absolute;right:30px;bottom:40px;color:rgba(255,255,255,.7);font-family:'Segoe UI',sans-serif;font-size:28px}
</style></head><body>${inner}</body></html>`;

(async () => {
  const tmp = path.join(DIR, 'tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  // Ton: Absätze mit kurzer Pause aneinander, Untertitel-Zeiten daraus
  const PAUSE = 0.6, INTRO = 2.2, OUTRO = 3.2;
  let t = INTRO;
  const segs = cfg.absaetze.map((a, i) => {
    const f = ['ton', 'platzhalter'].map((p) => path.join(DIR, `${p}-${i + 1}.wav`)).find((x) => fs.existsSync(x));
    const d = wavDur(f), s = { ...a, f, start: t, end: t + d };
    t += d + PAUSE;
    return s;
  });
  const DUR = t - PAUSE + OUTRO;
  // Texte als PNG
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const shot = async (name, inner) => {
    await p.setContent(page(inner)); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(tmp, name), omitBackground: true });
  };
  await shot('intro.png', `<div class="top"><span class="tag">${cfg.tag}</span><div class="title">${cfg.titel}</div></div>`);
  for (const [i, s] of segs.entries()) {
    const parts = s.untertitel || [s.text];
    for (const [k, u] of parts.entries()) await shot(`sub-${i}-${k}.png`, `<div class="sub">${u}</div>`);
  }
  await shot('end.png', `<div class="end"><h1>Bis morgen! 🌙</h1><p>Morgen wartet Folge ${+N + 1} – und Onnis nächster Brief.</p><div class="url">wichtellos.de</div></div>`);
  await shot('ki.png', '<div class="ki">Bilder &amp; Video: KI-generiert</div>');
  await b.close();

  // Bild-Abschnitte: jedes Bild von seinem ersten Absatz bis zum nächsten Bildwechsel
  const scenes = [];
  segs.forEach((s, i) => {
    if (!scenes.length || scenes[scenes.length - 1].bild !== s.bild) scenes.push({ bild: s.bild, start: i === 0 ? 0 : s.start - PAUSE / 2 });
  });
  scenes.forEach((sc, i) => { sc.end = i + 1 < scenes.length ? scenes[i + 1].start : DUR; });
  const XF = 0.6, FPS = 30;
  const inputs = [], fc = [];
  scenes.forEach((sc, i) => {
    const len = sc.end - sc.start + (i + 1 < scenes.length ? XF : 0);
    const frames = Math.ceil(len * FPS);
    inputs.push('-loop', '1', '-t', len.toFixed(2), '-i', path.join(DIR, sc.bild));
    const zin = i % 2 === 0; // abwechselnd hinein- und herauszoomen
    const z = zin ? `1+0.10*on/${frames}` : `1.10-0.10*on/${frames}`;
    fc.push(`[${i}:v]scale=1620:2880:force_original_aspect_ratio=increase,crop=1620:2880,zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${FPS},setsar=1,format=yuv420p[s${i}]`);
  });
  let last = 's0', off = 0;
  scenes.forEach((sc, i) => {
    if (!i) { off = sc.end - sc.start; return; }
    fc.push(`[${last}][s${i}]xfade=transition=fade:duration=${XF}:offset=${(off - XF / 2).toFixed(2)}[x${i}]`);
    last = `x${i}`; off += sc.end - sc.start;
  });
  // Overlays
  const ov = [];
  // jedes Overlay nur so lang wie nötig (sparsam), zeitlich verschoben per setpts
  const addPng = (file, a, e) => { inputs.push('-loop', '1', '-framerate', String(FPS), '-t', (Math.min(e, DUR) - a).toFixed(2), '-i', path.join(tmp, file)); ov.push({ idx: inputs.filter((x) => x === '-i').length - 1, a, e: Math.min(e, DUR) }); };
  addPng('intro.png', 0.2, INTRO + 1.6);
  segs.forEach((s, i) => {
    const parts = s.untertitel || [s.text];
    const w = parts.map((u) => u.length), tot = w.reduce((x, y) => x + y, 0);
    let a = s.start;
    parts.forEach((u, k) => { const e = a + (s.end - s.start) * w[k] / tot; addPng(`sub-${i}-${k}.png`, a, e + (k === parts.length - 1 ? 0.25 : 0)); a = e; });
  });
  addPng('end.png', DUR - OUTRO + 0.2, DUR + 1);
  addPng('ki.png', 0, DUR + 1);
  let cur = last;
  ov.forEach((o, k) => {
    const d = o.e - o.a;
    fc.push(`[${o.idx}:v]format=rgba,fade=t=in:st=0:d=0.25:alpha=1,fade=t=out:st=${Math.max(0, d - 0.25).toFixed(2)}:d=0.25:alpha=1,setpts=PTS-STARTPTS+${o.a.toFixed(2)}/TB[o${k}]`);
    fc.push(`[${cur}][o${k}]overlay=0:0:eof_action=pass[v${k}]`);
    cur = `v${k}`;
  });
  // Ton: Absätze zeitversetzt mischen
  const aBase = inputs.filter((x) => x === '-i').length;
  segs.forEach((s) => inputs.push('-i', s.f));
  segs.forEach((s, i) => fc.push(`[${aBase + i}:a]aresample=48000,adelay=${Math.round(s.start * 1000)}:all=1[a${i}]`));
  fc.push(`${segs.map((_, i) => `[a${i}]`).join('')}amix=inputs=${segs.length}:normalize=0,apad,atrim=0:${DUR.toFixed(2)},loudnorm=I=-16:TP=-1.5:LRA=11[aout]`);
  const out = path.join(DIR, `folge-${N}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc.join(';'), '-map', `[${cur}]`, '-map', '[aout]',
    '-t', DUR.toFixed(2), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${out} (${DUR.toFixed(1)} s, ${scenes.length} Bilder)`);
})();
