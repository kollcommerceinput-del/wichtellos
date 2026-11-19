"""Daten für Themen-Seiten nach Google Trends (03.11.): Adventskalender befüllen, Geschenke für Männer, Geschenke für Frauen.
Ideen: (Titel, Text, Amazon-Suche[, ASIN]) – nur Amazon-Suchen, keine Preise/Fotos (PartnerNet-Regeln).
Abschnitt: (Überschrift, Onni-Sticker, Einleitung, Ideen)."""

AK_FUELLEN = [
    ('Für Kinder', 'jubel', 'Klein, bunt und zum Spielen – Süßes nur ab und zu, dann bleibt es spannend.', [
        ('Mini-Figuren', 'Tiere, Ritter oder Feen – am Ende ist eine ganze Spielwelt zusammen.', 'Mini Figuren Set Kinder'),
        ('Radiergummis mit Motiv', 'Obst, Tiere, Weihnachtsmotive – günstig im Set.', 'Radiergummi Set Kinder Motive'),
        ('Sticker-Bögen', 'Für Hefte, Briefe und die Wichteltür.', 'Sticker Kinder Weihnachten'),
        ('Knete und Slime', 'Kleine Döschen, große Freude an kalten Nachmittagen.', 'Knete Mini Dosen Kinder'),
        ('Haarspangen und Haargummis', 'Kleine Sets, schnell aufgeteilt.', 'Haarspangen Kinder Set'),
        ('Mini-Puzzles', 'Ein kleines Puzzle in Tüte oder Schachtel.', 'Mini Puzzle Kinder Adventskalender'),
        ('Seifenblasen', 'Mini-Fläschchen für den Winterspaziergang.', 'Seifenblasen Mini Mitgebsel'),
        ('Leuchtstifte und Glitzerstifte', 'Einzeln verteilt über mehrere Tage.', 'Glitzerstifte Kinder'),
    ]),
    ('Für Erwachsene und Partner', 'herz', 'Kleine Genüsse und Wohlfühl-Momente für jeden Tag.', [
        ('Teebeutel-Auswahl', 'Jeden Tag eine andere Sorte – einzeln verpackt.', 'Tee Probierset einzeln verpackt'),
        ('Mini-Pralinen', 'Feine Einzelstücke statt Massen-Schokolade.', 'Pralinen einzeln verpackt'),
        ('Gesichtsmasken', 'Tuchmasken für einen Wellness-Abend.', 'Tuchmaske Set'),
        ('Badekugeln im Mini-Format', 'Duftet und sprudelt.', 'Badekugeln mini Set'),
        ('Gewürze in Probiergröße', 'Für Hobbyköche – mit Rezeptidee auf dem Zettel.', 'Gewürze Probierset'),
        ('Mini-Kerzen', 'Teelichter mit Winterduft.', 'Duftteelichter Winter'),
        ('Lippenpflege und Handcreme', 'Klein, nützlich, im Winter immer gebraucht.', 'Handcreme mini Set'),
        ('Kaffeekapseln oder Tassen-Kakao', 'Jeden Morgen ein anderer Geschmack.', 'Kaffee Probierset Kapseln'),
    ]),
    ('Für Kollegen und das Büro', 'daumen', 'Neutral, klein und schreibtischtauglich.', [
        ('Haftnotizen mit Motiv', 'Lustige Formen und Sprüche.', 'Haftnotizen lustig'),
        ('Kugelschreiber mit Spruch', 'Wird garantiert benutzt.', 'Kugelschreiber Spruch lustig'),
        ('Büroklammern in Formen', 'Sterne, Herzen, Tannenbäume.', 'Büroklammern Weihnachten'),
        ('Mini-Snacks', 'Nüsse, Fruchtgummi oder Schoko-Täfelchen.', 'Snacks einzeln verpackt'),
    ]),
    ('Das Zubehör', 'lupe', 'Damit die Füllung schön aussieht – Behälter findest du auch bei den Adventskalender-Ideen.', [
        ('Kraftpapier-Tüten mit Zahlen', 'Günstig, schnell gepackt, an einer Schnur aufgehängt.', 'Adventskalender Tüten Kraftpapier Zahlen'),
        ('Zahlen-Sticker 1–24', 'Für Tüten, Gläser oder Umschläge.', 'Adventskalender Zahlen Sticker'),
        ('Holz-Adventskalender zum Befüllen', 'Hält viele Jahre – jedes Jahr neu befüllen.', 'Adventskalender Holz zum Befüllen'),
        ('Mini-Wäscheklammern', 'Zum Aufhängen an Zweig oder Leine.', 'Mini Wäscheklammern Holz'),
    ]),
]

# Gutscheine fürs Befüllen – kosten nichts, nur Zeit (kein Link)
AK_GUTSCHEINE = [
    'Frühstück ans Bett', 'Ein Abend Lieblingsfilm nach Wahl', 'Einmal Spülen übernehmen', 'Gemeinsam Plätzchen backen',
    'Ein Spaziergang mit Kakao', 'Vorlesen vor dem Einschlafen', 'Einmal länger aufbleiben (für Kinder)', 'Eine Massage',
    'Spieleabend', 'Das Lieblingsessen kochen', 'Ein Tag ohne Hausarbeit', 'Gemeinsam Schlittschuhlaufen',
]

