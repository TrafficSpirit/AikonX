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

/* Article layout v2 (opt-in via body.post-v2): summary card, pull quote, share rows, table scroll hint. */
(function () {
  if (!document.body.classList.contains('post-v2')) return;
  var art = document.querySelector('body.post-page article.prose');
  if (!art) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var heads = [].slice.call(art.querySelectorAll('h2'));
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt) e.textContent = txt;
    return e;
  }

  /* Summary card: links to every section, same order and text as the contents list */
  if (heads.length) {
    var card = el('div', 'v2-sum');
    card.appendChild(el('p', 'v2-sum__title', 'In this article'));
    var ol = el('ol');
    heads.forEach(function (h) {
      var li = el('li'), a = el('a', '', h.textContent);
      a.href = '#' + h.id;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        h.scrollIntoView({ behavior: reduce && reduce.matches ? 'auto' : 'smooth', block: 'start' });
        if (history.pushState) history.pushState(null, '', '#' + h.id);
        h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      });
      li.appendChild(a); ol.appendChild(li);
    });
    card.appendChild(ol);
    art.insertBefore(card, art.firstChild);
  }

  /* Pull quote: repeats an existing sentence marked data-pull (decorative, hidden from screen readers) */
  var pull = art.querySelector('[data-pull]');
  if (pull && pull.closest('p')) {
    var p = pull.closest('p');
    var bq = el('blockquote', 'v2-pull', pull.textContent);
    bq.setAttribute('aria-hidden', 'true');
    p.parentNode.insertBefore(bq, p.nextSibling);
  }

  /* Share rows: sidebar (desktop) and after the article (mobile) */
  var canon = document.querySelector('link[rel="canonical"]');
  var url = canon ? canon.href : location.href.split('#')[0];
  var h1 = document.querySelector('h1');
  var title = h1 ? h1.textContent : document.title;
  var ICONS = {
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
  };
  function shareRow(mod) {
    var wrap = el('div', 'v2-share v2-share--' + mod);
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Share');
    wrap.appendChild(el('span', 'v2-share__label', 'Share'));
    var row = el('div', 'v2-share__row');
    var status = el('span', 'v2-share__status');
    status.setAttribute('role', 'status');
    var copy = el('button', 'v2-share__btn');
    copy.type = 'button';
    copy.setAttribute('aria-label', 'Copy link');
    copy.title = 'Copy link';
    copy.innerHTML = ICONS.link;
    copy.addEventListener('click', function () {
      function ok() { status.textContent = 'Link copied'; setTimeout(function () { status.textContent = ''; }, 2400); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(ok, function () { window.prompt('Copy link', url); });
      } else {
        window.prompt('Copy link', url);
      }
    });
    function ext(label, href, icon) {
      var a = el('a', 'v2-share__btn');
      a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', label); a.title = label;
      a.innerHTML = icon;
      return a;
    }
    row.appendChild(copy);
    row.appendChild(ext('Share on LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url), ICONS.li));
    row.appendChild(ext('Share on X', 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title), ICONS.x));
    wrap.appendChild(row);
    wrap.appendChild(status);
    return wrap;
  }
  var side = document.querySelector('.toc--side');
  if (side) side.appendChild(shareRow('side'));
  var author = art.querySelector('.v2-author');
  var end = shareRow('end');
  if (author) art.insertBefore(end, author); else art.appendChild(end);

  /* Tables: keyboard-scrollable region and a sideways-scroll hint when the table overflows */
  var tbls = [].slice.call(art.querySelectorAll('.sp-tbl'));
  tbls.forEach(function (t) {
    t.setAttribute('tabindex', '0');
    t.setAttribute('role', 'region');
    t.setAttribute('aria-label', 'Scrollable table');
    var hint = el('p', 'sp-hint', 'Scroll sideways to see more');
    hint.hidden = true;
    t.parentNode.insertBefore(hint, t);
    t._hint = hint;
    t.addEventListener('scroll', function () {
      if (t.scrollLeft > 8) { t._seen = true; hint.hidden = true; }
    }, { passive: true });
  });
  function checkTables() {
    tbls.forEach(function (t) { t._hint.hidden = !!t._seen || !(t.scrollWidth > t.clientWidth + 2); });
  }
  window.addEventListener('resize', checkTables);
  window.addEventListener('load', checkTables);
  checkTables();
})();
