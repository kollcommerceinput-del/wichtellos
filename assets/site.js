(() => {
  'use strict';
  // Partner-ID setzt build.py beim Bauen ein (AMAZON_TAG dort) – hier leer lassen
  const AMAZON_TAG = '';

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
})();
