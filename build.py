"""Baut die statische Seite WichtelLos in den Ordner, der als erstes Argument übergeben wird."""
import json
import re
import shutil
import sys
from html import escape as esc
from urllib.parse import quote, urlencode
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
       'logo': DOMAIN + '/apple-touch-icon.png', 'email': 'wichtellos@mailbox.org',
       'sameAs': ['https://www.instagram.com/wichtellos/', 'https://www.pinterest.com/wichtellos/',
                  'https://www.tiktok.com/@wichtellos', 'https://www.youtube.com/@WichtelLos']}


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
<meta name="verification" content="1b3d44aa7b1afafc944017ae0319ee36">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96">
<link rel="manifest" href="/site.webmanifest">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/fredoka-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/style.css">{extra}'''


HEADER = '''<header class="top"><div class="bar">
  <a class="logo" href="/"><img src="/favicon.svg" alt="" width="26" height="26"><span>Wichtel<b>Los</b></span></a>
  <nav aria-label="Hauptmenü">
    <a class="nav-hi" href="/geschenkfinder/"><span class="nav-l">🎁 Geschenkideen</span><span class="nav-k"><i>🎁</i>Geschenkideen</span></a>
    <a href="/geschenke-generator/"><span class="nav-l">🎲 Geschenke-Generator</span><span class="nav-k"><i>🎲</i>Generator</span></a>
    <a href="/wichtelgeschenke-unter-10-euro/"><span class="nav-l">Nach Budget</span><span class="nav-k"><i>💶</i>Nach Budget</span></a>
    <a href="/wichtel-zubehoer/"><span class="nav-l">Wichtel-Zubehör</span><span class="nav-k"><i>✨</i>Zubehör</span></a>
    <a href="/wichtelgeschenke-fuer-kinder/"><span class="nav-l">Für Kinder</span><span class="nav-k"><i>🧸</i>Für Kinder</span></a>
    <a class="nav-shop" href="/wichtel-tassen/"><span class="nav-l">☕ Tassen &amp; Shirts</span><span class="nav-k"><i>☕</i>Tassen &amp; Shirts</span></a>
  </nav>
  <button type="button" class="search-btn" aria-label="Suche öffnen" aria-expanded="false" aria-controls="search-panel" title="Suchen">
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>
  </button>
</div>
<div id="search-panel" class="search-panel" hidden>
  <div class="search-inner" role="search">
    <label for="search-q" class="sr-only">Suche auf WichtelLos</label>
    <input id="search-q" type="search" autocomplete="off" placeholder="Suchen: z. B. Büro, Kinder, 10 €, Socken …"
      role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="search-list">
    <button type="button" class="search-close" aria-label="Suche schließen">✕</button>
    <ul id="search-list" class="search-list" role="listbox" aria-label="Suchtreffer"></ul>
    <p class="search-empty" hidden>Nichts gefunden – probier ein anderes Wort oder den <a href="/geschenkfinder/">Geschenkfinder</a>.</p>
  </div>
</div></header>'''

FOOTER = '''<footer>
  <p class="kofi"><a class="kofi-btn" href="https://ko-fi.com/wichtellos" rel="noopener" target="_blank">💛 WichtelLos unterstützen</a><br><span class="kofi-sub">Freiwillig – hilft, WichtelLos kostenlos zu halten.</span></p>
  <nav class="footer-groups" aria-label="Alle Seiten">
    <details class="fgroup"><summary>Wichteln organisieren</summary><ul><li><a href="/">Wichteln auslosen</a></li><li><a href="/wichteln-per-whatsapp/">Wichteln per WhatsApp</a></li><li><a href="/wichteln-einladung-vorlage/">Einladung zum Aushängen</a></li><li><a href="/wunschzettel/">Wunschzettel</a></li><li><a href="/wichtelgruss/">Wichtelgruß verschicken</a></li><li><a href="/wichtelgedichte/">Wichtelgedichte</a></li></ul></details>
    <details class="fgroup"><summary>Geschenkideen</summary><ul><li><a href="/geschenke-generator/">Geschenke-Generator</a></li><li><a href="/geschenkfinder/">Geschenkfinder</a></li><li><a href="/black-friday-wichtelgeschenke/">Black Friday</a></li><li><a href="/wichtelgeschenke-unter-10-euro/">Wichtelgeschenke</a></li><li><a href="/wichtelgeschenke-fuer-kinder/">Für Kinder</a></li><li><a href="/wichtelgeschenke-selber-machen/">Selbst gemacht</a></li><li><a href="/geschenke-fuer-maenner/">Für Männer</a></li><li><a href="/geschenke-fuer-frauen/">Für Frauen</a></li><li><a href="/rubbellos/">Rubbellos verschicken</a></li><li><a href="/wichtel-tassen/">Wichtel-Tassen</a></li></ul></details>
    <details class="fgroup"><summary>Spiele &amp; Anlässe</summary><ul><li><a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a></li><li><a href="/schrottwichteln/">Schrottwichteln</a></li><li><a href="/wichteln-im-buero/">Wichteln im Büro</a></li><li><a href="/wichteln-schule-kita/">Schule &amp; Kita</a></li><li><a href="/weihnachtsfeier-ideen/">Weihnachtsfeier-Ideen</a></li><li><a href="/woher-kommt-wichteln/">Woher kommt Wichteln?</a></li><li><a href="/wie-funktioniert-wichteln/">Wie funktioniert Wichteln?</a></li><li><a href="/was-ist-ein-wichtel/">Was ist ein Wichtel?</a></li><li><a href="/wichteln-varianten/">Wichtel-Varianten</a></li><li><a href="/wichteln-zu-dritt/">Wichteln zu dritt</a></li><li><a href="/wichteln-per-post/">Wichteln per Post</a></li></ul></details>
    <details class="fgroup"><summary>Kinder &amp; Advent</summary><ul><li><a href="/wichteltuer/">Wichteltür</a></li><li><a href="/onni-adventskalender/">Onnis Adventskalender</a></li><li><a href="/wichtel-ausmalbilder/">Ausmalbilder</a></li><li><a href="/wichtel-zubehoer/">Wichtel-Zubehör</a></li><li><a href="/adventskalender-ideen/">Adventskalender-Ideen</a></li><li><a href="/adventskalender-befuellen/">Adventskalender befüllen</a></li><li><a href="/nikolaus-geschenke/">Nikolaus-Geschenke</a></li></ul></details>
  </nav>
  <p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
  <p class="social">Folge uns: <!--SOCIAL--></p>
  <p class="legal">© 2026 WichtelLos · Powered by KOLL Commerce · <a href="/impressum/">Impressum</a> · <a href="/datenschutz/">Datenschutz</a></p>
</footer>'''

# Eigene schlichte Symbole (inline-SVG, currentColor, nichts von fremden Servern) – Toni 06.11.
_SV = '<svg class="ico" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
ICONS = {
    'instagram': _SV + '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>',
    'pinterest': _SV + '<circle cx="12" cy="12" r="9.5"/><path d="M11 20.5l1.6-7"/><path d="M9.6 13.3c-1-1.6-.4-4.4 2.2-5.1 2.8-.8 5 1 4.4 3.8-.5 2.3-2.6 3.3-4.2 2.4"/></svg>',
    'tiktok': _SV + '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.4 4.6 5 4.8"/></svg>',
    'youtube': _SV + '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.3l5 2.7-5 2.7z" fill="currentColor"/></svg>',
    'whatsapp': _SV + '<path d="M4 20l1.3-3.8A8.5 8.5 0 1 1 8 19z"/></svg>',
    'mail': _SV + '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>',
    'link': _SV + '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
}
SOCIAL = [('instagram', 'Instagram', 'https://www.instagram.com/wichtellos/'),
          ('pinterest', 'Pinterest', 'https://www.pinterest.com/wichtellos/'),
          ('tiktok', 'TikTok', 'https://www.tiktok.com/@wichtellos'),
          ('youtube', 'YouTube', 'https://www.youtube.com/@WichtelLos')]


def social_links(nur=None):
    return '\n    '.join(f'<a class="soc" href="{u}" rel="noopener" target="_blank">{ICONS[k]}<span>{n}</span></a>'
                           for k, n, u in SOCIAL if not nur or k in nur)


FOOTER = FOOTER.replace('<!--SOCIAL-->', social_links())

# Unterstützen-Zeile unter Gratis-Downloads (einmal pro Seite, dezent – Toni 03.11.)
KOFI_LINE = ('<p class="kofi-line">Gefällt dir das? <a class="kofi-btn" href="https://ko-fi.com/wichtellos" rel="noopener" target="_blank">'
             '💛 WichtelLos unterstützen</a><br><span class="kofi-sub">Freiwillig – hilft, WichtelLos kostenlos zu halten.</span></p>')

CTA = '''<div class="cta-box">
  <div class="cta-text"><img class="mascot-small" src="/fotos/onni/sticker-winkt.webp" alt="" width="512" height="512" loading="lazy"><p>Noch nicht ausgelost? Wichtelgruppe in 1 Minute erstellen – kostenlos und ohne Anmeldung.</p></div>
  <a class="btn-primary" href="/">Jetzt auslosen</a>
</div>'''


# Wichtel-Posen in grafik/: Datei -> (Breite, Höhe) fürs img-Tag
POSES = {'winkt': (132, 152), 'geschenk': (120, 152), 'lupe': (132, 152), 'wuerfel': (132, 152), 'schlaeft': (152, 162)}


def pose_img(pose, cls='page-mascot'):
    w, h = POSES[pose]
    return f'<img class="{cls}" src="/grafik/wichtel-{pose}.svg" alt="" width="{w}" height="{h}">'


# Fotos in fotos/ (Unsplash-Lizenz, selbst gehostet -> keine Anfrage an Unsplash beim Seitenaufruf)
def photo(name, sizes, alt, author, url, cls='photo'):
    (w1, h1), (w2, h2) = sizes
    return (f'<figure class="{cls}"><img src="/fotos/{name}-{w2}.webp" srcset="/fotos/{name}-{w1}.webp {w1}w, /fotos/{name}-{w2}.webp {w2}w" '
            f'sizes="(max-width: 720px) 100vw, 680px" width="{w2}" height="{h2}" alt="{esc(alt)}" loading="lazy" decoding="async">'
            f'<figcaption>Foto: <a href="{url}" rel="nofollow noopener" target="_blank">{esc(author)} / Unsplash</a></figcaption></figure>')


# 3D-Plüsch-Wichtel (KI-generiert mit Google Gemini/Flow, Standbilder aus marketing/reel/wichtel3d/), Hochformat 2:3
def ai_photo(name, alt, sizes=((480, 720), (800, 1200)), cls='photo photo-ai'):
    (w1, h1), (w2, h2) = sizes
    return (f'<figure class="{cls}"><img src="/fotos/{name}-{w2}.webp" srcset="/fotos/{name}-{w1}.webp {w1}w, /fotos/{name}-{w2}.webp {w2}w" '
            f'sizes="' + ('(max-width: 600px) 150px, 220px' if 'photo-ai' in cls else '(max-width: 720px) 100vw, 680px') + f'" width="{w2}" height="{h2}" alt="{esc(alt)}" loading="{'eager' if 'photo-ai' in cls else 'lazy'}" decoding="async">'
            f'<figcaption>Bild: KI-generiert</figcaption></figure>')


# Erklärvideo mit 3D-Wichtel (marketing/reel/reel-wichtel3d.mp4, fürs Web 540x960 ~2 MB): lädt erst nach Klick (site.js, data-video)
VIDEO = {'src': '/fotos/wichtel3d-video.mp4', 'poster': '/fotos/wichtel3d-video-poster.webp', 'dauer': 'PT26S', 'datum': '2026-11-02'}


def video_block(v=None):
    # v: dict mit src/poster/label/alt/caption; ohne v = Erklärvideo der Startseite. Video lädt erst beim Klick (data-video, site.js), kein YouTube.
    v = v or {**VIDEO, 'label': 'Wichteln in 25 Sekunden erklärt', 'alt': 'Plüsch-Wichtel hält einen Umschlag – Wichteln? Ganz simpel.',
              'caption': 'So geht’s in 25 Sekunden · KI-generiert'}
    return (f'<figure class="video-wichtel"><button type="button" data-video="{v['src']}" '
            f'aria-label="Video abspielen: {v['label']}">'
            f'<img src="{v['poster']}" width="540" height="960" alt="{v['alt']}" loading="lazy" decoding="async">'
            f'<span class="play" aria-hidden="true">▶</span></button>'
            f'<figcaption>{v['caption']}</figcaption></figure>')


# Erklärvideos (Toni 08.11.): direkt bei uns statt YouTube-Einbettung – Besucher bleiben auf der Seite, keine Daten an Google
VIDEO_ERKLAERT = {'src': '/fotos/video-wichteln-erklaert.mp4', 'poster': '/fotos/video-wichteln-erklaert-poster.webp',
                  'label': 'Was ist Wichteln? Woher kommt der Brauch?', 'alt': 'Plüsch-Wichtel in einer Werkstatt, darüber die Frage „Was ist Wichteln?“',
                  'caption': 'Was ist Wichteln? Einfach erklärt in 2 Minuten · Bilder und Stimme KI-generiert'}
VIDEO_KINDER = {'src': '/fotos/video-wichtel-kinder.mp4', 'poster': '/fotos/video-wichtel-kinder-poster.webp',
                'label': 'Was ist ein Wichtel? Für Kinder erklärt', 'alt': 'Kleiner Plüsch-Wichtel Onni neben einem Tannenzapfen im Schnee',
                'caption': 'Was ist ein Wichtel? Für Kinder erklärt (2:42) · Bilder und Stimme KI-generiert'}

# Erklärungen in zwei Fassungen (Toni 08.11.): für Große (Wichteln) und für kleine Kinder (Wichtel, zum Vorlesen).
# Kindertext folgt dem Kindervideo – keine Sagen/Heinzelmännchen. Video-Links nur auf eigene Seiten, kein YouTube.
ERKL_GROSS = ('Wichteln ist ein Geschenke-Brauch in der Adventszeit: Jeder in der Gruppe zieht per Los einen Namen und beschenkt genau '
              'diese Person – heimlich und meist mit einem kleinen Geschenk zu einem vorher vereinbarten Budget. Wer wen beschenkt, bleibt '
              'bis zur Bescherung geheim. Den Namen hat der Brauch von den Wichteln: kleinen Hausgeistern, die heimlich Gutes tun und nie '
              'gesehen werden wollen. Ein Vorläufer ist der Julklapp aus Schweden und Norddeutschland.')
ERKL_KIND = ('Ein Wichtel ist ganz klein – nur so groß wie eine Kaffeetasse. Er trägt eine rote Zipfelmütze, die ihm fast über die Augen '
             'rutscht, und mag es kuschelig warm. Wichtel wohnen heimlich bei uns Menschen, manche sogar hinter einer winzigen Tür. Nachts, '
             'wenn alle schlafen, räumen sie auf, flicken Socken und bringen Glück – und manchmal machen sie ein bisschen Quatsch. Gesehen '
             'hat noch nie jemand einen. Denn das ist das größte Geheimnis der Wichtel: Sie wollen nie gesehen werden!')
LINK_GROSS = '<a href="/woher-kommt-wichteln/">▶ Das ganze Video: Was ist Wichteln? (2 Min.)</a>'
LINK_KIND = '<a href="/onni-adventskalender/#was-ist-ein-wichtel">▶ Video für Kinder: Was ist ein Wichtel? (2:42)</a>'


def erkl_box(art, titel=None, link=True):
    """Kasten „Was ist Wichteln?“ (art='gross') bzw. „Was ist ein Wichtel?“ (art='kind', zum Vorlesen)."""
    if art == 'gross':
        t, x, l = titel or 'Was ist Wichteln?', ERKL_GROSS, LINK_GROSS
    else:
        t, x, l = titel or 'Was ist ein Wichtel? – zum Vorlesen', ERKL_KIND, LINK_KIND
    return (f'<aside class="erkl erkl-{art}"><h3>{esc(t)}</h3>\n<p>{esc(x)}</p>'
            + (f'\n<p class="erkl-link">{l}</p>' if link else '') + '</aside>')


def video_ld():
    return {'@context': 'https://schema.org', '@type': 'VideoObject', 'name': 'Wichteln online auslosen – so geht’s in 25 Sekunden',
            'description': 'Namen eintragen, auslosen, jeder bekommt seinen geheimen Link per WhatsApp, E-Mail oder SMS – Geheimnis lüften und beschenken. Kostenlos, ohne Anmeldung.',
            'thumbnailUrl': DOMAIN + VIDEO['poster'], 'contentUrl': DOMAIN + VIDEO['src'], 'uploadDate': VIDEO['datum'], 'duration': VIDEO['dauer']}


SEARCH = []  # Suchindex: (Pfad, Titel, Beschreibung, Stichworte) – schreibt extras() nach /suche.json


def page(path, title, desc, body, extra='', noindex=False, crumb=None, mascot=None, playful=False, body_class=''):
    if not noindex:
        SEARCH.append({'u': path, 't': title.split(' | ')[0], 'd': desc, 'k': ' '.join(re.sub(r'<[^>]+>', '', h) for h in re.findall(r'<h[23][^>]*>(.*?)</h[23]>', body, re.S))})
    if mascot and 'photo-ai' not in body:  # 3D-Bild ersetzt den gezeichneten Wichtel
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



def product_links(q, asin=None):
    # Direktlink aufs Produkt + Suchlink als Rückfallebene, falls es mal ausverkauft ist
    if not asin:
        return amazon_link(q, 'Bei Amazon ansehen*')
    href = f'https://www.amazon.de/dp/{asin}' + (f'?tag={AMAZON_TAG}' if AMAZON_TAG else '')
    return (f'<a href="{esc(href)}" rel="sponsored nofollow noopener" target="_blank">Bei Amazon ansehen*</a>'
            f' <span class="alt-link">{amazon_link(q, "weitere Modelle*")}</span>')

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


def shop_card(data=False):
    """Karte „aus unserem Shop“ (Toni 09.11.: eigene Produkte = mehr Marge) – kein Werbe-Sternchen, Link auf /wichtel-tassen/."""
    attrs = (' data-ages="teen adult" data-budget="20" data-cats="lustig" data-office="1" '
             'data-search="wichtel tasse t-shirt shirt teddy spruch lustig shop buero kollegen"') if data else ''
    return f'''<div class="idea idea-shop"{attrs}>
  <p class="shop-badge">☕ Aus unserem Shop</p>
  <img src="/fotos/merch/tasse-14.webp" alt="Wichtel-Tasse „Wichtel-Champion“ mit dem WichtelLos-Wichtel" width="440" height="440" loading="lazy" decoding="async">
  <h3>Wichtel-Tasse mit Spruch</h3>
  <p>14 lustige Motive – auch als T-Shirt oder Teddy.</p>
  <a href="/wichtel-tassen/">Alle Motive ansehen</a>
</div>'''


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
        if budget >= 20 and not sections:  # eigener Shop (Toni 09.11.) – Tasse passt ab 20 €
            teile = cards.split('\n<div class="idea">')
            cards = '\n<div class="idea">'.join(teile[:2]) + '\n' + shop_card() + ''.join('\n<div class="idea">' + t for t in teile[2:])
        sections.append(f'<h2>{esc(name)}</h2>\n<div class="idea-grid">\n{cards}\n</div>')
    tips = '\n'.join(f'<li>{esc(t)}</li>' for t in g['tips'])
    body = f'''<article>
<h1>Wichtelgeschenke unter {budget} Euro</h1>
{ai_photo('wichtel3d-geschenk', 'Plüsch-Wichtel mit roter Zipfelmütze hält ein Geschenk mit roter Schleife vor dem Weihnachtsbaum')}
<p class="lead">{esc(g['intro'])}</p>
<div class="chips">
{chips}
</div>
<a class="bf-banner" href="/black-friday-wichtelgeschenke/" data-zeit-von="2026-11-16" data-zeit-bis="2026-12-01" hidden>🏷️ <b>Black Friday:</b> Wichtelgeschenke im Angebot <span aria-hidden="true">→</span></a>
<p class="hint">Lieber nach Alter und Interessen filtern? <a href="/geschenkfinder/?budget={budget}">Zum Geschenkfinder →</a> · Lieber 24 kleine Freuden? <a href="/adventskalender-ideen/">Adventskalender-Ideen →</a></p>
{CTA}
{chr(10).join(sections)}
<div class="ad-slot">Anzeige (Platzhalter)</div>
<h2>Tipps für Wichtelgeschenke unter {budget} Euro</h2>
<ul>
{tips}
</ul>
{'<p>Wichtelt ihr im Team? Budget, Regeln und Ablauf findest du unter <a href="/wichteln-im-buero/">Wichteln im Büro</a>.</p>' if budget <= 15 else ''}
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
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
    karten = [idea_card(i, data=True) for i in IDEAS]
    karten.insert(2, shop_card(data=True))  # eigener Shop (Toni 09.11.)
    cards = '\n'.join(karten)
    body = f'''<article>
<h1>Geschenkfinder fürs Wichteln</h1>
<p class="lead">{len(IDEAS)} Geschenkideen für Kinder, Teenager, Erwachsene und Kollegen – filtere nach Alter, Budget und dem, was die beschenkte Person mag.</p>
<div class="card finder">
  <label class="f-search">Wonach suchst du?
    <input id="f-q" type="search" placeholder="z. B. Tee, Basteln, Socken" autocomplete="off">
  </label>
  <details class="f-more" id="f-more">
    <summary><span class="f-sum">⚙️ Filter: Für wen · Budget · Mag gern</span><span id="f-active" class="f-active"></span></summary>
  {chip_group('Für wen?', 'fuer', who)}
  {chip_group('Budget', 'budget', [(str(b), f'bis {b} €') for b in BUDGETS])}
  {chip_group('Mag gern', 'mag', list(CAT_LABELS.items()), with_all=False)}
    <p class="f-show"><button type="button" id="f-show" class="btn-primary">Ideen ansehen</button></p>
  </details>
  <p class="f-foot"><span id="f-count" aria-live="polite">{len(IDEAS)} Ideen</span> · <button type="button" id="f-reset" class="link-btn">Filter zurücksetzen</button></p>
