// Bearbeitet Tonis WhatsApp-Bildschirmfotos: private Kontakte/Namen weg, „Anna“ + neue Nachricht (06.11.)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const bg = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'toni', f)).toString('base64');
const F = "font-family:Roboto,'Segoe UI',system-ui,sans-serif;";
const av = (ch, col, x, y, s = 126) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;border-radius:50%;background:${col};color:#fff;display:flex;align-items:center;justify-content:center;font:600 ${s * 0.45}px Roboto,'Segoe UI',sans-serif">${ch}</div>`;
const box = (x, y, w, h, c, extra = '') => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${c};${extra}"></div>`;
const LINK = 'https://wichtellos.de/#w=RMdQOkiMRXAKkxA1T4oZNSCBQCARzBFoEoAQNUyKGTVU20BhEZQRcByAUjUSinV_VNtAfhGUEQpagEE';
const MSG = 'Hallo Anna! 🎁 Hier ist dein geheimer Wichtel-Link für „Büro-Wichteln“:';
const seiten = {
  // 1) Kontakt auswählen
  'w1-kontakt': ['Screenshot_20261106_175601_WhatsApp.jpg', `
    ${box(0, 280, 1080, 1750, '#0b1014')}
    <div style="position:absolute;left:52px;top:330px;${F}font-size:42px;color:#8696a0">Häufig kontaktiert</div>
    ${[['Wichtel-Gruppe Büro', 'Anna, Ben, Clara, David, Emma, Finn', '👥', '#3a7d5c'], ['Ben', 'Bis morgen! 👋', 'B', '#5b6bbf']].map(([n, s, c, col], i) => `
      ${av(c, col, 52, 420 + i * 205)}<div style="position:absolute;left:232px;top:${430 + i * 205}px;${F}font-size:56px;color:#e9edef">${n}</div>
      <div style="position:absolute;left:232px;top:${510 + i * 205}px;${F}font-size:44px;color:#8696a0">${s}</div>`).join('')}
    <div style="position:absolute;left:52px;top:880px;${F}font-size:42px;color:#8696a0">Letzte Chats</div>
    ${box(0, 1025, 1080, 203, '#103629')}
    ${av('A', '#c2185b', 52, 1063)}<div style="position:absolute;left:135px;top:1130px;width:66px;height:66px;border-radius:50%;background:#25d366;border:6px solid #103629;color:#0b1014;display:flex;align-items:center;justify-content:center;font:700 40px sans-serif">✓</div>
    <div style="position:absolute;left:232px;top:1095px;${F}font-size:58px;color:#e9edef">Anna</div>
    ${[['Clara', 'Danke dir! 😊', 'C', '#e07b39'], ['David', 'Okay, bis Freitag', 'D', '#00897b'], ['Emma', 'Haha 😂', 'E', '#8e24aa']].map(([n, s, c, col], i) => `
      ${av(c, col, 52, 1268 + i * 205)}<div style="position:absolute;left:232px;top:${1278 + i * 205}px;${F}font-size:56px;color:#e9edef">${n}</div>
      <div style="position:absolute;left:232px;top:${1358 + i * 205}px;${F}font-size:44px;color:#8696a0">${s}</div>`).join('')}
    ${box(40, 2030, 840, 120, '#13181c')}
    <div style="position:absolute;left:52px;top:2048px;${F}font-size:54px;color:#e9edef">Anna</div>`],
  // 2) Nachricht mit Link-Vorschau, noch nicht gesendet
  'w2-schreiben': ['Screenshot_20261106_175612_WhatsApp.jpg', `
    ${box(160, 110, 640, 160, '#0b1014')}${av('A', '#c2185b', 168, 128, 112)}
    <div style="position:absolute;left:320px;top:150px;${F}font-size:58px;color:#e9edef">Anna</div>
    ${box(0, 275, 1080, 745, 'rgba(11,16,20,.96)', 'backdrop-filter:blur(30px)')}
    ${box(170, 1400, 690, 760, '#1f272a')}
    <div style="position:absolute;left:180px;top:1408px;width:670px;${F}font-size:60px;line-height:1.25;color:#e9edef;overflow:hidden;height:750px;word-break:break-all"><span style="word-break:normal">${MSG}</span> ${LINK}</div>`],
  // 3) Gesendet
  'w3-gesendet': ['Screenshot_20261106_175755_WhatsApp.jpg', `
    ${box(160, 110, 640, 160, '#0b1014')}${av('A', '#c2185b', 168, 128, 112)}
    <div style="position:absolute;left:320px;top:150px;${F}font-size:58px;color:#e9edef">Anna</div>
    ${box(0, 275, 1080, 245, '#0b1014')}${box(150, 1185, 110, 130, '#0b1014')}
    ${box(290, 1335, 730, 470, '#134d37')}
    <div style="position:absolute;left:298px;top:1345px;width:715px;${F}font-size:56px;line-height:1.28;color:#e9edef">${MSG}<br><span style="color:#28bc64;text-decoration:underline;word-break:break-all;font-size:52px">${LINK.slice(0, 78)}</span></div>`],
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 2340 } });
  for (const [n, [f, ov]] of Object.entries(seiten)) {
    await p.setContent(`<html><body style="margin:0;width:1080px;height:2340px;position:relative;overflow:hidden;background:url(${bg(f)}) 0 0/1080px 2340px">${ov}</body></html>`);
    await p.screenshot({ path: path.join(__dirname, 'frames', n + '.png') });
  }
  await b.close(); console.log('ok');
})();
