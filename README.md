# Moduliniai namai – svetainės projektas

Modulinių namų gamintojo svetainė: analizė, darbų planas, dizaino sistema ir veikiantis prototipas.
Pavyzdys: [modhouse.lt](https://modhouse.lt).

## Prototipas v0.2 (`site/`)

Astro projektas, kuris yra ir prototipas klientui, ir būsimos svetainės pagrindas.

```bash
cd site
npm install
npm run dev        # vystymas: http://localhost:4321
npm run build      # statinė svetainė į site/dist/
npm run artifact   # kopija publikavimui kaip claude.ai Artifact
```

| Puslapis | Kas veikia |
|---|---|
| `index.html` | Aksonometrinis namas (išskaidymas į modulius, fasado keitimas), modelių planai tuo pačiu masteliu, sienos pjūvis, statybos grafikas |
| `namai.html` | Katalogas su filtrais pagal plotą |
| `modelis-*.html` | Modelio puslapis: brėžinys, planas su matmenimis, patalpų plotai, kainos pagal apdailą |
| `konfiguratorius.html` | Kainos skaičiuoklė ir pasiūlymo dokumento generavimas |
| `eiga.html` | Statybos grafikas savaitėmis |
| `darbai.html`, `duk.html`, `kontaktai.html` | Objektai, DUK ir garantija, užklausos forma su validacija |
| `kainynas.html` | Kainyno valdymo demonstracija: pakeistos kainos iškart matosi konfigūratoriuje |

**Duomenys:** visi modeliai, kainos, apdaila, fasadai ir papildomi darbai yra `site/src/data/kainynas.json`.
Tikroje svetainėje šis failas bus pildomas iš Google Sheets arba TVS.

Pavadinimas „MODULIS“, kainos, kontaktai ir objektai yra pavyzdiniai.

## Dokumentai (`docs/`)

| Failas | Kas jame |
|---|---|
| [01-analize-modhouse.md](docs/01-analize-modhouse.md) | modhouse.lt ir konkurentų analizė |
| [02-darbu-seka.md](docs/02-darbu-seka.md) | Darbų seka, įvertinimas, rizikos |
| [03-svetaines-struktura.md](docs/03-svetaines-struktura.md) | Svetainės medis, turinys, formos laukai |
| [04-dizaino-sistema.md](docs/04-dizaino-sistema.md) | Spalvos, šriftai, išskirtiniai elementai |
| [05-klausimai-klientui.md](docs/05-klausimai-klientui.md) | Brifo klausimynas |
