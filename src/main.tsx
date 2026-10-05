import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Testimonials } from "./demo";
import { Process } from "./process";
import "./index.css";
import "../styles.css";

// Mount React components after the browser has completed first paint so that
// React's render work does not run on the critical path and delay LCP.
// Two requestAnimationFrame calls ensure we're past first paint before mounting.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const testimonialsHost = document.getElementById("testimonials-root");
    if (testimonialsHost) createRoot(testimonialsHost).render(createElement(Testimonials));

    const processHost = document.getElementById("process-root");
    if (processHost) createRoot(processHost).render(createElement(Process));
  });
});

// Defer the heavy Three.js orbit scene until the browser is idle so it
// does not contribute to TBT during the critical loading window.
// The orbit stage is below the fold and does not affect LCP.
if (typeof requestIdleCallback !== "undefined") {
  requestIdleCallback(function mountOrbit() {
    import("../orbit-hero.js").then(({ PlanetStageHero }) => {
      const orbitHost = document.getElementById("orbit-stage");
      if (orbitHost) createRoot(orbitHost).render(createElement(PlanetStageHero, { theme: "auto", assetBaseUrl: "assets/" }));
    });
  }, { timeout: 3000 });
} else {
  setTimeout(function mountOrbit() {
    import("../orbit-hero.js").then(({ PlanetStageHero }) => {
      const orbitHost = document.getElementById("orbit-stage");
      if (orbitHost) createRoot(orbitHost).render(createElement(PlanetStageHero, { theme: "auto", assetBaseUrl: "assets/" }));
    });
  }, 200);
}
