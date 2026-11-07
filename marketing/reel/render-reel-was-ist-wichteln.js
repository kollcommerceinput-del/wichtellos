// Reel „Schon mal von Wichteln gehört?“ (Toni 07.11.): erklärt in ~17 s, was Wichteln ist -> wichtellos.de
// node marketing/reel/render-reel-was-ist-wichteln.js  -> marketing/reel/was-ist-wichteln/reel-was-ist-wichteln.mp4
// Text auf 3D-Stills (wichtel3d/stills) + Stimme (Gemini „puck“, je Szene ton-N.wav, wird gecacht; NEU=1 erzeugt neu).
// Szenenlänge = Sprechdauer + Luft (mind. Bildzeit). Nach der Eingangsfrage eine kurze Pause (Toni). Keine Musik. Beim Posten „Mit KI erstellt“ + „Werbung“.
// OHNE_STIMME=1 -> stille Fassung.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const ST = path.join(__dirname, 'wichtel3d', 'stills');
const OUT = path.join(__dirname, 'was-ist-wichteln');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const FPS = 30;
const STIMME = 'puck';
const STIL = 'Freundlich, fröhlich und zügig wie ein kurzes Social-Media-Erklärvideo, klar und natürlich, auf Deutsch.';
const OHNE_STIMME = !!process.env.OHNE_STIMME;
const TEMPO = +(process.env.TEMPO || 1.2); // Stimme etwas schneller (Videos kurz halten, Toni)

// [Bild, Mindestdauer s, HTML, Sprechtext, Luft danach s]
const SZENEN = [
  ['onni-geschenk-tisch.jpg', 1.5, '<div class="top"><div class="big">Schon mal von<br>Wichteln gehört?</div></div>',
    'Schon mal von Wichteln gehört?', 0.75],
  ['los.jpg', 2.0, '<div class="top">Jeder zieht <span class="y">heimlich</span><br>einen Namen …</div>',
    'Jeder zieht heimlich einen Namen …', 0.15],
  ['geschenk.jpg', 2.2, '<div class="top">… und beschenkt genau<br>diese Person –<div class="sub">mit einer Kleinigkeit 🎁</div></div>',
    '… und beschenkt genau diese Person – mit einer Kleinigkeit.', 0.3],
  ['lupe.jpg', 2.4, '<div class="top">Keiner weiß,<br>wer wen gezogen hat.<div class="sub">Erst beim Auspacken wird geraten!</div></div>',
    'Keiner weiß, wer wen gezogen hat. Erst beim Auspacken wird geraten!', 0.3],
  ['feier.jpg', 2.0, '<div class="top">Perfekt fürs Büro,<br>die Familie<br>oder die Klasse</div>',
    'Perfekt fürs Büro, die Familie oder die Klasse.', 0.3],
  ['onni-handy.jpg', 3.4, '<div class="end"><h1>Mach mit!</h1><p>Per WhatsApp oder E-Mail –<br>ganz einfach, kostenlos<br>und mit Spaß</p><div class="url">wichtellos.de</div></div>',
    'Mach mit! Per WhatsApp oder E-Mail – ganz einfach, kostenlos und mit Spaß: wichtellos punkt de!', 0.9],
];

