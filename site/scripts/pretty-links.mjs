// Cloudflare Pages adresus rodo be .html galūnės ir peradresuoja (308).
// Kad nebūtų nereikalingų peradresavimų, Cloudflare kūrimo metu vidines nuorodos perrašomos be .html.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

if (!process.env.CF_PAGES) process.exit(0);
const dir = "dist";
let n = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  const p = `${dir}/${f}`;
  const html = readFileSync(p, "utf8");
  const out = html.replace(/href="([a-z0-9-]+)\.html(#[^"]*)?"/g, (_, name, hash = "") => {
    n++;
    return `href="${name === "index" ? "/" : name}${hash}"`;
  });
  writeFileSync(p, out);
}
console.log(`pretty-links: perrašyta ${n} nuorodų`);
