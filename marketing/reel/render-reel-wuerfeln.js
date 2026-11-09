// Reel „Wichteln mit Würfeln“ (Toni 09.11.): echte Würfel-Seite im Handy-Rahmen – würfeln (6 = Geschenk), Runde 2 (Regel zur Zahl),
// Timer (Schnitt „10 Minuten später“ → klingelt), Spielplan, Abspann mit 3D-Würfel-Wichtel (KI → beim Posten „Mit KI erstellt“).
// Bild für Bild aufgenommen (Playwright-Uhr), ohne Ton (Musik wählt Toni beim Posten).
// Server vorher: cd website && python -m http.server 8766
// node marketing/reel/render-reel-wuerfeln.js            -> marketing/reel/wuerfeln/reel-wuerfeln.mp4
// node marketing/reel/render-reel-wuerfeln.js 1.0 6.2    -> nur Standbilder (Sekunden) nach wuerfeln/standbild-*.png
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const OUT = path.join(__dirname, 'wuerfeln');
const URL = process.env.BASE || 'http://localhost:8766/wichteln-wuerfeln-regeln/';
const FPS = 30;
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const still = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'wichtel3d', 'stills', 'wuerfel.jpg')).toString('base64');

// Handy: Außen 860 breit, Rahmen 16, oben Statuszeile + Adresse 110 px
const PX = 110, PY = 360, PW = 860, PH = 1520, RAHMEN = 16, LEISTE = 110;
const CSSW = 390, SCALE = (PW - 2 * RAHMEN) / CSSW;
const CSSH = Math.floor((PH - 2 * RAHMEN - LEISTE) / SCALE);

// Bildtexte [von, bis, HTML]
const TEXTE = [
  [0.0, 2.3, 'Wichteln mit Würfeln 🎲<br><small>Kennst du die Regeln?</small>'],
  [2.3, 4.4, '6 = Geschenk nehmen 🎁'],
  [4.4, 7.4, 'Runde 2:<br><small>Jede Zahl hat ihre Regel</small>'],
  [7.4, 10.7, 'Mit Timer ⏰<br><small>klingelt am Ende</small>'],
  [10.7, 12.0, 'Spielplan gratis<br><small>zum Ausdrucken 🖨️</small>'],
];
const ENDE = 12.0, LAENGE = 14.6;
// Tippen [Sekunde, Selektor] – Kreis erscheint, Klick bei Sekunde
const TIPPEN = [[1.4, '#dt-wuerfel'], [4.5, '.dt-r[data-runde="2"]'], [5.1, '#dt-wuerfel'], [7.7, '#dt-start']];
const SCHNITT = 9.0;   // Timer springt auf kurz vor Schluss („10 Minuten später“)

