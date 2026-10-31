"""Baut die statische Seite WichtelLos in den Ordner, der als erstes Argument übergeben wird."""
import json
import re
import shutil
import sys
from html import escape as esc
from urllib.parse import urlencode
from pathlib import Path

SRC = Path(__file__).parent
sys.path.insert(0, str(SRC))
from gifts import AGE_LABELS, BUDGETS, CAT_LABELS, DIY, IDEAS  # noqa: E402
OUT = Path(sys.argv[1])
DOMAIN = 'https://wichtellos.de'  # bei anderer Domain hier ändern und neu bauen
# IONOS-SSL am 30.10.2026 gekündigt (96 €/Jahr): bis HTTPS wieder steht, nicht auf https umleiten
FORCE_HTTPS = False
TODAY = '2026-10-31'

GIFT_BUDGETS = [5, 10, 15, 20, 30]
# Amazon-Partner-ID – nur hier ändern; landet beim Bauen in allen Links und in site.js
AMAZON_TAG = 'wichtellos-21'
INDEXNOW_KEY = '1ad0ea986d461d98be992b90c6be2615'  # öffentlich (liegt als /<key>.txt auf der Seite), kein Geheimnis
PUBLISHED = '2026-10-30'

ORG = {'@type': 'Organization', 'name': 'KOLL Commerce UG (haftungsbeschränkt)', 'url': DOMAIN + '/',
       'logo': DOMAIN + '/apple-touch-icon.png', 'email': 'kollcommerce@mailbox.org',
       'sameAs': ['https://www.instagram.com/wichtellos/', 'https://www.pinterest.com/wichtellos/',
                  'https://www.tiktok.com/@wichtellos']}


def ld(*objs):
    return ''.join(f'\n<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in objs)


def crumbs(path, name):
    # sichtbare Brotkrumen + BreadcrumbList/Article für Unterseiten
    html = f'<nav class="crumbs" aria-label="Brotkrumen"><a href="/">Startseite</a> › <span>{esc(name)}</span></nav>'
    trail = {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'Startseite', 'item': DOMAIN + '/'},
        {'@type': 'ListItem', 'position': 2, 'name': name, 'item': DOMAIN + path}]}
    return html, trail


def article_ld(path, title, desc):
    return {'@context': 'https://schema.org', '@type': 'Article', 'headline': title, 'description': desc,
            'image': DOMAIN + '/og-image.png', 'inLanguage': 'de-DE', 'mainEntityOfPage': DOMAIN + path,
            'datePublished': PUBLISHED, 'dateModified': TODAY, 'author': ORG, 'publisher': ORG}


def head(title, desc, path, extra='', noindex=False):
    url = DOMAIN + path
    slug = path.strip('/')
    og = f'/og/{slug}.png' if slug and (SRC / 'og' / f'{slug}.png').exists() else '/og-image.png'
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
<meta property="og:image" content="{DOMAIN}{og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#c62828">
<meta name="msvalidate.01" content="17BAEEA0B1BBFF97909DD4B13DE0C9D7">
<meta name="p:domain_verify" content="1d84f7ff53bf1ac6ce44bb91577542e9"/>
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96">
<link rel="manifest" href="/site.webmanifest">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/fredoka-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/style.css">{extra}'''


HEADER = '''<header class="top"><div class="bar">
  <a class="logo" href="/"><img src="/favicon.svg" alt="" width="26" height="26"><span>Wichtel<b>Los</b></span></a>
  <nav>
    <a href="/geschenkfinder/">Geschenkideen</a>
    <a href="/wichteln-wuerfeln-regeln/">Spiele</a>
  </nav>
</div></header>'''

FOOTER = '''<footer>
  <div class="footer-links">
    <a href="/">Wichteln auslosen</a>
    <a href="/geschenkfinder/">Geschenkfinder</a>
    <a href="/wichtelgeschenke-unter-10-euro/">Wichtelgeschenke</a>
    <a href="/wichtelgeschenke-fuer-kinder/">Für Kinder</a>
    <a href="/wichtelgeschenke-selber-machen/">Selbst gemacht</a>
    <a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a>
    <a href="/schrottwichteln/">Schrottwichteln</a>
    <a href="/wichteln-im-buero/">Wichteln im Büro</a>
    <a href="/wichteln-schule-kita/">Schule &amp; Kita</a>
    <a href="/weihnachtsfeier-ideen/">Weihnachtsfeier-Ideen</a>
    <a href="/wichteltuer/">Wichteltür</a>
    <a href="/wichtelgedichte/">Wichtelgedichte</a>
    <a href="/woher-kommt-wichteln/">Woher kommt Wichteln?</a>
    <a href="/wichteln-einladung-vorlage/">Einladung zum Aushängen</a>
    <a href="/impressum/">Impressum</a>
    <a href="/datenschutz/">Datenschutz</a>
  </div>
  <p class="disclosure">* Mit Sternchen markierte Links sind Werbelinks (Affiliate-Links). Kaufst du darüber ein, erhalten wir eine kleine Provision – für dich ändert sich am Preis nichts. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
  <p class="social">Folge uns: <a href="https://www.instagram.com/wichtellos/" rel="noopener" target="_blank">📸 Instagram</a>
    <a href="https://www.pinterest.com/wichtellos/" rel="noopener" target="_blank">📌 Pinterest</a>
    <a href="https://www.tiktok.com/@wichtellos" rel="noopener" target="_blank">🎵 TikTok</a></p>
  <p>© 2026 WichtelLos</p>
</footer>'''

CTA = '''<div class="cta-box">
  <div class="cta-text"><img class="mascot-small" src="/wichtel.svg" alt="" width="44" height="56"><p>Noch nicht ausgelost? Wichtelgruppe in 1 Minute erstellen – kostenlos und ohne Anmeldung.</p></div>
  <a class="btn-primary" href="/">Jetzt auslosen</a>
</div>'''


# Wichtel-Posen in grafik/: Datei -> (Breite, Höhe) fürs img-Tag
POSES = {'winkt': (132, 152), 'geschenk': (120, 152), 'lupe': (132, 152), 'wuerfel': (132, 152), 'schlaeft': (152, 162)}


def pose_img(pose, cls='page-mascot'):
    w, h = POSES[pose]
    return f'<img class="{cls}" src="/grafik/wichtel-{pose}.svg" alt="" width="{w}" height="{h}">'


def page(path, title, desc, body, extra='', noindex=False, crumb=None, mascot=None, playful=False, body_class=''):
    if mascot:
        body = body.replace('<article>\n<h1>', f'<article>\n{pose_img(mascot)}\n<h1>', 1)
    if crumb:
        nav, trail = crumbs(path, crumb)
        body = nav + '\n' + body
        extra += ld(trail, article_ld(path, title, desc))
    html = f'''<!doctype html>
<html lang="de">
<head>
{head(title, desc, path, extra, noindex)}
</head>
<body{(' class="' + ' '.join(c for c in ('verspielt' if playful else '', body_class) if c) + '"') if (playful or body_class) else ''}>
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


def amazon_url(query):
    params = {'k': query, **({'tag': AMAZON_TAG} if AMAZON_TAG else {})}
    return 'https://www.amazon.de/s?' + urlencode(params)


def amazon_link(query, label='Ideen bei Amazon ansehen*'):
    href = amazon_url(query)
    return f'<a href="{esc(href)}" data-amazon="{esc(query)}" rel="sponsored nofollow noopener" target="_blank">{esc(label)}</a>'


# ---------- Geschenkseiten ----------

GIFTS = {
    5: dict(
        title='Wichtelgeschenke unter 5 Euro: 12 kleine Ideen mit Wirkung',
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
        title='Wichtelgeschenke unter 15 Euro: 12 Ideen mit Spielraum',
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
        title='Wichtelgeschenke unter 20 Euro: 12 Ideen für Familie',
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
        title='Wichtelgeschenke unter 30 Euro: 12 Ideen mit Wow-Effekt',
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
<p class="hint">Lieber nach Alter und Interessen filtern? <a href="/geschenkfinder/?budget={budget}">Zum Geschenkfinder →</a></p>
{CTA}
{chr(10).join(sections)}
<div class="ad-slot">Anzeige (Platzhalter)</div>
<h2>Tipps für Wichtelgeschenke unter {budget} Euro</h2>
<ul>
{tips}
</ul>
{'<p>Wichtelt ihr im Team? Budget, Regeln und Ablauf findest du unter <a href="/wichteln-im-buero/">Wichteln im Büro</a>.</p>' if budget <= 15 else ''}
<p class="disclosure">* Werbelinks: Die Links führen zu passenden Suchergebnissen bei Amazon. Kaufst du darüber ein, erhalten wir eine kleine Provision – für dich ändert sich am Preis nichts.</p>
{CTA}
</article>'''
    page(path, g['title'], g['desc'], body, crumb=f'Wichtelgeschenke unter {budget} Euro')


# ---------- Geschenkfinder, Kinder, Selbst gemacht ----------

def norm(text):
    # muss zu norm() in assets/finder.js passen
    text = text.lower()
    for a, b in (('ä', 'ae'), ('ö', 'oe'), ('ü', 'ue'), ('ß', 'ss')):
        text = text.replace(a, b)
    return text


