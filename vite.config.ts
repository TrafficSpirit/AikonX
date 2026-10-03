import { cpSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-existing-assets",
      closeBundle() {
        cpSync(resolve("assets"), resolve("dist/assets"), { recursive: true });
      },
    },
    // Make every Vite-injected <link rel="stylesheet"> non-blocking so CSS
    // never delays LCP. The inline <style> in index.html covers all ATF
    // content; the full stylesheet applies after first paint via the
    // media=print → onload swap (standard web.dev recommendation).
    {
      name: "non-blocking-css",
      transformIndexHtml(html: string): string {
        // Vite injects: <link rel="stylesheet" crossorigin href="/assets/index-HASH.css">
        // We add media="print" onload so it loads without blocking rendering.
        return html.replace(
          /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+)">/g,
          '<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'">'
        );
      },
    },
  ],
  resolve: { alias: { "@": resolve(".") } },
});
