// Erzeugt das LinkedIn-Bild (1200x627) fürs Büro-Wichteln
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const OUT = __dirname;
(async () => {
  const wichtel = fs.readFileSync(path.join(OUT, '..', 'wichtel.svg'), 'utf8');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;width:1200px;height:627px;background:#fff8f0;font-family:'Segoe UI',system-ui,sans-serif;color:#2b1b17;
       display:flex;align-items:center;gap:50px;padding:0 80px;box-sizing:border-box}
  .w svg{width:230px;height:auto}
  h1{font-size:64px;line-height:1.05;margin:0 0 22px}
  ul{list-style:none;padding:0;margin:0 0 28px;font-size:32px;color:#6d5d57}
  li{margin:8px 0} li::before{content:'✓ ';color:#1f6f4a;font-weight:800}
  .url{display:inline-block;background:#c62828;color:#fff;font-size:40px;font-weight:800;padding:14px 30px;border-radius:14px}
  </style></head><body>
  <div class="w">${wichtel}</div>
  <div>
    <h1>Büro-Wichteln in<br>1 Minute ausgelost</h1>
    <ul><li>bis zu 60 Kolleginnen und Kollegen</li><li>geheimer Link per WhatsApp oder E-Mail</li><li>auch fürs Homeoffice · ohne Anmeldung</li></ul>
    <span class="url">wichtellos.de</span>
  </div>
  </body></html>`;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 627 } });
  await p.setContent(html);
  await p.screenshot({ path: path.join(OUT, 'linkedin-buero-wichteln.png') });
  await b.close();
  console.log('fertig');
})();