def tag_line(idea):
    ages = 'Für alle Altersgruppen' if len(idea['ages']) == 4 else ' · '.join(AGE_LABELS[a] for a in idea['ages'])
    office = ' · fürs Büro' if idea['office'] else ''
    return f"{ages} · bis {idea['budget']} €{office}"


def idea_card(idea, data=False):
    attrs = ''
    if data:
        # Alter bewusst nicht im Suchtext: „tee“ fände sonst alle Teenager-Ideen; Alter filtern die Chips
        search = norm(' '.join([idea['name'], idea['text'], idea['query'], *(CAT_LABELS[c] for c in idea['cats'])]))
        attrs = (f' data-ages="{" ".join(idea["ages"])}" data-budget="{idea["budget"]}" data-cats="{" ".join(idea["cats"])}"'
                 f' data-office="{1 if idea["office"] else 0}" data-search="{esc(search)}"')
    return f'''<div class="idea"{attrs}>
  <h3>{esc(idea['name'])}</h3>
  <p>{esc(idea['text'])}</p>
  <p class="tags">{esc(tag_line(idea))}</p>
  {amazon_link(idea['query'])}
</div>'''


CAT_ICONS = {'naschen': '🍪', 'gemuetlich': '☕', 'spiele': '🎲', 'kreativ': '✂️', 'technik': '🎧', 'lustig': '😄'}


def chip_ico(field, v):
    return f'<span class="ico" aria-hidden="true">{CAT_ICONS[v]}</span>' if field == 'mag' and v in CAT_ICONS else ''


def chip_group(label, field, options, with_all=True):
    chips = [f'<button type="button" class="chip" data-f="{field}" data-v="" aria-pressed="true">Alle</button>'] if with_all else []
    chips += [f'<button type="button" class="chip" data-f="{field}" data-v="{v}" aria-pressed="false">{chip_ico(field, v)}{esc(t)}</button>'
              for v, t in options]
    return (f'<div class="f-group" role="group" aria-label="{esc(label)}"><span class="f-label">{esc(label)}</span>'
            f'{"".join(chips)}</div>')


def finder_page():
    who = list(AGE_LABELS.items()) + [('office', 'Kollegen')]
    cards = '\n'.join(idea_card(i, data=True) for i in IDEAS)
    body = f'''<article>
<h1>Geschenkfinder fürs Wichteln</h1>
<p class="lead">{len(IDEAS)} Geschenkideen für Kinder, Teenager, Erwachsene und Kollegen – filtere nach Alter, Budget und dem, was die beschenkte Person mag.</p>
<div class="card finder">
  <label class="f-search">Wonach suchst du?
    <input id="f-q" type="search" placeholder="z. B. Tee, Basteln, Socken" autocomplete="off">
  </label>
  {chip_group('Für wen?', 'fuer', who)}
  {chip_group('Budget', 'budget', [(str(b), f'bis {b} €') for b in BUDGETS])}
  {chip_group('Mag gern', 'mag', list(CAT_LABELS.items()), with_all=False)}
  <p class="f-foot"><span id="f-count" aria-live="polite">{len(IDEAS)} Ideen</span> · <button type="button" id="f-reset" class="link-btn">Filter zurücksetzen</button></p>
</div>
<p id="f-amazon-box" class="f-amazon" hidden>Nicht das Richtige dabei? <a id="f-amazon" href="{esc(amazon_url('Wichtelgeschenk'))}" rel="sponsored nofollow noopener" target="_blank">Bei Amazon suchen*</a></p>
<h2 class="sr-only">Alle Geschenkideen</h2>
<div id="f-results" class="idea-grid">
{cards}
</div>
<p class="hint">Bei Geschenken für Kinder bitte die Altersangabe auf der Verpackung beachten, zum Beispiel wegen verschluckbarer Kleinteile.</p>
<p class="disclosure">* Werbelinks: Die Links führen zu passenden Suchergebnissen bei Amazon. Kaufst du darüber ein, erhalten wir eine kleine Provision – für dich ändert sich am Preis nichts.</p>
{CTA}
</article>'''
    page('/geschenkfinder/', f'Geschenkfinder fürs Wichteln: {len(IDEAS)} Ideen nach Alter & Budget',
         'Wichtelgeschenke finden: nach Alter (Kind, Teenager, Erwachsene, Kollegen), Budget von 5 bis 30 Euro und Interessen filtern – mit über 100 Ideen.',
         body, extra='\n<script src="/assets/finder.js" defer></script>', crumb='Geschenkfinder', mascot='lupe')


def kids_page():
    def fits(idea, age):
        # Kinder: nur Kinder-Ideen und solche für alle Altersgruppen; Teenager: alles mit Teenager
        return age in idea['ages'] and (age == 'teen' or 'adult' not in idea['ages'] or len(idea['ages']) == 4)

    shown, sections = set(), []
    for age, title in (('k1', 'Für Kinder von 3 bis 7 Jahren'), ('k2', 'Für Kinder von 8 bis 12 Jahren'), ('teen', 'Für Teenager')):
        picks = [i for i in IDEAS if fits(i, age) and i['name'] not in shown][:12]
        shown.update(i['name'] for i in picks)
        cards = '\n'.join(idea_card(i) for i in picks)
        sections.append(f'''<h2>{esc(title)}</h2>
<div class="idea-grid">
{cards}
</div>
<p><a class="more-link" href="/geschenkfinder/?fuer={age}">Alle Ideen für {esc(AGE_LABELS[age])} im Geschenkfinder →</a></p>''')
    body = f'''<article>
<h1>Wichtelgeschenke für Kinder und Teenager</h1>
<p class="lead">Ob Kindergarten, Schulklasse, Sportverein oder Familie: Hier findest du Wichtelgeschenke, die zum Alter passen – von Seifenblasen für die Kleinen bis zum Escape-Spiel für Teenager.</p>
{CTA}
{chr(10).join(sections)}
<h2>Tipps fürs Wichteln mit Kindern</h2>
<ul>
  <li>Auf die Altersangabe auf der Verpackung achten – Spielzeug mit Kleinteilen ist nichts für die Kleinsten.</li>
  <li>In Schule und Kindergarten sind 3 bis 5 Euro üblich. Am besten legt die Gruppe das Budget vorher gemeinsam fest. Ablauf, Elternbrief und Lose ohne Handy: <a href="/wichteln-schule-kita/">Wichteln in Schule und Kita</a>.</li>
  <li>Zu Hause im Advent: Ideen und 24 Streiche für die <a href="/wichteltuer/">Wichteltür</a>.</li>
  <li>Bei Süßigkeiten an Allergien und Unverträglichkeiten denken.</li>
  <li>Kinder freuen sich oft mehr über etwas zum Spielen oder Basteln als über reine Deko.</li>
</ul>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, erhalten wir eine kleine Provision – für dich ändert sich am Preis nichts.</p>
</article>'''
    page('/wichtelgeschenke-fuer-kinder/', 'Wichtelgeschenke für Kinder: Ideen von 3 bis 12 & für Teens',
         'Wichtelgeschenke für Kinder und Teenager: passende Ideen für Kindergarten, Schule und Verein – sortiert nach Alter, mit Tipps zu Budget und Sicherheit.',
         body, crumb='Wichtelgeschenke für Kinder', mascot='geschenk', playful=True)


def diy_page():
    blocks = []
    for title, intro, material, steps, note, links in DIY:
        mats = '\n'.join(f'<li>{esc(m)}</li>' for m in material)
        stp = '\n'.join(f'<li>{esc(x)}</li>' for x in steps)
        note_html = f'<p class="hint">💡 {esc(note)}</p>' if note else ''
        link_html = ' · '.join(amazon_link(q, f'{t}*') for t, q in links)
        blocks.append(f'''<section class="card diy">
<h2>{esc(title)}</h2>
<p>{esc(intro)}</p>
<h3>Das brauchst du</h3>
<ul>
{mats}
</ul>
<h3>So geht's</h3>
<ol>
{stp}
</ol>
{note_html}
<p class="diy-links">Material: {link_html}</p>
</section>''')
    sets = [i for i in IDEAS if 'kreativ' in i['cats'] and ('teen' in i['ages'] or 'adult' in i['ages'])]
    cards = '\n'.join(idea_card(i) for i in sets)
    body = f'''<article>
<h1>Wichtelgeschenke selber machen</h1>
<p class="lead">Selbst gemachte Geschenke sind persönlich, günstig und kommen fast immer gut an. Diese {len(DIY)} Ideen gelingen auch ohne Bastel-Talent – die meisten in unter einer Stunde.</p>
{CTA}
{chr(10).join(blocks)}
<h2>Bastelsets für gemütliche Abende</h2>
<p>Lieber Zeit verschenken als selbst basteln? Diese Sets sorgen für entspannte Winterabende – zum Selbermachen für die beschenkte Person.</p>
<div class="idea-grid">
{cards}
</div>
<p><a class="more-link" href="/geschenkfinder/?mag=kreativ">Alle Bastel- und Kreativ-Ideen im Geschenkfinder →</a></p>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, erhalten wir eine kleine Provision – für dich ändert sich am Preis nichts.</p>
</article>'''
    page('/wichtelgeschenke-selber-machen/', f'Wichtelgeschenke selber machen: {len(DIY)} Ideen mit Anleitung',
         'Wichtelgeschenke selber machen: Backmischung im Glas, Badesalz, gebrannte Mandeln und mehr – einfache Anleitungen plus Bastelsets für gemütliche Abende.',
         body, crumb='Wichtelgeschenke selber machen')


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
  <li><b>Im Büro:</b> Wie ihr das Wichteln im Team organisiert – Budget, Regeln, Homeoffice –, steht unter <a href="/wichteln-im-buero/">Wichteln im Büro</a>.</li>
