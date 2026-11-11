// Podcast-Folge zusammensetzen: Intro + Geschichte + Outro (ton-N.wav aus stimme-reel.js --laenge) + leise Geräusche, ohne Musik.
// node marketing/podcast/podcast-bauen.js folge-01 [intro-folge-01] -> marketing/podcast/folge-01/onni-folge-01.mp3
// Pausen/Geräusche je Folge in <folge>/bauplan.json: { "pause": {"N": Sek}, "geraeusche": [[Absatz, Versatz, "datei", Dauer, dB], …] }
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const SND = path.join(__dirname, '..', 'reel', 'sounds-pixabay');
const folge = process.argv[2], intro = process.argv[3] || 'intro';
const P = (...a) => path.join(__dirname, ...a);

function wavDur(f) {
  const b = fs.readFileSync(f); let o = 12, rate = 48000, block = 4;
  while (o < b.length - 8) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') { rate = b.readUInt32LE(o + 12); block = b.readUInt16LE(o + 20); }
    if (id === 'data') return sz / (rate * block); o += 8 + sz + (sz % 2); }
}
const teil = (ordner) => JSON.parse(fs.readFileSync(P(ordner, 'stimme.json'), 'utf8')).saetze.map((_, i) => P(ordner, `ton-${i}.wav`));

const plan = fs.existsSync(P(folge, 'bauplan.json')) ? JSON.parse(fs.readFileSync(P(folge, 'bauplan.json'), 'utf8')) : {};
const spur = []; // [datei, start]
const geschStart = []; // Startzeit je Absatz der Geschichte
let t = 1.2; // Glöckchen vorweg
const ger = [['gloeckchen', 0, 1.6, -20]];
for (const f of teil(intro)) { spur.push([f, t]); t += wavDur(f) + 0.8; }
t += 1.2;
teil(folge).forEach((f, i) => {
  geschStart.push(t); spur.push([f, t]);
  t += wavDur(f) + (plan.pause?.[i] ?? (i === 0 ? 1.6 : 0.9));
});
t += 2.5;
for (const f of teil('outro')) { spur.push([f, t]); t += wavDur(f); }
ger.push(['gloeckchen', t + 0.8, 1.6, -26]);
const ende = t + 3.5;
for (const [abs, vers, datei, d, db] of plan.geraeusche || []) ger.push([datei, geschStart[abs] + vers, d, db]);

const ai = [], af = [], mix = [];
spur.forEach(([f, s], j) => { ai.push('-i', f); af.push(`[${j}:a]adelay=${Math.round(s * 1000)}:all=1[s${j}]`); mix.push(`[s${j}]`); });
ger.forEach(([datei, s, d, db], j) => {
  const n = spur.length + j, fd = Math.min(0.4, d / 3);
  ai.push('-i', path.join(SND, datei + '.mp3'));
  af.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${d},asetpts=PTS-STARTPTS,volume=${db}dB,` +
    `afade=t=in:d=0.05,afade=t=out:st=${(d - fd).toFixed(2)}:d=${fd},adelay=${Math.round(s * 1000)}:all=1[g${j}]`);
  mix.push(`[g${j}]`);
});
af.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,apad=whole_dur=${ende.toFixed(2)},loudnorm=I=-18:TP=-1.5:LRA=11[a]`);
const out = P(folge, `onni-${folge}.mp3`);
execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...ai, '-filter_complex', af.join(';'), '-map', '[a]', '-ar', '44100', '-t', ende.toFixed(2), '-c:a', 'libmp3lame', '-b:a', '128k', out]);
console.log(`fertig: ${out} (${Math.floor(ende / 60)}:${String(Math.round(ende % 60)).padStart(2, '0')} min)`);
