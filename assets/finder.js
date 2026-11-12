(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const cards = [...document.querySelectorAll('#f-results .idea')];
  const AGE_QUERY = { k1: 'Kinder 3-7 Jahre', k2: 'Kinder 8-12 Jahre', teen: 'Teenager', adult: '', office: 'Kollegen' };
  const state = { fuer: '', budget: '', mag: new Set(), q: '' };

  // muss zu norm() in build.py passen
  const norm = (s) => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');

  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.fuer = p.get('fuer') || '';
    state.budget = p.get('budget') || '';
    (p.get('mag') || '').split(',').filter(Boolean).forEach((m) => state.mag.add(m));
    state.q = p.get('q') || '';
    $('#f-q').value = state.q;
  }

  function writeUrl() {
    const p = new URLSearchParams();
    if (state.fuer) p.set('fuer', state.fuer);
    if (state.budget) p.set('budget', state.budget);
    if (state.mag.size) p.set('mag', [...state.mag].join(','));
    if (state.q) p.set('q', state.q);
    const qs = p.toString();
    try { history.replaceState(null, '', qs ? `?${qs}` : location.pathname); } catch { /* egal */ }
  }

  function matches(card) {
    const ages = card.dataset.ages.split(' ');
    if (state.fuer === 'office') {
      if (!ages.includes('adult') || card.dataset.office !== '1') return false;
    } else if (state.fuer && !ages.includes(state.fuer)) return false;
    if (state.budget && +card.dataset.budget > +state.budget) return false;
    if (state.mag.size && !card.dataset.cats.split(' ').some((c) => state.mag.has(c))) return false;
    const words = norm(state.q).split(/\s+/).filter(Boolean);
    return words.every((w) => card.dataset.search.includes(w));
  }

  // Handy (Toni 09.11.): nur 20 Treffer zeigen, Knopf „20 weitere Ideen zeigen“; jede Filteränderung fängt wieder bei 20 an
  const HANDY = matchMedia('(max-width: 600px)').matches, SCHRITT = 20;
  let grenze = SCHRITT;
  const mehr = document.createElement('div');
  mehr.className = 'mehr-box';
  mehr.innerHTML = '<button type="button" class="btn-secondary"></button>';
  $('#f-results').after(mehr);
  mehr.querySelector('button').addEventListener('click', () => { grenze += SCHRITT; zeige(); });
  function zeige() {
    let n = 0;
    cards.forEach((c) => { if (c.dataset.ok === '1') { n++; c.hidden = HANDY && n > grenze; } else c.hidden = true; });
    const rest = n - grenze;
    mehr.hidden = !HANDY || rest <= 0;
    mehr.querySelector('button').textContent = rest > SCHRITT ? `${SCHRITT} weitere Ideen zeigen (noch ${rest})` : `Die letzten ${rest} Ideen zeigen`;
  }

  function apply() {
    let count = 0;
    cards.forEach((c) => { const ok = matches(c); c.dataset.ok = ok ? '1' : '0'; if (ok) count++; });
    grenze = SCHRITT;
    zeige();
    $('#f-count').textContent = count === 0 ? 'Keine Idee passt – lockere einen Filter oder such unten bei Amazon' : count === 1 ? '1 Idee' : `${count} Ideen`; // UX-Analyse Nr. 19
    $('#f-show').textContent = count === 1 ? '1 Idee ansehen' : `${count} Ideen ansehen`;

    const query = `${state.q.trim() || 'Wichtelgeschenk'} ${AGE_QUERY[state.fuer] || ''}`.trim();
    const link = $('#f-amazon');
    link.href = window.amazonUrl ? window.amazonUrl(query) : `https://www.amazon.de/s?k=${encodeURIComponent(query)}`;
    link.textContent = `Bei Amazon nach „${query}“ suchen*`;
    $('#f-amazon-box').hidden = !(state.q.trim() || count === 0);

    document.querySelectorAll('.chip[data-f]').forEach((chip) => {
      const { f, v } = chip.dataset;
      const on = f === 'mag' ? state.mag.has(v) : state[f] === v;
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const act = [...document.querySelectorAll('.chip[data-f][aria-pressed="true"]')].filter((c) => c.dataset.v).map((c) => c.textContent.trim());
    $('#f-active').textContent = act.length ? `Aktiv: ${act.join(' · ')}` : '';
    writeUrl();
  }

  document.querySelectorAll('.chip[data-f]').forEach((chip) => chip.addEventListener('click', () => {
    const { f, v } = chip.dataset;
    if (f === 'mag') {
      if (state.mag.has(v)) state.mag.delete(v); else state.mag.add(v);
    } else {
      state[f] = v === '' || state[f] === v ? '' : v;
    }
    apply();
  }));

  let timer;
  $('#f-q').addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.q = e.target.value; apply(); }, 150);
  });

  $('#f-reset').addEventListener('click', () => {
    state.fuer = ''; state.budget = ''; state.mag.clear(); state.q = '';
    $('#f-q').value = '';
    apply();
  });

  // Filter auf dem Handy zugeklappt; kommt man mit Filtern in der Adresse (z. B. ?fuer=office), immer zugeklappt
  const fromUrl = /[?&](fuer|budget|mag|q)=/.test(location.search);
  $('#f-more').open = !fromUrl && matchMedia('(min-width: 700px)').matches;
  $('#f-show').addEventListener('click', () => {
    $('#f-more').open = false;
    const r = $('#f-results');
    r.scrollIntoView({ behavior: 'smooth', block: 'start' });
    r.focus({ preventScroll: true });
  });

  readUrl();
  apply();
})();
