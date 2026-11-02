/* Contact forms: validate, then POST to Netlify Forms with inline success/error messages. */
(function () {
  /* Enquiry measurement: one generate_lead event per confirmed enquiry.
     Uses the existing GA4 gtag (analytics.js); Consent Mode decides whether anything is stored.
     Parameters are non-personal only: no name, email, company or message. */
  var SENT_KEY = 'aikx_lead_sent';
  function trackLead(page) {
    function fire() {
      if (typeof window.gtag !== 'function') return;
      window.gtag('event', 'generate_lead', { form_name: 'contact', form_page: page || location.pathname });
    }
    if (document.readyState === 'complete') fire();
    else window.addEventListener('load', fire);
  }

  /* No-JS fallback: the form posts to /thank-you/. Fire once per browser session (reload-safe).
     The AJAX path never navigates here, so the two paths cannot double count. */
  if (/^\/thank-you\/?$/.test(location.pathname)) {
    var seen = false;
    try { seen = sessionStorage.getItem(SENT_KEY) === '1'; sessionStorage.setItem(SENT_KEY, '1'); } catch (e) {}
    if (!seen) trackLead('/thank-you/');
    return;
  }

  var form = document.querySelector('.contact-form');
  if (!form) return;
  var tracked = false;
  var note = form.querySelector('.contact-form__note');
  var btn = form.querySelector('button[type="submit"]');
  var label = btn ? btn.querySelector('.btn__label') : null;
  var idle = label ? label.textContent : '';

  function say(msg, ok) {
    if (!note) return;
    note.textContent = msg;
    note.style.color = ok ? '' : '#e5483a';
    note.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var trap = form.querySelector('[name="bot-field"]');
    if (trap && trap.value) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var body = new URLSearchParams(new FormData(form)).toString();
    if (btn) btn.disabled = true;
    if (label) label.textContent = 'Sending...';
    if (note) note.hidden = true;
    tracked = false;
    fetch(form.getAttribute('action') || '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      if (!tracked) {
        tracked = true;
        var pf = form.querySelector('[name="page"]');
        trackLead(pf && pf.value ? pf.value : location.pathname);
      }
      say('Thanks! We will be in touch within two business days.', true);
      form.reset();
    }).catch(function () {
      tracked = false;
      say('Sorry, that did not send. Please email hello@aikonx.com.au or call 0413 082 803.', false);
    }).then(function () {
      if (btn) btn.disabled = false;
      if (label) label.textContent = idle;
    });
  });
})();
