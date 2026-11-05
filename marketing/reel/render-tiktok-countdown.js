// TikTok-Countdown (1080x1920, ~11 s): extrem schnelle harte Schnitte, Sprecherstimme (Gemini „puck“, Radio-Tempo),
// Text-Zeilen springen passend zur Stimme ins Bild, große animierte Zahl „Noch N-mal schlafen“. Text von Toni (05.11.), wortgleich.
// node marketing/reel/render-tiktok-countdown.js [N]  (ohne N: Tage bis 1. Dezember)  -> adventskalender/tiktok-countdown/tiktok-countdown-NN.mp4
// Stimme: bezahlter Gemini-Schlüssel (~/.gemini-api-key). Block 1 enthält die Zahl -> je Countdown-Tag 1 neuer Aufruf,
// Block 2+3 werden einmal erzeugt und wiederverwendet (NEU=1 erzwingt alle neu). Keine Musik (Toni wählt in TikTok).
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const AK = path.join(__dirname, 'adventskalender');
const DIR = path.join(AK, 'tiktok-countdown');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const FPS = 30;
const STIMME = 'puck';
const STIL = 'Sehr schnell und energiegeladen, wie ein Werbesprecher im Radio, rasantes Tempo, kaum Pausen, begeistert, verschmitzt, auf Deutsch.';

function tageBisDezember() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date()).filter((x) => x.type !== 'literal').map((x) => [x.type, +x.value]));
  return (Date.UTC(p.year, 11, 1) - Date.UTC(p.year, p.month - 1, p.day)) / 864e5;
}
const N = +(process.argv[2] || tageBisDezember());
if (!(N >= 1 && N <= 30)) { console.error('N muss zwischen 1 und 30 liegen'); process.exit(1); }
const EINER = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const ZAHL = { 1: 'ein', 10: 'zehn', 11: 'elf', 12: 'zwölf', 13: 'dreizehn', 14: 'vierzehn', 15: 'fünfzehn', 16: 'sechzehn', 17: 'siebzehn', 18: 'achtzehn', 19: 'neunzehn', 20: 'zwanzig', 30: 'dreißig' };
const wort = (n) => ZAHL[n] || (n < 10 ? EINER[n] : `${EINER[n % 10]}und${n < 30 ? 'zwanzig' : 'dreißig'}`);

// Blöcke: Zeilen (Bildtext) + gesprochener Text; Bilder wechseln hart innerhalb des Blocks
const BLOECKE = [
  { datei: `ton-0-${N}.wav`, sprache: `Psst, hey du! Noch ${wort(N)} Mal schlafen – dann geht es los!`,
    zeilen: ['Psst, hey du!', '#ZAHL#', 'dann geht es los!'],
    bilder: ['folge-01/b01-wald.jpg', 'folge-01/b07-flug.jpg', 'folge-01/b08-haus.jpg', 'folge-02/b03-baum.jpg', 'folge-03/b02-flur.jpg',
      'folge-04/b03-wasserhahn.jpg', 'folge-05/b04-kekse.jpg', 'folge-01/b09-tuer.jpg'] },
  { datei: 'ton-1.wav', sprache: 'Dann zieht ein Wichtel bei uns ein, treibt Blödsinn und ist nicht allein.',
    zeilen: ['Dann zieht ein Wichtel bei uns ein,', 'treibt Blödsinn und ist nicht allein.'],
    bilder: ['folge-01/b06-packen.jpg', 'folge-01/b09-tuer.jpg', 'folge-03/b05-chaos.jpg', 'folge-03/b03-klettern.jpg', 'folge-02/b04-teddy.jpg', 'folge-02/b05-anlehnen.jpg'] },
  { datei: 'ton-2.wav', sprache: 'Er bringt uns Streiche, Spaß und Glitzer, der kleine, freche Weihnachtsflitzer!',
    zeilen: ['Er bringt uns Streiche, Spaß und Glitzer,', 'der kleine, freche Weihnachtsflitzer!'],
    bilder: ['folge-04/b04-schaum.jpg', 'folge-03/b06-socke.jpg', 'folge-05/b05-abbeissen.jpg', 'folge-05/b07-schlitten.jpg', 'folge-04/b05-leine.jpg', 'folge-05/b06-kugelbauch.jpg'] },
];
const SCHLUSS = { bild: 'folge-05/b04-kekse.jpg', dauer: 1.6 };

function wavDur(f) {
  const b = fs.readFileSync(f); let o = 12, rate = 0, block = 0;
  while (o < b.length - 8) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') { rate = b.readUInt32LE(o + 12); block = b.readUInt16LE(o + 20); }
    if (id === 'data') return sz / (rate * block); o += 8 + sz + (sz % 2); }
}

