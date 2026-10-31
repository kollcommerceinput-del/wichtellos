// Erzeugt Pinterest-Pins (1000x1500) für die Ratgeberseiten nach marketing/pins/
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'pins');
const svg = f => fs.readFileSync(path.join(ROOT, 'grafik', f), 'utf8');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

const PINS = [
  ['unter-5-euro', 'wichtel-geschenk.svg', 'Wichtel&shy;geschenke unter 5 €', '12 kleine Ideen mit großer Wirkung', '/wichtelgeschenke-unter-5-euro'],
  ['unter-10-euro', 'wichtel-geschenk.svg', 'Wichtel&shy;geschenke unter 10 €', '12 Ideen – auch fürs Büro', '/wichtelgeschenke-unter-10-euro'],
  ['unter-15-euro', 'wichtel-geschenk.svg', 'Wichtel&shy;geschenke unter 15 €', '12 Ideen mit etwas mehr Spielraum', '/wichtelgeschenke-unter-15-euro'],
  ['unter-20-euro', 'wichtel-geschenk.svg', 'Wichtel&shy;geschenke unter 20 €', '12 Ideen für Familie & Freunde', '/wichtelgeschenke-unter-20-euro'],
  ['unter-30-euro', 'wichtel-geschenk.svg', 'Wichtel&shy;geschenke unter 30 €', '12 Ideen, die richtig Eindruck machen', '/wichtelgeschenke-unter-30-euro'],
  ['geschenkfinder', 'wichtel-lupe.svg', 'Das passende Wichtel&shy;geschenk finden', 'Über 100 Ideen – nach Alter, Budget & Interessen filtern', '/geschenkfinder'],
  ['kinder', 'wichtel-winkt.svg', 'Wichtel&shy;geschenke für Kinder', 'Ideen für Kinder von 3 bis 12 Jahren', '/wichtelgeschenke-fuer-kinder'],
  ['selber-machen', 'wichtel-geschenk.svg', 'Wichtel&shy;geschenke selber machen', 'Einfache DIY-Ideen mit Anleitung', '/wichtelgeschenke-selber-machen', 'Anleitungen ansehen →'],
  ['wuerfeln', 'wichtel-wuerfel.svg', 'Wichteln mit Würfeln', 'Die Regeln – einfach erklärt', '/wichteln-wuerfeln-regeln', 'Regeln ansehen →'],
  ['schrottwichteln', 'wichtel-wuerfel.svg', 'Schrott&shy;wichteln', 'Regeln, Ablauf & lustige Ideen', '/schrottwichteln', 'Regeln & Ideen ansehen →'],
  ['auslosen', 'wichtel-winkt.svg', 'Wichteln online auslosen', 'In 1 Minute – kostenlos, ohne Anmeldung, geheime Links per WhatsApp', '', 'Jetzt Gruppe erstellen →'],
];

const html = ([, pose, title, sub, url, cta = 'Alle Ideen mit Links ansehen →']) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1000px;height:1500px;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;
  display:flex;flex-direction:column;align-items:center;text-align:center;overflow:hidden;position:relative}
.stripe{position:absolute;top:0;left:0;right:0;height:28px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
.lights{width:100%;margin-top:28px}.lights svg{width:100%;height:auto;display:block}
.pose{margin-top:20px}.pose svg{height:430px;width:auto}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:104px;line-height:1.04;margin:30px 70px 0;hyphens:manual}
.line{width:160px;height:8px;border-radius:4px;background:#f2b705;margin:40px auto}
p{font-size:48px;line-height:1.3;margin:0 90px;color:#6d5d57}
.foot{position:absolute;bottom:0;left:0;right:0;background:#c62828;color:#fff;padding:44px 40px 50px}
.url{font-family:Fredoka,sans-serif;font-size:62px}
.tag{font-size:32px;opacity:.9;margin-top:6px}
</style></head><body>
<div class="stripe"></div><div class="lights">${svg('lichterkette.svg')}</div>
<div class="pose">${svg(pose)}</div>
<h1>${title}</h1><div class="line"></div><p>${sub}</p>
<div class="foot"><div class="url">wichtellos.de</div><div class="tag">${cta}</div></div>
</body></html>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  for (const pin of PINS) {
    await p.setContent(html(pin));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `pin-${pin[0]}.png`) });
  }
  await b.close();
  console.log(PINS.length + ' Pins in ' + OUT);
})();
