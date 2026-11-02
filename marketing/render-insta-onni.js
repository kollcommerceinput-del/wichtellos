// Instagram mit Onni (02.11.):
//   marketing/social/kinder/story-NN.png  1080x1920  Story-Folien fürs Highlight „Für Kinder“ (aus den Onni-Pins, ohne roten Fuß;
//                                         unten Platz für den Link-Sticker)
//   marketing/social/highlights-onni/cover-<name>.png 1080x1080  Highlight-Titelbilder (Onni-Sticker auf farbigem Kreis; in der App setzen)
// Vorher: node marketing/render-pins-onni.js   Dann: node marketing/render-insta-onni.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

// [Pin, Link-Hinweis]
const STORIES = [
  ['ausmalbilder', 'Ausmalbilder gratis'],
  ['sticker', 'Sticker gratis'],
  ['wichtelnamen', 'Namen-Generator'],
  ['tuer-vorlagen', 'Vorlagen gratis'],
];

const COVERS = [
  ['so-gehts', 'winkt', '#c62828'],
  ['geschenke', 'geschenk', '#1f6f4a'],
  ['lose', 'jubel', '#f2b705'],
  ['wichteltuer', 'schlaeft', '#1f6f4a'],
  ['kinder', 'herz', '#c62828'],
];

const story = (pin, hint) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
body{margin:0;width:1080px;height:1920px;background:#fff8f0;overflow:hidden;position:relative;font-family:Fredoka,sans-serif;text-align:center}
.pin{position:absolute;top:150px;left:0;width:1080px;height:1392px;background:url(${b64(path.join(__dirname, 'pins-onni', `pin-${pin}.png`))}) top left / 1080px auto no-repeat}
.hint{position:absolute;top:1600px;left:0;right:0;font-size:46px;color:#c62828}
.brand{position:absolute;top:70px;left:0;right:0;font-size:44px;color:#2b1b17}.brand b{color:#c62828;font-weight:600}
</style></head><body><div class="brand">Wichtel<b>Los</b> · für Kinder</div><div class="pin"></div><div class="hint">${hint} – Link antippen 👇</div></body></html>`;

const cover = (st, col) => `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1080px;height:1080px;background:${col};display:flex;align-items:center;justify-content:center;overflow:hidden}
body::before{content:'';position:absolute;width:860px;height:860px;border-radius:50%;background:#fff8f0}
img{position:relative;width:760px;filter:drop-shadow(0 16px 20px rgba(0,0,0,.25))}
</style></head><body><img src="${b64(path.join(__dirname, 'onni', `sticker-${st}.png`))}"></body></html>`;

(async () => {
  const outS = path.join(__dirname, 'social', 'kinder');
  const outC = path.join(__dirname, 'social', 'highlights-onni');
  fs.mkdirSync(outS, { recursive: true });
  fs.mkdirSync(outC, { recursive: true });
  const b = await chromium.launch();
  let p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [i, [pin, hint]] of STORIES.entries()) {
    await p.setContent(story(pin, hint), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(outS, `story-${String(i + 1).padStart(2, '0')}.png`) });
  }
  p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  for (const [name, st, col] of COVERS) {
    await p.setContent(cover(st, col), { waitUntil: 'load' });
    await p.screenshot({ path: path.join(outC, `cover-${name}.png`) });
  }
  await b.close();
  console.log(`${STORIES.length} Storys + ${COVERS.length} Titelbilder`);
})();