MAENNER = [
    ('Genuss', 'geschenk', 'Für Männer, die gern essen, grillen und probieren.', [
        ('Grillgewürz-Set', 'Rubs und Gewürze für Steak, Gemüse und Burger.', 'Grillgewürze Set Geschenk'),
        ('Hot-Sauce-Set', 'Von mild bis richtig scharf – mit Probierkarte.', 'Hot Sauce Set Geschenk'),
        ('Craft-Beer-Probierset (ab 18)', 'Verschiedene Sorten kleiner Brauereien.', 'Craft Beer Geschenkset'),
        ('Kaffee-Probierset', 'Mehrere Röstungen für Kaffeefans.', 'Kaffee Probierset Geschenk'),
        ('Beef-Jerky-Box', 'Herzhafter Snack statt Süßigkeiten.', 'Beef Jerky Geschenkbox'),
        ('Whisky-Steine', 'Kühlen, ohne zu verwässern.', 'Whisky Steine Geschenkset'),
    ]),
    ('Technik und Gadgets', 'lupe', 'Kleine Helfer, die im Alltag wirklich benutzt werden.', [
        ('Powerbank', 'Klein genug für die Jackentasche.', 'Powerbank klein'),
        ('Bluetooth-Tracker', 'Nie wieder Schlüssel suchen.', 'Bluetooth Tracker Schlüssel'),
        ('Kabelloses Ladegerät', 'Handy ablegen, fertig.', 'kabelloses Ladegerät'),
        ('Bluetooth-Lautsprecher', 'Für Garage, Bad oder Balkon.', 'Bluetooth Lautsprecher klein wasserdicht'),
        ('Stirnlampe', 'Für Keller, Camping und Autopannen.', 'Stirnlampe LED'),
    ]),
    ('Werkzeug und Heimwerken', 'daumen', 'Für alle, die gern selbst anpacken.', [
        ('Multitool', 'Zange, Messer, Schraubendreher in einem.', 'Multitool'),
        ('Bit-Set', 'Passt für fast jede Schraube.', 'Bit Set Schraubendreher'),
        ('Taschenlampe mit Magnet', 'Haftet an jedem Blech – Hände bleiben frei.', 'Taschenlampe Magnet LED'),
        ('Werkzeug-Gürteltasche', 'Alles griffbereit auf der Leiter.', 'Werkzeuggürtel'),
    ]),
    ('Sport und draußen', 'winkt', 'Für aktive Männer und Outdoor-Fans.', [
        ('Thermoflasche', 'Hält Kaffee stundenlang heiß.', 'Thermoflasche Edelstahl'),
        ('Laufhandschuhe mit Touch', 'Warm und trotzdem Handy bedienen.', 'Laufhandschuhe Touchscreen'),
        ('Faszienrolle', 'Für müde Muskeln nach dem Sport.', 'Faszienrolle'),
        ('Taschenmesser', 'Der Klassiker für Wanderungen.', 'Taschenmesser'),
    ]),
    ('Gemütlich und lustig', 'jubel', 'Für Sofa, Spieleabend und gute Laune.', [
        ('Lustige Socken', 'Mit Motiven, die zum Hobby passen.', 'lustige Socken Herren'),
        ('Hoodie-Decke', 'Pullover und Decke in einem.', 'Hoodie Decke Herren'),
        ('Kartenspiel für Erwachsene', 'Für den nächsten Spieleabend.', 'Kartenspiel Erwachsene Party'),
        ('Rätselbuch', 'Logik, Sudoku oder Krimirätsel.', 'Rätselbuch Erwachsene'),
    ]),
]

FRAUEN = [
    ('Wellness und Pflege', 'herz', 'Zeit für sich – mit Dingen, die gut tun.', [
        ('Bademantel aus Waffelpiqué', 'Leicht, weich und schnell trocken.', 'Bademantel Waffelpique Damen'),
        ('Badesalz-Set', 'Mehrere Düfte für ruhige Abende.', 'Badesalz Geschenkset'),
        ('Seidenkissenbezug', 'Sanft zu Haut und Haaren.', 'Seidenkissenbezug'),
        ('Massage-Rolle aus Jade', 'Für Gesicht und Nacken.', 'Gesichtsroller Jade'),
        ('Handcreme-Set', 'Mehrere kleine Tuben für Tasche und Büro.', 'Handcreme Geschenkset'),
    ]),
    ('Genuss', 'geschenk', 'Für Genießerinnen und Hobbyköchinnen.', [
        ('Tee-Geschenkset', 'Verschiedene Sorten in schöner Box.', 'Tee Geschenkset Damen'),
        ('Gourmet-Schokolade', 'Besondere Sorten statt Standardtafel.', 'Gourmet Schokolade Geschenk'),
        ('Gin-Tasting-Set (ab 18)', 'Kleine Flaschen zum Probieren.', 'Gin Tasting Set'),
        ('Backmischung im Glas', 'Kekse oder Brownies – nur noch Butter und Ei dazu.', 'Backmischung im Glas'),
    ]),
    ('Wohnen und gemütlich', 'schlaeft', 'Für ein schönes Zuhause im Winter.', [
        ('Duftkerze', 'Mit Zimt, Tanne oder Vanille.', 'Duftkerze Geschenk Damen'),
        ('Kuscheldecke', 'Für Sofa-Abende mit Buch.', 'Kuscheldecke flauschig'),
        ('Lichterkette in Glasflasche', 'Stimmungsvolles Licht für Regal und Fensterbank.', 'Flaschenlicht Lichterkette'),
        ('Kuschelsocken', 'Warm und weich mit Wintermotiv.', 'Kuschelsocken Damen'),
    ]),
    ('Kreativ und Lesen', 'lupe', 'Für kreative Köpfe und Leseratten.', [
        ('Aquarell-Set', 'Farben, Pinsel und Papier für den Einstieg.', 'Aquarell Set Anfänger'),
        ('Notizbuch mit Leineneinband', 'Für Ideen, Listen und Tagebuch.', 'Notizbuch Leinen'),
        ('Buchstütze oder Leselampe', 'Für gemütliche Lesestunden.', 'Leselampe Buch Klemme'),
        ('Malen nach Zahlen für Erwachsene', 'Entspannt und am Ende ein Bild für die Wand.', 'Malen nach Zahlen Erwachsene'),
    ]),
    ('Schmuck und Accessoires', 'jubel', 'Kleine Hingucker zum Anziehen.', [
        ('Schmuck-Organizer', 'Ordnung für Ketten und Ohrringe.', 'Schmuckkästchen Reise'),
        ('Seidentuch', 'Passt zu Mantel und Bluse.', 'Seidentuch Damen'),
        ('Haarklammern im Set', 'Gerade wieder angesagt.', 'Haarklammern Set Damen'),
        ('Touch-Handschuhe', 'Warm und Handy bedienen.', 'Touchscreen Handschuhe Damen'),
    ]),
]

