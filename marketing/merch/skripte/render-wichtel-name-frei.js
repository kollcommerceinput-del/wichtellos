// „Mein Wichtel heißt …“ mit freier Fläche für den Namen (Kunde ergänzt im Spreadshop-Design-Tool), Toni 11.11.
// Wichtel aus mein-wichtel-heisst-onni(.png / -fuer-dunkle-stoffe.png), Schrift Fredoka 600
// node marketing/merch/skripte/render-wichtel-name-frei.js -> onni-serie/mein-wichtel-heisst-frei(-fuer-dunkle-stoffe).png + vorschau-name-frei.png
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const R = path.join(__dirname, '..', '..', '..');
const SERIE = path.join(R, 'marketing', 'merch', 'onni-serie');
const b64 = (f, t) => `data:${t};base64,` + fs.readFileSync(f).toString('base64');
const font = b64(path.join(R, 'assets/fonts/fredoka-latin-600-normal.woff2'), 'font/woff2');

const html = (quelle, farbe, vorschau) => `<html><head><style>
@font-face{font-family:F;src:url(${font})}
html,body{margin:0;background:${vorschau ? vorschau : 'transparent'}}
.w{position:relative;width:4000px;height:4000px;overflow:hidden}
.wichtel{position:absolute;left:0;top:0;width:4000px;height:2880px;background:url(${quelle}) no-repeat 0 0/4000px 4000px}
.t{position:absolute;left:0;right:0;top:2960px;text-align:center;font:600 330px/1 F;color:${farbe}}
.frei{position:absolute;left:600px;right:600px;top:3400px;height:500px;border:18px dashed #9a9a9a;border-radius:60px;
  display:${vorschau ? 'flex' : 'none'};align-items:center;justify-content:center;font:600 150px F;color:#9a9a9a}
</style></head><body><div class="w"><div class="wichtel"></div><div class="t">Mein Wichtel heißt</div>
<div class="frei">Platz für den Namen</div></div></body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 4000, height: 4000 } });
  const hell = b64(path.join(SERIE, 'mein-wichtel-heisst-onni.png'), 'image/png');
  const dunkel = b64(path.join(SERIE, 'mein-wichtel-heisst-onni-fuer-dunkle-stoffe.png'), 'image/png');
  const jobs = [
    [hell, '#2b1b17', null, 'mein-wichtel-heisst-frei.png'],
    [dunkel, '#ffffff', null, 'mein-wichtel-heisst-frei-fuer-dunkle-stoffe.png'],
    [hell, '#2b1b17', '#ffffff', 'vorschau-name-frei-hell.png'],
    [dunkel, '#ffffff', '#1d2b24', 'vorschau-name-frei-dunkel.png'],
  ];
  for (const [q, f, v, out] of jobs) {
    await p.setContent(html(q, f, v));
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(SERIE, out), omitBackground: !v });
  }
  await b.close();
  console.log('fertig');
})();
