import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Testimonials } from "./demo";
import { Process } from "./process";
import "./index.css";

// Render UI components that are likely above or near the fold first.
const testimonialsHost = document.getElementById("testimonials-root");
if (testimonialsHost) createRoot(testimonialsHost).render(createElement(Testimonials));

const processHost = document.getElementById("process-root");
if (processHost) createRoot(processHost).render(createElement(Process));

// Defer the heavy Three.js orbit scene until after the browser is idle so it
// does not contribute to TBT / long tasks during the critical loading window.
// The orbit stage is below the fold and does not affect LCP.
function mountOrbit() {
  // Dynamic import splits orbit-hero.js into its own chunk and defers parsing.
  import("../orbit-hero.js").then(({ PlanetStageHero }) => {
    const orbitHost = document.getElementById("orbit-stage");
    if (orbitHost) createRoot(orbitHost).render(createElement(PlanetStageHero, { theme: "auto", assetBaseUrl: "assets/" }));
  });
}

if (typeof requestIdleCallback !== "undefined") {
  requestIdleCallback(mountOrbit, { timeout: 3000 });
} else {
  setTimeout(mountOrbit, 200);
}
