// Pinterest-Pins (1000x1500) mit dem 3D-Plüsch-Wichtel (KI-Standbilder aus marketing/reel/wichtel3d/stills/) nach marketing/pins3d/
// Oben Foto, darunter Titel + Untertitel, unten roter Balken mit wichtellos.de. Beim Hochladen auf Pinterest als KI-Inhalt kennzeichnen.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'pins3d');
const STILLS = path.join(__dirname, 'reel', 'wichtel3d', 'stills');
const img = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(STILLS, f)).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

// [Datei, Bild, Bildausschnitt (object-position, z. B. '50% -300px' = 300 px nach oben geschoben), Titel, Untertitel, Hinweis im roten Balken]
const PINS = [
  ['auslosen', 'werkstatt.jpg', '87% 50%', 'Wichteln online auslosen', 'In 1 Minute – kostenlos, ohne Anmeldung', 'Jetzt Gruppe erstellen →'],
  ['whatsapp', 'umschlag.jpg', '50% -300px', 'Wichteln per WhatsApp', 'Jeder bekommt seinen geheimen Link', 'Anleitung ansehen →'],
  ['wichtelgedichte', 'feder.jpg', '50% -430px', 'Wichtel&shy;gedichte', 'Kurze Reime für die Geschenk-Karte', 'Reime ansehen →'],
  ['lose-drucken', 'los.jpg', '50% -330px', 'Wichtel-Lose zum Ausdrucken', 'Mit QR-Code oder ganz ohne Handy', 'Kostenlos erstellen →'],
  ['buero', 'geschenk.jpg', '50% -480px', 'Wichteln im Büro', 'Regeln, Budget & Ablauf fürs Team', 'Tipps fürs Team ansehen →'],
  ['unter-10-euro', 'geschenk-muetze.jpg', '50% -500px', 'Wichtel&shy;geschenke unter 10 €', '12 Ideen – auch für Kollegen', 'Alle Ideen ansehen →'],
  ['geschenke-generator', 'onni-geschenk-tisch.jpg', '50% 45%', 'Geschenke-Generator', '3 Fragen – 3 Ideen zum Freirubbeln', 'Jetzt Lose ziehen →'],
  ['rubbellos', 'onni-handy.jpg', '50% 45%', 'Geschenk als Rubbellos', 'Per WhatsApp – zum Freirubbeln', 'Kostenlos erstellen →'],
  ['wunschzettel', 'lupe.jpg', '50% -380px', 'Wunschzettel fürs Wichteln', 'Als Link in die Wichtelgruppe schicken', 'Kostenlos erstellen →'],
  ['wuerfeln', 'wuerfel.jpg', '50% -400px', 'Wichteln mit Würfeln', 'Regeln 1–6 + Würfel &amp; Timer am Handy', 'Spielplan gratis ausdrucken →'],
];
// Nur einzelne Pins neu bauen: node marketing/render-pins3d.js wuerfeln
const NUR = process.argv.slice(2);

const html = ([, file, pos, title, sub, cta]) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1000px;height:1500px;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;position:relative;text-align:center}
.photo{position:absolute;top:0;left:0;width:1000px;height:1000px;object-fit:cover;object-position:${pos}}
.fade{position:absolute;top:860px;left:0;right:0;height:140px;background:linear-gradient(rgba(255,248,240,0),#fff8f0)}
.text{position:absolute;top:975px;left:60px;right:60px}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:90px;line-height:1.04;margin:0;hyphens:manual}
.line{width:160px;height:8px;border-radius:4px;background:#f2b705;margin:24px auto}
p{font-size:46px;line-height:1.3;margin:0;color:#6d5d57}
.foot{position:absolute;bottom:0;left:0;right:0;background:#c62828;color:#fff;padding:40px 40px 46px}
.url{font-family:Fredoka,sans-serif;font-size:62px}
.tag{font-size:32px;opacity:.9;margin-top:6px}
</style></head><body>
<img class="photo" src="${img(file)}"><div class="fade"></div>
<div class="text"><h1>${title}</h1><div class="line"></div><p>${sub}</p></div>
<div class="foot"><div class="url">wichtellos.de</div><div class="tag">${cta}</div></div>
</body></html>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  for (const pin of PINS.filter((x) => !NUR.length || NUR.includes(x[0]))) {
    await p.setContent(html(pin));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `pin3d-${pin[0]}.png`) });
  }
  await b.close();
  console.log(PINS.length + ' Pins in ' + OUT);
})();
