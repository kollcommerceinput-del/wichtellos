"""Baut die statische Seite WichtelLos in den Ordner, der als erstes Argument übergeben wird."""
import json
import shutil
import sys
from html import escape as esc
from pathlib import Path

SRC = Path(__file__).parent
OUT = Path(sys.argv[1])
DOMAIN = 'https://wichtellos.de'  # bei anderer Domain hier ändern und neu bauen
TODAY = '2026-10-30'

GIFT_BUDGETS = [5, 10, 15, 20, 30]


def head(title, desc, path, extra='', noindex=False):
    url = DOMAIN + path
    robots = '<meta name="robots" content="noindex">\n' if noindex else ''
    return f'''<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
{robots}<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="WichtelLos">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{DOMAIN}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#c62828">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/style.css">{extra}'''


HEADER = '''<header class="top"><div class="bar">
  <a class="logo" href="/"><img src="/favicon.svg" alt="" width="26" height="26"><span>Wichtel<b>Los</b></span></a>
  <nav>
    <a href="/wichtelgeschenke-unter-10-euro/">Geschenkideen</a>
    <a href="/wichteln-wuerfeln-regeln/">Spiele</a>
  </nav>
</div></header>'''

FOOTER = '''<footer>
  <div class="footer-links">
    <a href="/">Wichteln auslosen</a>
    <a href="/wichtelgeschenke-unter-10-euro/">Wichtelgeschenke</a>
    <a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a>
    <a href="/schrottwichteln/">Schrottwichteln</a>
    <a href="/impressum/">Impressum</a>
    <a href="/datenschutz/">Datenschutz</a>
  </div>
  <p class="disclosure">* Mit Sternchen markierte Links sind Werbelinks (Affiliate-Links). Kaufst du darüber ein, erhalten wir eine kleine Provision – für dich ändert sich am Preis nichts. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
  <p>© 2026 WichtelLos</p>
</footer>'''

CTA = '''<div class="cta-box">
  <div class="cta-text"><img class="mascot-small" src="/wichtel.svg" alt="" width="44" height="56"><p>Noch nicht ausgelost? Wichtelgruppe in 1 Minute erstellen – kostenlos und ohne Anmeldung.</p></div>
  <a class="btn-primary" href="/">Jetzt auslosen</a>
</div>'''


def page(path, title, desc, body, extra='', noindex=False):
    html = f'''<!doctype html>
<html lang="de">
<head>
{head(title, desc, path, extra, noindex)}
</head>
<body>
{HEADER}
<main>
{body}
</main>
{FOOTER}
<script src="/assets/site.js"></script>
</body>
</html>
'''
    target = OUT / path.strip('/') / 'index.html' if path != '/' else OUT / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html, encoding='utf-8')


def amazon_link(query, label='Ideen bei Amazon ansehen*'):
    href = 'https://www.amazon.de/s?k=' + query.replace(' ', '+')
    return f'<a href="{esc(href)}" data-amazon="{esc(query)}" rel="sponsored nofollow noopener" target="_blank">{esc(label)}</a>'


# ---------- Geschenkseiten ----------

