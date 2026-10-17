import { defineConfig } from "astro/config";
import shirones from "shirones";

// Site-level settings (site URL, base, title, theme colour, fonts, …) live in
// `shirones/config/` so they stay typed and version-controlled with your
// content. This file only wires the theme in.
export default defineConfig({
  integrations: [
    shirones({
      // Override individual components by mirroring the theme's structure in
      // `src/components/`, or point at them explicitly:
      // components: { "atoms/blog/PostCard": "./src/components/PostCard.astro" },
    }),
  ],
  vite: {
    optimizeDeps: {
      // npm-package mode only.
      //
      // The theme's `@/config` alias points inside node_modules, so Vite treats
      // it as a dependency and pre-bundles it with esbuild. esbuild then
      // resolves the package-internal `./siteConfig` imports itself, which
      // bypasses the shirones overlay plugin that redirects them to
      // `shirones/config/*`. The client silently ends up with the theme's
      // DEFAULT config (hue 315 / style tonalSpot) while SSR keeps using
      // shirones/config — so `themeColor` changes look like they do nothing in
      // `astro dev`. Excluding it keeps the real source (and the overlay) in
      // play. Production builds are unaffected either way.
      exclude: ["@/config"],
    },
  },
});
