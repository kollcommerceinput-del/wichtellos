// Wichtelgruß (/wichtelgruss/): Karte im Browser auf ein Canvas zeichnen, als Bild teilen/speichern
// oder als Link verschicken. Der Inhalt steckt nur im Teil nach # – er geht nie an den Server.
(() => {
  'use strict';
  const box = document.querySelector('[data-gruss]');
  if (!box) return;
  const OCC = JSON.parse(box.querySelector('script[type="application/json"]').textContent);
  const THEMES = [
    { bg: '#c62828', accent: '#c62828', name: 'Rot' },
    { bg: '#1f6f4a', accent: '#1f6f4a', name: 'Tanne' },
    { bg: '#2a160c', accent: '#9f1f1f', name: 'Werkstatt' },
    { bg: '#f2b705', accent: '#9f1f1f', name: 'Gold' },
  ];
  const $ = (s) => box.querySelector(s);
  const cv = $('#gr-canvas'), ctx = cv.getContext('2d');
  const W = 1080, H = 1350;
  const st = { o: 0, f: 0, a: '', t: OCC[0].t, v: OCC[0].v };
  const imgs = {};
  const loadImg = (n) => imgs[n] || (imgs[n] = new Promise((res) => {
    const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = `/fotos/onni/sticker-${n}.webp`;
  }));

  // Text umbrechen, liefert Zeilen
  const wrap = (text, maxW) => {
    const out = [];
    String(text).split('\n').forEach((para) => {
      let line = '';
      para.split(/\s+/).forEach((w) => {
        const test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; } else line = test;
      });
      out.push(line);
    });
    return out;
  };

  const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };

  async function draw() {
    const oc = OCC[st.o], th = THEMES[st.f];
    await document.fonts.load('600 80px Fredoka').catch(() => {});
    const img = await loadImg(oc.s);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = th.bg; ctx.fillRect(0, 0, W, H);
    // Schneeflocken (fest verteilt, damit die Karte nicht bei jedem Tippen springt)
    ctx.fillStyle = 'rgba(255,255,255,.22)';
    for (let k = 0; k < 70; k++) {
      const x = (k * 397) % W, y = (k * 211 + (k % 7) * 53) % H, r = 3 + (k % 4) * 2;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
    // Lichterkette oben
    const cols = ['#f2b705', '#ffffff', '#f2b705', '#ff8a80'];
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = 0; x <= W; x += 10) ctx.lineTo(x, 34 + Math.sin(x / 90) * 12);
    ctx.stroke();
    for (let k = 0; k < 12; k++) {
      const x = 45 + k * 90, y = 34 + Math.sin(x / 90) * 12 + 16;
      ctx.fillStyle = cols[k % 4]; ctx.beginPath(); ctx.ellipse(x, y, 11, 16, 0, 0, 7); ctx.fill();
    }
    // Karte
    const cx = 70, cy = 100, cw = W - 140, ch = H - 220;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#fff8f0'; rr(cx, cy, cw, ch, 44); ctx.fill(); ctx.restore();
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    let y = cy + 70;
    if (st.a.trim()) {
      ctx.fillStyle = '#6d5d57'; ctx.font = '600 44px Fredoka, system-ui, sans-serif';
      ctx.fillText('Für ' + st.a.trim(), W / 2, y + 20); y += 60;
    }
    // Überschrift
    ctx.fillStyle = th.accent;
    let fs = 96; ctx.font = `600 ${fs}px Fredoka, system-ui, sans-serif`;
    let tl = wrap(oc.h, cw - 120);
    while (tl.length > 2 && fs > 60) { fs -= 6; ctx.font = `600 ${fs}px Fredoka, system-ui, sans-serif`; tl = wrap(oc.h, cw - 120); }
    tl.forEach((l) => { y += fs * 1.05; ctx.fillText(l, W / 2, y); });
    // Onni
    const isz = 470, iy = y + 20;
    if (img) ctx.drawImage(img, W / 2 - isz / 2, iy, isz, isz);
    y = iy + isz + 20;
    // Text
    ctx.fillStyle = '#2b1b17'; let ts = 44; ctx.font = `${ts}px system-ui, "Segoe UI", sans-serif`;
    let lines = wrap(st.t.trim(), cw - 140);
    const room = cy + ch - 70 - y - (st.v.trim() ? 70 : 0);
    while (lines.length * ts * 1.3 > room && ts > 28) { ts -= 2; ctx.font = `${ts}px system-ui, "Segoe UI", sans-serif`; lines = wrap(st.t.trim(), cw - 140); }
    lines.forEach((l) => { y += ts * 1.3; ctx.fillText(l, W / 2, y); });
    if (st.v.trim()) {
      ctx.fillStyle = th.accent; ctx.font = '600 50px Fredoka, system-ui, sans-serif';
      ctx.fillText('– ' + st.v.trim(), W / 2, Math.min(y + 80, cy + ch - 50));
    }
    // Absender-Zeile
    ctx.fillStyle = th.bg === '#f2b705' ? '#2b1b17' : '#ffffff';
    ctx.font = '600 38px Fredoka, system-ui, sans-serif';
    ctx.fillText('wichtellos.de', W / 2, H - 52);
  }

  // Link-Kodierung: UTF-8 → Base64url
  const enc = (o) => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const dec = (s) => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))));
  const link = () => `${location.origin}/wichtelgruss/#g=${enc({ o: st.o, f: st.f, a: st.a, t: st.t, v: st.v })}`;

  // Bedienelemente
  const occBox = $('#gr-occ'), thBox = $('#gr-theme');
  OCC.forEach((oc, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'gr-occ';
    b.innerHTML = `<img src="/fotos/onni/sticker-${oc.s}-128.webp" alt="" width="64" height="64" loading="lazy"><span></span>`;
    b.querySelector('span').textContent = oc.h;
    b.addEventListener('click', () => {
      st.o = i; st.t = oc.t; st.v = oc.v; $('#gr-t').value = st.t; $('#gr-v').value = st.v; sync();
    });
    occBox.append(b);
  });
  THEMES.forEach((th, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'gr-theme'; b.style.background = th.bg; b.title = th.name; b.setAttribute('aria-label', 'Farbe ' + th.name);
    b.addEventListener('click', () => { st.f = i; sync(); });
    thBox.append(b);
  });
  const sync = () => {
    occBox.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', i === st.o));
    thBox.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', i === st.f));
    draw();
  };
  [['#gr-a', 'a'], ['#gr-t', 't'], ['#gr-v', 'v']].forEach(([s, k]) => {
    const el = $(s); el.value = st[k];
    el.addEventListener('input', () => { st[k] = el.value; draw(); });
  });

  const flash = (b, txt) => { const old = b.textContent; b.textContent = txt; setTimeout(() => { b.textContent = old; }, 1800); };
  const blob = () => new Promise((res) => cv.toBlob(res, 'image/png'));
  const fname = () => 'wichtelgruss-' + OCC[st.o].s + '.png';
  const download = async () => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(await blob()); a.download = fname();
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };
  const shareImg = async (btn) => {
    const file = new File([await blob()], fname(), { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file] }).catch(() => {});
    } else { await download(); flash(btn, '✓ Gespeichert – jetzt im Chat anhängen'); }
  };
  const shareWa = () => {
    window.open('https://wa.me/?text=' + encodeURIComponent('🎁 Ein Wichtelgruß für dich: ' + link()), '_blank', 'noopener');
  };
  $('#gr-share').addEventListener('click', () => shareImg($('#gr-share')));
  $('#gr-save').addEventListener('click', download);
  $('#gr-wa').addEventListener('click', shareWa);

  // Handy: mitlaufende Leiste – sichtbar, solange die Karte im Bild ist, aber nicht bei Schritt 3
  const bar = $('#gr-bar');
  if (bar && 'IntersectionObserver' in window) {
    $('#gr-bar-share').addEventListener('click', () => shareImg($('#gr-bar-share')));
    $('#gr-bar-wa').addEventListener('click', shareWa);
    let inCard = false, atStep3 = false;
    const upd = () => bar.classList.toggle('on', inCard && !atStep3);
    new IntersectionObserver(([e]) => { inCard = e.isIntersecting; upd(); }, { rootMargin: "0px 0px -80px 0px" }).observe(box);
    new IntersectionObserver(([e]) => { atStep3 = e.isIntersecting; upd(); }).observe($('#gr-share').closest('p'));
  }
  $('#gr-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(link()); flash($('#gr-copy'), '✓ Link kopiert'); }
    catch { flash($('#gr-copy'), 'Kopieren klappt hier nicht'); }
  });

  // Empfangener Gruß: Karte aus dem Link zeigen
  const m = location.hash.match(/^#g=([\w-]+)/);
  if (m) {
    try {
      const d = dec(m[1]);
      st.o = Math.min(Math.max(+d.o || 0, 0), OCC.length - 1);
      st.f = Math.min(Math.max(+d.f || 0, 0), THEMES.length - 1);
      st.a = String(d.a || '').slice(0, 30); st.t = String(d.t || '').slice(0, 180); st.v = String(d.v || '').slice(0, 30);
      $('#gr-a').value = st.a; $('#gr-t').value = st.t; $('#gr-v').value = st.v;
      document.body.classList.add('gruss-received');
      const r = document.getElementById('gr-received');
      if (r) r.hidden = false;
    } catch { /* kaputter Link – normale Ansicht */ }
  }
  sync();
})();
