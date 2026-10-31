# Katalogo perdirbimo įrankiai

Partnerio katalogo („Modular homes 2023/24“, PDF) medžiaga perdirbta svetainei. Pats PDF į repozitoriją nekeliamas.

- `planai.py` – iš PDF vektorinių brėžinių iškerpa išplanavimus, švediškus patalpų pavadinimus pakeičia
  lietuviškais (KÖK/VARDAGSRUM → VIRTUVĖ/SVETAINĖ, SOV → MIEGAMASIS, BASTU → PIRTIS, LOFT → ANTRESOLĖ ir t. t.),
  pašalina katalogo ženklelius ir neaiškius trumpinius. Geometrija ir matmenys nekeičiami.
- `nuotraukos.py` – nuotraukos ištrauktos iš PDF originalia raiška ir perdirbtos: veidrodiškai apverstos
  (išskyrus vaizdus iš viršaus ir pjūvius), iš naujo sukadruotos (~9 % priartinimas, skirtingi poslinkiai),
  tonuotos vienu stiliumi (šilti šviesūs tonai, žalsvi šešėliai, matinis tonas, vinjetė, grūdėtumas),
  be metaduomenų, su lietuviškais vardais (`site/public/img/k/`). Pavyzdys: `docs/nuotrauku-perdirbimas-pries-po.png`.
- Pastaba: tokie pakeitimai stipriai sumažina panašumą, bet atvirkštinė vaizdų paieška (Google Lens) vis tiek
  gali atpažinti originalą. Visiškai unikalūs vaizdai bus tik iš kliento objektų nuotraukų.
- Netinkamos nuotraukos (su kito gamintojo užrašu) nenaudojamos.

Paleidimas: `pip install pymupdf` ir `python3 planai.py all` (keliai į PDF ir šriftą nurodyti failo viršuje).
