"""Produktfotos für /wichtel-tassen/ übernehmen (Toni 09.11.).

Ablauf: Liste + Fotos kommen aus dem echten Chrome (Spreadshirt sperrt Bilder für Skripte):
  marketing/merch/shop-fotos/liste.json  – je Produkt: pt, k (Design-ID), slug, idea (Sellable), titel
  F:/Download/wl-<pt>-<k>.jpg           – Produktfoto 500×500
Dieses Skript macht daraus fotos/merch/shop/<pt>-<k>.webp (400 px) und shop_daten.py.
  python tools/shop_fotos.py [Download-Ordner]
"""
import html, json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUELLE = sys.argv[1] if len(sys.argv) > 1 else 'F:/Download'
ZIEL = os.path.join(ROOT, 'fotos', 'merch', 'shop')
os.makedirs(ZIEL, exist_ok=True)

liste = json.load(open(os.path.join(ROOT, 'marketing', 'merch', 'shop-fotos', 'liste.json'), encoding='utf-8'))
PRODUKT = {'31': 'Tasse', '1470': 'Große Tasse 440 ml', '6': 'Männer T-Shirt', '20': 'Männer Premium Bio Hoodie',
           '897': 'Weihnachtsteddy'}

# Reihenfolge: Tassen-Sprüche wie auf der alten Seite, dann Shirt-Sprüche
import re  # noqa: E402
_tassen = open(os.path.join(ROOT, 'build.py'), encoding='utf-8').read().split('TASSEN = [', 1)[1].split('\n]\n', 1)[0]
reihe = re.findall(r"-A([0-9a-f]{16})'", _tassen)

daten, fehlt = {}, []
for e in liste:
    pt, k = e['pt'], e['k']
    name = html.unescape(e['titel'])
    if name.endswith(' ' + PRODUKT[pt]):
        name = name[: -len(PRODUKT[pt]) - 1]
    name = name.replace("'", '’').replace(', rot-grün', '').replace(' – rot-grün', '')
    src = os.path.join(QUELLE, f'wl-{pt}-{k}.jpg')
    if not os.path.exists(src):
        fehlt.append(src)
        continue
    im = Image.open(src).convert('RGB').resize((400, 400), Image.LANCZOS)
    im.save(os.path.join(ZIEL, f'{pt}-{k}.webp'), 'WEBP', quality=80, method=6)
    daten.setdefault(pt, []).append((k, e['slug'], e['idea'], name))

for pt in daten:
    daten[pt].sort(key=lambda x: (reihe.index(x[0]) if x[0] in reihe else 100, 'rot-gr' in x[1], x[3]))

with open(os.path.join(ROOT, 'shop_daten.py'), 'w', encoding='utf-8') as f:
    f.write('# Erzeugt von tools/shop_fotos.py – nicht von Hand ändern.\n')
    f.write('# Je Produkttyp: (Design-ID, Artikel-Pfad, Sellable-ID, Spruch); Bild fotos/merch/shop/<pt>-<Design-ID>.webp\n')
    f.write('SHOP_PRODUKTE = {\n')
    for pt, items in daten.items():
        f.write(f'    {pt!r}: [\n')
        for it in items:
            f.write(f'        {it!r},\n')
        f.write('    ],\n')
    f.write('}\n')

print(f'{sum(len(v) for v in daten.values())} Fotos, fehlend: {len(fehlt)}')
for x in fehlt[:5]:
    print('  fehlt', x)
