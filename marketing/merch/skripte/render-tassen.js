// 12 Wichtel-Sprüche auf Tassen – zur Auswahl für Toni
const { chromium } = require('G:/wichtellos/node_modules/playwright');
const fs = require('fs');
const R = 'G:/wichtellos/';
const OUT = R + 'marketing/merch/tassen/';
fs.mkdirSync(OUT, { recursive: true });
const font = 'data:font/woff2;base64,' + fs.readFileSync(R + 'assets/fonts/fredoka-latin-600-normal.woff2').toString('base64');
const svg = (f, h) => fs.readFileSync(R + f, 'utf8').replace('<svg ', `<svg style="height:${h}px;width:auto;display:block;margin:0 auto" `);
const CSS = `@font-face{font-family:F;src:url(${font})}*{box-sizing:border-box}body{margin:0;font-family:F,sans-serif}`;
const ROT = '#c62828', GRUEN = '#1f6f4a';

// [Nr, Figur, Zeilen: [Text, Größe, Farbe]]
const S = [
  [1, 'wichtel.svg', [['Ich wurde', 110, ROT], ['gewichtelt.', 110, ROT], ['Mehr gab’s nicht.', 70, GRUEN]]],
  [2, 'wichtel.svg', [['Offiziell', 120, ROT], ['ausgelost.', 120, ROT], ['Leider für dich.', 72, GRUEN]]],
  [3, 'wichtel.svg', [['Bester Wichtel', 100, ROT], ['der Abteilung', 80, GRUEN]]],
  [4, 'wichtel.svg', [['Mein Wichtel hat mir', 62, GRUEN], ['diese Tasse', 108, ROT], ['geschenkt.', 108, ROT], ['Mehr muss man nicht wissen.', 50, GRUEN]]],
  [5, 'wichtel.svg', [['Kaffee', 140, ROT], ['ist mein Wichtel', 78, GRUEN]]],
  [6, 'wichtel.svg', [['Schrottwichteln', 92, ROT], ['Sieger 2026', 110, GRUEN]]],
  [7, 'wichtel.svg', [['Ich habe beim', 70, GRUEN], ['Schrottwichteln', 100, ROT], ['gewonnen.', 100, ROT], ['Dieses Ding hier.', 62, GRUEN]]],
  [8, 'wichtel.svg', [['Achtung:', 90, ROT], ['Schrottwichtel-Geschenk', 64, ROT], ['Umtausch ausgeschlossen.', 52, GRUEN]]],
  [9, 'wichtel.svg', [['Ich weiß,', 120, ROT], ['wen du gezogen hast', 72, GRUEN], ]],
  [10, 'wichtel.svg', [['Psst …', 130, ROT], ['ich bin', 80, GRUEN], ['dein Wichtel', 100, ROT]]],
  [11, 'wichtel.svg', [['Wichtel-Budget: 10 €', 70, GRUEN], ['Diese Tasse:', 100, ROT], ['unbezahlbar.', 100, ROT]]],
  [12, 'wichtel.svg', [['Ich hab dich lieb.', 90, ROT], ['Aber nur, weil ich', 62, GRUEN], ['dich gezogen hab.', 62, GRUEN]]],
];

// art: 'emaille' = weißer Becher mit farbigem Rand+Henkel; 'panorama' = weiß außen, Henkel + innen farbig
const tasse = (m, farbe, art) => `<div style="position:relative;width:250px;height:220px;margin:0 auto">
  <div style="position:absolute;right:0;top:50px;width:66px;height:104px;border:18px solid ${farbe};border-left:none;border-radius:0 52px 52px 0"></div>
  <div style="position:absolute;left:0;top:6px;width:200px;height:206px;background:#fff;border-radius:${art === 'emaille' ? '6px 6px 22px 22px' : '8px 8px 26px 26px'};box-shadow:inset -16px 0 26px #0001,0 3px 10px #0002;${art === 'emaille' ? `border-top:8px solid ${farbe};border-bottom:5px solid ${farbe};` : ''}display:flex;align-items:center;justify-content:center;padding:12px;overflow:hidden">
  ${art === 'panorama' ? `<div style="position:absolute;left:6px;right:6px;top:0;height:16px;background:${farbe};border-radius:0 0 50% 50% / 0 0 100% 100%"></div>` : ''}
  <img src="${m}" style="max-height:176px;max-width:176px;position:relative"></div></div>`;
const VAR = [['Weiß/Dunkelgrün', '#1d4d33', 'panorama'], ['Weiß/Rot', '#c62828', 'panorama'], ['Emaille Rand rot', '#b71c1c', 'emaille']];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1800, height: 1600 }, deviceScaleFactor: 2 });
  const karten = [];
  for (const [nr, fig, zeilen] of S) {
    const txt = zeilen.map(([t, g, c]) => `<div style="font-size:${g}px;color:${c};line-height:1.08;white-space:nowrap">${t}</div>`).join('');
    await p.setContent(`<!doctype html><style>${CSS}body{background:transparent}</style><div id=m style="display:inline-block;padding:30px;text-align:center">${svg(fig, 360).replace('margin:0 auto', 'margin:0 auto 24px')}${txt}</div>`);
    await p.evaluate(() => document.fonts.ready);
    const file = `${OUT}tasse-${String(nr).padStart(2, '0')}.png`;
    await (await p.$('#m')).screenshot({ path: file, omitBackground: true });
    const d = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
    karten.push(`<div style="background:#fff;border-radius:16px;padding:14px 10px;text-align:center">
      <div style="font-size:34px;color:${ROT};margin-bottom:6px">${nr}</div>
      <div style="display:flex;gap:6px;justify-content:center">${VAR.map(([t, f, a]) => `<div><div style="font-size:16px;color:#555">${t}</div>${tasse(d, f, a)}</div>`).join('')}</div></div>`);
  }
  await p.setViewportSize({ width: 1640, height: 900 });
  await p.setContent(`<!doctype html><style>${CSS}body{background:#f6efe6}</style>
    <div style="padding:22px"><div style="font-size:36px;color:${ROT};margin:0 0 14px 6px">Wichtel-Tassen mit Logo-Wichtel · Panoramatasse Weiß/Dunkelgrün, Weiß/Rot (14,49 €) · Emaille rot (15,49 €)</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px">${karten.join('')}</div></div>`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${OUT}uebersicht-tassen-farben.png`, fullPage: true });
  await b.close();
  console.log('ok');
})();