const stage = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#fff8f0;font-family:Fredoka,'Segoe UI Emoji',sans-serif;color:#2b1b17}
#text{position:absolute;left:40px;right:40px;top:60px;height:270px;display:flex;align-items:center;justify-content:center;text-align:center}
#text div{background:#c62828;color:#fff;font-size:84px;line-height:1.08;padding:22px 50px;border-radius:44px;box-shadow:0 10px 30px rgba(0,0,0,.25);transition:none}
#text small{font-size:60px;color:#ffe9a8}
#handy{position:absolute;left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px;background:#1d1d1f;border-radius:70px;padding:${RAHMEN}px;box-shadow:0 30px 70px rgba(0,0,0,.28)}
#innen{position:relative;width:100%;height:100%;border-radius:56px;overflow:hidden;background:#fff}
#leiste{height:${LEISTE}px;background:#2b1b17;color:#fff;font-family:'Segoe UI',sans-serif;position:relative}
#leiste .zeit{position:absolute;left:46px;top:12px;font-size:30px;font-weight:600}
#leiste .akku{position:absolute;right:46px;top:14px;font-size:24px;opacity:.9}
#leiste .url{position:absolute;left:40px;right:40px;bottom:12px;height:46px;border-radius:23px;background:rgba(255,255,255,.14);font-size:26px;line-height:46px;text-align:center}
#seite{width:${CSSW}px;height:${CSSH}px;border:0;transform:scale(${SCALE});transform-origin:0 0;display:block}
#tipp{pointer-events:none;position:absolute;width:110px;height:110px;margin:-55px 0 0 -55px;border-radius:50%;border:6px solid rgba(43,27,23,.55);background:rgba(43,27,23,.12);opacity:0}
#schnitt{position:absolute;left:0;right:0;top:${PY + 560}px;margin:auto;width:max-content;background:#2b1b17;color:#fff;font-size:64px;padding:18px 44px;border-radius:999px;opacity:0}
#ende{position:absolute;inset:0;background:#fff8f0;opacity:0}
#ende img{position:absolute;top:0;left:0;width:1080px;height:1150px;object-fit:cover;object-position:50% 30%}
#ende .fade{position:absolute;top:960px;left:0;right:0;height:190px;background:linear-gradient(rgba(255,248,240,0),#fff8f0)}
#ende .t{position:absolute;top:1120px;left:50px;right:50px;text-align:center}
#ende h1{font-size:108px;line-height:1.02;margin:0}
#ende .line{width:170px;height:9px;border-radius:5px;background:#f2b705;margin:26px auto}
#ende p{font-family:'Segoe UI',sans-serif;font-size:50px;line-height:1.3;margin:0;color:#6d5d57}
#ende .url{display:inline-block;margin-top:44px;background:#c62828;color:#fff;font-size:82px;padding:18px 64px;border-radius:999px}
#ende .ki{position:absolute;right:28px;top:1090px;font-family:'Segoe UI',sans-serif;font-size:24px;color:rgba(255,255,255,.8)}
</style></head><body>
<div id="text"><div></div></div>
<div id="handy"><div id="innen"><div id="leiste"><span class="zeit">18:30</span><span class="akku">▮▮▮ 78 %</span><div class="url">🔒 wichtellos.de/wichteln-wuerfeln-regeln</div></div>
<iframe id="seite" src="${URL}"></iframe><div id="tipp"></div></div></div>
<div id="schnitt">⏩ 10 Minuten später …</div>
<div id="ende"><img src="${still}"><div class="fade"></div><span class="ki">Bild: KI-generiert</span>
<div class="t"><h1>Wichteln mit Würfeln</h1><div class="line"></div><p>Regeln 1–6 · Würfel &amp; Timer am Handy<br>Spielplan gratis zum Ausdrucken</p><div class="url">wichtellos.de</div></div></div>
</body></html>`;

const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

(async () => {
  const nur = process.argv.slice(2).map(Number);
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 } });
  // Würfel fest: erst 6, dann 3
  await ctx.addInitScript(() => {
    const w = [5, 2], orig = crypto.getRandomValues.bind(crypto);
    crypto.getRandomValues = (a) => { if (a instanceof Uint32Array && a.length === 1 && w.length) { a[0] = w.shift(); return a; } return orig(a); };
  });
  const p = await ctx.newPage();
  await p.clock.install({ time: new Date('2026-12-05T18:30:00') });
  await p.setContent(stage);
  const f = p.frames().find((x) => x.url().startsWith(URL.split('#')[0]));
  await f.waitForSelector('#dt-wuerfel');
  await p.clock.runFor(500);
  await p.evaluate(() => document.fonts.ready);
  const top = await f.$eval('.dt-r', (e) => e.getBoundingClientRect().top + scrollY - 12);
  const plan = await f.$eval('#spielplan', (e) => e.getBoundingClientRect().top + scrollY - 10);
  const scrollTo = (y) => f.evaluate((y) => window.scrollTo(0, y), y);
  await scrollTo(top);

  const ff = nur.length ? null : spawn(FFMPEG, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', path.join(OUT, 'reel-wuerfeln.mp4')], { stdio: ['pipe', 'ignore', 'inherit'] });
  const geklickt = new Set();
  let textJetzt = null, geschnitten = false;
  const N = Math.round(LAENGE * FPS);
  for (let i = 0; i < N; i++) {
    const t = i / FPS;
    // Klicks
    for (const [ts, sel] of TIPPEN) if (t >= ts && !geklickt.has(ts)) { geklickt.add(ts); await f.$eval(sel, (e) => e.click()); }
    // Schnitt: Uhr vorspulen, bis noch ~1,2 s übrig sind
    if (t >= SCHNITT && !geschnitten) {
      geschnitten = true;
      await p.clock.runFor(Math.round((600 - (SCHNITT - TIPPEN[3][0]) - 1.2) * 1000));
    }
    // Scrollen: nach dem Schnitt etwas runter (Hinweis „Zeit ist um“), dann hoch zum Spielplan
    if (t >= SCHNITT && t < 10.7) await scrollTo(top + 70 * ease((t - SCHNITT) / 0.4));
    else if (t >= 10.7 && t < ENDE) await scrollTo(top + 70 + (plan - top - 70) * ease((t - 10.7) / 0.7));
    // Tipp-Kreis
    const tp = TIPPEN.find(([ts]) => t >= ts - 0.25 && t < ts + 0.35);
    let tipp = { o: 0, x: 0, y: 0, s: 1 };
    if (tp) {
      const r = await f.$eval(tp[1], (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      const k = (t - (tp[0] - 0.25)) / 0.6;
      tipp = { o: k < 0.4 ? 1 : 1 - (k - 0.4) / 0.6, x: RAHMEN + r.x * SCALE, y: RAHMEN + LEISTE + r.y * SCALE, s: k < 0.4 ? 1 - k * 0.5 : 0.8 };
    }
    const tx = TEXTE.find(([a, z]) => t >= a && t < z);
    const neu = tx ? tx[2] : '';
    const schnittO = t >= SCHNITT && t < SCHNITT + 1.3 ? 1 : 0;
    const endeO = t < ENDE ? 0 : Math.min(1, (t - ENDE) / 0.35);
    await p.evaluate(({ neu, wechsel, tipp, schnittO, endeO }) => {
      const d = document.querySelector('#text div');
      if (wechsel) d.innerHTML = neu;
      d.style.display = neu ? '' : 'none';
      const c = document.getElementById('tipp');
      c.style.opacity = tipp.o; c.style.left = tipp.x + 'px'; c.style.top = tipp.y + 'px'; c.style.transform = `scale(${tipp.s})`;
      document.getElementById('schnitt').style.opacity = schnittO;
      document.getElementById('ende').style.opacity = endeO;
    }, { neu, wechsel: neu !== textJetzt, tipp, schnittO, endeO });
    textJetzt = neu;
    if (nur.length) {
      if (nur.some((s) => Math.abs(s - t) < 0.5 / FPS)) await p.screenshot({ path: path.join(OUT, `standbild-${t.toFixed(1)}.png`) });
    } else {
      const buf = await p.screenshot({ type: 'jpeg', quality: 93 });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    }
    await p.clock.runFor(Math.round(1000 / FPS));
    if (nur.length && t > Math.max(...nur)) break;
  }
  if (ff) { ff.stdin.end(); await new Promise((r) => ff.on('close', r)); }
  await b.close();
  console.log(nur.length ? 'Standbilder in ' + OUT : path.join(OUT, 'reel-wuerfeln.mp4'));
})();
