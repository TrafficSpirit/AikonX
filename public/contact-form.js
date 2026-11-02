/* Only a positive JSON receipt from the enquiry backend counts as success. */
(function () {
  var DAPEM_SRC = 'https://dapem.toolsforscale.com/api/measurement/client/ff4f8cf5cd9d86cdf1655d586304859b588d92a921576354.js';
  function consented() { try { return localStorage.getItem('aikx_cookie_consent') === 'granted'; } catch (e) { return false; } }
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
  var form = document.querySelector('.contact-form');
  if (!form) return;
  var note = form.querySelector('.contact-form__note');
  var btn = form.querySelector('button[type="submit"]');
  var label = btn ? btn.querySelector('.btn__label') : null;
  var idle = label ? label.textContent : '';
  var submissionId = null;
  var inFlight = false;
  function say(message, ok) { if (note) { note.textContent = message; note.style.color = ok ? '' : '#e5483a'; note.hidden = false; } }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (inFlight) return;
    var trap = form.querySelector('[name="bot-field"]');
    if (trap && trap.value) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }
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
        if (consented() && typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form_name: 'contact', form_page: location.pathname });
        observe(result.eventId, testId);
        say('Thanks! We will be in touch within two business days.', true);
        form.reset(); submissionId = null;
      }).catch(function () {
        say('Sorry, that did not send. Please email hello@aikonx.com.au or call 0413 082 803.', false);
      }).then(function () { inFlight = false; if (btn) btn.disabled = false; if (label) label.textContent = idle; });
  });
})();
