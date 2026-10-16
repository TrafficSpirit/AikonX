/* Contact forms: validate, then POST to Netlify Forms with inline success/error messages. */
(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;
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
    fetch(form.getAttribute('action') || '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      say('Thanks! We will be in touch within two business days.', true);
      form.reset();
    }).catch(function () {
      say('Sorry, that did not send. Please email hello@aikonx.com or call 1300 000 000.', false);
    }).then(function () {
      if (btn) btn.disabled = false;
      if (label) label.textContent = idle;
    });
  });
})();
