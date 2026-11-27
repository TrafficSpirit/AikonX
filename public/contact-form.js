/* Only a positive JSON receipt from the enquiry backend counts as success. */
(function () {
  var DAPEM_SRC = 'https://dapem.toolsforscale.com/api/measurement/client/ff4f8cf5cd9d86cdf1655d586304859b588d92a921576354.js';
  function consented() { try { return localStorage.getItem('aikx_cookie_consent') === 'granted'; } catch (e) { return false; } }
  /* AI Search & SEO branch: a visitor whose FIRST page of the session starts with one of these paths is labelled
     with the branch. Edit this one list to add or remove pages (paths only, lower case, trailing slash). */
  var BRANCH_NAME = 'AI Search & SEO';
  var BRANCH_PREFIXES = [
    '/services/ai-search-optimization/',
    '/services/ai-search-optimisation/',
    '/services/generative-engine-optimisation/',
    '/services/answer-engine-optimisation/',
    '/services/chatgpt-seo/',
    '/pricing/seo-packages/',
    '/ai-visibility-audit/',
    '/services/seo/',
    '/services/local-seo/',
    '/blog/generative-engine-optimisation/',
    '/blog/get-cited-in-google-ai-overviews/',
    '/blog/ai-visibility-reports-explained/',
    '/blog/brand-ai-overviews-right-column/',
    '/blog/deepseek-search-api-authority-tiers/',
    '/blog/ai-visibility-audit/'
  ];
  /* Required choice fields and their error text. */
  var CHOICES = [
    ['budget_band', 'Please choose your monthly marketing budget.'],
    ['term_openness', 'Please tell us whether you are open to a 12-month engagement.']
  ];
  /* First page of the session, path only. First-party sessionStorage; holds no personal data. */
  function captureLanding() {
    try {
      var stored = sessionStorage.getItem('aikx_landing_page');
      if (!stored) { stored = location.pathname; sessionStorage.setItem('aikx_landing_page', stored); }
      return stored;
    } catch (e) { return location.pathname; }
  }
  function referrerPage() {
    try {
      if (!document.referrer) return '';
      var u = new URL(document.referrer);
      if (u.protocol !== 'https:' && u.protocol !== 'http:') return '';
      return u.origin + u.pathname;
    } catch (e) { return ''; }
  }
  function branchFor(path) {
    var p = String(path || '').toLowerCase();
    if (p.charAt(p.length - 1) !== '/') p += '/';
    for (var i = 0; i < BRANCH_PREFIXES.length; i++) if (p.indexOf(BRANCH_PREFIXES[i]) === 0) return BRANCH_NAME;
    return '';
  }
  function observe(id, testId) {
    if (!consented()) return;
    function send() {
      var d = window.dapemMeasurement;
      if (!d) return;
      d.setConsent(consented());
      if (consented()) d.track('enquiry_submitted', { eventId: id, formId: 'contact', path: location.pathname, testId: testId || undefined });
    }
    if (window.dapemMeasurement) { send(); return; }
    var script = document.createElement('script');
    script.src = DAPEM_SRC; script.async = true; script.onload = send;
    document.head.appendChild(script);
  }
  window.addEventListener('aikx:analytics-consent', function (event) {
    if (window.dapemMeasurement) window.dapemMeasurement.setConsent(event.detail === true);
  });
  // Visiting /thank-you/ does not prove a submission was accepted.
  var landing = captureLanding();
  var form = document.querySelector('.contact-form');
  if (!form) return;
  var note = form.querySelector('.contact-form__note');
  var btn = form.querySelector('button[type="submit"]');
  var label = btn ? btn.querySelector('.btn__label') : null;
  var idle = label ? label.textContent : '';
  var submissionId = null;
  var inFlight = false;
  function setHidden(name, value) {
    var el = form.querySelector('[name="' + name + '"]');
    if (!el) { el = document.createElement('input'); el.type = 'hidden'; el.name = name; form.appendChild(el); }
    el.value = value;
  }
  function syncHidden() {
    setHidden('landing_page', landing);
    setHidden('referrer_page', referrerPage());
    setHidden('branch', branchFor(landing));
  }
  function fieldValue(name) { var el = form.querySelector('[name="' + name + '"]'); return el && typeof el.value === 'string' ? el.value : ''; }
  function clearError(el) {
    var err = el.parentNode && el.parentNode.querySelector('.field__error');
    if (err) { err.textContent = ''; err.hidden = true; }
    el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby');
  }
  /* Visible error text plus focus on the first unanswered required choice. */
  function validateChoices() {
    var first = null;
    CHOICES.forEach(function (choice) {
      var el = form.querySelector('[name="' + choice[0] + '"]');
      if (!el) return;
      if (el.required && !el.value) {
        var err = el.parentNode.querySelector('.field__error');
        if (!err) {
          err = document.createElement('p'); err.className = 'field__error'; err.id = (el.id || choice[0]) + '-error';
          err.setAttribute('role', 'alert'); el.parentNode.appendChild(err);
        }
        err.textContent = choice[1]; err.hidden = false;
        el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', err.id);
        if (!first) first = el;
      } else clearError(el);
    });
    if (first) { first.focus(); return false; }
    return true;
  }
  form.addEventListener('change', function (event) {
    var el = event && event.target;
    if (el && el.getAttribute && el.getAttribute('aria-invalid') === 'true' && el.value) clearError(el);
  });
  syncHidden();
  function say(message, ok) { if (note) { note.textContent = message; note.style.color = ok ? '' : '#e5483a'; note.hidden = false; } }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (inFlight) return;
    var trap = form.querySelector('[name="bot-field"]');
    if (trap && trap.value) return;
    if (!validateChoices()) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    syncHidden();
    /* Analytics payload: choice/page values only. Never name, email, company or message text. */
    var lead = { form_name: 'contact', form_page: location.pathname, budget_band: fieldValue('budget_band'), branch: branchFor(landing), landing_page: landing };
    inFlight = true;
    submissionId = submissionId || crypto.randomUUID();
    var data = new URLSearchParams(new FormData(form));
    var testId = new URLSearchParams(location.hash.slice(1)).get('dapem-test');
    data.set('dapem_event_id', submissionId);
    data.set('dapem_path', location.pathname);
    data.set('dapem_analytics_consent', consented() ? 'granted' : 'denied');
    if (testId && /^[a-f0-9-]{36}$/i.test(testId)) data.set('dapem_test_id', testId);
    if (btn) btn.disabled = true;
    if (label) label.textContent = 'Sending...';
    if (note) note.hidden = true;
    fetch('/contact-submit.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }, body: data.toString() })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      }).then(function (result) {
        if (result.accepted !== true || !result.eventId) throw new Error('The server did not confirm this enquiry.');
        if (consented() && typeof window.gtag === 'function') window.gtag('event', 'generate_lead', lead);
        observe(result.eventId, testId);
        say('Thanks! We will be in touch within two business days.', true);
        form.reset(); submissionId = null; syncHidden();
      }).catch(function () {
        say('Sorry, that did not send. Please email hello@aikonx.com.au or call 0413 082 803.', false);
      }).then(function () { inFlight = false; if (btn) btn.disabled = false; if (label) label.textContent = idle; });
  });
})();
