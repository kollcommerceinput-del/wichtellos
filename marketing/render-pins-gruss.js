// Pinterest-Pin (1000x1500) für /wichtelgruss/: zwei echte Karten aus dem Generator, schräg übereinander.
// Braucht den lokalen Server: cd website && python -m http.server 8766. Ausgabe marketing/pins-onni/pin-wichtelgruss.png
// Beim Hochladen als KI-Inhalt kennzeichnen (Onni-Sticker).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  await p.goto('http://localhost:8766/wichtelgruss/');
  await p.waitForTimeout(800);
  const card = async (occ, theme, an) => {
    await p.evaluate(([o, t, a]) => {
      document.querySelectorAll('.gr-occ')[o].click();
      document.querySelectorAll('.gr-theme')[t].click();
      const i = document.querySelector('#gr-a'); i.value = a; i.dispatchEvent(new Event('input'));
    }, [occ, theme, an]);
    await p.waitForTimeout(600);
    return p.evaluate(() => document.querySelector('#gr-canvas').toDataURL('image/png'));
  };
  const c1 = await card(0, 0, 'Lena');
  const c2 = await card(6, 1, '');
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1000px;height:1500px;background:#fff8f0;color:#2b1b17;font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;position:relative;text-align:center}
.top{position:absolute;top:60px;left:50px;right:50px}
h1{font-family:Fredoka,sans-serif;font-weight:600;font-size:96px;line-height:1.02;margin:0;color:#c62828}
p{font-size:42px;line-height:1.3;margin:22px 0 0;color:#6d5d57}
.c{position:absolute;width:445px;border-radius:24px;box-shadow:0 18px 40px rgba(43,27,23,.28)}
.c1{left:38px;top:450px;transform:rotate(-5deg)}
.c2{right:38px;top:540px;transform:rotate(4deg)}
.foot{position:absolute;bottom:0;left:0;right:0;background:#c62828;color:#fff;padding:36px 40px 42px}
.url{font-family:Fredoka,sans-serif;font-size:62px}
.tag{font-size:32px;opacity:.9;margin-top:6px}
</style></head><body>
<div class="top"><h1>Wichtelgruß per WhatsApp</h1><p>Digitale Karte gestalten &amp; verschicken – kostenlos</p></div>
<img class="c c1" src="${c1}"><img class="c c2" src="${c2}">
<div class="foot"><div class="url">wichtellos.de</div><div class="tag">Gruß erstellen →</div></div>
</body></html>`;
  const q = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  await q.setContent(html);
  await q.evaluate(() => document.fonts.ready);
  const out = path.join(__dirname, 'pins-onni', 'pin-wichtelgruss.png');
  await q.screenshot({ path: out });
  await b.close();
  console.log(out);
})();
