(function () {
  var burger = document.querySelector(".nav__burger");
  var menu = document.getElementById("mobile-menu");
  if (!burger || !menu) return;

  function open() {
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    menu.hidden = false;
  }

  function close() {
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    menu.hidden = true;
  }

  burger.addEventListener("click", function () {
    if (menu.hidden) open();
    else close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) close();
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", close);
  });
})();

/* Fade sections up as they scroll into view. */
(function () {
  var els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  document.documentElement.classList.add("js");

  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

  els.forEach(function (el) { io.observe(el); });
})();

/* Contact form: no backend — acknowledge locally. */
(function () {
  var form = document.querySelector(".contact-form");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var note = form.querySelector(".contact-form__note");
    if (note) note.hidden = false;
    form.reset();
  });
})();

/* Reveal the hero content only once the background video has finished playing. */
(function () {
  var page = document.querySelector(".page");
  var video = document.querySelector(".bg-video");
  if (!page) return;

  var revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    page.classList.add("is-ready");
  }

  if (!video) {
    reveal();
    return;
  }

  video.addEventListener("ended", reveal); // fallback
  video.addEventListener("error", reveal);

  var WALK_AT = 3.5;   // seconds — left-edge fade begins
  var REVEAL_AT = 3;   // seconds — content starts animating in (beaver around mid)
  video.addEventListener("timeupdate", function () {
    // Apply the left-edge fade only after the beaver has started walking out
    // (so the wall it peeks around stays sharp during the peek).
    if (video.currentTime >= WALK_AT) {
      video.classList.add("is-walking");
    }
    // Start the content entrance while the beaver is still mid-clip.
    if (video.currentTime >= REVEAL_AT) {
      reveal();
    }
  });

  // Autoplay can require an explicit play() call; if it can't play, reveal anyway.
  var p = video.play();
  if (p && typeof p.catch === "function") {
    p.catch(function () {
      reveal();
    });
  }
})();
