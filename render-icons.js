// Erzeugt Favicon-PNGs (48/96/192/512) und favicon.ico (16/32/48) aus favicon.svg
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const svg = fs.readFileSync(path.join(__dirname, 'favicon.svg'), 'utf8');

function ico(pngs) { // ICO mit eingebetteten PNGs
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let off = head.length;
  pngs.forEach(({ size, buf }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size >= 256 ? 0 : size, e); head.writeUInt8(size >= 256 ? 0 : size, e + 1);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(buf.length, e + 8); head.writeUInt32LE(off, e + 12);
    off += buf.length;
  });
  return Buffer.concat([head, ...pngs.map((p) => p.buf)]);
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const shot = async (size, pad = 0, bg = 'transparent') => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(`<body style="margin:0;background:${bg}"><div style="width:${size}px;height:${size}px;box-sizing:border-box;padding:${pad}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div></body>`);
    return p.screenshot({ omitBackground: bg === 'transparent' });
  };
  for (const s of [48, 96]) fs.writeFileSync(path.join(__dirname, `favicon-${s}.png`), await shot(s));
  // Android-Symbole: etwas Rand und heller Hintergrund, damit nichts abgeschnitten wird
  for (const s of [192, 512]) fs.writeFileSync(path.join(__dirname, `icon-${s}.png`), await shot(s, Math.round(s * 0.12), '#fff8f0'));
  const parts = [];
  for (const s of [16, 32, 48]) parts.push({ size: s, buf: await shot(s) });
  fs.writeFileSync(path.join(__dirname, 'favicon.ico'), ico(parts));
  await b.close();
  console.log('fertig: favicon-48/96.png, icon-192/512.png, favicon.ico');
})();
