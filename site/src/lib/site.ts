import kainynas from "../data/kainynas.json";

export const K = kainynas;
export type Modelis = (typeof kainynas.modeliai)[number];

export const BRAND = "MODULIS";
export const TEL = "+370 600 00000";
export const EMAIL = "info@modulis.example";

const eur = new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const money = (v: number) => eur.format(Math.round(v / 10) * 10);
export const rate = (v: number) => eur.format(v) + "/m²";

export function slug(m: Modelis) {
  return m.pavadinimas
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export const modelHref = (m: Modelis) => `modelis-${slug(m)}.html`;
export const width = (m: Modelis) => +(m.moduliai * K.moduloPlotis).toFixed(1);
export const fromPrice = (m: Modelis) => m.plotas * Math.min(...K.apdaila.map((a) => a.kainaM2));
export const bedrooms = (m: Modelis) => `${m.miegamieji}${m.miegamujuPastaba ? " " + m.miegamujuPastaba : ""}`;

export const NAV = [
  { href: "namai.html", label: "Namai", key: "namai" },
  { href: "eiga.html", label: "Kaip statome", key: "eiga" },
  { href: "konfiguratorius.html", label: "Kaina", key: "konfiguratorius" },
  { href: "darbai.html", label: "Atlikti darbai", key: "darbai" },
  { href: "duk.html", label: "DUK", key: "duk" },
  { href: "kontaktai.html", label: "Kontaktai", key: "kontaktai" },
];

export const DUK = [
  {
    q: "Ar moduliniam namui reikia statybos leidimo?",
    a: [
      "Gyvenamajam namui reikia statybą leidžiančio dokumento, kaip ir mūriniam. Mažesniems nei 80 m² pastatams tvarka dažnai paprastesnė, bet tai priklauso nuo sklypo paskirties ir savivaldybės.",
      "Galime parengti techninį projektą ir padėti gauti leidimą. Tai prideda apie 6 savaites prie bendro termino.",
    ],
  },
  {
    q: "Kas neįeina į namo kainą?",
    a: [
      "Namo kaina apima modulius pagal pasirinktą apdailą. Atskirai skaičiuojami pamatai, transportas ir montavimas, prijungimas prie komunikacijų, projektas ir leidimai.",
      "Konfigūratoriuje šiuos darbus galite pažymėti ir iškart matyti visą sumą su PVM.",
    ],
  },
  {
    q: "Kiek laiko trunka visa statyba?",
    a: [
      "Moduliai gaminami 8–12 savaičių, montavimas sklype užtrunka vieną dieną, sujungimai ir perdavimas dar 1–2 savaites. Kartu su projektu ir leidimu nuo pirmo skambučio iki raktų paprastai praeina 4–5 mėnesiai.",
    ],
  },
  {
    q: "Ar namas tinka gyventi žiemą?",
    a: [
      "Taip. Sienos šiltinamos 250 mm, stogas 300 mm, langai trijų stiklų. Namas atitinka A++ energinę klasę ir tinka nuolatiniam gyvenimui ištisus metus.",
    ],
  },
  {
    q: "Kokia garantija?",
    a: [
      "10 metų laikančioms konstrukcijoms ir paslėptiems darbams, 5 metai matomiems darbams. Įrenginiams, pavyzdžiui šilumos siurbliui, taikoma gamintojo garantija, o mes atsakome už teisingą jų sumontavimą.",
      "Visos sąlygos surašomos sutartyje. Tai vienintelis garantijos dokumentas.",
    ],
  },
  {
    q: "Ar atvešite į bet kurį sklypą?",
    a: [
      "Moduliai vežami vilkiku su priekaba, montuojami kranu. Prieš sutartį įvertiname privažiavimą: kelio plotį, posūkius, medžius ir elektros linijas. Jei sunkvežimis neprivažiuoja, siūlome sprendimą arba to pasakome iš anksto.",
    ],
  },
  {
    q: "Ar galima pakeisti planą?",
    a: [
      "Taip. Pertvaras galima perkelti, sujungti ar atskirti patalpas, pridėti terasą ar sujungti du modelius. Keičiasi tik vidus, todėl tai beveik neveikia kainos ir termino.",
    ],
  },
  {
    q: "Kaip mokama?",
    a: [
      "Įprastai trimis dalimis: avansas pasirašius sutartį, antra dalis baigus gaminti modulius ir likutis po perdavimo. Bankai finansuoja modulinius namus kaip ir įprastus, galime pateikti reikiamus dokumentus.",
    ],
  },
];

export const PROJEKTAI = [
  { id: "trakai", vieta: "Trakų r.", pav: "Namas prie Akmenos", model: "m95", fasadas: "maumedis", stogas: "slaitinis", terminas: "14 sav.", metai: 2025, tekstas: "Šeima keturiems. Moduliai sumontuoti per vieną spalio dieną, į namą įsikelta po dviejų savaičių." },
  { id: "kaunas", vieta: "Kauno r.", pav: "Sodo namas", model: "m40", fasadas: "juoda", stogas: "plokscias", terminas: "9 sav.", metai: 2025, tekstas: "Vieno modulio namas sode. Pamatai ant sraigtinių polių, be betonavimo." },
  { id: "moletai", vieta: "Molėtų r.", pav: "Namas prie ežero", model: "m65", fasadas: "pilka", stogas: "slaitinis", terminas: "11 sav.", metai: 2024, tekstas: "Antras būstas prie ežero. Siauras privažiavimas, moduliai pakelti kranu per medžius." },
  { id: "vilnius", vieta: "Vilniaus r.", pav: "Namas su kabinetu", model: "m120", fasadas: "tinkas", stogas: "plokscias", terminas: "16 sav.", metai: 2024, tekstas: "Didžiausias modelis su darbo kambariu. Pilna apdaila, šilumos siurblys ir rekuperacija." },
  { id: "zarasai", vieta: "Zarasų r.", pav: "Sodyba prie Zarasaičio", model: "m120", fasadas: "maumedis", stogas: "slaitinis", terminas: "15 sav.", metai: 2025, tekstas: "Nuolatinis būstas kaime. Trys moduliai ir 30 m² terasa, šildymas šilumos siurbliu." },
  { id: "birstonas", vieta: "Birštono sav.", pav: "Svečių namelis", model: "m40", fasadas: "maumedis", stogas: "slaitinis", terminas: "8 sav.", metai: 2024, tekstas: "Svečių namelis šalia esamo namo. Pastatytas be didelių žemės darbų." },
];