# Adventskalender selber basteln (Toni 03.11.: Anleitungen mit Zubehör von Amazon)
# (Titel, Einleitung, Material, Schritte, Tipp, [(Link-Text, Amazon-Suche)])
AK_BASTELN = [
    ('Tüten-Kalender am Zweig', 'Der Klassiker: 24 Papiertüten an einem Ast oder einer Schnur – in 30 Minuten fertig.',
     ['24 Kraftpapier-Tüten', 'Zahlen-Sticker 1–24', 'Mini-Wäscheklammern', 'Jutekordel', 'ein schöner Ast (aus dem Wald oder Park)'],
     ['Tüten befüllen und oben zweimal umknicken.', 'Je einen Zahlen-Sticker aufkleben – gern kreuz und quer, nicht der Reihe nach.',
      'Kordel an den Ast knoten oder quer übers Fenster spannen.', 'Tüten mit den Mini-Klammern aufhängen.'],
     'Wer mag, stempelt oder malt die Tüten vorher an – Kinder helfen gern mit.',
     [('Kraftpapier-Tüten', 'Kraftpapier Tüten klein'), ('Zahlen-Sticker', 'Adventskalender Zahlen Sticker'),
      ('Mini-Klammern', 'Mini Wäscheklammern Holz'), ('Jutekordel', 'Jutekordel')]),
    ('Klopapierrollen-Kalender', 'Kostet fast nichts: 24 leere Rollen werden zu kleinen Päckchen oder einer Wabe im Bilderrahmen.',
     ['24 leere Klopapierrollen (ab jetzt sammeln!)', 'Bastelfarbe oder Geschenkpapier', 'Zahlen-Sticker oder Stift', 'Kleber', 'optional: großer Bilderrahmen ohne Glas'],
     ['Rollen anmalen oder mit Geschenkpapier bekleben.', 'Eine Seite einknicken (zwei halbe Bögen nach innen drücken), befüllen, dann die andere Seite genauso schließen.',
      'Zahlen aufkleben oder schreiben.', 'Als Stapel in eine Kiste stellen – oder als Wabe in einen Bilderrahmen kleben.'],
     'Für kleine Füllungen wie Bonbons, Radiergummis und zusammengerollte Gutscheine.',
     [('Bastelfarbe', 'Acrylfarbe Set Basteln'), ('Zahlen-Sticker', 'Adventskalender Zahlen Sticker'), ('Bastelkleber', 'Bastelkleber')]),
    ('Streichholzschachtel-Kalender', 'Mini-Format für Schreibtisch oder Wichteltür: 24 Schachteln als kleiner Turm oder Häuschen.',
     ['24 leere Streichholzschachteln (Bastelbedarf, ohne Hölzer)', 'Washi-Tape oder Geschenkpapier-Reste', 'Zahlen-Sticker', 'Heißkleber oder Bastelkleber'],
     ['Schachteln mit Washi-Tape oder Papier bekleben.', 'Zahlen aufkleben.', 'In 4 Reihen à 6 zu einem Block zusammenkleben – fertig ist die Kommode.', 'Mit Mini-Süßem, Glückskeks-Sprüchen oder Wichtel-Briefchen befüllen.'],
     'Passt perfekt zur Wichteltür – der Wichtel bekommt seine eigene Kommode.',
     [('leere Streichholzschachteln', 'Streichholzschachteln leer basteln'), ('Washi-Tape', 'Washi Tape Weihnachten'), ('Heißklebepistole', 'Heißklebepistole klein')]),
    ('Kalender in Gläsern', 'Für Erwachsene: 24 kleine Gläser mit Tee, Gewürzen, Nüssen oder Süßem.',
     ['24 Mini-Gläser mit Deckel', 'Etiketten oder Kreidesticker', 'Füllung: Tee, Gewürze, Nüsse, Bonbons', 'Bänder'],
     ['Gläser spülen und trocknen.', 'Befüllen und verschließen.', 'Etiketten mit Zahl und kurzem Hinweis beschriften („Zimtsterne-Gewürz“).', 'Mit Band verzieren und auf ein Tablett oder Regal stellen.'],
     'Die Gläser kann man danach weiter benutzen – nachhaltig und hübsch.',
     [('Mini-Gläser', 'Mini Gläser mit Deckel Set'), ('Etiketten', 'Etiketten Gläser Kreide'), ('Geschenkband', 'Geschenkband Weihnachten')]),
]

