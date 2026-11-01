// Erzeugt Instagram-/TikTok-Karussells nach marketing/social/<set>/ (ig = 1080x1350, tt = 1080x1920)
// node marketing/render-social.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'social');
const svg = f => fs.readFileSync(path.join(ROOT, 'grafik', f), 'utf8');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

// Folie: { pose } = Titelfolie mit Wichtel, { big } = großes Emoji/Zahl, { cta } = Schlussfolie
const SETS = {
  auslosen: [
    { pose: 'wichtel-winkt.svg', title: 'Wichteln in 1 Minute auslosen', text: 'Kostenlos, ohne Anmeldung – so geht\'s', swipe: true },
    { big: '✏️', kicker: 'Schritt 1', title: 'Namen eintragen', text: 'Gruppe anlegen, alle Teilnehmer rein – Paare kannst du ausschließen.' },
    { big: '🎲', kicker: 'Schritt 2', title: 'Auslosen', text: 'Ein Klick – jeder bekommt seinen eigenen geheimen Link.' },
    { big: '📲', kicker: 'Schritt 3', title: 'Links verschicken', text: 'Per WhatsApp oder E-Mail. Jeder sieht nur, wen er beschenkt.' },
    { big: '💡', kicker: 'Extra', title: 'Heimlicher Tipp', text: '„Mag Tee“, „keine Socken“ – nur dein Wichtel sieht es.' },
    { big: '🖨️', kicker: 'Extra', title: 'Lose zum Ausdrucken', text: 'Mit QR-Code für die Feier – oder ganz ohne Handy für Kinder.' },
    { cta: 'Jetzt Gruppe erstellen', title: 'Bereit zum Wichteln?', text: 'Link in der Bio 🎁' },
  ],
  'buero-unter-10': [
    { pose: 'wichtel-geschenk.svg', title: '5 Wichtel&shy;geschenke fürs Büro', text: 'Alle unter 10 € – und keiner ist beleidigt', swipe: true },
    { big: '🧤', kicker: 'Idee 1', title: 'Handwärmer', text: 'Wiederverwendbar – gegen kalte Finger draußen und im Büro.' },
    { big: '☕', kicker: 'Idee 2', title: 'Tasse mit Spruch', text: 'Sorgt jeden Morgen beim Kaffee für ein Grinsen.' },
    { big: '🌵', kicker: 'Idee 3', title: 'Mini-Pflanze', text: 'Sukkulente oder Kaktus – braucht kaum Pflege.' },
    { big: '🍫', kicker: 'Idee 4', title: 'Gourmet-Schokolade', text: 'Eine besondere Sorte statt der Standardtafel, etwa mit Meersalz.' },
    { big: '🧩', kicker: 'Idee 5', title: 'Knobelspiel', text: 'Ein kleines Geduldsspiel für kurze Pausen.' },
    { cta: 'Über 100 Ideen ansehen', title: 'Noch mehr Ideen?', text: 'Geschenkfinder nach Budget & Alter – Link in der Bio 🎁' },
  ],
  lose: [
    { pose: 'wichtel-geschenk.svg', title: 'Wichtel-Lose zum Ausdrucken', text: 'Für die Weihnachtsfeier – kostenlos', swipe: true },
    { big: '🖨️', kicker: 'Schritt 1', title: 'Auslosen & drucken', text: 'Gruppe online auslosen, dann die Lose ausdrucken – 6 pro A4-Seite.' },
    { big: '📱', kicker: 'Schritt 2', title: 'QR-Code scannen', text: 'Außen der Name, innen der QR-Code – Handy drauf, Geheimnis gelüftet.' },
    { big: '🧒', kicker: 'Für Kinder', title: 'Ganz ohne Handy', text: 'Auf Wunsch steht innen einfach der Name. Perfekt für Kita und Klasse.' },
    { big: '📋', kicker: 'Extra', title: 'Aushang „Wir wichteln!“', text: 'Mit Teilnehmerliste zum Eintragen – für Kaffeeküche oder Klassenzimmer.' },
    { cta: 'Lose kostenlos erstellen', title: 'Bereit für die Feier?', text: 'Link in der Bio 🎁' },
  ],
  wichteltuer: [
    { pose: 'wichtel-schlaeft.svg', title: 'Wichteltür: die ersten 6 Streiche', text: 'Für den Advent mit Kindern – zum Nachmachen', swipe: true },
    { big: '1', kicker: '1. Dezember', title: 'Einzug', text: 'Die Tür steht plötzlich da. Davor: ein Brief und Fußspuren aus Puderzucker.' },
    { big: '2', kicker: '2. Dezember', title: 'Frühstücksgruß', text: 'Auf jedem Teller liegt ein Gummibärchen – in Reih und Glied.' },
    { big: '3', kicker: '3. Dezember', title: 'Sockengirlande', text: 'Der Wichtel hat Socken quer durchs Wohnzimmer aufgehängt.' },
    { big: '4', kicker: '4. Dezember', title: 'Kuscheltier-Picknick', text: 'Alle Kuscheltiere sitzen im Kreis und teilen sich Kekskrümel.' },
    { big: '5', kicker: '5. Dezember', title: 'Schneemann-Rolle', text: 'Eine Klopapierrolle ist über Nacht zum Schneemann geworden.' },
    { big: '6', kicker: '6. Dezember', title: 'Nikolaus', text: 'Die Stiefel sind geputzt – daneben ein Mini-Brief vom Wichtel.' },
    { cta: 'Plan für alle 24 Tage', title: 'Alle 24 Streiche + Begrüßungsbrief', text: 'Kostenlos auf wichtellos.de – Link in der Bio 🎄' },
  ],
};

