"""Geschenke-Generator fürs ganze Jahr (/geschenke-generator/, Toni 06.11.): Ideen für alle Anlässe.
Nur Amazon-Suchen, keine Preise/Fotos (PartnerNet-Regeln). Budget = „bis … €“ (grob).
Die 112 Wichtel-Ideen aus gifts.py kommen automatisch dazu (anlass weih/wicht/geb …), siehe ALLE_IDEEN unten.
Alkohol: „(ab 18)“ im Namen, nur Erwachsene, nie für Kinder/Kollegen-Büro."""
from gifts import IDEAS as WICHTEL_IDEEN

ANLAESSE = [
    ('geb', 'Geburtstag', '🎂'), ('weih', 'Weihnachten', '🎄'), ('wicht', 'Wichteln', '🎁'), ('niko', 'Nikolaus', '🥾'),
    ('val', 'Valentinstag', '❤️'), ('mutt', 'Muttertag', '💐'), ('vat', 'Vatertag', '🍺'), ('ost', 'Ostern', '🐣'),
    ('hoch', 'Hochzeit', '💍'), ('einzug', 'Einzug', '🏠'), ('danke', 'Danke', '🙏'), ('absch', 'Abschied', '👋'),
]
WER = [
    ('frau', 'Frau'), ('mann', 'Mann'), ('partner', 'Partner/in'), ('mama', 'Mama'), ('papa', 'Papa'),
    ('oma', 'Oma'), ('opa', 'Opa'), ('freund', 'Freund/in'), ('kollege', 'Kollege/in'),
    ('teen', 'Teenager'), ('kind', 'Kind'), ('paar', 'Paar'),
]
MAG = [
    ('genuss', 'Essen & Trinken'), ('gemuetlich', 'Gemütlich'), ('kreativ', 'Kreativ'), ('technik', 'Technik'),
    ('draussen', 'Draußen & Sport'), ('garten', 'Garten & Pflanzen'), ('lesen', 'Lesen'), ('spiele', 'Spiele'),
    ('lustig', 'Lustig'), ('beauty', 'Wellness & Pflege'), ('erlebnis', 'Erlebnisse'), ('reisen', 'Reisen'),
]
BUDGETS = [10, 20, 30, 50, 100]

# Kürzel für „wer“
ER = 'frau mann freund'
ALLE_ERW = 'frau mann partner mama papa oma opa freund kollege'
ELTERN = 'mama papa oma opa'
# Kürzel für Anlässe
IMMER = 'geb weih danke'
FEST = 'geb weih'