# Nikolaus (05.11., Toni: Werbung zu Onnis Adventskalender; Google Trends „nikolaus geschenke“ Höhepunkt 1.–6.12.)
NIKOLAUS = [
    ('Für Kinder', 'jubel', 'Klein genug für den Stiefel – und lieber zum Spielen als nur Süßes.', [
        ('Schoko-Nikolaus', 'Der Klassiker gehört in jeden Stiefel – gern aus fairer Schokolade.', 'Schoko Nikolaus fair'),
        ('Mandarinen-Netz und Nüsse', 'Wie früher: Mandarinen, Walnüsse und Erdnüsse in der Schale.', 'Nussmischung in Schale Weihnachten'),
        ('Malbuch Winter', 'Für den Nachmittag nach dem Auspacken.', 'Malbuch Winter Weihnachten Kinder'),
        ('Pixi-Bücher zu Weihnachten', 'Passen genau in den Stiefel und sind schnell vorgelesen.', 'Pixi Bücher Weihnachten'),
        ('Kuschelsocken', 'Warme Füße für die kalten Tage.', 'Kuschelsocken Kinder Weihnachten'),
        ('Kleines Spiel', 'Ein Kartenspiel oder Mitbringspiel für die Familie.', 'Mitbringspiel Kinder Kartenspiel'),
        ('Taschenlampe für Kinder', 'Für Abenteuer im Dunkeln – und für die Suche nach dem Wichtel.', 'Taschenlampe Kinder'),
        ('Knete oder Bastelset', 'Etwas für die Hände an langen Winterabenden.', 'Bastelset Kinder Weihnachten'),
    ]),
    ('Für Erwachsene', 'herz', 'Auch Große freuen sich über einen gefüllten Stiefel.', [
        ('Feine Schokolade', 'Eine besondere Tafel statt Massenware.', 'Schokolade Geschenk edel'),
        ('Winter-Tee', 'Mit Zimt, Orange oder Lebkuchen.', 'Wintertee Geschenk'),
        ('Kuschelsocken für Erwachsene', 'Wird garantiert getragen.', 'Kuschelsocken Damen Herren'),
        ('Duftkerze', 'Für gemütliche Abende im Advent.', 'Duftkerze Winter'),
        ('Handcreme', 'Klein, nützlich, im Winter immer gebraucht.', 'Handcreme Geschenk'),
        ('Lebkuchen', 'Ein Stück Weihnachten zum Nachmittagskaffee.', 'Elisenlebkuchen'),
    ]),
    ('Für Kollegen und das Büro', 'daumen', 'Neutral, klein und schreibtischtauglich – gut für den 6. Dezember im Büro.', [
        ('Mini-Schoko-Nikoläuse', 'Für jeden Schreibtisch einer.', 'Schoko Nikolaus klein Großpackung'),
        ('Tassen-Kakao', 'Heiße Schokolade am Stiel für die Kaffeepause.', 'Kakao am Stiel'),
        ('Haftnotizen mit Wintermotiv', 'Klein, lustig und wird benutzt.', 'Haftnotizen Weihnachten'),
    ]),
    ('Stiefel und Zubehör', 'lupe', 'Damit am Morgen des 6. Dezember alles bereitsteht.', [
        ('Nikolausstiefel zum Befüllen', 'Aus Filz oder Stoff – hält viele Jahre.', 'Nikolausstiefel zum Befüllen'),
        ('Nikolausstiefel mit Namen', 'Persönlich bestickt oder zum Selbstbeschriften.', 'Nikolausstiefel personalisiert'),
        ('Nikolaus-Brief', 'Ein Brief vom Nikolaus macht den Morgen besonders.', 'Nikolaus Brief Vorlage'),
        ('Kleine Geschenktüten', 'Für alles, was nicht in den Stiefel passt.', 'Geschenktüten klein Weihnachten'),
    ]),
]


