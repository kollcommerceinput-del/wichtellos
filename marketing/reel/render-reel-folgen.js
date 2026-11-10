// Follower-Reel (Toni 08.11.: „als Marketing-Experte ein Video bauen, das Leute zum Folgen animiert“), 1080x1920, ~15 s.
// Aufbau nach Kurzvideo-Regeln: Haken in Sekunde 1 (Frage + Neugier), schnelle Schnitte (Onnis Streiche aus den Folgen),
// Versprechen mit Termin (ab 1.12. jeden Tag), klarer Grund zum Folgen („sonst verpasst ihr Folge 1“), Schlussbild steht länger.
// Stimme Gemini „puck“ (ton-N.wav gecacht, NEU=1 neu), leise Geräusche aus sounds-pixabay/, KEINE Musik (Toni wählt in der App).
// Nie selbst veröffentlichen – nur als Entwurf anlegen (Toni 08.11.).
// node marketing/reel/render-reel-folgen.js -> adventskalender/folgen/reel-folgen.mp4
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const AK = path.join(__dirname, 'adventskalender');
const SND = path.join(__dirname, 'sounds-pixabay');
const OUT = path.join(AK, 'folgen');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const FPS = 30;
const STIMME = 'puck';
const STIL = 'Geheimnisvoll-verschmitzt am Anfang, dann fröhlich und mitreißend wie ein spannender Serien-Trailer für Familien, zügig, auf Deutsch.';
const TEMPO = +(process.env.TEMPO || 1.15);

// [[ [Bild, HTML], … ], Mindestdauer s, Sprechtext, Luft danach s]  – mehrere Bilder = schnelle Schnitte innerhalb der Szene
const SZENEN = [
  [[['folge-07/b09-kichern.jpg', '<div class="top"><div class="big">Was macht dieser<br>Wichtel nachts<br>bei euch? 👀</div></div>']],
    1.8, 'Psst … was macht dieser Wichtel eigentlich nachts bei euch?', 0.25],
  [[['folge-03/b05-abbeissen.jpg', '<div class="tag">Kekse naschen 🍪</div>'],
    ['folge-04/b04-schaum.jpg', '<div class="tag">Schaumparty 🫧</div>'],
    ['folge-05/b05-chaos.jpg', '<div class="tag">Socken-Chaos 🧦</div>'],
    ['folge-06/b06-schleichen.jpg', '<div class="tag">dem Nikolaus<br>auflauern 🎅</div>']],
    3.2, 'Kekse naschen … Schaumparty … Socken-Chaos … und dem Nikolaus auflauern!', 0.2],
  [[['folge-01/b07-flug.jpg', '<div class="top"><div class="big">Ab 1. Dezember</div>jeden Tag eine neue<br>Wichtel-Geschichte</div>']],
    2.2, 'Ab dem ersten Dezember erzählt Onni jeden Tag eine neue Geschichte.', 0.2],
  [[['folge-06/b09-flur-glitzer.jpg', '<div class="top"><div class="big">24 Folgen</div>zum Anschauen<br>und Vorlesen</div>']],
    1.8, 'Vierundzwanzig Folgen – zum Anschauen und Vorlesen.', 0.2],
  [[['folge-06/b16-kuscheln.jpg', '<div class="end"><h1>Jetzt folgen!</h1><p>Sonst verpasst ihr<br>Folge 1 😱</p><div class="knopf">+ Folgen</div><div class="handle">@wichtellos</div></div>']],
    3.0, 'Folgt uns jetzt – sonst verpasst ihr Folge eins!', 1.6],
];
// [Datei, Szene, Sekunde ab Szenenbeginn, Dauer s, dB]
const GERAEUSCHE = [
  ['kichern', 0, 0.9, 1.2, -16],
  ['keks', 1, 0.05, 0.6, -14],
  ['blubbern1', 1, 0.85, 0.7, -16],
  ['rascheln-kurz', 1, 1.65, 0.7, -14],
  ['laufen-holz', 1, 2.45, 0.8, -18],
  ['fluegel', 2, 0.0, 1.4, -16],
  ['glitzer', 3, 0.1, 1.4, -16],
  ['gloeckchen', 4, 0.2, 1.5, -14],
];

