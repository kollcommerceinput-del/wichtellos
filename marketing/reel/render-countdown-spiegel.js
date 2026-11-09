// Countdown „Spiegel-Wichtel“ (Toni 09.11.): nur Clip 1 (Onni läuft zum Spiegel), Spannung über den Schnitt:
// schnell laufen → Zeitlupe + Zoom auf den Spiegel → Standbild-Ruck „DA IST NOCH EINER“ → Karte „Wer ist das? Folge 8 …“.
// Eigene Geräusche (Veo-Ton raus), keine Musik. Nie selbst veröffentlichen.
// node marketing/reel/render-countdown-spiegel.js [N]  (N = Tage bis 1.12., Standard: heute)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const DIR = path.join(__dirname, 'adventskalender', 'folge-08');
const CLIP = path.join(DIR, 'clips', 'clip1-spiegel-laufen.mp4');
const SND = path.join(__dirname, 'sounds-pixabay');
const OUT = path.join(DIR, 'countdown');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const FPS = 30, W = 1080, H = 1920;

function tageBisDezember() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date()).filter((x) => x.type !== 'literal').map((x) => [x.type, +x.value]));
  return (Date.UTC(p.year, 11, 1) - Date.UTC(p.year, p.month - 1, p.day)) / 864e5;
}
const N = +(process.argv[2] || tageBisDezember());

// Abschnitte (Quelle in Sekunden des Clips)
const A = { von: 0, bis: 2.6, tempo: 1.4 };          // läuft zum Spiegel, schneller
const B = { von: 2.6, bis: 4.2, tempo: 0.6 };        // Zeitlupe + Zoom auf den Spiegel
const C = { bei: 4.3, dauer: 1.5 };                   // Standbild-Ruck aufs Spiegelbild
const D = { dauer: 4.6 };                             // Karte
const dA = (A.bis - A.von) / A.tempo, dB = (B.bis - B.von) / B.tempo;
const SPIEGEL = { x: 0.95, y: 0.55 };                  // Mitte des Spiegelbilds (Anteil der Bildbreite/-höhe)

