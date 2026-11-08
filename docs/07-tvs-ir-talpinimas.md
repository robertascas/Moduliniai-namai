# 7. TVS ir talpinimas

## Pasirinkimas

| Dalis | Sprendimas | Kaina |
|---|---|---|
| Svetainė | **Astro** (statiniai HTML failai) | 0 € |
| TVS | **Sveltia CMS** (`/admin`), suderinama su Decap CMS | 0 €, atviro kodo |
| Turinio saugykla | GitHub repozitorija (visa pakeitimų istorija = atsarginė kopija) | 0 € |
| Talpinimas | **Cloudflare Pages** | 0 € |
| Užklausų forma | Web3Forms (nemokamas planas: 250 užklausų/mėn.) | 0 € |
| El. paštas `info@domenas.lt` | Cloudflare Email Routing → persiunčia į `modulonamas@gmail.com` | 0 € |
| Domenas `.lt` | registratorius | vienintelė privaloma išlaida |

Kodėl ne WordPress: nėra duomenų bazės, įskiepių ir serverio, todėl nėra ką atnaujinti ir mažiau ką nulaužti.
Svetainė greitesnė (geriau SEO), o talpinimas nemokamas.

## Ką klientas redaguos per `/admin`

Viskas, kas rodoma svetainėje, yra trijuose failuose (`site/src/data/`), o TVS juos rodo kaip formas:

| TVS skiltis | Failas | Turinys |
|---|---|---|
| Įmonės duomenys → Kontaktai | `imone.json` | Telefonai, el. paštas, vietovė, domenas |
| Įmonės duomenys → Įrengimas, privalumai, eiga, DUK | `turinys.json` | Įrengimo lygių sąrašai, privalumai, darbo eiga, DUK |
| Įmonės duomenys → Produktai | `produktai.json` | Pavadinimai, aprašymai, punktai, nuotraukos, SEO tekstai |

Nuotraukos įkeliamos į `site/public/img/`. Išsaugojus pakeitimą, Cloudflare per maždaug minutę paskelbia naują svetainės versiją.

## Paleidimo žingsniai

1. Sukurti GitHub organizaciją ar paskyrą klientui (klientas yra savininkas), perkelti repozitoriją, įjungti 2FA.
2. Cloudflare Pages → prijungti repozitoriją: build komanda `npm run build`, šakninis aplankas `site`, išvesties aplankas `dist`.
3. Prijungti domeną Cloudflare, įjungti HTTPS (automatiškai).
4. TVS prisijungimui įdiegti OAuth tarpininką (`sveltia-cms-auth` kaip Cloudflare Worker) ir jo adresą įrašyti `site/public/admin/config.yml` → `base_url`.
5. `config.yml` → `branch` nustatyti į pagrindinę šaką (dabar `main`).
6. Web3Forms: gauti raktą `modulonamas@gmail.com` adresui, prijungti formą (`kontaktai.html`).
7. Patikrinti TVS: pakeisti telefoną, išsaugoti, įsitikinti, kad pasikeitė svetainėje.

> TVS konfigūracija paruošta, bet dar neišbandyta su tikra GitHub paskyra.
> Tai bus padaryta 4–7 žingsniuose.

## Dabartinė būsena (testinė versija)

- **Adresas:** https://siltaskarkasas.pages.dev
- **Cloudflare Pages projektas:** `siltaskarkasas`, prijungtas prie GitHub `robertascas/Moduliniai-namai`.
- **Šaka:** `claude/modular-homes-page-wdlp36` – kiekvienas įkėlimas į ją automatiškai atnaujina svetainę (1–3 min.).
- **Kūrimas:** šakninis aplankas `site`, komanda `npm run build`, rezultatas `dist`.
- **Kintamieji:** `PUBLIC_NOINDEX=1` (Google neindeksuoja), `NODE_VERSION=22`, `PUBLIC_WEB3FORMS_KEY` (Web3Forms raktas, sukurtas be registracijos, užklausos į modulonamas@gmail.com).
- Kūrimo metu (`CF_PAGES`) vidinės nuorodos perrašomos be `.html` galūnės (`scripts/pretty-links.mjs`).
- Tuščias projektas `siltas-karkasas` nenaudojamas, jį galima ištrinti Cloudflare skydelyje.

### Paleidžiant tikrą svetainę
1. Cloudflare projekto nustatymuose pašalinti `PUBLIC_NOINDEX` (dings ir „Testinė versija“ juosta) ir pridėti `PUBLIC_WEB3FORMS_KEY` (Web3Forms raktas modulonamas@gmail.com adresui).
1a. Į `src/data/imone.json` → `rekvizitai` įrašyti įmonės pavadinimą ir kodą (rodomi privatumo politikoje).
2. Prijungti domeną (Custom domains) ir patikrinti `src/data/imone.json` → `svetaine`.
3. Gamybinę šaką perkelti į `main`.
4. Pateikti `sitemap.xml` Google Search Console.
