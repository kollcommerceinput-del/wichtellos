// Geschenke-Generator (/geschenke-generator/): Anlass, Person, Budget, Hobby → 3 Geschenk-Lose zum Freirubbeln.
// Alles im Browser; die Merkliste liegt nur im localStorage dieses Geräts.
// 08.11. (Toni): Punkte statt harter Filter – das Hobby/Interesse fliegt nie raus, das Budget wird nie überschritten.
// Ideen = handverlesene Liste (D.ideen) + Hobby × Baustein (D.hobbys, D.bausteine) + eingetipptes Hobby (gleiche Bausteine).
(() => {
  'use strict';
  const box = document.querySelector('[data-generator]');
  if (!box) return;
  const D = JSON.parse(box.querySelector('script[type="application/json"]').textContent);
  const ANL = Object.fromEntries(D.anlaesse.map((a) => [a[0], a])), MAGN = Object.fromEntries(D.mag);
  const HART = new Set(D.hart);
  const ERW = ['frau', 'mann', 'partner', 'mama', 'papa', 'oma', 'opa', 'freund', 'kollege'];
  const NAH = { frau: ['partner', 'freund', 'mama'], mann: ['partner', 'freund', 'papa'], partner: ['frau', 'mann'], mama: ['frau', 'oma'],
    papa: ['mann', 'opa'], oma: ['mama', 'frau'], opa: ['papa', 'mann'], freund: ['frau', 'mann'], kollege: ['freund'], paar: ['partner'], teen: [], kind: [] };
  const $ = (s) => box.querySelector(s);
  const st = { anlass: '', fuer: '', budget: '', mag: '', hobby: '' };
  const KEY = 'wl-merkliste', KEY_D = 'wl-merkliste-daten';
  let gezeigt = [], gesehen = new Set();

  // Ideen aus Hobby + Baustein bauen
  const ausHobby = (h) => (D.bausteine[h[3]] || D.bausteine.a).map(([n, t, qu, b, k], nr) => {
    const f = (s) => s.replaceAll('{L}', h[0]).replaceAll('{K}', h[1]);
    const ab18 = h[4] === '18';
    const w = ab18 ? ERW.filter((x) => x !== 'kollege') : ERW.concat('teen', h[4] === 'k' && k ? ['kind'] : []);
    return { n: f(n) + (ab18 ? ' (ab 18)' : ''), t: f(t), q: f(qu), b, w, m: h[2] ? [h[2]] : [], a: [], hob: h[0], gen: 1, tpl: h[3] + nr };
  });
  const HOBBY = new Map(D.hobbys.map((h) => [h[0].toLowerCase(), h]));
  const ALLE = new Map();
  for (const i of D.ideen) ALLE.set(i.n, i);
  for (const h of D.hobbys) for (const i of ausHobby(h)) if (!ALLE.has(i.n)) ALLE.set(i.n, i);
  const IDEEN = [...ALLE.values()];

  // Auswahl-Chips (ein Klick wählt, nochmal klicken = egal)
  box.querySelectorAll('.g-chips').forEach((grp) => {
    grp.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-v]');
      if (!b) return;
      const k = grp.dataset.k;
      st[k] = st[k] === b.dataset.v ? '' : b.dataset.v;
      if (k === 'mag') { st.hobby = ''; $('#g-hobby').value = st.mag ? MAGN[st.mag] : ''; }
      zeigeAuswahl();
    });
  });
  const zeigeAuswahl = () => {
    box.querySelectorAll('.g-chips').forEach((grp) => grp.querySelectorAll('button[data-v]').forEach((b) =>
      b.setAttribute('aria-pressed', String(st[grp.dataset.k] === b.dataset.v))));
    $('#g-anlass').value = st.anlass;
  };
  $('#g-anlass').addEventListener('change', (e) => { st.anlass = e.target.value; });
  // Hobby-Feld: Hobby aus der Liste, Bereich (Interesse) oder freier Text
  const MAG_NAME = new Map(D.mag.map(([k, n]) => [n.toLowerCase(), k]));
  const leseHobby = () => {
    const v = $('#g-hobby').value.trim().slice(0, 40);
    st.mag = MAG_NAME.get(v.toLowerCase()) || '';
    st.hobby = st.mag ? '' : v;
    zeigeAuswahl();
  };
  $('#g-hobby').addEventListener('input', leseHobby);
  $('#g-hobby').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); lose(); } });

  // Aus der Adresse übernehmen: ?anlass=geb&fuer=mama&budget=30&mag=garten&hobby=Angeln
  const q = new URLSearchParams(location.search);
  for (const k of Object.keys(st)) if (q.get(k)) st[k] = q.get(k).slice(0, 40);
  if (st.anlass && !ANL[st.anlass]) st.anlass = '';
  if (st.mag && !MAGN[st.mag]) st.mag = '';
  if (st.hobby) $('#g-hobby').value = st.hobby; else if (st.mag) $('#g-hobby').value = MAGN[st.mag];
  zeigeAuswahl();

  // Punkte je Idee (null = passt nicht)
  function punkte(i, hob) {
    if (st.budget && i.b > +st.budget) return null;
    const ab18 = /\(ab 18\)/.test(i.n);
    let p = i.gen ? 0 : 1;
    if (st.budget && i.b * 2 > +st.budget) p += 1;            // nicht nur Kleinkram, wenn das Budget höher ist
    if (st.fuer) {
      if (ab18 && ['kind', 'teen', 'kollege'].includes(st.fuer)) return null;
      if (i.w.includes(st.fuer)) p += 4;
      else if (!ab18 && (NAH[st.fuer] || []).some((x) => i.w.includes(x))) p += 1;
      else return null;
    } else if (i.w.length && i.w.every((x) => x === 'kind')) p -= 1;
    if (hob) {                                                 // Hobby aus der Liste oder eingetippt
      if (i.hob === hob.name) p += 10;
      else if (hob.mag && i.m.includes(hob.mag)) p += i.gen ? 1 : 4;
      else if (hob.wort && !i.gen && (i.n + ' ' + i.t + ' ' + i.q).toLowerCase().includes(hob.wort)) p += 6;
      else return null;
    } else if (st.mag) {
      if (!i.m.includes(st.mag)) return null;
      p += 5;
    } else if (i.gen) p -= 4;                                  // ohne Hobby keine zufälligen Hobby-Geschenke (Feen-Figur zum Ruhestand)
    if (st.anlass) {
      if (HART.has(st.anlass)) { if (!i.a.includes(st.anlass)) return null; p += 3; }
      else if (i.a.includes(st.anlass)) p += 3;
      else if (i.gen) p += 1;                                  // Hobby-Geschenke passen zu fast jedem Anlass
    }
    return p;
  }

  function topf() {
    let hob = null, extra = [];
    if (st.hobby) {
      const h = HOBBY.get(st.hobby.toLowerCase());
      if (h) hob = { name: h[0], mag: h[2] };
      else {                                                    // freier Text: gleiche Bausteine wie für Hobbys
        const w = st.hobby.replace(/[<>"]/g, '');
        hob = { name: w, mag: '', wort: w.toLowerCase() };
        extra = ausHobby([w, w, '', 'a', '']);
      }
    }
    const liste = [];
    for (const i of extra.concat(IDEEN)) {
      const p = punkte(i, hob);
      if (p !== null) liste.push([p, Math.random(), i]);
    }
    liste.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
    // Topf = beste Stufe (bis 2 Punkte unter dem Besten); reicht das nicht für Abwechslung, die nächsten dazu
    const best = liste.length ? liste[0][0] : 0;
    let n = liste.filter((x) => x[0] >= best - 2).length;
    if (n < 8) n = Math.min(liste.length, 8);
    const p = liste.slice(0, n).map((x) => x[2]);
    let hinweis = '';
    if (p.length < 3) hinweis = st.budget && +st.budget < 100 ? 'Hier gibt es nur wenige passende Ideen – mit etwas mehr Budget findest du mehr.' : 'Hier gibt es nur wenige passende Ideen – lass ein Feld frei, dann findest du mehr.';
    return { p, hinweis };
  }

  const ziehe = (p, ausser) => {
    let frei = p.filter((i) => !ausser.has(i.n) && !gesehen.has(i.n));
    if (!frei.length) { gesehen = new Set(gezeigt.map((i) => i.n)); frei = p.filter((i) => !ausser.has(i.n)); }
    if (!frei.length) return null;
    // Abwechslung: nicht zweimal derselbe Baustein (z. B. dreimal Socken) in einer Runde, wenn es anders geht
    const tpl = new Set(gezeigt.filter((x) => ausser.has(x.n) && x.tpl).map((x) => x.tpl));
    const anders = frei.filter((i) => !i.tpl || !tpl.has(i.tpl));
    if (anders.length) frei = anders;
    const i = frei[Math.floor(Math.random() * frei.length)];
    gesehen.add(i.n);
    return i;
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const merkliste = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const merkDaten = () => { try { return JSON.parse(localStorage.getItem(KEY_D)) || {}; } catch { return {}; } };
  const speichere = (l, i) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(l));
      const d = merkDaten();
      if (i && l.includes(i.n)) d[i.n] = { n: i.n, q: i.q, u: i.u || '', b: i.b };
      for (const k of Object.keys(d)) if (!l.includes(k)) delete d[k];
      localStorage.setItem(KEY_D, JSON.stringify(d));
    } catch { /* privat */ }
  };

  function karte(i, slot) {
    const gemerkt = merkliste().includes(i.n);
    const div = document.createElement('div');
    div.className = 'glos';
    div.innerHTML = `<div class="los-inhalt">
      <p class="los-kat">${esc(i.hob ? i.hob : i.m.map((m) => MAGN[m]).filter(Boolean).join(' · '))} · bis ${i.b} €</p>
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
      speichere(l, i);
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
    const shop = p.filter((i) => i.s && !aus.has(i.n) && !gesehen.has(i.n));
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
    const byName = Object.assign(merkDaten(), Object.fromEntries(IDEEN.map((i) => [i.n, i])));
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
  if (q.get('anlass') || q.get('fuer') || q.get('hobby') || q.get('mag')) lose();
})();
