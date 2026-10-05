import "./index.css";
import "../styles.css";

// All React components are below the fold. Defer ALL mounting until after
// the browser has painted the above-the-fold content and reported LCP.
// This removes React's initial render work from the critical path entirely,
// reducing TBT and allowing LCP to be measured as fast as possible.

function idle(cb: () => void) {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(cb, { timeout: 4000 });
  } else {
    // Fallback: defer past first paint using two rAF + setTimeout
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(cb, 0)));
  }
}

// Mount Testimonials and Process after browser is idle.
// These are deep below the fold and have no impact on LCP.
idle(function mountBelowFold() {
  import("react").then(({ createElement }) => {
    import("react-dom/client").then(({ createRoot }) => {
      const testimonialsHost = document.getElementById("testimonials-root");
      if (testimonialsHost) {
        import("./demo").then(({ Testimonials }) => {
          createRoot(testimonialsHost).render(createElement(Testimonials));
        });
      }
      const processHost = document.getElementById("process-root");
      if (processHost) {
        import("./process").then(({ Process }) => {
          createRoot(processHost).render(createElement(Process));
        });
      }
    });
  });
});

// Mount the Three.js orbit scene after the below-fold components,
// using a second idle callback so it does not race with React hydration.
idle(function mountOrbit() {
  import("../orbit-hero.js").then(({ PlanetStageHero }) => {
    import("react").then(({ createElement }) => {
      import("react-dom/client").then(({ createRoot }) => {
        const orbitHost = document.getElementById("orbit-stage");
        if (orbitHost) createRoot(orbitHost).render(createElement(PlanetStageHero, { theme: "auto", assetBaseUrl: "assets/" }));
      });
    });
  });
});