const html = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,'Segoe UI Emoji',sans-serif;text-align:center}
.top{position:absolute;left:60px;right:60px;top:200px;color:#fff;font-size:84px;line-height:1.15;text-shadow:0 4px 18px rgba(0,0,0,.85),0 0 4px #000}
.top .big{font-size:120px;color:#f2b705;margin-bottom:10px}
.top .y{color:#f2b705}
.top .sub{font-size:60px;margin-top:22px;color:#ffe9a8}
.end{position:absolute;left:70px;right:70px;top:250px;background:rgba(255,248,240,.95);border-radius:44px;padding:50px 40px;color:#2b1b17}
.end h1{font-size:120px;line-height:1.05;margin:0 0 20px;color:#c62828}.end p{font-size:58px;color:#6d5d57;margin:0 0 34px}
.url{display:inline-block;background:#c62828;color:#fff;font-size:88px;padding:14px 56px;border-radius:999px}
.ki{position:absolute;right:30px;bottom:40px;color:rgba(255,255,255,.75);font-family:'Segoe UI',sans-serif;font-size:28px}
</style></head><body>${inner}</body></html>`;

function wavDur(f) {
  const b = fs.readFileSync(f); let o = 12, rate = 48000, block = 4;
  while (o < b.length - 8) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') { rate = b.readUInt32LE(o + 12); block = b.readUInt16LE(o + 20); }
    if (id === 'data') return sz / (rate * block); o += 8 + sz + (sz % 2); }
}

async function tts(text) {
  let kp = path.join(os.homedir(), '.gemini-api-key');
  if (fs.statSync(kp).isDirectory()) kp = path.join(kp, fs.readdirSync(kp)[0]);
  for (;;) {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST', headers: { 'x-goog-api-key': fs.readFileSync(kp, 'utf8').trim(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.TTS_MODELL || 'gemini-3.8-flash-tts', input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style: STIL }] }] }],
        response_format: { type: 'audio', mime_type: 'audio/wav' }, generation_config: { speech_config: [{ voice: STIMME }] } }),
    });
    if (r.status === 429) { await new Promise((x) => setTimeout(x, 20000)); continue; }
    const j = await r.json(); if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300));
    return Buffer.from(j.steps.filter((s) => s.type === 'model_output').flatMap((s) => s.content).filter((c) => c.type === 'audio').pop().data, 'base64');
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = path.join(OUT, 'tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp);

  // Stimme je Szene (Stille vorn/hinten weg), Szenendauer daraus
  const dauer = [], ton = [];
  for (const [i, [, min, , text, luft]] of SZENEN.entries()) {
    if (OHNE_STIMME) { dauer.push(min); continue; }
    const f = path.join(OUT, `ton-${i}.wav`);
    if (!fs.existsSync(f) || process.env.NEU) {
      console.log('Stimme (Gemini):', text);
      fs.writeFileSync(path.join(tmp, 'raw.wav'), await tts(text));
      execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', path.join(tmp, 'raw.wav'), '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
        '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', f]);
    }
    ton.push(f);
    dauer.push(Math.max(min, +(0.15 + wavDur(f) / TEMPO + luft).toFixed(2)));
  }

  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  const overlays = [];
  for (const [i, [, , inner]] of SZENEN.entries()) {
    await pg.setContent(html(inner + '<div class="ki">Bilder: KI-generiert</div>'));
    await pg.evaluate(() => document.fonts.ready);
    const f = path.join(tmp, `o${i}.png`);
    await pg.screenshot({ path: f, omitBackground: true });
    overlays.push(f);
  }
  await br.close();

  const inputs = [], fc = [], start = [];
  let t = 0;
  SZENEN.forEach(([bild], i) => {
    const d = dauer[i]; start.push(t); t += d;
    const n = Math.round(d * FPS);
    inputs.push('-loop', '1', '-t', String(d), '-i', path.join(ST, bild), '-loop', '1', '-t', String(d), '-i', overlays[i]);
    fc.push(`[${2 * i}:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,` +
      `zoompan=z='1+0.08*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=1080x1920:fps=${FPS},setsar=1[b${i}]`);
    fc.push(`[b${i}][${2 * i + 1}:v]overlay=0:0:shortest=1,trim=duration=${d},setpts=PTS-STARTPTS[v${i}]`);
  });
  fc.push(`${SZENEN.map((_, i) => `[v${i}]`).join('')}concat=n=${SZENEN.length}:v=1:a=0,format=yuv420p[vout]`);
  // Schritt 1: Tonspur getrennt bauen (in einem Durchgang mit dem Bild hing ffmpeg)
  const spur = path.join(tmp, 'spur.wav');
  if (OHNE_STIMME) {
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'lavfi', '-t', t.toFixed(2), '-i', 'anullsrc=r=48000:cl=stereo', spur]);
  } else {
    const ai = [], af = [];
    ton.forEach((f, j) => { ai.push('-i', f); af.push(`[${j}:a]atempo=${TEMPO},adelay=${Math.round((start[j] + 0.15) * 1000)}:all=1[s${j}]`); });
    af.push(`${ton.map((_, j) => `[s${j}]`).join('')}amix=inputs=${ton.length}:normalize=0:duration=longest,apad=whole_dur=${t.toFixed(2)},loudnorm=I=-16:TP=-1.5:LRA=11[a]`);
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...ai, '-filter_complex', af.join(';'), '-map', '[a]', '-ar', '48000', '-t', t.toFixed(2), spur]);
  }
  // Schritt 2: Bild + Tonspur
  const vid = path.join(tmp, 'bild.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc.join(';'), '-map', '[vout]',
    '-t', t.toFixed(2), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-r', String(FPS), vid], { stdio: 'inherit' });
  const out = path.join(OUT, `reel-was-ist-wichteln${OHNE_STIMME ? '-ohne-ton' : ''}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', vid, '-i', spur, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${out} (${t.toFixed(1)} s) Szenen: ${dauer.join(' / ')}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
