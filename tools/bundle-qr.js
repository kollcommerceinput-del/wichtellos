// Packt den QR-Kern (npm „qrcode“, MIT) + „dijkstrajs“ (MIT) in assets/qrcode.js für den Browser.
// Aufruf: node tools/bundle-qr.js  – erzeugt window.WichtelQR.svg(text) -> SVG-String (lokal, ohne Netzwerk)
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const NM = path.join(ROOT, 'node_modules');
const LIB = path.join(NM, 'qrcode', 'lib');

const mods = new Map(); // absoluter Pfad -> id
const order = [];
function resolve(from, req) {
  if (req === 'dijkstrajs') return path.join(NM, 'dijkstrajs', 'dijkstra.js');
  let p = path.resolve(path.dirname(from), req);
  if (!p.endsWith('.js')) p += '.js';
  return p;
}
function add(file) {
  if (mods.has(file)) return mods.get(file);
  const id = mods.size;
  mods.set(file, id);
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/require\('([^']+)'\)/g, (m, req) => `__req(${add(resolve(file, req))})`);
  order[id] = { file: path.relative(NM, file).replace(/\\/g, '/'), src };
  return id;
}
const core = add(path.join(LIB, 'core', 'qrcode.js'));
const svg = add(path.join(LIB, 'renderer', 'svg-tag.js'));

const lic = (p) => fs.readFileSync(path.join(NM, p), 'utf8').trim();
const out = `/*! Gebündelt aus npm „qrcode“ 1.5 (MIT, Ryan Day) und „dijkstrajs“ (MIT) – siehe Lizenzen unten.
${lic('qrcode/license').replace(/\*\//g, '* /')}
---
${lic('dijkstrajs/LICENSE.md').replace(/\*\//g, '* /')}
*/
(function () {
  'use strict';
  var defs = [
${order.map((m) => `  /* ${m.file} */ function (module, exports, __req) {\n${m.src}\n  }`).join(',\n')}
  ];
  var cache = {};
  function __req(id) {
    if (cache[id]) return cache[id].exports;
    var module = cache[id] = { exports: {} };
    defs[id](module, module.exports, __req);
    return module.exports;
  }
  var QR = __req(${core}), SVG = __req(${svg});
  window.WichtelQR = {
    svg: function (text) {
      return SVG.render(QR.create(text, { errorCorrectionLevel: 'M' }), { margin: 2, color: { dark: '#2b1b17ff', light: '#ffffffff' } });
    }
  };
})();
`;
fs.writeFileSync(path.join(ROOT, 'assets', 'qrcode.js'), out);
console.log('assets/qrcode.js', Math.round(out.length / 1024) + ' KB,', order.length, 'Module');
