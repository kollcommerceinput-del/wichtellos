// Ersetzt KI-Kauderwelsch auf Tonis Handybild: gelber Hinweis → deutscher Verschlüsselungs-Hinweis, „TODAY!“ → „HEUTE“
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(__dirname, '../../../node_modules/playwright'));
const img = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'handy-gross-original.jpg')).toString('base64');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 960, height: 1098 } });
  await p.setContent(`<body style="margin:0"><div style="position:relative;width:960px;height:1098px;background:url(${img})">
   <div style="position:absolute;left:383px;top:316px;width:244px;height:76px;background:#f7efc4;border-radius:9px;filter:blur(.4px);
     display:flex;align-items:center;justify-content:center;text-align:center;font:500 13.5px/1.3 'Segoe UI',Arial;color:#6b6450;padding:0 10px;box-sizing:border-box">
     🔒 Nachrichten und Anrufe sind Ende-zu-Ende-verschlüsselt.</div>
   <div style="position:absolute;left:446px;top:283px;width:76px;height:26px;background:#d7ecf2;border-radius:7px;filter:blur(.4px);
     display:flex;align-items:center;justify-content:center;font:600 12.5px 'Segoe UI',Arial;color:#55626a">HEUTE</div>
  </div></body>`);
  await p.screenshot({ path: path.join(__dirname, 'handy-gross.jpg'), type: 'jpeg', quality: 95 });
  await b.close();
})();
