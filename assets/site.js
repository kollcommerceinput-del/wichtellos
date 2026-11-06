(() => {
  'use strict';
  // Partner-ID setzt build.py beim Bauen ein (AMAZON_TAG dort) – hier leer lassen
  const AMAZON_TAG = '';

  // „Link teilen“: Handy-Teilen-Menü (navigator.share), sonst in die Zwischenablage kopieren
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.sh-copy');
    if (!b) return;
    const text = b.dataset.text;
    const label = b.querySelector('span');
    if (navigator.share) { navigator.share({ text }).catch(() => {}); return; }
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => {
      label.textContent = '✓ Kopiert';
      setTimeout(() => { label.textContent = 'Link teilen'; }, 2000);
    }).catch(() => { label.textContent = text.split(' ').pop(); });
  });

  window.amazonUrl = (query) => {
    const url = new URL('https://www.amazon.de/s');
    url.searchParams.set('k', query);
    if (AMAZON_TAG) url.searchParams.set('tag', AMAZON_TAG);
    return url.toString();
  };

  document.querySelectorAll('a[data-amazon]').forEach((a) => {
    a.href = window.amazonUrl(a.dataset.amazon);
    a.target = '_blank';
    a.rel = 'sponsored nofollow noopener';
  });

  document.querySelectorAll('[data-print]').forEach((b) => b.addEventListener('click', () => window.print()));
  // Zugeklappte Bereiche (z. B. 24-Tage-Plan) beim Drucken aufklappen
  window.addEventListener('beforeprint', () => document.querySelectorAll('details.print-open').forEach((d) => { d.open = true; }));

  // Wichtelnamen-Generator (/wichteltuer/): Namen stehen als JSON im Block, setzt den Namen auch in den Begrüßungsbrief
  const ng = document.querySelector('[data-namegen]');
  if (ng) {
    const data = JSON.parse(ng.querySelector('script[type="application/json"]').textContent);
    let last = 'Onni';
    ng.querySelectorAll('button[data-g]').forEach((b) => b.addEventListener('click', () => {
      const pool = b.dataset.g === 'x' ? data.m.concat(data.w) : data[b.dataset.g];
      let pick;
      do { pick = pool[Math.floor(Math.random() * pool.length)]; } while (pick[0] === last && pool.length > 1);
      last = pick[0];
      ng.querySelector('.ng-name').textContent = pick[0];
      ng.querySelector('.ng-mean').textContent = pick[1];
      document.querySelectorAll('.letter-name').forEach((e) => { e.textContent = pick[0]; });
    }));
  }

  // Footer: am Handy aufklappbare Gruppen, ab 700 px alle offen
  const fq = matchMedia('(min-width: 700px)');
  const fsync = () => document.querySelectorAll('details.fgroup').forEach((d) => { d.open = fq.matches; });
  fsync();
  if (fq.addEventListener) fq.addEventListener('change', fsync);

  // Suche: Index /suche.json wird erst beim Öffnen geladen, alles läuft im Browser
  const sBtn = document.querySelector('.search-btn');
  const sPanel = document.getElementById('search-panel');
  if (sBtn && sPanel) {
    const q = document.getElementById('search-q');
    const list = document.getElementById('search-list');
    const empty = sPanel.querySelector('.search-empty');
    let idx = null, hits = [], cur = -1;
    const norm = (t) => String(t).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/\p{M}/gu, '');
    const load = () => idx || fetch('/suche.json').then((r) => r.json()).then((d) => {
      idx = d.map((e) => Object.assign(e, { nt: norm(e.t), nall: norm(e.t + ' ' + e.d + ' ' + e.k) }));
      return idx;
    });
    const open = () => {
      sPanel.hidden = false; sBtn.setAttribute('aria-expanded', 'true'); q.focus(); q.select();
      Promise.resolve(load()).then(run).catch(() => {});
    };
    const close = () => {
      sPanel.hidden = true; sBtn.setAttribute('aria-expanded', 'false'); q.setAttribute('aria-expanded', 'false'); sBtn.focus();
    };
    const mark = (i) => {
      cur = i;
      list.querySelectorAll('[role=option]').forEach((li, k) => li.setAttribute('aria-selected', String(k === i)));
      const el = list.children[i];
      if (el) { q.setAttribute('aria-activedescendant', el.id); el.scrollIntoView({ block: 'nearest' }); }
      else q.removeAttribute('aria-activedescendant');
    };
    const run = () => {
      if (!idx) return;
      const words = norm(q.value).split(/[\s,]+/).filter((w) => w.length > 1 || /\d/.test(w));
      list.innerHTML = ''; cur = -1; hits = []; q.removeAttribute('aria-activedescendant');
      if (!words.length) { empty.hidden = true; q.setAttribute('aria-expanded', 'false'); return; }
      hits = idx.map((e) => {
        if (!words.every((w) => e.nall.includes(w))) return null;
        let sc = e.g === 's' ? 3 : 0;
        words.forEach((w) => { if (e.nt.includes(w)) sc += 5; if (e.nt.startsWith(w)) sc += 3; });
        return [sc, e];
      }).filter(Boolean).sort((a, b) => b[0] - a[0]).slice(0, 8).map((h) => h[1]);
      hits.forEach((e, i) => {
        const li = document.createElement('li');
        li.id = 'sr-' + i; li.setAttribute('role', 'option'); li.setAttribute('aria-selected', 'false');
        const a = document.createElement('a'); a.href = e.u; a.tabIndex = -1;
        const b = document.createElement('b'); b.textContent = e.t;
        const tag = document.createElement('span'); tag.className = 'sr-tag'; tag.textContent = e.g === 'i' ? 'Geschenkidee' : 'Seite';
        const d = document.createElement('small'); d.textContent = e.d.length > 110 ? e.d.slice(0, 108) + '…' : e.d;
        a.append(b, tag, d); li.append(a); list.append(li);
      });
      empty.hidden = hits.length > 0;
      q.setAttribute('aria-expanded', hits.length > 0 ? 'true' : 'false');
    };
    sBtn.addEventListener('click', () => (sPanel.hidden ? open() : close()));
    sPanel.querySelector('.search-close').addEventListener('click', close);
    q.addEventListener('input', run);
    q.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowDown') { ev.preventDefault(); if (hits.length) mark((cur + 1) % hits.length); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); if (hits.length) mark(cur <= 0 ? hits.length - 1 : cur - 1); }
      else if (ev.key === 'Enter') { const h = hits[cur >= 0 ? cur : 0]; if (h) { ev.preventDefault(); location.href = h.u; } }
      else if (ev.key === 'Escape') { ev.preventDefault(); close(); }
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && !sPanel.hidden) close();
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (ev.key === '/' && sPanel.hidden && !/INPUT|TEXTAREA|SELECT/.test(tag)) { ev.preventDefault(); open(); }
    });
    document.addEventListener('click', (ev) => {
      if (!sPanel.hidden && !sPanel.contains(ev.target) && !sBtn.contains(ev.target)) close();
    });
  }

  // Erklärvideo: erst nach Klick laden (kein Datenverbrauch vorher)
  document.querySelectorAll('[data-video]').forEach((b) => b.addEventListener('click', () => {
    const v = document.createElement('video');
    v.src = b.dataset.video;
    v.poster = b.querySelector('img').src;
    v.controls = true;
    v.playsInline = true;
    v.width = 540;
    v.height = 960;
    b.replaceWith(v);
    v.play().catch(() => {});
    v.focus();
  }));

  // Onnis Adventskalender: Türchen N öffnet sich am N. Dezember um 0 Uhr (deutsche Zeit). Video lädt erst beim Klick.
  const grid = document.querySelector('.ak-grid');
  if (grid) {
    const jahr = +grid.dataset.akJahr;
    const parts = (d) => Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(d).filter((p) => p.type !== 'literal').map((p) => [p.type, +p.value]));
    let heute = parts(new Date());
    // Nur lokal zum Testen: ?datum=2026-12-05
    const test = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).get('datum');
    if (test) { const [y, m, d] = test.split('-').map(Number); heute = { year: y, month: m, day: d }; }
    const tagHeute = Date.UTC(heute.year, heute.month - 1, heute.day) / 864e5;
    const player = document.getElementById('ak-player');
    const msg = document.querySelector('.ak-msg');
    const vid = player.querySelector('video');
    const offen = (n) => tagHeute >= Date.UTC(jahr, 11, n) / 864e5;
    const zeige = (b, scroll) => {
      grid.querySelectorAll('.ak-door.aktiv').forEach((x) => x.classList.remove('aktiv'));
      b.classList.add('aktiv');
      player.querySelector('.ak-titel').textContent = `Türchen ${b.dataset.tag}: ${b.dataset.titel}`;
      vid.poster = b.dataset.poster;
      vid.src = b.dataset.src;
      const yt = b.dataset.yt ? `<a href="${b.dataset.yt}" rel="noopener" target="_blank">▶ Auf YouTube ansehen</a> · ` : '';
      player.querySelector('.ak-links').innerHTML = `${yt}<span class="ak-gross">Für die Großen: <a href="${b.dataset.gross}">${b.dataset.grossText} →</a></span>`;
      // Teilen-Knöpfe für genau dieses Türchen (Vorlage = allgemeine Reihe unter dem Kalender, gleiche Symbole)
      const vorlage = document.querySelector('.share-row:not(.ak-share)');
      const box = player.querySelector('.ak-share');
      if (vorlage && box) {
        const text = `Onnis Adventskalender, Türchen ${b.dataset.tag}: ${b.dataset.titel} 🎄 ${location.origin}/onni-adventskalender/#tag-${b.dataset.tag}`;
        box.innerHTML = vorlage.innerHTML;
        box.querySelector('.sh-wa').href = `https://wa.me/?text=${encodeURIComponent(text)}`;
        box.querySelector('.sh-mail').href = `mailto:?subject=${encodeURIComponent(`Onni, Türchen ${b.dataset.tag} 🎄`)}&body=${encodeURIComponent(text)}`;
        box.querySelector('.sh-copy').dataset.text = text;
      }
      player.hidden = false;
      msg.textContent = '';
      history.replaceState(null, '', `#tag-${b.dataset.tag}`);
      if (scroll) player.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    grid.querySelectorAll('.ak-door').forEach((b) => {
      const n = +b.dataset.tag;
      const info = b.querySelector('.ak-info');
      if (!offen(n)) {
        const rest = Date.UTC(jahr, 11, n) / 864e5 - tagHeute;
        b.classList.add('zu');
        info.textContent = rest === 1 ? 'Morgen!' : `Noch ${rest}× schlafen`;
        b.setAttribute('aria-label', `Türchen ${n} – öffnet sich am ${n}. Dezember`);
        b.addEventListener('click', () => {
          b.classList.remove('wackel'); void b.offsetWidth; b.classList.add('wackel');
          msg.textContent = `Psst … Türchen ${n} öffnet sich erst am ${n}. Dezember.`;
        });
      } else if (b.dataset.src) {
        b.classList.add('auf');
        b.style.backgroundImage = `url("${b.dataset.poster}")`;
        info.textContent = b.dataset.titel;
        b.setAttribute('aria-label', `Türchen ${n}: ${b.dataset.titel} – Video ansehen`);
        b.addEventListener('click', () => { zeige(b, true); vid.play().catch(() => {}); });
      } else {
        b.classList.add('bald');
        info.textContent = 'Kommt gleich';
        b.addEventListener('click', () => { msg.textContent = `Türchen ${n} wird gerade noch gepackt – schau bald wieder vorbei.`; });
      }
    });
    const m = location.hash.match(/^#tag-(\d+)$/);
    const ziel = m && document.getElementById(`tag-${m[1]}`);
    if (ziel && ziel.classList.contains('auf')) zeige(ziel, true);
  }
})();