</div>
<p id="f-amazon-box" class="f-amazon" hidden>Nicht das Richtige dabei? <a id="f-amazon" href="{esc(amazon_url('Wichtelgeschenk'))}" rel="sponsored nofollow noopener" target="_blank">Bei Amazon suchen*</a></p>
<h2 class="sr-only">Alle Geschenkideen</h2>
<div id="f-results" class="idea-grid" tabindex="-1">
{cards}
</div>
<p class="hint">Bei Geschenken für Kinder bitte die Altersangabe auf der Verpackung beachten, zum Beispiel wegen verschluckbarer Kleinteile.</p>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
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
{ai_photo('wichtel3d-kinder', 'Plüsch-Wichtel sitzt zwischen Holzspielzeug: Schaukelpferd, Bauklötze, Eisenbahn und Teddy')}
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
<p>Zum Ausmalen: <a href="/wichtel-ausmalbilder/">Wichtel-Ausmalbilder zum Ausdrucken</a> – kostenlos als PDF.</p>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
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
{ai_photo('wichtel3d-basteln', 'Plüsch-Wichtel bastelt mit buntem Papier, Bändern und Keksgläsern')}
<p class="lead">Selbst gemachte Geschenke sind persönlich, günstig und kommen fast immer gut an. Diese {len(DIY)} Ideen gelingen auch ohne Bastel-Talent – die meisten in unter einer Stunde.</p>
{CTA}
{chr(10).join(blocks)}
<h2>Bastelsets für gemütliche Abende</h2>
<p>Lieber Zeit verschenken als selbst basteln? Diese Sets sorgen für entspannte Winterabende – zum Selbermachen für die beschenkte Person.</p>
<div class="idea-grid">
{cards}
</div>
<p><a class="more-link" href="/geschenkfinder/?mag=kreativ">Alle Bastel- und Kreativ-Ideen im Geschenkfinder →</a></p>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
</article>'''
    page('/wichtelgeschenke-selber-machen/', f'Wichtelgeschenke selber machen: {len(DIY)} Ideen mit Anleitung',
         'Wichtelgeschenke selber machen: Backmischung im Glas, Badesalz, gebrannte Mandeln und mehr – einfache Anleitungen plus Bastelsets für gemütliche Abende.',
         body, crumb='Wichtelgeschenke selber machen')


# ---------- Spiele ----------

def dice_page():
    body = f'''<article>
<h1>Wichteln mit Würfeln: Regeln, Ablauf und Varianten</h1>
{ai_photo('wichtel3d-wuerfel', 'Plüsch-Wichtel mit roter Zipfelmütze hält einen großen Holzwürfel')}
<p class="lead">Beim Würfelwichteln entscheidet der Würfel, wer am Ende welches Geschenk mit nach Hause nimmt. Das sorgt für Spannung, Gelächter und so manchen Tausch in letzter Sekunde – perfekt für Weihnachtsfeiern mit Kollegen, Freunden oder der Familie.</p>
<p class="no-print"><button type="button" class="btn-secondary" data-print>🖨️ Regeln ausdrucken</button></p>

<h2>Was ihr braucht</h2>
<ul>
  <li>Ein verpacktes Geschenk pro Person – vorher ein Budget absprechen, z. B. 10 oder 15 Euro.</li>
  <li>Einen Würfel (bei mehr als 12 Personen besser zwei).</li>
  <li>Einen Timer, zum Beispiel am Handy.</li>
  <li>Einen Tisch oder Stuhlkreis, an dem alle sitzen.</li>
</ul>
<p class="tip no-print">💡 <b>Ihr wollt lieber gezielt beschenken statt würfeln?</b> Dann lost vorher aus, wer wen beschenkt – <a href="/">Namen online auslosen</a>, kostenlos und ohne Anmeldung.</p>

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
{ai_photo('wichtel3d-schrott', 'Plüsch-Wichtel sitzt grinsend auf einem Berg kurioser Schrottgeschenke mit Teekanne, Quietscheente und Lavalampe')}
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
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
<p>Und für den Sieger der Runde: die Tasse „Ich habe beim Schrottwichteln gewonnen.“ – bei unseren <a href="/wichtel-tassen/">Wichtel-Tassen</a>.</p>
</article>'''
    page('/schrottwichteln/', 'Schrottwichteln: Regeln & 24 lustige Ideen fürs Büro',
         'Schrottwichteln: Die Regeln, der Ablauf mit Würfeln und 24 lustige Ideen aus Kitsch, Werbegeschenken und Retro-Fundstücken – kostenlos und nachhaltig.', body,
         crumb='Schrottwichteln', mascot='wuerfel')


def office_page():
    n_office = sum(1 for i in IDEAS if i['office'])
    body = f'''<article>
<h1>Wichteln im Büro: Regeln, Budget und Ablauf</h1>
{ai_photo('wichtel3d-geschenk', 'Plüsch-Wichtel mit roter Zipfelmütze hält ein Geschenk mit roter Schleife vor dem Weihnachtsbaum')}
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
<p>Mit Augenzwinkern: <a href="/wichtel-tassen/">Wichtel-Tassen mit Spruch</a> – vom „Wichtel-Champion“ bis „Bester Wichtel der Abteilung“.</p>
</article>'''
    page('/wichteln-im-buero/', 'Wichteln im Büro: Regeln, Budget & Ablauf fürs Team',
         'Büro-Wichteln organisieren: übliches Budget, faire Regeln, Ablauf im Homeoffice, Spiel-Varianten und Ideen für Kollegen – mit kostenloser Online-Auslosung.', body,
         crumb='Wichteln im Büro', mascot='geschenk')


def school_page():
    body = f'''<article>
<h1>Wichteln in der Schulklasse und Kita: so klappt's</h1>
{ai_photo('wichtel3d-los', 'Plüsch-Wichtel zieht ein Los aus einer alten Holzkiste')}
<p class="lead">Wichteln mit Kindern macht riesig Spaß – wenn das Auslosen fair ist und keiner leer ausgeht. Hier findest du den Ablauf für Klasse, Kita und Verein, ein faires Budget, einen Elternbrief zum Kopieren und Wichtel-Lose, für die kein Kind ein Handy braucht.</p>

<h2>Wichteln erklären – für jedes Alter</h2>
<div class="erkl-paar">
{erkl_box('kind', 'Für Kita und Grundschule: Was ist ein Wichtel?')}
{erkl_box('gross', 'Für ältere Schüler: Was ist Wichteln?')}
</div>

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
<p>Zum Einsammeln der Anmeldungen im Lehrerzimmer oder Verein: <a href="/wichteln-einladung-vorlage/">Einladung mit Teilnehmerliste zum Aushängen</a>. Für die Wartezeit bis zur Bescherung: <a href="/wichtel-ausmalbilder/">Wichtel-Ausmalbilder</a> zum Ausdrucken.</p>
</article>'''
    page('/wichteln-schule-kita/', 'Wichteln in Schulklasse & Kita: Ablauf, Budget, Lose',
         'Wichteln mit Kindern in Klasse, Kita und Verein: Ablauf, faires Budget, Elternbrief zum Kopieren und Wichtel-Lose zum Ausdrucken ohne Handy – kostenlos.', body,
         crumb='Wichteln in Schule und Kita', mascot='geschenk', playful=True)


WA_FAQ = [
    ('Kann ich die Links einfach in unsere WhatsApp-Gruppe posten?', 'Bitte nicht: Jeder Link verrät, wen die jeweilige Person beschenkt. In die Gruppe gehört nur die Ankündigung – die Links schickst du einzeln im privaten Chat.'),
    ('Brauchen alle WhatsApp?', 'Nein. Für jede Person gibt es auch „E-Mail“ und „Link kopieren“, etwa für Signal, Telegram, Teams oder SMS. Für Kinder ohne Handy kannst du Lose ausdrucken.'),
    ('Sieht der Organisator, wer wen gezogen hat?', 'Nur, wenn er fremde Links öffnet. Machst du selbst mit, öffne nur deinen eigenen Link – dann bleibt es auch für dich eine Überraschung.'),
    ('Was mache ich, wenn jemand seinen Link verliert?', 'Öffne WichtelLos auf dem Gerät, auf dem du ausgelost hast, und tippe auf „Letzte Auslosung wieder anzeigen“. Dort schickst du den Link einfach noch einmal.'),
    ('Kostet das etwas oder braucht man ein Konto?', 'Nein. WichtelLos ist kostenlos, niemand muss sich anmelden oder eine Nummer hinterlegen.'),
]


# 10 Schritte als Bilder (Toni 01.11.: Karussell auch auf der Seite) – Folien 2–11 aus marketing/social/whatsapp/ (render-social.js, Set „whatsapp“),
# fürs Web 480x600 nach fotos/whatsapp/schritt-NN.webp. Texte = Alt-Texte, gleich wie auf den Folien.
WA_SCHRITTE = [
    ('wichtellos.de öffnen', 'Am Handy oder Computer – ohne App, ohne Anmeldung.'),
    ('Gruppe benennen', 'Zum Beispiel „Familie 2026“ oder „Büro-Weihnachten“.'),
    ('Budget & Datum', 'Wie viel darf das Geschenk kosten, wann ist Bescherung?'),
    ('Namen eintragen', 'Alle, die mitmachen – ab 3 Personen.'),
    ('Tipp hinterlegen', 'Optional: „mag Tee“ – nur der Wichtel sieht es.'),
    ('Paare ausschließen', 'Optional: Wer sich nicht gegenseitig ziehen soll.'),
    ('Jetzt auslosen', 'Ein Tipp – jeder bekommt seinen eigenen geheimen Link.'),
    ('Per WhatsApp senden', 'Neben jedem Namen auf „WhatsApp“ tippen, Kontakt wählen – fertig.'),
    ('Nur privat schicken', 'Nicht alle Links in den Gruppenchat – sonst ist die Überraschung weg.'),
    ('Geheimnis lüften', 'Link antippen, sehen, wen man beschenkt – mit Geschenkideen.'),
]


def wa_karussell():
    folien = '\n'.join(f'<li><img src="/fotos/whatsapp/schritt-{i:02d}.webp" width="480" height="600" loading="lazy" decoding="async" '
                       f'alt="Schritt {i}: {esc(t)} – {esc(x)}"></li>' for i, (t, x) in enumerate(WA_SCHRITTE, 1))
    return f'''<figure class="karussell" aria-label="Wichteln per WhatsApp in 10 Schritten">
<div class="k-wrap"><button type="button" class="k-prev" aria-label="Vorheriger Schritt">‹</button>
<ul class="k-list" tabindex="0">
{folien}
</ul>
<button type="button" class="k-next" aria-label="Nächster Schritt">›</button></div>
<figcaption>Wischen oder Pfeile: alle 10 Schritte als Bilder</figcaption>
</figure>'''


def whatsapp_page():
    faq = '\n'.join(f'<h3>{esc(q)}</h3>\n<p>{esc(a)}</p>' for q, a in WA_FAQ)
    faq_ld = {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in WA_FAQ]}
    body = f'''<article>
<h1>Wichteln per WhatsApp: Namen online ziehen und Links verschicken</h1>
{ai_photo('wichtel3d-los', 'Plüsch-Wichtel zieht ein Los aus einer alten Holzkiste')}
<p class="lead">Keine Zettel, kein Treffen: Mit WichtelLos lost du eure Wichtelgruppe online aus und schickst jedem seinen geheimen Link per WhatsApp. Jeder sieht nur, wen er selbst beschenkt – auch der Organisator nicht, wenn er mitmacht.</p>

<h2>So geht's in 4 Schritten</h2>
{video_block()}
<ol>
  <li><b>Gruppe anlegen:</b> <a href="/">Auf der Startseite</a> Gruppennamen, Budget und auf Wunsch das Datum der Bescherung eintragen.</li>
  <li><b>Namen eintragen:</b> Alle Teilnehmer eintragen. Paare, die sich nicht gegenseitig ziehen sollen, schließt du unter „Ausschlüsse“ aus.</li>
  <li><b>Auslosen:</b> Auf „Jetzt auslosen“ tippen. Für jede Person entsteht ein eigener geheimer Link.</li>
  <li><b>Per WhatsApp verschicken:</b> Neben jedem Namen auf „WhatsApp“ tippen und den passenden Kontakt wählen. Die Nachricht ist schon fertig: „Hallo …! Hier ist dein geheimer Wichtel-Link …“.</li>
</ol>
{CTA}

<h2>Alle 10 Schritte zum Durchwischen</h2>
<p>Vom Öffnen der Seite bis zum Geheimnis-Lüften – zum Nachmachen oder zum Weiterschicken an alle, die die Wichtelrunde organisieren.</p>
{wa_karussell()}

<h2>Wichtig: Links nicht in die Gruppe posten</h2>
<p>Jeder Link verrät, wen <b>diese</b> Person beschenkt. Postest du alle Links in den Gruppenchat, kann jeder jeden öffnen – und die Überraschung ist dahin. So klappt es:</p>
<ul>
  <li><b>In die WhatsApp-Gruppe:</b> nur die Ankündigung, also Budget, Datum und „Eure Links kommen gleich privat“.</li>
  <li><b>Im Einzelchat:</b> jeder bekommt nur seinen eigenen Link.</li>
  <li><b>Machst du selbst mit:</b> Öffne nur deinen eigenen Link.</li>
</ul>

<h2>Ohne WhatsApp geht's auch</h2>
<p>Für jede Person gibt es zusätzlich „E-Mail“ und „Link kopieren“ – praktisch für Teams-Chat, Signal oder SMS. Für die Weihnachtsfeier oder Kinder ohne Handy kannst du <b>Wichtel-Lose zum Ausdrucken</b> erstellen, mehr unter <a href="/wichteln-schule-kita/">Wichteln in Schule und Kita</a>.</p>

<h2>Wichteln auf Distanz</h2>
<p>Familie in verschiedenen Städten oder Team im Homeoffice? Auslosen per WhatsApp, Geschenke per Post schicken und gemeinsam im Videocall auspacken. Tipp: das Budget inklusive Versand vereinbaren. Mehr fürs Team unter <a href="/wichteln-im-buero/">Wichteln im Büro</a>.</p>

<h2>Was steht im Link?</h2>
<p>Die Zuteilung steckt codiert im Link selbst. Sie wird nicht auf unserem Server gespeichert, und es gibt kein Konto. Deshalb gilt: Wer einen Link hat, kann ihn öffnen – also wirklich nur an die richtige Person schicken.</p>

<h2>Häufige Fragen</h2>
{faq}

<h2>Und jetzt: das passende Geschenk</h2>
<p>Ideen nach Budget: <a href="/wichtelgeschenke-unter-5-euro/">unter 5 Euro</a> · <a href="/wichtelgeschenke-unter-10-euro/">unter 10 Euro</a> · <a href="/wichtelgeschenke-unter-20-euro/">unter 20 Euro</a> – oder im <a href="/geschenkfinder/">Geschenkfinder</a> nach Alter und Interessen filtern.</p>
</article>'''
    page('/wichteln-per-whatsapp/', 'Wichteln per WhatsApp: Namen online ziehen & Links verschicken',
         'Wichteln per WhatsApp: Gruppe online auslosen, jedem seinen geheimen Link schicken – ohne Zettel, ohne Anmeldung. So geht\'s in 4 Schritten, kostenlos.', body,
         extra=ld(faq_ld), crumb='Wichteln per WhatsApp', mascot='winkt')


SUPPLIES = [
    ('„Von deinem Wichtel“-Anhänger', 'Damit das Geschenk anonym bleibt.', 'Geschenkanhänger Wichtel Weihnachten'),
    ('Großer Schaumstoff-Würfel', 'Für Würfelwichteln – gut sichtbar für alle.', 'Schaumstoffwürfel groß', 'B0BZSS2PKR'),
    ('Wichtelmützen', 'Zipfelmützen für die Bescherung, gibt es im Set.', 'Wichtelmütze Set Erwachsene'),
    ('Geschenktüten aus Kraftpapier', 'Schnell verpackt, alle Päckchen sehen gleich aus.', 'Geschenktüten Kraftpapier Weihnachten', 'B0B6BRP5KP'),
]


# Seite des geheimen Links: Verpacken + anonym bleiben (Kaufabsicht ist dort am höchsten)
WRAP = [
    ('„Von deinem Wichtel“-Anhänger', 'Damit keiner errät, von wem das Geschenk kommt.', 'Geschenkanhänger Wichtel Weihnachten'),
    ('Geschenktüten aus Kraftpapier', 'Schnell verpackt – und alle Päckchen sehen gleich aus.', 'Geschenktüten Kraftpapier Weihnachten', 'B0B6BRP5KP'),
    ('Weihnachtliches Geschenkpapier', 'Eine Rolle reicht für alle Geschenke bis Weihnachten.', 'Geschenkpapier Weihnachten Rolle'),
    ('Geschenkband & Schleifen', 'Der letzte Schliff – auch für schief gepackte Päckchen.', 'Geschenkband Weihnachten Schleifen Set'),
]

# Wichtelgruß: Kleinigkeiten, die zum Gruß passen
GRUSS_SHOP = [
    ('Mini-Weihnachtskarten', 'Den Gruß auch auf Papier – für ans Geschenk oder an den Schreibtisch.', 'Mini Weihnachtskarten Set'),
    ('Schoko-Weihnachtsmann', 'Die kleinste Wichtel-Überraschung: einfach heimlich hinlegen.', 'Schoko Weihnachtsmann klein'),
    ('Wichtel-Sticker', 'Für Umschläge, Tüten und kleine Botschaften.', 'Sticker Wichtel Weihnachten'),
    ('Adventskalender-Tütchen', 'Für Rätsel-Hinweise in Etappen: Tütchen mit Zahlen.', 'Adventskalender Tüten Zahlen Kraftpapier'),
]


def supplies_block(items=None, title='Das brauchst du noch für die Bescherung', note=True):
    cards = '\n'.join(f'''<div class="idea">
  <h3>{esc(t)}</h3>
  <p>{esc(x)}</p>
  {product_links(*r)}
</div>''' for t, x, *r in (items or SUPPLIES))
    disc = '\n<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>' if note else ''
    return f'''<h2>{esc(title)}</h2>
