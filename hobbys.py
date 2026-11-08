"""Hobby-Liste + Bausteine für den Geschenke-Generator (Toni 08.11.: „mehr Ideen, auch über Wichteln hinaus“).
Jedes Hobby × passende Bausteine = eigene Idee (Amazon-Suche „<Hobby> <Baustein>“). Die Ideen entstehen erst im Browser
(generator.js), hier stehen nur Hobbys und Bausteine – so bleibt die Seite klein. Eingetippte Hobbys, die nicht in der
Liste stehen, bekommen dieselben Bausteine (Typ „a“).

Format je Eintrag: „Name“ oder „Name/Wortteil“ (Wortteil für Zusammensetzungen: Angeln/Angel → „Angel-Tasse“),
danach optional „|k“ = passt auch für Kinder, „|18“ = nur Erwachsene (Alkohol). Typ je Gruppe:
a = Aktivität, s = Spiel (ohne „Ausrüstung“), f = Fan von (Serie, Verein …), t = Tier, g = Genuss, l = Lesen,
r = Reisen, e = Erlebnis (Gutscheine), p = Produktwelt (Mode, Pflege, Büro, Lustiges).
"""

# 24 Interessen (Schlüssel, Name) – die ersten 12 gab es schon (geschenke.py nutzt dieselben Schlüssel)
INTERESSEN = [
    ('genuss', 'Essen & Trinken'), ('gemuetlich', 'Gemütlich'), ('kreativ', 'Kreativ & Basteln'), ('technik', 'Technik & Gadgets'),
    ('draussen', 'Draußen & Outdoor'), ('garten', 'Garten & Pflanzen'), ('lesen', 'Lesen'), ('spiele', 'Spiele & Rätsel'),
    ('lustig', 'Lustig'), ('beauty', 'Wellness & Pflege'), ('erlebnis', 'Erlebnisse'), ('reisen', 'Reisen'),
    ('gaming', 'Gaming'), ('kaffee', 'Kaffee & Tee'), ('kochen', 'Kochen & Backen'), ('musik', 'Musik'),
    ('fitness', 'Sport & Fitness'), ('fan', 'Fußball & Fans'), ('tiere', 'Tiere'), ('heimwerken', 'Heimwerken'),
    ('foto', 'Fotografie & Film'), ('mode', 'Mode & Schmuck'), ('fahrzeug', 'Auto, Motorrad & Fahrrad'), ('buero', 'Büro & Schreibtisch'),
]