GIFTS = {
    5: dict(
        title='Wichtelgeschenke unter 5 Euro: 12 kleine Ideen mit großer Wirkung',
        desc='Wichtelgeschenke unter 5 Euro: 12 Ideen zum Naschen, Wohlfühlen und für den Schreibtisch – perfekt für Büro, Schule und kleine Budgets.',
        intro='5 Euro sind knapp – aber gerade dann zählt die Idee mehr als der Preis. Diese Kleinigkeiten passen ins Budget und sorgen trotzdem für ein Lächeln, ob im Büro, in der Schulklasse oder im Verein.',
        groups=[
            ('Zum Naschen', [
                ('Kakao am Stiel', 'In heiße Milch rühren, fertig – das perfekte Mini-Geschenk für kalte Tage.', 'Kakao am Stiel'),
                ('Glückskekse', 'Mit Spruch zum Vorlesen – sorgt bei der Bescherung gleich für Gesprächsstoff.', 'Glückskekse'),
                ('Retro-Süßigkeiten', 'Brausepulver, Lakritz und Co. wecken Kindheitserinnerungen.', 'Retro Süßigkeiten Mix'),
                ('Glühweingewürz', 'Ein Beutel Gewürzmischung macht aus Rotwein oder Saft ein Wintergetränk.', 'Glühweingewürz'),
            ]),
            ('Zum Wohlfühlen', [
                ('Badekugel', 'Duftet, sprudelt und macht aus jedem Bad einen kleinen Wellness-Abend.', 'Badekugel'),
                ('Lippenpflege', 'Klein, nützlich und im Winter garantiert in Gebrauch.', 'Lippenpflege Geschenk'),
                ('Handcreme im Mini-Format', 'Passt in jede Tasche – ideal gegen trockene Winterhände.', 'Handcreme mini'),
                ('Duft-Teelichter', 'Ein paar Teelichter mit Winterduft machen es sofort gemütlich.', 'Duftteelichter'),
            ]),
            ('Für den Schreibtisch', [
                ('Mini-Notizblock mit Spruch', 'Ein witziger Spruch macht ihn zum Hingucker im Büro.', 'Notizblock lustig Spruch'),
                ('Washi-Tape', 'Bunte Klebebänder zum Basteln, Verpacken und Verzieren.', 'Washi Tape Weihnachten'),
                ('Lustiger Kugelschreiber', 'Mit Figur, Licht oder Spruch – benutzt wird er jeden Tag.', 'lustiger Kugelschreiber'),
                ('Kresse-Anzuchtset', 'Ein bisschen Grün für die Fensterbank – wächst in wenigen Tagen.', 'Kresse Anzuchtset'),
            ]),
        ],
        tips=[
            'Kombiniere zwei Kleinigkeiten: Kakao am Stiel plus Glückskeks wirkt wie ein kleines Set.',
            'Selbst gemacht zählt doppelt: Plätzchen oder gebrannte Mandeln im Glas kosten wenig und kommen gut an.',
            'Bei kleinen Budgets macht die Verpackung viel aus – Packpapier, Schleife und ein Tannenzweig genügen.',
        ],
    ),
    10: dict(
        title='Wichtelgeschenke unter 10 Euro: 12 Ideen, auch für Kollegen',
        desc='Wichtelgeschenke unter 10 Euro: 12 Ideen, die fast immer passen – auch für Kollegen, die du kaum kennst. Mit Tipps fürs Büro-Wichteln.',
        intro='10 Euro sind das Klassiker-Budget beim Wichteln – vor allem im Büro. Hier findest du Ideen, die für fast jeden passen, auch wenn du die beschenkte Person kaum kennst.',
        groups=[
            ('Passt für fast jeden', [
                ('Kuschelsocken', 'Warm, weich und immer gern gesehen – gibt es in vielen lustigen Mustern.', 'Kuschelsocken'),
                ('Tasse mit Spruch', 'Ein witziger Spruch sorgt jeden Morgen beim Kaffee für ein Grinsen.', 'Tasse mit Spruch'),
                ('Schönes Notizbuch', 'Für Ideen, Listen oder To-dos – kann wirklich jeder gebrauchen.', 'Notizbuch A5'),
                ('Duftkerze', 'Mit Zimt- oder Tannenduft bringt sie Weihnachtsstimmung nach Hause.', 'Duftkerze Winter'),
            ]),
            ('Für Genießer', [
                ('Gourmet-Schokolade', 'Eine besondere Sorte statt der Standardtafel – etwa mit Chili oder Meersalz.', 'Gourmet Schokolade Geschenk'),
                ('Gewürzmischung', 'Für alle, die gern kochen: ausgefallene Gewürze bringen Abwechslung in die Küche.', 'Gewürzmischung Geschenk'),
                ('Wintertee-Auswahl', 'Verschiedene Sorten zum Probieren – perfekt für gemütliche Abende.', 'Tee Geschenkset Winter'),
                ('Trinkschokolade', 'Heiße Schokolade in besonderen Sorten wärmt an kalten Tagen.', 'Trinkschokolade Geschenk'),
            ]),
            ('Wichtelgeschenke für Kollegen bis 10 Euro', [
                ('Mini-Pflanze', 'Eine Sukkulente oder ein kleiner Kaktus braucht kaum Pflege und verschönert jeden Schreibtisch.', 'Sukkulenten Set'),
                ('Handwärmer', 'Wiederverwendbar – gegen kalte Finger im Büro oder auf dem Weihnachtsmarkt.', 'Handwärmer wiederverwendbar'),
                ('Knobelspiel', 'Ein kleines Geduldsspiel für kurze Pausen zwischendurch.', 'Knobelspiel Holz'),
                ('Kartenspiel', 'Kleine Party- oder Kartenspiele sorgen für Spaß beim nächsten Treffen.', 'Kartenspiel Party'),
            ]),
        ],
        tips=[
            'Kennst du die Person kaum? Wähle etwas zum Genießen oder Wohlfühlen – damit liegst du selten daneben.',
            'Vermeide sehr Persönliches wie Parfüm oder Kleidung in bestimmten Größen.',
            'Im Büro besonders beliebt: Dinge, die man direkt am Arbeitsplatz nutzen kann.',
        ],
    ),
    15: dict(
        title='Wichtelgeschenke unter 15 Euro: 12 Ideen mit etwas mehr Spielraum',
        desc='Wichtelgeschenke unter 15 Euro: 12 Ideen für gemütliche Abende, Knobelfans und Genießer – Geschenke, die länger Freude machen.',
        intro='Mit 15 Euro hast du schon etwas mehr Spielraum – genug für ein Geschenk, das nicht nur kurz Freude macht, sondern auch nach Weihnachten noch benutzt wird.',
        groups=[
            ('Für gemütliche Abende', [
                ('Thermobecher', 'Hält Tee und Kaffee lange warm – für den Weg zur Arbeit oder den Winterspaziergang.', 'Thermobecher'),
                ('Lichterkette mit Batterie', 'Für Fensterbank, Glas oder Regal – ganz ohne Steckdose.', 'Lichterkette Batterie'),
                ('Wärmflasche mit Bezug', 'Ein Klassiker, der im Winter jeden Abend zum Einsatz kommt.', 'Wärmflasche mit Bezug'),
                ('Tee-Geschenkset', 'Mehrere Sorten in einer schönen Box – ideal zum Ausprobieren.', 'Tee Set Geschenk'),
            ]),
            ('Für Spieler und Knobler', [
                ('Puzzle', '500 oder 1000 Teile mit schönem Motiv – genau richtig für die Feiertage.', 'Puzzle 1000 Teile'),
                ('Zauberwürfel', 'Der Knobel-Klassiker, an dem man sich wunderbar die Zähne ausbeißen kann.', 'Zauberwürfel'),
                ('Partyspiel', 'Ein schnelles Karten- oder Quizspiel für den nächsten Spieleabend.', 'Partyspiel Karten'),
            ]),
            ('Für Genießer', [
                ('Gewürz-Set', 'Mehrere Gewürze in einer Box – für Hobbyköchinnen und -köche.', 'Gewürz Set Geschenk'),
                ('Trüffelsalz', 'Eine Prise macht Pasta, Ei oder Pommes zu etwas Besonderem.', 'Trüffelsalz'),
                ('Backmischung im Glas', 'Kekse oder Brownies – nur noch Butter und Ei dazu.', 'Backmischung im Glas'),
            ]),
            ('Praktisch', [
                ('Handyhalterung', 'Für Schreibtisch oder Küche – braucht fast jeder.', 'Handyhalterung Schreibtisch'),
                ('Kräuter-Anzuchtset', 'Basilikum, Petersilie und Co. selbst ziehen – Freude bis in den Frühling.', 'Anzuchtset Kräuter'),
            ]),
        ],
        tips=[
            'Preise schwanken in der Vorweihnachtszeit – achte beim Kauf auf das vereinbarte Budget.',
            'Ein Geschenk, das man benutzt, bleibt länger in Erinnerung als reine Deko.',
            'Unsicher? Etwas für gemütliche Winterabende passt fast immer.',
        ],
    ),
    20: dict(
        title='Wichtelgeschenke unter 20 Euro: 12 Ideen für Familie und Freunde',
        desc='Wichtelgeschenke unter 20 Euro: 12 Ideen von Kuscheldecke bis Escape-Spiel – für Familie, Freunde und alle, die etwas Besonderes suchen.',
        intro='20 Euro sind ein beliebtes Budget im Freundeskreis und in der Familie. Damit findest du schon ein richtig schönes Geschenk – ob gemütlich, zum Spielen oder zum Genießen.',
        groups=[
            ('Gemütlich', [
                ('Kuscheldecke', 'Weich, warm und im Winter dauernd im Einsatz – der Wichtel-Klassiker.', 'Kuscheldecke'),
                ('Duftkerzen-Set', 'Mehrere Düfte für verschiedene Stimmungen.', 'Duftkerzen Set Geschenk'),
                ('Schlafmaske aus Seide', 'Für alle, die am Wochenende gern ausschlafen.', 'Schlafmaske Seide'),
            ]),
            ('Spiele und Rätsel', [
                ('Escape-Spiel für zu Hause', 'Ein Rätselabend wie im Escape Room – für 1 bis 4 Personen.', 'Escape Room Spiel'),
                ('Quizspiel', 'Wissen, Schätzen, Lachen – passt für Familie und Freunde.', 'Quizspiel Erwachsene'),
                ('Reisespiel', 'Die kleine Version eines Klassikers für unterwegs.', 'Reisespiel'),
            ]),
            ('Genuss', [
                ('Cocktail-Set', 'Shaker, Messbecher und Rezepte – für Hobby-Barkeeper.', 'Cocktail Set'),
                ('Kochbuch', 'Zu einem Lieblingsthema, etwa Pasta, Backen oder vegetarisch.', 'Kochbuch Geschenk'),
                ('Feinkost-Box', 'Kleine Leckereien zum Probieren in einer schönen Box.', 'Feinkost Geschenkbox'),
            ]),
            ('Praktische Technik', [
                ('Kopfhörer mit Kabel', 'Als Ersatz oder für unterwegs kann man sie immer gebrauchen.', 'In Ear Kopfhörer Kabel'),
                ('Kleine Powerbank', 'Lädt das Handy, wenn der Akku unterwegs schlappmacht.', 'Powerbank klein'),
                ('Leselampe zum Anklemmen', 'Für Leseratten – einfach ans Buch klemmen.', 'Leselampe Buch Klemme'),
            ]),
        ],
        tips=[
            'In der Familie darf es persönlicher sein: Denk an Hobbys und Lieblingsthemen.',
            'Spiele sind ideal, wenn ihr euch über die Feiertage seht – dann wird gleich gemeinsam ausprobiert.',
            'Bei Technik auf den passenden Anschluss achten (USB-C oder Lightning).',
        ],
    ),
    30: dict(
        title='Wichtelgeschenke unter 30 Euro: 12 Ideen, die richtig Eindruck machen',
        desc='Wichtelgeschenke unter 30 Euro: 12 Ideen vom Krimidinner über Bluetooth-Lautsprecher bis Pizzastein – für Familie und gute Freunde.',
        intro='Mit 30 Euro wird aus dem Wichtelgeschenk ein richtiges Geschenk. Ideal für die Familie und gute Freunde, bei denen du weißt, was ihnen gefällt.',
        groups=[
            ('Für Spieleabende', [
                ('Brettspiel', 'Ein Familien- oder Strategiespiel für lange Winterabende.', 'Brettspiel Familie'),
                ('Escape-Room-Box', 'Mehrere Rätsel in einer Box – für einen ganzen Abend Spannung.', 'Escape Room Spiel Box'),
                ('Krimidinner für zu Hause', 'Alle schlüpfen in eine Rolle und lösen beim Essen einen Mordfall.', 'Krimidinner Spiel'),
            ]),
            ('Technik und Gadgets', [
                ('Kleiner Bluetooth-Lautsprecher', 'Musik für Küche, Bad oder unterwegs.', 'Bluetooth Lautsprecher klein'),
                ('Powerbank mit viel Kapazität', 'Reicht für mehrere Handy-Ladungen – ideal für Reisen.', 'Powerbank'),
                ('LED-Tischlampe', 'Dimmbares Licht für Schreibtisch oder Nachttisch.', 'LED Tischlampe dimmbar'),
            ]),
            ('Genuss', [
                ('Gin-Tasting-Set (ab 18)', 'Mehrere kleine Flaschen zum Probieren – nur für Erwachsene.', 'Gin Tasting Set'),
                ('Pizzastein', 'Für knusprige Pizza aus dem eigenen Ofen.', 'Pizzastein'),
                ('Kaffee-Probierset', 'Verschiedene Röstungen für Kaffeefans.', 'Kaffee Probierset'),
            ]),
            ('Gemütlich', [
                ('Decke mit Ärmeln', 'Warm wie eine Decke, praktisch wie ein Pullover.', 'Decke mit Ärmeln'),
                ('Bonsai-Starterset', 'Ein neues Hobby für Geduldige.', 'Bonsai Starterset'),
                ('Wellness-Set', 'Badezusatz, Peeling und Co. für einen Abend Auszeit.', 'Wellness Set Geschenk'),
            ]),
        ],
        tips=[
            'Bei 30 Euro lohnt sich ein Blick auf Hobbys – ein passendes Geschenk wirkt viel persönlicher.',
            'Alkohol nur, wenn du sicher weißt, dass die Person ihn trinkt (und volljährig ist).',
            'Ein Erlebnis zu zweit, etwa ein Spieleabend, ist oft wertvoller als ein weiteres Ding.',
        ],
    ),
}