<div class="idea-grid">
{cards}
</div>{disc}'''


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
    ('Wichteltür-Set', 'Tür mit Zubehör wie Leiter, Briefkasten und Fußmatte.', 'Wichteltür Set', 'B0DK3D8M31'),
    ('Wichtel-Figur', 'Der Bewohner selbst – meist mit Zipfelmütze und Bart.', 'Wichtel Figur Wichteltür', 'B0BLKHPYQV'),
    ('Mini-Zubehör', 'Möbel, Werkzeug und Lebensmittel im Puppenhaus-Format.', 'Wichtel Zubehör Miniatur'),
    ('Wichtel-Briefpapier', 'Winzige Briefe und Umschläge für die Wichtel-Post.', 'Wichtel Briefpapier Mini'),
    ('Mini-Lichterkette', 'Batteriebetrieben, für die Wichteltür bei Nacht.', 'Mini Lichterkette Batterie warmweiß', 'B0BLYQGD2Z'),
    ('Buch mit Wichtel-Streichen', 'Noch mehr Ideen für die 24 Tage.', 'Wichtel Streiche Buch'),
    ('Wichteltür zum Bemalen', 'Holztür-Rohling zum Selbstgestalten – ein schönes Bastelprojekt mit Kindern.', 'Wichteltür Holz zum Bemalen'),
    ('Mini-Leiter aus Holz', 'Damit der Wichtel aufs Regal und in den Weihnachtsbaum kommt.', 'Wichtel Leiter Miniatur Holz'),
    ('Bastelfilz & Deko-Moos', 'Für Mini-Mützen, Fußmatte und den Vorgarten vor der Tür.', 'Bastelfilz Set Deko Moos'),
]

# Zubehör für die Ausmalbilder-Seite (nur Amazon-Suchen, keine Preise/Fotos – PartnerNet-Regeln)
MAL_SHOP = [
    ('Dicke Buntstifte', 'Liegen gut in Kinderhänden und brechen nicht so schnell ab.', 'dicke Buntstifte Kinder'),
    ('Wachsmalstifte', 'Kräftige Farben schon für die Kleinsten in der Kita.', 'Wachsmalstifte Kinder'),
    ('Glitzer- und Gelstifte', 'Für Onnis Mütze und den Schnee im Winterwald.', 'Glitzerstifte Kinder'),
    ('Laminierfolien', 'Machen Türschilder und Urkunde für die Wichteltür haltbar.', 'Laminierfolien A4'),
    ('Kinderschere', 'Zum Ausschneiden der Wichtelbriefe und Türschilder.', 'Kinderschere abgerundet'),
    ('Weihnachts-Sticker', 'Für Briefe, Lose und Wichtelgeschenke.', 'Weihnachtssticker Kinder'),
]



# Onni = der WichtelLos-Wichtel (Name gewählt 02.11., finnisch „Glück“). Wichtelnamen für den Generator auf /wichteltuer/,
# Bedeutungen selbst formuliert (keine fremden Texte übernehmen)
WICHTEL_NAMEN = {
    'm': [('Onni', 'finnisch für „Glück“ – bringt Losglück ins Haus'), ('Pelle', 'der Tüftler, repariert heimlich kaputtes Spielzeug'),
          ('Nisse', 'der klassische Hauswichtel aus Skandinavien'), ('Finn', 'der Abenteurer, immer unterwegs'),
          ('Knut', 'der Mutige, hat vor nichts Angst – außer vor Staubsaugern'), ('Lasse', 'der Fröhliche, pfeift beim Aufräumen'),
          ('Bo', 'der Kleine, der am liebsten zu Hause bleibt'), ('Ole', 'der Spaßvogel mit den besten Streichen'),
          ('Sven', 'der Neugierige, steckt seine Nase überall hinein'), ('Tomte', 'der Hüter, passt nachts auf das Haus auf'),
          ('Jonte', 'der Friedliche, schlichtet jeden Streit'), ('Rune', 'der Rätselfreund, versteckt gern Botschaften'),
          ('Mats', 'der Krümelsammler, findet jeden Keks'), ('Frode', 'der Kluge, hat schon alle Bücher gelesen'),
          ('Kalle', 'das Schlitzohr, immer einen Trick im Ärmel'), ('Bjarne', 'der Bärenstarke mit dem weichsten Herz'),
          ('Vidar', 'der Waldwichtel, riecht nach Tannennadeln'), ('Emil', 'der Lausbub, der nie stillsitzt')],
    'w': [('Lumi', 'finnisch für „Schnee“ – liebt den Winter'), ('Svea', 'die Stolze, trägt ihre Mütze besonders hoch'),
          ('Ronja', 'die Wilde, klettert auf jeden Schrank'), ('Maja', 'die Sonnige, macht jeden Tag ein bisschen heller'),
          ('Freja', 'die Liebevolle, kümmert sich um alle'), ('Liv', 'die Lebensfrohe, tanzt durchs Wohnzimmer'),
          ('Ida', 'die Fleißige, bastelt die ganze Nacht'), ('Greta', 'die Schatzsammlerin, hortet glänzende Knöpfe'),
          ('Elin', 'die Leuchtende mit dem warmen Herz'), ('Alva', 'die Elfenhafte, tanzt im Mondlicht'),
          ('Tilda', 'die Tapfere, beschützt die Kleinsten'), ('Smilla', 'die Lächelnde, steckt alle mit guter Laune an'),
          ('Wilma', 'die Willensstarke, gibt nie auf'), ('Saga', 'die Geschichtenerzählerin'),
          ('Linnea', 'die Blümchenfreundin, pflegt die Zimmerpflanzen'), ('Pippa', 'die Quirlige, immer in Bewegung'),
          ('Merle', 'die Singende, trällert leise in der Nacht'), ('Fine', 'die Feine, deckt den Puppentisch')],
}

AUSMAL = [('geschenk', 'Onni mit Geschenk', 'Onni winkt und hält ein Geschenk mit großer Schleife'),
          ('baum', 'Onni schmückt den Baum', 'Der kleine Onni steht auf einer Leiter vor einem großen Weihnachtsbaum mit Geschenken'),
          ('laterne', 'Onni im Winterwald', 'Onni läuft mit einer Laterne durch den verschneiten Wald, im Hintergrund ein Haus'),
          ('kekse', 'Onni backt Plätzchen', 'Onni rollt Teig aus, auf dem Tisch Stern- und Herzplätzchen und eine Keksdose'),
          ('los', 'Onni zieht ein Los', 'Onni zieht einen Brief aus einer großen Strickmütze, um ihn herum Sterne'),
          ('tuer', 'Onni an der Wichteltür', 'Onni schaut aus einer kleinen Wichteltür in der Fußleiste, davor Fußspuren')]

STICKER = [('winkt', 'winkt'), ('geschenk', 'mit Geschenk'), ('psst', 'Psst, geheim!'), ('daumen', 'Daumen hoch'),
           ('herz', 'mit Herz'), ('schlaeft', 'schläft'), ('jubel', 'jubelt'), ('lupe', 'mit Lupe')]

DRUCK_TUER = [('tuer-begruessung', 'Begrüßungsbrief (30. November)'), ('tuer-abschied', 'Abschiedsbrief (24. Dezember)'),
              ('tuer-urkunde', 'Wichtel-Urkunde'), ('tuer-schilder', '6 Türschilder zum Ausschneiden')]


def onni_img(name, alt='', size=96, cls='onni-img'):
    return f'<img class="{cls}" src="/fotos/onni/sticker-{name}.webp" width="{size}" height="{size}" alt="{esc(alt)}" loading="lazy" decoding="async">'


def druck_card(n, t, h, alt):
    return (f'<figure class="ausmal"><a href="/fotos/onni/{n}.pdf" target="_blank" rel="noopener">'
            f'<img src="/fotos/onni/{n}-480.webp" width="480" height="{h}" alt="{esc(alt)}" loading="lazy" decoding="async"></a>'
            f'<figcaption><b>{esc(t)}</b><a class="btn-secondary" href="/fotos/onni/{n}.pdf" target="_blank" rel="noopener">🖨️ PDF drucken</a></figcaption></figure>')


def ausmal_page():
    mal_shop = '\n'.join(f'<div class="idea">\n  <h3>{esc(t)}</h3>\n  <p>{esc(x)}</p>\n  {product_links(*r)}\n</div>'
                         for t, x, *r in MAL_SHOP)
    cards = '\n'.join(druck_card(f'ausmal-{n}', t, 643, f'Ausmalbild: {alt}') for n, t, alt in AUSMAL)
    sticker = '\n'.join(f'<a class="sticker" href="/fotos/onni/sticker-{n}.webp" download="onni-{n}.webp">{onni_img(n, f"Onni-Sticker: {t}", 160)}<span>{esc(t)}</span></a>' for n, t in STICKER)
    body = f"""<article>
<h1>Wichtel-Ausmalbilder zum Ausdrucken</h1>
<figure class="photo photo-ai onni-portrait">{onni_img('winkt', 'Onni, der Wichtel von WichtelLos, winkt', 220, '')}<figcaption>Das ist Onni · KI-generiert</figcaption></figure>
<p class="lead">Das ist Onni, der Wichtel von WichtelLos – sein Name heißt auf Finnisch „Glück“. Hier gibt es 6 Ausmalbilder mit Onni zum kostenlosen Ausdrucken: für die Adventszeit zu Hause, die Wichteltür, die Kita oder die Grundschule. Oben auf jedem Blatt ist Platz für den Namen eures Wichtels.</p>
<p><a class="btn-primary" href="/fotos/onni/ausmalbilder-alle.pdf" target="_blank" rel="noopener">🖨️ Alle 6 Ausmalbilder als PDF</a></p>
{KOFI_LINE}

<h2>Die Ausmalbilder</h2>
<div class="ausmal-grid">
{cards}
</div>
<p class="hint">Tipp: Am besten auf normalem Druckerpapier in DIN A4 drucken. Die Linien sind extra dick – gut für Wachsmalstifte und kleine Hände.
Noch keinen Namen für euren Wichtel? Der <a href="/wichteltuer/#wichtelname">Wichtelnamen-Generator</a> hilft.</p>

<h2 id="sticker">Onni als WhatsApp-Sticker</h2>
<p>Für eure Wichtelgruppe: 8 Sticker mit Onni – zum Verschicken, wenn ausgelost ist, wenn das Geschenk ankommt oder einfach so.</p>
<div class="sticker-grid">
{sticker}
</div>
<p><a class="btn-secondary" href="/fotos/onni/onni-sticker.zip" download>⬇️ Alle 8 Sticker herunterladen (ZIP)</a></p>
<h3>So kommen die Sticker in WhatsApp</h3>
<ol>
  <li><b>Sticker speichern:</b> Antippen und speichern – oder alle als ZIP laden und entpacken.</li>
  <li><b>In WhatsApp:</b> Chat öffnen, auf das Sticker-Symbol tippen und „Sticker erstellen“ bzw. „+“ wählen (iPhone, WhatsApp Web und Desktop; auf Android je nach Version).</li>
  <li><b>Bild auswählen:</b> Onni aussuchen, fertig – der Sticker liegt jetzt bei deinen Stickern.</li>
</ol>
<p class="hint">Klappt „Sticker erstellen“ bei dir noch nicht, schick Onni einfach als Bild – der Hintergrund ist durchsichtig.</p>

<h2>Für die Mal-Ecke</h2>
<p>Damit Onni schön bunt wird – und die Vorlagen für die Wichteltür lange halten:</p>
<div class="idea-grid">
{mal_shop}
</div>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>

<h2>Und jetzt: wichteln!</h2>
<p>Für Familie, Klasse oder Kita: Namen eintragen, auslosen, jeder bekommt seinen geheimen Link. Für Kinder ohne Handy gibt es Lose zum Ausdrucken, bei denen der Name innen steht.</p>
{CTA}
<p>Mehr für Kinder: <a href="/wichteltuer/">Wichteltür mit 24 Streichen</a> · <a href="/wichtel-zubehoer/">Wichtel-Zubehör</a> · <a href="/wichteln-schule-kita/">Wichteln in Schule und Kita</a> · <a href="/wichtelgeschenke-fuer-kinder/">Wichtelgeschenke für Kinder</a></p>
<p class="hint">Ausmalbilder und Sticker sind für zu Hause, Kita und Schule kostenlos. Sie wurden mit KI erstellt (Google Gemini/Flow).</p>
</article>"""
    page('/wichtel-ausmalbilder/', 'Wichtel-Ausmalbilder zum Ausdrucken – kostenlos (PDF)',
         '6 Wichtel-Ausmalbilder mit Onni kostenlos als PDF: Wichtel mit Geschenk, am Tannenbaum, an der Wichteltür, beim Plätzchenbacken – plus Wichtel-Sticker für WhatsApp.', body,
         crumb='Wichtel-Ausmalbilder', playful=True)


def namegen_html():
    return ('<div class="namegen card" data-namegen>\n'
            '  <p>Jeder Wichtel braucht einen Namen! Tippe auf einen Knopf – der Generator schlägt einen skandinavischen Wichtelnamen mit Bedeutung vor und setzt ihn gleich in den Begrüßungsbrief unten ein.</p>\n'
            '  <div class="row2 namegen-btns">\n'
            '    <button type="button" class="btn-secondary" data-g="m">👦 Wichteljunge</button>\n'
            '    <button type="button" class="btn-secondary" data-g="w">👧 Wichtelmädchen</button>\n'
            '    <button type="button" class="btn-secondary" data-g="x">🎲 Egal</button>\n'
            '  </div>\n'
            '  <p class="ng-out" aria-live="polite"><b class="ng-name">Onni</b><span class="ng-mean">finnisch für „Glück“ – so heißt der Wichtel von WichtelLos</span></p>\n'
            f'  <script type="application/json">{json.dumps(WICHTEL_NAMEN, ensure_ascii=False)}</script>\n'
            '</div>')


# /wichtel-zubehoer/ (Toni 02.11.: „alles, was wir als Zubehör finden – auch über 30 €“). Nur Amazon-Suchlinks (Rückfall
# product_links), keine Preise/Amazon-Fotos (PartnerNet-Regeln). Kategorie, Einleitung, [(Titel, Text, Suchbegriff[, ASIN])]
ZUBEHOER = [
    ('Tür & Haus', 'Das Herzstück: Hier wohnt der Wichtel.', [
        ('Wichteltür-Set', 'Tür mit Leiter, Briefkasten und Fußmatte – fertig zum Aufstellen.', 'Wichteltür Set', 'B0DK3D8M31'),
        ('Wichteltür mit Licht', 'Mit kleinen LEDs im Fenster, leuchtet abends.', 'Wichteltür mit Beleuchtung'),
        ('Wichteltür zum Bemalen', 'Holz-Rohling zum Selbstgestalten mit den Kindern.', 'Wichteltür Holz zum Bemalen'),
        ('Wichtelfenster', 'Ein Mini-Fenster mit Gardine für die Wand daneben.', 'Wichtel Fenster Miniatur'),
        ('Wichtelhaus', 'Ein ganzes Häuschen statt nur einer Tür – für Regal oder Fensterbank.', 'Wichtelhaus Holz'),
        ('Wichteltreppe', 'Kleine Stufen hoch zur Tür an der Fußleiste.', 'Wichtel Treppe Miniatur'),
    ]),
    ('Möbel & Einrichtung', 'Damit es der Wichtel gemütlich hat.', [
        ('Wichtelbett', 'Mit Kissen und Decke – für den Wichtel, der morgens verschlafen hat.', 'Wichtel Bett Miniatur'),
        ('Wichtelküche', 'Herd, Töpfe und Geschirr im Puppenhaus-Format.', 'Wichtel Küche Miniatur'),
        ('Wichtel-Werkstatt', 'Werkbank und Werkzeug für die Geschenke-Produktion.', 'Wichtel Werkstatt Miniatur'),
        ('Tisch & Stühle', 'Für das Frühstück mit Krümel-Keksen.', 'Wichtel Tisch Stühle Miniatur'),
        ('Mini-Weihnachtsbaum', 'Ein eigener kleiner Baum mit Kugeln.', 'Miniatur Weihnachtsbaum Wichtel'),
        ('Mini-Lebensmittel', 'Brötchen, Plätzchen, Milchflasche – alles winzig.', 'Miniatur Lebensmittel Wichtel'),
    ]),
    ('Licht & Deko', 'Für die Abendstimmung vor der Tür.', [
        ('Mini-Lichterkette', 'Batteriebetrieben und warmweiß.', 'Mini Lichterkette Batterie warmweiß', 'B0BLYQGD2Z'),
        ('Mini-Laterne', 'Eine kleine LED-Laterne neben der Tür.', 'Miniatur Laterne LED Wichtel'),
        ('Kunstschnee', 'Für den verschneiten Vorgarten.', 'Kunstschnee Deko'),
        ('Wichtel-Fußmatte & Zaun', 'Der Eingangsbereich im Kleinformat.', 'Wichtel Zaun Fußmatte Miniatur'),
        ('Mini-Schlitten', 'Für die Ausfahrt am Nikolaustag.', 'Miniatur Schlitten Holz'),
        ('Deko-Moos & Tannenzweige', 'Damit der Vorgarten lebendig aussieht.', 'Deko Moos Tannenzweige künstlich'),
    ]),
    ('Post & Briefe', 'Für die Wichtel-Post zwischen Kindern und Wichtel.', [
        ('Wichtel-Briefkasten', 'Ein Mini-Briefkasten an der Tür.', 'Wichtel Briefkasten Miniatur'),
        ('Wichtel-Briefpapier', 'Winzige Briefe und Umschläge.', 'Wichtel Briefpapier Mini'),
        ('Mini-Stempel', 'Ein Wichtel-Stempel für die Antwortbriefe.', 'Wichtel Stempel'),
        ('Lupe', 'Damit die Kinder die winzige Schrift lesen können.', 'Lupe Kinder'),
    ]),
    ('Figuren & Plüsch', 'Der Bewohner selbst – und seine Freunde.', [
        ('Wichtel-Figur', 'Klassisch mit Zipfelmütze und Bart.', 'Wichtel Figur Wichteltür', 'B0BLKHPYQV'),
        ('Wichtel aus Plüsch', 'Zum Kuscheln für die Kleinen.', 'Wichtel Plüsch Kuscheltier'),
        ('Große Wichtel-Figur', 'Ein großer Wichtel als Deko für Flur oder Fensterbank.', 'Wichtel groß Deko stehend'),
        ('Wichtel-Familie', 'Mehrere Figuren – falls der Wichtel Besuch bekommt.', 'Wichtel Figuren Set'),
    ]),
    ('Bücher & Ideen', 'Für Eltern, denen die Streiche ausgehen.', [
        ('Buch mit Wichtel-Streichen', 'Noch mehr Ideen für die 24 Tage.', 'Wichtel Streiche Buch'),
        ('Bilderbuch über Wichtel', 'Zum Vorlesen am ersten Dezember.', 'Wichtel Bilderbuch Kinder'),
        ('Wichtel-Adventskalender', 'Fertige Streiche und Briefe für jeden Tag.', 'Wichtel Adventskalender Streiche'),
    ]),
    ('Basteln & Selbermachen', 'Für alle, die lieber selbst bauen.', [
        ('Bastelfilz', 'Für Mini-Mützen, Fußmatte und Decken.', 'Bastelfilz Set'),
        ('Mini-Leiter aus Holz', 'Damit der Wichtel aufs Regal kommt.', 'Wichtel Leiter Miniatur Holz'),
        ('Holzperlen & Pfeifenputzer', 'Für eigene kleine Wichtel.', 'Holzperlen Pfeifenputzer Basteln'),
        ('Puppenhaus-Werkzeug', 'Mini-Hammer, Säge und Pinsel.', 'Miniatur Werkzeug Puppenhaus'),
    ]),
    ('Für die große Wichtelwelt', 'Wenn es etwas mehr sein darf – oft über 30 €, aber jahrelang im Einsatz.', [
        ('Großes Wichtelhaus mit Licht', 'Mehrere Räume, Beleuchtung und Möbel in einem.', 'Wichtelhaus groß beleuchtet'),
        ('Komplettset Wichtelwelt', 'Tür, Möbel, Deko und Zubehör als großes Set.', 'Wichteltür Set groß Zubehör komplett'),
        ('Leuchtendes Wichteldorf', 'Mehrere Häuschen mit LED für die Fensterbank.', 'Wichteldorf LED Weihnachtsdorf'),
        ('Wichtel-Puppenhaus', 'Ein ganzes Puppenhaus im Wichtel-Stil.', 'Wichtel Puppenhaus Holz'),
        ('Wichtel-Kostüm für Kinder', 'Mütze, Bart und Weste – für den eigenen Auftritt.', 'Wichtel Kostüm Kinder'),
    ]),
]


# Adventskalender-Ideen (/adventskalender-ideen/, 03.11.): (Überschrift, Onni-Sticker, Einleitung, Ideen)
ADVENT = [
    ('Für Kollegen und das Büro', 'daumen', 'Neutral, für jeden Geschmack und mit Platz auf dem Schreibtisch.', [
        ('Tee-Adventskalender', '24 Sorten für die Teepause – der Klassiker fürs Büro.', 'Tee Adventskalender'),
        ('Kaffee-Adventskalender', 'Jeden Morgen eine andere Röstung oder Kapsel.', 'Kaffee Adventskalender'),
        ('Rätsel-Adventskalender', '24 Knobelaufgaben – gut für die Mittagspause im Team.', 'Rätsel Adventskalender Erwachsene'),
        ('Escape-Room-Adventskalender', 'Jeden Tag ein Rätsel, am 24. ist der Fall gelöst.', 'Escape Room Adventskalender'),
        ('Socken-Adventskalender', 'Verrückte Socken für 12 oder 24 Tage – sorgt für Gesprächsstoff.', 'Socken Adventskalender'),
        ('Mini-Pflanzen-Adventskalender', 'Samen und Töpfchen – im Frühling wächst die Erinnerung.', 'Adventskalender Samen Pflanzen'),
    ]),
    ('Für Genießer', 'geschenk', 'Süß, würzig oder heiß – für alle, die gern naschen und kochen.', [
        ('Schokoladen-Adventskalender', 'Mal Pralinen, mal Tafeln: mehr als die Billig-Schoko vom Discounter.', 'Schokolade Adventskalender Premium'),
        ('Gewürz-Adventskalender', '24 Gewürze mit Rezeptideen – für Hobbyköche.', 'Gewürz Adventskalender'),
        ('Fruchtgummi-Adventskalender', 'Bunt, vegan oder sauer – je nach Vorliebe.', 'Fruchtgummi Adventskalender'),
        ('Kakao-Adventskalender', 'Jeden Tag eine andere heiße Schokolade.', 'Trinkschokolade Adventskalender'),
        ('Popcorn- oder Snack-Adventskalender', 'Für Filmabende im Dezember.', 'Snack Adventskalender'),
    ]),
    ('Für Erwachsene und Partner', 'herz', 'Ein bisschen persönlicher – für Freundin, Freund oder die beste Freundin.', [
        ('Beauty-Adventskalender', 'Pflege, Masken und Make-up in Probiergröße.', 'Beauty Adventskalender'),
        ('Puzzle-Adventskalender', 'Jeden Tag ein Teil-Beutel, am Ende ein ganzes Motiv.', 'Puzzle Adventskalender Erwachsene'),
        ('Krimi-Adventskalender', 'Ein Buch mit 24 Kapiteln – jeden Abend ein Stück weiter.', 'Krimi Adventskalender Buch'),
        ('Wellness-Adventskalender', 'Badesalz, Kerzen, Tee – 24 kleine Auszeiten.', 'Wellness Adventskalender'),
        ('Schmuck-Adventskalender', 'Ohrringe, Ketten, Anhänger – oft mit Organizer.', 'Schmuck Adventskalender'),
    ]),
    ('Für Kinder', 'jubel', 'Spielen, forschen und basteln statt nur Schokolade.', [
        ('Bausteine-Adventskalender', 'Jeden Tag eine kleine Figur oder ein Bausatz – am Ende eine ganze Szene.', 'Bausteine Adventskalender Kinder'),
        ('Spielfiguren-Adventskalender', 'Bauernhof, Ritter, Einhorn: zum Weiterspielen nach Weihnachten.', 'Spielfiguren Adventskalender Kinder'),
        ('Experimente-Adventskalender', '24 kleine Versuche für Forscher ab 8.', 'Experimente Adventskalender Kinder'),
        ('Bastel-Adventskalender', 'Jeden Tag ein Bastelprojekt – gut für kalte Nachmittage.', 'Bastel Adventskalender Kinder'),
        ('Adventskalender-Buch', 'Eine Geschichte in 24 Kapiteln zum Vorlesen.', 'Adventskalender Buch Kinder vorlesen'),
        ('Wichtel-Adventskalender', 'Passend zur Wichteltür: Mini-Möbel und Zubehör hinter jedem Türchen.', 'Wichtel Adventskalender Miniatur'),
    ]),
    ('Zum Selbstbefüllen', 'lupe', 'Am persönlichsten: Du entscheidest, was hinter jedem Türchen steckt. Füllideen, Gutscheine und Bastelanleitungen: Adventskalender befüllen.', [
        ('Holz-Adventskalender zum Befüllen', 'Hält viele Jahre – jedes Jahr neu befüllen.', 'Adventskalender Holz zum Befüllen'),
        ('Kraftpapier-Tüten mit Zahlen', 'Günstig, schnell gepackt, an einer Schnur aufgehängt.', 'Adventskalender Tüten Kraftpapier Zahlen'),
        ('Stoffsäckchen', 'Wiederverwendbar und sieht an Zweig oder Leiter schön aus.', 'Adventskalender Stoffsäckchen'),
        ('Adventskalender-Boxen', 'Kleine Schachteln zum Stapeln oder als Häuserzeile.', 'Adventskalender Boxen zum Befüllen'),
        ('Zahlen-Sticker 1–24', 'Für Tüten, Gläser oder Umschläge.', 'Adventskalender Zahlen Sticker'),
        ('Kleine Füllideen', 'Mini-Süßes, Anhänger, Radiergummis – passend für 24 Türchen.', 'Adventskalender Füllung Kleinigkeiten'),
    ]),
]


def advent_page():
    secs, n = [], 0
    for title, st, intro, items in ADVENT:
        n += len(items)
        cards = '\n'.join(f'<div class="idea">\n  <h3>{esc(t)}</h3>\n  <p>{esc(x)}</p>\n  {product_links(*r)}\n</div>' for t, x, *r in items)
        secs.append(f'<h2 class="h-onni">{onni_img(st, "", 56, "h-onni-img")}{esc(title)}</h2>\n<p>{esc(intro)}</p>\n<div class="idea-grid">\n{cards}\n</div>')
    jump = ' · '.join(f'<a href="#ak-{i}">{esc(t)}</a>' for i, (t, *_r) in enumerate(ADVENT))
    secs = [s.replace('<h2 class="h-onni">', f'<h2 class="h-onni" id="ak-{i}">', 1) for i, s in enumerate(secs)]
    secs = [x.replace('Bastelanleitungen: Adventskalender befüllen.', 'Bastelanleitungen: <a href="/adventskalender-befuellen/">Adventskalender befüllen</a>.') for x in secs]
    body = f"""<article>
<h1>Adventskalender-Ideen: {n} Kalender für Kollegen, Erwachsene & Kinder</h1>
{ai_photo('wichtel3d-basteln', 'Plüsch-Wichtel bastelt mit buntem Papier, Bändern und Keksgläsern')}
<p class="lead">Ein Adventskalender macht 24 Tage lang Freude – viel länger als jedes andere Geschenk. Hier findest du {n} Ideen: fertige Kalender fürs Büro, für Genießer, Erwachsene und Kinder, dazu alles, um einen Adventskalender selbst zu befüllen. Wichtig: bis Ende November bestellen, damit er am 1. Dezember hängt.</p>
<p class="chips-line">Direkt zu: {jump}</p>

{chr(10).join(secs)}

<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>

<h2 id="adventskalender-wichteln">Idee: Adventskalender-Wichteln</h2>
<p>Statt eines großen Geschenks zur Bescherung beschenkt ihr euch den ganzen Dezember: Jeder zieht einen Namen und füllt für diese Person einen kleinen Kalender – zum Beispiel 24 Kleinigkeiten für zusammen 15–20 €. Für Büros reichen auch 5 Türchen für die Arbeitstage einer Woche.</p>
<ul>
  <li><b>Früh auslosen:</b> Bis Mitte November, damit genug Zeit zum Sammeln und Packen bleibt.</li>
  <li><b>Budget festlegen:</b> Gesamtbetrag statt pro Türchen – das macht es leichter.</li>
  <li><b>Wunschzettel nutzen:</b> Mit dem <a href="/wunschzettel/">Wichtel-Wunschzettel</a> weiß jeder, was ankommt.</li>
  <li><b>Gemeinsam übergeben:</b> Am 30. November oder beim ersten Treffen im Dezember.</li>
</ul>
{CTA}
<p>Mehr Ideen: <a href="/wichtelgeschenke-unter-10-euro/">Wichtelgeschenke unter 10 €</a> · <a href="/wichtelgeschenke-selber-machen/">Geschenke selber machen</a> · <a href="/wichteltuer/">Wichteltür für Kinder</a> · <a href="/geschenkfinder/">Geschenkfinder</a></p>
</article>"""
    page('/adventskalender-ideen/', f'Adventskalender-Ideen: {n} Kalender für Kollegen, Erwachsene & Kinder',
         f'Adventskalender-Ideen 2026: {n} Kalender für Kollegen, Genießer, Erwachsene und Kinder – plus Adventskalender zum Selbstbefüllen und Tipps fürs Adventskalender-Wichteln.',
         body, crumb='Adventskalender-Ideen', playful=True)


def idea_sections(groups, prefix):
    """Abschnitte mit Onni-Sticker an der Überschrift + Sprungleiste (wie Adventskalender-Ideen)."""
    secs, n = [], 0
    for i, (title, st, intro, items) in enumerate(groups):
        n += len(items)
        cards = '\n'.join(f'<div class="idea">\n  <h3>{esc(t)}</h3>\n  <p>{esc(x)}</p>\n  {product_links(*r)}\n</div>' for t, x, *r in items)
        secs.append(f'<h2 class="h-onni" id="{prefix}-{i}">{onni_img(st, "", 56, "h-onni-img")}{esc(title)}</h2>\n<p>{esc(intro)}</p>\n<div class="idea-grid">\n{cards}\n</div>')
    jump = ' · '.join(f'<a href="#{prefix}-{i}">{esc(t)}</a>' for i, (t, *_r) in enumerate(groups))
    return '\n\n'.join(secs), jump, n


DISC_SEARCH = '<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>'


def themen_pages():
    from themen import AK_FUELLEN, AK_GUTSCHEINE, AK_BASTELN, MAENNER, FRAUEN
    # Adventskalender befüllen (Google Trends: Höhepunkt Mitte–Ende November)
    secs, jump, n = idea_sections(AK_FUELLEN, 'akf')
    gut = '\n'.join(f'<li>{esc(g)}</li>' for g in AK_GUTSCHEINE)
    bast = []
    for title, intro, material, steps, note, links in AK_BASTELN:
        mats = ''.join(f'<li>{esc(m)}</li>' for m in material)
        stp = ''.join(f'<li>{esc(x)}</li>' for x in steps)
        lnk = ' · '.join(amazon_link(q, f'{t}*') for t, q in links)
        bast.append(f'''<section class="card diy">
