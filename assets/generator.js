// Geschenke-Generator (/geschenke-generator/): 3 Fragen → 3 Geschenk-Lose zum Freirubbeln.
// Alles im Browser; die Merkliste liegt nur im localStorage dieses Geräts.
(() => {
  'use strict';
  const box = document.querySelector('[data-generator]');
  if (!box) return;
  const D = JSON.parse(box.querySelector('script[type="application/json"]').textContent);
  const IDEEN = D.ideen, ANL = Object.fromEntries(D.anlaesse.map((a) => [a[0], a])), MAGN = Object.fromEntries(D.mag);
  const $ = (s) => box.querySelector(s);
  const st = { anlass: '', fuer: '', budget: '', mag: '' };
  const KEY = 'wl-merkliste';
  let gezeigt = [], gesehen = new Set();

  // Auswahl-Chips (wie im Geschenkfinder: ein Klick wählt, nochmal klicken = egal)
  box.querySelectorAll('.g-chips').forEach((grp) => {
    grp.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-v]');
      if (!b) return;
      const k = grp.dataset.k;
      st[k] = st[k] === b.dataset.v ? '' : b.dataset.v;
      zeigeAuswahl();
    });
  });
  const zeigeAuswahl = () => {
    box.querySelectorAll('.g-chips').forEach((grp) => grp.querySelectorAll('button[data-v]').forEach((b) =>
      b.setAttribute('aria-pressed', String(st[grp.dataset.k] === b.dataset.v))));
  };

  // Aus der Adresse übernehmen: ?anlass=geb&fuer=mama&budget=30&mag=garten
  const q = new URLSearchParams(location.search);
  for (const k of Object.keys(st)) if (q.get(k)) st[k] = q.get(k);
  zeigeAuswahl();

  const passt = (i, ohne = []) =>
    (!st.anlass || ohne.includes('anlass') || i.a.includes(st.anlass)) &&
    (!st.fuer || ohne.includes('fuer') || i.w.includes(st.fuer)) &&
    (!st.budget || i.b <= +st.budget) &&
    (!st.mag || ohne.includes('mag') || i.m.includes(st.mag));

  function topf() {
    let p = IDEEN.filter((i) => passt(i)), hinweis = '';
    if (p.length < 6 && st.mag) { p = IDEEN.filter((i) => passt(i, ['mag'])); hinweis = 'Zu „' + MAGN[st.mag] + '“ gibt es hier nur wenige Ideen – wir haben ein paar passende dazugenommen.'; }
    if (p.length < 6 && st.anlass) { p = IDEEN.filter((i) => passt(i, ['mag', 'anlass'])); hinweis = 'Wir haben die Auswahl etwas erweitert, damit genug Lose im Topf sind.'; }
    if (p.length < 3) { p = IDEEN.filter((i) => !st.budget || i.b <= +st.budget); hinweis = 'Wir haben die Auswahl erweitert, damit genug Lose im Topf sind.'; }
    return { p, hinweis };
  }

  const ziehe = (p, ausser) => {
    let frei = p.filter((i) => !ausser.has(i.n) && !gesehen.has(i.n));
    if (!frei.length) { gesehen = new Set(gezeigt.map((i) => i.n)); frei = p.filter((i) => !ausser.has(i.n)); }
    if (!frei.length) return null;
    const i = frei[Math.floor(Math.random() * frei.length)];
    gesehen.add(i.n);
    return i;
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const merkliste = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const speichere = (l) => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch { /* privat */ } };

  function karte(i, slot) {
    const gemerkt = merkliste().includes(i.n);
    const div = document.createElement('div');
    div.className = 'glos';
    div.innerHTML = `<div class="los-inhalt">
      <p class="los-kat">${esc(i.m.map((m) => MAGN[m]).join(' · '))} · bis ${i.b} €</p>
      <h3>${esc(i.n)}</h3>
      <p>${esc(i.t)}</p>
      <p class="los-links">${i.u ? `<a class="btn-primary" href="${esc(i.u)}">Im WichtelLos-Shop ansehen</a>` : `<a class="btn-primary" href="${esc(window.amazonUrl(i.q))}" rel="sponsored nofollow noopener" target="_blank">Ansehen*</a>`}</p>
      <p class="los-knoepfe">
        <button type="button" class="g-btn g-merk" aria-pressed="${gemerkt}">${gemerkt ? '♥ Gemerkt' : '♡ Merken'}</button>
        <button type="button" class="g-btn g-neu">🎲 Neues Los</button>
        <a class="g-btn g-rl" href="/rubbellos/?g=${encodeURIComponent(i.n)}">🎟️ Als Rubbellos verschenken</a>
      </p></div>`;
    div.querySelector('.g-merk').addEventListener('click', (e) => {
      let l = merkliste();
      l = l.includes(i.n) ? l.filter((x) => x !== i.n) : [...l, i.n];
      speichere(l);
      const an = l.includes(i.n);
      e.currentTarget.textContent = an ? '♥ Gemerkt' : '♡ Merken';
      e.currentTarget.setAttribute('aria-pressed', String(an));
      zeigeMerkliste();
    });
    div.querySelector('.g-neu').addEventListener('click', () => {
      const { p } = topf();
      const neu = ziehe(p, new Set(gezeigt.map((x) => x.n)));
      if (!neu) return;
      gezeigt[slot] = neu;
      const k = karte(neu, slot);
      div.replaceWith(k);
      decke(k);
      teilen();
    });
    return div;
  }

  const offen = [];
  const decke = (k) => {
    if ($('#g-ohne').checked) return;
    const r = window.Rubbel.decke(k.querySelector('.los-inhalt'), {
      text: 'Rubbel mich frei!',
      onReveal: () => { if (offen.every((x) => x.offen)) window.Rubbel.konfetti(); },
    });
    offen.push(r);
  };

  function lose() {
    const { p, hinweis } = topf();
    gezeigt = [];
    const aus = new Set();
    for (let s = 0; s < 3; s++) { const i = ziehe(p, aus); if (i) { gezeigt.push(i); aus.add(i.n); } }
    // Eigener Shop (Toni 08.11.): passt eine Shop-Idee zu den Filtern, liegt sie öfter (ca. 40 %) in einem der 3 Lose – nie mehr als eine
    const shop = p.filter((i) => i.s && !aus.has(i.n));
    if (shop.length && gezeigt.length === 3 && !gezeigt.some((i) => i.s) && Math.random() < 0.4) {
      const i = shop[Math.floor(Math.random() * shop.length)], s = Math.floor(Math.random() * 3);
      aus.delete(gezeigt[s].n); gezeigt[s] = i; aus.add(i.n); gesehen.add(i.n);
    }
    const ziel = $('#g-lose');
    ziel.innerHTML = '';
    offen.length = 0;
    gezeigt.forEach((i, s) => { const k = karte(i, s); ziel.append(k); decke(k); });
    $('#g-hinweis').textContent = hinweis;
    $('#g-hinweis').hidden = !hinweis;
    const anl = st.anlass ? ANL[st.anlass][2] + ' ' + ANL[st.anlass][1] : 'Deine Geschenk-Lose';
    $('#g-titel').textContent = anl;
    $('#g-ergebnis').hidden = false;
    $('#g-alle').hidden = $('#g-ohne').checked;
    teilen();
    $('#g-ergebnis').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function teilen() {
    const anl = st.anlass ? ' zum ' + ANL[st.anlass][1].replace('Weihnachten', 'Weihnachtsfest').replace('Wichteln', 'Wichteln') : '';
    const text = `🎁 Geschenkideen${anl}:\n${gezeigt.map((i, n) => `${n + 1}. ${i.n}`).join('\n')}\n\nGezogen mit dem Geschenke-Generator: ${location.origin}/geschenke-generator/`;
    const z = $('#g-teilen');
    z.querySelector('.sh-wa').href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    z.querySelector('.sh-mail').href = `mailto:?subject=${encodeURIComponent('Geschenkideen')}&body=${encodeURIComponent(text)}`;
    z.querySelector('.sh-copy').dataset.text = text;
  }

  function zeigeMerkliste() {
    const l = merkliste();
    const sec = $('#g-merk');
    sec.hidden = !l.length;
    if (!l.length) return;
    const byName = Object.fromEntries(IDEEN.map((i) => [i.n, i]));
    $('#g-merk-liste').innerHTML = l.filter((n) => byName[n]).map((n) => {
      const i = byName[n];
      return `<li>${i.u ? `<a href="${esc(i.u)}">${esc(i.n)}</a> <span class="hint">(WichtelLos-Shop)</span>` : `<a href="${esc(window.amazonUrl(i.q))}" rel="sponsored nofollow noopener" target="_blank">${esc(i.n)}*</a>`} <span class="hint">bis ${i.b} €</span> <button type="button" class="g-btn g-weg" data-weg="${esc(n)}" aria-label="${esc(n)} von der Merkliste nehmen">✕ entfernen</button></li>`;
    }).join('');
    const text = `🎁 Meine Geschenk-Merkliste:\n${l.map((n) => '• ' + n).join('\n')}\n\n${location.origin}/geschenke-generator/`;
    $('#g-merk-wa').href = `https://wa.me/?text=${encodeURIComponent(text)}`;
  }
  $('#g-merk-liste').addEventListener('click', (e) => {
    const b = e.target.closest('[data-weg]');
    if (!b) return;
    speichere(merkliste().filter((x) => x !== b.dataset.weg));
    zeigeMerkliste();
    box.querySelectorAll('.g-merk').forEach((m) => {
      if (m.closest('.glos').querySelector('h3').textContent === b.dataset.weg) { m.textContent = '♡ Merken'; m.setAttribute('aria-pressed', 'false'); }
    });
  });

  $('#g-los').addEventListener('click', lose);
  $('#g-alle').addEventListener('click', () => { offen.forEach((r) => r.aufdecken()); $('#g-alle').hidden = true; });
  $('#g-ohne').addEventListener('change', () => { if (gezeigt.length) { if ($('#g-ohne').checked) { offen.forEach((r) => r.aufdecken()); $('#g-alle').hidden = true; } } });
  zeigeMerkliste();
  if (q.get('anlass') || q.get('fuer')) lose();
})();
