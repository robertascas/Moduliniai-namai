# 2. Darbų seka ir įvertinimas

Darbai suskirstyti į 7 etapus. Kiekvienas baigiasi rezultatu, kurį tvirtina klientas –
tik tada pereinama prie kito. Valandos – orientacinės, tikslinamos po brifo (etapas 0).

| # | Etapas | Rezultatas | Trukmė | Val. |
|---|---|---|---|---|
| 0 | Brifas ir analizė | Užpildytas klausimynas, konkurentų analizė, tikslai, KPI | 1 sav. | 8–12 |
| 1 | Struktūra ir turinys | Svetainės medis, puslapių turinio planas, wireframe'ai | 1 sav. | 12–16 |
| 2 | Dizaino sistema (Web UI) | Spalvos, šriftai, komponentai, ikonos (Figma) | 1 sav. | 12–20 |
| 3 | Dizaino maketai + prototipas | Desktop ir mobilūs maketai, interaktyvus prototipas klientui | 1–2 sav. | 24–40 |
| 4 | Programavimas | Veikianti svetainė su CMS testinėje aplinkoje | 2–4 sav. | 60–100 |
| 5 | Turinys, SEO, testavimas | Sukeltas turinys, meta, schema, greičio ir naršyklių testai | 1 sav. | 16–24 |
| 6 | Paleidimas ir priežiūra | Domenas, analitika, mokymai klientui, 30 d. palaikymas | 0,5 sav. | 6–10 |
| | **Iš viso** | | **~7–10 sav.** | **~140–220** |

## Etapas 0 – Brifas ir analizė
- [x] Pavyzdinio puslapio (modhouse.lt) analizė – `01-analize-modhouse.md`
- [x] Pirminis klausimynas klientui – `05-klausimai-klientui.md`
- [ ] Susitikimas su klientu, klausimyno aptarimas
- [ ] Tikslų ir KPI fiksavimas (užklausų sk./mėn., konversija, SEO pozicijos)
- [ ] Prekės ženklo medžiaga: logotipas, spalvos, nuotraukos, projektai (planai PDF/DWG)

## Etapas 1 – Struktūra ir turinys
- [x] Pirminis svetainės medis – `03-svetaines-struktura.md`
- [ ] Raktinių žodžių tyrimas (Google Keyword Planner / Ahrefs): „moduliniai namai“, „modulinis namas kaina“, „moduliniai namai Vilnius“ ir pan.
- [ ] Kiekvieno puslapio turinio planas (antraštės, blokai, CTA)
- [ ] Wireframe'ai (low-fi) pagrindiniam, modelio, kainų, kontaktų puslapiams
- [ ] **Kliento patvirtinimas**

## Etapas 2 – Dizaino sistema
- [x] Pirminės dizaino gairės – `04-dizaino-sistema.md`
- [ ] Spalvų ir tipografijos tvirtinimas pagal kliento prekės ženklą
- [ ] Komponentų biblioteka Figma: mygtukai, kortelės, formos, lentelės, akordeonas, navigacija
- [ ] Modulio plano iliustracijų stilius (kiekvieno modelio planas iš modulių)

## Etapas 3 – Maketai ir prototipas
- [x] HTML prototipas v0.1 (pagrindinis puslapis)
- [x] Veikiantis prototipas v0.2 (Astro, 12 puslapių, konfigūratorius, pasiūlymai, kainyno demo) – `site/`
- [ ] Maketai: pagrindinis, modelių katalogas, modelio puslapis, kainos/skaičiuoklė, eiga, atlikti darbai, DUK, kontaktai
- [ ] Mobilios versijos maketai
- [ ] Prototipo pristatymas klientui, pastabų rinkimas (1–2 iteracijos)
- [ ] **Kliento patvirtinimas**

## Etapas 4 – Programavimas
Rekomenduojamas stekas (aptarti su klientu):

| Variantas | Kada tinka | Pastabos |
|---|---|---|
| **A. WordPress + blokai/ACF** | Klientas pats pildys turinį, svarbu kaina | Daug rangovų, lengva perimti |
| **B. Astro + headless CMS (Sanity / Decap)** | Svarbus greitis, SEO, ilgalaikė kokybė | Greičiausia svetainė, statinis hostingas |
| C. Webflow | Greitas startas, mažai programavimo | Mėnesinis mokestis, ribota logika |

Darbai:
- [ ] Projekto karkasas, CI/CD, testinė aplinka
- [ ] Šablonai: pagrindinis, modelių sąrašas, modelio puslapis, turinio puslapis, straipsnis
- [ ] Kainos skaičiuoklė (kainos iš CMS, ne kode)
- [ ] Užklausos forma: validacija, spam apsauga, laiškas vadybininkui + kopija klientui, (pasirinktinai) CRM integracija
- [ ] Daugiakalbystė (LT/EN), `hreflang`
- [ ] Slapukų sutikimas (BDAR), privatumo politika

## Etapas 5 – Turinys, SEO, testavimas
- [ ] Turinio sukėlimas, nuotraukų optimizavimas (WebP/AVIF)
- [ ] Meta, Open Graph, `schema.org` (Organization, Product, FAQPage)
- [ ] sitemap.xml, robots.txt, 301 peradresavimai (jei keičiama sena svetainė)
- [ ] Lighthouse ≥ 90, Core Web Vitals, prieinamumas (WCAG 2.1 AA)
- [ ] Naršyklės / įrenginiai: Chrome, Safari (iOS), Firefox, Edge

## Etapas 6 – Paleidimas
- [ ] Domenas, SSL, hostingas
- [ ] Google Analytics 4 / Tag Manager, Search Console, konversijų įvykiai (forma, tel. paspaudimas)
- [ ] Kliento mokymai (CMS), trumpa instrukcija
- [ ] 30 d. garantinis palaikymas

## Rizikos
| Rizika | Valdymas |
|---|---|
| Vėluoja kliento turinys (nuotraukos, planai, kainos) | Turinio sąrašas su terminais etape 0; laikini tekstai pažymimi |
| Kainos dažnai keičiasi | Kainos tik CMS, skaičiuoklė rodo „orientacinė kaina“ |
| Nesutampa garantijos / teisinė informacija | Vienas patvirtintas tekstas iš kliento teisininko |
| Apimties plėtra (konfigūratorius 3D, klientų portalas) | Fiksuojama kaip 2 fazė |