<h3>{esc(title)}</h3>
<p>{esc(intro)}</p>
<p><b>Das brauchst du:</b></p>
<ul>{mats}</ul>
<p><b>So geht's:</b></p>
<ol>{stp}</ol>
<p class="hint">💡 {esc(note)}</p>
<p class="diy-links">Material: {lnk}</p>
</section>''')
    bast = '\n'.join(bast)
    body = f"""<article>
<h1>Adventskalender befüllen: {n} Ideen für Kinder, Erwachsene & Kollegen</h1>
{ai_photo('wichtel3d-geschenk', 'Plüsch-Wichtel mit roter Zipfelmütze hält ein Geschenk mit roter Schleife vor dem Weihnachtsbaum')}
<p class="lead">24 Türchen wollen gefüllt werden – und zwar nicht nur mit Schokolade. Hier findest du {n} Füllideen für Kinder, Erwachsene und Kollegen, dazu {len(AK_GUTSCHEINE)} Gutschein-Ideen, die nichts kosten, und das passende Zubehör. Unser Tipp: Mische Kleinigkeiten, Süßes und Gutscheine – so bleibt es bis zum 24. spannend.</p>
<p class="chips-line">Direkt zu: {jump} · <a href="#akf-basteln">Kalender selber basteln</a> · <a href="#akf-gutscheine">Gutscheine</a></p>

{secs}

<h2 id="akf-basteln">Adventskalender selber basteln: {len(AK_BASTELN)} Anleitungen</h2>
<p>Noch keinen Kalender? Diese Varianten gehen schnell und günstig – das Material bekommst du bei Amazon.</p>
{bast}

<h2 id="akf-gutscheine">Gutscheine: Türchen, die nichts kosten</h2>
<p>Schreib sie auf kleine Zettel und rolle sie zusammen – gerade bei Partnern und Familie oft die schönsten Türchen:</p>
<ul class="cols2">
{gut}
</ul>

{DISC_SEARCH}

<h2>So klappt das Befüllen</h2>
<ul>
  <li><b>Budget pro Kalender festlegen</b>, nicht pro Türchen: 24 Füllungen für 20–30 € sind gut machbar, wenn sich Kleinigkeiten, Süßes und Gutscheine abwechseln.</li>
  <li><b>Höhepunkte einplanen:</b> Am 6. (Nikolaus) und am 24. etwas Besonderes, dazwischen Kleinigkeiten.</li>
  <li><b>Früh anfangen:</b> Bis Ende November packen, dann hängt der Kalender rechtzeitig.</li>
  <li><b>Fertig statt selbst gefüllt?</b> Bei den <a href="/adventskalender-ideen/">Adventskalender-Ideen</a> findest du 28 fertige Kalender.</li>
</ul>
<p>Im Team oder in der Familie: Beim <a href="/adventskalender-ideen/#adventskalender-wichteln">Adventskalender-Wichteln</a> lost ihr aus, wer für wen einen Kalender füllt.</p>
{CTA}
</article>"""
    page('/adventskalender-befuellen/', f'Adventskalender befüllen: {n} Ideen für Kinder, Erwachsene & Kollegen',
         f'Adventskalender befüllen: {n} Füllideen für Kinder, Erwachsene und Kollegen, {len(AK_GUTSCHEINE)} Gutschein-Ideen, die nichts kosten, und {len(AK_BASTELN)} Anleitungen zum Selberbasteln.',
         body, crumb='Adventskalender befüllen', playful=True)

    for path, data, who, pron, photo, alt, lead in (
        ('/geschenke-fuer-maenner/', MAENNER, 'Männer', 'ihn', 'wichtel3d-lupe',
         'Plüsch-Wichtel betrachtet ein kleines Geschenk durch eine große Lupe',
         'Socken, Duschgel, Krawatte? Muss nicht sein. Hier findest du {n} Geschenkideen für Männer, die wirklich benutzt werden – vom Grillgewürz über kleine Technik-Helfer bis zum Multitool. Für Partner, Vater, Bruder, Freund oder Kollegen, vieles schon unter 20 €.'),
        ('/geschenke-fuer-frauen/', FRAUEN, 'Frauen', 'sie', 'wichtel3d-feder',
         'Plüsch-Wichtel schreibt mit einer Feder auf eine Pergamentrolle',
         'Mehr als Parfum und Pralinen: Hier findest du {n} Geschenkideen für Frauen – zum Entspannen, Genießen, Kreativsein und Kuscheln. Für Partnerin, Mutter, Schwester, Freundin oder Kollegin, vieles schon unter 20 €.')):
        slug = path.strip('/')
        secs, jump, n = idea_sections(data, slug[:3] + slug[-3:])
        body = f"""<article>
<h1>Geschenke für {who}: {n} Ideen, die wirklich ankommen</h1>
{ai_photo(photo, alt)}
<p class="lead">{esc(lead.format(n=n))}</p>
<p class="chips-line">Direkt zu: {jump}</p>
<p class="hint">Lieber nach Budget und Alter filtern? <a href="/geschenkfinder/">Zum Geschenkfinder mit über 100 Ideen →</a></p>

{secs}

{DISC_SEARCH}

<h2>So findest du das passende Geschenk für {pron}</h2>
<ul>
  <li><b>Vom Alltag ausgehen:</b> Was nutzt {pron} jeden Tag – und was davon nervt gerade? Eine bessere Thermoflasche, eine wärmere Decke oder ein funktionierendes Ladekabel sind oft willkommener als ein Deko-Artikel.</li>
  <li><b>Hobby statt Allerweltsgeschenk:</b> Lieber eine Kleinigkeit fürs Hobby als ein teures Standardgeschenk.</li>
  <li><b>Nachfragen erlaubt:</b> Mit unserem <a href="/wunschzettel/">Wunschzettel als Link</a> sammelt ihr Wünsche, ohne dass die Überraschung verloren geht.</li>
</ul>
<p>Wichtelt ihr? Dann helfen die Budgetseiten: <a href="/wichtelgeschenke-unter-10-euro/">unter 10 €</a> · <a href="/wichtelgeschenke-unter-20-euro/">unter 20 €</a> · <a href="/wichtelgeschenke-unter-30-euro/">unter 30 €</a></p>
{CTA}
</article>"""
        page(path, f'Geschenke für {who}: {n} Ideen, die wirklich ankommen',
             f'Geschenke für {who}: {n} Ideen zu Weihnachten und Geburtstag – Genuss, Wellness, Technik, Kreatives und Gemütliches. Für Partner, Familie, Freunde und Kollegen.',
             body, crumb=f'Geschenke für {who}', playful=True)

    # Nikolaus (05.11.): Werbung aus Onnis Adventskalender (Posts 1.–5.12. verlinken hierher)
    from themen import NIKOLAUS
    secs, jump, n = idea_sections(NIKOLAUS, 'nik')
    body = f"""<article>
<h1>Nikolaus-Geschenke: {n} Ideen für den Stiefel</h1>
{ai_photo('wichtel3d-geschenk', 'Plüsch-Wichtel mit roter Zipfelmütze hält ein Geschenk mit roter Schleife vor dem Weihnachtsbaum')}
<p class="lead">Am Abend des 5. Dezember werden die Stiefel geputzt und vor die Tür gestellt – und am Morgen des 6. Dezember liegt etwas darin. Hier findest du {n} Nikolaus-Geschenke, die in den Stiefel passen: für Kinder, für Erwachsene und für Kollegen im Büro, dazu den passenden Stiefel.</p>
<p class="chips-line">Direkt zu: {jump}</p>
<p class="hint">Mehr Ideen nach Budget und Alter: <a href="/geschenkfinder/">Zum Geschenkfinder mit über 100 Ideen →</a></p>

{secs}

{DISC_SEARCH}

<h2>So wird der Nikolaustag schön</h2>
<ul>
  <li><b>Wenig, aber liebevoll:</b> Ein Schoko-Nikolaus, Mandarinen, Nüsse und eine Kleinigkeit reichen. Das große Geschenk kommt an Weihnachten.</li>
  <li><b>Stiefel am Vorabend putzen:</b> Für Kinder gehört das Putzen am 5. Dezember dazu – dann ist die Freude am Morgen umso größer.</li>
  <li><b>Im Büro:</b> Ein kleiner Schoko-Nikolaus auf jedem Schreibtisch ist eine schöne Geste – oder ihr lost aus und <a href="/wichteln-im-buero/">wichtelt im Büro</a>.</li>
  <li><b>Wichteltür zu Hause?</b> Dann kann auch der Wichtel einen Nikolausgruß dalassen – Ideen findest du bei der <a href="/wichteltuer/">Wichteltür</a> und in <a href="/onni-adventskalender/">Onnis Adventskalender</a>.</li>
</ul>
<p>Noch mehr Advent: <a href="/adventskalender-befuellen/">Adventskalender befüllen</a> · <a href="/adventskalender-ideen/">fertige Adventskalender</a> · <a href="/wichtelgeschenke-fuer-kinder/">Wichtelgeschenke für Kinder</a></p>
{CTA}
</article>"""
    page('/nikolaus-geschenke/', f'Nikolaus-Geschenke: {n} Ideen für den Stiefel',
         f'Nikolaus-Geschenke: {n} Ideen für den Stiefel – für Kinder, Erwachsene und Kollegen, dazu Nikolausstiefel zum Befüllen. Kleine Geschenke zum 6. Dezember.',
         body, crumb='Nikolaus-Geschenke', playful=True)


    # Black Friday (Toni 07.11.): 27.11.2026, Cyber Monday 30.11. – Kasten auf der Seite des geheimen Links verlinkt hierher
    from themen import BLACKFRIDAY
    secs, jump, n = idea_sections(BLACKFRIDAY, 'bf')
    deals = 'https://www.amazon.de/deals' + (f'?tag={AMAZON_TAG}' if AMAZON_TAG else '')
    body = f"""<article>
<h1>Black Friday 2026: Wichtelgeschenke im Angebot</h1>
{ai_photo('wichtel3d-geschenk-tisch', 'Plüsch-Wichtel Onni winkt neben einem kleinen Geschenk mit roter Schleife')}
<p class="lead">Wer ohnehin Wichtelgeschenke kaufen muss, kann am Black Friday sparen: Viele Kleinigkeiten, Spiele, Decken und Technik sind in diesen Tagen reduziert. Hier findest du {n} Ideen, die zum Wichteln passen – mit einem Klick zu den aktuellen Angeboten bei Amazon.</p>
<p class="tip">📅 <b>Black Friday 2026 ist am Freitag, 27. November</b>, der Cyber Monday am <b>30. November</b>. Amazon startet seine Black-Friday-Angebote meist schon einige Tage vorher.</p>
<p class="bf-cta"><a class="btn-primary big" href="{esc(deals)}" rel="sponsored nofollow noopener" target="_blank">🏷️ Alle aktuellen Angebote bei Amazon*</a></p>
<p class="chips-line">Direkt zu: {jump}</p>

{secs}

{DISC_SEARCH}

<h2>So sparst du am Black Friday wirklich</h2>
<ul>
  <li><b>Erst das Budget, dann das Angebot:</b> Ein Schnäppchen über dem Wichtel-Budget ist kein Schnäppchen. Legt das Budget vorher fest – beim <a href="/">Auslosen</a> könnt ihr es gleich mit eintragen.</li>
  <li><b>Streichpreise prüfen:</b> Nicht jeder durchgestrichene Preis ist ein echter Rabatt. Vergleiche kurz, was das Produkt sonst kostet.</li>
  <li><b>Lieferzeit im Blick:</b> Bestell rechtzeitig vor der Bescherung – gerade in der Black-Friday-Woche kann es länger dauern.</li>
  <li><b>Gleich mit erledigen:</b> Geschenkpapier, Anhänger und den <a href="/adventskalender-befuellen/">Adventskalender</a> kannst du direkt mitbestellen.</li>
</ul>
<p>Noch nicht ausgelost, wer wen beschenkt? <a href="/">Jetzt kostenlos auslosen →</a> · Mehr Ideen: <a href="/geschenkfinder/">Geschenkfinder</a> · <a href="/wichtelgeschenke-unter-10-euro/">unter 10 €</a> · <a href="/geschenke-generator/">Geschenke-Generator</a></p>
{CTA}
</article>"""
    page('/black-friday-wichtelgeschenke/', 'Black Friday 2026: Wichtelgeschenke im Angebot',
         f'Black Friday 2026 (27.11.) und Cyber Monday (30.11.): {n} Wichtelgeschenke, die jetzt oft reduziert sind – Kleinigkeiten unter 10 €, Gemütliches, Technik, Spiele und Ideen für Kinder.',
         body, crumb='Black Friday', playful=True)


def zubehoer_page():
    secs = []
    n = 0
    for title, intro, items in ZUBEHOER:
        n += len(items)
        cards = '\n'.join(f'<div class="idea">\n  <h3>{esc(t)}</h3>\n  <p>{esc(x)}</p>\n  {product_links(*r)}\n</div>'
                          for t, x, *r in items)
        secs.append(f'<h2>{esc(title)}</h2>\n<p>{esc(intro)}</p>\n<div class="idea-grid">\n{cards}\n</div>')
    sections = '\n\n'.join(secs)
    body = f"""<article>
<h1>Wichtel-Zubehör: alles für die Wichteltür</h1>
{ai_photo('wichtel3d-tuer', 'Kleine rote Wichteltür in der Fußleiste, aus der ein Plüsch-Wichtel herausschaut')}
<p class="lead">Von der kleinen Tür bis zum leuchtenden Wichteldorf: Hier findest du {n} Ideen für Wichtel-Zubehör – Möbel, Licht, Wichtel-Post, Figuren, Bücher und Bastelmaterial. Alles im Puppenhaus-Format, vieles unter 10 €, manches für die ganz große Wichtelwelt.</p>
<p>Noch keinen Plan für die 24 Tage? Den gibt es mit Begrüßungsbrief und Wichtelnamen-Generator auf der Seite <a href="/wichteltuer/">Wichteltür: 24 Streiche</a>. Ausmalbilder und Türschilder zum Ausdrucken findest du bei den <a href="/wichtel-ausmalbilder/">Wichtel-Ausmalbildern</a>.</p>

{sections}

<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
<p class="hint">Sicherheit geht vor: Miniaturen sind oft verschluckbar – bei Kindern unter 3 Jahren außer Reichweite aufstellen.</p>

<h2>Und für die Großen: wichteln!</h2>
<p>Während der Wichtel bei den Kindern Quatsch macht, können die Erwachsenen selbst wichteln: Namen eintragen, auslosen, jeder bekommt seinen geheimen Link – kostenlos und ohne Anmeldung.</p>
{CTA}
</article>"""
    page('/wichtel-zubehoer/', 'Wichtel-Zubehör: Wichteltür, Möbel, Licht & mehr',
         f'Wichtel-Zubehör für die Wichteltür: {n} Ideen von Mini-Möbeln, Licht und Wichtel-Post bis zum leuchtenden Wichteldorf – mit Links zu Amazon.',
         body, crumb='Wichtel-Zubehör', playful=True)


# Eigener Spreadshop (08.11., Toni): wichtellos.myspreadshop.de – Kunde kauft bei sprd.net AG, wir bekommen eine Gutschrift.
# Link = /<Artikel-Pfad>?sellable=<Motiv-ID>-<Produkt>: 31 = Tasse, 6 = Männer T-Shirt (1470 = große Tasse 440 ml).
# Bilder: fotos/merch/tasse-NN.webp aus marketing/merch/tassen/. Neues Motiv = Zeile hier + Bild.
SHOP_URL = 'https://wichtellos.myspreadshop.de'
TASSEN = [
    ('Für Gewinner und Glückspilze', [
        (14, 'Wichtel-Champion', 'Für alle, die beim Wichteln jedes Jahr das beste Geschenk erwischen.', 'wichtel-champion-A3283492984258d6f', 'rnj98sqoic1b'),
        (15, 'Wichtel-Legende', 'Seit Jahren dabei, nie ein schlechtes Geschenk gemacht – das verdient eine Tasse.', 'wichtel-legende-A328349280dcff4ac', 'rnj98putdygc'),
        (16, 'Wichtel des Jahres', 'Die Auszeichnung für den Wichtel, der sich am meisten Mühe gegeben hat.', 'wichtel+des+jahres-A32834927c1313192', 'rnj98p9k1t3m'),
        (17, 'Wichtel-König', 'Für den König der Bescherung – mit Mütze statt Krone.', 'wichtel-koenig-A328349292c6c5471', 'rnj98s2c9hf5'),
        (18, 'Wichtel-Königin', 'Für die Königin der Bescherung – mit Mütze statt Krone.', 'wichtel-koenigin-A3283492929305c32', 'rnj98s1fygqa'),
        (21, 'Wichtel-Glückspilz', 'Für alle, die beim Ziehen immer Glück haben.', 'wichtel-glueckspilz-A32834927e9882040', 'rnj98pkqzoe8'),
        (20, 'Wichtel-Trophäe', 'Der Pokal für den Schreibtisch – nur mit Henkel und Kaffee drin.', 'wichtel-trophaee-A3283492907d648e8', 'rnj98rs6tc6g'),
        (19, 'Wichtel-Beute', 'Ehrlich gesagt: Das hier ist die Beute. Und sie ist gut.', 'wichtel-beute-A32834927e7188788', 'rnj98pk2nqfc'),
    ]),
    ('Mit Augenzwinkern', [
        (13, 'Lieber Wichtel, nächstes Jahr bitte einfach Bargeld.', 'Ein Wunsch, den jeder kennt – mit einem Lächeln überreicht.', 'lieber+wichtel+naechstes+jahr+bitte+bargeld-A32834927e6d65860', 'rnj98pk02rmo'),
        (12, 'Ich hab dich lieb. Aber nur, weil ich dich gezogen hab.', 'Für den Menschen, den du beim Wichteln gezogen hast.', 'ich+hab+dich+lieb+weil+ich+dich+gezogen+hab-A3283492924350818', 'rnj98s02721k'),
        (1, 'Ich wurde gewichtelt. Mehr gab’s nicht.', 'Das ehrlichste Wichtelgeschenk: Es sagt, was es ist.', 'ich+wurde+gewichtelt+mehr+gabs+nicht-A32823df501e96a7d', 'rngd3p4excal'),
    ]),
    ('Fürs Büro und fürs Schrottwichteln', [
        (3, 'Bester Wichtel der Abteilung', 'Für Kolleginnen und Kollegen, die beim Büro-Wichteln alles geben.', 'bester+wichtel+der+abteilung-A328249a9cb4e7a0a', 'rnghny0w22oa'),
        (7, 'Ich habe beim Schrottwichteln gewonnen.', 'Endlich ein Schrottwichtel-Gewinn, den man wirklich benutzt.', 'ich+habe+beim+schrottwichteln+gewonnen-A328249ab06ea6efc', 'rngho0ggl8n0'),
        (8, 'Achtung: Schrottwichtel-Geschenk', 'Umtausch ausgeschlossen – passt zu jeder Schrottwichtel-Runde.', 'achtung+schrottwichtel-geschenk-A328249aae6426153', 'rngho07ee6ab'),
    ]),
]


def shop_link(slug, mid, produkt):
    return f'{SHOP_URL}/{slug}?sellable={mid}-{produkt}'


# Alle 8 Produkte je Motiv (Spreadshop-Produkttyp, Kurzname) – Toni 08.11.: „mehr Auswahl zeigen“
MERCH_AUCH = [(1470, 'Große Tasse'), (1052, 'Panoramatasse'), (6, 'T-Shirt Herren'), (631, 'T-Shirt Damen'),
              (635, 'Bio-Shirt Unisex'), (457, 'Kinder-Shirt'), (897, '🧸 Teddy')]


def tassen_page():
    secs, n = [], 0
    for title, items in TASSEN:
        cards = []
        for nr, name, text, slug, mid in items:
            n += 1
            cards.append(f'''<div class="merch">
  <div class="merch-img"><img src="/fotos/merch/tasse-{nr:02d}.webp" alt="Motiv „{esc(name)}“ mit dem WichtelLos-Wichtel" width="440" height="440" loading="lazy" decoding="async"></div>
  <h3>{esc(name)}</h3>
  <p>{esc(text)}</p>
  <a class="btn-primary merch-btn" href="{esc(shop_link(slug, mid, 31))}" target="_blank" rel="noopener">Tasse ansehen</a>
  <p class="merch-auch-t">Auch als:</p>
  <p class="merch-auch">{''.join(f'<a href="{esc(shop_link(slug, mid, pt))}" target="_blank" rel="noopener">{esc(lbl)}</a>' for pt, lbl in MERCH_AUCH)}</p>
