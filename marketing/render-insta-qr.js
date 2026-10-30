// QR-Code für instagram.com/wichtellos im WichtelLos-Stil (1080x1350, Hochformat für Story/Ausdruck)
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { chromium } = require('playwright');
(async () => {
  const qr = await QRCode.toString('https://www.instagram.com/wichtellos/', { type: 'svg', margin: 1, color: { dark: '#2b1b17', light: '#ffffff' } });
  const w = fs.readFileSync(path.join(__dirname, '..', 'grafik', 'wichtel-winkt.svg'), 'utf8');
  const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;width:1080px;height:1350px;background:#fff8f0;font-family:'Segoe UI',system-ui,sans-serif;color:#2b1b17;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative}
  body::before{content:'';position:absolute;top:0;left:0;right:0;height:22px;background:linear-gradient(90deg,#c62828 0 33.3%,#f2b705 33.3% 66.6%,#1f6f4a 66.6%)}
  .w svg{width:230px;height:auto} h1{font-size:76px;margin:16px 0 6px} p{font-size:42px;margin:0 0 40px;color:#6d5d57}
  .qr{background:#fff;border-radius:40px;padding:36px;box-shadow:0 10px 40px rgba(0,0,0,.08);border-top:8px solid #f2b705}.qr svg{width:560px;height:560px;display:block}
  .h{font-size:64px;font-weight:800;color:#c62828;margin-top:40px}</style>
  <div class="w">${w}</div><h1>Folge dem Wichtel!</h1><p>Geschenkideen & Wichtel-Tipps</p><div class="qr">${qr}</div><div class="h">@wichtellos</div>`;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.setContent(html); await p.screenshot({ path: path.join(__dirname, 'qr-instagram-wichtellos.png') }); await b.close();
  console.log('fertig');
})();
