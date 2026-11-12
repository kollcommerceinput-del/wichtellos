// Countdown-Reel „Noch X Tage“ (Toni 12.11.: geheimnisvoll „ein Wichtel zieht ein“ kam am besten an, Follower gewinnen).
// Bilder: countdown-teddy/bilder/1–5 (Tonis Bilder vom 12.11., Gemini/Nano Banana, Folge 2 „Onni und das Kuscheltier“).
// Ton: Schritte, leise Uhr, Glöckchen – keine Stimme (Toni 12.11.: Podcast-Schnipsel „Hallo? Ein Teddy“ ohne Zusammenhang unverständlich), keine Musik
// (die legt Toni beim Posten selbst darunter). Texte nur oben (nie mittig auf Onni).
//   node marketing/reel/render-reel-countdown-teddy.js 19   -> countdown-teddy/countdown-19.mp4 (~14 s)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const BASE = path.join(__dirname, 'countdown-teddy');
const POD = path.join(ROOT, 'marketing', 'podcast', 'folge-02');
const SND = path.join(__dirname, 'sounds-pixabay');
const TAGE = +(process.argv[2] || 19);

const BILDER = ['2-flur-hinten.jpg', '1-flur-spiegel.jpg', '3-baum.jpg', '4-teddy-anfassen.jpg', '5-teddy-anlehnen.jpg'];
const TEXTE = [
  '<h1 style="font-size:130px"><em>Psst …</em></h1><p style="font-size:60px;font-family:Fredoka,sans-serif">Ein Wichtel zieht bei euch ein!</p>',  // Toni 12.11.: Einstieg muss sitzen
  '<h1>Nachts ist er <em>unterwegs</em> …</h1>',
  '<h1>Was er wohl <em>entdeckt?</em></h1>',
  '<h1 style="font-size:76px;white-space:nowrap">Einen neuen <em>Freund</em> 🧸</h1>',
  `<h1>Noch <em>${TAGE} Tage</em></h1><p>bis zum 1. Dezember</p>`,
];
const SEGS = [2.4, 2.2, 2.6, 2.8, 2.2], XF = 0.3, END = 3.4, n = BILDER.length;
const START = SEGS.map((_, i) => SEGS.slice(0, i).reduce((a, v) => a + v - XF, 0));
const DUR = START[n - 1] + SEGS[n - 1] + END;
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.box{position:absolute;top:150px;left:70px;right:70px;background:rgba(255,248,240,.94);border-radius:40px;padding:26px 36px 32px;box-shadow:0 14px 34px rgba(0,0,0,.4)}
h1{font-size:86px;line-height:1.08;margin:0;font-weight:600}h1 em{font-style:normal;color:#c62828}
p{font-family:'Segoe UI',system-ui,sans-serif;font-size:48px;color:#2b1b17;margin:12px 0 0}
.url{display:inline-block;background:#c62828;color:#fff;font-size:60px;padding:10px 44px;border-radius:999px;margin-top:18px}
</style></head><body>${inner}</body></html>`;

(async () => {
  const tmp = path.join(BASE, 'tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const shot = async (name, inner) => {
    await p.setContent(page(inner));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(tmp, name), omitBackground: true });
  };
  for (const [i, t] of TEXTE.entries()) await shot(`t${i}.png`, `<div class="box">${t}</div>`);
  await shot('ende.png', '<div class="box"><h1 style="font-size:76px">Onnis <em>Adventskalender</em></h1>' +
    '<p>Jede Nacht eine Wichtel-Geschichte –<br>ab 1. Dezember als Video &amp; Podcast</p><div class="url">Folgt uns! 🔔</div></div>');
  await b.close();

  const args = [];
  BILDER.forEach((f, i) => args.push('-loop', '1', '-t', (i === n - 1 ? SEGS[i] + END : SEGS[i]).toFixed(2), '-i', path.join(BASE, 'bilder', f)));
  TEXTE.forEach((_, i) => args.push('-loop', '1', '-i', path.join(tmp, `t${i}.png`)));
  args.push('-loop', '1', '-i', path.join(tmp, 'ende.png'));
  // Ton: Schritte im Flur (Bild 1–2), Uhr, Glöckchen
  const A0 = 2 * n + 1;
  const TON = [[path.join(SND, 'laufen-holz.mp3'), 0.6, -6], [path.join(SND, 'laufen-holz.mp3'), START[1] + 0.4, -10],
    [path.join(SND, 'uhr.mp3'), 0, -14], [path.join(SND, 'gloeckchen.mp3'), START[3] + 0.3, -16], [path.join(SND, 'gloeckchen.mp3'), DUR - END + 0.2, -12]];
  TON.forEach(([f]) => args.push('-i', f));

  const fc = [];
  BILDER.forEach((_, i) => {
    const d = i === n - 1 ? SEGS[i] + END : SEGS[i], fr = Math.round(d * 30);
    // Bild 1: deutlicher Zoom auf Onni (unten Mitte), damit er in der ersten Sekunde groß zu sehen ist
    const z = i === 0 ? `1.0+0.28*on/${fr}` : i % 2 ? `1.10-0.10*on/${fr}` : `1.0+0.10*on/${fr}`;
    const y = i === 0 ? `(ih*0.70)-(ih/zoom*0.70)` : `ih/2-(ih/zoom/2)`;
    fc.push(`[${i}:v]scale=1188:2112:force_original_aspect_ratio=increase:flags=lanczos,crop=1188:2112,zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='${y}':d=${fr}:s=1080x1920:fps=30,setsar=1,format=yuv420p[b${i}]`);
  });
  let prev = 'b0';
  for (let i = 1; i < n; i++) { fc.push(`[${prev}][b${i}]xfade=transition=fade:duration=${XF}:offset=${START[i].toFixed(2)}[x${i}]`); prev = `x${i}`; }
  TEXTE.forEach((_, i) => {
    const a = i ? START[i] + XF / 2 : 0.15, e = i === n - 1 ? DUR - END + 0.2 : START[i + 1] + XF / 2;
    fc.push(`[${n + i}:v]format=rgba,trim=0:${DUR.toFixed(2)},setpts=PTS-STARTPTS[t${i}]`);
    fc.push(`[${prev}][t${i}]overlay=0:0:enable='between(t,${a.toFixed(2)},${e.toFixed(2)})'[o${i}]`);
    prev = `o${i}`;
  });
  fc.push(`[${2 * n}:v]format=rgba,trim=0:${DUR.toFixed(2)},setpts=PTS-STARTPTS,fade=t=in:st=${(DUR - END + 0.2).toFixed(2)}:d=0.35:alpha=1[ende]`);
  fc.push(`[${prev}][ende]overlay=0:0:enable='gte(t,${(DUR - END + 0.2).toFixed(2)})',format=yuv420p[vout]`);
  const mix = [];
  TON.forEach(([, t, db], j) => {
    fc.push(`[${A0 + j}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${db}dB,atrim=0:${(DUR - t).toFixed(2)},adelay=${Math.round(t * 1000)}:all=1[a${j}]`);
    mix.push(`[a${j}]`);
  });
  fc.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,afade=t=out:st=${(DUR - 0.8).toFixed(2)}:d=0.8,loudnorm=I=-14:TP=-1.5[aout]`);

  const ziel = path.join(BASE, `countdown-${TAGE}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args, '-filter_complex', fc.join(';'), '-map', '[vout]', '-map', '[aout]', '-t', DUR.toFixed(2),
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart', ziel], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${ziel} (${DUR.toFixed(1)} s) – Bildwechsel: ${START.map((v) => v.toFixed(1)).join(', ')}, Abspann ab ${(DUR - END + 0.2).toFixed(1)}`);
})();
