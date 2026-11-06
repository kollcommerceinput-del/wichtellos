// Erklärtexte + Abspann als PNG (Fredoka), für render.py
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..', '..');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const onni = 'data:image/webp;base64,' + fs.readFileSync(path.join(ROOT, 'fotos/wichtel3d-geschenk-tisch-800.webp')).toString('base64');
const T = ['Wichteln per WhatsApp?<br>So geht’s 👇', 'Gruppe & Budget<br>eintragen', 'Alle Namen rein –<br>auf Wunsch mit 💡 Tipp', 'Antippen –<br>fertig ausgelost 🎲',
  'Jeder bekommt seinen<br>eigenen Link', 'Per WhatsApp<br>an Anna schicken', 'Anna bekommt ihren<br>geheimen Link 🔒', 'Anna tippt drauf …', '… und nur sie sieht,<br>wen sie beschenkt 🤫'];
(async () => {
  fs.mkdirSync(path.join(__dirname, 'texte'), { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 330 } });
  const css = `@font-face{font-family:F;src:url(${font})}body{margin:0;width:1080px;height:330px;display:flex;align-items:center;justify-content:center;background:transparent}
  h1{margin:0;font:600 76px/1.12 F,'Segoe UI Emoji',sans-serif;color:#2b1b17;text-align:center}`;
  for (const [i, t] of T.entries()) { await p.setContent(`<style>${css}</style><h1>${t}</h1>`); await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: path.join(__dirname, 'texte', `t${i}.png`), omitBackground: true }); }
  const e = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await e.setContent(`<style>@font-face{font-family:F;src:url(${font})}body{margin:0;width:1080px;height:1920px;background:#c62828;color:#fff;font-family:'Segoe UI',sans-serif;text-align:center;overflow:hidden}
  .o{width:560px;height:840px;object-fit:cover;border-radius:40px;margin-top:150px;box-shadow:0 20px 60px rgba(0,0,0,.35)}h1{font:600 120px F,sans-serif;margin:60px 0 10px}p{font-size:52px;margin:0;opacity:.95;line-height:1.4}
  .k{font-size:28px;opacity:.75;margin-top:70px}</style><img class="o" src="${onni}"><h1>wichtellos.de</h1><p>Wichteln online auslosen<br>kostenlos · ohne Anmeldung</p><p class="k">Bilder: KI-generiert</p>`);
  await e.evaluate(() => document.fonts.ready); await e.screenshot({ path: path.join(__dirname, 'texte', 'ende.png') });
  // TikTok-Fassung: zusätzlich Bitte um Like/Kommentar (Toni 06.11.)
  await e.evaluate(() => { const k = document.querySelector('.k'); const d = document.createElement('div');
    d.style.cssText = "display:inline-block;margin-top:44px;background:#fff;color:#c62828;border-radius:60px;padding:22px 54px;font:600 58px F,'Segoe UI Emoji',sans-serif";
    d.textContent = '👍 Like oder 💬 Kommentar'; k.before(d); k.style.marginTop = '40px'; });
  await e.screenshot({ path: path.join(__dirname, 'texte', 'ende-tiktok.png') });
  await b.close(); console.log('texte ok');
})();