def gift_page(budget):
    g = GIFTS[budget]
    path = f'/wichtelgeschenke-unter-{budget}-euro/'
    chips = '\n'.join(
        f'<a href="/wichtelgeschenke-unter-{b}-euro/"{" aria-current=\"page\"" if b == budget else ""}>unter {b} €</a>'
        for b in GIFT_BUDGETS)
    sections = []
    for name, ideas in g['groups']:
        cards = '\n'.join(f'''<div class="idea">
  <h3>{esc(title)}</h3>
  <p>{esc(text)}</p>
  {amazon_link(query)}
</div>''' for title, text, query in ideas)
        sections.append(f'<h2>{esc(name)}</h2>\n<div class="idea-grid">\n{cards}\n</div>')
    tips = '\n'.join(f'<li>{esc(t)}</li>' for t in g['tips'])
    body = f'''<article>
<h1>Wichtelgeschenke unter {budget} Euro</h1>
<p class="lead">{esc(g['intro'])}</p>
<div class="chips">
{chips}
</div>
{CTA}
{chr(10).join(sections)}
<div class="ad-slot">Anzeige (Platzhalter)</div>
<h2>Tipps für Wichtelgeschenke unter {budget} Euro</h2>
<ul>
{tips}
</ul>
<p class="disclosure">* Werbelinks: Die Links führen zu passenden Suchergebnissen bei Amazon. Kaufst du darüber ein, erhalten wir eine kleine Provision – für dich ändert sich am Preis nichts.</p>
{CTA}
</article>'''
    page(path, g['title'], g['desc'], body)


