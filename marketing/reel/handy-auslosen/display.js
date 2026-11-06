// Macht aus einem Bildschirmfoto (shots/*.png) ein echtes Handy-Display: Statusleiste + Browser-Adresszeile „wichtellos.de“, runde Ecken.
// node display.js 3-namen   -> display/3-namen.png (1170x2532)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const names = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(path.join(__dirname, 'shots')).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4));
(async () => {
  fs.mkdirSync(path.join(__dirname, 'display'), { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  for (const n of names) {
    const img = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'shots', n + '.png')).toString('base64');
    await p.setContent(`<html><body style="margin:0;width:390px;height:844px;overflow:hidden;background:#000;font-family:-apple-system,'Segoe UI',system-ui,sans-serif">
<div style="position:absolute;inset:0;border-radius:46px;overflow:hidden;background:#fff">
 <div style="height:47px;display:flex;align-items:flex-end;justify-content:space-between;padding:0 30px 8px 36px;font-weight:600;font-size:16px;color:#111;background:#f7f2ee">
  <span>9:41</span><span style="display:flex;gap:6px;align-items:center">
   <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="6" rx="1"/><rect x="10" y="2.5" width="3" height="8.5" rx="1"/><rect x="15" y="0" width="3" height="11" rx="1"/></svg>
   <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.2A10 10 0 0 0 8 .5 10 10 0 0 0 .8 3.4L2 4.6a8.4 8.4 0 0 1 6-2.4zm0 3.3c1.4 0 2.6.5 3.6 1.4l1.2-1.2a6.8 6.8 0 0 0-9.6 0l1.2 1.2c1-.9 2.2-1.4 3.6-1.4zm0 3.3c.5 0 1 .2 1.3.5L8 10.6 6.7 9.3c.3-.3.8-.5 1.3-.5z"/></svg>
   <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="#111" opacity=".4"/><rect x="2" y="2" width="18" height="9" rx="2"/><rect x="24.5" y="4.5" width="1.6" height="4" rx=".8" opacity=".4"/></svg></span></div>
 <div style="height:44px;background:#f7f2ee;display:flex;align-items:center;padding:0 12px;border-bottom:1px solid #e5ddd7">
  <div style="flex:1;height:34px;border-radius:17px;background:#ebe4df;display:flex;align-items:center;justify-content:center;gap:6px;font-size:15px;color:#333">🔒 wichtellos.de</div></div>
 <img src="${img}" style="display:block;width:390px">
 <div style="position:absolute;bottom:8px;left:50%;margin-left:-67px;width:134px;height:5px;border-radius:3px;background:#111"></div>
</div></body></html>`);
    await p.screenshot({ path: path.join(__dirname, 'display', n + '.png'), omitBackground: true });
  }
  await b.close(); console.log('fertig:', names.join(', '));
})();