# Black Friday (Toni 07.11.): Black Friday 27.11.2026, Cyber Monday 30.11.2026 – nur Amazon-Suchen + Angebotsseite, keine Preise
BLACKFRIDAY = [
    ('Wichtelgeschenke unter 10 €', 'daumen', 'Für Büro, Schule und Verein – im Angebot oft noch ein paar Euro günstiger.', [
        ('Kuschelsocken', 'Passen immer und sind im Mehrfachpack besonders günstig.', 'Kuschelsocken Damen Herren'),
        ('Thermobecher', 'Für den Kaffee auf dem Weg – wird jeden Tag benutzt.', 'Thermobecher Edelstahl'),
        ('Duftkerze im Glas', 'Winterdüfte wie Zimt, Tanne oder Vanille.', 'Duftkerze im Glas Winter'),
        ('Handwärmer', 'Wiederverwendbar – klein, praktisch, kommt immer gut an.', 'Handwärmer wiederverwendbar'),
        ('Schönes Notizbuch', 'Mit festem Einband – für Listen, Ideen und Termine.', 'Notizbuch A5 Hardcover'),
        ('Schokolade im Geschenkset', 'Etwas Besonderes statt der Tafel aus dem Supermarkt.', 'Schokolade Geschenkset'),
    ]),
    ('Gemütliches für den Winter', 'herz', 'Decken, Licht und Wärme – rund um den Black Friday oft reduziert.', [
        ('Kuscheldecke', 'Weich und groß genug fürs Sofa.', 'Kuscheldecke Flanell'),
        ('Decke mit Ärmeln', 'Der lustige Klassiker für lange Abende.', 'Decke mit Ärmeln'),
        ('Wärmflasche mit Strickbezug', 'Sieht schön aus und wärmt richtig.', 'Wärmflasche mit Strickbezug'),
        ('Lichterkette mit Timer', 'Mit Batterie – passt in jedes Regal und Fenster.', 'Lichterkette Batterie Timer'),
        ('Tee-Geschenkset', 'Verschiedene Sorten zum Probieren.', 'Tee Geschenkset'),
        ('Plüsch-Hausschuhe', 'Warme Füße vom Aufstehen bis zum Schlafengehen.', 'Hausschuhe Plüsch'),
    ]),
    ('Küche & Wohlfühlen', 'herz', 'Für alle, die gern kochen, backen oder sich etwas Gutes tun – rund um den Black Friday oft reduziert.', [
        ('Plätzchen-Ausstecher-Set', 'Sterne, Herzen und Tannen – für die Weihnachtsbäckerei.', 'Ausstecher Set Weihnachten'),
        ('Gewürz-Geschenkset', 'Zum Ausprobieren für alle, die gern kochen.', 'Gewürze Geschenkset'),
        ('Mini-Waffeleisen', 'Kleine Waffeln für gemütliche Nachmittage.', 'Mini Waffeleisen'),
        ('Wellness-Set', 'Badezusatz, Creme und Peeling – Auszeit zum Verschenken.', 'Wellness Geschenkset Damen'),
        ('Mütze und Schal im Set', 'Warm und schön – passt fast jedem.', 'Mütze Schal Set Winter'),
        ('Kuschel-Bademantel', 'Flauschig für kalte Wintermorgen.', 'Bademantel Flausch'),
    ]),
    ('Spiele für den Abend', 'jubel', 'Spiele sind ein Geschenk für alle – und oft deutlich reduziert.', [
        ('Brettspiel für die Familie', 'Für Abende mit Groß und Klein.', 'Brettspiel Familie'),
        ('Escape-Room-Spiel', 'Rätseln wie im Escape Room – am Küchentisch.', 'Escape Room Spiel'),
        ('Partyspiel', 'Schnell erklärt, sorgt sofort für Lacher.', 'Kartenspiel Erwachsene Party'),
        ('Puzzle mit 1000 Teilen', 'Für ruhige Winterabende.', 'Puzzle 1000 Teile'),
        ('Quizspiel', 'Wer weiß am meisten? Gut für Familie und Team.', 'Quizspiel'),
        ('Krimidinner', 'Ein ganzer Abend als Geschenk.', 'Krimidinner Spiel'),
    ]),
    ('Technik-Kleinigkeiten', 'lupe', 'Kleine Technik ist am Black Friday besonders oft im Angebot.', [
        ('Kleine Powerbank', 'Passt in jede Tasche – rettet den Tag, wenn der Akku leer ist.', 'Powerbank klein'),
        ('Bluetooth-Lautsprecher', 'Klein, aber laut genug für Küche und Bad.', 'Bluetooth Lautsprecher klein'),
        ('Bluetooth-Kopfhörer', 'Für Sport, Bahn und Büro.', 'In Ear Kopfhörer Bluetooth'),
        ('LED-Leselampe', 'Zum Anklemmen ans Buch – für Leseratten.', 'Leselampe Buch LED'),
        ('Ladekabel-Set', 'Unspektakulär, aber jeder braucht eins mehr.', 'Ladekabel Set USB C'),
        ('Handy-Stativ mit Fernauslöser', 'Für Gruppenfotos bei der Weihnachtsfeier.', 'Handy Stativ Bluetooth Fernauslöser'),
    ]),
    ('Für Kinder', 'winkt', 'Für Wichteln in Kita, Schule und Familie.', [
        ('Bausteine-Set', 'Zum Bauen und Weiterbauen.', 'Bausteine Set Kinder'),
        ('Kinderbuch zu Weihnachten', 'Zum Vorlesen im Advent.', 'Kinderbuch Weihnachten'),
        ('Bastelset', 'Für Nachmittage am Basteltisch.', 'Bastelset Kinder Weihnachten'),
        ('Spiel für Kinder ab 5', 'Kurze Runden, einfache Regeln.', 'Gesellschaftsspiel Kinder ab 5'),
        ('Kuscheltier', 'Zum Liebhaben – passt zu jedem Alter.', 'Kuscheltier'),
        ('Malkoffer', 'Stifte, Kreiden und Farben in einem Koffer.', 'Malset Kinder Koffer'),
    ]),
    ('Verpacken & Zubehör', 'geschenk', 'Papier, Band und Karten gleich mitbestellen – dann ist zur Bescherung alles da.', [
        ('Geschenkpapier-Set', 'Mehrere Motive für alle Geschenke.', 'Geschenkpapier Weihnachten Set'),
        ('Geschenkband', 'Macht auch aus einfachem Papier etwas Schönes.', 'Geschenkband'),
        ('Geschenkanhänger', 'Damit klar ist, für wen es ist.', 'Geschenkanhänger Weihnachten'),
        ('Geschenktüten', 'Schnell verpackt, auch für unförmige Geschenke.', 'Geschenktüten Kraftpapier'),
        ('Adventskalender zum Befüllen', 'Hält viele Jahre.', 'Adventskalender zum Befüllen'),
        ('Weihnachtskarten', 'Für den Gruß zum Geschenk.', 'Weihnachtskarten Set'),
    ]),
]