# ---------- Spiele ----------

def dice_page():
    body = f'''<article>
<h1>Wichteln mit Würfeln: Regeln, Ablauf und Varianten</h1>
<p class="lead">Beim Würfelwichteln entscheidet der Würfel, wer am Ende welches Geschenk mit nach Hause nimmt. Das sorgt für Spannung, Gelächter und so manchen Tausch in letzter Sekunde – perfekt für Weihnachtsfeiern mit Kollegen, Freunden oder der Familie.</p>
<p class="no-print"><button type="button" class="btn-secondary" data-print>🖨️ Regeln ausdrucken</button></p>

<h2>Was ihr braucht</h2>
<ul>
  <li>Ein verpacktes Geschenk pro Person – vorher ein Budget absprechen, z. B. 10 oder 15 Euro.</li>
  <li>Einen Würfel (bei mehr als 12 Personen besser zwei).</li>
  <li>Einen Timer, zum Beispiel am Handy.</li>
  <li>Einen Tisch oder Stuhlkreis, an dem alle sitzen.</li>
</ul>

<h2>Runde 1: Geschenke verteilen</h2>
<p>Alle Geschenke liegen in der Mitte. Reihum wird gewürfelt. Wer eine <b>6</b> würfelt, nimmt sich ein Geschenk aus der Mitte. Es wird so lange weitergewürfelt, bis die Mitte leer ist. Manche haben dann zwei Geschenke, andere gar keins – das ist Absicht.</p>

<h2>Runde 2: Tauschen mit Timer</h2>
<p>Jetzt wird der Timer gestellt, zum Beispiel auf 10 bis 15 Minuten. Reihum wird weitergewürfelt, und jede Zahl hat eine eigene Regel:</p>
<table class="rules">
  <tr><td class="num">1</td><td>Gib ein Geschenk an deinen <b>linken</b> Nachbarn.</td></tr>
  <tr><td class="num">2</td><td>Gib ein Geschenk an deinen <b>rechten</b> Nachbarn.</td></tr>
  <tr><td class="num">3</td><td><b>Alle</b> geben ein Geschenk eine Person nach links weiter.</td></tr>
  <tr><td class="num">4</td><td><b>Tausche</b> ein Geschenk mit einer Person deiner Wahl.</td></tr>
  <tr><td class="num">5</td><td><b>Nimm dir</b> ein Geschenk von einer beliebigen Person.</td></tr>
  <tr><td class="num">6</td><td>Glück gehabt – du darfst <b>noch einmal</b> würfeln.</td></tr>
</table>
<p>Hast du gerade kein Geschenk und würfelst eine 1, 2 oder 4, passiert nichts – der Würfel geht weiter.</p>

<h2>Ende des Spiels</h2>
<p>Sobald der Timer klingelt, ist Schluss: Jeder behält die Geschenke, die er gerade in der Hand hat, und alle packen gleichzeitig aus.</p>

<h2>Varianten</h2>
<ul>
  <li><b>Ohne Auspacken:</b> Die Geschenke bleiben bis zum Schluss verpackt. So weiß niemand, ob sich ein Tausch lohnt – das ist die beliebteste Variante.</li>
  <li><b>Mit Auspacken:</b> Wer in Runde 1 ein Geschenk bekommt, packt es sofort aus. In Runde 2 wird dann gezielt um die beliebtesten Geschenke gewürfelt.</li>
  <li><b>Große Gruppen:</b> Mit zwei Würfeln gleichzeitig spielen, die auf gegenüberliegenden Seiten starten.</li>
  <li><b>Schrottwichteln:</b> Statt gekaufter Geschenke bringt jeder etwas Kurioses von zu Hause mit. Mehr dazu unter <a href="/schrottwichteln/">Schrottwichteln</a>.</li>
</ul>

<h2>Tipps für eine gelungene Runde</h2>
<ul>
  <li>Unterschiedliche Verpackungsgrößen machen das Spiel spannender – ein kleines Päckchen kann das beste Geschenk sein.</li>
  <li>Die Regeln vorher einmal laut vorlesen oder ausgedruckt auf den Tisch legen.</li>
  <li>Bei Kindern den Timer kürzer stellen, etwa auf 5 Minuten.</li>
</ul>
<div class="ad-slot">Anzeige (Platzhalter)</div>
<div class="cta-box">
  <p>Lieber klassisch wichteln, ohne Würfel? Die Namen lassen sich online in einer Minute auslosen.</p>
  <a class="btn-primary" href="/">Wichteln auslosen</a>
</div>
</article>'''
    page('/wichteln-wuerfeln-regeln/', 'Wichteln mit Würfeln: Regeln, Ablauf & Varianten zum Ausdrucken',
         'Wichteln mit Würfeln: Die Regeln für jede Zahl, der Ablauf in zwei Runden und beliebte Varianten wie „ohne Auspacken“ – mit Druckversion.', body)


