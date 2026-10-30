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

  function apply() {
    let count = 0;
    cards.forEach((c) => { const ok = matches(c); c.hidden = !ok; if (ok) count++; });
    $('#f-count').textContent = count === 1 ? '1 Idee' : `${count} Ideen`;

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

  readUrl();
  apply();
})();
