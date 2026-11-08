// Shirt-Sprüche (Toni 07.11.) mit Logo-Wichtel, helle + dunkle Fassung, auf 4 Shirtfarben
const { chromium } = require('G:/wichtellos/node_modules/playwright');
const fs = require('fs');
const R = 'G:/wichtellos/';
const OUT = R + 'marketing/merch/shirts/';
fs.mkdirSync(OUT, { recursive: true });
const font = 'data:font/woff2;base64,' + fs.readFileSync(R + 'assets/fonts/fredoka-latin-600-normal.woff2').toString('base64');
const wichtel = (h) => fs.readFileSync(R + 'wichtel.svg', 'utf8').replace('<svg ', `<svg style="height:${h}px;width:auto;display:block;margin:0 auto" `);
const herz = (px, c) => `<svg viewBox="0 0 32 29" style="height:${px * 0.78}px;width:auto;vertical-align:-0.06em;margin:0 0.12em"><path d="M16 29 C16 29 0 19 0 9 A8 8 0 0 1 16 5 A8 8 0 0 1 32 9 C32 19 16 29 16 29Z" fill="${c}"/></svg>`;
const CSS = `@font-face{font-family:F;src:url(${font})}*{box-sizing:border-box}body{margin:0;font-family:F,sans-serif}`;
const FARBE = { hell: { a: '#c62828', b: '#1f6f4a', h: '#c62828' }, dunkel: { a: '#ffffff', b: '#f2b705', h: '#e53935' } };

// Zeilen: [Text | {herz}, Größe, 'a'|'b']
const S = [
  ['01', 'Wichtel-Gewinner', [['Wichtel-', 200, 'a'], ['Gewinner', 200, 'b']]],
  ['02', 'Wichtel-Sieger 2026', [['Wichtel-Sieger', 170, 'a'], ['2026', 230, 'b']]],
  ['03', 'Ich habe einen Wichtel zu Hause', [['Ich habe einen', 120, 'b'], ['Wichtel', 220, 'a'], ['zu Hause', 140, 'b']]],
  ['04', 'Ich liebe Wichtel', [['Ich liebe', 190, 'b'], ['Wichtel', 230, 'a']]],
  ['05', 'Ich liebe Wichteln', [['Ich liebe', 190, 'b'], ['Wichteln', 220, 'a']]],
  ['04h', 'Ich ♥ Wichtel', [['Ich ♥', 230, 'b'], ['Wichtel', 230, 'a']]],
  ['05h', 'Ich ♥ Wichteln', [['Ich ♥', 230, 'b'], ['Wichteln', 220, 'a']]],
  ['06', 'Offizieller Wichtel-Gewinner', [['Offizieller', 150, 'b'], ['Wichtel-', 200, 'a'], ['Gewinner', 200, 'a']]],
  ['07', 'Bei uns wohnt ein Wichtel', [['Bei uns wohnt', 150, 'b'], ['ein Wichtel', 190, 'a']]],
  ['08', 'Mein Wichtelgeschenk', [['Mein', 150, 'b'], ['Wichtel-', 210, 'a'], ['geschenk', 210, 'a']]],
  ['09', 'Gewonnen beim Wichteln', [['Gewonnen', 200, 'a'], ['beim Wichteln', 150, 'b']]],
];
const STOFF = [['weiß', '#ffffff', 'hell'], ['grau meliert', '#c9c9c9', 'hell'], ['dunkelblau', '#1f2a44', 'dunkel'], ['tannengrün', '#1d3b2c', 'dunkel']];

const shirt = (fill, m) => `<div style="position:relative;width:250px;height:262px;margin:0 auto">
  <svg viewBox="0 0 200 210" style="position:absolute;inset:0;width:100%;height:100%"><path d="M60 8 L80 4 Q100 22 120 4 L140 8 L196 40 L176 82 L156 72 L156 206 L44 206 L44 72 L24 82 L4 40 Z" fill="${fill}" stroke="#0003" stroke-width="1.5"/></svg>
  <img src="${m}" style="position:absolute;left:29%;top:20%;width:42%"></div>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1800, height: 2400 }, deviceScaleFactor: 2 });
  const zeilen = [];
  for (const [nr, titel, z] of S) {
    const png = {};
    for (const v of ['hell', 'dunkel']) {
      const c = FARBE[v];
      const txt = z.map(([t, g, k]) => `<div style="font-size:${g}px;color:${c[k]};line-height:1.02;white-space:nowrap">${t.replace('♥', herz(g, c.h))}</div>`).join('');
      await p.setContent(`<!doctype html><style>${CSS}body{background:transparent}</style><div id=m style="display:inline-block;padding:40px;text-align:center">${wichtel(620).replace('margin:0 auto', 'margin:0 auto 40px')}${txt}</div>`);
      await p.evaluate(() => document.fonts.ready);
      const file = `${OUT}shirt-${nr}-${v}.png`;
      await (await p.$('#m')).screenshot({ path: file, omitBackground: true });
      png[v] = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
    }
    zeilen.push(`<div style="background:#fff;border-radius:16px;padding:12px;display:flex;align-items:center;gap:8px">
      <div style="width:150px;font-size:22px;color:#c62828;text-align:center">${nr}<br><span style="font-size:17px;color:#333">${titel.replace('♥', '❤')}</span></div>
      ${STOFF.map(([n, hex, v]) => `<div style="text-align:center"><div style="font-size:15px;color:#666">${n}</div>${shirt(hex, png[v])}</div>`).join('')}</div>`);
  }
  await p.close(); const p2 = await b.newPage({ viewport: { width: 2300, height: 900 } });
  await p2.setContent(`<!doctype html><style>${CSS}body{background:#f6efe6}</style><div style="padding:20px">
    <div style="font-size:34px;color:#c62828;margin:0 0 12px 6px">Wichtel-Shirts mit Logo-Wichtel</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">${zeilen.join('')}</div></div>`);
  await p2.evaluate(() => document.fonts.ready);
  await p2.screenshot({ path: OUT + 'uebersicht-shirts.png', fullPage: true });
  await b.close();
  console.log('ok');
})();
