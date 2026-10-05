import "./index.css";
import "../styles.css";

// Mount each below-the-fold React component only when it enters the viewport.
// This ensures React and framer-motion never run on the critical path that
// determines LCP, and only runs when the user actually scrolls near the section.
function mountWhenVisible(hostId: string, loader: () => Promise<void>) {
  const el = document.getElementById(hostId);
  if (!el) return;
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          loader();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
  } else {
    // Fallback for browsers without IntersectionObserver: defer briefly
    setTimeout(loader, 500);
  }
}

mountWhenVisible("testimonials-root", () =>
  Promise.all([
    import("react"),
    import("react-dom/client"),
    import("./demo"),
  ]).then(([{ createElement }, { createRoot }, { Testimonials }]) => {
    const el = document.getElementById("testimonials-root");
    if (el && !el.hasChildNodes()) createRoot(el).render(createElement(Testimonials));
  })
);

mountWhenVisible("process-root", () =>
  Promise.all([
    import("react"),
    import("react-dom/client"),
    import("./process"),
  ]).then(([{ createElement }, { createRoot }, { Process }]) => {
    const el = document.getElementById("process-root");
    if (el && !el.hasChildNodes()) createRoot(el).render(createElement(Process));
  })
);

mountWhenVisible("orbit-stage", () =>
  Promise.all([
    import("react"),
    import("react-dom/client"),
    import("../orbit-hero.js"),
  ]).then(([{ createElement }, { createRoot }, { PlanetStageHero }]) => {
    const el = document.getElementById("orbit-stage");
    if (el && !el.hasChildNodes()) createRoot(el).render(createElement(PlanetStageHero, { theme: "auto", assetBaseUrl: "assets/" }));
  })
);
