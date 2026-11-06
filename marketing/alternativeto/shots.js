// Bildschirmfotos für den AlternativeTo-Eintrag (Desktop 1440x900)
const { chromium } = require('G:/wichtellos/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://wichtellos.de/'); await p.waitForTimeout(1500);
  await p.screenshot({ path: __dirname + '/1-start.png' });
  await p.goto('https://wichtellos.de/#form'); await p.waitForTimeout(1000);
  const f = await p.$('#form'); if (f) await f.scrollIntoViewIfNeeded();
  await p.evaluate(() => window.scrollBy(0, -80)); await p.waitForTimeout(500);
  await p.screenshot({ path: __dirname + '/2-formular.png' });
  await b.close(); console.log('ok');
})();
