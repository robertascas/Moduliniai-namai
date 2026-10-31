# 6. SEO ir Google

## Jau įdiegta svetainėje (`site/`)

| Kas | Kur | Pastaba |
|---|---|---|
| Unikalus `<title>` ir `meta description` kiekvienam puslapiui | `src/pages/*.astro`, `src/data/produktai.json` | Produktų SEO tekstai redaguojami per TVS |
| Atskiras puslapis kiekvienai paslaugai | `moduliniai-namai.html`, `modulines-pirtys.html`, `sandeliukai-ir-ukio-pastatai.html`, `karkasiniai-namai-ir-garazai.html` | Vienas puslapis = viena paieškos tema |
| Viena H1 antraštė puslapyje, logiška H2/H3 struktūra | visi puslapiai | |
| `canonical` nuorodos | `src/layouts/Base.astro` | Naudoja domeną iš `src/data/imone.json` |
| Open Graph ir socialinio tinklo paveikslėlis | `public/og.jpg` | Rodomas dalinantis nuoroda Facebook, Messenger ir pan. |
| Struktūrizuoti duomenys (schema.org) | `src/lib/site.ts` | `HomeAndConstructionBusiness` (telefonai, el. paštas, aptarnaujama teritorija, paslaugos), `BreadcrumbList`, `FAQPage` |
| `sitemap.xml` ir `robots.txt` | generuojami automatiškai | `/admin/` uždarytas nuo indeksavimo |
| Paveikslėliai WebP formatu, dvi raiškos (`srcset`), `alt` tekstai | `public/img/` | Lazy loading viskam, kas žemiau pirmo ekrano |
| Statiniai HTML failai be JavaScript karkaso | Astro | Greitas įkėlimas, geri Core Web Vitals (LCP, INP, CLS) |
| `lang="lt"`, favicon, `apple-touch-icon`, `theme-color` | `Base.astro` | |

**Pastaba dėl DUK:** `FAQPage` žymėjimas paliktas, nes jis padeda paieškos sistemoms suprasti turinį.
Tačiau nuo 2023 m. rugpjūčio Google DUK išplėstinius rezultatus rodo tik autoritetingoms
valdžios ir sveikatos svetainėms, todėl paieškos rezultatuose jie neatsiras.

## Būtina padaryti paleidžiant (kliento paskyros)

1. **Domenas.** Svetainėje kol kas įrašytas `https://www.siltaskarkasas.lt`. Tai **prielaida**:
   patikrinti, ar laisvas (domreg.lt), užregistruoti ir pakeisti `src/data/imone.json` bei `astro.config.mjs`.
2. **Google Business Profile** (svarbiausia vietinei paieškai „pirtys Vilnius“, žemėlapiams):
   - kategorija: statybos rangovas / namų statyba (pasirenkama iš Google sąrašo);
   - tipas: „paslaugų teikimo teritorija“ (adresą galima slėpti), teritorija: Vilnius, Vilniaus r.;
   - telefonas, svetainė, darbo laikas, **tikros** darbų nuotraukos;
   - prašyti klientų atsiliepimų.
3. **Google Search Console:** patvirtinti domeną per DNS, pateikti `sitemap.xml`.
4. **Google Analytics 4** su slapukų sutikimo juosta (Consent Mode v2, privaloma EEE nuo 2024 m. kovo).
   Konversijos: užklausos formos išsiuntimas, paspaudimas ant telefono numerio.
5. **Privatumo politika** su įmonės rekvizitais (forma renka asmens duomenis, BDAR).
6. **Vienodi kontaktai (NAP)** visur: svetainėje, Google Business Profile, Facebook, katalogų svetainėse.

## Raktinių žodžių kryptys

Puslapiai jau orientuoti į šias temas. Paieškų apimtis būtina patikrinti Google Keyword Planner
arba Search Console po paleidimo, čia jos **nesugalvotos**.

| Puslapis | Pagrindinė tema | Papildomos frazės |
|---|---|---|
| Moduliniai namai | moduliniai namai | modulinis namas, moduliniai namai Vilniuje, modulinis sodo namas |
| Modulinės pirtys | modulinės pirtys | modulinė pirtis, pirtis su terasa, pirtis su poilsio kambariu, elektrinė / malkinė pirtis |
| Sandėliukai | lauko sandėliukai | ūkio pastatai, sodo sandėliukas, malkinė |
| Karkasiniai namai | karkasiniai namai | karkasinis namas, vasarnamiai, karkasiniai garažai |

## Turinys, kuris labiausiai padėtų (kai klientas pateiks)

- **Tikros atliktų darbų nuotraukos** su vieta ir trumpu aprašymu (atskiras puslapis „Darbai“).
- **Kainos „nuo“** arba kainos skaičiuoklė (prototipe v0.2 jau buvo sukurta, galima grąžinti).
- **Atsiliepimai** (tik tikri, su kliento sutikimu).
- **Straipsniai** pagal klientų klausimus, pvz. „Kuo skiriasi dalinė apdaila nuo įrengimo iki rakto“.
