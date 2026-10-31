const { chromium } = require('playwright');
const OUT = process.argv[2];
const BASE = process.env.BASE || 'http://localhost:8766';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(`${p.url()}: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error') errors.push(`${p.url()}: ${m.text()}`); });

  // 1) Alle internen Links abklappern
  const seen = new Set(), queue = ['/'], report = [];
  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await p.goto(BASE + path);
    const info = await p.evaluate(() => ({
      title: document.title,
      desc: (document.querySelector('meta[name=description]') || {}).content || '',
      h1: document.querySelectorAll('h1').length,
      noindex: !!document.querySelector('meta[name=robots][content*=noindex]'),
      internal: [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href').split('#')[0]),
      aff: [...document.querySelectorAll('a[href*="amazon.de"]')].map(a => ({ rel: a.rel, star: a.textContent.includes('*') })),
    }));
    report.push(`${res.status()} ${path} | h1=${info.h1} | Titel ${info.title.length} Z. | Beschr. ${info.desc.length} Z. | Amazon-Links ${info.aff.length}${info.aff.some(a => !a.rel.includes('sponsored') || !a.star) ? ' (FEHLT rel/Stern!)' : ''}${info.noindex ? ' | noindex' : ''}`);
    info.internal.forEach(h => { if (!seen.has(h)) queue.push(h); });
  }
  console.log(report.join('\n'));
  const r404 = await p.goto(BASE + '/gibt-es-nicht/');
  console.log('Unbekannte Seite ->', r404.status(), '(lokaler Testserver; Cloudflare/IONOS zeigen dann 404.html)');

  // 2) Breite 320 px: kein seitliches Scrollen
  const narrow = await b.newContext({ viewport: { width: 320, height: 700 } });
  const n = await narrow.newPage();
  const over = [];
  for (const path of seen) {
    await n.goto(BASE + path);
    const o = await n.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (o > 0) over.push(`${path} (+${o}px)`);
  }
  console.log('Seitliches Scrollen bei 320 px:', over.length ? over.join(', ') : 'nirgends');

  // 3) Tool: auslosen -> geheimer Link -> Geschenkideen
  await p.goto(BASE + '/');
  await p.evaluate(() => localStorage.clear()); await p.reload();
  await p.fill('#budget', '15 â‚¬');
  const inputs = await p.$$('#people .person input');
  for (const [i, nme] of ['Anna', 'Ben', 'Clara'].entries()) await inputs[i].fill(nme);
  await p.click('button[type=submit]');
  const url = await p.evaluate(() => JSON.parse(localStorage.getItem('wichtellos-result')).links[0].url);
  await p.goto(url);
  await p.click('#reveal-btn');
  const more = await p.getAttribute('#ideas-more', 'href');
  const ideaHref = await p.getAttribute('#ideas a', 'href');
  console.log('Geheimer Link: Mehr-Link ->', more, '| erste Idee ->', ideaHref.slice(0, 60) + 'â€¦');
  const moreRes = await p.goto(BASE + more);
  console.log('Mehr-Link erreichbar:', moreRes.status());

  // 4) Screenshots
  for (const [path, name] of [['/wichtelgeschenke-unter-10-euro/', 'geschenke-10'], ['/wichteln-wuerfeln-regeln/', 'wuerfeln'], ['/schrottwichteln/', 'schrott'], ['/impressum/', 'impressum']]) {
    await p.goto(BASE + path);
    await p.screenshot({ path: `${OUT}/${name}-mobile.png`, fullPage: true });
  }
  await p.goto(BASE + '/wichteln-wuerfeln-regeln/');
  await p.emulateMedia({ media: 'print' });
  await p.screenshot({ path: `${OUT}/wuerfeln-druck.png`, fullPage: true });
  await p.emulateMedia({ media: 'screen' });
  const dark = await b.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const d = await dark.newPage();
  await d.goto(BASE + '/wichtelgeschenke-unter-20-euro/');
  await d.screenshot({ path: `${OUT}/geschenke-20-dunkel.png` });
  const desk = await b.newContext({ viewport: { width: 1366, height: 900 } });
  const dp = await desk.newPage();
  await dp.goto(BASE + '/wichtelgeschenke-unter-10-euro/');
  await dp.screenshot({ path: `${OUT}/geschenke-10-desktop.png` });

  console.log('JS-Fehler:', errors.length ? errors : 'keine');
  await b.close();
})();