</ul>

<h2>Tipps für eine gelungene Runde</h2>
<ul>
  <li>Unterschiedliche Verpackungsgrößen machen das Spiel spannender – ein kleines Päckchen kann das beste Geschenk sein.</li>
  <li>Die Regeln vorher einmal laut vorlesen oder ausgedruckt auf den Tisch legen.</li>
  <li>Bei Kindern den Timer kürzer stellen, etwa auf 5 Minuten.</li>
</ul>
{supplies_block()}
<div class="ad-slot">Anzeige (Platzhalter)</div>
<div class="cta-box">
  <p>Lieber klassisch wichteln, ohne Würfel? Die Namen lassen sich online in einer Minute auslosen.</p>
  <a class="btn-primary" href="/">Wichteln auslosen</a>
</div>
</article>'''
    page('/wichteln-wuerfeln-regeln/', 'Wichteln mit Würfeln: Regeln, Ablauf & Varianten',
         'Wichteln mit Würfeln: Die Regeln für jede Zahl, der Ablauf in zwei Runden und beliebte Varianten wie „ohne Auspacken“ – mit Druckversion.', body,
         crumb='Wichteln mit Würfeln', mascot='wuerfel')


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
<p>Am beliebtesten ist Schrottwichteln mit Würfeln: Erst werden die Päckchen verteilt, dann mit Timer getauscht. Die genauen Regeln findest du unter <a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a>. Alternativ lost ihr einfach aus, wer wem ein Päckchen schenkt. Mehr Tipps fürs Team: <a href="/wichteln-im-buero/">Wichteln im Büro</a>.</p>
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
    page('/schrottwichteln/', 'Schrottwichteln: Regeln & 24 lustige Ideen fürs Büro',
         'Schrottwichteln: Die Regeln, der Ablauf mit Würfeln und 24 lustige Ideen aus Kitsch, Werbegeschenken und Retro-Fundstücken – kostenlos und nachhaltig.', body,
         crumb='Schrottwichteln', mascot='wuerfel')


def office_page():
    n_office = sum(1 for i in IDEAS if i['office'])
    body = f'''<article>
<h1>Wichteln im Büro: Regeln, Budget und Ablauf</h1>
<p class="lead">Büro-Wichteln ist der Klassiker vor Weihnachten: Jeder im Team beschenkt eine Kollegin oder einen Kollegen, ausgelost per Los. Mit ein paar klaren Regeln wird es für alle entspannt – auch für die, die sich kaum kennen oder im Homeoffice arbeiten.</p>

<h2>In 4 Schritten zum Büro-Wichteln</h2>
<ol>
  <li><b>Budget festlegen:</b> Im Büro sind 10 Euro üblich, manchmal 5 oder 15 Euro. Wichtig ist, dass es für alle gleich ist und niemand unter Druck gerät.</li>
  <li><b>Datum festlegen:</b> Meist die Weihnachtsfeier oder der letzte Arbeitstag vor den Feiertagen. Zum Einsammeln der Namen eignet sich unsere <a href="/wichteln-einladung-vorlage/">Einladung mit Teilnehmerliste zum Aushängen</a>.</li>
  <li><b>Online auslosen:</b> Namen eintragen, auf Wunsch Paare ausschließen (zum Beispiel Teamleitung und Stellvertretung) und jedem seinen geheimen Link schicken – per WhatsApp, Teams-Chat oder E-Mail.</li>
  <li><b>Bescherung:</b> Geschenke einsammeln und gemeinsam auspacken – oder per Würfelspiel verteilen.</li>
</ol>
{CTA}

<h2>Die wichtigsten Regeln</h2>
<ul>
  <li><b>Freiwillig:</b> Wer nicht mitmachen möchte, muss nicht – und muss es auch nicht begründen.</li>
  <li><b>Neutral bleiben:</b> Nichts Anzügliches, nichts Politisches, keine Witze auf Kosten anderer.</li>
  <li><b>Lieber unpersönlich als peinlich:</b> Wer die beschenkte Person kaum kennt, liegt mit Naschereien, etwas für den Schreibtisch oder Gemütlichem fast immer richtig.</li>
  <li><b>Budget einhalten:</b> Deutlich teurere Geschenke setzen die anderen unter Druck.</li>
  <li><b>Alkohol nur, wenn es passt:</b> Im Zweifel lieber alkoholfrei – nicht jeder trinkt.</li>
</ul>

<h2>Wichteln im Homeoffice oder mit verteiltem Team</h2>
<p>Bei WichtelLos muss niemand vor Ort sein: Jeder öffnet seinen Link auf dem eigenen Handy oder Rechner. Die Geschenke schickt ihr per Post an die Privatadresse oder ins Büro und packt sie gemeinsam im Videocall aus. Tipp: Ein Budget inklusive Versand vereinbaren.</p>

<h2>Spiel-Varianten fürs Team</h2>
<ul>
  <li><a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a>: Päckchen werden erwürfelt und getauscht – perfekt für die Weihnachtsfeier.</li>
  <li><a href="/schrottwichteln/">Schrottwichteln</a>: Jeder bringt etwas Kurioses von zu Hause mit – kostet nichts und sorgt für Lacher.</li>
  <li><b>Klassisch:</b> Jeder zieht per Los genau eine Person und besorgt ein Geschenk im vereinbarten Budget.</li>
</ul>

{supplies_block()}

<h2>Ideen für die Weihnachtsfeier</h2>
<p>Vom Weihnachtsmarkt mit Wichtel-Twist bis zur Online-Feier: <a href="/weihnachtsfeier-ideen/">10 Weihnachtsfeier-Ideen fürs Team</a>. Für die Karte zum Geschenk gibt es <a href="/wichtelgedichte/">kurze Wichtelgedichte</a>.</p>

<h2>Geschenkideen für Kollegen</h2>
<p>Im Geschenkfinder findest du {n_office} bürotaugliche Ideen: <a class="more-link" href="/geschenkfinder/?fuer=office">Alle Ideen für Kollegen ansehen →</a></p>
<p>Nach Budget: <a href="/wichtelgeschenke-unter-5-euro/">unter 5 Euro</a> · <a href="/wichtelgeschenke-unter-10-euro/">unter 10 Euro</a> · <a href="/wichtelgeschenke-unter-15-euro/">unter 15 Euro</a> · <a href="/wichtelgeschenke-unter-20-euro/">unter 20 Euro</a></p>
</article>'''
    page('/wichteln-im-buero/', 'Wichteln im Büro: Regeln, Budget & Ablauf fürs Team',
         'Büro-Wichteln organisieren: übliches Budget, faire Regeln, Ablauf im Homeoffice, Spiel-Varianten und Ideen für Kollegen – mit kostenloser Online-Auslosung.', body,
         crumb='Wichteln im Büro', mascot='geschenk')


def school_page():
    body = f'''<article>
<h1>Wichteln in der Schulklasse und Kita: so klappt's</h1>
<p class="lead">Wichteln mit Kindern macht riesig Spaß – wenn das Auslosen fair ist und keiner leer ausgeht. Hier findest du den Ablauf für Klasse, Kita und Verein, ein faires Budget, einen Elternbrief zum Kopieren und Wichtel-Lose, für die kein Kind ein Handy braucht.</p>

<h2>Ablauf in 5 Schritten</h2>
<ol>
  <li><b>Eltern informieren:</b> Kurz per Elternbrief oder in der Eltern-WhatsApp-Gruppe Budget und Datum ankündigen (Vorlage unten).</li>
  <li><b>Namen eintragen:</b> Alle Kinder <a href="/">bei WichtelLos eintragen</a>. Geschwister in derselben Gruppe kannst du unter „Ausschlüsse“ trennen.</li>
  <li><b>Auslosen und Lose drucken:</b> Nach dem Auslosen auf „Lose anzeigen und drucken“ tippen und <b>„Ohne Handy – für Kinder“</b> wählen. Außen steht der Name des Kindes, innen, wen es beschenkt.</li>
  <li><b>Lose verteilen:</b> Ausschneiden, falten, zukleben und jedem Kind sein eigenes Los geben – das Öffnen ist der schönste Moment. Wer das Los verliert, bekommt es einfach neu ausgedruckt.</li>
  <li><b>Bescherung:</b> Geschenke an einem festen Tag mitbringen, im Sitzkreis verteilen und gemeinsam auspacken.</li>
</ol>
{CTA}

<h2>Lose ohne Handy – der Unterschied</h2>
<p>Ältere Schüler und Erwachsene scannen bei WichtelLos einen QR-Code oder bekommen einen Link aufs Handy. Für Kita und Grundschule gibt es die Druck-Variante <b>„Ohne Handy“</b>: Der Name des Wichtel-Partners steht direkt innen auf dem Los, auf Wunsch mit einem Tipp wie „malt gern“. So zieht jedes Kind sein eigenes Los wie früher aus dem Hut – nur dass niemand sich selbst erwischt und Geschwister nicht zusammen landen.</p>
<p>Tipp: dickeres Papier nehmen oder das Los zweimal falten, dann scheint der Name nicht durch.</p>

