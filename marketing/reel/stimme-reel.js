// Stimme (Gemini „puck“) + leise Geräusche unter ein fertiges stummes Reel legen (Toni 09.11.: „wie immer mit Erklärung“).
// Konfig-JSON: { "video": "...mp4", "out": "...mp4", "tempo": 1.15, "stil": "...",
//   "saetze": [[Startsekunde, "Text", Tempo?], …], "geraeusche": [["datei ohne .mp3", Sekunde, Dauer, dB], …] }
// node marketing/reel/stimme-reel.js wuerfeln/stimme.json          -> Ton bauen + muxen (ton-N.wav werden gecacht, NEU=1 neu)
// node marketing/reel/stimme-reel.js wuerfeln/stimme.json --laenge -> nur Stimme holen und Längen ausgeben
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const SND = path.join(__dirname, 'sounds-pixabay');

function wavDur(f) {
  const b = fs.readFileSync(f); let o = 12, rate = 48000, block = 4;
  while (o < b.length - 8) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') { rate = b.readUInt32LE(o + 12); block = b.readUInt16LE(o + 20); }
    if (id === 'data') return sz / (rate * block); o += 8 + sz + (sz % 2); }
}

async function tts(text, stil, stimme) {
  let kp = path.join(os.homedir(), '.gemini-api-key');
  if (fs.statSync(kp).isDirectory()) kp = path.join(kp, fs.readdirSync(kp)[0]);
  for (;;) {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST', headers: { 'x-goog-api-key': fs.readFileSync(kp, 'utf8').trim(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.TTS_MODELL || 'gemini-3.8-flash-tts', input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style: stil }] }] }],
        response_format: { type: 'audio', mime_type: 'audio/wav' }, generation_config: { speech_config: [{ voice: stimme }] } }),
    });
    if (r.status === 429) { await new Promise((x) => setTimeout(x, 20000)); continue; }
    const j = await r.json(); if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300));
    return Buffer.from(j.steps.filter((s) => s.type === 'model_output').flatMap((s) => s.content).filter((c) => c.type === 'audio').pop().data, 'base64');
  }
}

(async () => {
  const kf = path.resolve(__dirname, process.argv[2]);
  const k = JSON.parse(fs.readFileSync(kf, 'utf8'));
  const dir = path.dirname(kf), tempo = k.tempo || 1.15;
  const ton = [];
  for (const [i, [, text]] of k.saetze.entries()) {
    const f = path.join(dir, `ton-${i}.wav`), txt = f + '.txt';
    if (!fs.existsSync(f) || process.env.NEU || (fs.existsSync(txt) && fs.readFileSync(txt, 'utf8') !== text)) {
      console.log('Stimme:', text);
      const raw = path.join(dir, 'raw.wav');
      fs.writeFileSync(raw, await tts(text, k.stil, k.stimme || 'puck'));
      execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', raw, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
        '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', f]);
      fs.rmSync(raw); fs.writeFileSync(txt, text);
    }
    ton.push(f);
  }
  k.saetze.forEach(([s, text], i) => {
    const d = wavDur(ton[i]) / (k.saetze[i][2] || tempo), next = k.saetze[i + 1] ? k.saetze[i + 1][0] : null;
    console.log(`${i}: ${s.toFixed(2)}–${(s + d).toFixed(2)} s (${d.toFixed(2)} s)${next !== null && s + d > next - 0.1 ? '  ⚠ überlappt nächsten Satz' : ''}  ${text}`);
  });
  if (process.argv.includes('--laenge')) return;

  const video = path.resolve(dir, k.video), out = path.resolve(dir, k.out);
  let len = 0;
  try { execFileSync(FFMPEG, ['-i', video], { stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) {
    const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(e.stderr.toString()); len = +m[1] * 3600 + +m[2] * 60 + +m[3];
  }
  const ai = [], af = [], mix = [];
  ton.forEach((f, j) => { ai.push('-i', f); af.push(`[${j}:a]atempo=${k.saetze[j][2] || tempo},adelay=${Math.round(k.saetze[j][0] * 1000)}:all=1[s${j}]`); mix.push(`[s${j}]`); });
  (k.geraeusche || []).forEach(([datei, s, d, db], j) => {
    const n = ton.length + j, fd = Math.min(0.2, d / 3);
    ai.push('-i', datei.endsWith('.wav') ? path.resolve(dir, datei) : path.join(SND, datei + '.mp3'));
    af.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${d},asetpts=PTS-STARTPTS,volume=${db}dB,` +
      `afade=t=in:d=0.02,afade=t=out:st=${(d - fd).toFixed(2)}:d=${fd},adelay=${Math.round(s * 1000)}:all=1[g${j}]`);
    mix.push(`[g${j}]`);
  });
  const spur = path.join(dir, 'spur.wav');
  af.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,apad=whole_dur=${len.toFixed(2)},loudnorm=I=-16:TP=-1.5:LRA=11[a]`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...ai, '-filter_complex', af.join(';'), '-map', '[a]', '-ar', '48000', '-t', len.toFixed(2), spur]);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', video, '-i', spur, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out]);
  fs.rmSync(spur);
  console.log(`fertig: ${out} (${len.toFixed(1)} s)`);
})().catch((e) => { console.error(e.message); process.exit(1); });
