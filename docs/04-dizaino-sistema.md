# 4. Pirminės dizaino (Web UI) gairės

Kryptis: **„gamyklos tikslumas + medžio šiluma“.** Vizualinė kalba remiasi brėžiniais –
moduliai rodomi kaip planai su matmenimis, techniniai duomenys – brėžinio etikečių stiliumi.
Tai tiesiogiai pasakoja produkto esmę: namas surenkamas iš tikslių gamykloje pagamintų modulių.

> Galutinės spalvos ir šriftai tvirtinami pagal kliento prekės ženklą (etapas 2).

## Spalvos (tokenai)
| Tokenas | Šviesi tema | Tamsi tema | Paskirtis |
|---|---|---|---|
| `--paper` | `#F2F4F1` | `#141A18` | Fonas |
| `--surface` | `#FFFFFF` | `#1C2421` | Kortelės, formos |
| `--ink` | `#16211D` | `#E6EBE8` | Tekstas |
| `--muted` | `#5A6862` | `#9AA8A2` | Antrinis tekstas |
| `--spruce` | `#24493F` | `#7FB5A4` | Pagrindinė (eglės žalia) |
| `--timber` | `#B9844A` | `#D7A56B` | Akcentas (mediena), CTA |
| `--line` | `#CDD5D0` | `#2E3935` | Linijos, brėžiniai |

## Tipografija
| Rolė | Šriftas | Naudojimas |
|---|---|---|
| Antraštės | **Archivo** (Semi-Expanded, 600–800) | H1–H3, skaičiai |
| Tekstas | **Source Sans 3** (400/600) | Pastraipos, formos |
| Techniniai duomenys | **JetBrains Mono** (500) | m², matmenys, etiketės |

Skalė: 14 / 16 / 18 / 22 / 28 / 40 / 56 px. Teksto eilutės plotis ≤ 65 simbolių.

## Komponentai
- **Mygtukai:** pagrindinis (medžio spalvos fonas), antrinis (kontūrinis), teksto nuoroda
- **Modelio kortelė:** modulių planas (SVG, proporcingas m), pavadinimas, m² / kambariai / moduliai, kaina „nuo“
- **Žingsnis:** numeris (tikra seka), pavadinimas, trukmė, aprašas
- **Skaičiuoklė:** segmentuoti pasirinkimai, žymimieji laukeliai, rezultatų blokas
- **Palyginimo lentelė:** ✓ / – žymėjimas
- **Akordeonas (DUK):** `<details>` elementas
- **Forma:** etiketė virš lauko, klaidos tekstas po lauku, aiškus sėkmės pranešimas

## Principai
- Mobilioji versija pirmiausia; CTA „Skambinti“ prilipdytas mobiliame
- Tikros nuotraukos iš gamybos ir objektų (ne stock)
- Kaina visada su „+ PVM“ arba „su PVM“ – nuosekliai
- Prieinamumas: kontrastas ≥ 4.5:1, matomas fokusas, formos etiketės
