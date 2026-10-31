# 4. Dizaino sistema (Web UI) – v0.2

Kryptis: **architektūrinis brėžinys.** Svetainės vizualas yra pats produktas: namai rodomi
aksonometriniais brėžiniais, kuriuos galima išskaidyti į modulius, planai nubraižyti tuo pačiu
masteliu, techniniai duomenys pateikiami kaip brėžinio spaudas. Vengiama šabloninių sprendimų:
nėra stock nuotraukų, emoji, gradientų ir vienodų kortelių su šešėliais.

> Galutinės spalvos ir pavadinimas tvirtinami pagal kliento prekės ženklą. Visi tokenai yra
> `site/public/css/site.css` pradžioje, todėl keičiami vienoje vietoje.

## Spalvos
| Tokenas | Šviesi | Tamsi | Paskirtis |
|---|---|---|---|
| `--bg` | `#F1F3F5` | `#0B111C` | Fonas (šaltas, ne kreminis) |
| `--surface` | `#FFFFFF` | `#111A28` | Kortelės, formos, brėžinių fonas |
| `--ink` | `#0E1726` | `#E8ECF3` | Tekstas, linijos |
| `--ink-2` | `#4B5567` | `#9AA6B8` | Antrinis tekstas |
| `--cobalt` | `#2541B2` | `#8DA2FF` | Pagrindinė: mygtukai, akcentai, modulių sujungimai planuose |
| `--larch` | `#B9773F` | `#D89A64` | Maumedis: medžiagos, sklypo darbai grafike |

## Tipografija
| Rolė | Šriftas | Kur |
|---|---|---|
| Antraštės | **Schibsted Grotesk** 800–900, glaudus tarpas | H1–H3, kainos, skaičiai |
| Tekstas | **Instrument Sans** 400–600 | Pastraipos, formos, meniu |
| Brėžinio užrašai | **IBM Plex Mono** 400–500 | Matmenys, etiketės, mastelis, pasiūlymo rekvizitai |

Visi trys šriftai palaiko lietuviškas raides (latin-ext).

## Išskirtiniai elementai
- **Aksonometrinis namas** (`app.js → drawAxo`): generuojamas iš kainyno duomenų, keičiasi fasadas, stogas, galima išskaidyti į modulius.
- **Planai tuo pačiu masteliu** (`drawPlan`): modelių palyginimas, patalpų plotai, modulių sujungimai mėlyna punktyrine linija.
- **Sienos pjūvis** su sluoksniais ir storiais (`WallSection.astro`).
- **Statybos grafikas savaitėmis** (`Gantt.astro`): matosi, kad gamykla ir sklypas dirba vienu metu.
- **Pasiūlymo dokumentas** su numeriu, galiojimo data, brėžiniais ir kainų išskaidymu.

## Principai
- Asimetrinis 12 stulpelių tinklelis, kampai be apvalinimo (išskyrus filtrų „piliules“)
- Šviesi ir tamsi tema, mobilioji versija su prilipusiu „Skambinti / Apskaičiuoti kainą“ mygtuku
- Kaina visada su nuoroda „be PVM“ arba „su PVM“
- Prieinamumas: matomas fokusas, formų etiketės, klaidų tekstai, `prefers-reduced-motion`