const html = (s, i, n, H) => {
  const tall = H > 1500;
  const dots = Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  let body;
  if (s.pose) body = `<div class="pose">${svg(s.pose)}</div><h1 class="cover">${s.title}</h1><div class="line"></div><p>${s.text}</p>`;
  else if (s.cta) body = `<div class="pose small">${svg('wichtel-winkt.svg')}</div><h1>${s.title}</h1><div class="line"></div><p>${s.text}</p><div class="btn">${s.cta} →</div>`;
  else body = `<div class="big${/^\d+$/.test(s.big) ? ' num' : ''}">${s.big}</div><div class="kicker">${s.kicker}</div><h1>${s.title}</h1><div class="line"></div><p>${s.text}</p>`;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:${H}px;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;
  display:flex;flex-direction:column;align-items:center;text-align:center;overflow:hidden;position:relative}
.stripe{position:absolute;top:0;left:0;right:0;height:26px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px)}
.lights{width:100%;margin-top:26px}.lights svg{width:100%;height:auto;display:block}
main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:${tall ? 260 : 170}px}
.pose svg{height:${tall ? 520 : 400}px;width:auto}.pose.small svg{height:${tall ? 360 : 260}px}
.big{font-size:${tall ? 200 : 170}px;line-height:1}
.big.num{font-family:Fredoka,sans-serif;color:#fff;background:#1f6f4a;width:${tall ? 230 : 200}px;height:${tall ? 230 : 200}px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:${tall ? 140 : 120}px}
.kicker{margin-top:36px;font-size:40px;font-weight:700;color:#c62828;text-transform:uppercase;letter-spacing:3px}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:${tall ? 104 : 92}px;line-height:1.06;margin:20px 80px 0;hyphens:manual}
h1.cover{font-size:${tall ? 116 : 100}px;margin-top:30px}
.line{width:160px;height:8px;border-radius:4px;background:#f2b705;margin:${tall ? 48 : 36}px auto}
p{font-size:${tall ? 52 : 46}px;line-height:1.32;margin:0 100px;color:#6d5d57}
.btn{margin-top:50px;background:#c62828;color:#fff;font-family:Fredoka,sans-serif;font-size:52px;padding:26px 56px;border-radius:60px}
.dots{position:absolute;bottom:${tall ? 200 : 130}px;display:flex;gap:16px}.dots i{width:18px;height:18px;border-radius:50%;background:#e3d6cc}.dots i.on{background:#c62828}
.swipe{position:absolute;right:56px;bottom:${tall ? 190 : 120}px;font-size:38px;font-weight:700;color:#1f6f4a}
.foot{position:absolute;bottom:0;left:0;right:0;background:#c62828;color:#fff;padding:${tall ? 50 : 26}px 40px ${tall ? 70 : 30}px;font-family:Fredoka,sans-serif;font-size:56px}
</style></head><body>
<div class="stripe"></div><div class="lights">${svg('lichterkette.svg')}</div>
<main>${body}</main>
<div class="dots">${dots}</div>${s.swipe ? '<div class="swipe">wischen →</div>' : ''}
<div class="foot">wichtellos.de</div>
</body></html>`;
};

(async () => {
  const b = await chromium.launch();
  for (const [name, slides] of Object.entries(SETS)) {
    const dir = path.join(OUT, name);
    fs.mkdirSync(dir, { recursive: true });
    for (const [fmt, H] of [['ig', 1350], ['tt', 1920]]) {
      const p = await b.newPage({ viewport: { width: 1080, height: H } });
      for (const [i, s] of slides.entries()) {
        await p.setContent(html(s, i, slides.length, H));
        await p.evaluate(() => document.fonts.ready);
        await p.screenshot({ path: path.join(dir, `${fmt}-${String(i + 1).padStart(2, '0')}.png`) });
      }
      await p.close();
    }
  }
  // Highlight-Titelbilder (Instagram zeigt den Kreis aus der Mitte)
  const COVERS = [['so-gehts', 'wichtel-winkt.svg', '#1f6f4a'], ['geschenke', 'wichtel-geschenk.svg', '#c62828'],
    ['wichteltuer', 'wichtel-schlaeft.svg', '#1f6f4a'], ['lose', 'wichtel-wuerfel.svg', '#f2b705']];
  const dir = path.join(OUT, 'highlights');
  fs.mkdirSync(dir, { recursive: true });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [name, pose, color] of COVERS) {
    await p.setContent(`<!doctype html><body style="margin:0;width:1080px;height:1920px;background:#fff8f0;display:flex;align-items:center;justify-content:center">
      <div style="width:900px;height:900px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center">
      <div style="width:780px;height:780px;border-radius:50%;background:#fff8f0;display:flex;align-items:center;justify-content:center">
      ${svg(pose).replace('<svg', '<svg style="height:560px;width:auto"')}</div></div></body>`);
    await p.screenshot({ path: path.join(dir, `cover-${name}.png`) });
  }
  await b.close();
  console.log('Karussells + Highlight-Titel in ' + OUT);
})();
