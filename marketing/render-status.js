// Erzeugt QR-Code und WhatsApp-Status-Bild (1080x1920) für wichtellos.de
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { chromium } = require('playwright');
const OUT = __dirname;
const URL = 'https://wichtellos.de';
(async () => {
  await QRCode.toFile(path.join(OUT, 'qr-wichtellos.png'), URL, { width: 1000, margin: 2, color: { dark: '#2b1b17', light: '#ffffff' } });
  const qr = await QRCode.toString(URL, { type: 'svg', margin: 1, color: { dark: '#2b1b17', light: '#ffffff' } });
  const wichtel = fs.readFileSync(path.join(OUT, '..', 'wichtel.svg'), 'utf8');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;width:1080px;height:1920px;background:#fff8f0;font-family:'Segoe UI',system-ui,sans-serif;color:#2b1b17;
       display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  .w svg{width:260px;height:auto}
  h1{font-size:96px;line-height:1.05;margin:30px 60px 20px}
  p{font-size:46px;margin:0 80px 50px;color:#6d5d57}
  .qr{background:#fff;border-radius:40px;padding:40px;box-shadow:0 10px 40px rgba(0,0,0,.08)}
  .qr svg{width:520px;height:520px;display:block}
  .url{font-size:72px;font-weight:800;color:#c62828;margin-top:50px}
  .tag{font-size:40px;margin-top:20px;color:#1f6f4a;font-weight:700}
  </style></head><body>
  <div class="w">${wichtel}</div>
  <h1>Wichteln dieses Jahr? 🎁</h1>
  <p>Gruppe in 1 Minute auslosen – jeder bekommt seinen geheimen Link per WhatsApp.</p>
  <div class="qr">${qr}</div>
  <div class="url">wichtellos.de</div>
  <div class="tag">kostenlos · ohne Anmeldung</div>
  </body></html>`;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html);
  await p.screenshot({ path: path.join(OUT, 'whatsapp-status.png') });
  await b.close();
  console.log('fertig');
})();
