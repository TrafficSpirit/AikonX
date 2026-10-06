import "./index.css";
import "../styles.css";

// Mount each below-fold React component only when its container scrolls into
// the viewport. This keeps zero React/framer-motion/Three.js code on the
// critical path so LCP and TBT are not affected by heavy component parsing.
function observeOnce(id: string, mount: () => void) {
  const el = document.getElementById(id);
  if (!el) return;
  if (typeof IntersectionObserver === "undefined") { mount(); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { io.disconnect(); mount(); }
  }, { rootMargin: "200px" });
  io.observe(el);
}

observeOnce("testimonials-root", () => {
  import("react").then(({ createElement }) =>
    import("react-dom/client").then(({ createRoot }) =>
      import("./demo").then(({ Testimonials }) => {
        const host = document.getElementById("testimonials-root");
        if (host && !host.dataset.mounted) {
          host.dataset.mounted = "1";
          createRoot(host).render(createElement(Testimonials));
        }
      })
    )
  );
});

observeOnce("process-root", () => {
  import("react").then(({ createElement }) =>
    import("react-dom/client").then(({ createRoot }) =>
      import("./process").then(({ Process }) => {
        const host = document.getElementById("process-root");
        if (host && !host.dataset.mounted) {
          host.dataset.mounted = "1";
          createRoot(host).render(createElement(Process));
        }
      })
    )
  );
});

observeOnce("orbit-stage", () => {
  import("react").then(({ createElement }) =>
    import("react-dom/client").then(({ createRoot }) =>
      import("../orbit-hero.js").then(({ PlanetStageHero }: any) => {
        const host = document.getElementById("orbit-stage");
        if (host && !host.dataset.mounted) {
          host.dataset.mounted = "1";
          createRoot(host).render(createElement(PlanetStageHero, { theme: "auto", assetBaseUrl: "assets/" }));
        }
      })
    )
  );
});
