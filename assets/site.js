(() => {
  'use strict';
  // Nach der Anmeldung bei Amazon PartnerNet hier die Partner-ID eintragen, z. B. 'wichtellos-21'
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
})();