# /lustige-wichtelgeschenke/ (Toni 18.11.: „so mehr zu Amazon klicken, desto besser“) – nur Amazon-Suchen, keine Preise/Fotos.
# Abschnitt „Ab 18“ nur hier (Seite für Erwachsene), nie auf Kinder-/Schulseiten.
LUSTIG = [
    ('Fürs Büro', 'daumen', 'Klein, schreibtischtauglich und garantiert ein Lacher bei der Bescherung im Team.', [
        ('Mini-Basketball für den Schreibtisch', 'Korb an den Monitor, Papierkugel rein – die Mittagspause ist gerettet.', 'Mini Basketball Büro Schreibtisch'),
        ('Bullshit-Buzzer', 'Ein Druck auf den Knopf sagt im Meeting mehr als tausend Worte.', 'Bullshit Buzzer'),
        ('Notizblock mit frechem Spruch', 'Für To-do-Listen, die sowieso niemand abarbeitet.', 'Notizblock lustig Spruch Büro'),
        ('Mini-Boxsack für den Schreibtisch', 'Mit Saugnapf – für Montage, Mails und Meetings.', 'Mini Boxsack Schreibtisch'),
        ('Gummihuhn mit Quietschen', 'Sinnlos, laut und genau deshalb heiß begehrt.', 'Gummihuhn Quietsch'),
        ('Anti-Stress-Würfel', 'Klicken, drehen, schieben – beschäftigt die Finger in jedem Meeting.', 'Anti Stress Würfel'),
        ('Mini-Zen-Garten', 'Sand, Rechen, Steine – Ruhe auf 15 Zentimetern.', 'Mini Zen Garten Schreibtisch'),
    ]),
    ('Kleine Lacher bis 10 €', 'jubel', 'Günstig, schnell verpackt und perfekt fürs Wichteln mit kleinem Budget.', [
        ('Furzkissen', 'Der Klassiker – funktioniert seit Jahrzehnten.', 'Furzkissen'),
        ('Glückskekse mit frechen Sprüchen', 'Zum Vorlesen in der Runde – sorgt für Gelächter.', 'Glückskekse lustige Sprüche'),
        ('Klopapier mit Sudoku', 'Damit auch die stille Minute sinnvoll genutzt wird.', 'Toilettenpapier Sudoku'),
        ('Pflaster mit lustigen Motiven', 'Heilt nicht besser, sieht aber besser aus.', 'Pflaster lustige Motive'),
        ('Socken mit Spruch', 'Unter der Sohle steht, was man wirklich denkt.', 'Socken mit Spruch lustig'),
        ('Wackeldackel', 'Nickt auf dem Armaturenbrett zu allem Ja.', 'Wackeldackel'),
        ('Klebebärte', 'Für spontane Verkleidungen auf der Weihnachtsfeier.', 'Klebebart Set'),
    ]),
    ('Großer Spaß bis 20 €', 'geschenk', 'Etwas mehr Budget, noch mehr Wirkung beim Auspacken.', [
        ('Elfenmütze mit Ohren', 'Gestreift, mit spitzen Ohren – der Hingucker auf jeder Feier.', 'Elfenmütze mit Ohren'),
        ('Socken in der Pizza-Schachtel', 'Sieht aus wie Pizza – ist aber Socken.', 'Socken Pizza Box'),
        ('Klo-Golf', 'Putten, während man ohnehin sitzt.', 'Toiletten Golf'),
        ('Klo-Nachtlicht', 'Leuchtet bunt, sobald nachts jemand kommt.', 'Toilettenlicht Bewegungsmelder'),
        ('Leuchtendes Rentier-Geweih', 'Für die Weihnachtsfeier – mit Glöckchen.', 'Rentier Haarreif leuchtend'),
        ('Kerze mit frechem Spruch', 'Duftet gut, sagt die Wahrheit.', 'Kerze mit Spruch lustig'),
        ('Süßigkeiten aus den USA', 'Snacks, die es hier im Supermarkt nicht gibt.', 'Süßigkeiten Box USA'),
    ]),
    ('Spiele zum Lachen', 'herz', 'Wird direkt nach der Bescherung ausgepackt und gespielt.', [
        ('Halt mal kurz', 'Schnelles Kartenspiel, bei dem Freundschaften kurz pausieren.', 'Halt mal kurz Kartenspiel'),
        ('Exploding Kittens', 'Katzen, Explosionen und viel Geschrei.', 'Exploding Kittens'),
        ('Wer bin ich? mit Stirnband', 'Karte an die Stirn, raten – Gelächter garantiert.', 'Wer bin ich Spiel Stirnband'),
        ('Tabu', 'Erklären, ohne die verbotenen Wörter zu sagen.', 'Tabu Spiel'),
        ('Activity', 'Zeichnen, erklären, pantomimisch darstellen.', 'Activity Spiel Piatnik'),
    ]),
    ('Ab 18: für Erwachsene', 'psst', 'Nur für Wichtelrunden unter Erwachsenen – nicht für Schule, Kita oder Familie mit Kindern.', [
        ('Trinkspiel-Roulette (ab 18)', 'Roulette mit Gläsern – Kugel entscheidet.', 'Trinkspiel Roulette'),
        ('Bier-Pong-Set (ab 18)', 'Becher, Bälle, Regeln – die Party kann kommen.', 'Bier Pong Set'),
        ('Socken „Bring mir Wein“ (ab 18)', 'Die Botschaft steht unter der Sohle.', 'Socken wenn du das lesen kannst Wein'),
        ('Partyspiel für Erwachsene (ab 18)', 'Kartenspiel mit schwarzem Humor für den Abend.', 'Partyspiel Erwachsene Karten'),
    ]),
]

