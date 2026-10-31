# Šiltas karkasas – svetainė

Moduliniai namai, modulinės pirtys, lauko sandėliukai ir ūkio pastatai, karkasiniai namai ir garažai.
Vilnius ir Vilniaus rajonas.

## Struktūra

| Aplankas | Kas jame |
|---|---|
| `site/` | Svetainė (Astro). Prototipas v0.3 ir būsimos svetainės pagrindas |
| `brand/` | Logotipas (SVG, PNG), ikonos, spalvos |
| `vizualizacijos/` | 3D vizualizacijų šaltinis (liko tik sandėliukas) |
| `katalogo-irankiai/` | Partnerio katalogo išplanavimų ir nuotraukų perdirbimas |
| `docs/` | Analizė, darbų seka, dizaino sistema, SEO, TVS, klausimai klientui |

## Svetainė

```bash
cd site
npm install
npm run dev        # http://localhost:4321
npm run build      # statinė svetainė į site/dist/
npm run artifact   # kopija peržiūrai claude.ai Artifact
```

| Puslapis | Turinys |
|---|---|
| `index.html` | Produktai, modeliai, įrengimo lygiai, privalumai, eiga, galerija, DUK, kontaktai |
| `namelis-30.html` … `horizontas-124.html` | 12 modelių puslapių: nuotraukos, fasado stiliai, techniniai duomenys, išplanavimai |
| `galerija.html` | Pagamintų namų nuotraukos |
| `moduliniai-namai.html`, `modulines-pirtys.html`, `sandeliukai-ir-ukio-pastatai.html`, `karkasiniai-namai-ir-garazai.html` | Atskiras puslapis kiekvienai paslaugai (SEO) |
| `kontaktai.html` | Kontaktai ir užklausos vedlys (pirčiai: krosnelė, poilsio kambarys, terasa) |
| `/admin` | Turinio valdymas (Sveltia CMS), veiks prijungus GitHub ir Cloudflare |

Visas tekstas yra `site/src/data/*.json` ir paimtas tik iš kliento pateiktos informacijos.

## Dokumentai

| Failas | Kas jame |
|---|---|
| [04-dizaino-sistema.md](docs/04-dizaino-sistema.md) | Spalvos, šriftas, elementai |
| [06-seo-ir-google.md](docs/06-seo-ir-google.md) | Kas įdiegta, ką daryti paleidžiant (Google Business Profile, Search Console, GA4) |
| [07-tvs-ir-talpinimas.md](docs/07-tvs-ir-talpinimas.md) | TVS, nemokamas talpinimas, paleidimo žingsniai |
| [08-klientui-patikslinti.md](docs/08-klientui-patikslinti.md) | Prieštaravimai ir trūkstama informacija |
| [01](docs/01-analize-modhouse.md), [02](docs/02-darbu-seka.md), [03](docs/03-svetaines-struktura.md), [05](docs/05-klausimai-klientui.md) | Pradinė analizė ir planas |
