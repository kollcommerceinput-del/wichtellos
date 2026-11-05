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