# /last-minute-wichtelgeschenke/ (Toni 19.11.: „mach“) – Suchbegriffe am 19.11. bei Amazon geprüft
# (gestrichen: Spotify-Geschenkkarte gibt es nicht, „Hörbuch/eBook Geschenk“ liefert Geräte bzw. Einzeltitel).
LASTMINUTE = [
    ('Heute noch: zum Ausdrucken', 'psst', 'Kein Versand, kein Warten – heute kaufen, ausdrucken, verpacken.', [
        ('Amazon-Gutschein zum Ausdrucken', 'Betrag wählen, Motiv aussuchen, ausdrucken – fertig in fünf Minuten.', 'Amazon Gutschein zum Ausdrucken'),
    ]),
    ('Morgen da: mit Prime bestellen', 'geschenk', 'Viele Artikel kommen mit Prime schon am nächsten Tag – achtet beim Bestellen auf das Lieferdatum.', [
        ('Kuschelsocken', 'Weich, warm und passt jedem – der sichere Klassiker.', 'Kuschelsocken Damen Herren'),
        ('Thermobecher', 'Hält den Kaffee auf dem Weg ins Büro heiß.', 'Thermobecher to go'),
        ('Duftkerze im Glas', 'Zimt, Orange oder Tanne – sofort Winterstimmung.', 'Duftkerze im Glas'),
        ('Handwärmer', 'Für kalte Finger an der Bushaltestelle oder beim Spaziergang.', 'Handwärmer'),
        ('Tee-Geschenkset', 'Mehrere Sorten zum Probieren – schön verpackt.', 'Tee Geschenkset'),
        ('Kaffee-Geschenkset', 'Verschiedene Röstungen für alle, die morgens nicht ohne können.', 'Kaffee Geschenkset'),
        ('Halt mal kurz', 'Schnelles Kartenspiel – wird direkt nach der Bescherung gespielt.', 'Halt mal kurz Kartenspiel'),
        ('Rätselbuch', 'Für ruhige Abende auf dem Sofa.', 'Rätselbuch Erwachsene'),
        ('Notizbuch A5', 'Fester Einband, schönes Papier – wird immer gebraucht.', 'Notizbuch A5 Hardcover'),
        ('Kuschelige Fleecedecke', 'Für Sofa, Büro oder Auto – gemütlich geht immer.', 'Fleecedecke kuschelig'),
        ('Weihnachtstasse', 'Mit winterlichem Motiv – gleich mit Kakao befüllen.', 'Weihnachtstasse'),
        ('Kleine Powerbank', 'Rettet den Akku unterwegs – passt in jede Jackentasche.', 'Powerbank klein'),
        ('Mini-Taschenlampe', 'Hell, klein, aufladbar – für Schlüsselbund oder Handschuhfach.', 'Mini Taschenlampe LED'),
        ('Handyhalterung fürs Auto', 'Praktisch für alle, die viel unterwegs sind.', 'Handyhalterung Auto'),
    ]),
    ('Genuss & Wohlfühlen', 'herz', 'Naschen, schnuppern, entspannen – kommt bei fast allen gut an.', [
        ('Pralinen', 'Die Schachtel, über die sich jeder freut.', 'Pralinen'),
        ('Schokoladen-Probierset', 'Mehrere Sorten zum Durchprobieren.', 'Schokoladen Probierset'),
        ('Heiße Schokolade im Set', 'Kakao zum Anrühren – perfekt für kalte Abende.', 'Heißer Kakao Geschenk'),
        ('Lebkuchen-Geschenkbox', 'Weihnachtlich und hübsch verpackt.', 'Lebkuchen Geschenk'),
        ('Gewürz-Geschenkset', 'Für alle, die gern kochen.', 'Gewürze Geschenkset'),
        ('Popcorn-Set', 'Mais plus Gewürze – der Filmabend ist gerettet.', 'Popcorn Mais Gewürz Set'),
        ('Handcreme-Set', 'Gegen trockene Winterhände.', 'Handcreme Geschenkset'),
        ('Tuchmasken-Set', 'Zehn Minuten Wellness am Abend.', 'Tuchmasken Gesicht Set'),
        ('Badekugeln-Set', 'Sprudeln, duften, entspannen.', 'Badekugeln Set'),
    ]),
    ('In 10 Minuten selbst gemacht', 'jubel', 'Zutaten aus dem Schrank – sieht nach viel Mühe aus.', [
        ('Backmischung im Glas', 'Mehl, Zucker, Schokodrops schichten, Rezept dran – fertig.', 'Einmachglas mit Deckel'),
        ('Gutscheinheft', 'Einmal Kaffee holen, einmal Spieleabend – kostet nur Zeit.', 'Gutscheinkarten blanko'),
        ('Geschenkanhänger', 'Mit einem Reim drauf wird jedes Geschenk persönlich.', 'Geschenkanhänger Weihnachten'),
    ]),
]