# (Interesse, Typ, Einträge)
_GRUPPEN = [
    ('draussen', 'a', 'Angeln/Angel; Camping|k; Wandern/Wander|k; Klettern/Kletter|k; Bouldern/Boulder; Geocaching|k; Bushcraft; '
                      'Kajak|k; Kanu|k; Segeln/Segel; Surfen/Surf; Stand-up-Paddling/SUP; Skifahren/Ski|k; Snowboarden/Snowboard|k; '
                      'Langlauf; Vogelbeobachtung/Vogel|k; Sternegucken/Sternen|k; Jagd; Picknick|k; Trekking; Survival; Schlittschuhlaufen/Schlittschuh|k'),
    ('fitness', 'a', 'Laufen/Lauf; Joggen/Jogging; Yoga|k; Pilates; Fitnessstudio/Fitness; Krafttraining/Kraftsport; CrossFit; Boxen/Box|k; '
                     'Kampfsport|k; Karate|k; Judo|k; Schwimmen/Schwimm|k; Tennis|k; Tischtennis|k; Badminton|k; Golf|k; Tanzen/Tanz|k; '
                     'Ballett|k; Reiten/Reit|k; Volleyball|k; Basketball|k; Handball|k; Eishockey|k; Darts; Bowling; Triathlon; '
                     'Marathon; Skateboarden/Skateboard|k; Inlineskaten/Inliner|k; Trampolin|k; Turnen/Turn|k; Leichtathletik|k'),
    ('fahrzeug', 'a', 'Radfahren/Fahrrad|k; Mountainbike|k; Rennrad; E-Bike; Motorrad; Autos/Auto; Oldtimer; Camper/Camping-Bus; Wohnmobil; '
                      'Traktoren/Traktor|k; Eisenbahn|k; Modelleisenbahn|k; Ferngesteuerte Autos/RC-Auto|k; Flugzeuge/Flugzeug|k; BMX|k; Roller|k'),
    ('garten', 'a', 'Gärtnern/Garten; Pflanzen/Pflanzen|k; Kakteen/Kakteen|k; Bonsai; Kräuter/Kräuter|k; Gemüsebeet/Gemüse|k; Zimmerpflanzen; '
                    'Rosen; Balkon; Imkern/Imker; Hühner|k; Teich; Vogelhaus|k; Insektenhotel|k; Urban Gardening'),
    ('kreativ', 'a', 'Malen/Mal|k; Zeichnen/Zeichen|k; Aquarell|k; Handlettering|k; Kalligrafie; Stricken/Strick; Häkeln/Häkel|k; Nähen/Näh|k; '
                     'Sticken/Stick; Töpfern/Töpfer|k; Basteln/Bastel|k; Scrapbooking; Origami|k; Makramee; Kerzen gießen/Kerzen|k; '
                     'Seife machen/Seifen; Schmuck basteln/Schmuck-Bastel|k; Holzarbeiten/Holz; Schnitzen/Schnitz|k; Diamond Painting|k; '
                     'Malen nach Zahlen|k; Bullet Journal; Epoxidharz/Resin; Linoldruck; Filzen/Filz|k; Perlen/Perlen|k; Lego|k; Modellbau|k'),
    ('technik', 'a', 'Programmieren/Programmier; Smart Home; Raspberry Pi; Elektronik|k; 3D-Druck/3D-Drucker; Drohnen/Drohnen|k; Roboter|k; '
                     'Computer/PC; Apple; Handy/Smartphone|k; Funk; Astronomie|k; Physik|k; Chemie|k; Mikroskop|k; Werkzeug-Gadgets/Gadget'),
    ('gaming', 's', 'Gaming|k; PlayStation|k; Xbox|k; Nintendo Switch/Nintendo|k; PC-Gaming/Gaming-PC; Retro-Games/Retro-Gaming|k; '
                    'E-Sport; Rollenspiele/Rollenspiel; VR'),
    ('gaming', 'f', 'Minecraft|k; Fortnite|k; Pokémon|k; Zelda|k; Animal Crossing|k; Call of Duty; FIFA/EA FC|k'),
    ('spiele', 's', 'Brettspiele/Brettspiel|k; Kartenspiele/Kartenspiel|k; Puzzle/Puzzle|k; Rätsel/Rätsel|k; Escape Room/Escape-Room|k; Schach|k; '
                    'Sudoku|k; Kreuzworträtsel/Kreuzworträtsel; Zauberei/Zauber|k; Jonglieren/Jonglier|k; Poker; Skat; Doppelkopf; '
                    'Dungeons & Dragons/D&D; Tabletop; Rubik’s Cube/Zauberwürfel|k; Kniffel|k; Uno|k'),
    ('lesen', 'l', 'Krimis/Krimi; Fantasy|k; Science-Fiction; Thriller; Liebesromane/Liebesroman; Comics/Comic|k; Manga|k; Geschichte/Geschichts; '
                   'Philosophie; Psychologie; Hörbücher/Hörbuch|k; Poesie/Gedicht; Biografien/Biografie; Kinderbücher/Kinderbuch|k; E-Books/E-Reader'),
    ('musik', 'a', 'Gitarre|k; E-Gitarre; Bass; Klavier|k; Keyboard|k; Schlagzeug|k; Ukulele|k; Geige|k; Flöte|k; Saxofon; Trompete|k; '
                   'Singen/Gesangs|k; Chor; DJ; Vinyl/Schallplatten; Konzerte/Konzert; Musicals/Musical|k; Klassik; Rock; Heavy Metal/Metal; '
                   'Hip-Hop|k; Schlager; Jazz; Karaoke|k; Musikproduktion/Studio'),
    ('foto', 'a', 'Fotografie/Foto|k; Sofortbildkamera/Sofortbild|k; Analoge Fotografie/Analog-Kamera; Filme machen/Video|k; Kino/Kino|k; '
                  'Serien/Serien; Filmklassiker/Film; YouTube/YouTuber|k; Podcasts/Podcast; Vlogging/Vlog'),
    ('kochen', 'a', 'Kochen/Koch|k; Backen/Back|k; Grillen/Grill; Smoken/Smoker; Brotbacken/Brotback; Pizza|k; Sushi|k; Pasta; '
                    'Asiatisch kochen/Wok; Vegan kochen/Vegan; Kuchen/Kuchen|k; Torten/Torten|k; Plätzchen/Plätzchen|k; Fermentieren/Fermentier; '
                    'Einkochen/Einmach; Dutch Oven; Thermomix; Airfryer/Heißluftfritteusen; Eis machen/Eis|k; Cocktails/Cocktail|18'),
    ('kaffee', 'g', 'Kaffee; Espresso; Barista; Tee; Matcha; Kakao/Kakao|k; Chai'),
    ('genuss', 'g', 'Schokolade/Schoko|k; Gewürze/Gewürz; Hot Sauce/Chili; Käse; Feinkost; Süßigkeiten/Süßigkeiten|k; Lakritz|k; Popcorn|k; '
                    'Wein|18; Whisky|18; Gin|18; Rum|18; Craft Beer/Bier|18; Sekt|18; Likör|18'),
    ('tiere', 't', 'Katzen/Katzen|k; Hunde/Hunde|k; Pferde/Pferde|k; Kaninchen/Kaninchen|k; Meerschweinchen/Meerschweinchen|k; Hamster|k; '
                   'Vögel/Vogel|k; Aquarium/Aquarium|k; Schildkröten/Schildkröten|k; Dinosaurier/Dino|k; Einhörner/Einhorn|k; '
                   'Faultiere/Faultier|k; Pinguine/Pinguin|k; Füchse/Fuchs|k; Eulen/Eulen|k; Alpakas/Alpaka|k; Elefanten/Elefanten|k; '
                   'Pandas/Panda|k; Kühe/Kuh|k; Schafe/Schaf|k; Igel|k; Frösche/Frosch|k; Wale/Wal|k; Haie/Hai|k; Bienen/Bienen|k'),
    ('fan', 'f', 'Fußball|k; FC Bayern|k; Borussia Dortmund/BVB|k; Schalke|k; Werder Bremen|k; Hamburger SV/HSV|k; 1. FC Köln/FC Köln|k; '
                 'Eintracht Frankfurt|k; VfB Stuttgart|k; Union Berlin|k; Hertha BSC/Hertha|k; Formel 1|k; Nationalmannschaft/DFB|k; '
                 'Star Wars|k; Harry Potter|k; Marvel|k; Disney|k; Herr der Ringe|k; Game of Thrones; Stranger Things; Friends; '
                 'Die Simpsons/Simpsons|k; Paw Patrol|k; Peppa Wutz|k; Frozen/Die Eiskönigin|k; Spider-Man|k; Batman|k; '
                 'Super Mario|k; Sonic|k; Barbie|k; Hello Kitty|k; Stitch|k; Bluey|k; Feuerwehr|k; Polizei|k; Weltraum|k; Piraten|k; Ritter|k; '
                 'Prinzessinnen/Prinzessin|k; Feen/Feen|k; Meerjungfrauen/Meerjungfrau|k; Bagger|k; Taylor Swift; K-Pop|k; Anime|k; '
                 'Naruto|k; One Piece|k; Mandalorian|k; Lilo & Stitch|k; Minions|k; Feuerwehrmann Sam|k; Die Maus|k; Sendung mit der Maus/Maus|k'),
    ('heimwerken', 'a', 'Heimwerken/Heimwerker; Werkstatt; Holzwerkstatt/Holzwerkzeug; Schweißen/Schweiß; Elektrik; Renovieren/Renovier; '
                        'Fliesen; Fahrrad reparieren/Fahrradwerkzeug; Autoschrauben/Kfz-Werkzeug; Messer schärfen/Schleifstein; Upcycling'),
    ('mode', 'p', 'Mode; Sneaker; Uhren/Uhren; Schmuck; Taschen/Taschen; Sonnenbrillen/Sonnenbrillen; Hüte/Hut; Krawatten/Krawatten; '
                  'Vintage; Streetwear; Nägel/Nagellack; Haare/Haar|k; Make-up; Parfum'),
    ('beauty', 'p', 'Wellness; Sauna; Massage; Meditation|k; Achtsamkeit|k; Hautpflege; Badezusätze/Bade|k; Aromatherapie/Duftöl; '
                    'Bartpflege/Bart; Rasur/Rasier; Spa; Schlaf/Schlaf'),
    ('reisen', 'r', 'Reisen/Reise|k; Backpacking/Backpacker; Städtereisen/Städtereise; Roadtrip; Kreuzfahrt; Strandurlaub/Strand|k; '
                    'Bergurlaub/Berg|k; Skandinavien; Italien; Japan; USA; Fernreisen/Fernreise; Weltkarte/Weltkarten|k; Länder sammeln/Rubbel-Weltkarte'),
    ('erlebnis', 'e', 'Freizeitparks/Freizeitpark|k; Konzertbesuche/Konzert; Theater|k; Oper; Museum|k; Zoo|k; Kletterpark|k; Escape Rooms/Escape|k; '
                      'Fallschirmspringen/Fallschirm; Rennstrecke/Rennwagen; Ballonfahrt/Ballon; Kochkurs; Weinprobe/Weinprobe|18; '
                      'Wellness-Wochenende/Wellness'),
    ('gemuetlich', 'p', 'Kuscheln/Kuschel|k; Kerzen/Kerzen|k; Lesen auf dem Sofa/Lese; Hygge; Filmabend/Filmabend|k; Teezeit/Tee; '
                        'Kamin; Puzzle-Abende/Puzzle|k; Wohnen/Deko; Interior/Wohnaccessoires; Weihnachtsdeko/Weihnachts|k'),
    ('buero', 'p', 'Büro/Büro; Homeoffice/Homeoffice; Schreibtisch/Schreibtisch; Notizbücher/Notizbuch|k; Füller/Füller|k; '
                   'Planer/Planer; Organisation/Organizer; Kaffeepause/Büro-Kaffee'),
    ('lustig', 'p', 'Witze/Witz|k; Scherzartikel/Scherz|k; Sarkasmus/Sarkasmus; Memes/Meme; Wortspiele/Wortspiel; Nerds/Nerd; '
                    'Montag-Hasser/Montag; Kaffee-Junkies/Kaffee-Junkie'),
]