<h2>Welches Budget ist fair?</h2>
<ul>
  <li><b>Kita und Grundschule:</b> 3 bis 5 Euro. So können alle Familien mitmachen.</li>
  <li><b>Weiterführende Schule:</b> 5 bis 10 Euro.</li>
  <li><b>Selbst gemacht zählt doppelt:</b> Gebasteltes, Gebackenes oder ein selbst bemalter Stein sind willkommen. Ideen: <a href="/wichtelgeschenke-selber-machen/">Wichtelgeschenke selber machen</a>.</li>
  <li><b>Für Familien, die sich das Geschenk nicht leisten können:</b> Am besten still ein paar Ersatzgeschenke aus der Klassenkasse bereithalten.</li>
</ul>
<p>Passende Ideen nach Alter: <a href="/wichtelgeschenke-fuer-kinder/">Wichtelgeschenke für Kinder</a> · <a href="/wichtelgeschenke-unter-5-euro/">unter 5 Euro</a></p>

<h2>Elternbrief zum Kopieren</h2>
<blockquote class="letter">
<p>Liebe Eltern,</p>
<p>in der Adventszeit wollen wir in der Klasse wichteln: Jedes Kind beschenkt ein anderes Kind, das es per Los zieht. Das Los bringt Ihr Kind am [Datum] mit nach Hause – bitte erst zu Hause gemeinsam öffnen und das Geheimnis nicht verraten.</p>
<p>Das Geschenk sollte höchstens [3–5] Euro kosten, gern auch selbst gebastelt oder gebacken. Bitte bringen Sie es bis zum [Datum] eingepackt und mit dem Namen des beschenkten Kindes in die Schule mit.</p>
<p>Wenn Ihr Kind nicht mitmachen kann oder möchte, geben Sie uns bitte bis zum [Datum] kurz Bescheid.</p>
<p>Vielen Dank und eine schöne Adventszeit!</p>
</blockquote>
<p class="hint">Allergien im Blick behalten: Bei Süßigkeiten bitte vorher in der Elterngruppe nachfragen.</p>

<h2>Spiele für die Bescherung</h2>
<ul>
  <li><a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a>: Bei Kindern den Timer auf etwa 5 Minuten kürzen, damit niemand ungeduldig wird.</li>
  <li><b>Wichtel-Raten:</b> Jedes Kind darf dreimal raten, von wem sein Geschenk ist.</li>
</ul>
<p>Zum Einsammeln der Anmeldungen im Lehrerzimmer oder Verein: <a href="/wichteln-einladung-vorlage/">Einladung mit Teilnehmerliste zum Aushängen</a>.</p>
</article>'''
    page('/wichteln-schule-kita/', 'Wichteln in Schulklasse & Kita: Ablauf, Budget, Lose',
         'Wichteln mit Kindern in Klasse, Kita und Verein: Ablauf, faires Budget, Elternbrief zum Kopieren und Wichtel-Lose zum Ausdrucken ohne Handy – kostenlos.', body,
         crumb='Wichteln in Schule und Kita', mascot='geschenk', playful=True)


SUPPLIES = [
    ('„Von deinem Wichtel“-Anhänger', 'Damit das Geschenk anonym bleibt.', 'Geschenkanhänger Wichtel Weihnachten'),
    ('Großer Schaumstoff-Würfel', 'Für Würfelwichteln – gut sichtbar für alle.', 'Schaumstoffwürfel groß'),
    ('Wichtelmützen', 'Zipfelmützen für die Bescherung, gibt es im Set.', 'Wichtelmütze Set Erwachsene'),
    ('Geschenktüten aus Kraftpapier', 'Schnell verpackt, alle Päckchen sehen gleich aus.', 'Geschenktüten Kraftpapier Weihnachten'),
]


def supplies_block():
    cards = '\n'.join(f'''<div class="idea">
  <h3>{esc(t)}</h3>
  <p>{esc(x)}</p>
  {amazon_link(q, 'Bei Amazon ansehen*')}
</div>''' for t, x, q in SUPPLIES)
    return f'''<h2>Das brauchst du noch für die Bescherung</h2>
<div class="idea-grid">
{cards}
</div>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, erhalten wir eine kleine Provision – für dich ändert sich am Preis nichts.</p>'''


DOOR_PLAN = [
    ('Einzug', 'Die Tür steht plötzlich an der Fußleiste. Davor: ein Begrüßungsbrief und winzige Fußspuren aus Puderzucker.'),
    ('Frühstücksgruß', 'Auf jedem Teller liegt ein Gummibärchen – in Reih und Glied.'),
    ('Sockengirlande', 'Der Wichtel hat Socken quer durchs Wohnzimmer aufgehängt.'),
    ('Kuscheltier-Picknick', 'Alle Kuscheltiere sitzen im Kreis und teilen sich Kekskrümel.'),
    ('Schneemann-Rolle', 'Eine Klopapierrolle ist über Nacht zum Schneemann geworden.'),
    ('Nikolaus', 'Die Stiefel sind geputzt – und daneben liegt ein Mini-Brief vom Wichtel.'),
    ('Stau im Flur', 'Alle Spielzeugautos stehen hintereinander im Stau, mit Wichtel als Verkehrspolizist.'),
    ('Schnee-Engel', 'Auf einem Teller mit Mehl ist ein winziger Schnee-Engel zu sehen.'),
    ('Mützen-Tag', 'Alle Zahnbürsten tragen Mini-Mützen aus Bastelfilz.'),
    ('Ups!', 'Bilder hängen schief, daneben ein Zettel: „Ups! War keine Absicht.“'),
    ('Rätselpost', 'Der Wichtel schickt ein kleines Rätsel, das zu einer Süßigkeit führt.'),
    ('Werkstatt', 'Bausteine sind zu einer Mini-Werkstatt vor der Tür geworden.'),
    ('Bunte Milch', 'Die Milch ist plötzlich grün – ein Tropfen Lebensmittelfarbe reicht.'),
    ('Mini-Tannenbaum', 'Vor der Wichteltür steht ein geschmückter Mini-Baum.'),
    ('Schuh-Chaos', 'Alle Schuhe stehen paarweise vertauscht.'),
    ('Waschtag', 'Eine Mini-Wäscheleine mit winzigen Kleidern hängt vor der Tür.'),
    ('Bastelwunsch', 'Der Wichtel bittet um einen gemalten Stern für sein Zimmer.'),
    ('Schaumbad', 'Der Wichtel badet im Spülbecken – in Mini-Marshmallows.'),
    ('Lesestunde', 'Bücher sind zum Turm gestapelt, oben sitzt der Wichtel und liest.'),
    ('Backstube', 'Vor der Tür liegen Mini-Plätzchen, überall sind Krümel.'),
    ('Laser-Labyrinth', 'Wollfäden sind kreuz und quer im Türrahmen gespannt – wer kommt durch?'),
    ('Wunschzettel', 'Der Wichtel hat einen Wunschzettel für sich selbst geschrieben.'),
    ('Koffer packen', 'Ein Mini-Koffer steht vor der Tür – der Abschied naht.'),
    ('Abschied', 'Die Tür ist verschlossen. Zurück bleiben ein Abschiedsbrief und eine kleine Überraschung.'),
]

DOOR_SHOP = [
    ('Wichteltür-Set', 'Tür mit Zubehör wie Leiter, Briefkasten und Fußmatte.', 'Wichteltür Set'),
    ('Wichtel-Figur', 'Der Bewohner selbst – meist mit Zipfelmütze und Bart.', 'Wichtel Figur Wichteltür'),
    ('Mini-Zubehör', 'Möbel, Werkzeug und Lebensmittel im Puppenhaus-Format.', 'Wichtel Zubehör Miniatur'),
    ('Wichtel-Briefpapier', 'Winzige Briefe und Umschläge für die Wichtel-Post.', 'Wichtel Briefpapier Mini'),
    ('Mini-Lichterkette', 'Batteriebetrieben, für die Wichteltür bei Nacht.', 'Mini Lichterkette Batterie warmweiß'),
    ('Buch mit Wichtel-Streichen', 'Noch mehr Ideen für die 24 Tage.', 'Wichtel Streiche Buch'),
]


def door_page():
    plan = '\n'.join(f'<li><b>{i}. Dezember – {esc(t)}:</b> {esc(x)}</li>' for i, (t, x) in enumerate(DOOR_PLAN, 1))
    shop = '\n'.join(f'''<div class="idea">
  <h3>{esc(t)}</h3>
  <p>{esc(x)}</p>
  {amazon_link(q, 'Bei Amazon ansehen*')}
</div>''' for t, x, q in DOOR_SHOP)
    body = f'''<article>
<h1>Wichteltür: Ideen, 24 Streiche und Zubehör</h1>
<p class="lead">Ab dem 1. Dezember zieht ein Wichtel ein: Eine kleine Tür an der Fußleiste, jede Nacht ein neuer Streich – und am Morgen große Augen. Hier findest du, wie du die Wichteltür startest, einen fertigen Plan für alle 24 Tage, einen Begrüßungsbrief und das passende Zubehör.</p>

