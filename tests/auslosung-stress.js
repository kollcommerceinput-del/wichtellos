const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();
  await p.goto('http://localhost:8766/');
  const names = ['Anna', 'Ben', 'Clara', 'David', 'Emil', 'Frida', 'Gus'];
  for (let i = 3; i < names.length; i++) await p.click('#add-person');
  const inputs = await p.$$('#people input');
  for (let i = 0; i < names.length; i++) await inputs[i].fill(names[i]);
  for (const [a, c] of [['Anna', 'Ben'], ['Clara', 'David'], ['Emil', 'Frida']]) {
    await p.selectOption('#ex-a', { label: a }); await p.selectOption('#ex-b', { label: c }); await p.click('#add-excl');
  }
  const banned = new Set(['Anna>Ben', 'Ben>Anna', 'Clara>David', 'David>Clara', 'Emil>Frida', 'Frida>Emil']);
  let bad = 0; const pairCount = {};
  const RUNS = 300;
  for (let run = 0; run < RUNS; run++) {
    await p.click(run === 0 ? 'button[type=submit]' : '#redraw');
    const map = await p.evaluate(() => {
      const KEY = new TextEncoder().encode('wichtel-los-2026');
      const res = JSON.parse(localStorage.getItem('wichtellos-result'));
      const out = {};
      for (const l of res.links) {
        const s = l.url.split('#w=')[1];
        const raw = Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
        const salt = raw.slice(0, 4);
        const data = raw.slice(4).map((x, i) => x ^ KEY[i % KEY.length] ^ salt[i % 4]);
        const o = JSON.parse(new TextDecoder().decode(data));
        out[o.n] = o.r;
      }
      return out;
    });
    const g = Object.keys(map), r = Object.values(map);
    const ok = g.length === names.length && new Set(r).size === names.length && g.every(x => map[x] !== x && !banned.has(`${x}>${map[x]}`));
    if (!ok) { bad++; console.log('FEHLER', JSON.stringify(map)); }
    for (const x of g) pairCount[`${x}>${map[x]}`] = (pairCount[`${x}>${map[x]}`] || 0) + 1;
  }
  console.log(`${RUNS} Auslosungen mit 7 Personen und 3 Ausschlüssen, Fehler: ${bad}`);
  console.log('Wen zieht Anna (Verteilung):', Object.entries(pairCount).filter(([k]) => k.startsWith('Anna>')).map(([k, v]) => `${k.split('>')[1]}=${v}`).join(' '));
  const url = await p.evaluate(() => JSON.parse(localStorage.getItem('wichtellos-result')).links[0].url);
  console.log('Beispiel-Linklänge:', url.length, 'Zeichen');
  await b.close();
})();