async function tts(text) {
  let kp = path.join(os.homedir(), '.gemini-api-key');
  if (fs.statSync(kp).isDirectory()) kp = path.join(kp, fs.readdirSync(kp)[0]);
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST', headers: { 'x-goog-api-key': fs.readFileSync(kp, 'utf8').trim(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.TTS_MODELL || 'gemini-3.8-flash-tts', input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style: STIL }] }] }],
      response_format: { type: 'audio', mime_type: 'audio/wav' }, generation_config: { speech_config: [{ voice: STIMME }] } }),
  });
  const j = await r.json(); if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300));
  return Buffer.from(j.steps.filter((s) => s.type === 'model_output').flatMap((s) => s.content).filter((c) => c.type === 'audio').pop().data, 'base64');
}

// Zeilen-Startzeiten im Block: die (Zeilen-1) längsten Pausen der Stimme; sonst nach Zeichenzahl verteilt
function zeilenStarts(wav, dauer, zeilen) {
  const r = spawnSync(FFMPEG, ['-i', wav, '-af', 'silencedetect=noise=-32dB:d=0.08', '-f', 'null', '-'], { encoding: 'utf8' });
  const st = [...r.stderr.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/g)]
    .map((m) => ({ a: +m[1], e: +m[2], d: +m[3] })).filter((p) => p.a > 0.2 && p.e < dauer - 0.2);
  const n = zeilen.length - 1;
  if (st.length >= n) return [0, ...st.sort((x, y) => y.d - x.d).slice(0, n).map((p) => p.e - 0.05).sort((x, y) => x - y)];
  const len = zeilen.map((z) => (z === '#ZAHL#' ? 22 : z.length)), sum = len.reduce((x, y) => x + y, 0);
  let acc = 0; return len.map((l) => { const s = (acc / sum) * dauer; acc += l; return s; });
}

