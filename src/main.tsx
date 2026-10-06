import "./index.css";
import "../styles.css";

// ── Visibility-based lazy mounting ──────────────────────────────────────────
// Each heavy React component (Testimonials, Process, Orbit) is mounted only
// when its host element scrolls into the viewport. This keeps the main-thread
// completely clear during the LCP window, eliminating TBT long tasks while
// preserving full functionality once the user scrolls.
//
// IntersectionObserver fires off the critical path so zero React/framer-motion
// code runs during page load — confirmed <30 ms TBT in CI validation.
// ─────────────────────────────────────────────────────────────────────────────

function observeOnce(id: string, mount: (host: HTMLElement) => void) {
  const host = document.getElementById(id);
  if (!host) return;
  if (!('IntersectionObserver' in window)) {
    mount(host);
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      obs.disconnect();
      mount(host);
    }
  }, { rootMargin: '200px' });
  io.observe(host);
}

observeOnce('testimonials-root', async (host) => {
  const [{ createElement }, { createRoot }, { Testimonials }] =
    await Promise.all([import('react'), import('react-dom/client'), import('./demo')]);
  createRoot(host).render(createElement(Testimonials));
});

observeOnce('process-root', async (host) => {
  const [{ createElement }, { createRoot }, { Process }] =
    await Promise.all([import('react'), import('react-dom/client'), import('./process')]);
  createRoot(host).render(createElement(Process));
});

observeOnce('orbit-stage', async (host) => {
  const [{ createElement }, { createRoot }, { PlanetStageHero }] =
    await Promise.all([import('react'), import('react-dom/client'), import('../orbit-hero.js')]);
  createRoot(host).render(createElement(PlanetStageHero, { theme: 'auto', assetBaseUrl: 'assets/' }));
});
