// Rubbellos-Schicht (Geschenke-Generator + /rubbellos/): goldene Fläche über einem Element, mit Finger/Maus freirubbeln.
// window.Rubbel.decke(el, {text, onReveal}) – legt die Schicht über el; .aufdecken() deckt sofort auf.
// window.Rubbel.konfetti() – kleines Konfetti (nicht bei „weniger Bewegung“).
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function decke(el, opt = {}) {
    el.classList.add('rubbel-wrap');
    const cv = document.createElement('canvas');
    cv.className = 'rubbel-schicht';
    cv.setAttribute('role', 'button');
    cv.setAttribute('tabindex', '0');
    cv.setAttribute('aria-label', (opt.text || 'Rubbel mich frei!') + ' – Enter deckt auf');
    el.append(cv);
    const ctx = cv.getContext('2d');
    let w = 0, h = 0, dpr = 1, offen = false, zaehler = 0, letzt = null;

    const male = () => {
      const r = el.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.max(1, Math.round(w * dpr)); cv.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#e9c46a'); g.addColorStop(0.45, '#f6e3a1'); g.addColorStop(0.55, '#d4a531'); g.addColorStop(1, '#f2c94c');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      // feine Glitzerpunkte
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      for (let i = 0; i < (w * h) / 900; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
      ctx.fillStyle = '#7a4d00';
      ctx.font = `700 ${Math.max(16, Math.min(24, w / 12))}px Fredoka, system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🎟️ ' + (opt.text || 'Rubbel mich frei!'), w / 2, h / 2 - 10);
      ctx.font = `600 ${Math.max(12, Math.min(15, w / 20))}px system-ui, sans-serif`;
      ctx.fillText('mit dem Finger oder der Maus', w / 2, h / 2 + 18);
    };

    const freiAnteil = () => {
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
      let frei = 0, n = 0;
      for (let i = 3; i < d.length; i += 4 * 37) { n++; if (d[i] < 40) frei++; }
      return frei / n;
    };

    const aufdecken = () => {
      if (offen) return;
      offen = true;
      cv.classList.add('weg');
      setTimeout(() => cv.remove(), reduce ? 0 : 450);
      el.classList.add('rubbel-offen');
      if (opt.onReveal) opt.onReveal();
    };

    const kratze = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = Math.max(26, w / 9); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      if (letzt) ctx.moveTo(letzt.x, letzt.y); else ctx.moveTo(x - 0.1, y);
      ctx.lineTo(x, y); ctx.stroke();
      letzt = { x, y };
      if (++zaehler % 8 === 0 && freiAnteil() > 0.45) aufdecken();
    };

    const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    let unten = false;
    cv.addEventListener('pointerdown', (e) => { unten = true; letzt = null; cv.setPointerCapture(e.pointerId); const p = pos(e); kratze(p.x, p.y); e.preventDefault(); });
    cv.addEventListener('pointermove', (e) => { if (!unten || offen) return; const p = pos(e); kratze(p.x, p.y); e.preventDefault(); });
    const hoch = () => { unten = false; letzt = null; if (!offen && freiAnteil() > 0.45) aufdecken(); };
    cv.addEventListener('pointerup', hoch);
    cv.addEventListener('pointercancel', hoch);
    cv.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aufdecken(); } });

    male();
    let rt;
    const ro = new ResizeObserver(() => { if (!offen && zaehler === 0) { clearTimeout(rt); rt = setTimeout(male, 80); } });
    ro.observe(el);
    return { aufdecken, get offen() { return offen; } };
  }

  function konfetti() {
    if (reduce) return;
    const farben = ['#c62828', '#f2b705', '#1f6f4a', '#ffffff', '#e57373'];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('span');
      c.className = 'confetti';
      c.style.left = `${Math.random() * 100}vw`;
      c.style.background = farben[i % farben.length];
      c.style.animationDuration = `${2 + Math.random() * 2}s`;
      c.style.animationDelay = `${Math.random() * 0.4}s`;
      document.body.append(c);
      setTimeout(() => c.remove(), 4600);
    }
  }

  window.Rubbel = { decke, konfetti };
})();
