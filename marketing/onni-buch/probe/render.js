// Probe Onni-Ausmalbuch: probe.html → onni-buch-probe.pdf + seite-N.png
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
  await p.goto('file:///' + path.join(__dirname, 'probe.html').replace(/\\/g, '/'));
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(__dirname, 'onni-buch-probe.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  const s = await p.$$('section');
  for (let i = 0; i < s.length; i++) await s[i].screenshot({ path: path.join(__dirname, `seite-${i + 1}.png`) });
  await b.close();
})();