const html = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:F;src:url(${font}) format('woff2');font-weight:600}
html,body{margin:0;width:${W}px;height:${H}px;background:transparent;font-family:F,'Segoe UI Emoji',sans-serif;text-align:center}
.top{position:absolute;left:50px;right:50px;top:200px;color:#fff;font-size:88px;line-height:1.12;text-shadow:0 4px 18px rgba(0,0,0,.9),0 0 4px #000}
.gross{font-size:112px;color:#f2b705;line-height:1.08}
.knall{position:absolute;left:0;right:0;top:230px;margin:auto;width:max-content;background:#c62828;color:#fff;font-size:120px;line-height:1.05;padding:26px 60px;border-radius:40px;box-shadow:0 12px 34px rgba(0,0,0,.5);transform:rotate(-3deg)}
.karte{position:absolute;left:70px;right:70px;top:50%;transform:translateY(-50%);background:rgba(255,248,240,.96);border-radius:44px;padding:56px 40px;color:#2b1b17}
.karte h1{font-size:118px;line-height:1.05;margin:0;color:#c62828;font-weight:600}.karte p{font-size:62px;line-height:1.2;margin:24px 0 0}
.knopf{display:inline-block;background:#c62828;color:#fff;font-size:86px;padding:16px 66px;border-radius:999px;margin-top:38px}.unten{font-size:66px;opacity:.75;margin-top:22px}
.ki{position:absolute;right:30px;bottom:40px;color:rgba(255,255,255,.78);font-family:'Segoe UI',sans-serif;font-size:28px}
</style></head><body>${inner}<div class="ki">Bilder: KI-generiert</div></body></html>`;

const run = (args) => execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
const ENC = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-an'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = path.join(OUT, 'tmp-spiegel'); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp);
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: W, height: H } });
  const ov = async (name, inner) => { await pg.setContent(html(inner)); await pg.evaluate(() => document.fonts.ready); const f = path.join(tmp, name + '.png'); await pg.screenshot({ path: f, omitBackground: true }); return f; };
  const tA = await ov('a', '<div class="top"><div class="gross">Wer läuft da nachts<br>durch euren Flur? 👀</div></div>');
  // Texte Toni 09.11.
  const tB = await ov('b', '<div class="top">Ein Wichtel …</div>');
  const tC = await ov('c', '<div class="knall">Ist da noch<br>einer? 😳</div>');
  const tD = await ov('d', `<div class="karte"><h1 style="font-size:100px">Nicht verpassen!</h1><p>Ab 1. Dezember:<br>24 Geschichten von<br>unserem Wichtel Onni</p><p style="font-size:54px">Folgt uns &amp; verratet uns,<br>wie euer Wichtel heißt! 👇</p><div class="knopf">+ Folgen</div><div class="unten">@wichtellos</div></div>`);
  await br.close();

  const nA = Math.round(dA * FPS), nB = Math.round(dB * FPS), nC = Math.round(C.dauer * FPS), nD = Math.round(D.dauer * FPS);
  const zx = `(iw-iw/zoom)*${SPIEGEL.x}`, zy = `(ih-ih/zoom)*${SPIEGEL.y}`;
  // A: schnell laufen
  run(['-ss', String(A.von), '-t', String(A.bis - A.von + 0.1), '-i', CLIP, '-i', tA, '-filter_complex',
    `[0:v]setpts=PTS/${A.tempo},scale=${W}:${H}:flags=lanczos,fps=${FPS},setsar=1[v];[1:v]loop=-1:1:0[t];[v][t]overlay=0:0:shortest=1,trim=end_frame=${nA}[o]`,
    '-map', '[o]', '-frames:v', String(nA), ...ENC, path.join(tmp, 'a.mp4')]);
  // B: Zeitlupe (Zwischenbilder gemischt) + langsamer Zoom auf den Spiegel
  run(['-ss', String(B.von), '-t', String(B.bis - B.von + 0.1), '-i', CLIP, '-i', tB, '-filter_complex',
    `[0:v]setpts=PTS/${B.tempo},minterpolate=fps=${FPS}:mi_mode=blend,scale=${2 * W}:${2 * H}:flags=lanczos,` +
    `zoompan=z='1+0.45*in/${nB}':x='${zx}':y='${zy}':d=1:s=${W}x${H}:fps=${FPS},setsar=1[v];[1:v]loop=-1:1:0[t];[v][t]overlay=0:0:shortest=1,trim=end_frame=${nB}[o]`,
    '-map', '[o]', '-frames:v', String(nB), ...ENC, path.join(tmp, 'b.mp4')]);
  // C: Standbild, Ruck-Zoom (1,45 → 1,9 in 0,2 s, dann leichtes Weiterdriften), weißer Blitz, kurzes Wackeln
  const still = path.join(tmp, 'still.png');
  run(['-ss', String(C.bei), '-i', CLIP, '-frames:v', '1', '-vf', `scale=${2 * W}:${2 * H}:flags=lanczos`, still]);
  run(['-i', still, '-i', tC, '-filter_complex',
    `[0:v]zoompan=z='if(lt(on,6),1.45+0.45*on/6,1.9+0.06*(on-6)/${nC})':x='${zx}+if(lt(on,10),sin(on*2.5)*12,0)':y='${zy}':d=${nC}:s=${W}x${H}:fps=${FPS},` +
    `fade=t=in:st=0:d=0.12:color=white,setsar=1[v];[1:v]loop=-1:1:0[t];[v][t]overlay=0:0:shortest=1,trim=end_frame=${nC}[o]`,
    '-map', '[o]', '-frames:v', String(nC), ...ENC, path.join(tmp, 'c.mp4')]);
  // D: Karte über abgedunkeltem, weichgezeichnetem Standbild, aus Schwarz eingeblendet
  run(['-i', still, '-i', tD, '-filter_complex',
    `[0:v]scale=${W}:${H},gblur=sigma=18,eq=brightness=-0.18,loop=-1:1:0,fps=${FPS},trim=end_frame=${nD},setpts=PTS-STARTPTS[bg];` +
    `[1:v]loop=-1:1:0[t];[bg][t]overlay=0:0:shortest=1,fade=t=in:st=0:d=0.35,setsar=1[o]`,
    '-map', '[o]', '-frames:v', String(nD), ...ENC, path.join(tmp, 'd.mp4')]);

  const liste = path.join(tmp, 'liste.txt');
  fs.writeFileSync(liste, ['a', 'b', 'c', 'd'].map((x) => `file '${path.join(tmp, x + '.mp4').replace(/\\/g, '/')}'`).join('\n'));
  const bild = path.join(tmp, 'bild.mp4');
  run(['-f', 'concat', '-safe', '0', '-i', liste, '-c', 'copy', bild]);

  // Ton: [Datei, Start s, Dauer s, dB]
  const sA = 0, sB = nA / FPS, sC = sB + nB / FPS, sD = sC + nC / FPS, total = sD + nD / FPS;
  const TON = [
    ['laufen-holz', sA, sB, -15],
    ['spannung', sB, nB / FPS + 0.1, -12],
    ['plopp', sC, 0.5, -6],
    ['spannung', sC, 1.0, -9],
    ['kichern', sD + 0.6, 1.4, -15],
    ['gloeckchen', sD + 2.2, 1.6, -15],
  ];
  const ein = [], f = [];
  TON.forEach(([d, s, l, db], i) => {
    ein.push('-i', path.join(SND, d + '.mp3'));
    const fd = Math.min(0.2, l / 3);
    f.push(`[${i}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${l},asetpts=PTS-STARTPTS,volume=${db}dB,afade=t=in:d=${fd},afade=t=out:st=${(l - fd).toFixed(2)}:d=${fd},adelay=${Math.round(s * 1000)}:all=1[s${i}]`);
  });
  f.push(`${TON.map((_, i) => `[s${i}]`).join('')}amix=inputs=${TON.length}:normalize=0,apad=whole_dur=${total.toFixed(3)},atrim=0:${total.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=11[a]`);
  const ton = path.join(tmp, 'ton.wav');
  run([...ein, '-filter_complex', f.join(';'), '-map', '[a]', '-ar', '48000', ton]);

  const out = path.join(OUT, `countdown-${String(N).padStart(2, '0')}-spiegel-spannung.mp4`);
  run(['-i', bild, '-i', ton, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-maxrate', '8M', '-bufsize', '16M',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${out} (${total.toFixed(1)} s, ${(fs.statSync(out).size / 1048576).toFixed(1)} MB)`);
})().catch((e) => { console.error(e.message); process.exit(1); });
