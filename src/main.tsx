import { createElement } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "../styles.css";

// Defer all below-fold React components until they are near the viewport.
// This avoids evaluating heavy bundles (Framer Motion, Three.js) during the
// critical loading window and prevents long tasks that block LCP paint.
function mountWhenNear(hostId: string, loader: () => Promise<void>, rootMargin = "400px") {
  const host = document.getElementById(hostId);
  if (!host) return;
  if (!("IntersectionObserver" in window)) {
    // Fallback: load after a short delay so LCP is not blocked.
    setTimeout(loader, 2000);
    return;
  }
  const io = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        loader();
      }
    },
    { rootMargin }
  );
  io.observe(host);
}

// Process section — uses Framer Motion; defer until scrolled near.
mountWhenNear("process-root", async () => {
  const { Process } = await import("./process");
  const host = document.getElementById("process-root");
  if (host) createRoot(host).render(createElement(Process));
}, "800px");

// Testimonials section — also uses Framer Motion; defer until near.
mountWhenNear("testimonials-root", async () => {
  const { Testimonials } = await import("./demo");
  const host = document.getElementById("testimonials-root");
  if (host) createRoot(host).render(createElement(Testimonials));
}, "600px");

// Orbit hero — Three.js; defer until the section is close to the viewport.
mountWhenNear("orbit-stage", async () => {
  const { PlanetStageHero } = await import("../orbit-hero.js");
  const orbitHost = document.getElementById("orbit-stage");
  if (orbitHost) createRoot(orbitHost).render(createElement(PlanetStageHero, { theme: "auto", assetBaseUrl: "assets/" }));
}, "600px");
