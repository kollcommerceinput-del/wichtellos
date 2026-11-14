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
  // 10.11. (Toni: Pins für Seiten ohne Pin, Saison-Höhepunkt Mitte/Ende Nov.)
  ['maenner', 'geschenk.jpg', '50% -420px', 'Geschenke für Männer', '23 Ideen, die wirklich benutzt werden', 'Alle Ideen ansehen →'],
  ['frauen', 'geschenke/kerze.jpg', '50% 50%', 'Geschenke für Frauen', '21 Ideen, die wirklich ankommen', 'Alle Ideen ansehen →'],
  ['adventskalender-befuellen', 'basteln.jpg', '50% 40%', 'Adventskalender befüllen', '24 Ideen für Groß &amp; Klein', 'Alle 24 Ideen ansehen →'],
  ['wie-funktioniert-wichteln', 'feier.jpg', '50% 45%', 'Wie funktioniert Wichteln?', 'Regeln &amp; Anleitung in 6 Schritten', 'Anleitung ansehen →'],
  ['was-ist-ein-wichtel', 'tuer.jpg', '60% 50%', 'Was ist ein Wichtel?', 'Aussehen, Herkunft &amp; Bedeutung – auch für Kinder', 'Mehr erfahren →'],
  ['wuerfeln', 'wuerfel.jpg', '50% -400px', 'Wichteln mit Würfeln', 'Regeln 1–6 + Würfel &amp; Timer am Handy', 'Spielplan gratis ausdrucken →'],
  // 11.11. (Toni: Pins für Seiten ohne Pin)
  ['wichteln-varianten', 'schrott.jpg', '50% 45%', '12 Wichtel-Varianten', 'Schrottwichteln, Würfeln, Julklapp &amp; mehr', 'Alle Spielarten ansehen →'],
  ['nikolaus', 'kinder.jpg', '50% 45%', 'Nikolaus-Geschenke', '21 Ideen für den Stiefel – Kinder &amp; Große', 'Alle Ideen ansehen →'],
  // 13.11. Black-Friday-Woche 19.–30.11. (7. Feld = Badge oben)
  ['bf-start', 'geschenk-muetze.jpg', '50% -500px', 'Wichtel&shy;geschenke im Angebot', 'Black-Friday-Woche: Ideen unter 10 €', 'Alle Angebote ansehen →', 'BLACK FRIDAY · 19.–30.11.', '50% -620px'],
  ['bf-15', 'geschenke/socken.jpg', '50% 50%', 'Wichtel-Budget 15&nbsp;€?', 'Diese Ideen sind jetzt oft reduziert', 'Ideen ansehen →', 'BLACK FRIDAY'],
  ['bf-heute', 'geschenke/kerze.jpg', '50% 50%', 'Heute: Black&nbsp;Friday', 'Wichtelgeschenke jetzt günstiger', 'Zu den Angeboten →', 'NUR HEUTE · 27.11.'],
  ['bf-cyber', 'onni-geschenk-tisch.jpg', '50% 45%', 'Cyber Monday: letzte Chance', 'Wichtelgeschenke im Angebot', 'Jetzt ansehen →', 'CYBER MONDAY · 30.11.', '50% 75%'],
  // 14.11. neue Seiten (Toni: Kekse + Kuscheldecke = Onnis Liebling), Bilder von Toni
  ['plaetzchen', '../../../kuscheldecke/onni-backstube-2k.jpg', '50% 58%', 'Plätzchen backen mit Kindern', 'Einfaches Rezept + Wichtel-Kekse', 'Zum Rezept →'],
  ['kuscheldecke', '../../../kuscheldecke/onni-kuscheldecke-2k.jpg', '50% 56%', 'Kuschel&shy;decke verschenken', '13 Ideen für gemütliche Winterabende', 'Alle Ideen ansehen →'],
  ['selber-bauen', '../../../selberbau/tuer-selbstgebaut-flow-2k.jpg', '50% 55%', 'Wichteltür selber bauen', 'Werkzeug, Material &amp; Anleitung', 'Zur Anleitung →'],
  ['zubehoer', 'tuer.jpg', '40% 50%', 'Wichtel-Zubehör', '46 Ideen: Möbel, Licht, Briefkasten &amp; mehr', 'Alle Ideen ansehen →'],
];
// Nur einzelne Pins neu bauen: node marketing/render-pins3d.js wuerfeln
const NUR = process.argv.slice(2);
const INSTA = !!process.env.INSTA; // 13.11.: 4:5 für Instagram (1000×1250), Foto 760 px hoch
const H = INSTA ? 1250 : 1500, FOTO = INSTA ? 760 : 1000;

const html = ([, file, pos0, title, sub, cta, badge, posInsta]) => { const pos = INSTA && posInsta ? posInsta : pos0; return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1000px;height:${H}px;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;position:relative;text-align:center}
.photo{position:absolute;top:0;left:0;width:1000px;height:${FOTO}px;object-fit:cover;object-position:${pos}}
.fade{position:absolute;top:${FOTO - 140}px;left:0;right:0;height:140px;background:linear-gradient(rgba(255,248,240,0),#fff8f0)}
.text{position:absolute;top:${FOTO - 25}px;left:60px;right:60px}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:90px;line-height:1.04;margin:0;hyphens:manual}
.line{width:160px;height:8px;border-radius:4px;background:#f2b705;margin:24px auto}
p{font-size:46px;line-height:1.3;margin:0;color:#6d5d57}
.foot{position:absolute;bottom:0;left:0;right:0;background:#c62828;color:#fff;padding:40px 40px 46px}
.url{font-family:Fredoka,sans-serif;font-size:62px}
.tag{font-size:32px;opacity:.9;margin-top:6px}
.badge{position:absolute;top:40px;left:50%;transform:translateX(-50%);background:#111;color:#f2b705;font-family:Fredoka,sans-serif;font-size:48px;padding:14px 40px;border-radius:999px;white-space:nowrap;box-shadow:0 10px 30px rgba(0,0,0,.35)}
</style></head><body>
<img class="photo" src="${img(file)}"><div class="fade"></div>${badge ? `<div class="badge">${badge}</div>` : ''}
<div class="text"><h1>${title}</h1><div class="line"></div><p>${sub}</p></div>
<div class="foot"><div class="url">wichtellos.de</div><div class="tag">${cta}</div></div>
</body></html>`; };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: H } });
  for (const pin of PINS.filter((x) => !NUR.length || NUR.includes(x[0]))) {
    await p.setContent(html(pin));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `${INSTA ? 'insta' : 'pin3d'}-${pin[0]}.png`) });
  }
  await b.close();
  console.log(PINS.length + ' Pins in ' + OUT);
})();
