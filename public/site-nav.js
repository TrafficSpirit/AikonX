/* AIkonX shared site header: top bar + mega-menu nav, injected on every page. */
(function () {
  if (window.__sxNav) return;
  window.__sxNav = true;

  var TEL = 'tel:+61413082803', PHONE = '0413 082 803';
  var ARROW = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h10.2M10.4 5.6 15.2 10l-4.8 4.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CARET = '<svg class="sx-caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var ICONS = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.4-4.4"/>',
    cursor: '<path d="M5 3l14 7.5-6.2 1.8L10.5 19z"/>',
    funnel: '<path d="M3 5h18l-7 8.2V19l-4-2v-3.8z"/>',
    chart: '<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.4 2.7-6 6-6s6 2.6 6 6"/><path d="M16 5.2a3.2 3.2 0 010 5.6M18.2 14.4c1.9.8 3 2.6 3 5.6"/>',
    book: '<path d="M5 4h14v16H5z"/><path d="M9 8.5h6M9 12.5h6"/>',
    shield: '<path d="M12 3l8 3v6c0 4.8-3.4 7.9-8 9-4.6-1.1-8-4.2-8-9V6z"/>'
  };

  var AISEO = [
    { t: 'AI &amp; Search Visibility', i: 'search', l: [
      ['AI Search Optimization (GEO)', '/services/ai-search-optimization/'],
      ['SEO', '/services/seo/'],
      ['Local SEO', '/services/local-seo/']] },
    { t: 'Content &amp; Nurture', i: 'book', l: [
      ['Content Marketing', '/services/content-marketing/'],
      ['Email Marketing &amp; Lead Nurture', '/services/email-marketing/']] }
  ];

  var PAID = [
    { t: 'Search Ads', i: 'search', l: [
      ['Google &amp; Microsoft Ads', '/services/google-ads/'],
      ['Google Local Services Ads', '/services/local-services-ads/']] },
    { t: 'Social &amp; Display', i: 'cursor', l: [
      ['Paid Social Advertising', '/services/paid-social/'],
      ['Display &amp; Remarketing', '/services/display-remarketing/']] },
    { t: 'Track the Results', i: 'chart', l: [
      ['Call Tracking', '/services/call-tracking/']] }
  ];

  var UX = [
    { t: 'Design &amp; Conversion', i: 'funnel', l: [
      ['Website Design &amp; Development', '/services/web-design/'],
      ['Landing Pages &amp; Funnels', '/services/landing-pages/'],
      ['Conversion Rate Optimization', '/services/conversion-rate-optimization/']] },
    { t: 'Data &amp; Insight', i: 'chart', l: [
      ['Analytics &amp; Tracking Setup', '/services/analytics-tracking/'],
      ['Attribution &amp; Reporting', '/services/attribution-reporting/'],
      ['Marketing Audits', '/services/marketing-audits/']] }
  ];

  var ABOUT = [
    { t: 'Who we are', i: 'users', l: [
      ['About AIkonX', '/about/'],
      ['Our results', '/#results'],
      ['Contact us', '/contact/']] },
    { t: 'Resources', i: 'book', l: [
      ['Free marketing audit', '/contact/'],
      ['Frequently asked questions', '/#faq'],
      ['All services', '/services/']] },
    { t: 'Legal', i: 'shield', l: [
      ['Privacy policy', '/privacy/'],
      ['Terms of use', '/terms/']] }
  ];

  var CSS = `
:root{--sx-h:116px;--sx-blue:#006cd2;--sx-navy:#0b1220}
html{scroll-padding-top:96px}
html.sx-lock{overflow:hidden}
body>header.nav,body>.mobile-menu{display:none!important}
body .pagehero{padding-top:calc(var(--sx-h) + clamp(40px,6vw,80px))}
.sx-wrap{--sx-pad:var(--pad-x,clamp(20px,3.52vw,64px));position:fixed;top:0;left:0;right:0;z-index:100;font-family:var(--font,'Inter','Helvetica Neue',Helvetica,Arial,sans-serif);-webkit-font-smoothing:antialiased}
.sx-wrap *,.sx-wrap *::before,.sx-wrap *::after{box-sizing:border-box}
.sx-wrap ul{list-style:none;margin:0;padding:0}
.sx-wrap a{color:inherit;text-decoration:none}
.sx-top{background:var(--sx-navy);color:#fff;font-size:13px;max-height:40px;overflow:hidden;transition:max-height .3s cubic-bezier(.16,1,.3,1)}
.sx-wrap.is-scrolled .sx-top{max-height:0}
.sx-top__in{display:flex;align-items:center;justify-content:space-between;gap:24px;height:40px;padding:0 var(--sx-pad)}
.sx-top__promo{display:flex;align-items:center;gap:12px;min-width:0;white-space:nowrap}
.sx-top__label{color:#7eb6ee;font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:11.5px}
.sx-top__promo strong{font-weight:500;overflow:hidden;text-overflow:ellipsis}
.sx-top__promo:hover strong{text-decoration:underline}
.sx-top__right{display:flex;align-items:center;gap:20px}
.sx-top__phone{font-weight:500}
.sx-top__phone:hover{color:#7eb6ee}
.sx-btn{display:inline-flex;align-items:center;justify-content:center;gap:12px;height:46px;padding:0 20px;background:var(--sx-blue);color:#fff!important;font-size:15px;font-weight:600;letter-spacing:-.01em;white-space:nowrap;transition:background .2s}
.sx-btn:hover{background:#004a96}
.sx-btn svg{width:14px;height:14px;transition:transform .2s}
.sx-btn:hover svg{transform:translateX(3px)}
.sx-btn--sm{height:28px;padding:0 14px;font-size:12.5px}
.sx-btn--light{background:#fff;color:var(--sx-blue)!important}
.sx-btn--light:hover{background:#e8f2fb}
.sx-header{position:relative;background:#fff;border-bottom:1px solid #e6e8ea;transition:box-shadow .3s}
.sx-wrap.is-scrolled .sx-header{box-shadow:0 12px 32px rgba(10,25,55,.12)}
.sx-header__in{display:flex;align-items:center;gap:clamp(20px,2.4vw,40px);height:76px;padding:0 var(--sx-pad)}
.sx-logo{display:inline-flex;flex:0 0 auto}
.sx-logo img{height:44px;width:auto;display:block}
.sx-nav{align-self:stretch;display:flex}
.sx-nav__list{display:flex;align-items:stretch}
.sx-item{display:flex;align-items:stretch}
.sx-link{position:relative;display:inline-flex;align-items:center;gap:7px;padding:0 clamp(12px,1.3vw,20px);color:#0a0a0a;font-size:15px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;transition:color .2s}
.sx-link::after{content:'';position:absolute;left:clamp(12px,1.3vw,20px);right:clamp(12px,1.3vw,20px);bottom:0;height:3px;background:var(--sx-blue);transform:scaleX(0);transform-origin:left;transition:transform .28s cubic-bezier(.16,1,.3,1)}
.sx-item:hover>.sx-link,.sx-item.is-open>.sx-link,.sx-link[aria-current='page']{color:var(--sx-blue)}
.sx-item:hover>.sx-link::after,.sx-item.is-open>.sx-link::after,.sx-link[aria-current='page']::after{transform:scaleX(1)}
.sx-caret{width:10px;height:10px;transition:transform .25s}
.sx-item.is-open .sx-caret{transform:rotate(180deg)}
.sx-actions{margin-left:auto}
.sx-mega{position:absolute;left:0;right:0;top:100%;background:#fff;border-top:1px solid #e6e8ea;box-shadow:0 30px 50px -28px rgba(10,25,55,.32);opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .2s ease,transform .25s cubic-bezier(.16,1,.3,1),visibility .2s}
.sx-item.is-open>.sx-mega{opacity:1;visibility:visible;transform:none}
.sx-mega__in{max-width:1400px;margin:0 auto;display:grid;gap:28px 40px;padding:34px var(--sx-pad) 22px;align-items:start}
.sx-cols-4{grid-template-columns:repeat(4,minmax(0,1fr)) minmax(240px,300px)}
.sx-cols-3{grid-template-columns:repeat(3,minmax(0,1fr)) minmax(240px,300px)}
.sx-cols-2{grid-template-columns:repeat(2,minmax(0,320px)) minmax(240px,300px);justify-content:start}
.sx-group__h{display:flex;align-items:center;gap:12px;margin-bottom:12px;font-size:15px;font-weight:600;color:#0a0a0a}
.sx-ico{display:grid;place-items:center;width:38px;height:38px;flex:0 0 auto;border-radius:50%;background:#eaf3fc;color:var(--sx-blue)}
.sx-ico svg{width:19px;height:19px}
.sx-group li a{display:block;padding:7px 0 7px 50px;font-size:14.5px;line-height:1.35;color:#1a1a1a;transition:color .15s,transform .15s}
.sx-group li a:hover{color:var(--sx-blue);transform:translateX(3px)}
.sx-feature{background:var(--sx-navy);color:#fff;padding:26px 24px}
.sx-feature__tag{display:inline-block;color:#7eb6ee;font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.sx-feature h3{margin:10px 0 0;font-size:1.35rem;font-weight:600;letter-spacing:-.02em;line-height:1.2;color:#fff}
.sx-feature p{margin:10px 0 18px;color:rgba(255,255,255,.66);font-size:14px;line-height:1.55}
.sx-mega__foot{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #ececec;padding-top:14px}
.sx-all{color:var(--sx-blue)!important;font-weight:600;font-size:14.5px}
.sx-all:hover{text-decoration:underline}
.sx-close{margin-left:auto;background:none;border:0;color:#6b7378;font:inherit;font-size:13.5px;cursor:pointer;padding:4px 0}
.sx-close:hover{color:#0a0a0a}
@media(max-width:1240px){
.sx-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}
.sx-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.sx-cols-2{grid-template-columns:repeat(2,minmax(0,1fr));justify-content:normal}
.sx-group li a{padding-left:0}
.sx-feature{grid-column:1/-1;display:flex;align-items:center;gap:24px;flex-wrap:wrap}
.sx-feature h3,.sx-feature p{margin:0}
.sx-feature p{flex:1 1 260px}
}
.sx-burger{display:none;width:44px;height:44px;margin-left:auto;background:none;border:0;cursor:pointer;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:0}
.sx-burger span{display:block;width:22px;height:2px;background:#0a0a0a;transition:transform .25s,opacity .2s}
.sx-burger.is-open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.sx-burger.is-open span:nth-child(2){opacity:0}
.sx-burger.is-open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.sx-mobile{display:none}
@media(max-width:1000px){
:root{--sx-h:64px}
.sx-top,.sx-nav,.sx-actions{display:none}
.sx-header__in{height:64px}
.sx-logo img{height:36px}
.sx-burger{display:flex}
.sx-mobile:not([hidden]){display:block;position:fixed;top:64px;left:0;right:0;bottom:0;overflow-y:auto;background:#fff;padding:8px var(--sx-pad) 40px;border-top:1px solid #e6e8ea}
.sx-m-link,.sx-m-acc>summary{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid #ececec;font-size:17px;font-weight:500;color:#0a0a0a;cursor:pointer;list-style:none}
.sx-m-acc>summary::-webkit-details-marker{display:none}
.sx-m-acc[open]>summary .sx-caret{transform:rotate(180deg)}
.sx-m-acc__body{padding:6px 0 14px 4px}
.sx-m-h{margin:14px 0 4px;color:var(--sx-blue);font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.sx-m-acc__body a{display:block;padding:9px 0;font-size:15.5px;color:#1a1a1a}
.sx-m-acc__body a.sx-m-all{color:var(--sx-blue);font-weight:600;margin-top:8px}
.sx-m-cta{margin-top:24px;display:flex;flex-direction:column;gap:14px}
.sx-m-cta .sx-btn{width:100%}
.sx-m-phone{text-align:center;font-weight:600;color:#0a0a0a}
}
.footer__entity{display:block;margin-top:4px}
@media(prefers-reduced-motion:reduce){.sx-wrap *{transition:none!important}}
`;

  function ico(n) {
    return '<span class="sx-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICONS[n] + '</svg></span>';
  }
  function link(l) { return '<a href="' + l[1] + '">' + l[0] + '</a>'; }
  function groups(list) {
    return list.map(function (g) {
      return '<div class="sx-group"><div class="sx-group__h">' + ico(g.i) + '<span>' + g.t + '</span></div><ul>' +
        g.l.map(function (l) { return '<li>' + link(l) + '</li>'; }).join('') + '</ul></div>';
    }).join('');
  }
  function mega(id, list, f, all) {
    return '<div class="sx-mega" id="' + id + '"><div class="sx-mega__in sx-cols-' + list.length + '">' + groups(list) +
      '<aside class="sx-feature"><span class="sx-feature__tag">' + f.tag + '</span><h3>' + f.title + '</h3><p>' + f.text + '</p>' +
      '<a class="sx-btn sx-btn--light" href="' + f.href + '"><span>' + f.cta + '</span>' + ARROW + '</a></aside>' +
      '<div class="sx-mega__foot">' + (all ? '<a class="sx-all" href="' + all[0] + '">' + all[1] + ' &rarr;</a>' : '') +
      '<button type="button" class="sx-close">Close <span aria-hidden="true">&times;</span></button></div></div></div>';
  }
  function mobAcc(label, list, all) {
    return '<details class="sx-m-acc"><summary>' + label + CARET + '</summary><div class="sx-m-acc__body">' +
      list.map(function (g) { return '<p class="sx-m-h">' + g.t + '</p>' + g.l.map(link).join(''); }).join('') +
      (all ? '<a class="sx-m-all" href="' + all[0] + '">' + all[1] + ' &rarr;</a>' : '') + '</div></details>';
  }

  var MENUS = [
    { id: 'sx-mega-seo', label: 'AI Search &amp; SEO', href: '/services/seo/', list: AISEO,
      f: { tag: 'Free', title: 'SEO &amp; AI visibility review', text: 'See where you rank in search, where AI assistants mention you, and what to fix first.', href: '/contact/', cta: 'Get my free review' },
      all: ['/services/', 'View all services'] },
    { id: 'sx-mega-paid', label: 'Paid Search', href: '/services/google-ads/', list: PAID,
      f: { tag: 'Free', title: 'Ad account audit', text: 'We review your Google, Microsoft and social ad accounts and show where budget is leaking.', href: '/contact/', cta: 'Get my free audit' },
      all: ['/services/', 'View all services'] },
    { id: 'sx-mega-ux', label: 'UX &amp; AI Services', href: '/services/web-design/', list: UX,
      f: { tag: 'Free', title: 'Conversion review', text: 'We look at your site, tracking and funnel and show where visitors drop off.', href: '/contact/', cta: 'Get my free review' },
      all: ['/services/', 'View all services'] },
    { id: 'sx-mega-about', label: 'About', href: '/about/', list: ABOUT,
      f: { tag: 'Let\'s talk', title: 'Ready to grow?', text: 'Tell us your goals and we will come back with a plan within two business days.', href: '/contact/', cta: 'Get a Proposal' },
      all: null }
  ];
  var navItems = MENUS.map(function (m) {
    return '<li class="sx-item sx-item--mega"><a class="sx-link" href="' + m.href + '" aria-haspopup="true" aria-expanded="false" aria-controls="' + m.id + '">' + m.label + CARET + '</a>' + mega(m.id, m.list, m.f, m.all) + '</li>';
  }).join('');
  var mobItems = MENUS.map(function (m) { return mobAcc(m.label, m.list, m.all); }).join('');

  var html =
    '<div class="sx-wrap" id="sx-wrap">' +
    '<div class="sx-top"><div class="sx-top__in">' +
    '<a class="sx-top__promo" href="/contact/"><span class="sx-top__label">Free marketing audit</span><strong>See where your ad spend is leaking</strong></a>' +
    '<div class="sx-top__right"><a class="sx-top__phone" href="' + TEL + '">' + PHONE + '</a><a class="sx-btn sx-btn--sm" href="/contact/">Get a Proposal</a></div>' +
    '</div></div>' +
    '<header class="sx-header"><div class="sx-header__in">' +
    '<a class="sx-logo" href="/" aria-label="AIkonX home"><img src="/assets/images/logo-slogan.svg" alt="AIkonX - Ready to Take Off" width="1764" height="532"></a>' +
    '<nav class="sx-nav" aria-label="Primary"><ul class="sx-nav__list">' +
    navItems +
    '</ul></nav>' +
    '<div class="sx-actions"><a class="sx-btn" href="/contact/"><span>Get a Proposal</span>' + ARROW + '</a></div>' +
    '<button class="sx-burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="sx-mobile"><span></span><span></span><span></span></button>' +
    '</div></header>' +
    '<div class="sx-mobile" id="sx-mobile" hidden>' +
    mobItems +
    '<div class="sx-m-cta"><a class="sx-btn" href="/contact/"><span>Get a Proposal</span>' + ARROW + '</a><a class="sx-m-phone" href="' + TEL + '">' + PHONE + '</a></div>' +
    '</div></div>';

  var st = document.createElement('style');
  st.id = 'sx-css';
  st.textContent = CSS;
  document.head.appendChild(st);
  document.body.insertAdjacentHTML('afterbegin', html);

  function dropLegacy() {
    var old = document.querySelectorAll('body > header.nav, body > .mobile-menu');
    for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
  }
  dropLegacy();
  document.addEventListener('DOMContentLoaded', dropLegacy);

  /* Blog lives in the footer (Company column) rather than the navbar. */
  function addFooterBlog() {
    if (document.querySelector('[data-sx-blog]')) return;
    var cols = document.querySelectorAll('.footer__col'), target = null;
    for (var i = 0; i < cols.length; i++) {
      var h = cols[i].querySelector('h3');
      if (h && /^(company|about)$/i.test(h.textContent.trim())) { target = cols[i]; break; }
    }
    if (!target && cols.length) target = cols[0];
    if (!target) return;
    var a = document.createElement('a');
    a.href = '/blog/';
    a.textContent = 'Blog';
    a.setAttribute('data-sx-blog', '');
    target.appendChild(a);
  }
  addFooterBlog();
  document.addEventListener('DOMContentLoaded', addFooterBlog);

  /* Legal entity details (ABN/ACN) in the footer bottom bar, on every page. */
  var ENTITY = 'Aikonx Pty Ltd &middot; ABN 73 699 508 480 &middot; ACN 699 508 480';
  function addFooterEntity() {
    if (document.querySelector('[data-sx-entity]')) return;
    var copy = document.querySelector('.footer__copy');
    if (!copy) return;
    var s = document.createElement('span');
    s.className = 'footer__entity';
    s.setAttribute('data-sx-entity', '');
    s.innerHTML = ENTITY;
    copy.appendChild(s);
  }
  addFooterEntity();
  document.addEventListener('DOMContentLoaded', addFooterEntity);

  var wrap = document.getElementById('sx-wrap');
  var items = wrap.querySelectorAll('.sx-item--mega');
  var canHover = window.matchMedia && window.matchMedia('(hover:hover)').matches;

  function setOpen(it, on) {
    clearTimeout(it._t);
    it.classList.toggle('is-open', on);
    it.querySelector('.sx-link').setAttribute('aria-expanded', String(on));
  }
  function closeAll() { for (var i = 0; i < items.length; i++) setOpen(items[i], false); }
  function openOnly(it) {
    for (var i = 0; i < items.length; i++) if (items[i] !== it) setOpen(items[i], false);
    setOpen(it, true);
  }

  Array.prototype.forEach.call(items, function (it) {
    var lnk = it.querySelector('.sx-link');
    it.addEventListener('mouseenter', function () { if (canHover) openOnly(it); });
    it.addEventListener('mouseleave', function () { it._t = setTimeout(function () { setOpen(it, false); }, 140); });
    lnk.addEventListener('click', function (e) {
      if (!it.classList.contains('is-open')) { e.preventDefault(); openOnly(it); }
    });
    it.querySelector('.sx-close').addEventListener('click', function () { setOpen(it, false); lnk.focus(); });
    it.addEventListener('focusout', function (e) { if (!e.relatedTarget || !it.contains(e.relatedTarget)) setOpen(it, false); });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.sx-item--mega')) closeAll(); });

  var burger = wrap.querySelector('.sx-burger');
  var mobile = document.getElementById('sx-mobile');
  function setMobile(on) {
    mobile.hidden = !on;
    burger.classList.toggle('is-open', on);
    burger.setAttribute('aria-expanded', String(on));
    burger.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
    document.documentElement.classList.toggle('sx-lock', on);
  }
  burger.addEventListener('click', function () { setMobile(mobile.hidden); });
  mobile.addEventListener('click', function (e) { if (e.target.closest('a')) setMobile(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1000 && !mobile.hidden) setMobile(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAll(); if (!mobile.hidden) setMobile(false); }
  });

  function onScroll() { wrap.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var p = location.pathname, curId = '';
  if (p.indexOf('/about') === 0) curId = 'sx-mega-about';
  else if (p.indexOf('/services/') === 0) {
    MENUS.forEach(function (m) {
      m.list.forEach(function (g) {
        g.l.forEach(function (l) { if (l[1] !== '/services/' && p.indexOf(l[1]) === 0) curId = m.id; });
      });
    });
  }
  var links = wrap.querySelectorAll('.sx-nav__list .sx-link');
  for (var k = 0; k < links.length; k++) {
    if (curId && links[k].getAttribute('aria-controls') === curId) links[k].setAttribute('aria-current', 'page');
  }
})();
