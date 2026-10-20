/* AIkonX analytics + cookie consent.
   One GA4 tag (G-3HVLTC1R3P) loaded once per page with Google Consent Mode v2.
   Analytics storage is denied by default; cookies are only used after the visitor accepts. */
(function () {
  if (window.__aikxGA) return;
  window.__aikxGA = true;

  var GA_ID = 'G-3HVLTC1R3P', KEY = 'aikx_cookie_consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var saved = stored();
  gtag('consent', 'default', {
    analytics_storage: saved === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    wait_for_update: 500
  });
  gtag('js', new Date());
  gtag('config', GA_ID); /* sends the single automatic page_view */

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  function setConsent(v) {
    store(v);
    gtag('consent', 'update', { analytics_storage: v });
  }

  var css = '.aikx-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:560px;background:#0b1220;color:#fff;padding:20px 22px;font:400 14px/1.5 Inter,"Helvetica Neue",Arial,sans-serif;box-shadow:0 18px 48px rgba(10,25,55,.35)}' +
    '.aikx-cc[hidden]{display:none}' +
    '.aikx-cc h2{margin:0 0 6px;font-size:16px;font-weight:600;color:#fff}' +
    '.aikx-cc p{margin:0 0 14px;color:rgba(255,255,255,.8)}' +
    '.aikx-cc a{color:#7eb6ee;text-decoration:underline}' +
    '.aikx-cc__row{display:flex;gap:10px;flex-wrap:wrap}' +
    '.aikx-cc button{height:42px;padding:0 20px;font:600 14px Inter,Arial,sans-serif;cursor:pointer;border:1.5px solid #fff;background:transparent;color:#fff}' +
    '.aikx-cc button.aikx-cc__ok{background:#006cd2;border-color:#006cd2}' +
    '.aikx-cc button:hover{opacity:.88}.aikx-cc button:focus-visible{outline:2px solid #7eb6ee;outline-offset:2px}' +
    '@media(min-width:620px){.aikx-cc{left:24px;right:auto;bottom:24px}}';

  var box;
  function build() {
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    box = document.createElement('div');
    box.className = 'aikx-cc';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie consent');
    box.hidden = true;
    box.innerHTML = '<h2>Cookies on AIkonX</h2><p>We use analytics cookies to understand how the site is used and improve it. They are only set if you accept. See our <a href="/privacy/">Privacy Policy</a>.</p>' +
      '<div class="aikx-cc__row"><button type="button" class="aikx-cc__ok">Accept analytics</button><button type="button" class="aikx-cc__no">Decline</button></div>';
    document.body.appendChild(box);
    box.querySelector('.aikx-cc__ok').addEventListener('click', function () { setConsent('granted'); box.hidden = true; });
    box.querySelector('.aikx-cc__no').addEventListener('click', function () { setConsent('denied'); box.hidden = true; });
    if (!saved) box.hidden = false;

    /* Footer "Cookies" links reopen the banner so visitors can change their choice. */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('footer a');
      if (a && /^cookies$/i.test(a.textContent.trim())) { e.preventDefault(); box.hidden = false; }
    });
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
