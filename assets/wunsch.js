// Wunschzettel (/wunschzettel/): Wünsche stecken nur im Teil nach # (Base64url-JSON), nie auf dem Server.
(() => {
  'use strict';
  const box = document.querySelector('[data-wunsch]');
  if (!box) return;
  const $ = (s) => document.querySelector(s);
  const MAX = 5;
  const enc = (o) => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const dec = (s) => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))));
  const amazon = (q) => (window.amazonUrl ? window.amazonUrl(q) : 'https://www.amazon.de/s?k=' + encodeURIComponent(q));

  // Formular
  const list = $('#wz-list');
  for (let i = 0; i < MAX; i++) {
    const l = document.createElement('label');
    l.className = 'wz-row';
    l.innerHTML = `<span>${i + 1}.</span><input maxlength="60" data-w placeholder="${['z. B. Kuschelsocken Größe 39–42', 'z. B. Krimi aus Schweden', 'z. B. Dunkle Schokolade', 'z. B. Kaffee-Becher', 'z. B. Überraschung!'][i]}">`;
    list.append(l);
  }
  const get = () => ({
    n: $('#wz-n').value.trim().slice(0, 30),
    w: [...box.querySelectorAll('[data-w]')].map((e) => e.value.trim().slice(0, 60)).filter(Boolean),
    x: $('#wz-x').value.trim().slice(0, 80),
    g: $('#wz-g').value.trim().slice(0, 40),
  });
  const link = () => `${location.origin}/wunschzettel/#z=${enc(get())}`;
  const text = () => {
    const d = get();
    return `📝 Wunschzettel${d.n ? ' von ' + d.n : ''}${d.g ? ' (' + d.g + ')' : ''}:\n` +
      d.w.map((w, i) => `${i + 1}. ${w}`).join('\n') + (d.x ? `\n🚫 Bitte nicht: ${d.x}` : '') + `\n\n${link()}`;
  };
  const err = $('#wz-err');
  const ok = () => { const has = get().w.length > 0; err.hidden = has; return has; };
  const flash = (b, t) => { const o = b.textContent; b.textContent = t; setTimeout(() => { b.textContent = o; }, 1800); };

  $('#wz-wa').addEventListener('click', () => { if (ok()) window.open('https://wa.me/?text=' + encodeURIComponent(text()), '_blank', 'noopener'); });
  $('#wz-copy').addEventListener('click', async () => {
    if (!ok()) return;
    try { await navigator.clipboard.writeText(text()); flash($('#wz-copy'), '✓ Kopiert'); } catch { flash($('#wz-copy'), 'Kopieren klappt hier nicht'); }
  });
  $('#wz-view').addEventListener('click', () => { if (ok()) { location.hash = 'z=' + enc(get()); show(get()); window.scrollTo(0, 0); } });
  if (navigator.share) {
    const more = $('#wz-more'); more.hidden = false;
    more.addEventListener('click', () => { if (ok()) navigator.share({ text: text() }).catch(() => {}); });
  }

  // Ansicht für den Wichtel
  function show(d) {
    const v = $('#wz-show');
    $('#wz-s-name').textContent = d.n ? `Wunschzettel von ${d.n}` : 'Ein Wunschzettel für dich';
    $('#wz-s-group').textContent = d.g ? `Wichtelgruppe: ${d.g}` : '';
    const ul = $('#wz-s-list'); ul.innerHTML = '';
    d.w.forEach((w) => {
      const li = document.createElement('li');
      const b = document.createElement('b'); b.textContent = w;
      const a = document.createElement('a');
      a.href = amazon(w.replace(/\b(größe|gr\.)\s*\S+/gi, '').trim() || w);
      a.target = '_blank'; a.rel = 'sponsored nofollow noopener'; a.className = 'btn-secondary'; a.textContent = 'Ideen bei Amazon*';
      li.append(b, a); ul.append(li);
    });
    const x = $('#wz-s-x'); x.hidden = !d.x; x.textContent = d.x ? '🚫 Bitte nicht: ' + d.x : '';
    v.hidden = false;
  }
  const m = location.hash.match(/^#z=([\w-]+)/);
  if (m) {
    try {
      const d = dec(m[1]);
      const clean = { n: String(d.n || '').slice(0, 30), w: (Array.isArray(d.w) ? d.w : []).slice(0, MAX).map((w) => String(w).slice(0, 60)).filter(Boolean),
        x: String(d.x || '').slice(0, 80), g: String(d.g || '').slice(0, 40) };
      if (clean.w.length) show(clean);
    } catch { /* kaputter Link */ }
  }
})();
