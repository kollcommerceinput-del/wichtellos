# Spreadshop-Neuheiten Weihnachten 2026 einbauen (Cloud, 17.11.)

Anlass: Spreadshop-Newsletter 17.11. – neue Produkte: **Unisex Premium Organic Weihnachtspullover**, **Weihnachts-Kissenbezug**
(100 % Baumwolle, 2 Farben), **Weihnachts-Geschirrtuch**, **Weihnachts-Schürze**, **Contrast Baseballkappe**, **Vintage Leo-Shopper**.

Der Partnerbereich (partner.spreadshirt.de) ist aus der Cloud nicht erreichbar (Netz gesperrt, kein Login). Die Klicks dort
machen Toni oder die PC-Sitzung im echten Chrome. Ablauf wie bisher: `notizen/offen.md`, Abschnitt „Spreadshop“.

## Schritt 1 – prüfen, ob Express die Neuheiten schon drauf hat

Bestehende Motive laufen über die Express-Erstellung. Ob Spreadshirt neue Produkte dort selbst ergänzt, ist nicht belegt.
Deshalb erst an **einem** Motiv prüfen (z. B. „Bei uns wohnt ein Wichtel“):

1. Partnerbereich → Designs → Motiv öffnen → Produktliste.
2. Nach „Weihnachtspullover“, „Schürze“, „Geschirrtuch“, „Kissenbezug“, „Contrast“, „Leo“ suchen.
3. **Wenn sie da sind:** nur kurz prüfen, ob sie im Spreadshop sichtbar sind – fertig für die alten Motive.
4. **Wenn nicht:** beim Motiv „Produkt hinzufügen“ und das neue Produkt wählen. Bei einem Motiv, das schon auf Express steht,
   **nicht** auf „Umschalten“ gehen – das bietet nur den Wechsel zurück an (abbrechen).
   Danach „Einstellungen ändern“: Accessoires + Kinder + Babys anhaken, Platzierung prüfen, Speichern, „Speichern & Veröffentlichen“.

## Schritt 2 – alte Motive auf die passenden Neuheiten

Nicht jedes Motiv auf jedes Produkt. Vorschlag:

| Neues Produkt | Bestehende Motive |
|---|---|
| Weihnachtspullover | Ich liebe Wichteln (beide Fassungen), Bei uns wohnt ein Wichtel, Wichtel-Gewinner, Chef-Wichtel, **Mein Wichtel heißt … – mit Wunschnamen** (der Newsletter empfiehlt ausdrücklich Pullis mit Namen) |
| Kissenbezug | Bei uns wohnt ein Wichtel, Zuhause ist, wo der Wichtel wohnt, Mein Wichtel heißt … (Wunschname) |
| Schürze, Geschirrtuch | Der Wichtel war's! |
| Contrast Cap | Chef-Wichtel, Wichtel-Champion, Wichtel-Gewinner |
| Leo-Shopper | **Wichtel-Beute** (passt am besten zu einer Tasche), Wichtel-Geschenk |

Beim Leo-Shopper erst in der Vorschau prüfen, ob die Schrift auf dem Muster lesbar ist (eher die dunkle Fassung weiß-gelb).

## Schritt 3 – neue Motive hochladen (Dateien in diesem Ordner)

Übersicht: `uebersicht-neuheiten.png`. Neu erzeugen: `node marketing/merch/skripte/render-neuheiten.js`.
Je Motiv eine helle Fassung (`-hell.png`, rot/grün, für helle Stoffe) und eine dunkle (`-dunkel.png`, weiß/gelb, für dunkle Stoffe).
Upload-Limit ~11 pro Tag. 12 Dateien → zwei Tage. Vorschlag: Tag 1 = alle 6 hellen + die dunklen von pulli-01, kissen-01, kueche-01, -02, -03;
Tag 2 = kueche-04-dunkel.

Ablauf wie bei der Onni-Serie: hochladen → per **Express** veröffentlichen → Name, Beschreibung, Tags. Dunkle Fassung bekommt
im Namen „– weiß-gelb“ und in der Beschreibung „Helle Schrift für dunkle Stoffe.“
Tags einzeln tippen, je 1 s warten, dann Komma. Möglichst Ein-Wort-Tags (eine Pause im Wort teilt den Tag).

| Datei | Name im Shop | Beschreibung | Tags |
|---|---|---|---|
| kueche-01 | Plätzchen-Wichtel | Für alle, die in der Adventszeit Plätzchen backen – mit dem Wichtel von WichtelLos. Schönes Wichtelgeschenk für Back-Fans. | plätzchen, backen, weihnachtsbäckerei, wichtel, wichteln, wichtelgeschenk, weihnachten, advent, küche, schürze |
| kueche-02 | Hier backt der Wichtel | Der Wichtel hat die Küche übernommen: lustiges Motiv für die Weihnachtsbäckerei. Passt auf Schürze, Geschirrtuch und Tasse. | backen, plätzchen, wichtel, wichteln, wichtelgeschenk, weihnachten, küche, schürze, geschirrtuch, advent |
| kueche-03 | Die Plätzchen? Die hat der Wichtel genascht! | Wenn die Keksdose leer ist, war es natürlich der Wichtel. Lustiges Wichtel-Motiv für die Adventszeit. | plätzchen, naschen, wichtel, wichteln, wichtelgeschenk, weihnachten, lustig, küche, kekse, advent |
| kueche-04 | Naschen verboten! Der Wichtel zählt mit. | Der Wichtel passt auf die Plätzchen auf. Lustiges Motiv für Schürze und Geschirrtuch – ein Wichtelgeschenk für Back-Fans. | naschen, plätzchen, wichtel, wichteln, wichtelgeschenk, weihnachten, lustig, küche, schürze, backen |
| pulli-01 | Den Pulli hat mir mein Wichtel geschenkt | Der Weihnachtspulli mit Erklärung: Den hat der Wichtel ausgesucht. Lustiges Wichtelgeschenk für die Weihnachtsfeier. | weihnachtspullover, pulli, wichtel, wichteln, wichtelgeschenk, weihnachten, weihnachtsfeier, lustig, geschenk, hoodie |
| kissen-01 | Psst … hier schläft ein Wichtel | Für Kinderzimmer, Sofa und alle kleinen Wichtel-Fans. Mit dem Wichtel von WichtelLos. | kissen, kinderzimmer, wichtel, wichteln, wichtelgeschenk, weihnachten, schlafen, kinder, gemütlich, advent |

## Schritt 4 – Preise (Toni)

Neue Produkte haben noch keinen Preis in `marketing/merch/shop/preise-spreadshop.xlsx`. Regel wie bisher: Spreadshirt-Standard
nehmen, dann die nächste Stufe auf ,99 (4,99/9,99), mit Preisleiter. Keine erfundenen „vorher“-Preise.

## Schritt 5 – danach auf wichtellos.de (PC)

Wenn die Produkte live sind: auf `/wichtel-tassen/` eigene Reiter für Weihnachtspullover, Schürze und Kissen (`SHOP_REITER` in `build.py`).
Die Produktdaten und Fotos holt `tools/shop_fotos.py` aus `marketing/merch/shop-fotos/liste.json`. Die Liste entsteht im echten Chrome –
also PC-Aufgabe.

Optional (Newsletter-Tipp): ein Muster von Schürze und Kissen bestellen und eigene Fotos machen (Pins/Reels).
