// TikTok (Toni 06.11.): gesprochener Text Wort für Wort, dick – Bilder texte/w-N-K.png aus woerter.json (python woerter.py)
const fs = require('fs'), path = require('path'); const { chromium } = require('G:/wichtellos/node_modules/playwright');
const ROOT = path.join(__dirname, '..', '..', '..');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const J = JSON.parse(fs.readFileSync(path.join(__dirname, 'woerter.json'), 'utf8'));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 300 } });
  for (const [n, s] of J.entries()) for (const [k, [w]] of s.woerter.entries()) {
    const fs_ = w.length > 11 ? 116 : w.length > 8 ? 136 : 160;
    await p.setContent(`<style>@font-face{font-family:F;src:url(${font})}body{margin:0;width:1080px;height:300px;display:flex;align-items:center;justify-content:center;background:transparent}
    h1{margin:0;font:600 ${fs_}px F,sans-serif;color:#fff;-webkit-text-stroke:16px #2b1b17;paint-order:stroke fill;text-shadow:0 10px 30px rgba(0,0,0,.5);white-space:nowrap}</style><h1>${w}</h1>`);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(__dirname, 'texte', `w-${n}-${k}.png`), omitBackground: true });
  }
  await b.close(); console.log('woerter ok');
})();