</div>''')
        secs.append(f'<h2>{esc(title)}</h2>\n<div class="merch-grid">\n' + '\n'.join(cards) + '\n</div>')
    body = f"""<article>
<h1>Wichtel-Tassen, T-Shirts &amp; Teddys mit Spruch</h1>
<p class="lead">Eine Tasse geht beim Wichteln immer: Sie wird jeden Tag benutzt, passt ins Büro und bringt beim Auspacken alle zum Lachen. Hier sind {n} Wichtel-Motive mit unserem WichtelLos-Wichtel – vom „Wichtel-Champion“ bis zur Bitte um Bargeld.</p>
<p class="merch-zahl"><b>{n} Motive · {n * (len(MERCH_AUCH) + 1)} Geschenke</b> – jedes Motiv als Tasse, große Tasse, Panoramatasse, T-Shirt für Herren, Damen und Kinder, Bio-Shirt und Weihnachtsteddy.</p>

{''.join(s + chr(10) + chr(10) for s in secs)}<p class="merch-all"><a class="btn-secondary" href="{SHOP_URL}/" target="_blank" rel="noopener">Alle Produkte im WichtelLos-Shop</a></p>
<p class="hint">Bestellung, Bezahlung und Versand laufen über Spreadshirt (sprd.net AG). Jedes Stück wird erst nach deiner Bestellung bedruckt. Preise, Lieferzeit und Rückgabe stehen im Shop. Mit jedem Kauf unterstützt du WichtelLos.</p>

<h2>Welche Tasse passt zu wem?</h2>
<ul>
  <li><b>Büro-Wichteln:</b> „Bester Wichtel der Abteilung“ oder „Wichtel-Champion“ – beides passt auch, wenn du die Person kaum kennst. Mehr Tipps fürs Team: <a href="/wichteln-im-buero/">Wichteln im Büro</a>.</li>
  <li><b>Schrottwichteln:</b> „Achtung: Schrottwichtel-Geschenk“ ist das einzige Schrottgeschenk, das wirklich benutzt wird. Regeln und Ideen: <a href="/schrottwichteln/">Schrottwichteln</a>.</li>
  <li><b>Familie und Freunde:</b> „Ich hab dich lieb. Aber nur, weil ich dich gezogen hab.“ – frech, aber mit Herz.</li>
  <li><b>Budget:</b> Eine Tasse passt gut in ein Wichtel-Budget von 20 €. Weitere Ideen: <a href="/wichtelgeschenke-unter-20-euro/">Wichtelgeschenke unter 20 €</a>.</li>
</ul>

<h2>Noch nicht ausgelost?</h2>
<p>Erst die Namen, dann die Tasse: Namen eintragen, auslosen, jeder bekommt seinen geheimen Link – kostenlos und ohne Anmeldung.</p>
{CTA}
</article>"""
    page('/wichtel-tassen/', 'Wichtel-Tassen, T-Shirts & Teddys mit Spruch: lustige Wichtelgeschenke',
         f'Wichtel-Tassen mit Spruch: {n} lustige Motive mit dem WichtelLos-Wichtel – Wichtel-Champion, Schrottwichtel-Geschenk, Bargeld-Wunsch. Auch als T-Shirt, Kinder-Shirt und Teddy.',
         body, crumb='Wichtel-Tassen', playful=True)


# Onnis Adventskalender (05.11., Toni): 24 Video-Geschichten ab 1.12. – Seite vorab live, damit Google sie bis Dezember kennt.
# Videos/Texte: marketing/reel/adventskalender/folge-NN/, Geschichten im Content-Projekt. Neue Folge = Titel hier eintragen.
ONNI_FOLGEN = ['Onni zieht ein', 'Onni und das Kuscheltier', 'Onni und der Keks', 'Onnis Waschtag', 'Onni im Sockenkorb', 'Onni und der Nikolaus', 'Ein Lied für Onni']
# YouTube-Links je Folge (Tag: URL), sobald der Kanal steht – Knopf „Auf YouTube ansehen“ erscheint dann automatisch
ONNI_YT = {}
# „Für die Großen“ unter dem Video – getrennt von der Geschichte, je nach Tag ein anderes Ziel (Toni 05.11.)
ONNI_GROSS = [(5, '/nikolaus-geschenke/', 'Nikolaus-Geschenke für den Stiefel'),
              (19, '/geschenkfinder/', 'Geschenkideen für Weihnachten und zum Wichteln'),
              (24, '/wichtelgeschenke-unter-10-euro/', 'Schnelle Wichtelgeschenke unter 10 €')]
ONNI_REIHE = [17, 3, 22, 9, 1, 14, 6, 20, 11, 24, 4, 15, 8, 19, 2, 12, 23, 7, 16, 5, 21, 10, 18, 13]
ONNI_SHOP = [
    ('Nikolausstiefel zum Befüllen', 'Aus Filz oder Stoff – am 5. Dezember putzen und vor die Tür stellen.', 'Nikolausstiefel zum Befüllen'),
    ('Wichteltür-Set', 'Damit Onni bei euch einziehen kann: Tür mit Leiter, Briefkasten und Fußmatte.', 'Wichteltür Set', 'B0DK3D8M31'),
    ('Adventskalender zum Befüllen', 'Hält viele Jahre – jedes Jahr neu gefüllt.', 'Adventskalender Holz zum Befüllen'),
    ('Wichtel-Bücher zum Vorlesen', 'Noch mehr Wichtel-Geschichten für die Abende im Advent.', 'Wichtel Buch Kinder Weihnachten'),
]


AK_URL = 'https://wichtellos.de/onni-adventskalender/'
AK_SHARE = f'Onnis Adventskalender: 24 Wichtel-Geschichten für Kinder, jeden Tag ein neues Türchen 🎄 {AK_URL}'


def share_row(text, betreff):
    """WhatsApp / E-Mail / Teilen-Knöpfe als reine Links (Toni 06.11.). 'Link teilen' nutzt navigator.share bzw. kopiert (site.js)."""
    wa = 'https://wa.me/?text=' + quote(text, safe='')
    mail = 'mailto:?subject=' + quote(betreff, safe='') + '&body=' + quote(text, safe='')
    return (f'<div class="share-row"><a class="sh-wa" href="{wa}" target="_blank" rel="noopener">{ICONS["whatsapp"]}Per WhatsApp schicken</a>'
            f'<a class="sh-mail" href="{mail}">{ICONS["mail"]}Per E-Mail schicken</a>'
            f'<button type="button" class="sh-copy" data-text="{esc(text)}">{ICONS["link"]}<span>Link teilen</span></button></div>')


def onni_kalender_page():
    doors = []
    for tag in range(1, 25):
        n = f'{tag:02d}'
        has = tag <= len(ONNI_FOLGEN) and (SRC / 'fotos' / 'onni' / f'folge-{n}.mp4').exists()
        titel = ONNI_FOLGEN[tag - 1] if has else ''
        href, label = next((h, l) for bis, h, l in ONNI_GROSS if tag <= bis)
        attrs = f' data-src="/fotos/onni/folge-{n}.mp4" data-poster="/fotos/onni/folge-{n}-poster.webp" data-titel="{esc(titel)}"' if has else ''
        yt = f' data-yt="{esc(ONNI_YT[tag])}"' if tag in ONNI_YT else ''
        doors.append(f'<button type="button" class="ak-door" id="tag-{tag}" data-tag="{tag}"{attrs}{yt} data-gross="{href}" data-gross-text="{esc(label)}">'
                     f'<span class="ak-num">{tag}</span><span class="ak-info">{tag}. Dezember</span></button>')
    # Türchen durcheinander wie bei einem echten Adventskalender (Toni 05.11.) – feste Reihenfolge, damit sie sich nicht ändert
    doors = '\n'.join(doors[t - 1] for t in ONNI_REIHE)
    body = f'''<article>
<h1>Onnis Adventskalender: 24 Wichtel-Geschichten für kleine und große Kinder</h1>
{ai_photo('wichtel3d-onni-kekse', 'Plüsch-Wichtel Onni steht unter dem Weihnachtsbaum neben einem Teddy vor einem Teller mit riesigen Keksen')}
<p class="lead">Onni ist der kleine Wichtel, der hinter der Wichteltür wohnt. Jede Nacht im Advent erlebt er ein kleines Abenteuer: Er wäscht seine Wäsche in einer Teetasse, findet Kekse so groß wie Wagenräder und schreibt jeden Abend einen Brief. <b>Ab dem 1. Dezember öffnet sich hier jeden Tag ein Türchen mit einer neuen Geschichte als kurzes Video</b> – kostenlos und ohne Anmeldung.</p>
<p class="tip">📅 Pünktlich wie ein Türchen: Jedes Video erscheint genau an seinem Tag um Mitternacht – Folge 1 am <b>1. Dezember</b>, Folge 24 an Heiligabend.<br>📖 <b>Ende November</b> kommen alle 24 Geschichten zusätzlich zum Vorlesen. Bis dahin kannst du schon alles vorbereiten – die Wichteltür, die Briefe und die Ausmalbilder findest du unten.</p>

<details class="ak-folgen"><summary class="btn-primary">🔔 Keine Folge verpassen</summary>
<p>Folge Onni – dann bekommst du jede neue Geschichte mit:</p>
<p class="ak-folgen-knoepfe"><a class="btn-secondary" href="https://www.instagram.com/wichtellos/" rel="noopener" target="_blank">{ICONS["instagram"]} Instagram folgen</a>
<a class="btn-secondary" href="https://www.tiktok.com/@wichtellos" rel="noopener" target="_blank">{ICONS["tiktok"]} TikTok folgen</a>
<a class="btn-secondary" href="https://www.youtube.com/@WichtelLos?sub_confirmation=1" rel="noopener" target="_blank">{ICONS["youtube"]} YouTube abonnieren</a></p>
</details>

<h2 id="kalender">Die 24 Türchen</h2>
<p>Jedes Türchen öffnet sich um Mitternacht an seinem Tag. Tippe auf ein offenes Türchen, dann startet die Geschichte.</p>
<div class="ak-grid" data-ak-jahr="2026">
{doors}
</div>
<p class="ak-msg" role="status" aria-live="polite"></p>
<section class="ak-player" id="ak-player" hidden>
  <h3 class="ak-titel"></h3>
  <video controls playsinline preload="none" width="540" height="960"></video>
  <p class="ak-links"></p>
  <div class="share-row ak-share"></div>
</section>
<h3>Onnis Adventskalender weiterschicken</h3>
<p>Kennst du Kinder, die sich über Onni freuen? Schick den Kalender direkt weiter:</p>
{share_row(AK_SHARE, 'Onnis Adventskalender 🎄')}
<p class="follow-row">Folge Onni, dann verpasst du keine Folge:<br>
    {social_links()}</p>

<h2 id="was-ist-ein-wichtel">Was ist eigentlich ein Wichtel?</h2>
<p>Bis das erste Türchen aufgeht: Hier erfahren Kinder, wie ein Wichtel aussieht, wo er wohnt und was er nachts macht, wenn alle schlafen.</p>
{video_block(VIDEO_KINDER)}
{erkl_box('kind', link=False)}
<p class="erkl-gross-link">Für die Großen: <a href="/woher-kommt-wichteln/">Was ist Wichteln? – Video und Geschichte (2 Min.)</a></p>

<h2 id="so-gehts">So funktioniert Onnis Adventskalender</h2>
<ul>
  <li><b>Jeden Abend eine Folge:</b> etwa anderthalb Minuten, mit Bildern, Erzählstimme und kleinen Geräuschen – genau richtig vor dem Schlafengehen.</li>
  <li><b>Ruhiges Ende:</b> Jede Geschichte endet mit Onnis „Gute Nacht. Bis morgen.“ – keine Spannung, die wach hält.</li>
  <li><b>Passt zur Wichteltür:</b> Onni wohnt hinter der Wichteltür – die Geschichten erzählen, was er nachts erlebt.</li>
  <li><b>Ohne Werbung in den Geschichten:</b> Onni verkauft nichts. Die Folgen sind für Kinder ab etwa 3 Jahren gedacht.</li>
</ul>

<h2 id="vorbereiten">Das kannst du schon vorbereiten</h2>
<ul>
  <li><a href="/wichteltuer/">Wichteltür</a> – so startest du, mit 24 Streichen und Begrüßungsbrief</li>
  <li><a href="/wichteltuer/#briefe">24 Briefe von Onni</a> – kostenlos als PDF</li>
  <li><a href="/wichteltuer/#wichtelname">Wichtelname-Generator</a> – falls euer Wichtel einen eigenen Namen bekommen soll</li>
  <li><a href="/wichtel-ausmalbilder/">Ausmalbilder und Sticker mit Onni</a></li>
  <li><a href="/wichtel-zubehoer/">Wichtel-Zubehör</a> – Tür, Möbel, Lichterkette</li>
</ul>

{supplies_block(ONNI_SHOP, 'Für die Großen: Du suchst noch Geschenke?')}
<p class="hint">Hier geht's direkt zu den Ideen: <a href="/nikolaus-geschenke/">Nikolaus-Geschenke</a> · <a href="/adventskalender-befuellen/">Adventskalender befüllen</a> · <a href="/wichtelgeschenke-fuer-kinder/">Geschenke für Kinder</a> · <a href="/geschenkfinder/">Geschenkfinder mit über 100 Ideen</a></p>
<p class="hint">Bilder und Erzählstimme der Geschichten sind mit KI-Unterstützung entstanden, die Geschichten haben wir selbst geschrieben.</p>
</article>'''
    page('/onni-adventskalender/', 'Onnis Adventskalender: 24 Wichtel-Geschichten für kleine und große Kinder',
         'Onnis Adventskalender: Ab 1. Dezember öffnet sich jeden Tag ein Türchen mit einer kurzen Wichtel-Geschichte als Video – kostenlos, ohne Anmeldung, passend zur Wichteltür.',
         body, crumb='Onnis Adventskalender', playful=True)


def door_page():
    plan = '\n'.join(f'<li><b>{i}. Dezember – {esc(t)}:</b> {esc(x)}</li>' for i, (t, x) in enumerate(DOOR_PLAN, 1))
    shop = '\n'.join(f'''<div class="idea">
  <h3>{esc(t)}</h3>
  <p>{esc(x)}</p>
  {product_links(*r)}
</div>''' for t, x, *r in DOOR_SHOP)
    body = f'''<article>
<h1>Wichteltür: Ideen, 24 Streiche und Zubehör</h1>
{ai_photo('wichtel3d-tuer', 'Kleine rote Wichteltür in der Fußleiste, aus der ein Plüsch-Wichtel herausschaut, davor Mehl-Fußspuren')}
<p class="lead">Ab dem 1. Dezember zieht ein Wichtel ein: Eine kleine Tür an der Fußleiste, jede Nacht ein neuer Streich – und am Morgen große Augen. Hier findest du, wie du die Wichteltür startest, einen fertigen Plan für alle 24 Tage, einen Begrüßungsbrief und das passende Zubehör.</p>
<nav class="chips jump no-print" aria-label="Auf dieser Seite">
  <a href="#briefe">📬 24 Briefe (PDF)</a>
  <a href="#vorlagen">🖨️ Druckvorlagen</a>
  <a href="#wichtelname">🏷️ Wichtelname</a>
  <a href="#streiche">😜 24 Streiche</a>
  <a href="#zubehoer">🛒 Zubehör</a>
</nav>

<h2>Was ist eine Wichteltür?</h2>
<p>Die Wichteltür ist ein Adventsbrauch aus Skandinavien, der bei uns seit einigen Jahren immer beliebter wird. Eine Miniatur-Tür wird an die Wand oder Fußleiste gestellt – dahinter wohnt im Advent ein Wichtel. Er bleibt unsichtbar, schreibt Briefe, stellt nachts kleinen Unfug an und verabschiedet sich an Heiligabend wieder. Mit dem <a href="/">Wichteln unter Erwachsenen</a> hat das wenig zu tun, aber beides lebt vom selben Zauber: Jemand tut heimlich etwas Schönes.</p>
{erkl_box('kind')}

<h2>So startest du</h2>
<ol>
  <li><b>Platz wählen:</b> Eine ruhige Ecke an der Fußleiste, gut sichtbar für die Kinder, aber nicht im Weg.</li>
  <li><b>Einzug vorbereiten:</b> Am Abend des 30. November die Tür aufstellen, Fußspuren aus Puderzucker streuen und den Begrüßungsbrief davorlegen.</li>
  <li><b>Regeln erzählen:</b> Viele Familien erzählen, dass der Wichtel nur nachts aktiv ist und seine Tür nicht geöffnet werden darf – so bleibt das Geheimnis gewahrt.</li>
  <li><b>Jeden Abend 5 Minuten:</b> Mit dem Plan unten musst du nicht täglich neu überlegen.</li>
</ol>

<h2 id="wichtelname">Wie heißt dein Wichtel?</h2>
{namegen_html()}

<h2>Der Begrüßungsbrief</h2>
<blockquote class="letter">
<p>Hallo, ihr Lieben!</p>
<p>Ich bin <span class="letter-name">[Name]</span>, euer Wichtel. Ich bin heute Nacht bei euch eingezogen, weil es hier so gemütlich ist. Bis Weihnachten wohne ich hinter meiner kleinen Tür. Ihr werdet mich nie sehen, aber ihr werdet merken, dass ich da bin – ich habe nämlich viel Quatsch im Kopf!</p>
<p>Wenn ihr mir schreiben wollt, legt einen Brief vor meine Tür. Ich antworte, so oft ich kann.</p>
<p>Euer Wichtel 🧡</p>
</blockquote>
<p class="hint">Tipp: Mit winziger Schrift oder am Computer in kleiner Schrift schreiben, auf ein kleines Stück Papier – das wirkt echt. Weitere Reime findest du bei den <a href="/wichtelgedichte/">Wichtelgedichten</a>.</p>

