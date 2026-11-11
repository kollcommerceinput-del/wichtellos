// „Mein Wichtel heißt …“ mit Logo-Wichtel (wie die ersten Tassen), freie Fläche für den Namen (Toni 11.11.)
// node marketing/merch/skripte/render-wichtel-name-frei-logo.js -> onni-serie/logo-wichtel-heisst-frei(-fuer-dunkle-stoffe).png + vorschau-logo-name-frei.png
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const R = path.join(__dirname, '..', '..', '..');
const SERIE = path.join(R, 'marketing', 'merch', 'onni-serie');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(R, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const svg = fs.readFileSync(path.join(R, 'wichtel.svg'), 'utf8').replace('<svg ', '<svg style="height:2500px;width:auto;display:block;margin:0 auto" ');
const html = (farbe, vorschau) => `<html><head><style>
@font-face{font-family:F;src:url(${font})}
html,body{margin:0;background:${vorschau || 'transparent'}}
.w{position:relative;width:4000px;height:4000px;overflow:hidden}
.fig{position:absolute;left:0;right:0;top:200px}
.t{position:absolute;left:0;right:0;top:2900px;text-align:center;font:600 360px/1 F;color:${farbe}}
.frei{position:absolute;left:600px;right:600px;top:3380px;height:500px;border:18px dashed #9a9a9a;border-radius:60px;
  display:${vorschau ? 'flex' : 'none'};align-items:center;justify-content:center;font:600 150px F;color:#9a9a9a}
</style></head><body><div class="w"><div class="fig">${svg}</div><div class="t">Mein Wichtel heißt</div><div class="frei">Platz für den Namen</div></div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 4000, height: 4000 } });
  for (const [f, v, out] of [['#c62828', null, 'logo-wichtel-heisst-frei.png'], ['#ffffff', null, 'logo-wichtel-heisst-frei-fuer-dunkle-stoffe.png'],
    ['#c62828', '#ffffff', 'vorschau-logo-frei-hell.png'], ['#ffffff', '#1d2b24', 'vorschau-logo-frei-dunkel.png']]) {
    await p.setContent(html(f, v)); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(SERIE, out), omitBackground: !v });
  }
  await b.close(); console.log('fertig');
})();
