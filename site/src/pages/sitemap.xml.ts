import { SITE, produktai, katalogas } from "../lib/site";

// Svetainės žemėlapis Google Search Console
export function GET() {
  const pages = ["", ...produktai.map((p) => `${p.slug}.html`), ...katalogas.modeliai.map((m) => `${m.id}.html`), "galerija.html", "kontaktai.html"];
  const today = new Date().toISOString().slice(0, 10);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}/${p}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
