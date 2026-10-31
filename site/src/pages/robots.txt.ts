import { SITE } from "../lib/site";

export function GET() {
  if (import.meta.env.PUBLIC_NOINDEX === "1") return new Response("User-agent: *\nDisallow: /\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE}/sitemap.xml\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
