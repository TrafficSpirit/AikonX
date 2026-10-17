/* AIkonX page effects: reveals elements with .fx-reveal as they scroll into view. */
(function () {
  if (window.__fxT) clearTimeout(window.__fxT);
  var els = [].slice.call(document.querySelectorAll('.fx-reveal'));
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || calm) {
    els.forEach(function (e) { e.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (x) {
      if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (e) { io.observe(e); });
})();