# /wichtelgeschenke-fuer-kollegen/ (Toni 19.11.: „mach“) – Suchbegriffe 19.11. bei Amazon geprüft
# (gestrichen: Bambus-To-go-Becher = Wegwerfbecher, Party-Kartenspiel teils nicht bürotauglich, Mauspad unpassend).
KOLLEGEN = [
    ('Für den Schreibtisch', 'daumen', 'Wird jeden Tag benutzt – und erinnert an die nette Wichtelrunde.', [
        ('Tassenwärmer mit USB', 'Hält den Kaffee warm, auch wenn das Telefon wieder länger dauert.', 'Tassenwärmer USB'),
        ('Schreibtisch-Organizer', 'Stifte, Zettel, Handy – endlich alles an seinem Platz.', 'Schreibtisch Organizer'),
        ('Kabelhalter', 'Klein, günstig und gegen den Kabelsalat unterm Monitor.', 'Kabelhalter Schreibtisch'),
        ('Kleine Kunstpflanzen', 'Grün auf dem Tisch – ganz ohne Gießen.', 'Kunstpflanze klein Schreibtisch'),
        ('Fineliner-Set', 'Für Notizen, To-do-Listen und Kritzeleien im Meeting.', 'Fineliner Set'),
        ('Schreibtischuhr', 'Damit der Feierabend nicht verpasst wird.', 'Schreibtischuhr'),
        ('Kleine LED-Schreibtischlampe', 'Helles Licht für dunkle Wintermorgen.', 'Schreibtischlampe LED klein'),
        ('Notizbuch A5', 'Fester Einband, schönes Papier – wird immer gebraucht.', 'Notizbuch A5 Hardcover'),
    ]),
    ('Kaffee, Tee & Pause', 'herz', 'Für die schönste Zeit im Büroalltag: die Pause.', [
        ('Tasse mit Bürospruch', 'Sagt, was alle denken – jeden Morgen aufs Neue.', 'Tasse mit Spruch Büro'),
        ('Kaffee-Probierset', 'Verschiedene Bohnen für alle, die ohne Kaffee nicht starten.', 'Kaffee Probierset Bohnen'),
        ('Tee-Probierset', 'Mehrere Sorten für die Teetrinker im Team.', 'Tee Probierset'),
        ('Trinkflasche aus Edelstahl', 'Für mehr Wasser am Schreibtisch.', 'Trinkflasche Edelstahl'),
        ('Lunchbox aus Edelstahl', 'Für das Mittagessen von zu Hause.', 'Lunchbox Edelstahl'),
        ('Honig-Geschenkset', 'Verschiedene Sorten – passt zu Tee und Frühstück.', 'Honig Geschenkset'),
        ('Schokoladen-Probierset', 'Zum Teilen in der Kaffeeküche – oder auch nicht.', 'Schokoladen Probierset'),
    ]),
    ('Lustig fürs Team', 'jubel', 'Sorgt bei der Bescherung für Lacher – ohne jemanden bloßzustellen.', [
        ('Bullshit-Buzzer', 'Ein Druck auf den Knopf sagt im Meeting mehr als tausend Worte.', 'Bullshit Buzzer'),
        ('Meeting-Bingo', 'Synergie, Deadline, kurz mal abstimmen – wer hat zuerst eine Reihe?', 'Meeting Bingo'),
        ('Lustiger Bürokalender 2027', 'Ein Spruch pro Tag fürs neue Jahr.', 'Büro Kalender 2027 lustig'),
        ('Mini-Basketball für den Schreibtisch', 'Korb an den Papierkorb, Papierkugel rein.', 'Mini Basketball Büro Schreibtisch'),
        ('Anti-Stress-Würfel', 'Klicken, drehen, schieben – für lange Telefonate.', 'Anti Stress Würfel'),
        ('Mini-Zen-Garten', 'Sand, Rechen, Steine – Ruhe auf 15 Zentimetern.', 'Mini Zen Garten Schreibtisch'),
        ('Haftnotizen mit Sprüchen', 'Für Botschaften, die man lieber nicht laut sagt.', 'Haftnotizen lustig'),
        ('Notizblock mit frechem Spruch', 'Für To-do-Listen, die sowieso niemand abarbeitet.', 'Notizblock lustig Spruch Büro'),
    ]),
    ('Passt immer: neutral & sicher', 'geschenk', 'Wenn du die Person kaum kennst – damit liegst du nie daneben.', [
        ('Kuschelsocken', 'Weich, warm und passt jedem.', 'Kuschelsocken Damen Herren'),
        ('Handcreme-Set', 'Gegen trockene Hände von Heizungsluft.', 'Handcreme Geschenkset'),
        ('Kleine Powerbank', 'Rettet den Akku auf dem Heimweg.', 'Powerbank klein'),
        ('Duftkerze im Glas', 'Für gemütliche Abende nach Feierabend.', 'Duftkerze im Glas'),
        ('Rätselbuch', 'Für die Bahnfahrt oder das Sofa.', 'Rätselbuch Erwachsene'),
    ]),
]
