// Spreadshop-Neuheiten Weihnachten 2026 (Newsletter 17.11.): Motive für Schürze, Geschirrtuch, Kissenbezug, Weihnachtspullover.
// Logo-Wichtel + Spruch, je helle Fassung (rot/grün, für helle Stoffe) und dunkle Fassung (weiß/gelb, für dunkle Stoffe).
// Aufruf aus dem Repo-Ordner: node marketing/merch/skripte/render-neuheiten.js  → marketing/merch/neuheiten/
const path = require('path');
const fs = require('fs');
const R = path.resolve(__dirname, '../../..') + '/';
let chromium;
try { ({ chromium } = require(R + 'node_modules/playwright')); } catch { ({ chromium } = require('playwright')); }
const OUT = R + 'marketing/merch/neuheiten/';
fs.mkdirSync(OUT, { recursive: true });
const font = 'data:font/woff2;base64,' + fs.readFileSync(R + 'assets/fonts/fredoka-latin-600-normal.woff2').toString('base64');
const wichtel = (h) => fs.readFileSync(R + 'wichtel.svg', 'utf8').replace('<svg ', `<svg style="height:${h}px;width:auto;display:block;margin:0 auto 40px" `);
const CSS = `@font-face{font-family:F;src:url(${font})}*{box-sizing:border-box}body{margin:0;font-family:F,sans-serif}`;
const FARBE = { hell: { a: '#c62828', b: '#1f6f4a' }, dunkel: { a: '#ffffff', b: '#f2b705' } };

// [Datei, Name im Shop, Für, Zeilen: [Text, Größe, 'a'|'b']]
const S = [
  ['kueche-01', 'Plätzchen-Wichtel', 'Schürze, Geschirrtuch', [['Plätzchen-', 190, 'a'], ['Wichtel', 230, 'b']]],
  ['kueche-02', 'Hier backt der Wichtel', 'Schürze, Geschirrtuch', [['Hier backt', 180, 'b'], ['der Wichtel', 190, 'a']]],
  ['kueche-03', 'Die Plätzchen? Die hat der Wichtel genascht!', 'Schürze, Geschirrtuch, Kissen',
    [['Die Plätzchen?', 150, 'b'], ['Die hat der', 150, 'b'], ['Wichtel', 220, 'a'], ['genascht!', 190, 'a']]],
  ['kueche-04', 'Naschen verboten! Der Wichtel zählt mit.', 'Schürze, Geschirrtuch',
    [['Naschen', 200, 'a'], ['verboten!', 200, 'a'], ['Der Wichtel', 150, 'b'], ['zählt mit.', 150, 'b']]],
  ['pulli-01', 'Den Pulli hat mir mein Wichtel geschenkt', 'Weihnachtspullover, Hoodie',
    [['Den Pulli', 190, 'a'], ['hat mir mein', 140, 'b'], ['Wichtel', 220, 'a'], ['geschenkt.', 170, 'b']]],
  ['kissen-01', 'Psst … hier schläft ein Wichtel', 'Kissenbezug, Teddy, Kinder-Shirt',
    [['Psst …', 200, 'a'], ['hier schläft', 160, 'b'], ['ein Wichtel', 190, 'a']]],
];
// Vorschau-Stoffe: Name, Farbe, Fassung
const STOFF = [['weiß', '#ffffff', 'hell'], ['natur', '#efe6d2', 'hell'], ['rot', '#b3202a', 'dunkel'], ['tannengrün', '#1d3b2c', 'dunkel']];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1800, height: 2600 }, deviceScaleFactor: 2 });
  const karten = [];
  for (const [datei, name, fuer, z] of S) {
    const png = {};
    for (const v of ['hell', 'dunkel']) {
      const c = FARBE[v];
      const txt = z.map(([t, g, k]) => `<div style="font-size:${g}px;color:${c[k]};line-height:1.04;white-space:nowrap">${t}</div>`).join('');
      await p.setContent(`<!doctype html><style>${CSS}body{background:transparent}</style><div id=m style="display:inline-block;padding:40px;text-align:center">${wichtel(560)}${txt}</div>`);
      await p.evaluate(() => document.fonts.ready);
      const file = `${OUT}${datei}-${v}.png`;
      await (await p.$('#m')).screenshot({ path: file, omitBackground: true });
      png[v] = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
    }
    karten.push(`<div style="background:#fff;border-radius:16px;padding:14px">
      <div style="font-size:24px;color:#c62828">${datei} · <span style="color:#1d3b2c">${name}</span></div>
      <div style="font-size:16px;color:#666;margin:2px 0 10px">für: ${fuer}</div>
      <div style="display:flex;gap:10px">${STOFF.map(([n, hex, v]) => `<div style="flex:1;text-align:center">
        <div style="background:${hex};border:1px solid #0002;border-radius:10px;height:300px;display:flex;align-items:center;justify-content:center;padding:18px">
        <img src="${png[v]}" style="max-height:100%;max-width:100%"></div><div style="font-size:14px;color:#666;margin-top:4px">${n} (${v})</div></div>`).join('')}</div></div>`);
  }
  await p.close();
  const p2 = await b.newPage({ viewport: { width: 1900, height: 900 } });
  await p2.setContent(`<!doctype html><style>${CSS}body{background:#f6efe6}</style><div style="padding:20px">
    <div style="font-size:34px;color:#c62828;margin:0 0 12px 6px">Spreadshop-Neuheiten: Motive zur Auswahl (Cloud 17.11.)</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px">${karten.join('')}</div></div>`);
  await p2.evaluate(() => document.fonts.ready);
  await p2.screenshot({ path: OUT + 'uebersicht-neuheiten.png', fullPage: true });
  await b.close();
  console.log('ok');
})();