<h2 id="briefe">24 Briefe von Onni: jeden Tag Wichtelpost</h2>
<div class="briefe-box">
  <a href="/fotos/onni/onni-briefe-24.pdf" target="_blank" rel="noopener"><img src="/fotos/onni/onni-briefe-24-480.webp" width="480" height="679" alt="Titelseite „24 Briefe von Onni“ mit dem Wichtel Onni, der ein Geschenk hochhält" loading="lazy" decoding="async"></a>
  <div>
    <p>Vom 1. bis 24. Dezember findet euer Kind jeden Morgen einen Brief von Onni vor der Wichteltür: Er zieht ein, vertauscht Socken, probiert einen Keks, feiert Nikolaus und Lucia, schickt Rätsel und Geheimbotschaften – und verabschiedet sich an Heiligabend.</p>
    <ul>
      <li><b>24 Briefe</b> in A5, je 2 pro A4-Seite – mit Platz für den Namen eures Kindes</li>
      <li><b>„Liebe Eltern“</b> mit Onnis Steckbrief zum Ausfüllen (Spitzname, Lieblingskekse …)</li>
      <li><b>Vorbereitungsliste</b>: was ihr am Abend vorher hinlegt – an manchen Tagen gar nichts</li>
      <li><b>Bonus</b>: 5 Türschilder wie „Hier wohnt Onni“ und „Psst! Onni schläft“</li>
    </ul>
    <p><a class="btn-primary" href="/fotos/onni/onni-briefe-24.pdf" target="_blank" rel="noopener">🖨️ Alle 24 Briefe als PDF – kostenlos</a></p>
    <p class="hint">16 Seiten A4, für den privaten Gebrauch. Grafiken mit KI-Unterstützung erstellt.</p>
  </div>
</div>
{KOFI_LINE}

<h2 id="vorlagen">Druckvorlagen für die Wichteltür</h2>
<p>Fertig zum Ausdrucken – mit Onni, unserem Wichtel. Den Namen eures Wichtels tragt ihr selbst ein. Die Briefe sind klein (4 pro Seite), damit sie nach echter Wichtelpost aussehen.</p>
<div class="ausmal-grid druck-grid">
{"".join(druck_card(n, t, 679, f"Vorschau: {t}") for n, t in DRUCK_TUER)}
</div>
<p>Zum Ausmalen gibt es außerdem <a href="/wichtel-ausmalbilder/">6 Wichtel-Ausmalbilder</a> – eines davon mit Onni an der Wichteltür.</p>

<h2 id="streiche">24 Wichtel-Streiche: der Plan für den Advent</h2>
<p>Für jeden Tag eine Idee – vom Einzug am 1. Dezember bis zum Abschied an Heiligabend. Die meisten dauern abends nur 5 Minuten.</p>
<p><button type="button" class="btn-secondary" data-print>🖨️ Plan drucken</button></p>
<details class="plan-details print-open">
<summary>📋 Alle 24 Streiche anzeigen</summary>
<ol class="door-plan">
{plan}
</ol>
</details>
<p class="hint">Sicherheit geht vor: Bei kleinen Kindern keine verschluckbaren Kleinteile verwenden, Fäden nicht in Stolperhöhe spannen und Lebensmittelfarbe nur tropfenweise nehmen.</p>

<h2 id="zubehoer">Zubehör für die Wichteltür</h2>
<div class="idea-grid">
{shop}
</div>
<p><b>Noch mehr Ideen:</b> Möbel, Licht, Wichtel-Post bis zum leuchtenden Wichteldorf findest du beim <a href="/wichtel-zubehoer/">Wichtel-Zubehör</a>. Fertige Kalender für Kinder und Erwachsene: <a href="/adventskalender-ideen/">Adventskalender-Ideen</a>.</p>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>

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
{ai_photo('wichtel3d-feier', 'Drei Plüsch-Wichtel feiern an einem festlichen Tisch mit Kerzen, Keksen und Kakao')}
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
{ai_photo('wichtel3d-feder', 'Plüsch-Wichtel schreibt mit einer Feder auf eine Pergamentrolle')}
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
<p>Lieber digital? <a href="/wichtelgruss/">Wichtelgruß mit Onni per WhatsApp verschicken →</a></p>
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


# Wichtelgruß: Anlass (Überschrift, Vorschlagstext, Unterschrift, Onni-Sticker)
GRUSS = [
    {'h': 'Ich hab dich gezogen!', 't': 'Psst … du bist mein Wichtel-Los. Freu dich schon mal – mehr wird nicht verraten!', 'v': 'Dein Wichtel', 's': 'psst'},
    {'h': 'Dein Wichtel denkt an dich', 't': 'Ich weiß schon ziemlich genau, was dir gefallen könnte. Bald ist es so weit!', 'v': 'Dein Wichtel', 's': 'winkt'},
    {'h': 'Ich bin auf der Suche …', 't': 'Was magst du gerade besonders gern? Verrate es einfach ganz nebenbei – ich höre heimlich zu.', 'v': 'Dein Wichtel', 's': 'lupe'},
    {'h': 'Dein Geschenk ist unterwegs', 't': 'Nicht schütteln, nicht spicken – nur noch ein bisschen Geduld!', 'v': 'Dein Wichtel', 's': 'geschenk'},
    {'h': 'Nur noch ein paar Mal schlafen', 't': 'Dann ist Bescherung. Ich bin schon ganz aufgeregt!', 'v': 'Dein Wichtel', 's': 'schlaeft'},
    {'h': 'Rate mal, wer ich bin!', 't': 'Hinweis Nr. 1: Ich sitze gar nicht so weit weg von dir. Mehr verrate ich (noch) nicht …', 'v': 'Dein Wichtel', 's': 'lupe'},
    {'h': 'Danke, lieber Wichtel!', 't': 'Mein Geschenk hat mich riesig gefreut. Du hast genau ins Schwarze getroffen!', 'v': '', 's': 'herz'},
    {'h': 'Ausgelost – es geht los!', 't': 'Jeder hat seinen geheimen Link bekommen. Viel Spaß beim Suchen, Basteln und Verpacken!', 'v': 'Eure Wichtel-Orga', 's': 'jubel'},
    {'h': 'Frohe Weihnachten!', 't': 'Schöne Feiertage, gemütliche Stunden und ganz viel Plätzchen wünscht', 'v': 'Dein Wichtel', 's': 'daumen'},
]


def gruss_page():
    data = json.dumps(GRUSS, ensure_ascii=False).replace('</', '<\\/')
    body = f'''<article>
<h1>Wichtelgruß: digitale Karte mit Onni verschicken</h1>
<p id="gr-received" class="tip" hidden>🎁 <b>Du hast einen Wichtelgruß bekommen!</b> Wer ihn geschickt hat? Das bleibt vielleicht ein Geheimnis … Unten kannst du gleich einen Gruß zurückschicken.</p>
<p class="lead">Ein kleiner Gruß vom Wichtel macht die Wartezeit bis zur Bescherung spannender: Anlass wählen, Text anpassen – und die Karte als Bild oder Link per WhatsApp verschicken. Kostenlos, ohne Anmeldung, nichts wird gespeichert.</p>

<div class="card gruss" data-gruss>
  <script type="application/json">{data}</script>
  <div class="gr-preview"><canvas id="gr-canvas" width="1080" height="1350" role="img" aria-label="Vorschau der Wichtel-Karte"></canvas></div>
  <div class="gr-form">
    <h2>1. Anlass wählen</h2>
    <div id="gr-occ" class="gr-occs"></div>
    <h2>2. Text anpassen</h2>
    <label>Für (optional)<input id="gr-a" maxlength="30" placeholder="z. B. Anna"></label>
    <label>Dein Gruß<textarea id="gr-t" maxlength="180" rows="3"></textarea></label>
    <label>Unterschrift<input id="gr-v" maxlength="30" placeholder="z. B. Dein Wichtel"></label>
    <p class="gr-label">Farbe</p>
    <div id="gr-theme" class="gr-themes"></div>
    <h2>3. Verschicken</h2>
    <p><button type="button" id="gr-share" class="btn-primary big">📤 Als Bild teilen</button></p>
    <div class="row2">
      <button type="button" id="gr-wa" class="btn-secondary">💬 Als Link per WhatsApp</button>
      <button type="button" id="gr-copy" class="btn-secondary">🔗 Link kopieren</button>
    </div>
    <p><button type="button" id="gr-save" class="btn-secondary">💾 Bild speichern</button></p>
    <p class="hint">Die Karte entsteht nur in deinem Browser. Beim Link steckt der Text im Teil nach „#“ – er wird nie an unseren Server geschickt. Onni-Bilder: KI-generiert.</p>
  </div>
  <div id="gr-bar" class="gr-bar" aria-label="Karte verschicken">
    <button type="button" id="gr-bar-share" class="btn-primary">📤 Als Bild teilen</button>
    <button type="button" id="gr-bar-wa" class="btn-secondary">💬 Link per WhatsApp</button>
  </div>
</div>

<h2>Noch ein Geschenk dazu?</h2>
<p>Zum Gruß gehört irgendwann auch das Päckchen: <a href="/wichtelgeschenke-unter-5-euro/">Ideen unter 5 €</a> · <a href="/wichtelgeschenke-unter-10-euro/">unter 10 €</a> · <a href="/wichtelgeschenke-unter-20-euro/">unter 20 €</a> · <a href="/geschenkfinder/">Geschenkfinder mit über 100 Ideen</a></p>
{supplies_block(GRUSS_SHOP, 'Kleine Grüße zum Anfassen')}

<h2>Wann passt ein Wichtelgruß?</h2>
<ul>
  <li><b>Direkt nach dem Auslosen:</b> „Ich hab dich gezogen!“ – ohne Namen unterschrieben, sorgt das für Rätselspaß.</li>
  <li><b>In der Wartezeit:</b> Ein „Dein Wichtel denkt an dich“ zwischendurch hält die Spannung hoch – besonders beim Büro-Wichteln über mehrere Wochen.</li>
  <li><b>Für Tipps:</b> „Ich bin auf der Suche …“ lädt ein, ganz nebenbei einen Wunsch fallen zu lassen.</li>
  <li><b>Zum Raten:</b> „Rate mal, wer ich bin!“ – schick bis zur Bescherung jede Woche einen neuen Hinweis (Hinweis Nr. 1, 2, 3 …).</li>
  <li><b>Nach der Bescherung:</b> „Danke, lieber Wichtel!“ – mit eigenem Namen unterschrieben, an die ganze Gruppe oder den Wichtel direkt.</li>
</ul>
<p class="hint">Tipp: Damit dein Name geheim bleibt, schick den Gruß über jemand anderen – oder bitte die Person, die ausgelost hat, ihn weiterzuleiten. Als Link verschickt verrät die Karte nichts über dich.</p>

<h2>Noch nicht ausgelost?</h2>
{CTA}
<p>Wünsche sammeln: <a href="/wunschzettel/">Wunschzettel als Link</a> · Für die Karte zum Geschenk: <a href="/wichtelgedichte/">Wichtelgedichte</a> · Onni als <a href="/wichtel-ausmalbilder/#sticker">WhatsApp-Sticker</a> · Alles zum <a href="/wichteln-per-whatsapp/">Wichteln per WhatsApp</a></p>
</article>
<script src="/assets/gruss.js" defer></script>'''
    page('/wichtelgruss/', 'Wichtelgruß: digitale Wichtel-Karte per WhatsApp verschicken',
         'Digitaler Wichtelgruß mit Onni: Anlass wählen, Text anpassen und die Wichtel-Karte als Bild oder Link per WhatsApp verschicken – kostenlos, ohne Anmeldung.', body,
         crumb='Wichtelgruß', playful=True)


def gen_chips(label, key, options):
    chips = ''.join(f'<button type="button" class="chip" data-v="{v}" aria-pressed="false">{esc(t)}</button>' for v, t in options)
    return (f'<div class="f-group g-chips" data-k="{key}" role="group" aria-label="{esc(label)}"><span class="f-label">{esc(label)} '
            f'<span class="hint">(nichts gewählt = egal)</span></span>{chips}</div>')