const html = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,'Segoe UI Emoji',sans-serif;text-align:center}
.top{position:absolute;left:50px;right:50px;top:190px;color:#fff;font-size:80px;line-height:1.15;text-shadow:0 4px 18px rgba(0,0,0,.9),0 0 4px #000}
.top .big{font-size:116px;color:#f2b705;margin-bottom:14px;line-height:1.08}
.tag{position:absolute;left:0;right:0;top:260px;margin:auto;width:max-content;max-width:960px;background:#c62828;color:#fff;font-size:96px;line-height:1.1;
  padding:22px 54px;border-radius:40px;box-shadow:0 10px 30px rgba(0,0,0,.45)}
.end{position:absolute;left:70px;right:70px;top:430px;background:rgba(255,248,240,.96);border-radius:44px;padding:56px 40px;color:#2b1b17}
.end h1{font-size:124px;line-height:1.05;margin:0;color:#c62828}.end p{font-size:72px;line-height:1.15;margin:24px 0 0}
.knopf{display:inline-block;background:#c62828;color:#fff;font-size:88px;padding:18px 70px;border-radius:999px;margin-top:40px}
.handle{font-size:68px;color:#6d5d57;margin-top:24px}
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

  const dauer = [], ton = [];
  for (const [i, [, min, text, luft]] of SZENEN.entries()) {
    const f = path.join(OUT, `ton-${i}.wav`);
    if (!fs.existsSync(f) || process.env.NEU) {
      console.log('Stimme (Gemini):', text);
      fs.writeFileSync(path.join(tmp, 'raw.wav'), await tts(text));
      execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', path.join(tmp, 'raw.wav'), '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
        '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', f]);
    }
    ton.push(f);
    dauer.push(Math.max(min, +(0.1 + wavDur(f) / TEMPO + luft).toFixed(2)));
  }

  // Einzelbilder (Szene mit mehreren Bildern = gleich lange schnelle Schnitte)
  const clips = [], start = [];
  let t = 0;
  SZENEN.forEach(([bilder], i) => {
    start.push(t);
    bilder.forEach(([bild, inner]) => clips.push({ bild: path.join(AK, bild), inner, d: +(dauer[i] / bilder.length).toFixed(3) }));
    t += dauer[i];
  });

  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [k, c] of clips.entries()) {
    await pg.setContent(html(c.inner + '<div class="ki">Bilder: KI-generiert</div>'));
    await pg.evaluate(() => document.fonts.ready);
    c.ov = path.join(tmp, `o${k}.png`);
    await pg.screenshot({ path: c.ov, omitBackground: true });
  }
  await br.close();

  const inputs = [], fc = [];
  clips.forEach((c, k) => {
    const n = Math.round(c.d * FPS);
    inputs.push('-loop', '1', '-t', String(c.d), '-i', c.bild, '-loop', '1', '-t', String(c.d), '-i', c.ov);
    fc.push(`[${2 * k}:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,` +
      `zoompan=z='1.02+0.1*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=1080x1920:fps=${FPS},setsar=1[b${k}]`);
    fc.push(`[b${k}][${2 * k + 1}:v]overlay=0:0:shortest=1,trim=duration=${c.d},setpts=PTS-STARTPTS[v${k}]`);
  });
  fc.push(`${clips.map((_, k) => `[v${k}]`).join('')}concat=n=${clips.length}:v=1:a=0,format=yuv420p[vout]`);

  // Tonspur: Stimme + Geräusche (getrennt bauen, in einem Durchgang hing ffmpeg)
  const spur = path.join(tmp, 'spur.wav');
  const ai = [], af = [], mix = [];
  ton.forEach((f, j) => { ai.push('-i', f); af.push(`[${j}:a]atempo=${TEMPO},adelay=${Math.round((start[j] + 0.1) * 1000)}:all=1[s${j}]`); mix.push(`[s${j}]`); });
  GERAEUSCHE.forEach(([datei, sz, plus, d, db], j) => {
    const k = ton.length + j, s = start[sz] + plus, fd = Math.min(0.25, d / 3);
    ai.push('-i', path.join(SND, datei + '.mp3'));
    af.push(`[${k}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${d},asetpts=PTS-STARTPTS,volume=${db}dB,` +
      `afade=t=in:d=${fd},afade=t=out:st=${(d - fd).toFixed(2)}:d=${fd},adelay=${Math.round(s * 1000)}:all=1[g${j}]`);
    mix.push(`[g${j}]`);
  });
  af.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,apad=whole_dur=${t.toFixed(2)},loudnorm=I=-16:TP=-1.5:LRA=11[a]`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...ai, '-filter_complex', af.join(';'), '-map', '[a]', '-ar', '48000', '-t', t.toFixed(2), spur]);

  const vid = path.join(tmp, 'bild.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc.join(';'), '-map', '[vout]',
    '-t', t.toFixed(2), '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-r', String(FPS), vid], { stdio: 'inherit' });
  const out = path.join(OUT, 'reel-folgen.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', vid, '-i', spur, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${out} (${t.toFixed(1)} s, ${Math.round(fs.statSync(out).size / 1024)} KB) Szenen: ${dauer.join(' / ')}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
