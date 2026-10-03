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
    // Also inject a correct fetchpriority preload for the LCP logo image
    // after Vite has rewritten its src to the fingerprinted asset URL.
    {
      name: "non-blocking-css",
      transformIndexHtml(html: string): string {
        // 1. Make Vite-injected stylesheets non-blocking
        let out = html.replace(
          /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+)">/g,
          '<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'">'
        );
        // 2. Extract the Vite-hashed logo URL from the nav <img> and inject
        //    a matching <link rel="preload"> so the LCP image is fetched at
        //    highest priority from the very first HTML parse.
        const logoMatch = out.match(/<img src="(\/assets\/logo-[^"]+)" alt="AIkonX" width="201"/);
        if (logoMatch) {
          const logoUrl = logoMatch[1];
          const preloadTag = `<link rel="preload" as="image" href="${logoUrl}" fetchpriority="high">`;
          out = out.replace(
            '<!-- Preload the LCP logo image so discovery + fetch begin immediately -->\n  <link rel="preload" as="image" href="assets/images/logo.png" fetchpriority="high">',
            `<!-- Preload the LCP logo image (Vite-hashed URL) at highest priority -->\n  ${preloadTag}`
          );
        }
        return out;
      },
    },
  ],
  resolve: { alias: { "@": resolve(".") } },
});
