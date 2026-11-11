// Mehrstimmige Podcast-Szene (Erzähler/Onni/Ulla je eigene Gemini-Stimme) + Geräusche, ohne Musik (Toni 11.11.)
// szene.json: { "rollen": {"E": {"stimme":"puck","stil":"…"}, …}, "teile": [["E","Text", pauseDanach?], …],
//               "geraeusche": [[TeilNr, Versatz, "datei", Dauer, dB], …], "out": "probe.mp3" }
// node marketing/podcast/podcast-szene.js probe-szene/szene.json   (ton-N.wav gecacht, NEU=1 neu)
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const SND = path.join(__dirname, '..', 'reel', 'sounds-pixabay');

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
  const kf = path.resolve(__dirname, process.argv[2]), dir = path.dirname(kf);
  const k = JSON.parse(fs.readFileSync(kf, 'utf8'));
  const ton = [];
  for (const [i, [rolle, text]] of k.teile.entries()) {
    const R = k.rollen[rolle], f = path.join(dir, `ton-${i}.wav`), key = `${R.stimme}|${R.stil}|${text}`;
    if (!fs.existsSync(f) || process.env.NEU || fs.readFileSync(f + '.txt', 'utf8') !== key) {
      console.log(rolle, text);
      const raw = path.join(dir, 'raw.wav');
      fs.writeFileSync(raw, await tts(text, R.stil, R.stimme));
      execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', raw, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
        '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', f]);
      fs.rmSync(raw); fs.writeFileSync(f + '.txt', key);
    }
    ton.push(f);
  }
  let t = 0.6; const start = [];
  k.teile.forEach(([rolle, , pause], i) => {
    start.push(t);
    const tempo = k.rollen[rolle].tempo || 1;
    t += wavDur(ton[i]) / tempo + (pause ?? (k.teile[i + 1]?.[0] === rolle ? 0.5 : 0.35));
  });
  const ende = t + 1.5, ai = [], af = [], mix = [];
  ton.forEach((f, j) => { ai.push('-i', f); af.push(`[${j}:a]atempo=${k.rollen[k.teile[j][0]].tempo || 1},adelay=${Math.round(start[j] * 1000)}:all=1[s${j}]`); mix.push(`[s${j}]`); });
  const PEGEL = JSON.parse(fs.readFileSync(path.join(__dirname, "pegel.json"), "utf8"));
  (k.geraeusche || []).forEach(([nr, vers, datei, d0, db0], j) => {
    const db = db0 ?? PEGEL[datei] ?? -6;
    let d = d0; if (typeof d === 'string') d = start[+d.split(':')[1]] - start[nr] - vers; // "bis:N" = bis Teil N
    const n = ton.length + j, fd = Math.min(0.4, d / 3);
    ai.push('-i', path.join(SND, datei + '.mp3'));
    af.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${d},asetpts=PTS-STARTPTS,volume=${db}dB,` +
      `afade=t=in:d=0.05,afade=t=out:st=${(d - fd).toFixed(2)}:d=${fd},adelay=${Math.round((start[nr] + vers) * 1000)}:all=1[g${j}]`);
    mix.push(`[g${j}]`);
  });
  af.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,apad=whole_dur=${ende.toFixed(2)},loudnorm=I=-18:TP=-1.5:LRA=11[a]`);
  const out = path.join(dir, k.out || 'probe.mp3');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...ai, '-filter_complex', af.join(';'), '-map', '[a]', '-ar', '44100', '-t', ende.toFixed(2), '-c:a', 'libmp3lame', '-b:a', '128k', out]);
  console.log(`fertig: ${out} (${ende.toFixed(1)} s)`);
})().catch((e) => { console.error(e.message); process.exit(1); });