<h2>Was ist eine Wichteltür?</h2>
<p>Die Wichteltür ist ein Adventsbrauch aus Skandinavien, der bei uns seit einigen Jahren immer beliebter wird. Eine Miniatur-Tür wird an die Wand oder Fußleiste gestellt – dahinter wohnt im Advent ein Wichtel. Er bleibt unsichtbar, schreibt Briefe, stellt nachts kleinen Unfug an und verabschiedet sich an Heiligabend wieder. Mit dem <a href="/">Wichteln unter Erwachsenen</a> hat das wenig zu tun, aber beides lebt vom selben Zauber: Jemand tut heimlich etwas Schönes.</p>

<h2>So startest du</h2>
<ol>
  <li><b>Platz wählen:</b> Eine ruhige Ecke an der Fußleiste, gut sichtbar für die Kinder, aber nicht im Weg.</li>
  <li><b>Einzug vorbereiten:</b> Am Abend des 30. November die Tür aufstellen, Fußspuren aus Puderzucker streuen und den Begrüßungsbrief davorlegen.</li>
  <li><b>Regeln erzählen:</b> Viele Familien erzählen, dass der Wichtel nur nachts aktiv ist und seine Tür nicht geöffnet werden darf – so bleibt das Geheimnis gewahrt.</li>
  <li><b>Jeden Abend 5 Minuten:</b> Mit dem Plan unten musst du nicht täglich neu überlegen.</li>
</ol>

<h2>Der Begrüßungsbrief</h2>
<blockquote class="letter">
<p>Hallo, ihr Lieben!</p>
<p>Ich bin [Name], euer Wichtel. Ich bin heute Nacht bei euch eingezogen, weil es hier so gemütlich ist. Bis Weihnachten wohne ich hinter meiner kleinen Tür. Ihr werdet mich nie sehen, aber ihr werdet merken, dass ich da bin – ich habe nämlich viel Quatsch im Kopf!</p>
<p>Wenn ihr mir schreiben wollt, legt einen Brief vor meine Tür. Ich antworte, so oft ich kann.</p>
<p>Euer Wichtel 🧡</p>
</blockquote>
<p class="hint">Tipp: Mit winziger Schrift oder am Computer in kleiner Schrift schreiben, auf ein kleines Stück Papier – das wirkt echt. Weitere Reime findest du bei den <a href="/wichtelgedichte/">Wichtelgedichten</a>.</p>

<h2>24 Wichtel-Streiche: der Plan für den Advent</h2>
<p><button type="button" class="btn-secondary" data-print>🖨️ Plan drucken</button></p>
<ol class="door-plan">
{plan}
</ol>
<p class="hint">Sicherheit geht vor: Bei kleinen Kindern keine verschluckbaren Kleinteile verwenden, Fäden nicht in Stolperhöhe spannen und Lebensmittelfarbe nur tropfenweise nehmen.</p>

<h2>Zubehör für die Wichteltür</h2>
<div class="idea-grid">
{shop}
</div>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, erhalten wir eine kleine Provision – für dich ändert sich am Preis nichts.</p>

<h2>Und für die Großen: Wichteln in der Familie</h2>
<p>Während der Wichtel bei den Kindern Quatsch macht, können die Erwachsenen selbst wichteln: Namen eintragen, auslosen, jeder bekommt seinen geheimen Link – kostenlos und ohne Anmeldung.</p>
{CTA}
<p>Passende Geschenke für Kinder: <a href="/wichtelgeschenke-fuer-kinder/">Wichtelgeschenke für Kinder</a> · In Kita und Schule: <a href="/wichteln-schule-kita/">Wichteln in Schule und Kita</a></p>
</article>'''
    page('/wichteltuer/', 'Wichteltür: Ideen, 24 Streiche & Zubehör für den Advent',
         'Wichteltür für Kinder: So startest du, Begrüßungsbrief zum Abschreiben, ein fertiger Plan mit 24 Wichtel-Streichen für den Advent und das passende Zubehör.', body,
         crumb='Wichteltür', mascot='geschenk', playful=True)


def party_page():
    body = f'''<article>
<h1>Weihnachtsfeier-Ideen fürs Team: 10 Ideen, die gut ankommen</h1>
<p class="lead">Ob kleines Team oder ganze Abteilung: Eine gute Weihnachtsfeier braucht keinen großen Aufwand – aber einen Plan, der zu euch passt. Hier sind 10 Ideen vom Weihnachtsmarkt bis zur Online-Feier, plus Tipps zu Planung und Budget.</p>

<h2>Unterwegs</h2>
<ol>
  <li><b>Weihnachtsmarkt mit Wichtel-Twist:</b> Ihr lost vorher aus, wer wen „bewichtelt“ – und auf dem Markt zahlt jeder seinem Wichtel einen Glühwein, eine Bratwurst oder gebrannte Mandeln. Kostet wenig, bringt alle ins Gespräch.</li>
  <li><b>Glühwein- oder Fackelwanderung:</b> Eine kurze Runde durch Park oder Wald, unterwegs Punsch aus der Thermoskanne. Ideal für Teams, die sonst nur am Schreibtisch sitzen.</li>
  <li><b>Stadtführung im Advent:</b> Viele Städte bieten Nachtwächter-, Laternen- oder Weihnachtsführungen an – oft mit Abschluss auf dem Weihnachtsmarkt.</li>
  <li><b>Eisstockschießen oder Schlittschuhlaufen:</b> Wintersport light, den auch Ungeübte schaffen. Im Anschluss geht es zum Essen.</li>
</ol>

<h2>Drinnen</h2>
<ol start="5">
  <li><b>Escape-Room:</b> Rätseln im Team, meist 4 bis 6 Personen pro Raum. Größere Gruppen spielen parallel gegeneinander.</li>
  <li><b>Krimidinner:</b> Essen und Mitraten – jeder bekommt eine Rolle. Gibt es als Event im Restaurant oder als Spiel für zu Hause.</li>
  <li><b>Gemeinsam kochen oder Plätzchen backen:</b> Kochkurs buchen oder einfach die Büroküche nutzen. Was entsteht, wird gleich gegessen.</li>
  <li><b>Bowling oder Kegeln:</b> Unkompliziert, für jedes Alter, und die Bahn lässt sich meist kurzfristig reservieren.</li>
</ol>

<h2>Im Büro oder online</h2>
<ol start="9">
  <li><b>Büro-Feier mit Wichtel-Spiel:</b> Essen bestellen, Musik an und als Höhepunkt <a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a> oder <a href="/schrottwichteln/">Schrottwichteln</a>. Das Auslosen erledigt ihr vorher <a href="/">online in 1 Minute</a>.</li>
  <li><b>Online-Feier fürs Homeoffice:</b> Wichtelgeschenke per Post verschicken und gemeinsam im Videocall auspacken, dazu ein Weihnachts-Quiz. Mehr dazu unter <a href="/wichteln-im-buero/">Wichteln im Büro</a>.</li>
</ol>
{CTA}
{supplies_block()}

<h2>Tipps für die Planung</h2>
<ul>
  <li><b>Früh buchen:</b> Im Dezember sind Restaurants, Escape-Rooms und Führungen schnell ausgebucht – am besten schon im November reservieren.</li>
  <li><b>Termin per Umfrage finden:</b> Zwei, drei Termine zur Wahl stellen und die Mehrheit entscheiden lassen.</li>
  <li><b>Für alle passend:</b> Alkoholfreie Getränke und vegetarisches Essen einplanen, auf Barrierefreiheit achten.</li>
  <li><b>Budget klären:</b> Vorher sagen, was die Firma übernimmt und was jeder selbst zahlt – zum Beispiel das Wichtelgeschenk.</li>
  <li><b>Freiwillig bleibt freiwillig:</b> Wer nicht mitkommen kann oder will, muss sich nicht rechtfertigen.</li>
