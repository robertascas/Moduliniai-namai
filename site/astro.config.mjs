import { defineConfig } from "astro/config";

// Plokšti HTML failai su santykinėmis nuorodomis: veikia iš disko, Cloudflare Pages ir Artifact peržiūroje.
export default defineConfig({
  site: "https://www.siltaskarkasas.lt",
  build: { format: "file", inlineStylesheets: "always" },
  devToolbar: { enabled: false },
});