# (Name, Text, Amazon-Suche, wer, bis €, mag, anlass)
_RAW = [
    # Genuss
    ('Gewürz-Weltreise', 'Gewürze aus aller Welt zum Ausprobieren – mit Rezeptideen.', 'Gewürze Weltreise Geschenkset', ALLE_ERW + ' paar', 30, 'genuss', FEST + ' einzug'),
    ('Pasta-Set mit Soße', 'Besondere Nudeln und eine feine Soße – Abendessen ist geschenkt.', 'Pasta Geschenkset Feinkost', ALLE_ERW + ' paar', 30, 'genuss', IMMER + ' einzug'),
    ('Olivenöl in edler Flasche', 'Gutes Öl macht jeden Salat besser.', 'Olivenöl Geschenk Flasche', ALLE_ERW, 20, 'genuss', IMMER + ' einzug mutt'),
    ('Pralinen-Box', 'Feine Pralinen statt Supermarkt-Schokolade.', 'Pralinen Geschenkbox', ALLE_ERW, 20, 'genuss', IMMER + ' mutt val absch'),
    ('Schokoladen-Tasting', 'Mehrere Sorten zum Vergleichen – mit Probierkarte.', 'Schokolade Tasting Set', ALLE_ERW + ' teen', 30, 'genuss', IMMER + ' val'),
    ('Barista-Kaffee-Set', 'Bohnen, Milchschäumer oder Tassen für echte Kaffeefans.', 'Kaffee Geschenkset Barista', ALLE_ERW, 50, 'genuss', FEST + ' vat mutt'),
    ('Teekanne mit Sieb', 'Für loses Tee – schön genug für den Tisch.', 'Teekanne Glas Sieb', ALLE_ERW, 30, 'genuss gemuetlich', IMMER + ' einzug mutt'),
    ('Grill-Gewürz-Set', 'Rubs und Gewürze für Steak, Gemüse und Burger.', 'Grillgewürze Set Geschenk', 'mann papa opa partner freund', 30, 'genuss draussen', FEST + ' vat'),
    ('Grillbesteck im Koffer', 'Zange, Wender, Pinsel – alles an einem Ort.', 'Grillbesteck Koffer', 'mann papa opa partner', 50, 'genuss draussen', FEST + ' vat einzug'),
    ('Hot-Sauce-Set', 'Von mild bis richtig scharf – mit Probierkarte.', 'Hot Sauce Set Geschenk', 'mann partner freund teen', 30, 'genuss lustig', FEST),
    ('Fondue- oder Raclette-Set', 'Gemeinsam essen, lange am Tisch sitzen.', 'Raclette Fondue Set', 'paar mama papa oma opa', 100, 'genuss gemuetlich', 'weih hoch einzug'),
    ('Waffeleisen', 'Für Sonntage mit Duft nach frischen Waffeln.', 'Waffeleisen', ALLE_ERW + ' paar', 50, 'genuss', FEST + ' einzug mutt'),
    ('Popcorn-Maschine', 'Fürs Kinoabend-Gefühl zu Hause.', 'Popcornmaschine', 'paar teen kind freund', 50, 'genuss lustig', FEST + ' einzug'),
    ('Backbuch mit Backformen', 'Neue Rezepte und das passende Werkzeug.', 'Backbuch Geschenk', ALLE_ERW + ' teen', 30, 'genuss kreativ', IMMER + ' mutt'),
    ('Sushi-Set zum Selbermachen', 'Bambusmatte, Stäbchen und Anleitung.', 'Sushi Set selber machen', 'frau mann partner freund teen paar', 30, 'genuss kreativ', FEST + ' val'),
    ('Pizza-Ofen-Zubehör', 'Pizzastein, Schieber und Rezepte.', 'Pizzastein Pizzaschieber Set', 'mann papa partner freund paar', 50, 'genuss', FEST + ' vat einzug'),
    ('Craft-Beer-Probierset (ab 18)', 'Verschiedene Sorten kleiner Brauereien.', 'Craft Beer Geschenkset', 'mann papa opa partner freund', 30, 'genuss', FEST + ' vat absch'),
    ('Wein-Zubehör-Set (ab 18)', 'Korkenzieher, Ausgießer und Verschluss in einer Box.', 'Wein Zubehör Set Geschenk', 'frau mann partner mama papa freund', 30, 'genuss', FEST + ' einzug danke hoch'),
    ('Sekt-Gläser im Set', 'Zum Anstoßen auf besondere Momente.', 'Sektgläser Set', 'paar mama papa frau', 50, 'genuss', 'hoch einzug geb weih'),
    ('Frühstücks-Korb', 'Marmelade, Honig, Kaffee – für ein Wochenende ohne Eile.', 'Frühstück Geschenkkorb', ALLE_ERW + ' paar', 50, 'genuss gemuetlich', IMMER + ' mutt vat val'),
    ('Honig-Probierset', 'Verschiedene Sorten aus der Region.', 'Honig Probierset', ALLE_ERW, 20, 'genuss', IMMER + ' ost mutt'),
    # Gemütlich & Zuhause
    ('Kuschelige Strickjacke für Zuhause', 'Weich und warm für Sofa-Abende.', 'Hausjacke Strick kuschelig', 'frau mama oma partner', 50, 'gemuetlich', FEST + ' mutt'),
    ('Hausschuhe aus Filz', 'Warme Füße das ganze Jahr.', 'Filzpantoffeln', ALLE_ERW, 30, 'gemuetlich', FEST + ' mutt vat'),
    ('Gewichtsdecke', 'Fühlt sich an wie eine Umarmung – für ruhigere Nächte.', 'Gewichtsdecke', 'frau mann partner teen', 100, 'gemuetlich', FEST),
    ('Leselampe zum Klemmen', 'Für Leseratten im Bett.', 'Leselampe Klemme Buch', ALLE_ERW + ' teen kind', 20, 'gemuetlich lesen', IMMER),
    ('Aroma-Diffuser', 'Verteilt Duft im Raum – mit sanftem Licht.', 'Aroma Diffuser', 'frau mama partner freund', 30, 'gemuetlich beauty', IMMER + ' einzug mutt'),
    ('Fotobuch-Gutschein zum Selbstgestalten', 'Erinnerungen in einem Buch – gestaltet am PC.', 'Fotobuch Gutschein', ELTERN + ' partner paar', 50, 'gemuetlich kreativ', FEST + ' mutt vat hoch'),
    ('Digitaler Bilderrahmen', 'Zeigt immer neue Familienfotos – auch für Großeltern.', 'Digitaler Bilderrahmen WLAN', ELTERN, 100, 'gemuetlich technik', FEST + ' mutt vat'),
    ('Personalisierte Tasse', 'Mit Name oder Foto – für den Lieblingskaffee.', 'Tasse personalisiert Foto', ALLE_ERW + ' teen', 20, 'gemuetlich lustig', IMMER + ' mutt vat absch'),
    ('Kissen mit Foto', 'Ein Lieblingsfoto zum Kuscheln.', 'Kissen mit Foto bedrucken', ELTERN + ' partner kind', 30, 'gemuetlich', FEST + ' mutt vat val'),
    ('Kerzenständer-Set', 'Gemütliches Licht für Tisch und Fensterbank.', 'Kerzenständer Set modern', 'frau mama oma freund paar', 30, 'gemuetlich', IMMER + ' einzug hoch'),
    ('Zimmerpflanze im Übertopf', 'Grün, das bleibt – pflegeleichte Sorten.', 'Zimmerpflanze pflegeleicht Übertopf', ALLE_ERW + ' paar', 30, 'garten gemuetlich', IMMER + ' einzug mutt absch'),
    ('Puzzle mit 1000 Teilen', 'Für ruhige Abende mit Tee.', 'Puzzle 1000 Teile', ALLE_ERW + ' teen', 20, 'spiele gemuetlich', IMMER),
    # Kreativ
    ('Aquarell-Set für Einsteiger', 'Farben, Pinsel und Papier – einfach loslegen.', 'Aquarell Set Anfänger', ALLE_ERW + ' teen', 30, 'kreativ', IMMER + ' mutt'),
    ('Handlettering-Set', 'Stifte und Übungsheft für schöne Schrift.', 'Handlettering Set Anfänger', 'frau teen freund mama', 20, 'kreativ', IMMER),
    ('Töpfern ohne Ofen', 'Lufttrocknender Ton für Schalen und Figuren.', 'lufttrocknender Ton Set', 'frau mama teen kind freund', 20, 'kreativ', IMMER + ' ost'),
    ('Makramee-Set', 'Blumenampel oder Wandbehang knüpfen.', 'Makramee Set Anfänger', 'frau mama oma freund teen', 20, 'kreativ', IMMER + ' mutt'),
    ('Sofortbildkamera', 'Fotos sofort in der Hand – für Partys und Ausflüge.', 'Sofortbildkamera', 'teen frau freund partner', 100, 'kreativ technik', FEST + ' val'),
    ('Fotopapier für die Sofortbildkamera', 'Nachschub für viele schöne Momente.', 'Sofortbildfilm', 'teen frau freund partner', 20, 'kreativ', FEST),
    ('Stick-Set mit Motiv', 'Ruhige Handarbeit mit schönem Ergebnis.', 'Stickset Anfänger Motiv', 'frau mama oma teen', 20, 'kreativ gemuetlich', IMMER + ' mutt'),
    ('Kerzen gießen', 'Wachs, Dochte und Formen für eigene Kerzen.', 'Kerzen gießen Set', 'frau teen kind freund', 30, 'kreativ', IMMER),
    ('Holz-Bausatz', 'Kleines Modell oder Vogelhaus zum Selbstbauen.', 'Holzbausatz Erwachsene', 'mann papa opa teen kind', 30, 'kreativ', IMMER + ' vat'),
    # Technik
    ('Bluetooth-Lautsprecher', 'Musik überall – fürs Bad, den Garten oder unterwegs.', 'Bluetooth Lautsprecher klein', ALLE_ERW + ' teen', 50, 'technik', FEST + ' absch'),
    ('Kabellose Kopfhörer', 'Ohne Kabelsalat Musik hören.', 'Bluetooth Kopfhörer', 'frau mann partner teen freund', 50, 'technik', FEST),
    ('Powerbank', 'Klein genug für die Jackentasche.', 'Powerbank klein', ALLE_ERW + ' teen', 30, 'technik', IMMER + ' absch'),
    ('Bluetooth-Tracker', 'Nie wieder Schlüssel suchen.', 'Bluetooth Tracker Schlüssel', ALLE_ERW, 30, 'technik', IMMER + ' vat mutt'),
    ('Kabelloses Ladegerät', 'Handy ablegen, fertig.', 'kabelloses Ladegerät', ALLE_ERW + ' teen', 30, 'technik', IMMER + ' absch'),
    ('Smarte Glühbirne', 'Licht per Handy in jeder Farbe.', 'smarte Glühbirne', 'mann frau teen partner', 20, 'technik', IMMER + ' einzug'),
    ('E-Book-Reader', 'Hunderte Bücher in einer Hand.', 'E-Book Reader', ALLE_ERW, 100, 'technik lesen', FEST + ' mutt vat absch'),
    ('Handy-Stativ mit Fernbedienung', 'Für Fotos, Videos und Videoanrufe.', 'Handy Stativ Bluetooth', 'teen frau mann freund', 20, 'technik', IMMER),
    ('Mini-Drohne', 'Erste Flugversuche im Wohnzimmer.', 'Mini Drohne Kinder', 'kind teen mann', 50, 'technik spiele', FEST),
    ('Retro-Spielkonsole', 'Klassiker von früher in einem Gerät.', 'Retro Spielkonsole', 'mann papa teen partner', 50, 'technik spiele', FEST + ' vat'),
    # Draußen & Sport
    ('Picknickdecke wasserdicht', 'Für Park, Strand und Festival.', 'Picknickdecke wasserdicht', ALLE_ERW + ' paar', 30, 'draussen', 'geb ost mutt vat einzug hoch'),
    ('Picknickrucksack', 'Geschirr, Besteck und Kühlfach in einem.', 'Picknickrucksack 2 Personen', 'paar partner mama papa', 50, 'draussen genuss', 'geb hoch val mutt vat'),
    ('Trinkflasche aus Edelstahl', 'Hält kalt und warm, ohne Plastik.', 'Trinkflasche Edelstahl', ALLE_ERW + ' teen kind', 30, 'draussen', IMMER + ' absch'),
    ('Wander-Rucksack', 'Leicht und bequem für Tagestouren.', 'Wanderrucksack Tagesrucksack', ALLE_ERW + ' teen', 50, 'draussen reisen', FEST + ' vat'),
    ('Stirnlampe', 'Für Abendrunden, Camping und den Keller.', 'Stirnlampe LED', 'mann papa opa teen kind', 20, 'draussen technik', IMMER + ' vat'),
    ('Yoga-Matte', 'Rutschfest – für Sport zu Hause.', 'Yogamatte rutschfest', 'frau mann teen partner freund', 30, 'draussen beauty', FEST + ' mutt'),
    ('Fitnessbänder-Set', 'Training überall, ganz ohne Studio.', 'Fitnessbänder Set', 'frau mann teen partner', 20, 'draussen', IMMER),
    ('Federball- oder Frisbee-Set', 'Spaß für Park und Garten.', 'Federball Set Garten', 'kind teen paar freund papa', 20, 'draussen spiele', 'geb ost'),
    ('Hängematte', 'Zum Abhängen im Garten oder auf dem Balkon.', 'Hängematte Garten', 'mann frau paar partner papa', 50, 'draussen gemuetlich', 'geb vat einzug'),
    ('Fernglas', 'Für Vögel, Wanderungen und Ausblicke.', 'Fernglas kompakt', 'opa papa mann kind', 50, 'draussen', FEST + ' vat'),
    # Garten
    ('Kräutergarten-Set', 'Basilikum, Petersilie und Co. für die Fensterbank.', 'Kräutergarten Set Fensterbank', ALLE_ERW + ' paar', 20, 'garten genuss', IMMER + ' ost mutt einzug'),
    ('Gartenwerkzeug-Set', 'Schaufel, Harke und Handschuhe in einer Tasche.', 'Gartenwerkzeug Set Geschenk', 'mama papa oma opa', 30, 'garten', FEST + ' mutt vat'),
    ('Insektenhotel', 'Ein Zuhause für Wildbienen im Garten.', 'Insektenhotel', ELTERN + ' kind', 30, 'garten draussen', 'geb ost mutt vat'),
    ('Vogelfutterhaus', 'Vögel aus nächster Nähe beobachten.', 'Vogelfutterhaus', ELTERN + ' kind', 30, 'garten draussen', FEST),
    ('Blumensamen-Box', 'Bunte Blumen für Balkon und Garten.', 'Blumensamen Set Geschenk', 'frau mama oma freund kind', 20, 'garten', 'geb ost mutt danke'),
    ('Mini-Gewächshaus', 'Für die eigene Anzucht auf der Fensterbank.', 'Mini Gewächshaus Fensterbank', ELTERN + ' frau mann', 30, 'garten', 'geb ost mutt vat'),
    ('Gartenhandschuhe mit Krallen', 'Graben ohne Schaufel – lustig und praktisch.', 'Gartenhandschuhe Krallen', ELTERN, 20, 'garten lustig', 'geb mutt vat'),
    # Lesen
    ('Buch-Bestseller', 'Ein aktueller Roman, über den alle reden.', 'Bestseller Roman', ALLE_ERW + ' teen', 30, 'lesen', IMMER + ' mutt vat absch'),
    ('Krimi-Rätselbuch', 'Fälle zum Selbstlösen.', 'Krimi Rätselbuch', ALLE_ERW + ' teen', 20, 'lesen spiele', IMMER),
    ('Buchstütze mit Motiv', 'Hält die Lieblingsbücher in Form.', 'Buchstützen Motiv', 'frau mann freund teen', 30, 'lesen gemuetlich', FEST + ' einzug'),
    ('Erinnerungsbuch „Erzähl mal“', 'Großeltern und Eltern schreiben ihre Geschichte auf.', 'Erzähl mal Buch Oma Opa', ELTERN, 20, 'lesen', FEST + ' mutt vat'),
    ('Kochbuch für Paare', 'Gemeinsam kochen, neue Rezepte entdecken.', 'Kochbuch für zwei', 'paar partner', 30, 'lesen genuss', 'hoch val einzug weih'),
    ('Hörbuch-Abo-Gutschein', 'Geschichten für Fahrt, Spaziergang und Sofa.', 'Hörbuch Gutschein', ALLE_ERW + ' teen', 30, 'lesen technik', IMMER + ' absch'),
    # Spiele
    ('Gesellschaftsspiel des Jahres', 'Ausgezeichnete Spiele für gemütliche Abende.', 'Spiel des Jahres', ALLE_ERW + ' teen paar', 50, 'spiele', FEST + ' einzug'),
    ('Escape-Spiel für zu Hause', 'Rätsel lösen wie im Escape Room.', 'Escape Room Spiel', 'frau mann partner freund teen paar', 20, 'spiele', IMMER),
    ('Quiz-Spiel', 'Wissen und Lachen in einer Runde.', 'Quizspiel Erwachsene', ALLE_ERW + ' teen', 30, 'spiele lustig', IMMER),
    ('Kartenspiel für zwei', 'Schnelle Runden für Paare.', 'Kartenspiel für 2 Personen', 'paar partner', 20, 'spiele', 'val hoch geb'),
    ('Spiel für die ganze Familie', 'Für Kinder ab 6 und Erwachsene zusammen.', 'Familienspiel ab 6', ELTERN + ' kind', 30, 'spiele', FEST + ' ost'),
    ('LEGO-Set für Erwachsene', 'Zum Bauen und Ausstellen.', 'LEGO Set Erwachsene', 'mann frau partner teen', 100, 'spiele kreativ', FEST),
    # Lustig
    ('Socken mit lustigem Spruch', 'Für Füße mit Humor.', 'Socken lustig Spruch', ALLE_ERW + ' teen', 20, 'lustig', IMMER + ' vat absch'),
    ('„Überlebenspaket“', 'Kleine Helfer mit Augenzwinkern – für Büro, Rente oder Umzug.', 'Überlebenspaket Geschenk', ALLE_ERW, 20, 'lustig', 'geb absch einzug'),
    ('Kuscheltier mit Herz', 'Klein, weich und ehrlich gemeint.', 'Kuscheltier Herz', 'partner kind teen', 20, 'lustig gemuetlich', 'val geb ost'),
    ('Fußmatte mit Spruch', 'Begrüßt jeden Gast mit einem Lächeln.', 'Fußmatte lustig', 'paar freund', 30, 'lustig', 'einzug hoch geb'),
    ('„Rubbel-Bucketlist“-Poster', '100 Dinge zum Erleben – freirubbeln, wenn erledigt.', 'Rubbel Poster Bucket List', 'partner paar freund teen', 30, 'lustig erlebnis', 'geb val hoch'),
    # Wellness & Pflege
    ('Wellness-Box', 'Badesalz, Peeling und Kerze für einen Abend Auszeit.', 'Wellness Box Geschenk Frauen', 'frau mama oma partner freund', 30, 'beauty gemuetlich', IMMER + ' mutt val'),
    ('Massagegerät für den Nacken', 'Entspannung nach langen Tagen.', 'Nackenmassagegerät', ALLE_ERW, 50, 'beauty', FEST + ' mutt vat'),
    ('Bart-Pflegeset', 'Öl, Bürste und Kamm für den gepflegten Bart.', 'Bartpflege Set', 'mann papa partner', 30, 'beauty', FEST + ' vat'),
    ('Seiden-Kopfkissenbezug', 'Gut für Haut und Haare.', 'Seidenkissenbezug', 'frau mama partner', 30, 'beauty gemuetlich', FEST + ' mutt val'),
    ('Naturkosmetik-Set', 'Pflege ohne unnötige Zusätze.', 'Naturkosmetik Geschenkset', 'frau mama oma partner', 30, 'beauty', IMMER + ' mutt'),
    ('Fußbad mit Massage', 'Warmes Sprudeln nach dem Tag.', 'Fußbad Massage', ELTERN + ' frau', 50, 'beauty gemuetlich', FEST + ' mutt'),
    # Erlebnisse
    ('Gutschein für einen Kochkurs', 'Gemeinsam etwas Neues lernen und genießen.', 'Kochkurs Gutschein', 'partner paar freund mama papa', 100, 'erlebnis genuss', 'geb weih val hoch'),
    ('Kino-Gutschein', 'Ein Abend mit Popcorn auf der großen Leinwand.', 'Kinogutschein', ALLE_ERW + ' teen paar', 30, 'erlebnis', IMMER + ' val absch'),
    ('Tickets für Konzert oder Theater', 'Ein Abend, über den man noch lange spricht.', 'Eventim Gutschein', ALLE_ERW + ' paar teen', 100, 'erlebnis', FEST + ' hoch val'),
    ('Erlebnis-Gutschein', 'Klettern, Kochen, Fahren – man sucht es sich selbst aus.', 'Erlebnisgutschein', ALLE_ERW + ' paar teen', 100, 'erlebnis', FEST + ' hoch absch'),
    ('Wellness-Tag-Gutschein', 'Sauna, Massage, Ruhe – ein Tag nur für sich.', 'Wellness Gutschein', 'frau mama oma partner', 100, 'erlebnis beauty', FEST + ' mutt val'),
    ('Planetarium- oder Zoo-Tickets', 'Ein Ausflug für die ganze Familie.', 'Zoo Gutschein', 'kind paar mama papa oma opa', 50, 'erlebnis', 'geb weih ost'),
    # Reisen
    ('Reise-Organizer-Set', 'Packwürfel für ordentliche Koffer.', 'Packwürfel Set', ALLE_ERW + ' teen', 30, 'reisen', IMMER + ' absch'),
    ('Rubbel-Weltkarte', 'Bereiste Länder freirubbeln.', 'Rubbel Weltkarte', 'frau mann partner paar teen', 30, 'reisen lustig', FEST + ' hoch'),
    ('Reise-Nackenkissen', 'Bequem schlafen in Zug und Flugzeug.', 'Nackenkissen Reise', ALLE_ERW, 30, 'reisen gemuetlich', IMMER + ' absch'),
    ('Reiseführer zum Traumziel', 'Vorfreude zum Blättern.', 'Reiseführer', ALLE_ERW + ' paar', 30, 'reisen lesen', FEST + ' hoch absch'),
    ('Kulturbeutel zum Aufhängen', 'Alles im Blick im Hotelbad.', 'Kulturbeutel zum Aufhängen', ALLE_ERW + ' teen', 30, 'reisen', IMMER),
    # Hochzeit & Paar
    ('Fotoalbum zum Einkleben', 'Für die schönsten Bilder des großen Tages.', 'Fotoalbum Hochzeit', 'paar', 30, 'kreativ gemuetlich', 'hoch val'),
    ('Ehe-Erinnerungsbuch', 'Ein Buch, das die Jahre füllt.', 'Erinnerungsbuch Paar', 'paar partner', 30, 'lesen gemuetlich', 'hoch val weih'),
    ('Geschirrtücher-Set mit Spruch', 'Für die erste gemeinsame Küche.', 'Geschirrtücher lustig', 'paar', 20, 'lustig', 'hoch einzug'),
    ('Brot und Salz im Geschenkset', 'Der klassische Einzugsgruß – Glück für das neue Zuhause.', 'Brot und Salz Einzug Geschenk', 'paar freund mama papa', 20, 'genuss', 'einzug'),
    ('Werkzeug-Grundausstattung', 'Hammer, Schrauber, Maßband – fürs erste eigene Zuhause.', 'Werkzeugkoffer Grundausstattung', 'teen paar freund', 50, 'technik', 'einzug geb'),
    # Muttertag / Vatertag / Danke / Abschied
    ('Blumen-Abo-Gutschein', 'Jeden Monat frische Blumen.', 'Blumen Gutschein', 'mama oma frau partner', 50, 'garten', 'mutt geb danke val'),
    ('„Danke“-Pralinen', 'Ein kleines, ehrliches Dankeschön.', 'Pralinen Danke', ALLE_ERW, 10, 'genuss', 'danke absch'),
    ('Lehrer-Dankeschön-Set', 'Tasse, Notizbuch oder Stift für Lehrer und Erzieher.', 'Geschenk Lehrerin Danke', 'frau mann kollege', 20, 'lustig', 'danke absch'),
    ('Notizbuch aus Leder', 'Für Ideen, Pläne und Gedanken.', 'Notizbuch Leder', ALLE_ERW + ' teen', 30, 'kreativ', IMMER + ' absch vat'),
    ('Edler Kugelschreiber', 'Ein Stift, den man gern benutzt.', 'Kugelschreiber edel Geschenk', 'mann frau kollege papa opa', 30, 'technik', 'geb absch danke vat'),
    ('Ruhestand-Kalender', 'Ideen für jeden Tag der freien Zeit.', 'Geschenk Ruhestand Kalender', 'kollege mama papa oma opa', 20, 'lustig', 'absch'),
    ('Papa-Werkzeug-Gadget', 'Multitool für die Hosentasche.', 'Multitool', 'papa opa mann partner', 50, 'technik draussen', 'vat geb weih'),
    ('Mama-Schmuck mit Gravur', 'Kette oder Armband mit Namen der Kinder.', 'Kette Gravur Mama', 'mama oma', 50, 'beauty', 'mutt geb weih'),
    # Ostern & Kinder
    ('Oster-Bastelset', 'Eier bemalen, Hasen basteln, Nester schmücken.', 'Ostern Bastelset Kinder', 'kind', 20, 'kreativ', 'ost'),
    ('Schoko-Hase extra groß', 'Ein Klassiker, der immer passt.', 'Schokohase groß', 'kind teen mama papa oma opa', 20, 'genuss', 'ost'),
    ('Sandspielzeug-Set', 'Für Sandkasten und Strand.', 'Sandspielzeug Set', 'kind', 20, 'draussen spiele', 'ost geb'),
    ('Kinder-Fahrradhelm', 'Sicher unterwegs – in bunten Farben.', 'Fahrradhelm Kinder', 'kind', 50, 'draussen', 'geb ost'),
    ('Experimentierkasten', 'Kleine Forscher entdecken Physik und Chemie.', 'Experimentierkasten Kinder', 'kind teen', 30, 'technik kreativ', FEST + ' ost'),
    ('Kinder-Kamera', 'Eigene Fotos und Videos machen.', 'Kinder Kamera', 'kind', 50, 'technik kreativ', FEST),
    ('Tonie-Figur oder Hörspiel', 'Geschichten zum Hören und Einschlafen.', 'Tonie Figur', 'kind', 20, 'lesen gemuetlich', FEST + ' ost niko'),
    ('Kinderbuch-Klassiker', 'Bücher, die man nie vergisst.', 'Kinderbuch Klassiker', 'kind', 20, 'lesen', FEST + ' ost niko'),
    ('Teenager-Gutschein für Streaming oder Spiele', 'Für die Lieblings-App oder Konsole.', 'Gutschein Teenager', 'teen', 30, 'technik spiele', 'geb weih ost'),
    ('LED-Streifen fürs Zimmer', 'Licht in allen Farben – per App steuerbar.', 'LED Streifen App', 'teen', 30, 'technik', 'geb weih'),
]

