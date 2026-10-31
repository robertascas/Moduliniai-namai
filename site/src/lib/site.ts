import imone from "../data/imone.json";
import produktai from "../data/produktai.json";
import turinys from "../data/turinys.json";
import katalogas from "../data/modeliai.json";

export { imone, produktai, turinys, katalogas };
export type Produktas = (typeof produktai)[number];
export type Modelis = (typeof katalogas.modeliai)[number];
export const modelHref = (m: { id: string }) => `${m.id}.html`;
export const planImg = (m: { id: string }, v: string) => `img/planai/${m.id}-${v.toLowerCase()}.webp`;
export const isViz = (name: string) => !name.startsWith("k/");

export const BRAND = imone.pavadinimas;
export const SITE = imone.svetaine.replace(/\/$/, "");
export const telHref = (t: string) => `tel:${t.replace(/[^\d+]/g, "")}`;
export const productHref = (p: Produktas) => `${p.slug}.html`;
export const img = (name: string, small = false) => `img/${name}${small ? (name.startsWith("k/") ? "-800" : "-1000") : ""}.webp`;
export const kimg = (name: string, small = false) => img(`k/${name}`, small);

export const NAV = [
  ...produktai.map((p) => ({ href: productHref(p), label: p.id === "sandeliukas" ? "Sandėliukai" : p.id === "karkasinis" ? "Karkasiniai namai" : p.pavadinimas, key: p.id })),
  { href: "galerija.html", label: "Galerija", key: "galerija" },
  { href: "kontaktai.html", label: "Kontaktai", key: "kontaktai" },
];

// schema.org: paslaugas teikianti įmonė be fizinio adreso (aptarnaujama teritorija)
export function orgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE}/#imone`,
    name: imone.pavadinimas,
    url: `${SITE}/`,
    logo: `${SITE}/apple-touch-icon.png`,
    image: `${SITE}/og.jpg`,
    email: imone.elPastas,
    telephone: imone.telefonai.map((t) => t.replace(/\s/g, "")),
    areaServed: [
      { "@type": "City", name: "Vilnius" },
      { "@type": "AdministrativeArea", name: "Vilniaus rajono savivaldybė" },
    ],
    makesOffer: produktai.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: p.pavadinimas, url: `${SITE}/${p.slug}` },
    })),
  };
}
export function faqSchema(items: { klausimas: string; atsakymas: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({ "@type": "Question", name: q.klausimas, acceptedAnswer: { "@type": "Answer", text: q.atsakymas } })),
  };
}
export function crumbsSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE}/${c.path.replace(/\.html$/, "")}` })),
  };
}
