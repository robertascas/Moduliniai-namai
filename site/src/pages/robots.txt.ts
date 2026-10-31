import { SITE } from "../lib/site";

export function GET() {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE}/sitemap.xml\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