</ul>
<p>Für die Anmeldung im Büro: <a href="/wichteln-einladung-vorlage/">Einladung mit Teilnehmerliste zum Aushängen</a>. Für die Geschenk-Karte: <a href="/wichtelgedichte/">Wichtelgedichte</a>.</p>
</article>'''
    page('/weihnachtsfeier-ideen/', 'Weihnachtsfeier-Ideen fürs Team: 10 Ideen & Tipps',
         'Weihnachtsfeier im Team planen: 10 Ideen vom Weihnachtsmarkt mit Wichtel-Twist über Escape-Room bis zur Online-Feier – plus Tipps zu Termin und Budget.', body,
         crumb='Weihnachtsfeier-Ideen', mascot='winkt')


POEMS = [
    ('Für alle', 'Ein Wichtel kam auf leisen Sohlen,\nhat sich hier rein- und rausgestohlen.\nEr ließ dir dies Geschenk zurück\nund wünscht dir ganz viel Weihnachtsglück.'),
    ('Für alle', 'Wer mich gebracht hat, bleibt geheim,\ndrum schick ich nur den kleinen Reim:\nPack aus, freu dich und rate weiter –\ndein Wichtel grinst und bleibt ganz heiter.'),
    ('Für Kollegen', 'Montagmorgen, Stapel hoch,\nder Drucker streikt mal wieder doch –\nda kommt ein Wichtel, leis und sacht,\nund hat dir dieses mitgebracht.'),
    ('Für Kollegen', 'Zwischen Meeting, Mail und Kaffee\ndacht ich heimlich nur an dich.\nHier ein kleines Wichtelpäckchen –\nwer es war? Das sag ich nicht.'),
    ('Für die Familie', 'Die ganze Sippe sitzt beisammen,\nder Baum, der glänzt, die Kerzen flammen.\nUnd einer hier – du rätst es kaum –\nhat dir gewichtelt unterm Baum.'),
    ('Für Kinder', 'Ich bin ein Wichtel, klitzeklein,\nund pack dir was Besonderes ein.\nWer ich bin? Das bleibt geheim –\nich schick dir nur den Wichtelreim.'),
    ('Für Kinder', 'Rate, rate, wer ich bin!\nHalt dein Ohr ans Päckchen hin.\nHörst du es kichern, leis und fein?\nDas muss dein Wichtel sein!'),
    ('Fürs Schrottwichteln', 'Ich fand es tief im Keller drin,\nes hat zwar keinen tiefern Sinn,\ndoch eins ist sicher, glaub es mir:\nJetzt ist es deins – und nicht mehr hier!'),
    ('Fürs Schrottwichteln', 'Es staubte jahrelang im Schrank,\njetzt bist du dran – hab vielen Dank!\nBehalt es gut, verschenk es weiter,\ndas Wichteln macht das Leben heiter.'),
]


def poems_page():
    cards = '\n'.join(f'<figure class="poem"><figcaption>{esc(k)}</figcaption><p>{esc(t).replace(chr(10), "<br>")}</p></figure>' for k, t in POEMS)
    body = f'''<article>
<h1>Wichtelgedichte: kurze Reime für die Geschenk-Karte</h1>
<p class="lead">Ein kleiner Reim macht aus jedem Wichtelgeschenk etwas Besonderes – und verrät trotzdem nicht, von wem es kommt. Hier findest du kurze Wichtelgedichte für Kollegen, Familie, Kinder und Schrottwichteln, dazu einen Generator für einen persönlichen Reim.</p>

<h2>Persönlichen Wichtel-Reim erstellen</h2>
<div class="card poem-gen">
  <div class="row2">
    <label>Name<input id="pg-name" maxlength="30" placeholder="z. B. Anna"></label>
    <label>Mag gern …<input id="pg-like" maxlength="30" placeholder="z. B. Kaffee"></label>
  </div>
  <p id="pg-out" class="poem-out"></p>
  <div class="row2">
    <button type="button" id="pg-next" class="btn-secondary">🔄 Anderer Reim</button>
    <button type="button" id="pg-copy" class="btn-primary">📋 Reim kopieren</button>
  </div>
  <p class="hint">Alles passiert nur in deinem Browser – nichts wird gespeichert.</p>
</div>

<h2>Fertige Wichtelgedichte</h2>
<div class="poems">
{cards}
</div>
{CTA}

<h2>Tipps für die Wichtel-Karte</h2>
<ul>
  <li><b>Nicht mit Namen unterschreiben</b> – „Dein Wichtel“ reicht. Wer mag, gibt einen kleinen Hinweis zum Raten.</li>
  <li><b>Handschrift verstellen</b> oder den Reim ausdrucken, sonst ist das Geheimnis schnell gelüftet.</li>
  <li><b>Zum Geschenk passend:</b> Beim <a href="/schrottwichteln/">Schrottwichteln</a> darf es frech sein, bei Kollegen lieber freundlich und neutral.</li>
</ul>
<p>Noch kein Geschenk? <a href="/geschenkfinder/">Im Geschenkfinder nach Alter und Budget suchen →</a></p>
</article>
<script>
(() => {{
  const T = [
    (n, x) => `Für ${{n}}, denn ${{x}} ist dein Ding,\\nein Päckchen, das ich heimlich bring.\\nWer ich bin? Das bleibt geheim –\\ndein Wichtel schickt dir diesen Reim.`,
    (n, x) => `Hallo ${{n}}! Ich weiß Bescheid:\\n${{x[0].toUpperCase() + x.slice(1)}} macht dir Freude jederzeit.\\nDrum hab ich gesucht und auch gefunden –\\nviel Spaß damit in frohen Stunden!`,
    (n, x) => `Ho, ho, ho, ${{n}}, schau mal her:\\nein Wichtelpäckchen, gar nicht schwer.\\nUnd weil du ${{x}} so gerne hast,\\nhoff ich, dass es zu dir passt.`,
  ];
  let i = 0;
  const $ = (s) => document.querySelector(s);
  const render = () => {{
    const n = $('#pg-name').value.trim() || 'Anna', x0 = $('#pg-like').value.trim() || 'Kaffee', x = x0[0].toUpperCase() + x0.slice(1);
    $('#pg-out').textContent = T[i % T.length](n, x);
  }};
  $('#pg-name').addEventListener('input', render);
  $('#pg-like').addEventListener('input', render);
  $('#pg-next').addEventListener('click', () => {{ i++; render(); }});
  $('#pg-copy').addEventListener('click', async () => {{
    try {{ await navigator.clipboard.writeText($('#pg-out').textContent); $('#pg-copy').textContent = '✅ Kopiert'; }}
    catch {{ $('#pg-copy').textContent = 'Bitte markieren und kopieren'; }}
    setTimeout(() => {{ $('#pg-copy').textContent = '📋 Reim kopieren'; }}, 2000);
  }});
  render();
}})();
</script>'''
    page('/wichtelgedichte/', 'Wichtelgedichte: kurze Reime für die Wichtel-Karte',
         'Kurze Wichtelgedichte für die Geschenk-Karte: Reime für Kollegen, Familie, Kinder und Schrottwichteln – plus Generator für deinen persönlichen Wichtel-Reim.', body,
         crumb='Wichtelgedichte', mascot='geschenk', playful=True)


def history_page():
    body = f'''<article>
<h1>Woher kommt Wichteln? Wichtel, Julklapp und Secret Santa</h1>
<p class="lead">Jeder zieht einen Namen, beschenkt diese Person heimlich – und erst bei der Bescherung wird geraten, wer wen hatte. Wichteln kennt man in Deutschland in fast jedem Büro und jeder Familie. Aber woher kommt der Brauch, und warum heißt er so?</p>

<h2>Der Name: kleine Helfer aus dem Volksglauben</h2>
<p>Wichtel sind im alten Volksglauben kleine, meist unsichtbare Hausgeister. Sie erledigen nachts heimlich Arbeiten oder bringen Glück – und wollen dabei nicht gesehen werden. Genau das ist der Kern des Wichtelns: Jemand tut dir etwas Gutes, und du weißt nicht, wer es war. Verwandte Figuren sind die Heinzelmännchen aus Köln und der skandinavische Nisse oder Tomte, der bis heute zu Weihnachten gehört – und der als <a href="/wichteltuer/">Wichtel hinter der Wichteltür</a> auch bei uns im Advent einzieht.</p>

<h2>Der Vorläufer: Julklapp</h2>
<p>Julklapp ist ein alter Weihnachtsbrauch aus Skandinavien und Norddeutschland. „Jul“ steht für das Weihnachtsfest, „klapp“ für das Klopfen an der Tür: Ein Geschenk wurde heimlich ins Haus geworfen, oft mehrfach verpackt, und der Schenkende verschwand, bevor jemand öffnete. Der Beschenkte musste raten, von wem es kam. Im Norden sagen manche bis heute „Julklapp“, wenn sie Wichteln meinen.</p>

<h2>Wichteln in anderen Ländern</h2>
<ul>
  <li><b>Secret Santa</b> heißt das Spiel in englischsprachigen Ländern – „geheimer Weihnachtsmann“.</li>
  <li><b>Engerl-Bengerl</b> sagt man vor allem in Bayern und Österreich: Wer gezogen hat, ist das „Engerl“ für sein „Bengerl“.</li>
  <li><b>White Elephant</b> oder Yankee Swap ist die amerikanische Spielart, bei der Geschenke getauscht und „geklaut“ werden – ähnlich wie <a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a>.</li>
</ul>

<h2>Wichteln heute</h2>
<p>Aus dem Brauch ist ein fester Teil der Adventszeit geworden: im Büro, in der Familie, im Verein und in der <a href="/wichteln-schule-kita/">Schulklasse</a>. Statt Zettel aus dem Hut lost man heute oft online aus – so zieht niemand sich selbst, und auch wer nicht vor Ort ist, kann mitmachen. Beliebte Varianten sind <a href="/schrottwichteln/">Schrottwichteln</a> mit kuriosen Fundstücken und das Würfelspiel auf der <a href="/weihnachtsfeier-ideen/">Weihnachtsfeier</a>.</p>
{CTA}
<p>Passende Reime für die Karte: <a href="/wichtelgedichte/">Wichtelgedichte</a> · Ideen fürs Geschenk: <a href="/geschenkfinder/">Geschenkfinder</a></p>
</article>'''
    page('/woher-kommt-wichteln/', 'Woher kommt Wichteln? Julklapp, Secret Santa & Co.',
         'Woher kommt der Brauch des Wichtelns? Wichtel im Volksglauben, der Julklapp aus Skandinavien und Norddeutschland, Secret Santa und Engerl-Bengerl kurz erklärt.', body,
         crumb='Woher kommt Wichteln?', mascot='lupe')


def invite_page():
    qr = (SRC / 'grafik' / 'qr-wichtellos.svg').read_text(encoding='utf-8').strip()
    qr = qr.replace('<svg ', '<svg class="poster-qr" aria-hidden="true" ', 1)
    lines = '\n'.join('<li><span></span></li>' for _ in range(20))
    body = f'''<article>
