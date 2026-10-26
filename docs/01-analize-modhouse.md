# 1. Pavyzdinio puslapio (modhouse.lt) ir rinkos analizė

> **Šaltinių pastaba.** Tiesioginė prieiga prie modhouse.lt iš darbo aplinkos buvo užblokuota,
> todėl analizė parengta pagal viešai indeksuotus modhouse.lt puslapius (DUK, „Apie mus“,
> anglų k. versija), trečiųjų šalių katalogus ir apžvalgas. Prieš dizaino etapą būtina
> peržiūrėti svetainę naršyklėje ir papildyti skyrių „Ką patikrinti gyvai“.

## 1.1. Kas yra modhouse.lt

| Parametras | Duomenys |
|---|---|
| Įmonė | MB Modhouse |
| Gamyba | Uždarame, sausame angare Vilniaus r. (Rukainiai, Senasis Minsko pl.) |
| Produktas | Karkasiniai moduliniai namai, A / A+ (galima iki A++) energinė klasė |
| Apdaila | Dalinė arba pilna |
| Rinkos | Visa Lietuva + partneriai Europoje / Skandinavijoje |
| Kaina | „Nuo 700 € + PVM / m²“ (DUK). Trečiųjų šalių katalogas: ModHouse 40 / 65 / 95 m² modeliai, ~55–160 tūkst. € |
| Terminai | Gamyba 2–6 mėn. (pagal projekto sudėtingumą) |
| Garantija | Puslapiuose nurodomos **skirtingos** sąlygos: DUK – min. 5 m. darbams ir konstrukcijai, 10 m. paslėptiems defektams; „Apie mus“ – 2 m. matomiems, 5 m. paslėptiems darbams |
| Kalbos | LT, EN (`/en/`) |
| Kontaktai | el. paštas, telefonas, Facebook puslapis |

## 1.2. Svetainės struktūra (rekonstruota iš indeksuotų URL)

```
/                                   Pagrindinis
/apie-mus                           Apie mus
/garantija-moduliniam-namui-apie-mus  Garantija (dubliuoja „Apie mus“)
/klausimai-ir-atsakymai-apie-modulinius-namus/  DUK
/moduliniai-nameliai-kodel-verta-statyti/       Tinklaraščio / SEO straipsnis
/en/                                Anglų k. versija
```

URL struktūra mišri (vieni su `www`, kiti be; vieni baigiasi `/`, kiti ne) – tai rodo,
kad svetainė keitė platformą arba turi dubliuotų puslapių.

## 1.3. Vertinimas

### Stiprybės (ką verta perimti)
- **Aiškus kainos atskaitos taškas** („nuo X €/m² + PVM“) – klientas iškart supranta lygį.
- **Sąžiningas paaiškinimas, kas neįeina į kainą** (pamatai, transportas, prisijungimai) – mažina nusivylimą ir „tuščias“ užklausas.
- **SEO turinys** – ilgi DUK ir straipsniai su raktiniais žodžiais („moduliniai namai“, „modulinis namas“, „moduliniai nameliai“). Apžvalgose Modhouse rodoma TOP sąrašuose.
- **Gamybos vietos akcentas** („sausas uždaras angaras“) – kokybės argumentas.
- **EN versija** – eksporto rinkoms.

### Silpnybės (ką daryti geriau)
| Problema | Poveikis | Mūsų sprendimas |
|---|---|---|
| Prieštaringos garantijos sąlygos skirtinguose puslapiuose | Mažina pasitikėjimą, teisinė rizika | Vienas „Garantija“ puslapis, vienas šaltinis (CMS laukas) |
| Dubliuoti / nenuoseklūs URL | SEO kanibalizacija | Aiškus URL planas, 301 peradresavimai, canonical |
| Nėra skaidraus modelių katalogo su kainomis (bent viešai indeksuoto) | Klientas negali palyginti | Modelių katalogas su m², kambariais, planu, kaina „nuo“ |
| Nėra interaktyvaus kainos skaičiuoklio | Daugiau rankinių užklausų | Skaičiuoklė: modelis + apdaila + papildomos paslaugos |
| Statybos eiga aprašyta tik tekstu DUK | Neaišku, ko laukti | Vizuali 6 žingsnių eiga su terminais |
| Silpni socialiniai įrodymai | — | Atlikti objektai, atsiliepimai, vaizdo įrašai iš gamybos |

### Ką patikrinti gyvai (prieš dizainą)
- [ ] Pagrindinio puslapio sekcijų seka, hero žinutė, CTA tekstai
- [ ] Ar yra modelių katalogas / galerija, kaip pateikiami planai
- [ ] Kontaktų forma: laukai, ar yra failo įkėlimas (sklypo planas)
- [ ] Mobilios versijos kokybė, greitis (PageSpeed Insights, Core Web Vitals)
- [ ] Platforma / CMS (WordPress? Wix?), naudojami analitikos įrankiai
- [ ] Meta aprašai, schema.org žymėjimas, sitemap.xml

## 1.4. Konkurentai, kuriuos verta peržiūrėti

| Svetainė | Kodėl įdomi |
|---|---|
| monamai.lt | Kaina „nuo 800 €/m²“ antraštėje, miestų puslapiai SEO (`/moduliniai-namai-vilniuje/`) |
| moduliniaipastatai.lt/kainos | Kainos pagal apdailos lygį €/m² – gera skaičiuoklės logikos atspirtis |
| tmodul.lt | Modelių katalogas |
| modulinis-namas.lt | Gamintojų palyginimai, DUK |
| paslaugos.lt/moduliniai-namai | Rodo, kaip klientai ieško (pagal rajoną) |

**Rinkos kainų gairės 2026 m. (be PVM):** dalinė apdaila ~520–570 €/m², standartinė
~780–920 €/m², premium ~920–1 100 €/m². Naudojama tik prototipo skaičiuoklėje kaip pavyzdys –
tikras kainas pateikia klientas.

## 1.5. Išvados projektui

1. Mūsų pranašumas turi būti **skaidrumas**: modeliai + kainos + kas įeina + eiga + vienos garantijos sąlygos.
2. Pagrindinis konversijos tikslas – **užklausa / pasiūlymo gavimas** (forma, telefonas), antrinis – skaičiuoklės rezultatas el. paštu.
3. SEO: atskiri puslapiai kiekvienam modeliui, DUK, straipsniai, miestų/regionų puslapiai.
4. Dvi kalbos nuo pradžių (LT, EN), struktūra paruošta trečiai (pvz., NO/SE).

### Šaltiniai
- https://modhouse.lt/klausimai-ir-atsakymai-apie-modulinius-namus/
- https://www.modhouse.lt/apie-mus · https://www.modhouse.lt/garantija-moduliniam-namui-apie-mus
- https://modhouse.lt/en/ · https://www.facebook.com/p/Modhouselt-61556739732363/
- https://www.prefabcatalog.com/manufacturers/modhouse
- https://ntzinios.lt/top-10-geriausi-moduliniu-namu-gamintojai-lietuvoje-patikimi-pasirinkimai-2026-metams/
- https://moduliniaipastatai.lt/kainos/ · https://monamai.lt/ · https://www.tmodul.lt/
- https://www.statyba.lt/imones/Modhouse-MB/2489416
