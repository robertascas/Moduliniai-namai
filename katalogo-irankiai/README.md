# Katalogo perdirbimo įrankiai

Partnerio katalogo („Modular homes 2023/24“, PDF) medžiaga perdirbta svetainei. Pats PDF į repozitoriją nekeliamas.

- `planai.py` – iš PDF vektorinių brėžinių iškerpa išplanavimus, švediškus patalpų pavadinimus pakeičia
  lietuviškais (KÖK/VARDAGSRUM → VIRTUVĖ/SVETAINĖ, SOV → MIEGAMASIS, BASTU → PIRTIS, LOFT → ANTRESOLĖ ir t. t.),
  pašalina katalogo ženklelius ir neaiškius trumpinius. Geometrija ir matmenys nekeičiami.
- Nuotraukos ištrauktos iš PDF originalia raiška, iš naujo sukadruotos, lengvai pakoreguotos spalvos,
  pašalinti metaduomenys, suteikti lietuviški failų vardai (`site/public/img/k/`).
- Netinkamos nuotraukos (su kito gamintojo užrašu) nenaudojamos.

Paleidimas: `pip install pymupdf` ir `python3 planai.py all` (keliai į PDF ir šriftą nurodyti failo viršuje).