<div class="no-print">
<h1>Wichteln Einladung: Vorlage zum Aushängen</h1>
<p class="lead">Aushang mit Teilnehmerliste für Büro, Lehrerzimmer, Verein oder Treppenhaus: ausdrucken, Datum und Budget eintragen, aufhängen – wer mitmachen will, schreibt sich ein. Ausgelost wird danach in 1 Minute online.</p>
<p><button type="button" class="btn-primary" onclick="window.print()">🖨️ Vorlage drucken</button></p>
</div>

<div class="poster">
  <img class="poster-mascot" src="/grafik/wichtel-geschenk.svg" alt="" width="120" height="152">
  <p class="poster-kicker">Achtung, Wichtel-Alarm! 🎁</p>
  <h2 class="poster-title">Wir wichteln!</h2>
  <div class="poster-fields">
    <p>Bescherung am: <span></span></p>
    <p>Budget: <span class="short"></span> €</p>
    <p>Eintragen bis: <span></span></p>
  </div>
  <p class="poster-sub">Wer macht mit? Einfach Namen eintragen:</p>
  <ol class="poster-list">
{lines}
  </ol>
  <div class="poster-foot">
    {qr}
    <p><b>Ausgelost wird online mit wichtellos.de</b><br>Jeder bekommt seinen geheimen Link aufs Handy. Wer sich drückt, bekommt Schrott. 😉</p>
  </div>
</div>

<div class="no-print">
<h2>So geht's</h2>
<ol>
  <li><b>Drucken</b> und Datum, Budget sowie den Anmeldeschluss eintragen.</li>
  <li><b>Aufhängen</b> – in der Kaffeeküche, im Lehrerzimmer oder am Schwarzen Brett.</li>
  <li><b>Namen abtippen</b> und auf <a href="/">wichtellos.de</a> auslosen. Jeder bekommt seinen geheimen Link per WhatsApp – oder ihr druckt <b>Wichtel-Lose mit QR-Code</b> zum Verteilen.</li>
