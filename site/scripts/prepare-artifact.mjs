// Paruošia dist/ kopiją publikavimui kaip claude.ai Artifact:
// pagrindiniam puslapiui nuimamas <html>/<head>/<body> apvalkalas (platforma prideda savo),
// kiti puslapiai lieka pilni HTML dokumentai.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";

const out = "artifact";
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync("dist", out, { recursive: true });
rmSync(`${out}/admin`, { recursive: true, force: true });

const html = readFileSync(`${out}/index.html`, "utf8").replace(/<title>[^<]*<\/title>/, "<title>Šiltas karkasas</title>");
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<meta charset="utf-8">/i, "")
  .replace(/<meta name="viewport"[^>]*>/i, "");
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
writeFileSync(`${out}/index.html`, '<meta name="claude:viewport-fit-sides" content="cover">\n' + head.trim() + "\n" + body.trim() + "\n");
console.log("artifact/ paruoštas");