# Wichtel-Ideen aus gifts.py übernehmen: Alter → wer, Kategorie → mag, Anlass Weihnachten/Wichteln (+ Nikolaus bis 10 €, + Geburtstag)
_AGE2WER = {'k1': ['kind'], 'k2': ['kind'], 'teen': ['teen'], 'adult': ['frau', 'mann', 'freund', 'partner']}
_CAT2MAG = {'naschen': 'genuss', 'gemuetlich': 'gemuetlich', 'spiele': 'spiele', 'kreativ': 'kreativ', 'technik': 'technik', 'lustig': 'lustig'}


def _wichtel(i):
    wer = sorted({w for a in i['ages'] for w in _AGE2WER[a]} | ({'kollege'} if i['office'] else set())
                 | ({'oma', 'opa', 'mama', 'papa'} if 'adult' in i['ages'] and 'naschen' in i['cats'] and '(ab 18)' not in i['name'] else set()))
    anl = ['weih', 'wicht'] + (['niko'] if i['budget'] <= 10 and '(ab 18)' not in i['name'] else []) + (['geb'] if i['budget'] >= 10 else [])
    return dict(n=i['name'], t=i['text'], q=i['query'], w=wer, b=i['budget'], m=sorted({_CAT2MAG[c] for c in i['cats']}), a=anl)


def _neu(r):
    n, t, q, w, b, m, a = r
    return dict(n=n, t=t, q=q, w=sorted(set(w.split())), b=b, m=m.split(), a=sorted(set(a.split())))


_namen = set()
ALLE_IDEEN = []
for idee in [_neu(r) for r in _RAW] + [_wichtel(i) for i in WICHTEL_IDEEN]:
    if idee['n'] in _namen:
        continue
    _namen.add(idee['n'])
    if '(ab 18)' in idee['n']:  # Alkohol nie für Kinder/Teens/Kollegen
        idee['w'] = [x for x in idee['w'] if x not in ('kind', 'teen', 'kollege')]
    ALLE_IDEEN.append(idee)
