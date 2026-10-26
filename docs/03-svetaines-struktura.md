# 3. Svetainės struktūra (sitemap) ir turinys

## 3.1. Svetainės medis

```
/                              Pagrindinis
├── /namai/                    Modelių katalogas (filtrai: m², kambariai, aukštai)
│   ├── /namai/modulis-40/     Modelio puslapis
│   ├── /namai/modulis-65/
│   ├── /namai/modulis-95/
│   └── /namai/modulis-120/
├── /individualus-projektas/   Individualus namas pagal kliento poreikius
├── /kaip-statome/             Statybos eiga (6 žingsniai), terminai
├── /kainos/                   Kas įeina, apdailos lygiai, skaičiuoklė
├── /technologija/             Konstrukcija, sienos sluoksniai, energinė klasė, gamykla
├── /atlikti-darbai/           Objektų galerija
│   └── /atlikti-darbai/{objektas}/
├── /garantija/                Vienas garantijos sąlygų šaltinis
├── /duk/                      Dažnai užduodami klausimai
├── /straipsniai/              Tinklaraštis (SEO)
├── /apie-mus/
├── /kontaktai/                Forma, žemėlapis, rekvizitai
├── /privatumo-politika/
└── /en/...                    Anglų k. versija (ta pati struktūra)
```

## 3.2. Pagrindinio puslapio sekcijos (prototipe)

1. **Navigacija** – logotipas, meniu, telefonas, CTA „Gauti pasiūlymą“
2. **Hero** – pagrindinė žinutė, 3 faktai (terminas, energinė klasė, garantija), 2 CTA
3. **Modeliai** – 4 kortelės su planu iš modulių, m², kambariai, kaina „nuo“
4. **Kaip statome** – 6 žingsniai su trukme
5. **Kainos skaičiuoklė** – modelis + apdaila + papildomos paslaugos → orientacinė kaina ir terminas
6. **Kas įeina** – apdailos lygių palyginimo lentelė
7. **Atlikti darbai** – objektų nuotraukos
8. **DUK** – 5–6 dažniausi klausimai (akordeonas)
9. **Užklausos forma** – vardas, tel., el. paštas, sklypo vieta, dominantis modelis, žinutė
10. **Poraštė** – kontaktai, rekvizitai, nuorodos, socialiniai tinklai

## 3.3. Modelio puslapio turinys
- Nuotraukų galerija / vizualizacijos
- Pagrindiniai duomenys: bendras plotas, modulių skaičius ir matmenys, kambariai, energinė klasė
- Planas (interaktyvus arba PDF atsisiuntimas)
- Kaina pagal apdailos lygį
- Kas įeina / neįeina
- Terminas
- CTA: „Gauti pasiūlymą šiam modeliui“ (forma su užpildytu modeliu)
- Panašūs modeliai

## 3.4. Pagrindiniai vartotojų scenarijai
| Vartotojas | Tikslas | Kelias |
|---|---|---|
| Ieško vasarnamio / mažo namo | Sužinoti kainą | Google → modelio puslapis → skaičiuoklė → forma |
| Šeima, nuolatinis būstas | Palyginti modelius, suprasti eigą | Pagrindinis → katalogas → modelis → kaip statome → forma |
| Turi savo projektą | Ar gali pagaminti | Pagrindinis → individualus projektas → forma su failu |
| Užsienio partneris | Bendradarbiavimas | /en/ → apie mus → kontaktai |

## 3.5. Užklausos formos laukai
| Laukas | Privalomas |
|---|---|
| Vardas | taip |
| Telefonas | taip |
| El. paštas | taip |
| Sklypo vieta (savivaldybė) | ne |
| Dominantis modelis | ne (užpildomas automatiškai) |
| Ar turite sklypą / statybos leidimą? | ne |
| Planuojama pradžia | ne |
| Failas (sklypo planas, eskizas) | ne |
| Žinutė | ne |
| Sutikimas su privatumo politika | taip |
