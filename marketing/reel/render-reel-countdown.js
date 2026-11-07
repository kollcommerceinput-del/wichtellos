// Countdown-Reel „Noch N× schlafen bis Onnis Adventskalender“ (1080x1920, ~12,4 s) – Toni 05.11., Text/Bilder/Geräusche freigegeben.
// node marketing/reel/render-reel-countdown.js [N]   (ohne N: Tage von heute bis 1. Dezember, deutsche Zeit)
//   -> adventskalender/countdown/countdown-NN.mp4
// Keine Musik (Instagram: Toni wählt in der App). MUSIK=zuckerfee -> zweite Fassung countdown-NN-musik.mp4 für WhatsApp-Status
// (sounds-pixabay/musik-zuckerfee.mp3 = „Dance of the Sugar Plum Fairy (Music Box)“, GregorQuendel, Pixabay-Lizenz; Toni 05.11.). Geräusche aus sounds-pixabay/ (nicht im Git). Beim Posten „Werbung“ + „Mit KI erstellt“.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const AK = path.join(__dirname, 'adventskalender');
const OUT = path.join(AK, 'countdown');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const FPS = 30;

function tageBisDezember() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date()).filter((x) => x.type !== 'literal').map((x) => [x.type, +x.value]));
  return (Date.UTC(p.year, 11, 1) - Date.UTC(p.year, p.month - 1, p.day)) / 864e5;
}
const N = +(process.argv[2] || tageBisDezember());
if (!(N >= 1)) { console.error('N muss >= 1 sein (am 1. Dezember gibt es keinen Countdown mehr)'); process.exit(1); }
// OHNE_ZAHL=1 -> „Bald geht's los …“ für Pinterest (Pin läuft wochenlang) -> countdown-ohne-zahl.mp4
const OHNE_ZAHL = !!process.env.OHNE_ZAHL;
const schlafen = OHNE_ZAHL ? 'Bald geht’s los …' : N === 1 ? 'Nur noch 1× schlafen …' : `Noch ${N}× schlafen …`;

// [Bild, Dauer s, HTML-Inhalt] – Bilder seit 07.11. aus Folge 6/7 (Toni)
const SZENEN = [
  ['folge-07/b13-gutenacht.jpg', 2.5, `<div class="top"><div class="big">${schlafen}</div>${OHNE_ZAHL ? 'Onnis Adventskalender<br>ab 1. Dezember' : 'bis Onnis Adventskalender'}</div>`],
  ['folge-06/b07-tuer-spalt.jpg', 2.3, '<div class="top">Ab 1. Dezember:<br>jeden Tag ein Türchen</div>'],
  ['folge-07/b10-singen.jpg', 2.3, '<div class="top">Jeden Abend eine<br>Wichtel-Geschichte</div>'],
  ['folge-06/b12-stiefel.jpg', 2.3, '<div class="top">Du suchst noch Geschenke?<div class="sub">Nikolaus · Advent · Wichteln</div></div>'],
  ['folge-06/b16-kuscheln.jpg', 3.0, '<div class="end"><p>Schau vorbei:</p><div class="url">wichtellos.de</div><h1>Onnis Adventskalender<br>ab 1.12.</h1></div>'],
];

const html = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;text-align:center}
.top{position:absolute;left:60px;right:60px;top:170px;color:#fff;font-size:76px;line-height:1.15;text-shadow:0 4px 18px rgba(0,0,0,.85),0 0 4px #000}
.top .big{font-size:118px;color:#f2b705;margin-bottom:10px}
.top .sub{font-size:58px;margin-top:18px;color:#ffe9a8}
.end{position:absolute;left:70px;right:70px;top:520px;background:rgba(255,248,240,.95);border-radius:44px;padding:50px 40px;color:#2b1b17}
.end h1{font-size:76px;line-height:1.1;margin:34px 0 0}.end p{font-size:60px;color:#6d5d57;margin:0}
.url{display:inline-block;background:#c62828;color:#fff;font-size:80px;padding:14px 52px;border-radius:999px;margin-top:18px}
.ki{position:absolute;right:30px;bottom:40px;color:rgba(255,255,255,.75);font-family:'Segoe UI',sans-serif;font-size:28px}
</style></head><body>${inner}</body></html>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = path.join(OUT, 'tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp);
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  const overlays = [];
  for (const [i, [, , inner]] of SZENEN.entries()) {
    await pg.setContent(html(inner + '<div class="ki">Bilder: KI-generiert</div>'));
    const f = path.join(tmp, `o${i}.png`);
    await pg.screenshot({ path: f, omitBackground: true });
    overlays.push(f);
  }
  await br.close();

  const inputs = [], fc = [], start = [];
  let t = 0;
  SZENEN.forEach(([bild, d], i) => {
    start.push(t); t += d;
    const n = Math.round(d * FPS);
    inputs.push('-loop', '1', '-t', String(d), '-i', path.join(AK, bild), '-loop', '1', '-t', String(d), '-i', overlays[i]);
    fc.push(`[${2 * i}:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,` +
      `zoompan=z='1+0.08*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=1080x1920:fps=${FPS},setsar=1[b${i}]`);
    fc.push(`[b${i}][${2 * i + 1}:v]overlay=0:0:shortest=1,trim=duration=${d},setpts=PTS-STARTPTS[v${i}]`);
  });
  const total = t;
  fc.push(`${SZENEN.map((_, i) => `[v${i}]`).join('')}concat=n=${SZENEN.length}:v=1:a=0,format=yuv420p[vout]`);
  // [datei, szene, plus s, dauer s, dB]
  const TON = [
    ['spannung', 4, 0.2, 2.8, -12],
  ];
  const SND = path.join(__dirname, 'sounds-pixabay');
  const amix = [];
  TON.forEach(([datei, sz, plus, dauer, db], j) => {
    const k = 2 * SZENEN.length + j, s = start[sz] + plus, fd = Math.min(0.3, dauer / 3);
    inputs.push('-i', path.join(SND, datei + '.mp3'));
    fc.push(`[${k}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${dauer},asetpts=PTS-STARTPTS,volume=${db}dB,` +
      `afade=t=in:d=${fd},afade=t=out:st=${(dauer - fd).toFixed(2)}:d=${fd},adelay=${Math.round(s * 1000)}:all=1[t${j}]`);
    amix.push(`[t${j}]`);
  });
  const MUSIK = process.env.MUSIK;
  if (MUSIK) {
    const k = 2 * SZENEN.length + TON.length;
    inputs.push('-i', path.join(SND, `musik-${MUSIK}.mp3`));
    fc.push(`[${k}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${total},asetpts=PTS-STARTPTS,volume=-6dB,` +
      `afade=t=in:d=0.4,afade=t=out:st=${(total - 1.5).toFixed(2)}:d=1.5[musik]`);
    amix.push('[musik]');
  }
  fc.push(`${amix.join('')}amix=inputs=${amix.length}:normalize=0,apad,atrim=0:${total.toFixed(2)},loudnorm=I=-18:TP=-2:LRA=11[aout]`);
  const out = path.join(OUT, `countdown-${OHNE_ZAHL ? 'ohne-zahl' : String(N).padStart(2, '0')}${MUSIK ? '-musik' : ''}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc.join(';'), '-map', '[vout]', '-map', '[aout]',
    '-t', total.toFixed(2), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-r', String(FPS), '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${out} (${total.toFixed(1)} s, ${schlafen})`);
})();
