(() => {
  'use strict';
  // Partner-ID setzt build.py beim Bauen ein (AMAZON_TAG dort) – hier leer lassen
  const AMAZON_TAG = 'wichtellos-21';

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
