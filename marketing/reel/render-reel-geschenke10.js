// Reel „6 Wichtelgeschenke unter 10 €“ aus Standbildern (Toni 11.11.: „ein nettes Video aus Bildern“, TikTok schnell, Insta länger).
// Bilder: geschenke-unter-10/bilder/1-tasse … 6-socken.jpg (Google Flow, Nano Banana 2.1, Referenz = Tonis Schnee-Onni; 1-tasse = Standbild
// aus clips-a/c1-tasse-gruen.mp4). Texte nur oben im Himmel (Toni 11.11.: nie mittig auf Onni). Langsamer Zoom je Bild, Überblendung, Nummer + Name je Geschenk, Abspann wichtellos.de.
//   node marketing/reel/render-reel-geschenke10.js tiktok   -> geschenke-unter-10/tiktok/bild.mp4 (~14,7 s)
//   node marketing/reel/render-reel-geschenke10.js insta    -> geschenke-unter-10/insta/bild.mp4  (~22,9 s)
// Danach Stimme: node marketing/reel/stimme-reel.js geschenke-unter-10/<tiktok|insta>/stimme.json
// Seite mit Amazon-Links -> beim Posten „Werbung“ + „Mit KI erstellt“ angeben.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const BASE = path.join(__dirname, 'geschenke-unter-10');
const MODUS = process.argv[2] === 'insta' ? 'insta' : 'tiktok';
const GESCHENKE = [
  ['1-tasse.jpg', 'Tasse', '☕'], ['2-kerze.jpg', 'Duftkerze', '🕯️'], ['3-schokolade.jpg', 'Schokolade', '🍫'],
  ['4-handwaermer.jpg', 'Handwärmer', '🧤'], ['5-pflanze.jpg', 'Mini-Pflanze', '🌱'], ['6-socken.jpg', 'Kuschelsocken', '🧦'],
];
// Standzeit je Bild – erstes Bild länger, weil die Stimme dort Titel + „Tasse“ sagt (Toni 11.11.: Name muss zum Bild passen)
const SEGS = MODUS === 'insta' ? [4.4, 3.2, 3.2, 3.2, 3.2, 3.2] : [3.0, 2.0, 2.0, 2.0, 2.0, 2.0];
const XF = MODUS === 'insta' ? 0.5 : 0.3;    // Überblendung
const END = MODUS === 'insta' ? 5.0 : 3.2;   // Abspann (letztes Bild länger)
const n = GESCHENKE.length;
const START = SEGS.map((_, i) => SEGS.slice(0, i).reduce((a, v) => a + v - XF, 0));  // Beginn jedes Bildes (Stimme danach ausrichten)
const DUR = START[n - 1] + SEGS[n - 1] + END;
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.box{position:absolute;left:60px;right:60px;background:rgba(255,248,240,.94);border-radius:40px;padding:26px 36px 32px;box-shadow:0 14px 34px rgba(0,0,0,.35)}
h1{font-size:84px;line-height:1.05;margin:0;font-weight:600;white-space:nowrap}h1 em{font-style:normal;color:#c62828}
p{font-family:'Segoe UI',system-ui,sans-serif;font-size:44px;color:#6d5d57;margin:12px 0 0}
.tag{position:absolute;left:0;right:0;top:375px;display:flex;justify-content:center}
.tag span{background:#c62828;color:#fff;font-size:86px;padding:12px 50px 16px;border-radius:999px;box-shadow:0 12px 30px rgba(0,0,0,.4);white-space:nowrap}
.tag b{display:inline-block;background:#fff;color:#c62828;border-radius:999px;width:96px;height:96px;line-height:96px;margin-right:22px;font-weight:600}
.url{display:inline-block;background:#c62828;color:#fff;font-size:64px;padding:10px 44px;border-radius:999px;margin-top:14px}
.stripe{position:absolute;top:0;left:0;right:0;height:22px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
</style></head><body>${inner}</body></html>`;

(async () => {
  const out = path.join(BASE, MODUS);
  const tmp = path.join(out, 'tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const shot = async (name, inner) => {
    await p.setContent(page(inner));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(tmp, name), omitBackground: true });
  };
  await shot('kopf.png', '<div class="stripe"></div><div class="box" style="top:120px"><h1><em>6</em> Wichtelgeschenke</h1><p style="font-size:52px;color:#2b1b17;margin-top:6px">unter <b style="color:#c62828">10 €</b> 🎁</p></div>');
  for (const [i, [, name, emo]] of GESCHENKE.entries()) await shot(`tag${i}.png`, `<div class="tag"><span><b>${i + 1}</b>${name} ${emo}</span></div>`);
  // Abspann-Text Toni 11.11. (nicht „100 Ideen“): Geschenke suchen -> Tassen, Geschenkefinder, kostenlose Ideen, alles bei uns
  await shot('ende.png', '<div class="box" style="top:120px"><h1 style="font-size:68px">Du suchst <em>Geschenke?</em></h1><p style="color:#2b1b17;font-size:42px;line-height:1.3">Tassen, Geschenkefinder &amp; kostenlose<br>Ideen rund ums Wichteln – alles bei uns:</p><div class="url">wichtellos.de</div></div>');
  await b.close();

  // Eingänge: 6 Bilder, Kopf, 6 Namen, Abspann
  const args = [];
  GESCHENKE.forEach(([f], i) => {
    const d = i === n - 1 ? SEGS[i] + END : SEGS[i];
    args.push('-loop', '1', '-t', d.toFixed(2), '-i', path.join(BASE, 'bilder', f));
  });
  args.push('-loop', '1', '-i', path.join(tmp, 'kopf.png'));
  GESCHENKE.forEach((_, i) => args.push('-loop', '1', '-i', path.join(tmp, `tag${i}.png`)));
  args.push('-loop', '1', '-i', path.join(tmp, 'ende.png'));

  const fc = [];
  GESCHENKE.forEach((_, i) => {
    const d = i === n - 1 ? SEGS[i] + END : SEGS[i], fr = Math.round(d * 30);
    // abwechselnd rein- und rauszoomen, Bild füllt 1080x1920
    const z = i % 2 ? `1.10-0.10*on/${fr}` : `1.0+0.10*on/${fr}`;
    fc.push(`[${i}:v]scale=1188:2112:flags=lanczos,zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${fr}:s=1080x1920:fps=30,setsar=1,format=yuv420p[b${i}]`);
  });
  let prev = 'b0', off = 0;
  for (let i = 1; i < n; i++) {
    off = START[i];
    fc.push(`[${prev}][b${i}]xfade=transition=${MODUS === 'insta' ? 'fade' : 'slideleft'}:duration=${XF}:offset=${off.toFixed(2)}[x${i}]`);
    prev = `x${i}`;
  }
  const K = n, T0 = n + 1, E = 2 * n + 1;
  fc.push(`[${K}:v]format=rgba,trim=0:${DUR.toFixed(2)},setpts=PTS-STARTPTS[kopf]`);
  fc.push(`[${prev}][kopf]overlay=0:0:shortest=1:enable='lt(t,${(DUR - END).toFixed(2)})'[k]`);
  prev = 'k';
  GESCHENKE.forEach((_, i) => {
    const a = i ? START[i] + XF / 2 : 0.2, e = i === n - 1 ? DUR - END + 0.2 : START[i + 1] + XF / 2;
    fc.push(`[${T0 + i}:v]format=rgba,trim=0:${DUR.toFixed(2)},setpts=PTS-STARTPTS[t${i}]`);
    fc.push(`[${prev}][t${i}]overlay=0:0:enable='between(t,${a.toFixed(2)},${e.toFixed(2)})'[o${i}]`);
    prev = `o${i}`;
  });
  fc.push(`[${E}:v]format=rgba,trim=0:${DUR.toFixed(2)},setpts=PTS-STARTPTS,fade=t=in:st=${(DUR - END + 0.2).toFixed(2)}:d=0.35:alpha=1[ende]`);
  fc.push(`[${prev}][ende]overlay=0:0,format=yuv420p[vout]`);

  const ziel = path.join(out, 'bild.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args, '-filter_complex', fc.join(';'), '-map', '[vout]', '-an', '-t', DUR.toFixed(2),
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', ziel], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${ziel} (${DUR.toFixed(1)} s) – Bildwechsel: ${START.map((v) => v.toFixed(1)).join(', ')}, Abspann ab ${(DUR - END + 0.2).toFixed(1)}`);
})();
