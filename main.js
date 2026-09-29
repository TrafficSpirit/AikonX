(function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;

  var scheduled = false;
  function updateSticky() {
    nav.classList.toggle("is-sticky", window.scrollY > 48);
    scheduled = false;
  }

  window.addEventListener("scroll", function () {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateSticky);
  }, { passive: true });
  updateSticky();
})();

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

/* Animate FAQ panels while retaining native details/summary behavior without JS. */
(function () {
  var items = Array.from(document.querySelectorAll(".faq__item"));
  if (!items.length) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var intendedOpen = new WeakMap();
  var animations = new WeakMap();

  function setOpen(item, shouldOpen) {
    var panel = item.querySelector(".faq__answer");
    if (!panel) return;

    var fromHeight = item.open ? panel.getBoundingClientRect().height : 0;
    var fromOpacity = item.open ? Number(getComputedStyle(panel).opacity) : 0;
    var previous = animations.get(item);
    if (previous) previous.cancel();
    intendedOpen.set(item, shouldOpen);

    if (reducedMotion.matches || !panel.animate) {
      item.open = shouldOpen;
      return;
    }

    if (shouldOpen) item.open = true;
    var toHeight = shouldOpen ? panel.scrollHeight : 0;
    var animation = panel.animate([
      { height: fromHeight + "px", opacity: fromOpacity, transform: shouldOpen ? "translateY(-6px)" : "translateY(0)" },
      { height: toHeight + "px", opacity: shouldOpen ? 1 : 0, transform: shouldOpen ? "translateY(0)" : "translateY(-6px)" }
    ], {
      duration: shouldOpen ? 420 : 320,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)"
    });

    animations.set(item, animation);
    animation.onfinish = function () {
      if (!shouldOpen) item.open = false;
      animations.delete(item);
    };
  }

  items.forEach(function (item) {
    item.querySelector("summary").addEventListener("click", function (event) {
      event.preventDefault();
      var shouldOpen = !(intendedOpen.get(item) ?? item.open);
      if (shouldOpen) {
        items.forEach(function (other) {
          if (other !== item && (intendedOpen.get(other) ?? other.open)) setOpen(other, false);
        });
      }
      setOpen(item, shouldOpen);
    });
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
    document.body.classList.add("is-ready");
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
