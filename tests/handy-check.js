// Handy-Prüfung aller Sitemap-Seiten (Toni 09.11.: „alle Seiten handyfreundlich?“).
// Prüft bei 360 und 390 px Breite: seitliches Wischen (Seite breiter als Bildschirm), Elemente rechts über den Rand,
// Schrift unter 12 px, zu kleine Tippflächen bei Knöpfen (< 40 px hoch, Links im Fließtext ausgenommen).
// Server vorher: cd website && python -m http.server 8766
// node tests/handy-check.js [BASE]   -> Bericht in der Konsole, Bildschirmfotos (390 px, ganze Seite) nach tests/handy/
const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');
const BASE = (process.argv[2] || 'http://localhost:8766').replace(/\/$/, '');
const OUT = path.join(__dirname, 'handy');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const sm = fs.readFileSync(path.join(__dirname, '..', 'website', 'sitemap.xml'), 'utf8');
  const urls = [...sm.matchAll(/<loc>https:\/\/wichtellos\.de([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
  const b = await chromium.launch();
  let fehler = 0;
  for (const breite of [360, 390]) {
    const ctx = await b.newContext({ ...devices['iPhone 13'], viewport: { width: breite, height: 780 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    for (const u of urls) {
      await p.goto(BASE + u, { waitUntil: 'networkidle' });
      await p.waitForTimeout(150);
      const r = await p.evaluate(() => {
        const W = innerWidth, out = { breit: document.documentElement.scrollWidth - W, rand: [], klein: [], tippen: [] };
        const sichtbar = (e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
        const inScroller = (e) => { for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (/(auto|scroll|hidden)/.test(s.overflowX)) return true; } return false; };
        const name = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : '');
        const txt = (e) => (e.innerText || e.alt || '').trim().replace(/\s+/g, ' ').slice(0, 40);
        for (const e of document.body.querySelectorAll('*')) {
          if (!sichtbar(e) || e.closest('[hidden],.ad-slot,#search-panel,dialog:not([open])')) continue;
          const r = e.getBoundingClientRect();
          if (r.right > W + 1 && !inScroller(e)) out.rand.push(`${name(e)} „${txt(e)}“ +${Math.round(r.right - W)}px`);
          if (e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
            const fs = parseFloat(getComputedStyle(e).fontSize);
            if (fs < 12) out.klein.push(`${name(e)} ${fs}px „${txt(e)}“`);
          }
          if (e.matches('button, a.btn, a.btn-secondary, .btn, input[type=button], input[type=submit], select, nav a, footer a, .chip, [role=tab]') &&
              !e.closest('p, li p, td') && r.height < 40) out.tippen.push(`${name(e)} ${Math.round(r.width)}×${Math.round(r.height)} „${txt(e)}“`);
        }
        out.rand = [...new Set(out.rand)].slice(0, 6); out.klein = [...new Set(out.klein)].slice(0, 6); out.tippen = [...new Set(out.tippen)].slice(0, 8);
        return out;
      });
      const probleme = [];
      if (r.breit > 1) probleme.push(`Seite ${r.breit}px zu breit (seitliches Wischen)`);
      if (r.rand.length) probleme.push('über den Rand: ' + r.rand.join(' | '));
      if (r.klein.length) probleme.push('Schrift < 12px: ' + r.klein.join(' | '));
      if (r.tippen.length) probleme.push('Tippfläche < 40px: ' + r.tippen.join(' | '));
      if (probleme.length) { fehler += probleme.length; console.log(`\n[${breite}] ${u}\n  - ` + probleme.join('\n  - ')); }
      if (breite === 390) await p.screenshot({ path: path.join(OUT, (u.replace(/\//g, '_') || '_') + '.jpg'), fullPage: true, type: 'jpeg', quality: 60 });
    }
    await ctx.close();
  }
  await b.close();
  console.log(`\n${urls.length} Seiten × 2 Breiten geprüft, ${fehler} Auffälligkeiten. Bilder: ${OUT}`);
})();