SCRAP_IDEAS = [
    ('Kitsch und Deko', ['Porzellanfigur aus der Vitrine', 'Schneekugel mit Ortsnamen', 'Bilderrahmen mit Musterfoto',
                          'Plastikblumen im Topf', 'Duftbäumchen fürs Auto', 'Kerze in Tierform']),
    ('Aus der Werbegeschenk-Kiste', ['Kugelschreiber mit Firmenlogo', 'Schlüsselband von der Messe', 'Tasse vom Autohaus',
                                       'Antistressball in Glühbirnenform', 'Kalender vom letzten Jahr', 'Flaschenöffner mit Werbeaufdruck']),
    ('Retro', ['Musikkassette', 'VHS-Kassette', 'CD mit Schlagern', 'Altes Handy-Ladekabel',
               'Sammelalbum mit fehlenden Bildern', 'Briefpapier-Set']),
    ('Küche', ['Einzelne Fondue-Gabel', 'Eierbecher mit Gesicht', 'Frischhaltedose ohne Deckel',
               'Gehäkelte Topflappen', 'Salzstreuer ohne Pfefferstreuer', 'Eierschneider']),
]


def scrap_page():
    lists = '\n'.join(
        f'<h3>{esc(cat)}</h3>\n<ul class="list-cols">\n' + '\n'.join(f'<li>{esc(i)}</li>' for i in items) + '\n</ul>'
        for cat, items in SCRAP_IDEAS)
    buy = [('Scherzartikel', 'Scherzartikel'), ('Quietschendes Gummihuhn', 'Gummihuhn quietschend'),
           ('Lustige Socken', 'lustige Socken'), ('Furzkissen', 'Furzkissen')]
    buy_cards = '\n'.join(f'''<div class="idea">
  <h3>{esc(t)}</h3>
  {amazon_link(q)}
</div>''' for t, q in buy)
    body = f'''<article>
<h1>Schrottwichteln: Regeln und 24 lustige Ideen</h1>
<p class="lead">Beim Schrottwichteln wird nichts gekauft: Jeder bringt etwas mit, das zu Hause herumliegt und niemand mehr braucht – je kurioser, desto besser. Das kostet nichts, schont die Umwelt und sorgt garantiert für Lacher.</p>

<h2>Die Regeln</h2>
<ul>
  <li><b>Budget: 0 Euro.</b> Das Geschenk stammt aus dem eigenen Haushalt.</li>
  <li><b>Kein Müll:</b> Nichts Kaputtes, Verschmutztes oder Ekliges, keine abgelaufenen Lebensmittel.</li>
  <li><b>Nichts Wertvolles:</b> Erbstücke und echte Wertgegenstände bleiben zu Hause.</li>
  <li><b>Gut verpacken:</b> Damit niemand vorher errät, was drin ist.</li>
  <li><b>Verteilt wird</b> per Würfelspiel oder per Los – Tauschen ausdrücklich erlaubt.</li>
</ul>

<h2>So läuft es ab</h2>
<p>Am beliebtesten ist Schrottwichteln mit Würfeln: Erst werden die Päckchen verteilt, dann mit Timer getauscht. Die genauen Regeln findest du unter <a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a>. Alternativ lost ihr einfach aus, wer wem ein Päckchen schenkt.</p>
{CTA}

<h2>24 Ideen fürs Schrottwichteln</h2>
{lists}

<div class="ad-slot">Anzeige (Platzhalter)</div>

<h2>Nichts Passendes zu Hause?</h2>
<p>Dann tut es auch ein günstiger Scherzartikel – Hauptsache, alle lachen.</p>
<div class="idea-grid">
{buy_cards}
</div>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, erhalten wir eine kleine Provision – für dich ändert sich am Preis nichts.</p>
</article>'''
    page('/schrottwichteln/', 'Schrottwichteln: Regeln & 24 lustige Ideen für Büro und Familie',
         'Schrottwichteln: Die Regeln, der Ablauf mit Würfeln und 24 lustige Ideen aus Kitsch, Werbegeschenken und Retro-Fundstücken – kostenlos und nachhaltig.', body)