</ol>
{CTA}
<p>Mehr Tipps fürs Team: <a href="/wichteln-im-buero/">Wichteln im Büro</a> · Spielideen: <a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a> und <a href="/schrottwichteln/">Schrottwichteln</a></p>
</div>
</article>'''
    page('/wichteln-einladung-vorlage/', 'Wichteln Einladung: Vorlage zum Aushängen (kostenlos)',
         'Kostenlose Wichteln-Einladung zum Ausdrucken: Aushang mit Teilnehmerliste für Büro, Schule und Verein. Danach in 1 Minute online auslosen.', body,
         crumb='Einladung zum Aushängen', body_class='poster-page')


# ---------- Rechtliches (Entwürfe) ----------

COMPANY = ('KOLL Commerce UG (haftungsbeschränkt)<br>Leuchtenfabrik · Haus A, 1. Etage<br>'
           'Edisonstraße 63<br>12459 Berlin<br>Deutschland')


def legal_pages():
    impressum = f"""<article>
<h1>Impressum</h1>
<h2>Angaben gemäß § 5 DDG</h2>
<p>{COMPANY}</p>
<p>Vertreten durch den Geschäftsführer: Antonio Koll</p>
<h2>Kontakt</h2>
<p>E-Mail: <a href="mailto:kollcommerce@mailbox.org">kollcommerce@mailbox.org</a><br>Telefon: +49 151 29522767</p>
<h2>Registereintrag</h2>
<p>Amtsgericht Charlottenburg, HRB 277995 B</p>
<h2>Umsatzsteuer-ID</h2>
<p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE457547328</p>
<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
<p>Antonio Koll, Anschrift wie oben</p>
<h2>Hinweis zu Werbelinks</h2>
<p>Diese Website enthält Affiliate-Links, die mit einem Sternchen (*) gekennzeichnet sind. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
</article>"""
    page('/impressum/', 'Impressum | WichtelLos', 'Impressum von WichtelLos.', impressum, noindex=True)

    datenschutz = f"""<article>
<h1>Datenschutzerklärung</h1>
<h2>1. Verantwortlicher</h2>
<p>{COMPANY}<br>E-Mail: <a href="mailto:kollcommerce@mailbox.org">kollcommerce@mailbox.org</a></p>

<h2>2. Das Wichtigste in Kürze</h2>
<p>Wir verarbeiten so wenig Daten wie möglich. Es gibt kein Benutzerkonto, keine Analyse- oder Tracking-Werkzeuge und wir setzen keine Cookies.</p>

<h2>3. Hosting und Server-Protokolle</h2>
<p>Diese Website wird über GitHub Pages bereitgestellt, einen Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf einer Seite verarbeitet GitHub technisch notwendige Daten, insbesondere die IP-Adresse, aufgerufene Seite, Zeitpunkt des Zugriffs und Browserangaben, um die Website sicher und stabil auszuliefern und Angriffe abzuwehren. Wir selbst erhalten diese Daten nicht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in der sicheren und zuverlässigen Bereitstellung der Website.</p>
<p>Dabei können Daten in die USA übermittelt werden. GitHub ist nach dem EU-US Data Privacy Framework zertifiziert (Angemessenheitsbeschluss der EU-Kommission, Art. 45 DSGVO); ergänzend verwendet GitHub Standardvertragsklauseln. Näheres in der Datenschutzerklärung von GitHub: <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">docs.github.com</a>.</p>
<p>Die Domain wird bei der IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, verwaltet (Namensauflösung, DNS).</p>

<h2>4. Die Wichtel-Auslosung</h2>
<p>Namen, Tipps zu einzelnen Personen, Gruppenname, Budget, Datum und Nachricht, die du in das Formular einträgst, werden ausschließlich in deinem Browser verarbeitet. Die Zuteilung wird codiert in den persönlichen Links gespeichert, und zwar im Teil nach dem #-Zeichen. Diesen Teil überträgt der Browser beim Aufruf nicht an unseren Server – wir erhalten von den Namen und Zuteilungen keine Kenntnis.</p>
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
</article>"""
    page('/datenschutz/', 'Datenschutzerklärung | WichtelLos', 'Datenschutzerklärung von WichtelLos.', datenschutz, noindex=True)


BUDGET_LINKS = ', '.join(f'<a href="/wichtelgeschenke-unter-{b}-euro/">{b}</a>' for b in GIFT_BUDGETS[:-1]) + \
    f' und <a href="/wichtelgeschenke-unter-{GIFT_BUDGETS[-1]}-euro/">{GIFT_BUDGETS[-1]}</a>'

# Sichtbare FAQ und FAQPage-Daten kommen aus dieser einen Liste (Antworten dürfen Links enthalten)
FAQ = [
    ('Was ist Wichteln?', 'Beim Wichteln beschenkt jeder genau eine andere Person aus der Gruppe, die per Los bestimmt wird. Wer wen beschenkt, bleibt bis zur Bescherung geheim. Beliebt im Büro, in der Familie, im Freundeskreis und in der Schule.'),
    ('Was ist ein Wichtelgenerator?', 'Ein Wichtelgenerator (auch Wichtel-Generator oder Losgenerator) lost automatisch aus, wer wen beschenkt – zufällig, fair und ohne Zettelziehen. WichtelLos ist so ein Wichtelgenerator: kostenlos, ohne Anmeldung und mit geheimem Link für jede Person.'),
    ('Wichteln, Julklapp, Secret Santa – was ist der Unterschied?', 'Keiner: Es sind verschiedene Namen für dasselbe Spiel. Julklapp sagt man vor allem in Norddeutschland und Skandinavien, Secret Santa ist der englische Name. Auslosen könnt ihr alle Varianten hier. Mehr zur Geschichte: <a href="/woher-kommt-wichteln/">Woher kommt Wichteln?</a>'),
    ('Wie funktioniert Wichteln online?', 'Namen eintragen, auslosen, fertig. Jede Person bekommt einen eigenen Link. Wer ihn öffnet, sieht nur, wen er selbst beschenkt.'),
    ('Muss ich mich anmelden?', 'Nein. Weder du noch die anderen brauchen ein Konto oder eine E-Mail-Adresse.'),
    ('Wie viele Personen können mitmachen?', 'Ab 3 und bis zu 60 Personen – vom kleinen Freundeskreis bis zum großen Team oder Verein.'),
    ('Sieht der Organisator, wer wen zieht?', 'Nur, wenn er fremde Links öffnet. Tipp: Wer selbst mitmacht, öffnet einfach nur den eigenen Link – dann bleibt es auch für ihn eine Überraschung.'),
    ('Werden unsere Namen gespeichert?', 'Nicht auf unserem Server. Die Zuteilung steckt codiert im Link selbst, im Teil nach dem #-Zeichen – den schickt der Browser nicht an den Server. Damit nichts verloren geht, merkt sich nur dein eigener Browser deinen Entwurf und die zuletzt erzeugten Links.'),
    ('Kann ich Wünsche oder Tipps für den Wichtel hinterlegen?', 'Ja. Tippe neben einem Namen auf „💡 Tipp“ und notiere z. B. „mag Tee, liebt Katzen“. Den Tipp sieht nur, wer diese Person zieht – zusammen mit passenden Geschenkideen. Auch Tipps stecken nur im Link und landen nicht auf unserem Server.'),
    ('Kann ich die Wichtel-Lose ausdrucken?', 'Ja. Nach dem Auslosen auf „Lose anzeigen und drucken“ tippen: Jede Person bekommt ein Los mit ihrem Namen außen und einem QR-Code innen. Ausschneiden, falten, verteilen – wer seinen Code scannt, sieht, wen er beschenkt. Die QR-Codes entstehen direkt in deinem Browser. Für Kinder ohne Handy gibt es Lose mit dem Namen innen, mehr unter <a href="/wichteln-schule-kita/">Wichteln in Schule und Kita</a>.'),
    ('Können Paare ausgeschlossen werden?', 'Ja. Unter „Ausschlüsse“ legst du fest, wer wen nicht ziehen darf – in beide Richtungen.'),
    ('Kann ich jemanden nachträglich hinzufügen?', 'Ja: Person ergänzen, neu auslosen und allen die neuen Links schicken. Die alten Links funktionieren weiter und zeigen die alte Auslosung – deshalb wirklich allen die neuen Links schicken.'),
    ('Was passiert, wenn jemand seinen Link verliert?', 'Öffne WichtelLos auf dem Gerät, auf dem du ausgelost hast, und tippe auf „Letzte Auslosung wieder anzeigen“. Dort kannst du den Link erneut verschicken.'),
    ('Wie viel sollte ein Wichtelgeschenk kosten?', f'Häufig sind es 5 bis 20 Euro, im Büro meist 10 Euro. Wichtig ist, dass sich alle vorher auf ein Budget einigen. Ideen findest du bei unseren Wichtelgeschenken unter {BUDGET_LINKS} Euro.'),
    ('Funktioniert das auch für Wichteln im Büro oder per Videocall?', 'Ja. Die Links funktionieren auf jedem Handy und Computer, niemand muss vor Ort sein. Ideal auch für Teams im Homeoffice. Tipps zu Budget, Regeln und Ablauf findest du unter <a href="/wichteln-im-buero/">Wichteln im Büro</a>.'),
    ('Ist WichtelLos wirklich kostenlos?', 'Ja, komplett. Wir finanzieren uns über Werbelinks zu Geschenkideen. Für dich ändert sich am Preis nichts.'),
]

HOW_TO = [
    ('Namen eintragen', 'Gruppe anlegen, alle Teilnehmer eintragen, auf Wunsch Budget und Datum dazu.'),
    ('Auslosen', 'Ein Klick, und jeder bekommt einen eigenen geheimen Link. Paare, die sich nicht ziehen sollen, schließt du vorher aus.'),
    ('Links verschicken', 'Per WhatsApp, E-Mail oder kopieren. Jeder sieht nur, wen er selbst beschenkt.'),
]


def faq_html():
    steps = '\n'.join(f'      <li><b>{esc(h)}</b> – {esc(x)}</li>' for h, x in HOW_TO)
    items = '\n'.join(f'      <details><summary>{esc(q)}</summary>\n        <p>{a}</p></details>' for q, a in FAQ)
    return f'''    <section class="how">
      <h2>So funktioniert's</h2>
      <ol>
{steps}
      </ol>
    </section>

    <section class="faq">
      <h2>Häufige Fragen</h2>
{items}
    </section>'''


def tool_page():
    # Schema-Text = sichtbarer Text ohne HTML-Tags, wörtlich
    faq = {
        '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
            {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': re.sub(r'<[^>]+>', '', a)}}
            for q, a in FAQ]}
    app = {'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'WichtelLos', 'url': DOMAIN + '/',
           'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Alle',
           'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'EUR'}, 'publisher': ORG}
    site = {'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'WichtelLos', 'url': DOMAIN + '/',
            'inLanguage': 'de-DE', 'publisher': ORG}
    extra = ld(app, faq, site)
    html = (SRC / 'tool.html').read_text(encoding='utf-8')
    html = html.replace('<!--HEAD-->', head('Wichteln online auslosen – kostenloser Wichtelgenerator',
                                             'Kostenloser Wichtelgenerator: in 1 Minute auslosen, geheime Links per WhatsApp, Tipps für den Wichtel und Lose mit QR-Code zum Ausdrucken. Ohne Anmeldung.',
                                             '/', extra))
    gift = (SRC / 'grafik' / 'wichtel-geschenk.svg').read_text(encoding='utf-8').strip()
    gift = gift.replace('<svg ', '<svg class="mascot-reveal" aria-hidden="true" width="120" height="152" ', 1)
    html = html.replace('<!--WICHTEL-GESCHENK-->', gift)
    html = html.replace('<!--HEADER-->', HEADER).replace('<!--FOOTER-->', FOOTER).replace('<!--FAQ-->', faq_html())
    (OUT / 'index.html').write_text(html, encoding='utf-8')


def extras():
    page('/404/', 'Seite nicht gefunden | WichtelLos', 'Diese Seite gibt es nicht.',
         pose_img('schlaeft', 'mascot-reveal') + '<h1>Seite nicht gefunden 😕</h1><p>Diese Seite gibt es leider nicht – unser Wichtel hat sie wohl versteckt.</p><p><a class="btn-primary" href="/">Zur Wichtel-Auslosung</a></p>',
         noindex=True)
    shutil.move(OUT / '404' / 'index.html', OUT / '404.html')
    (OUT / '404').rmdir()
    urls = ['/'] + [f'/wichtelgeschenke-unter-{b}-euro/' for b in GIFT_BUDGETS] + ['/geschenkfinder/', '/wichtelgeschenke-fuer-kinder/', '/wichtelgeschenke-selber-machen/', '/wichteln-wuerfeln-regeln/', '/schrottwichteln/', '/wichteln-im-buero/', '/wichteln-schule-kita/', '/weihnachtsfeier-ideen/', '/wichtelgedichte/', '/woher-kommt-wichteln/', '/wichteltuer/', '/wichteln-einladung-vorlage/']
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        f'  <url><loc>{DOMAIN}{u}</loc><lastmod>{TODAY}</lastmod></url>\n' for u in urls) + '</urlset>\n'
    (OUT / 'sitemap.xml').write_text(sitemap, encoding='utf-8')
    # IONOS liefert http und www sonst parallel aus (Duplicate Content) – www immer weg, http nur mit FORCE_HTTPS
    host = DOMAIN.split('://')[1]
    rules = ('RewriteCond %{HTTPS} !=on [OR]\n'
             'RewriteCond %{HTTP_HOST} ^www\\. [NC]\n'
             f'RewriteRule ^ {DOMAIN}%{{REQUEST_URI}} [R=301,L]\n') if FORCE_HTTPS else (
             'RewriteCond %{HTTP_HOST} ^www\\. [NC]\n'
             f'RewriteRule ^ http://{host}%{{REQUEST_URI}} [R=301,L]\n')
    (OUT / '.htaccess').write_text('ErrorDocument 404 /404.html\n\nRewriteEngine On\n' + rules, encoding='utf-8')
    (OUT / f'{INDEXNOW_KEY}.txt').write_text(INDEXNOW_KEY, encoding='utf-8')
    manifest = {'name': 'WichtelLos – Wichteln online auslosen', 'short_name': 'WichtelLos', 'lang': 'de',
                'start_url': '/', 'display': 'standalone', 'background_color': '#fff8f0', 'theme_color': '#c62828',
                'icons': [{'src': '/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
                          {'src': '/icon-512.png', 'sizes': '512x512', 'type': 'image/png'}]}
    (OUT / 'site.webmanifest').write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding='utf-8')
    (OUT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n', encoding='utf-8')


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / 'assets').mkdir(parents=True)
    for f in ('style.css', 'finder.js', 'qrcode.js'):
        shutil.copy(SRC / 'assets' / f, OUT / 'assets' / f)
    site_js = (SRC / 'assets' / 'site.js').read_text(encoding='utf-8')
    site_js = site_js.replace("const AMAZON_TAG = '';", f"const AMAZON_TAG = '{AMAZON_TAG}';")
    (OUT / 'assets' / 'site.js').write_text(site_js, encoding='utf-8')
    shutil.copytree(SRC / 'grafik', OUT / 'grafik')
    shutil.copytree(SRC / 'og', OUT / 'og')
    shutil.copytree(SRC / 'assets' / 'fonts', OUT / 'assets' / 'fonts')
    for f in ('favicon.svg', 'favicon.ico', 'favicon-48.png', 'favicon-96.png', 'icon-192.png', 'icon-512.png',
              'wichtel.svg', 'og-image.png', 'apple-touch-icon.png'):
        if (SRC / f).exists():
            shutil.copy(SRC / f, OUT / f)
    tool_page()
    for b in GIFT_BUDGETS:
        gift_page(b)
    finder_page()
    kids_page()
    diy_page()
    dice_page()
    scrap_page()
    office_page()
    school_page()
    party_page()
    poems_page()
    history_page()
    door_page()
    invite_page()
    legal_pages()
    extras()
    print('Fertig:', sorted(str(p.relative_to(OUT)) for p in OUT.rglob('*') if p.is_file()))


if __name__ == '__main__':
    main()