# Bausteine je Typ: (Name, Text, Amazon-Suche, bis €, auch für Kinder)
# {L} = Hobby wie in der Liste, {K} = Wortteil für Zusammensetzungen
BAUSTEINE = {
    'a': [
        ('Buch über {L}', 'Tipps, Ideen und Inspiration rund um {L} – für Einsteiger und alte Hasen.', '{L} Buch', 20, 1),
        ('{K}-Zubehör', 'Praktisches Zubehör, das man beim {L} immer wieder braucht.', '{L} Zubehör', 30, 1),
        ('{K}-Set für Einsteiger', 'Alles für den Anfang – ideal, wenn jemand gerade erst loslegt.', '{L} Set Anfänger', 50, 1),
        ('Lustige {K}-Tasse', 'Mit einem Spruch, den nur echte {K}-Fans verstehen.', '{L} Tasse lustig', 20, 0),
        ('Socken mit {K}-Motiv', 'Kleines Geschenk mit Augenzwinkern – passt auch ins Wichtel-Budget.', '{L} Socken', 10, 1),
        ('T-Shirt für {K}-Fans', 'Zeigt allen, wofür das Herz schlägt.', '{L} T-Shirt', 30, 1),
        ('{K}-Kalender', 'Zwölf Monate {L} an der Wand – jeden Monat ein neues Motiv.', '{L} Kalender', 20, 1),
        ('{K}-Ausrüstung für Fortgeschrittene', 'Das Upgrade für alle, die schon länger dabei sind.', '{L} Ausrüstung', 100, 0),
        ('{K}-Puzzle', 'Für ruhige Abende – mit einem Motiv, das zum Hobby passt.', '{L} Puzzle', 20, 1),
        ('{K}-Geschenkbox', 'Eine Box mit mehreren kleinen Überraschungen rund um {L}.', '{L} Geschenk', 30, 1),
    ],
    'l': [
        ('{K}-Bestseller', 'Ein aktueller Lieblingstitel aus der Bestsellerliste – für neuen Lesestoff.', '{L} Bestseller', 20, 1),
        ('{K}-Klassiker', 'Ein Buch, das man gelesen haben muss.', '{L} Klassiker Buch', 20, 1),
        ('{K}-Box oder Sammelband', 'Gleich mehrere Bücher – für lange Leseabende.', '{L} Box Set', 50, 1),
        ('Lustige {K}-Tasse', 'Für die Tasse Tee beim Lesen.', '{L} Tasse', 20, 0),
        ('Lesezeichen für {K}-Fans', 'Kleines Geschenk für Leseratten.', '{L} Lesezeichen', 10, 1),
        ('Socken mit {K}-Motiv', 'Für gemütliche Leseabende.', '{L} Socken', 10, 1),
        ('T-Shirt für {K}-Fans', 'Zeigt allen, was gerade gelesen wird.', '{L} T-Shirt', 30, 1),
        ('{K}-Puzzle', 'Für ruhige Abende ohne Buch.', '{L} Puzzle', 20, 1),
    ],
    'r': [
        ('Reiseführer {L}', 'Die besten Tipps für die nächste Reise.', '{L} Reiseführer', 20, 1),
        ('Bildband {L}', 'Zum Träumen und Planen auf dem Sofa.', '{L} Bildband', 30, 1),
        ('{K}-Zubehör für unterwegs', 'Praktische Helfer für die nächste Reise.', '{L} Reisezubehör', 30, 1),
        ('{K}-Kalender', 'Zwölf Monate Fernweh an der Wand.', '{L} Kalender', 20, 1),
        ('{K}-Puzzle', 'Für ruhige Abende mit Urlaubsgefühl.', '{L} Puzzle', 20, 1),
        ('Lustige {K}-Tasse', 'Für Kaffee mit Fernweh.', '{L} Tasse', 20, 0),
        ('{K}-Kochbuch', 'Urlaubsküche für zu Hause.', '{L} Kochbuch', 30, 0),
        ('{K}-Geschenkbox', 'Eine Box mit kleinen Überraschungen für die nächste Reise.', '{L} Geschenk', 30, 1),
    ],
    'e': [
        ('Erlebnis-Gutschein: {L}', 'Ein Erlebnis statt noch einem Ding – das bleibt in Erinnerung.', '{L} Gutschein', 100, 1),
        ('{K}-Geschenkbox', 'Schön verpackt, mit kleiner Überraschung zum Erlebnis.', '{L} Geschenk', 50, 1),
        ('Buch über {L}', 'Zum Einstimmen und Vorfreuen.', '{L} Buch', 20, 1),
    ],
    'p': [
        ('{K}-Geschenkset', 'Schön verpackt – fertig zum Verschenken.', '{L} Geschenkset', 30, 1),
        ('{K}-Zubehör', 'Kleine Helfer, die man immer wieder braucht.', '{L} Zubehör', 30, 1),
        ('Hochwertiges {K}-Zubehör', 'Für alle, die schon alles haben.', '{L} hochwertig', 100, 0),
        ('{K}-Adventskalender', '24 Türchen zum Thema – nicht nur im Dezember eine Freude.', '{L} Adventskalender', 50, 1),
        ('Lustige {K}-Tasse', 'Mit einem Spruch, der sofort passt.', '{L} Tasse lustig', 20, 0),
        ('Socken mit {K}-Motiv', 'Kleines Geschenk mit Augenzwinkern.', '{L} Socken', 10, 1),
        ('Buch über {L}', 'Ideen, Tipps und Inspiration.', '{L} Buch', 20, 1),
    ],
    'f': [
        ('{K}-Fanartikel', 'Für echte Fans – vom Schlüsselanhänger bis zum Poster.', '{L} Fanartikel', 30, 1),
        ('{K}-Tasse', 'Jeden Morgen ein Grund zum Lächeln.', '{L} Tasse', 20, 1),
        ('{K}-T-Shirt', 'Zeigt allen, wofür das Herz schlägt.', '{L} T-Shirt', 30, 1),
        ('{K}-Hoodie', 'Kuschelig warm und mit Lieblingsmotiv.', '{L} Hoodie', 50, 1),
        ('{K}-Buch', 'Zum Schmökern, Nachschlagen oder Vorlesen.', '{L} Buch', 20, 1),
        ('{K}-Puzzle', 'Für ruhige Abende mit dem Lieblingsmotiv.', '{L} Puzzle', 20, 1),
        ('{K}-Socken', 'Kleines Geschenk, große Freude.', '{L} Socken', 10, 1),
        ('{K}-Kalender', 'Zwölf Monate Lieblingsmotiv an der Wand.', '{L} Kalender', 20, 1),
        ('{K}-Brettspiel', 'Für Spieleabende mit Freunden und Familie.', '{L} Spiel', 30, 1),
        ('{K}-Figur zum Sammeln', 'Für das Regal oder den Schreibtisch.', '{L} Figur', 30, 1),
        ('{K}-Bausatz', 'Zum Zusammenbauen und Hinstellen.', '{L} Bausatz', 50, 1),
    ],
    't': [
        ('Lustige {K}-Tasse', 'Für alle, die {L} lieben – mit Augenzwinkern.', '{L} Tasse lustig', 20, 1),
        ('Socken mit {K}-Motiv', 'Kleines Geschenk mit großem Niedlichkeitsfaktor.', '{L} Socken', 10, 1),
        ('{K}-Kalender', 'Jeden Monat ein neues Lieblingstier an der Wand.', '{L} Kalender', 20, 1),
        ('Buch über {L}', 'Wissen, Bilder und Geschichten rund um {L}.', '{L} Buch', 20, 1),
        ('{K}-Kuscheltier', 'Zum Knuddeln – auch für Große.', '{L} Kuscheltier', 30, 1),
        ('{K}-Puzzle', 'Für ruhige Abende mit dem Lieblingstier.', '{L} Puzzle', 20, 1),
        ('T-Shirt für {K}-Fans', 'Zeigt allen, welches Tier das beste ist.', '{L} T-Shirt', 30, 1),
        ('{K}-Schmuck', 'Kette oder Anhänger mit dem Lieblingstier.', '{L} Kette Anhänger', 30, 0),
        ('{K}-Deko', 'Kleine Deko fürs Regal, den Garten oder das Kinderzimmer.', '{L} Deko', 20, 1),
        ('{K}-Geschenkset', 'Mehrere kleine Überraschungen rund um {L}.', '{L} Geschenk', 30, 1),
    ],
    'g': [
        ('{K}-Probierset', 'Mehrere Sorten zum Vergleichen und Entdecken.', '{L} Probierset', 30, 1),
        ('{K}-Geschenkset', 'Schön verpackt – fertig zum Verschenken.', '{L} Geschenkset', 50, 1),
        ('{K}-Zubehör', 'Kleine Helfer für noch mehr Genuss.', '{L} Zubehör', 30, 1),
        ('Buch über {L}', 'Wissen, Rezepte und Geschichten rund um {L}.', '{L} Buch', 20, 1),
        ('Socken mit {K}-Motiv', 'Kleines Geschenk mit Augenzwinkern.', '{L} Socken', 10, 1),
        ('{K}-Adventskalender', '24 Türchen voller Genuss.', '{L} Adventskalender', 50, 1),
        ('{K}-Set zum Selbermachen', 'Selbst ausprobieren statt nur genießen.', '{L} selber machen Set', 30, 0),
        ('Hochwertiges {K}-Zubehör', 'Für Kenner, die schon alles haben.', '{L} Zubehör hochwertig', 100, 0),
    ],
}


BAUSTEINE['s'] = [b for b in BAUSTEINE['a'] if 'Ausrüstung' not in b[0]]


def _parse():
    out, gesehen = [], set()
    for mag, typ, txt in _GRUPPEN:
        for teil in txt.split(';'):
            teil = teil.strip()
            if not teil:
                continue
            name, _, flags = teil.partition('|')
            name, _, wort = name.partition('/')
            name, wort = name.strip(), (wort.strip() or name.strip())
            if name.lower() in gesehen:
                continue
            gesehen.add(name.lower())
            out.append([name, wort, mag, typ, flags.strip()])
    return out


# [Name, Wortteil, Interesse, Typ, Flags]
HOBBYS = _parse()

if __name__ == '__main__':
    from collections import Counter
    print(len(HOBBYS), 'Hobbys', Counter(h[2] for h in HOBBYS))
    print('Ideen aus Bausteinen:', sum(len(BAUSTEINE[h[3]]) for h in HOBBYS))