# ---------- Rechtliches (Entwürfe) ----------

def ph(text):
    return f'<span class="placeholder">[{esc(text)}]</span>'


def legal_pages():
    draft = '<p class="draft-note">Entwurf – bitte vor dem Livegang die Platzhalter ausfüllen und den Text prüfen lassen (z. B. mit einem Generator wie e-recht24 oder anwaltlich). Diesen Hinweis danach entfernen.</p>'
    impressum = f'''<article>
<h1>Impressum</h1>
{draft}
<h2>Angaben gemäß § 5 DDG</h2>
<p>{ph('Vorname Nachname')}<br>{ph('Straße Hausnummer')}<br>{ph('PLZ Ort')}<br>Deutschland</p>
<h2>Kontakt</h2>
<p>E-Mail: {ph('E-Mail-Adresse')}<br>Telefon: {ph('Telefonnummer')}</p>
<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
<p>{ph('Vorname Nachname')}, Anschrift wie oben</p>
<h2>Hinweis zu Werbelinks</h2>
<p>Diese Website enthält Affiliate-Links, die mit einem Sternchen (*) gekennzeichnet sind. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
</article>'''
    page('/impressum/', 'Impressum | WichtelLos', 'Impressum von WichtelLos.', impressum, noindex=True)

    datenschutz = f'''<article>
<h1>Datenschutzerklärung</h1>
{draft}
<h2>1. Verantwortlicher</h2>
<p>{ph('Vorname Nachname')}, {ph('Straße Hausnummer')}, {ph('PLZ Ort')}, E-Mail: {ph('E-Mail-Adresse')}</p>

<h2>2. Das Wichtigste in Kürze</h2>
<p>Wir verarbeiten so wenig Daten wie möglich. Es gibt kein Benutzerkonto, keine Analyse- oder Tracking-Werkzeuge und wir setzen keine Cookies.</p>

<h2>3. Hosting und Server-Protokolle</h2>
<p>Diese Website wird bei der IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, betrieben. Beim Aufruf einer Seite verarbeitet der Anbieter technisch notwendige Daten wie IP-Adresse, Datum und Uhrzeit, aufgerufene Seite und Browsertyp, um die Website auszuliefern und vor Angriffen zu schützen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung. Die Server stehen in Deutschland. {ph('Speicherdauer der Server-Protokolle laut IONOS ergänzen')}</p>

<h2>4. Die Wichtel-Auslosung</h2>
<p>Namen, Gruppenname, Budget, Datum und Nachricht, die du in das Formular einträgst, werden ausschließlich in deinem Browser verarbeitet. Die Zuteilung wird codiert in den persönlichen Links gespeichert, und zwar im Teil nach dem #-Zeichen. Diesen Teil überträgt der Browser beim Aufruf nicht an unseren Server – wir erhalten von den Namen und Zuteilungen keine Kenntnis.</p>
<p>Wenn du Links per WhatsApp oder E-Mail verschickst, gelten dafür die Datenschutzbestimmungen des jeweiligen Dienstes.</p>

<h2>5. Speicherung im Browser (Local Storage)</h2>
<p>Damit dein Entwurf und die zuletzt erzeugten Links nicht verloren gehen, werden sie im Local Storage deines Browsers gespeichert. Diese Daten bleiben auf deinem Gerät und werden nicht an uns übertragen. Du kannst sie jederzeit über die Einstellungen deines Browsers löschen. Die Speicherung ist für die von dir gewünschte Funktion erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).</p>

<h2>6. Werbelinks zu Amazon</h2>
<p>Mit Sternchen (*) gekennzeichnete Links führen zu Amazon.de. Auf unserer Website werden dabei keine Cookies gesetzt. Erst wenn du einen solchen Link anklickst, verarbeitet Amazon (Amazon Europe Core S.à r.l., Luxemburg) Daten, unter anderem mithilfe von Cookies, um eine Provision zuordnen zu können. Näheres findest du in der Datenschutzerklärung von Amazon.</p>

<h2>7. Kontakt per E-Mail</h2>
<p>Wenn du uns per E-Mail schreibst, verarbeiten wir deine Angaben, um deine Anfrage zu beantworten (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Die Daten werden gelöscht, sobald sie dafür nicht mehr benötigt werden.</p>

<h2>8. Deine Rechte</h2>
<p>Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO).</p>
<p>Stand: Oktober 2026</p>
</article>'''
    page('/datenschutz/', 'Datenschutzerklärung | WichtelLos', 'Datenschutzerklärung von WichtelLos.', datenschutz, noindex=True)


