import { defineConfig } from "astro/config";

// Prototipas generuojamas kaip plokšti HTML failai su santykinėmis nuorodomis,
// kad veiktų atidarius tiesiai iš disko ir bet kokiame statiniame talpinime.
export default defineConfig({
  build: {
    format: "file",
    inlineStylesheets: "always",
  },
  devToolbar: { enabled: false },
});
