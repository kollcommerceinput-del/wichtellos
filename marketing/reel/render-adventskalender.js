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
  // ton-0.wav = gesprochener Titel (optional): Intro so lang wie der Titel
  const TITEL = path.join(DIR, 'ton-0.wav');
  const PAUSE = 0.6, OUTRO = 3.2, INTRO = fs.existsSync(TITEL) ? Math.max(2.2, wavDur(TITEL) + 0.5) : 2.2;
  let t = INTRO;
  const segs = cfg.absaetze.map((a, i) => {
    const f = ['ton', 'platzhalter'].map((p) => path.join(DIR, `${p}-${i + 1}.wav`)).find((x) => fs.existsSync(x));
    // ohne Aufnahme: Dauer nach Lesetempo (ca. 13 Zeichen/s, mind. 2,4 s je Zeile)
    const d = f ? wavDur(f) : (a.untertitel || [a.text]).reduce((x, u) => x + Math.max(2.4, u.length / 13), 0);
    const s = { ...a, f, start: t, end: t + d };
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
  const endH = cfg.endeTitel || 'Bis morgen! 🌙', endP = cfg.endeText || `Morgen wartet Folge ${+N + 1} – und Onnis nächster Brief.`;
  await shot('end.png', `<div class="end"><h1>${endH}</h1><p>${endP}</p><div class="url">wichtellos.de</div></div>`);
  await shot('ki.png', '<div class="ki">Bilder &amp; Video: KI-generiert</div>');
  await b.close();

  // Bild-Abschnitte: jedes Bild von seinem ersten Absatz bis zum nächsten Bildwechsel
  const scenes = [];
  segs.forEach((s, i) => {
    if (!scenes.length || scenes[scenes.length - 1].bild !== s.bild) scenes.push({ bild: s.bild, start: i === 0 ? 0 : s.start - PAUSE / 2 });
  });
  scenes.forEach((sc, i) => { sc.end = i + 1 < scenes.length ? scenes[i + 1].start : DUR; });
  const XF = 0.6, FPS = 30;
  // Untertitel-Zeiten
  const subs = [];
  segs.forEach((s, i) => {
    const parts = s.untertitel || [s.text];
    const w = parts.map((u) => u.length), tot = w.reduce((x, y) => x + y, 0);
    let a = s.start;
    parts.forEach((u, k) => { const e = a + (s.end - s.start) * w[k] / tot; subs.push({ file: `sub-${i}-${k}.png`, a, e: e + (k === parts.length - 1 ? 0.25 : 0) }); a = e; });
  });
  // Schnell (06.11.): jedes Bild wird als eigener Clip gerechnet – Zoom + nur SEINE Untertitel – und im Ordner cache/ aufgehoben.
  // Ändern sich nur Ton/Geräusche oder ein Bild, werden nur die betroffenen Clips neu gerechnet. Je 2 Clips gleichzeitig (2 Kerne).
  const crypto = require('crypto');
  const CACHE = path.join(DIR, 'cache'); fs.mkdirSync(CACHE, { recursive: true });
  const sha = (x) => crypto.createHash('sha1').update(x).digest('hex').slice(0, 16);
  const jobs = scenes.map((sc, i) => {
    sc.t0 = i === 0 ? 0 : sc.start - XF / 2;
    const t1 = i + 1 < scenes.length ? sc.end + XF / 2 : DUR;
    const len = t1 - sc.t0, frames = Math.ceil(len * FPS);
    const zin = i % 2 === 0; // abwechselnd hinein- und herauszoomen
    const z = zin ? `1+0.10*on/${frames}` : `1.10-0.10*on/${frames}`;
    const mine = subs.filter((s) => s.a >= sc.start && s.a < sc.end).map((s) => ({ ...s, la: s.a - sc.t0, d: Math.min(s.e, t1) - s.a }));
    const st = fs.statSync(path.join(DIR, sc.bild));
    const key = sha(JSON.stringify({ v: 1, bild: sc.bild, size: st.size, m: st.mtimeMs, len: len.toFixed(3), z,
      subs: mine.map((s) => [sha(fs.readFileSync(path.join(tmp, s.file))), s.la.toFixed(3), s.d.toFixed(3)]) }));
    sc.clip = path.join(CACHE, `clip-${i}-${key}.mp4`);
    if (fs.existsSync(sc.clip)) return null;
    const a = ['-y', '-loglevel', 'error', '-i', path.join(DIR, sc.bild)], f = [];
    f.push(`[0:v]scale=1620:2880:force_original_aspect_ratio=increase,crop=1620:2880,zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${FPS},setsar=1,format=yuv420p[b0]`);
    mine.forEach((s, k) => {
      a.push('-loop', '1', '-framerate', String(FPS), '-t', s.d.toFixed(2), '-i', path.join(tmp, s.file));
      f.push(`[${k + 1}:v]format=rgba,fade=t=in:st=0:d=0.25:alpha=1,fade=t=out:st=${Math.max(0, s.d - 0.25).toFixed(2)}:d=0.25:alpha=1,setpts=PTS-STARTPTS+${s.la.toFixed(2)}/TB[o${k}]`);
      f.push(`[b${k}][o${k}]overlay=0:0:eof_action=pass[b${k + 1}]`);
    });
    a.push('-filter_complex', f.join(';'), '-map', `[b${mine.length}]`, '-t', len.toFixed(3), '-r', String(FPS),
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '15', '-pix_fmt', 'yuv420p', sc.clip);
    return { i, args: a };
  }).filter(Boolean);
  // alte Clips dieser Folge aufräumen (nur die, die nicht mehr gebraucht werden)
  const keep = new Set(scenes.map((sc) => path.basename(sc.clip)));
  fs.readdirSync(CACHE).filter((f) => !keep.has(f)).forEach((f) => fs.rmSync(path.join(CACHE, f)));
  console.log(`Bilder: ${scenes.length - jobs.length} aus dem Zwischenspeicher, ${jobs.length} neu`);
  const { spawn } = require('child_process');
  const run = (j) => new Promise((ok, no) => { const pr = spawn(FFMPEG, j.args, { stdio: 'inherit' }); pr.on('exit', (c) => (c ? no(new Error(`Clip ${j.i} fehlgeschlagen`)) : ok())); });
  const queue = [...jobs];
  await Promise.all([0, 1].map(async () => { while (queue.length) await run(queue.shift()); }));

  const inputs = [], fc = [];
  scenes.forEach((sc, i) => { inputs.push('-i', sc.clip); fc.push(`[${i}:v]setsar=1,format=yuv420p,settb=AVTB,fps=${FPS}[s${i}]`); });
  let last = 's0';
  scenes.forEach((sc, i) => {
    if (!i) return;
    fc.push(`[${last}][s${i}]xfade=transition=fade:duration=${XF}:offset=${sc.t0.toFixed(3)}[x${i}]`);
    last = `x${i}`;
  });
  // Overlays über das ganze Video: nur noch Titel, Abspann, KI-Hinweis
  const ov = [];
  const addPng = (file, a, e) => { inputs.push('-loop', '1', '-framerate', String(FPS), '-t', (Math.min(e, DUR) - a).toFixed(2), '-i', path.join(tmp, file)); ov.push({ idx: inputs.filter((x) => x === '-i').length - 1, a, e: Math.min(e, DUR) }); };
  addPng('intro.png', 0.2, INTRO + 1.6);
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
  const nIn = () => inputs.filter((x) => x === '-i').length;
  const voiced = segs.filter((s) => s.f);
  const parts = [];
  if (fs.existsSync(TITEL)) voiced.unshift({ f: TITEL, start: 0.2 });
  voiced.forEach((s) => {
    const k = nIn(); inputs.push('-i', s.f);
    fc.push(`[${k}:a]aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(s.start * 1000)}:all=1[a${k}]`);
    parts.push(`[a${k}]`);
  });
  // Geräusche (folge.json "ton"): Dateien aus sounds-pixabay/ (nicht im Git, Pixabay-Lizenz: keine Weitergabe der Rohdateien)
  // Eintrag: {datei, von: Absatz-Index|"start", bis: Absatz-Index|"ende", plus: s, dauer: s, aus: Start in der Datei (s), db, fade}
  const SND = path.join(__dirname, 'sounds-pixabay');
  (cfg.ton || []).forEach((g) => {
    const start = (g.von === 'start' ? 0 : segs[g.von].start) + (g.plus || 0);
    const end = g.dauer ? start + g.dauer : g.bis === 'ende' ? DUR : segs[g.bis].end + PAUSE / 2;
    const d = Math.max(0.3, end - start), fd = Math.min(g.fade ?? 0.4, d / 3);
    const k = nIn();
    inputs.push('-stream_loop', '-1', '-ss', String(g.aus || 0), '-i', path.join(SND, g.datei + '.mp3'));
    // schneller: z. B. 1.3 = 30 % schneller und höher (für Flug-Wind)
    const sp = g.schneller ? `asetrate=${Math.round(48000 * g.schneller)},aresample=48000,` : '';
    fc.push(`[${k}:a]aresample=48000,${sp}aformat=channel_layouts=stereo,atrim=0:${d.toFixed(2)},asetpts=PTS-STARTPTS,volume=${(g.db || 0) + (voiced.length ? (cfg.tonUnterStimme ?? -8) : 0)}dB,afade=t=in:d=${fd.toFixed(2)},afade=t=out:st=${(d - fd).toFixed(2)}:d=${fd.toFixed(2)},adelay=${Math.round(start * 1000)}:all=1[a${k}]`);
    parts.push(`[a${k}]`);
  });
  if (parts.length) {
    const ln = voiced.length ? 'loudnorm=I=-16:TP=-1.5:LRA=11' : 'loudnorm=I=-24:TP=-3:LRA=15';
    fc.push(`${parts.join('')}amix=inputs=${parts.length}:normalize=0,apad,atrim=0:${DUR.toFixed(2)},${ln}[aout]`);
  } else {
    // nur Untertitel: stille Tonspur (Plattformen erwarten Ton), Stimme kommt später
    const k = nIn();
    inputs.push('-f', 'lavfi', '-t', DUR.toFixed(2), '-i', 'anullsrc=r=48000:cl=stereo');
    fc.push(`[${k}:a]anull[aout]`);
  }
  const out = path.join(DIR, `folge-${N}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc.join(';'), '-map', `[${cur}]`, '-map', '[aout]',
    '-t', DUR.toFixed(2), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${out} (${DUR.toFixed(1)} s, ${scenes.length} Bilder)`);
})();
