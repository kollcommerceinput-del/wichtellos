// Rubbellos verschicken (/rubbellos/): Geschenk geheim hinter einer Rubbelschicht, als Link.
// Der Inhalt steckt nur im Teil nach # (#r=…) – er geht nie an den Server.
(() => {
  'use strict';
  const box = document.querySelector('[data-rubbellos]');
  if (!box) return;
  const ANL = JSON.parse(box.querySelector('script[type="application/json"]').textContent);
  const FARBEN = ['rot', 'tanne', 'nacht', 'rosa'];
  const $ = (s) => box.querySelector(s);
  const enc = (o) => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const dec = (s) => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))));
  const st = { a: 0, f: 0 };
  // „Selbst ausprobieren“ oder ein neuer Link in derselben Seite: neu laden, damit die Empfänger-Ansicht startet
  window.addEventListener('hashchange', () => location.reload());

  function karte(el, d) {
    el.className = 'rl-karte rl-' + FARBEN[d.f || 0];
    el.innerHTML = '';
    const h = document.createElement('p'); h.className = 'rl-titel'; h.textContent = d.t || ANL[d.a || 0][1];
    const em = document.createElement('p'); em.className = 'rl-emoji'; em.textContent = ANL[d.a || 0][2];
    const feld = document.createElement('div'); feld.className = 'rl-feld';
    const g = document.createElement('p'); g.className = 'rl-geschenk'; g.textContent = d.g || '…';
    feld.append(g);
    el.append(em, h, feld);
    if (d.m) { const m = document.createElement('p'); m.className = 'rl-text'; m.textContent = d.m; el.append(m); }
    if (d.v) { const v = document.createElement('p'); v.className = 'rl-von'; v.textContent = '– ' + d.v; el.append(v); }
    return feld;
  }

  // Empfänger-Ansicht
  const m = location.hash.match(/^#r=([\w-]+)$/);
  if (m) {
    let d = null;
    try { d = dec(m[1]); } catch { /* kaputter Link */ }
    if (d && d.g) {
      box.classList.add('rl-empfang');
      $('#rl-empfang').hidden = false;
      $('#rl-machen').hidden = true;
      const feld = karte($('#rl-gross'), d);
      window.Rubbel.decke(feld, { text: 'Rubbel frei!', onReveal: () => { window.Rubbel.konfetti(); $('#rl-danach').hidden = false; } });
      document.title = (d.t || ANL[d.a || 0][1]) + ' – Rubbellos für dich';
      return;
    }
    $('#rl-kaputt').hidden = false;
  }

  // Erstellen
  const sel = $('#rl-anlass'), tit = $('#rl-titel-in'), ges = $('#rl-geschenk'), txt = $('#rl-text'), von = $('#rl-von');
  ANL.forEach((a, i) => { const o = document.createElement('option'); o.value = i; o.textContent = a[2] + ' ' + a[0]; sel.append(o); });
  let titelGeaendert = false;
  sel.addEventListener('change', () => { st.a = +sel.value; if (!titelGeaendert) tit.value = ANL[st.a][1]; vorschau(); });
  tit.addEventListener('input', () => { titelGeaendert = true; vorschau(); });
  [ges, txt, von].forEach((x) => x.addEventListener('input', vorschau));
  box.querySelectorAll('[data-farbe]').forEach((b) => b.addEventListener('click', () => {
    st.f = +b.dataset.farbe;
    box.querySelectorAll('[data-farbe]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    vorschau();
  }));
  const g0 = new URLSearchParams(location.search).get('g');
  if (g0) ges.value = g0.slice(0, 60);
  tit.value = ANL[0][1];

  const daten = () => {
    const d = { a: st.a, f: st.f, g: ges.value.trim() };
    if (tit.value.trim() && tit.value.trim() !== ANL[st.a][1]) d.t = tit.value.trim();
    if (txt.value.trim()) d.m = txt.value.trim();
    if (von.value.trim()) d.v = von.value.trim();
    return d;
  };
  function vorschau() {
    karte($('#rl-vorschau'), daten());
    $('#rl-ergebnis').hidden = true;
  }
  vorschau();

  $('#rl-erstellen').addEventListener('click', () => {
    if (!ges.value.trim()) { ges.focus(); $('#rl-fehler').hidden = false; return; }
    $('#rl-fehler').hidden = true;
    const link = `${location.origin}/rubbellos/#r=${enc(daten())}`;
    const anl = ANL[st.a][0];
    const text = `🎟️ Ich habe ein Rubbellos für dich${anl === 'Einfach so' ? '' : ' (' + anl + ')'}! Rubbel es frei: ${link}`;
    $('#rl-link').value = link;
    $('#rl-wa').href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    $('#rl-mail').href = `mailto:?subject=${encodeURIComponent('Ein Rubbellos für dich 🎟️')}&body=${encodeURIComponent(text)}`;
    $('#rl-share').dataset.text = text;
    $('#rl-test').href = link;
    $('#rl-ergebnis').hidden = false;
    $('#rl-ergebnis').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