def generator_page():
    """Geschenke-Generator fürs ganze Jahr (Toni 06.11.): 3 Fragen → 3 Geschenk-Lose zum Freirubbeln."""
    from geschenke import ALLE_IDEEN, ANLAESSE, ANL_HART, BUDGETS as G_BUDGETS, MAG, WER
    from hobbys import HOBBYS, BAUSTEINE
    # Ideen als eigene Datei (08.11.: mit ~1.900 handgeschriebenen Ideen wäre das HTML 440 KB) – generator.js lädt sie nach.
    # Im HTML bleiben nur Anlässe/Interessen (für die Auswahl). ?v= = Prüfsumme, damit Browser nach Änderungen neu laden.
    import hashlib
    daten = json.dumps({'ideen': ALLE_IDEEN, 'hart': ANL_HART, 'hobbys': HOBBYS, 'bausteine': BAUSTEINE}, ensure_ascii=False, separators=(',', ':'))
    (OUT / 'geschenke-daten.json').write_text(daten, encoding='utf-8')
    daten_url = '/geschenke-daten.json?v=' + hashlib.md5(daten.encode('utf-8')).hexdigest()[:8]
    data = json.dumps({'anlaesse': ANLAESSE, 'mag': MAG, 'src': daten_url}, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    # Zahl wie im Browser: handverlesene + Hobby × Baustein, doppelte Namen nur einmal
    namen = {i['n'] for i in ALLE_IDEEN}
    for h in HOBBYS:
        for b in BAUSTEINE.get(h[3], BAUSTEINE['a']):
            namen.add(b[0].replace('{L}', h[0]).replace('{K}', h[1]))
    n = len(namen)
    n_rund = f'über {n // 100 * 100:,}'.replace(',', '.')
    anl_links = ' · '.join(f'<a href="/geschenke-generator/?anlass={k}">{e} {esc(t)}</a>' for k, t, e in ANLAESSE)
    anl_opts = ''.join(f'<option value="{k}">{e} {esc(t)}</option>' for k, t, e in ANLAESSE)
    hobby_opts = ''.join(f'<option value="{esc(h[0])}">' for h in sorted(HOBBYS, key=lambda h: h[0].lower())) + ''.join(f'<option value="{esc(t)}">' for _, t in MAG)
    hobby_bsp = ' · '.join(f'<a href="/geschenke-generator/?hobby={quote(h)}">{esc(h)}</a>' for h in
                           ['Angeln', 'Kaffee', 'Harry Potter', 'Yoga', 'Grillen', 'Gaming', 'Katzen', 'Fußball', 'Stricken', 'Camping', 'Lego', 'Wein'])
    body = f'''<article>
<h1>Geschenke-Generator: Geschenkidee in 3 Klicks – für jeden Anlass</h1>
{ai_photo('wichtel3d-geschenk-tisch', 'Plüsch-Wichtel Onni winkt neben einem kleinen Geschenk mit roter Schleife')}
<p class="lead"><b>Onni bringt dir Geschenkideen!</b> Keine Idee für Geburtstag, Jahrestag, Taufe, Ruhestand oder Weihnachten? Wähle Anlass, Person, Budget und Hobby – und zieh drei <b>Geschenk-Lose zum Freirubbeln</b>. {n_rund.capitalize()} Geschenkideen zu {len(HOBBYS)} Hobbys und {len(ANLAESSE)} Anlässen – ohne Anmeldung, ohne KI und ohne dass etwas gespeichert wird.</p>
<div class="card generator" data-generator>
<script type="application/json">{data}</script>
<div class="f-group g-sel"><label class="f-label" for="g-anlass">Welcher Anlass?</label>
  <select id="g-anlass"><option value="">Egal / anderer Anlass</option>{anl_opts}</select></div>
{gen_chips('Für wen?', 'fuer', WER)}
{gen_chips('Budget', 'budget', [(str(b), f'bis {b} €') for b in G_BUDGETS])}
<div class="f-group g-sel"><label class="f-label" for="g-hobby">Was mag die Person? <span class="hint">(Hobby tippen oder aus der Liste wählen)</span></label>
  <input id="g-hobby" list="g-hobby-liste" maxlength="40" autocomplete="off" placeholder="z. B. Angeln, Kaffee, Harry Potter, Yoga …">
  <datalist id="g-hobby-liste">{hobby_opts}</datalist>
  <details class="g-bereiche"><summary>Oder einen Bereich wählen ({len(MAG)})</summary>
  {gen_chips('Bereich', 'mag', MAG)}</details></div>
<div class="g-start">
  <button type="button" id="g-los" class="g-weg-btn g-weg-rubbel"><b>🎟️ Als Rubbellose ziehen</b><span>3 Lose zum Freirubbeln – macht Spaß</span></button>
  <button type="button" id="g-direkt" class="g-weg-btn g-weg-direkt"><b>💡 Ideen direkt zeigen</b><span>3 Ideen sofort sehen, ohne Rubbeln</span></button>
</div>
<section id="g-ergebnis" hidden>
  <h2 id="g-titel">Deine Geschenk-Lose</h2>
  <p id="g-hinweis" class="hint" hidden></p>
  <div id="g-lose" class="glose"></div>
  <p class="g-unter"><button type="button" id="g-alle" class="btn-secondary">✨ Alle aufdecken</button> <button type="button" id="g-nochmal" class="btn-secondary">🎲 3 neue Ideen ziehen</button></p>
  <p class="f-label">Ideen weiterschicken – z. B. an Geschwister, die mitschenken:</p>
  <div id="g-teilen">{share_row('', 'Geschenkideen')}</div>
</section>
<section id="g-merk" class="g-merk-box" hidden>
  <h2>♥ Deine Merkliste</h2>
  <p class="hint">Bleibt nur auf diesem Gerät gespeichert.</p>
  <ul id="g-merk-liste"></ul>
  <p><a id="g-merk-wa" class="btn-secondary" target="_blank" rel="noopener">{ICONS["whatsapp"]} Merkliste per WhatsApp schicken</a></p>
</section>
</div>
<p class="tip">⏰ <b>Zu spät für die Lieferung?</b> Verschenk die Idee als <a href="/rubbellos/">Rubbellos per WhatsApp</a> – die beschenkte Person rubbelt frei, was sie bekommt, und das Geschenk kommt hinterher.</p>

<h2>So funktioniert der Geschenke-Generator</h2>
<ol>
  <li><b>Anlass, Person, Budget und Hobby wählen</b> – alles freiwillig. Je weniger du wählst, desto bunter die Lose. Das Hobby kannst du auch frei eintippen – auch wenn es nicht in der Liste steht.</li>
  <li><b>3 Lose ziehen und freirubbeln</b> – mit dem Finger oder der Maus. Wer keine Lust aufs Rubbeln hat, tippt auf „Ideen direkt zeigen“.</li>
  <li><b>Nicht das Richtige?</b> 🎲 tauscht nur dieses eine Los. Gute Ideen kommen mit ♡ auf die Merkliste.</li>
  <li><b>Teilen:</b> Schick die Ideen per WhatsApp an alle, die mitschenken – oder verschenk eine Idee direkt als Rubbellos.</li>
</ol>
<h2>Was ist anders als bei anderen Geschenke-Generatoren?</h2>
<ul>
  <li><b>Keine KI, nichts erfunden:</b> Du musst niemanden beschreiben. Die Ideen stammen aus unserer Liste – passend zu Hobby, Person und Budget sortiert, das Budget wird nie überschritten.</li>
  <li><b>Nichts wird gespeichert:</b> Die Auswahl passiert in deinem Browser. Die Merkliste bleibt auf deinem Gerät.</li>
  <li><b>Für jeden Anlass:</b> {anl_links}</li>
  <li><b>Für jedes Hobby:</b> {hobby_bsp} …</li>
</ul>
<p>Zum Wichteln gibt es außerdem den <a href="/geschenkfinder/">Wichtel-Geschenkfinder</a> mit Filtern nach Alter und Budget und die Seiten <a href="/geschenke-fuer-maenner/">Geschenke für Männer</a> und <a href="/geschenke-fuer-frauen/">Geschenke für Frauen</a>.</p>
<p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
</article>'''
    page('/geschenke-generator/', 'Geschenke-Generator: Geschenkidee in 3 Klicks für jeden Anlass',
         f'Geschenkideen per Zufall: Anlass, Person, Budget und Hobby wählen und 3 Geschenk-Lose freirubbeln – {n_rund} Ideen für Geburtstag, Weihnachten, Jahrestag, Taufe, Ruhestand & mehr. Kostenlos, ohne Anmeldung.',
         body, extra='\n<script src="/assets/rubbel.js" defer></script>\n<script src="/assets/generator.js" defer></script>',
         crumb='Geschenke-Generator')


RUBBEL_ANLAESSE = [('Geburtstag', 'Alles Gute zum Geburtstag!', '🎂'), ('Weihnachten', 'Frohe Weihnachten!', '🎄'),
                   ('Valentinstag', 'Für dich, mein Schatz', '❤️'), ('Muttertag', 'Für die beste Mama', '💐'),
                   ('Vatertag', 'Für den besten Papa', '🍺'), ('Ostern', 'Frohe Ostern!', '🐣'),
                   ('Hochzeit', 'Alles Liebe zur Hochzeit!', '💍'), ('Jahrestag', 'Auf uns!', '🥂'),
                   ('Danke', 'Danke für alles!', '🙏'), ('Wichteln', 'Dein Wichtel hat etwas für dich!', '🎁'),
                   ('Einfach so', 'Eine kleine Überraschung', '🎟️')]


def rubbellos_page():
    """Rubbellos verschicken (Toni 06.11.): Geschenk geheim hinter Rubbelschicht, Link #r=… (nur im #, nichts gespeichert)."""
    data = json.dumps(RUBBEL_ANLAESSE, ensure_ascii=False).replace('</', '<\\/')
    farben = ''.join(f'<button type="button" class="chip rl-f" data-farbe="{i}" aria-pressed="{str(i == 0).lower()}"><span class="rl-punkt rlp-{c}" aria-hidden="true"></span>{t}</button>'
                     for i, (c, t) in enumerate([('rot', 'Rot'), ('tanne', 'Tanne'), ('nacht', 'Nachtblau'), ('rosa', 'Rosa')]))
    body = f'''<article>
<div data-rubbellos>
<script type="application/json">{data}</script>
<section id="rl-empfang" hidden>
  <h1 class="sr-only">Ein Rubbellos für dich</h1>
  <p class="tip">🎟️ <b>Jemand hat dir ein Rubbellos geschickt!</b> Rubbel das goldene Feld mit dem Finger frei.</p>
  <div id="rl-gross"></div>
  <div id="rl-danach" hidden>
    <p><a class="btn-primary" href="/rubbellos/">🎟️ Selbst ein Rubbellos verschicken</a></p>
    <p class="hint">Noch auf der Suche nach einem Geschenk? Der <a href="/geschenke-generator/">Geschenke-Generator</a> zieht dir 3 Ideen.</p>
  </div>
</section>
<section id="rl-machen">
<h1>Rubbellos verschicken: Geschenk zum Freirubbeln per WhatsApp</h1>
<p id="rl-kaputt" class="tip" hidden>Dieser Rubbellos-Link ist unvollständig – vielleicht wurde er beim Kopieren abgeschnitten. Frag nach dem ganzen Link oder mach unten selbst eins.</p>
{ai_photo('wichtel3d-handy', 'Plüsch-Wichtel Onni winkt neben einem Smartphone, auf dem ein Geschenk-Symbol leuchtet')}
<p class="lead"><b>Onni überbringt dein Geschenk – als Rubbellos.</b> Kinokarten, ein Ausflug, ein Abendessen oder „Ich koche heute“: Verpack dein Geschenk als <b>digitales Rubbellos</b>. Die beschenkte Person rubbelt am Handy frei, was sie bekommt. Kostenlos, ohne Anmeldung – nichts wird gespeichert.</p>
<div class="card rl-form">
  <label>Anlass <select id="rl-anlass"></select></label>
  <label>Überschrift <input id="rl-titel-in" maxlength="50"></label>
  <label>Das Geschenk – steht unter der Rubbelschicht <input id="rl-geschenk" maxlength="60" placeholder="z. B. 🎬 Kino mit mir am Samstag!" required></label>
  <p id="rl-fehler" class="hint" hidden>Bitte schreib, was unter der Rubbelschicht stehen soll.</p>
  <label>Nachricht (optional) <textarea id="rl-text" maxlength="200" rows="2" placeholder="z. B. Ich freu mich schon auf unseren Abend."></textarea></label>
  <label>Von (optional) <input id="rl-von" maxlength="30" placeholder="z. B. Deine Lena"></label>
  <div class="f-group" role="group" aria-label="Farbe"><span class="f-label">Farbe</span>{farben}</div>
  <p class="f-label">Vorschau (aufgedeckt):</p>
  <div id="rl-vorschau"></div>
  <p><button type="button" id="rl-erstellen" class="btn-primary">🎟️ Rubbellos-Link erstellen</button></p>
  <div id="rl-ergebnis" hidden>
    <p class="f-label">Fertig! So verschickst du dein Rubbellos – der Text verrät das Geschenk nicht:</p>
    <div class="share-row"><a id="rl-wa" class="sh-wa" target="_blank" rel="noopener">{ICONS["whatsapp"]}Per WhatsApp schicken</a><a id="rl-mail" class="sh-mail">{ICONS["mail"]}Per E-Mail schicken</a><button type="button" id="rl-share" class="sh-copy" data-text="">{ICONS["link"]}<span>Link teilen</span></button></div>
    <label>Link <input id="rl-link" readonly onclick="this.select()"></label>
    <p class="hint"><a id="rl-test" target="_blank" rel="noopener">Selbst ausprobieren →</a> (öffnet die Ansicht der beschenkten Person)</p>
  </div>
</div>
<h2>So funktioniert das Rubbellos</h2>
<ol>
  <li><b>Anlass wählen und Geschenk eintragen</b> – das steht später unter der goldenen Rubbelschicht.</li>
  <li><b>Link erstellen</b> und per WhatsApp, E-Mail oder einer anderen App verschicken.</li>
  <li><b>Freirubbeln:</b> Die beschenkte Person öffnet den Link und rubbelt mit dem Finger frei – mit Konfetti.</li>
</ol>
<h2>Ideen für Rubbellose</h2>
<ul>
  <li><b>Erlebnisse:</b> Kino, Konzert, Zoo, Freizeitpark, Wellness-Tag</li>
  <li><b>Gutscheine von dir:</b> „Ich koche dein Lieblingsessen“, „Einmal Auto putzen“, „Ein Tag ohne Abwasch“</li>
  <li><b>Reisen und Ausflüge:</b> „Wir fahren ans Meer!“ – perfekt zum Verkünden</li>
  <li><b>Last Minute:</b> Das Geschenk kommt erst später? Das Rubbellos ist heute schon da.</li>
</ul>
<p>Noch keine Idee? Der <a href="/geschenke-generator/">Geschenke-Generator</a> zieht dir 3 Geschenk-Lose – für jeden Anlass.</p>
<h2>Was passiert mit meinen Daten?</h2>
<p>Nichts. Text und Geschenk stecken nur im Link nach dem #-Zeichen. Dieser Teil wird nie an unseren Server geschickt – das Rubbellos entsteht im Browser. Wer den Link hat, kann das Rubbellos öffnen, also verschick ihn nur an die richtige Person.</p>
</section>
</div>
</article>'''
    page('/rubbellos/', 'Rubbellos verschicken: Geschenk zum Freirubbeln per WhatsApp',
         'Digitales Rubbellos erstellen: Geschenk, Gutschein oder Überraschung eintragen und per WhatsApp verschicken – die beschenkte Person rubbelt am Handy frei. Kostenlos, ohne Anmeldung.',
         body, extra='\n<script src="/assets/rubbel.js" defer></script>\n<script src="/assets/rubbellos.js" defer></script>',
         crumb='Rubbellos')


def wunsch_page():
    body = f'''<article>
<h1>Wunschzettel fürs Wichteln online erstellen</h1>
<div id="wz-show" class="card wz-show" hidden>
  <p class="wz-kicker">📝 Psst, nur für deinen Wichtel …</p>
  <h2 id="wz-s-name"></h2>
  <p id="wz-s-group" class="hint"></p>
  <ol id="wz-s-list" class="wz-s-list"></ol>
  <p id="wz-s-x" class="tip" hidden></p>
  <p class="disclosure">* Werbelinks: Kaufst du darüber ein, bekommen wir eine kleine Provision. Für dich bleibt der Preis gleich – und WichtelLos bleibt kostenlos. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
  <p class="onni-says"><img src="/fotos/onni/sticker-lupe.webp" width="64" height="64" alt=""><span><b>Onni</b> meint: Ein Wunsch ist eine Idee, kein Muss – eine kleine Überraschung darf es immer sein.</span></p>
  <p><a class="btn-secondary" href="/wunschzettel/">✍️ Eigenen Wunschzettel schreiben</a></p>
</div>
<p class="lead">Du weißt nicht, was du dir wünschen sollst – und dein Wichtel erst recht nicht? Schreib bis zu 5 Wünsche auf und schick den Wunschzettel als Link in eure Wichtelgruppe. Dein Wichtel liest heimlich mit, und keiner muss raten. Kostenlos, ohne Anmeldung.</p>

<div class="card wunsch" data-wunsch>
  <div class="row2">
    <label>Dein Name<input id="wz-n" maxlength="30" placeholder="z. B. Anna"></label>
    <label>Wichtelgruppe (optional)<input id="wz-g" maxlength="40" placeholder="z. B. Büro 2026"></label>
  </div>
  <p class="gr-label">Deine Wünsche</p>
  <div id="wz-list" class="wz-list"></div>
  <label>Bitte nicht … (optional)<input id="wz-x" maxlength="80" placeholder="z. B. Süßigkeiten, Duftkerzen"></label>
  <p id="wz-err" class="error" role="alert" hidden>Bitte trag mindestens einen Wunsch ein.</p>
  <p><button type="button" id="wz-wa" class="btn-primary big">💬 Per WhatsApp in die Gruppe schicken</button></p>
  <div class="row2">
    <button type="button" id="wz-copy" class="btn-secondary">📋 Text + Link kopieren</button>
    <button type="button" id="wz-view" class="btn-secondary">👀 Vorschau ansehen</button>
  </div>
  <p><button type="button" id="wz-more" class="btn-secondary big" hidden>📤 Andere App …</button></p>
  <p class="hint">Die Wünsche stecken nur im Link (im Teil nach „#“) – sie werden nie an unseren Server geschickt und nirgends gespeichert.</p>
</div>

<h2>So klappt’s mit dem Wunschzettel</h2>
<ul>
  <li><b>Lieber Ideen als Produkte:</b> „Krimi aus Schweden“ oder „etwas für die Teepause“ lässt deinem Wichtel Spielraum – und die Überraschung bleibt.</li>
  <li><b>Ans Budget denken:</b> Bei <a href="/wichtelgeschenke-unter-10-euro/">10 €</a> passt kein Kopfhörer – kleine Wünsche machen es allen leichter.</li>
  <li><b>Größen dazuschreiben:</b> Bei Socken, Mützen oder Handschuhen spart das den Umtausch.</li>
  <li><b>„Bitte nicht“ nutzen:</b> Allergien, kein Alkohol, keine Deko – ein Satz verhindert Fehlkäufe.</li>
</ul>
<p>Noch keine Idee, was du dir wünschen sollst? Stöbere im <a href="/geschenkfinder/">Geschenkfinder</a>. Mit WichtelLos kann jeder Teilnehmer beim Auslosen auch einen kurzen „💡 Tipp“ bekommen – der steckt direkt im geheimen Link.</p>
{CTA}
<p>Passend dazu: <a href="/wichtelgruss/">Wichtelgruß mit Onni verschicken</a> · <a href="/wichtelgedichte/">Wichtelgedichte</a> · <a href="/wichteln-per-whatsapp/">Wichteln per WhatsApp</a></p>
</article>
<script src="/assets/wunsch.js" defer></script>'''
    page('/wunschzettel/', 'Wunschzettel fürs Wichteln online erstellen – per WhatsApp teilen',
         'Wichtel-Wunschzettel online schreiben: bis zu 5 Wünsche plus „Bitte nicht“, als Link per WhatsApp in die Wichtelgruppe schicken – kostenlos, ohne Anmeldung, nichts gespeichert.', body,
         crumb='Wunschzettel', playful=True)


def wissen_pages():
    """Wissens-Seiten aus wissen.py (08.11.): Anleitung, Was ist ein Wichtel, Varianten, kleine Gruppen, per Post."""
    from wissen import WISSEN
    for w in WISSEN:
        b = w['body']
        b = b.replace('<!--CTA-->', CTA).replace('<!--VIDEO_ERKLAERT-->', video_block(VIDEO_ERKLAERT))
        b = b.replace('<!--VIDEO_KINDER-->', video_block(VIDEO_KINDER)).replace('<!--ERKL_KIND-->', erkl_box('kind', link=False))
        lds = []
        if w.get('schritte'):
            b = b.replace('<!--SCHRITTE-->', '<ol class="schritte">' + ''.join(f'<li><b>{esc(t)}:</b> {esc(x)}</li>' for t, x in w['schritte']) + '</ol>')
            lds.append({'@context': 'https://schema.org', '@type': 'HowTo', 'name': w['h1'], 'description': w['desc'],
                        'step': [{'@type': 'HowToStep', 'position': n + 1, 'name': t, 'text': x} for n, (t, x) in enumerate(w['schritte'])]})
        faq = '\n'.join(f'<h3>{esc(q)}</h3>\n<p>{esc(a)}</p>' for q, a in w['faq'])
        lds.append({'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
            {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in w['faq']]})
        body = f'''<article>
<h1>{esc(w['h1'])}</h1>
{ai_photo(*w['photo'])}
<p class="lead">{esc(w['lead'])}</p>
{b}

<h2>Häufige Fragen</h2>
{faq}
</article>'''
        page(w['path'], w['title'], w['desc'], body, extra=ld(*lds), crumb=w['crumb'], mascot=w['mascot'])


def history_page():
    body = f'''<article>
<h1>Woher kommt Wichteln? Wichtel, Julklapp und Secret Santa</h1>
{ai_photo('wichtel3d-lupe', 'Plüsch-Wichtel betrachtet ein kleines Geschenk durch eine große Lupe')}
<p class="lead">Jeder zieht einen Namen, beschenkt diese Person heimlich – und erst bei der Bescherung wird geraten, wer wen hatte. Wichteln kennt man in Deutschland in fast jedem Büro und jeder Familie. Aber woher kommt der Brauch, und warum heißt er so?</p>
{video_block(VIDEO_ERKLAERT)}

<h2>Der Name: kleine Helfer aus dem Volksglauben</h2>
<p>Wichtel sind im alten Volksglauben kleine, meist unsichtbare Hausgeister. Sie erledigen nachts heimlich Arbeiten oder bringen Glück – und wollen dabei nicht gesehen werden. Genau das ist der Kern des Wichtelns: Jemand tut dir etwas Gutes, und du weißt nicht, wer es war. Verwandte Figuren sind die Heinzelmännchen aus Köln und der skandinavische Nisse oder Tomte, der bis heute zu Weihnachten gehört – und der als <a href="/wichteltuer/">Wichtel hinter der Wichteltür</a> auch bei uns im Advent einzieht.</p>
{erkl_box('kind', 'Für Kinder erklärt: Was ist ein Wichtel?')}

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
    body = body.replace('<p>Passende Reime für die Karte:', '<p>Mehr Wichtel-Wissen: <a href="/was-ist-ein-wichtel/">Was ist ein Wichtel?</a> · '
                        '<a href="/wie-funktioniert-wichteln/">Wie funktioniert Wichteln?</a> · <a href="/wichteln-varianten/">12 Wichtel-Varianten</a></p>\n<p>Passende Reime für die Karte:', 1)
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


SHARE_TEXT = ('Wichteln wir dieses Jahr? 🎄\nKostenlos auslosen, jeder bekommt seinen geheimen Link '
              'per WhatsApp, E-Mail oder zum Kopieren 🎁')


def share_page():
    """Kurze Adresse /teilen/ für Status, Posts und Aushänge: Weiterleiten mit fertigem Text (keine Daten, nicht in der Sitemap)."""
    full = f'{SHARE_TEXT}\n{DOMAIN}/'
    wa = 'https://wa.me/?text=' + quote(full, safe='')
    mail = 'mailto:?subject=' + quote('Wichteln wir dieses Jahr? 🎄', safe='') + '&body=' + quote(full, safe='')
    preview = esc(full).replace('\n', '<br>')
    body = f'''<article>
<h1>WichtelLos weiterleiten 📲</h1>
<p class="lead">Danke fürs Weitersagen! Die Nachricht ist schon fertig – du wählst nur noch aus, an wen sie geht.</p>
<div class="card">
  <p class="tip">{preview}</p>
  <p><a class="btn-primary big" href="{esc(wa)}">💬 Per WhatsApp weiterleiten</a></p>
  <div class="row2">
    <a class="btn-secondary" href="{esc(mail)}">✉️ Per E-Mail</a>
    <button type="button" class="btn-secondary" id="share-copy">🔗 Link kopieren</button>
  </div>
  <p><button type="button" class="btn-secondary big" id="share-more" hidden>📤 Andere App …</button></p>
</div>
<p>Selbst eine Gruppe auslosen? <a href="/">Zur Wichtel-Auslosung</a></p>
</article>
<script>
(() => {{
  const url = '{DOMAIN}/';
  const copyBtn = document.getElementById('share-copy');
  copyBtn.addEventListener('click', async () => {{
    try {{ await navigator.clipboard.writeText(url); }} catch {{
      const ta = document.createElement('textarea'); ta.value = url; document.body.append(ta); ta.select();
      try {{ document.execCommand('copy'); }} catch {{ /* nichts */ }} ta.remove();
    }}
    copyBtn.textContent = '✓ Kopiert'; setTimeout(() => {{ copyBtn.textContent = '🔗 Link kopieren'; }}, 1800);
  }});
  const more = document.getElementById('share-more');
  if (navigator.share) {{
    more.hidden = false;
    more.addEventListener('click', () => navigator.share({{ title: 'WichtelLos', text: {json.dumps(SHARE_TEXT, ensure_ascii=False)}, url }}).catch(() => {{}}));
  }}
}})();
</script>'''
    page('/teilen/', 'WichtelLos weiterleiten', 'Wichteln online auslosen – kostenlos und ohne Anmeldung. Hier mit einem Tipp an Freunde und Kollegen weiterleiten.',
         body, noindex=True, mascot='winkt')


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
<p>E-Mail: <a href="mailto:wichtellos@mailbox.org">wichtellos@mailbox.org</a><br>Telefon: +49 151 29522767</p>
<h2>Registereintrag</h2>
<p>Amtsgericht Charlottenburg, HRB 277995 B</p>
<h2>Umsatzsteuer-ID</h2>
<p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE457547328</p>
<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
<p>Antonio Koll, Anschrift wie oben</p>
<h2>Hinweis zu Werbelinks</h2>
<p>Diese Website enthält Affiliate-Links, die mit einem Sternchen (*) gekennzeichnet sind. Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
</article>"""
    page('/impressum/', 'Impressum | WichtelLos', 'Impressum von WichtelLos.', impressum)

    datenschutz = f"""<article>
<h1>Datenschutzerklärung</h1>
<h2>1. Verantwortlicher</h2>
<p>{COMPANY}<br>E-Mail: <a href="mailto:wichtellos@mailbox.org">wichtellos@mailbox.org</a></p>

<h2>2. Das Wichtigste in Kürze</h2>
<p>Wir verarbeiten so wenig Daten wie möglich. Es gibt kein Benutzerkonto, keine Analyse- oder Tracking-Werkzeuge und wir setzen keine Cookies.</p>

<h2>3. Hosting und Server-Protokolle</h2>
<p>Diese Website wird über GitHub Pages bereitgestellt, einen Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf einer Seite verarbeitet GitHub technisch notwendige Daten, insbesondere die IP-Adresse, aufgerufene Seite, Zeitpunkt des Zugriffs und Browserangaben, um die Website sicher und stabil auszuliefern und Angriffe abzuwehren. Wir selbst erhalten diese Daten nicht. Wie lange GitHub diese Server-Protokolle speichert, legt GitHub fest; darauf haben wir keinen Einfluss. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in der sicheren und zuverlässigen Bereitstellung der Website.</p>
<p>Dabei können Daten in die USA übermittelt werden. GitHub ist nach dem EU-US Data Privacy Framework zertifiziert (Angemessenheitsbeschluss der EU-Kommission, Art. 45 DSGVO); ergänzend verwendet GitHub Standardvertragsklauseln. Näheres in der Datenschutzerklärung von GitHub: <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">docs.github.com</a>.</p>
<p>Die Domain wird bei der IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, verwaltet (Namensauflösung, DNS).</p>

<h2>4. Die Wichtel-Auslosung</h2>
<p>Namen, Tipps zu einzelnen Personen, Gruppenname, Budget, Datum und Nachricht, die du in das Formular einträgst, werden ausschließlich in deinem Browser verarbeitet. Die Zuteilung wird codiert in den persönlichen Links gespeichert, und zwar im Teil nach dem #-Zeichen. Diesen Teil überträgt der Browser beim Aufruf nicht an unseren Server – wir erhalten von den Namen und Zuteilungen keine Kenntnis.</p>
<p>Genauso funktionieren der Wichtelgruß (/wichtelgruss/), der Wunschzettel (/wunschzettel/) und das Rubbellos (/rubbellos/): Texte, Namen und Wünsche stecken nur im Link nach dem #-Zeichen, die Grußkarte als Bild entsteht in deinem Browser. Auch die Kalenderdatei zur Bescherung erzeugt dein Browser selbst. Nichts davon wird an uns übertragen oder bei uns gespeichert.</p>
<p>Wenn du Links per WhatsApp oder E-Mail verschickst, gelten dafür die Datenschutzbestimmungen des jeweiligen Dienstes.</p>

<h2>5. Speicherung im Browser (Local Storage)</h2>
<p>Damit dein Entwurf und die zuletzt erzeugten Links nicht verloren gehen, werden sie im Local Storage deines Browsers gespeichert. Dasselbe gilt für die Merkliste im Geschenke-Generator (/geschenke-generator/). Diese Daten bleiben auf deinem Gerät und werden nicht an uns übertragen. Du kannst sie jederzeit über die Einstellungen deines Browsers löschen. Die Speicherung ist für die von dir gewünschte Funktion erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).</p>

<h2>6. Werbelinks zu Amazon, Links zu Ko-fi und zu unserem Shop</h2>
<p>Mit Sternchen (*) gekennzeichnete Links führen zu Amazon.de. Auf unserer Website werden dabei keine Cookies gesetzt. Erst wenn du einen solchen Link anklickst, verarbeitet Amazon (Amazon Europe Core S.à r.l., Luxemburg) Daten, unter anderem mithilfe von Cookies, um eine Provision zuordnen zu können. Näheres findest du in der Datenschutzerklärung von Amazon.</p>
<p>Der Knopf „WichtelLos unterstützen“ ist ein einfacher Link zu Ko-fi (Ko-fi Labs Limited, Vereinigtes Königreich). Auf unserer Website wird dabei nichts von Ko-fi geladen. Erst wenn du den Link anklickst und dort bezahlst, verarbeiten Ko-fi und der gewählte Zahlungsdienst (z. B. PayPal) deine Daten nach ihren eigenen Datenschutzerklärungen.</p>
<p>Die Links auf der Seite „Wichtel-Tassen“ (/wichtel-tassen/) führen zu unserem Shop bei Spreadshirt (wichtellos.myspreadshop.de). Auch das sind einfache Links: Auf unserer Website wird nichts von Spreadshirt geladen. Erst wenn du einen Link anklickst, gilt die Datenschutzerklärung von Spreadshirt. Bestellst du dort, ist die sprd.net AG (Leipzig) dein Vertragspartner und verarbeitet deine Bestelldaten; wir erhalten keine Daten von dir.</p>

<h2>7. Links zu Instagram, Pinterest, TikTok und YouTube</h2>
<p>Im Fußbereich und auf der Seite „Onnis Adventskalender“ verlinken wir auf unsere Profile bei Instagram, Pinterest, TikTok und YouTube. Das sind einfache Links: Auf unserer Website werden keine Inhalte, Skripte oder Schaltflächen dieser Dienste geladen, und es werden keine Daten an sie übertragen. Erst wenn du einen Link anklickst, gelten die Datenschutzbestimmungen des jeweiligen Anbieters.</p>

<h2>8. Kontakt per E-Mail</h2>
<p>Wenn du uns per E-Mail schreibst, verarbeiten wir deine Angaben, um deine Anfrage zu beantworten (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Die Daten werden gelöscht, sobald sie dafür nicht mehr benötigt werden.</p>

<h2>9. Deine Rechte</h2>
<p>Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO). Für uns zuständig ist die Berliner Beauftragte für Datenschutz und Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin, <a href="https://www.datenschutz-berlin.de/" rel="noopener">datenschutz-berlin.de</a>.</p>
<p>Stand: November 2026</p>
</article>"""
    page('/datenschutz/', 'Datenschutzerklärung | WichtelLos', 'Datenschutzerklärung von WichtelLos.', datenschutz)


BUDGET_LINKS = ', '.join(f'<a href="/wichtelgeschenke-unter-{b}-euro/">{b}</a>' for b in GIFT_BUDGETS[:-1]) + \
    f' und <a href="/wichtelgeschenke-unter-{GIFT_BUDGETS[-1]}-euro/">{GIFT_BUDGETS[-1]}</a>'

# Sichtbare FAQ und FAQPage-Daten kommen aus dieser einen Liste (Antworten dürfen Links enthalten)
FAQ = [
    ('Was ist Wichteln?', ERKL_GROSS + ' Beliebt im Büro, in der Familie, im Freundeskreis und in der Schule. ' + LINK_GROSS
     + ' · Für Kinder: <a href="/onni-adventskalender/#was-ist-ein-wichtel">Was ist ein Wichtel? (Video, 2:42)</a>'
     + ' · Regeln Schritt für Schritt: <a href="/wie-funktioniert-wichteln/">Wie funktioniert Wichteln?</a>'),
    ('Was ist ein Wichtelgenerator?', 'Ein Wichtelgenerator (auch Wichtel-Generator oder Losgenerator) lost automatisch aus, wer wen beschenkt – zufällig, fair und ohne Zettelziehen. WichtelLos ist so ein Wichtelgenerator: kostenlos, ohne Anmeldung und mit geheimem Link für jede Person.'),
    ('Wichteln, Julklapp, Secret Santa – was ist der Unterschied?', 'Keiner: Es sind verschiedene Namen für dasselbe Spiel. Julklapp sagt man vor allem in Norddeutschland und Skandinavien, Secret Santa ist der englische Name. Auslosen könnt ihr alle Varianten hier. Mehr zur Geschichte: <a href="/woher-kommt-wichteln/">Woher kommt Wichteln?</a>'),
    ('Wie läuft Wichteln ab?', 'In 5 Schritten: 1. Gruppe zusammenstellen. 2. Budget und Termin für die Bescherung festlegen. 3. Auslosen, wer wen beschenkt – zum Beispiel hier online. 4. Geschenk besorgen, verpacken und mit dem Namen des Beschenkten beschriften. 5. Bescherung: Alle Geschenke werden gemeinsam übergeben und ausgepackt. Ob ihr danach verratet, wer wessen Wichtel war, entscheidet ihr.'),
    ('Welche Regeln gelten beim Wichteln?', 'Die wichtigsten: Jeder beschenkt genau eine Person. Niemand verrät vorher, wen er gezogen hat. Alle halten sich an das vereinbarte Budget. Und das Geschenk sollte zur Person passen – im Zweifel lieber etwas Kleines zum Naschen oder Wohlfühlen als einen Scherzartikel. Lustige Spiel-Varianten sind <a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a> und <a href="/schrottwichteln/">Schrottwichteln</a>.'),
    ('Wie funktioniert Wichteln online?', 'Namen eintragen, auslosen, fertig. Jede Person bekommt einen eigenen Link. Wer ihn öffnet, sieht nur, wen er selbst beschenkt.'),
    ('Muss ich mich anmelden?', 'Nein. Weder du noch die anderen brauchen ein Konto oder eine E-Mail-Adresse.'),
    ('Wie viele Personen können mitmachen?', 'Ab 3 und bis zu 60 Personen – vom kleinen Freundeskreis bis zum großen Team oder Verein.'),
    ('Sieht der Organisator, wer wen zieht?', 'Nur, wenn er fremde Links öffnet. Tipp: Wer selbst mitmacht, öffnet einfach nur den eigenen Link – dann bleibt es auch für ihn eine Überraschung.'),
    ('Werden unsere Namen gespeichert?', 'Nicht auf unserem Server. Die Zuteilung steckt codiert im Link selbst, im Teil nach dem #-Zeichen – den schickt der Browser nicht an den Server. Damit nichts verloren geht, merkt sich nur dein eigener Browser deinen Entwurf und die zuletzt erzeugten Links.'),
    ('Kann ich Wünsche oder Tipps für den Wichtel hinterlegen?', 'Ja. Tippe neben einem Namen auf „💡 Tipp“ und notiere z. B. „mag Tee, liebt Katzen“. Den Tipp sieht nur, wer diese Person zieht – zusammen mit passenden Geschenkideen. Auch Tipps stecken nur im Link und landen nicht auf unserem Server.'),
    ('Kann ich die Wichtel-Lose ausdrucken?', 'Ja. Nach dem Auslosen auf „Lose anzeigen und drucken“ tippen: Jede Person bekommt ein Los mit ihrem Namen außen und einem QR-Code innen. Ausschneiden, falten, verteilen – wer seinen Code scannt, sieht, wen er beschenkt. Die QR-Codes entstehen direkt in deinem Browser. Für Kinder ohne Handy gibt es Lose mit dem Namen innen, mehr unter <a href="/wichteln-schule-kita/">Wichteln in Schule und Kita</a>.'),
    ('Können Paare ausgeschlossen werden?', 'Ja. Unter „Ausschlüsse“ legst du fest, wer wen nicht ziehen darf – in beide Richtungen.'),
    ('Geht Wichteln auch mit 3 Personen oder einer ungeraden Anzahl?', 'Ja. Ab 3 Personen funktioniert es, und die Anzahl muss nicht gerade sein: Es wird nicht paarweise getauscht, sondern jeder beschenkt einfach eine andere Person. Bei 5 Personen gibt es also 5 Geschenke. Niemand zieht sich selbst – darauf achtet die Auslosung automatisch.'),
    ('Kann ich jemanden nachträglich hinzufügen?', 'Ja: Person ergänzen, neu auslosen und allen die neuen Links schicken. Die alten Links funktionieren weiter und zeigen die alte Auslosung – deshalb wirklich allen die neuen Links schicken.'),
    ('Was passiert, wenn jemand seinen Link verliert?', 'Öffne WichtelLos auf dem Gerät, auf dem du ausgelost hast, und tippe auf „Letzte Auslosung wieder anzeigen“. Dort kannst du den Link erneut verschicken.'),
    ('Wann sollte man auslosen?', 'Am besten 2 bis 4 Wochen vor der Bescherung. Dann bleibt genug Zeit, ein passendes Geschenk zu finden oder zu bestellen. Für Wichteln Anfang Dezember also spätestens Mitte November auslosen.'),
    ('Wie viel sollte ein Wichtelgeschenk kosten?', f'Häufig sind es 5 bis 20 Euro, im Büro meist 10 Euro. Wichtig ist, dass sich alle vorher auf ein Budget einigen. Ideen findest du bei unseren Wichtelgeschenken unter {BUDGET_LINKS} Euro.'),
    ('Funktioniert das auch für Wichteln im Büro oder per Videocall?', 'Ja. Die Links funktionieren auf jedem Handy und Computer, niemand muss vor Ort sein. Ideal auch für Teams im Homeoffice. Tipps zu Budget, Regeln und Ablauf findest du unter <a href="/wichteln-im-buero/">Wichteln im Büro</a>.'),
    ('Kann man auch wichteln, ohne sich zu treffen?', 'Ja. Ihr lost online aus, jeder schickt sein Geschenk per Post direkt an die Person, die er gezogen hat, und beim Auspacken seid ihr per Videocall verbunden. Wichtig: Adressen vorher austauschen und den Versand rechtzeitig planen – Anfang Dezember ist die Post voll. Ist beim Auslosen ein Datum eingetragen, kann jeder den Termin von der Seite seines geheimen Links direkt in den Kalender übernehmen.'),
    ('Wie bleibt geheim, wer wessen Wichtel ist?', 'Online ausgelost sieht jeder nur, wen er selbst beschenkt. Auf das Geschenk kommt nur der Name des Beschenkten, nicht der eigene. Lass es von jemand anderem abgeben oder leg es unbemerkt zu den anderen. Und die Karte schreibst du am besten am Computer oder mit verstellter Schrift – Reime dafür gibt es bei den <a href="/wichtelgedichte/">Wichtelgedichten</a>.'),
    ('Funktioniert WichtelLos auch in Österreich und der Schweiz?', 'Ja, überall, wo Deutsch gesprochen wird – egal ob ihr Wichteln, Engerl-Bengerl oder Julklapp sagt. Das Budget kannst du in Euro oder Franken eintragen, zum Beispiel „20 CHF“. Die Geschenkideen führen zu Amazon.de, das nach Österreich und bei vielen Artikeln auch in die Schweiz liefert.'),
    ('Ist WichtelLos wirklich kostenlos?', 'Ja, komplett. Wir finanzieren uns über Werbelinks zu Geschenkideen. Für dich ändert sich am Preis nichts.'),
]

# Diese Fragen sind sofort sichtbar, alle anderen unter „Alle Fragen anzeigen“ (Toni 04.11.: Startseite kürzer).
# Im FAQPage-Schema stehen weiter alle Fragen – der Text ist auch zugeklappt auf der Seite (wortgleich).
FAQ_TOP = ['Was ist Wichteln?', 'Wie läuft Wichteln ab?', 'Wie funktioniert Wichteln online?', 'Muss ich mich anmelden?',
           'Werden unsere Namen gespeichert?', 'Können Paare ausgeschlossen werden?', 'Kann ich die Wichtel-Lose ausdrucken?',
           'Was passiert, wenn jemand seinen Link verliert?']

HOW_TO = [
    ('✏️', 'Ausfüllen', 'Gruppe, Teilnehmer und auf Wunsch Ausschlüsse eintragen (Schritt 1 bis 3 oben).'),
    ('🎲', 'Auslosen', 'Ein Klick auf „Jetzt auslosen“, und jeder bekommt einen eigenen geheimen Link.'),
    ('📲', 'Links verschicken', 'Per WhatsApp, E-Mail oder kopieren. Jeder sieht nur, wen er selbst beschenkt.'),
]


def faq_html():
    steps = '\n'.join(f'      <li data-i="{i}"><b>{esc(h)}</b> – {esc(x)}</li>' for i, h, x in HOW_TO)
    assert all(any(q == t for q, _ in FAQ) for t in FAQ_TOP), 'FAQ_TOP passt nicht zu FAQ'
    item = lambda q, a: f'      <details><summary>{esc(q)}</summary>\n        <p>{a}</p></details>'
    top = sorted((x for x in FAQ if x[0] in FAQ_TOP), key=lambda x: FAQ_TOP.index(x[0]))
    rest = [x for x in FAQ if x[0] not in FAQ_TOP]
    items = '\n'.join(item(q, a) for q, a in top) + (
        f'\n      <details class="faq-more"><summary>Alle Fragen anzeigen ({len(rest)} weitere)</summary>\n'
        + '\n'.join(item(q, a) for q, a in rest) + '\n      </details>' if rest else '')
    return f'''    <section class="how" id="so-gehts">
      <h2>So funktioniert's</h2>
      {video_block()}
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
    extra = ld(app, faq, site, video_ld())
    html = (SRC / 'tool.html').read_text(encoding='utf-8')
    html = html.replace('<!--HEAD-->', head('Wichteln online auslosen – kostenloser Wichtelgenerator',
                                             'Kostenloser Wichtelgenerator: in 1 Minute auslosen, geheime Links per WhatsApp, Tipps für den Wichtel und Lose mit QR-Code zum Ausdrucken. Ohne Anmeldung.',
                                             '/', extra))
    gift = (SRC / 'grafik' / 'wichtel-geschenk.svg').read_text(encoding='utf-8').strip()
    gift = gift.replace('<svg ', '<svg class="mascot-reveal" aria-hidden="true" width="120" height="152" ', 1)
    html = html.replace('<!--WICHTEL-GESCHENK-->', gift)
    html = html.replace('<!--VERPACKEN-->', supplies_block(WRAP, 'Schön verpacken – und geheim bleiben 🎀', note=False))
    html = html.replace('<!--HEADER-->', HEADER).replace('<!--FOOTER-->', FOOTER).replace('<!--FAQ-->', faq_html())
    (OUT / 'index.html').write_text(html, encoding='utf-8')


def extras():
    page('/404/', 'Seite nicht gefunden | WichtelLos', 'Diese Seite gibt es nicht.',
         pose_img('schlaeft', 'mascot-reveal') + '<h1>Seite nicht gefunden 😕</h1><p>Diese Seite gibt es leider nicht – Onni, unser Wichtel, hat sie wohl versteckt.</p><p><a class="btn-primary" href="/">Zur Wichtel-Auslosung</a></p>',
         noindex=True)
    shutil.move(OUT / '404' / 'index.html', OUT / '404.html')
    (OUT / '404').rmdir()
    urls = ['/'] + [f'/wichtelgeschenke-unter-{b}-euro/' for b in GIFT_BUDGETS] + ['/geschenkfinder/', '/wichtelgeschenke-fuer-kinder/', '/wichtelgeschenke-selber-machen/', '/wichteln-wuerfeln-regeln/', '/schrottwichteln/', '/wichteln-im-buero/', '/wichteln-per-whatsapp/', '/wichteln-schule-kita/', '/weihnachtsfeier-ideen/', '/wichtelgedichte/', '/woher-kommt-wichteln/', '/wie-funktioniert-wichteln/', '/was-ist-ein-wichtel/', '/wichteln-varianten/', '/wichteln-zu-dritt/', '/wichteln-per-post/', '/wichteltuer/', '/wichteln-einladung-vorlage/', '/wichtel-ausmalbilder/', '/wichtel-zubehoer/', '/wichtelgruss/', '/wunschzettel/', '/adventskalender-ideen/', '/adventskalender-befuellen/', '/geschenke-fuer-maenner/', '/geschenke-fuer-frauen/', '/onni-adventskalender/', '/nikolaus-geschenke/', '/geschenke-generator/', '/rubbellos/', '/black-friday-wichtelgeschenke/', '/wichtel-tassen/']
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        f'  <url><loc>{DOMAIN}{u}</loc><lastmod>{TODAY}</lastmod></url>\n' for u in urls) + ''.join(
        f'  <url><loc>{DOMAIN}{u}</loc><lastmod>{TODAY}</lastmod><priority>0.1</priority></url>\n'
        for u in ('/impressum/', '/datenschutz/')) + '</urlset>\n'  # Rechtstexte indexierbar (Toni 03.11., Gemini fand sie nicht)
    (OUT / 'sitemap.xml').write_text(sitemap, encoding='utf-8')
    # Kalender-Erinnerung Onnis Adventskalender (Toni 07.11.): 24× täglich 18:30 Uhr deutsche Zeit (Dezember = UTC+1)
    CRLF = chr(13) + chr(10)
    ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//WichtelLos//Onni//DE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
           'UID:onni-adventskalender-2026@wichtellos.de', 'DTSTAMP:20261107T120000Z', 'DTSTART:20261201T173000Z', 'DURATION:PT15M',
           'RRULE:FREQ=DAILY;COUNT=24', 'SUMMARY:🎄 Onnis Adventskalender: neues Türchen',
           'DESCRIPTION:Heute wartet eine neue Wichtel-Geschichte auf euch: https://wichtellos.de/onni-adventskalender/',
           'URL:https://wichtellos.de/onni-adventskalender/',
           'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Onnis Adventskalender: neues Türchen', 'TRIGGER:PT0M', 'END:VALARM',
           'END:VEVENT', 'END:VCALENDAR']
    (OUT / 'onni-erinnerung.ics').write_bytes((CRLF.join(ics) + CRLF).encode('utf-8'))
    # Suchindex (läuft komplett im Browser, keine externen Dienste)
    from gifts import IDEAS, CAT_LABELS, AGE_LABELS
    idx = [{'u': '/', 't': 'Wichteln online auslosen', 'd': 'Kostenloser Wichtelgenerator: Namen eintragen, auslosen, geheime Links per WhatsApp – ohne Anmeldung.', 'k': 'Wichtelgenerator Julklapp Secret Santa Lose drucken Ausschlüsse Tipp', 'g': 's'}]
    idx += [dict(e, g='s') for e in SEARCH if e['u'] not in ('/', '/teilen/')]
    idx += [{'u': '/geschenkfinder/?q=' + quote(i['name']), 't': i['name'], 'd': i['text'],
             'k': f"bis {i['budget']} € " + ' '.join(CAT_LABELS[c] for c in i['cats']) + ' ' + ' '.join(AGE_LABELS[a] for a in i['ages']) + (' Büro Kollegen' if i['office'] else ''),
             'g': 'i'} for i in IDEAS]
    (OUT / 'suche.json').write_text(json.dumps(idx, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    # /llms.txt (Vorschlag llmstxt.org): kurze Beschreibung für KI-Assistenten, Seiten aus der Sitemap (03.11., Toni)
    info = {e['u']: e for e in SEARCH}
    lines = ['# WichtelLos', '',
             '> WichtelLos (wichtellos.de) ist ein kostenloses Online-Tool zum Wichteln auslosen (Wichtelgenerator, Julklapp, '
             'Secret Santa) – ohne Anmeldung, ohne App, ohne Server. Namen eintragen, auslosen, jeder bekommt einen geheimen '
             'Link (z. B. per WhatsApp). Dazu Ratgeber: Wichtelgeschenke nach Budget, Geschenkfinder, Spielregeln, Vorlagen '
             'zum Ausdrucken. Sprache: Deutsch (Deutschland, Österreich, Schweiz).', '',
             'Betreiber: KOLL Commerce UG (haftungsbeschränkt), Berlin. Maskottchen: Onni, der Wichtel.',
             'Die Auslosung läuft komplett im Browser; die Zuteilung steckt nur im Link und wird nicht gespeichert. '
             'Ratgeber-Seiten enthalten Amazon-Partnerlinks (gekennzeichnet).', '',
             '## Tool', '', f'- [Wichteln online auslosen]({DOMAIN}/): kostenloser Wichtelgenerator mit geheimen Links, '
             'Ausschlüssen, Tipps pro Person, Losen zum Ausdrucken (auch ohne Handy für Kinder)', '', '## Seiten', '']
    lines += [f"- [{info[u]['t']}]({DOMAIN}{u}): {info[u]['d']}" for u in urls if u in info]
    lines += ['', '## Social', '', '- Instagram: https://www.instagram.com/wichtellos/',
              '- Pinterest: https://www.pinterest.com/wichtellos/', '- TikTok: https://www.tiktok.com/@wichtellos', '- YouTube: https://www.youtube.com/@WichtelLos', '']
    (OUT / 'llms.txt').write_text('\n'.join(lines), encoding='utf-8')
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
    # Nur den Inhalt löschen, nicht den Ordner selbst: Läuft ein Testserver in website/, ist der Ordner gesperrt –
    # rmtree brach dann mittendrin ab und ein halb leerer Stand wurde gepusht (03.11.)
    if OUT.exists():
        for p in OUT.iterdir():
            shutil.rmtree(p) if p.is_dir() else p.unlink()
    (OUT / 'assets').mkdir(parents=True)
    for f in ('style.css', 'finder.js', 'qrcode.js', 'gruss.js', 'wunsch.js', 'rubbel.js', 'generator.js', 'rubbellos.js'):
        shutil.copy(SRC / 'assets' / f, OUT / 'assets' / f)
    site_js = (SRC / 'assets' / 'site.js').read_text(encoding='utf-8')
    site_js = site_js.replace("const AMAZON_TAG = '';", f"const AMAZON_TAG = '{AMAZON_TAG}';")
    (OUT / 'assets' / 'site.js').write_text(site_js, encoding='utf-8')
    shutil.copytree(SRC / 'grafik', OUT / 'grafik')
    shutil.copytree(SRC / 'og', OUT / 'og')
    shutil.copytree(SRC / 'fotos', OUT / 'fotos')
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
    whatsapp_page()
    school_page()
    party_page()
    poems_page()
    gruss_page()
    wunsch_page()
    generator_page()
    rubbellos_page()
    history_page()
    wissen_pages()
    door_page()
    onni_kalender_page()
    ausmal_page()
    zubehoer_page()
    tassen_page()
    advent_page()
    themen_pages()
    invite_page()
    share_page()
    legal_pages()
    extras()
    print('Fertig:', sorted(str(p.relative_to(OUT)) for p in OUT.rglob('*') if p.is_file()))
    # Schutz: Dateien, die Git ignoriert, gehen nie live (02.11.: Sticker-ZIP fehlte wegen *.zip in .gitignore)
    import subprocess
    files = [p.as_posix() for p in OUT.rglob('*') if p.is_file()]
    # -z + Bytes: unter Windows würde text=True die Zeilenenden zu \r\n machen und nichts mehr passen
    ign = subprocess.run(['git', 'check-ignore', '-z', '--stdin'], input='\0'.join(files).encode(),
                         capture_output=True).stdout.decode().split('\0')
    ign = [f for f in ign if f]
    if ign:
        print('\n!!! ACHTUNG: Diese Dateien ignoriert Git – sie gehen NICHT live (.gitignore anpassen):')
        for f in ign:
            print('   ', f)


if __name__ == '__main__':
    main()
