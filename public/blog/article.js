/* Shared blog article behaviour: auto table of contents, active section highlight, reading progress. */
(function () {
  var art = document.querySelector('body.post-page article.prose');
  if (!art) return;
  var heads = [].slice.call(art.querySelectorAll('h2'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var used = {};

  function slug(t) {
    var s = t.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '');
    return s || 'section';
  }
  heads.forEach(function (h) {
    if (!h.id) {
      var base = slug(h.textContent), id = base, n = 2;
      while (used[id] || document.getElementById(id)) { id = base + '-' + n++; }
      h.id = id;
    }
    used[h.id] = true;
  });

  var links = [];
  function build() {
    var ol = document.createElement('ol');
    heads.forEach(function (h) {
      var li = document.createElement('li'), a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.setAttribute('data-target', h.id);
      li.appendChild(a); ol.appendChild(li); links.push(a);
    });
    return ol;
  }

  if (heads.length) {
    var side = document.createElement('nav');
    side.className = 'toc toc--side';
    side.setAttribute('aria-label', 'In this article');
    var t = document.createElement('p');
    t.className = 'toc__title'; t.textContent = 'In this article';
    side.appendChild(t); side.appendChild(build());
    art.parentNode.insertBefore(side, art);

    var det = document.createElement('details');
    det.className = 'toc toc--mobile';
    var sum = document.createElement('summary');
    sum.textContent = 'Contents';
    var nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Contents');
    nav.appendChild(build());
    det.appendChild(sum); det.appendChild(nav);
    var hero = document.querySelector('.pagehero');
    if (hero) hero.appendChild(det);

    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var h = document.getElementById(a.getAttribute('data-target'));
        if (!h) return;
        e.preventDefault();
        if (det.contains(a)) det.open = false;
        h.scrollIntoView({ behavior: reduce && reduce.matches ? 'auto' : 'smooth', block: 'start' });
        if (history.pushState) history.pushState(null, '', '#' + h.id);
        h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      });
    });
  }

  var bar = document.createElement('div');
  bar.className = 'read-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  var ticking = false;
  function update() {
    ticking = false;
    var r = art.getBoundingClientRect();
    var total = r.height - window.innerHeight * 0.6;
    var p = total > 0 ? (-r.top + window.innerHeight * 0.2) / total : 0;
    p = Math.max(0, Math.min(1, p));
    bar.style.transform = 'scaleX(' + p + ')';
    var cur = null;
    heads.forEach(function (h) { if (h.getBoundingClientRect().top <= 140) cur = h.id; });
    links.forEach(function (a) {
      var on = a.getAttribute('data-target') === cur;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  update();
})();
