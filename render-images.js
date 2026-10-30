const { chromium } = require('playwright');
const fs = require('fs');
const B = process.argv[2];
const svg = fs.readFileSync(`${B}/favicon.svg`, 'utf8');
const gnome = fs.readFileSync(`${B}/wichtel.svg`, 'utf8');
const og = `<!doctype html><html><body style="margin:0">
<div style="width:1200px;height:630px;box-sizing:border-box;padding:70px 80px;background:linear-gradient(135deg,#c62828,#8e1b1b);color:#fff;font-family:system-ui,'Segoe UI',Roboto,sans-serif;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden">
  <div style="display:flex;align-items:center;gap:18px;font-size:44px;font-weight:800">
    <div style="width:84px;height:84px;background:#fff;border-radius:20px;display:flex;align-items:center;justify-content:center">${svg.replace('<svg ', '<svg width="64" height="64" ')}</div>
    <span>Wichtel<span style="color:#f2b705">Los</span></span>
  </div>
  <div>
    <div style="font-size:84px;font-weight:900;line-height:1.02;letter-spacing:-1px">Wichteln online<br>auslosen</div>
    <div style="font-size:36px;margin-top:22px;opacity:.95">Kostenlos · ohne Anmeldung · per WhatsApp</div>
  </div>
  <div style="font-size:30px;font-weight:700;color:#f2b705">wichtellos.de</div>
  <div style="position:absolute;right:70px;bottom:40px;width:330px;height:420px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.22),rgba(255,255,255,0))"></div>
  <div style="position:absolute;right:90px;bottom:50px">${gnome.replace('<svg ', '<svg width="300" height="380" ')}</div>
</div></body></html>`;
const touch = `<!doctype html><html><body style="margin:0"><div style="width:180px;height:180px;background:#fff8f0;display:flex;align-items:center;justify-content:center">${svg.replace('<svg ', '<svg width="140" height="140" ')}</div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(og); await p.screenshot({ path: `${B}/og-image.png` });
  await p.setViewportSize({ width: 180, height: 180 });
  await p.setContent(touch); await p.screenshot({ path: `${B}/apple-touch-icon.png` });
  await b.close();
})();