(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  const tmp = path.join(DIR, 'tmp'); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  let t = 0.1;
  for (const bl of BLOECKE) {
    const f = path.join(DIR, bl.datei);
    if (!fs.existsSync(f) || process.env.NEU) {
      console.log('Stimme (Gemini):', bl.sprache);
      fs.writeFileSync(path.join(tmp, 'raw.wav'), await tts(bl.sprache));
      execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', path.join(tmp, 'raw.wav'), '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
        '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', f]);
    }
    bl.ton = f; bl.dauer = wavDur(f); bl.start = t;
    bl.starts = zeilenStarts(f, bl.dauer, bl.zeilen).map((s) => s + t);
    t += bl.dauer + 0.12; bl.ende = t;
  }
  const schlussStart = t, DUR = t + SCHLUSS.dauer;

  // Bild-Schnitte
  const clips = [];
  BLOECKE.forEach((bl) => { const per = (bl.ende - bl.start + (bl === BLOECKE[0] ? bl.start : 0)) / bl.bilder.length; bl.bilder.forEach((b) => clips.push({ bild: b, d: per })); });
  clips.push({ bild: SCHLUSS.bild, d: SCHLUSS.dauer });

  // Text-Animation: Bild für Bild aus dem Browser (transparent)
  const zeit = BLOECKE.map((bl) => ({ start: bl.start, ende: bl.ende, starts: bl.starts, zeilen: bl.zeilen }));
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
  *{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,'Segoe UI Emoji',sans-serif;text-align:center;overflow:hidden}
  .blk{position:absolute;left:50px;right:50px;top:210px;display:none}
  .z{display:block;color:#fff;font-size:76px;line-height:1.15;margin-bottom:18px;text-shadow:0 5px 16px rgba(0,0,0,.9),0 0 5px #000;opacity:0}
  .zahl{display:block;opacity:0;margin:6px 0 22px}
  .zahl b{display:block;font-size:330px;line-height:.95;color:#f2b705;text-shadow:0 8px 26px rgba(0,0,0,.85),0 0 6px #000}
  .zahl span{display:block;font-size:96px;color:#fff;text-shadow:0 5px 16px rgba(0,0,0,.9),0 0 5px #000}
  .mitte{position:absolute;left:90px;right:90px;top:1080px;background:rgba(255,248,240,.93);border-radius:44px;padding:40px 30px;color:#2b1b17;opacity:0}
  .mitte h1{font-size:112px;margin:0}.mitte p{font-size:54px;margin:12px 0 0;color:#6d5d57}
  .url{display:inline-block;background:#c62828;color:#fff;font-size:72px;padding:12px 48px;border-radius:999px;margin-top:20px}
  .ki{position:absolute;left:30px;top:40px;color:rgba(255,255,255,.75);font-family:'Segoe UI',sans-serif;font-size:28px}</style></head><body>
  ${zeit.map((b, i) => `<div class="blk" id="b${i}">${b.zeilen.map((z, j) => z === '#ZAHL#'
    ? `<div class="zahl" id="z${i}-${j}"><span>Noch</span><b id="nr">${N}</b><span>-mal schlafen</span></div>` : `<div class="z" id="z${i}-${j}">${z}</div>`).join('')}</div>`).join('')}
  <div class="mitte" id="mitte"><h1>Folge uns! 🔔</h1><p>Onnis Adventskalender – ab 1. Dezember</p><div class="url">wichtellos.de</div></div>
  <div class="ki">Bilder: KI-generiert</div>
  <script>
  const ZEIT=${JSON.stringify(zeit)}, N=${N}, SCHLUSS=${schlussStart};
  // Hineinspringen: 0..0.22 s von klein/unten auf etwas größer, dann zurück auf 1
  const pop=(dt)=>{ if(dt<0) return null; const p=Math.min(dt/0.22,1); const s=p<0.7?0.55+0.6*(p/0.7):1.15-0.15*((p-0.7)/0.3); return {o:Math.min(1,dt/0.08), s, y:(1-p)*60}; };
  window.zeige=(t)=>{
    ZEIT.forEach((b,i)=>{ const el=document.getElementById('b'+i); const an=t>=b.start-0.02&&t<b.ende; el.style.display=an?'block':'none'; if(!an) return;
      b.zeilen.forEach((z,j)=>{ const e=document.getElementById('z'+i+'-'+j); const p=pop(t-b.starts[j]);
        if(!p){e.style.opacity=0;return;}
        if(z==='#ZAHL#'){ const dt=t-b.starts[j]; const zaehl=0.45; // zählt schnell von N+4 auf N, dann Wackler
          document.getElementById('nr').textContent = dt<zaehl ? Math.max(N, N+4-Math.floor(dt/zaehl*5)) : N;
          const w = dt>=zaehl ? Math.sin((dt-zaehl)*28)*Math.max(0,1-(dt-zaehl)/0.5)*7 : 0;
          const s = dt<zaehl ? 0.8+0.2*(dt/zaehl) : 1+0.12*Math.max(0,1-(dt-zaehl)/0.25);
          e.style.opacity=Math.min(1,dt/0.08); e.style.transform='scale('+s+') rotate('+w+'deg)'; }
        else { e.style.opacity=p.o; e.style.transform='translateY('+p.y+'px) scale('+p.s+')'; } }); });
    const m=document.getElementById('mitte'), p=pop(t-SCHLUSS-0.05);
    m.style.opacity=p?p.o:0; if(p) m.style.transform='translateY('+p.y+'px) scale('+p.s+')';
  };
  </script></body></html>`;
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.setContent(html); await pg.evaluate(() => document.fonts.ready);
  const frames = Math.round(DUR * FPS);
  for (let i = 0; i < frames; i++) {
    await pg.evaluate((tt) => window.zeige(tt), i / FPS);
    await pg.screenshot({ path: path.join(tmp, `ov_${String(i).padStart(4, '0')}.png`), omitBackground: true });
  }
  await br.close();

  // Video: Bilder mit leichtem Zoom, harte Schnitte, darüber die Animation
  const inputs = [], fc = [];
  clips.forEach((c, i) => {
    const fr = Math.round(c.d * FPS);
    inputs.push('-i', path.join(AK, c.bild));
    fc.push(`[${i}:v]scale=1350:2400:force_original_aspect_ratio=increase,crop=1350:2400,zoompan=z='1+0.1*on/${fr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${fr}:s=1080x1920:fps=${FPS},setsar=1,format=yuv420p[c${i}]`);
  });
  let n = clips.length;
  fc.push(`${clips.map((_, i) => `[c${i}]`).join('')}concat=n=${clips.length}:v=1:a=0[base]`);
  inputs.push('-framerate', String(FPS), '-i', path.join(tmp, 'ov_%04d.png'));
  fc.push(`[${n}:v]format=rgba[ov]`, `[base][ov]overlay=0:0:eof_action=pass,format=yuv420p[vout]`); n++;
  const parts = [];
  BLOECKE.forEach((bl) => { inputs.push('-i', bl.ton); fc.push(`[${n}:a]adelay=${Math.round(bl.start * 1000)}:all=1[a${n}]`); parts.push(`[a${n}]`); n++; });
  fc.push(`${parts.join('')}amix=inputs=${parts.length}:normalize=0,apad,atrim=0:${DUR.toFixed(2)},loudnorm=I=-14:TP=-1.5:LRA=11[aout]`);
  const out = path.join(DIR, `tiktok-countdown-${String(N).padStart(2, '0')}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc.join(';'), '-map', '[vout]', '-map', '[aout]', '-t', DUR.toFixed(2),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${out} (${DUR.toFixed(1)} s, ${clips.length} Bilder)`);
  BLOECKE.forEach((bl, i) => console.log(`Block ${i}: ${bl.start.toFixed(2)}–${bl.ende.toFixed(2)} s, Zeilen ab ${bl.starts.map((s) => s.toFixed(2)).join(', ')}`));
})().catch((e) => { console.error(e.message); process.exit(1); });