def tool_page():
    faq = {
        '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
            {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in [
                ('Wie funktioniert Wichteln online?', 'Namen eintragen, auslosen, fertig. Jede Person bekommt einen eigenen Link und sieht nur, wen sie selbst beschenkt.'),
                ('Muss ich mich anmelden?', 'Nein. Weder der Organisator noch die Teilnehmer brauchen ein Konto oder eine E-Mail-Adresse.'),
                ('Werden unsere Namen gespeichert?', 'Nicht auf unserem Server. Die Zuteilung steckt codiert im Link nach dem #-Zeichen, den der Browser nicht an den Server schickt.'),
                ('Können Paare ausgeschlossen werden?', 'Ja. Unter „Ausschlüsse“ legst du fest, wer wen nicht ziehen darf – in beide Richtungen.'),
            ]]}
    app = {'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'WichtelLos', 'url': DOMAIN + '/',
           'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Alle',
           'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'EUR'}}
    extra = ''.join(f'\n<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (app, faq))
    html = (SRC / 'tool.html').read_text(encoding='utf-8')
    html = html.replace('<!--HEAD-->', head('Wichteln online auslosen – kostenlos & ohne Anmeldung | WichtelLos',
                                             'Wichtelgruppe in 1 Minute auslosen: Namen eintragen, Paare ausschließen, geheime Links per WhatsApp verschicken. Kostenlos, ohne Anmeldung, ohne E-Mail.',
                                             '/', extra))
    html = html.replace('<!--HEADER-->', HEADER).replace('<!--FOOTER-->', FOOTER)
    (OUT / 'index.html').write_text(html, encoding='utf-8')


def extras():
    page('/404/', 'Seite nicht gefunden | WichtelLos', 'Diese Seite gibt es nicht.',
         '<img class="mascot-reveal" src="/wichtel.svg" alt="" width="90" height="114"><h1>Seite nicht gefunden 😕</h1><p>Diese Seite gibt es leider nicht – unser Wichtel hat sie wohl versteckt.</p><p><a class="btn-primary" href="/">Zur Wichtel-Auslosung</a></p>',
         noindex=True)
    shutil.move(OUT / '404' / 'index.html', OUT / '404.html')
    (OUT / '404').rmdir()
    urls = ['/'] + [f'/wichtelgeschenke-unter-{b}-euro/' for b in GIFT_BUDGETS] + ['/wichteln-wuerfeln-regeln/', '/schrottwichteln/']
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        f'  <url><loc>{DOMAIN}{u}</loc><lastmod>{TODAY}</lastmod></url>\n' for u in urls) + '</urlset>\n'
    (OUT / 'sitemap.xml').write_text(sitemap, encoding='utf-8')
    (OUT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n', encoding='utf-8')


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / 'assets').mkdir(parents=True)
    for f in ('style.css', 'site.js'):
        shutil.copy(SRC / 'assets' / f, OUT / 'assets' / f)
    for f in ('favicon.svg', 'wichtel.svg', 'og-image.png', 'apple-touch-icon.png'):
        if (SRC / f).exists():
            shutil.copy(SRC / f, OUT / f)
    tool_page()
    for b in GIFT_BUDGETS:
        gift_page(b)
    dice_page()
    scrap_page()
    legal_pages()
    extras()
    print('Fertig:', sorted(str(p.relative_to(OUT)) for p in OUT.rglob('*') if p.is_file()))


if __name__ == '__main__':
    main()
