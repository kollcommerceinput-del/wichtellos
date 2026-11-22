# Probe Onni-Ausmalbuch: Cover, Inhaltsverzeichnis, Beispielseite Türchen 13 → probe.html (render.js macht PDF + PNG)
import html
from pathlib import Path

HIER = Path(__file__).parent
TITEL = ['Onni zieht ein', 'Onni und das Kuscheltier', 'Onni und der Keks', 'Onnis Waschtag', 'Onni im Sockenkorb',
         'Onni und der Nikolaus', 'Ein Lied für Onni', 'Onni und der Spiegel-Wichtel', 'Onni, der Baumeister',
         'Onni und die Mandarinen-Gesichter', 'Onni und das Licht im Kühlschrank', 'Onni und der Nordstern',
         'Onni und das Lichterfest', 'Onni im Schuhchaos', 'Onni und der Wunschzettel', 'Onni hat Schnupfen',
         'Onni und die Klopapier-Girlande', 'Onni hält sein Versprechen', 'Onni und die Mehlwolke',
         'Onni packt ein Geschenk ein', 'Eine Feder von Ulla', 'Onni und der Kakao-Bart', 'Onni sagt allen Gute Nacht',
         'Onni fliegt nach Hause']

CSS = '''@font-face{font-family:Fredoka;src:url(../../../assets/fonts/fredoka-latin-600-normal.woff2)}
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Fredoka,sans-serif;color:#111}
.s{width:210mm;height:297mm;padding:14mm 14mm 14mm 26mm;position:relative;page-break-after:always;display:flex;flex-direction:column;overflow:hidden}
.loch{position:absolute;left:8mm;width:6mm;height:6mm;border:.4mm dashed #999;border-radius:50%}
.l1{top:90mm}.l2{top:170mm}
.rand{position:absolute;left:19mm;top:10mm;bottom:10mm;border-left:.3mm dotted #bbb}
.umriss{color:#fff;-webkit-text-stroke:1.1mm #111;paint-order:stroke fill;font-weight:600;line-height:1;text-align:center;margin:0}
.cbild{position:relative;height:240mm;aspect-ratio:768/1376;margin:0 auto}.cbild img{display:block;width:100%;height:100%}.ctitel{position:absolute;left:-14mm;right:-14mm;top:6%}.hierwohnt{position:absolute;left:-10mm;right:-10mm;top:27.5%;font-size:13mm}.schild{position:absolute;left:50%;top:38.9%;width:30%;transform:translate(-50%,-50%);text-align:center;font-size:4.6mm}.schild i{display:block;border-bottom:.5mm solid #111;height:9mm;margin:0 2mm}
.gehoert{margin:2mm 0 12mm;font-size:8mm;display:flex;gap:4mm;align-items:flex-end}.gehoert span{flex:1;border-bottom:.6mm solid #111;height:10mm}
.ikopf{display:flex;align-items:flex-end;justify-content:space-between;gap:6mm;margin-bottom:3mm}.ikopf img{height:62mm;margin-right:6mm}.inhalt .unter{margin:2mm 0 0;font-size:4.6mm;color:#555}.inhalt h1{font-size:8mm;margin:5mm 0 3mm}.werbung{margin-top:auto;display:flex;align-items:center;gap:5mm;border-top:.3mm solid #ccc;padding-top:3mm}.werbung img{width:22mm;height:22mm}.werbung p{margin:0;font-size:4.2mm;color:#444;line-height:1.35}.onni img{display:block;margin:0 auto;height:228mm}.mitmach{margin:4mm 0 4mm;font-size:4.8mm;text-align:center;background:#f3f3f3;border-radius:3mm;padding:2.5mm 4mm}
.inhalt ol{list-style:none;padding:0;margin:0;font-size:4.7mm}
.inhalt li{display:flex;align-items:center;gap:4mm;padding:.85mm 0;border-bottom:.2mm solid #ddd}
.inhalt li b{width:8mm;text-align:right;color:#444}.box{width:6mm;height:6mm;border:.6mm solid #111;border-radius:1.2mm;flex:none}
.inhalt .tipp{margin:4mm 0 0;text-align:center;font-size:4.2mm;color:#555}
.folge .kopf{display:flex;align-items:center;gap:6mm}
.folge .nr{font-size:20mm;width:30mm;height:30mm;border:.8mm solid #111;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none}
.folge .kopf small{font-size:6mm;color:#444}.folge .kopf h1{font-size:10mm;margin:1mm 0 0;line-height:1.1}
.folge img{display:block;margin:6mm auto 0;width:100%;height:200mm;object-fit:contain}
.folge .satz{margin:6mm 0 0;font-size:5.6mm;text-align:center}
.fuss{position:absolute;bottom:5mm;left:26mm;right:14mm;display:flex;justify-content:space-between;align-items:center;font-size:3.3mm;color:#777}.fuss .fr{display:flex;align-items:center;gap:3mm;font-size:4mm;color:#333}.fuss img{width:10mm;height:10mm}.luecke{display:inline-block;width:22mm;border-bottom:.45mm solid #111;margin:0 1mm;vertical-align:-.5mm}.folge h1 .luecke{width:34mm}'''

LOCH = '<div class="rand"></div><div class="loch l1"></div><div class="loch l2"></div>'


def luecke(t):
    # 22.11. Toni: im Buch steht nirgends „Onni“ – das Kind setzt den Namen selbst ein („1 ____ zieht ein“)
    return html.escape(t).replace('Onni', '<span class="luecke"></span>')


def fuss(nr=''):
    # dezente Werbung auf jeder Seite: Adresse + Mini-QR
    return (f'<div class="fuss"><span>Mehr Wichtel-Geschichten, Videos und Ausmalbilder: <b>wichtellos.de</b></span>'
            f'<span class="fr">{nr}<img src="qr-onni.svg" alt=""></span></div>')


def cover(bild):
    # 22.11. Toni: Cover ohne Onni-Figur und ohne „Onni“-Schriftzug – oben „24 Wichtelgeschichten“, über der Tür „Hier wohnt“ (Name ins Türschild), unten „Dieses Buch gehört“
    return (f'<section class="s cover">{LOCH}<div class="cbild"><img src="{bild}" alt="">'
            f'<div class="ctitel"><p class="umriss" style="font-size:17mm">24 Wichtelgeschichten</p></div>'
            f'<p class="umriss hierwohnt">Hier wohnt</p>'
            f'</div><div class="gehoert">Dieses Buch gehört:<span></span></div>{fuss()}</section>')


def inhalt():
    # 22.11. Toni: Seite 2 = „Meine 24 Wichtelgeschichten“ + Mitmach-Hinweis, die 24 Folgen (Namenslücke) mit Kästchen, unten wichtellos.de + QR
    li = ''.join(f'<li><span class="box"></span><b>{i + 1}</b> {luecke(t)}</li>' for i, t in enumerate(TITEL))
    return (f'<section class="s inhalt">{LOCH}<p class="umriss" style="font-size:14mm">Meine 24 Wichtelgeschichten</p>'
            f'<p class="mitmach">Gib deinem Wichtel einen Namen und schreib ihn überall in die Lücken <span class="luecke"></span> !</p>'
            f'<ol>{li}</ol>'
            f'<p class="tipp">Ausgemalt? Dann mach einen Haken ins Kästchen!</p>'
            f'<div class="werbung"><img src="qr-onni.svg" alt=""><p><b>Alle Folgen als Video und Podcast</b><br>'
            f'und jeden Tag ein neues Ausmalbild:<br>wichtellos.de/onni-adventskalender</p></div></section>')


def onni_seite():
    # 22.11. Toni: Seite 3 = Onni als ganze Ausmalseite
    # Toni: keine Überschrift, keinen Namen – nur die Figur (das Kind gibt ihr selbst einen Namen)
    return (f'<section class="s onni">{LOCH}<img src="ausmal-onni-druck.png" alt="">'
            f'<div class="gehoert">Mein Wichtel heißt:<span></span></div>{fuss()}</section>')


def folge(n, bild, satz):
    return (f'<section class="s folge">{LOCH}<div class="kopf"><div class="nr umriss">{n}</div>'
            f'<div><small>Türchen {n}</small><h1>{luecke(TITEL[n - 1])}</h1></div></div>'
            f'<img src="{bild}" alt=""><p class="satz">{html.escape(satz)}</p>'
            f'{fuss(n)}</section>')


# Sätze unter dem Bild (aus der Geschichte, ohne den Namen „Onni“) – fehlt einer, bleibt die Zeile leer
SAETZE = {1: '„Eine Wichteltür! Hier wohne ich ab jetzt!“',
          2: '„Vorsichtig tastete er sich näher.“',
          3: '„Unter dem Weihnachtsbaum stand ein Teller mit Keksen.“',
          4: '„Dann rubbelte und schrubbte er, bis es überall schäumte.“',
          5: '„Socken sind ja wie riesige Decken!“',
          6: '„Das riecht nach … Nikolaus!“',
          7: '„Im Wichtelwald singen wir jetzt alle zusammen.“',
          8: '„Das bin ja ich! Das ist ein Spiegel!“',
          9: '„Daraus baue ich den höchsten Turm, den ein Wichtel je gebaut hat!“',
          10: '„Welches Gesicht würdest du malen?“',
          11: '„Wer macht da drin bloß das Licht an und aus?“',
          12: '„Der Nordstern!“, flüsterte er.',
          13: '„Vorsichtig stellte er seine Laterne neben das weiche Fell.“',
          14: '„So geht das nicht. Da muss ein Wichtel helfen!“',
          15: '„Oh! Psst! Wunschzettel sind geheim.“',
          16: '„Ha … ha … HATSCHI!“',
          17: '„Du bekommst jetzt auch etwas Schönes!“',
          18: '„Hier ist sie wieder. Ich habe es doch versprochen.“',
          19: '„Hihi! Jetzt bin ich ein Schneewichtel!“',
          20: '„Dann packe ich eben auch eins ein!“',
          21: '„Schnee. Tannen. Wichtelwald.“',
          22: '„Was meinst du, welche Farbe hat sein Bart jetzt?“',
          23: '„Du bist mein bester Freund hier.“',
          24: '„Danke, dass ich bei euch wohnen durfte.“'}
QUELLE = Path('G:/Video bauen Projekte/Ausmalbuch')


def druckbild(n):
    """ausmal-NN.jpg aus Flow → ×3 hochskaliert, Schwarz/Weiß geschärft, leerer Rand oben abgeschnitten."""
    from PIL import Image, ImageOps
    src, ziel = QUELLE / f'ausmal-{n:02d}.jpg', HIER / f'ausmal-{n:02d}-druck.png'
    if not src.exists():
        return None
    if not ziel.exists() or ziel.stat().st_mtime < src.stat().st_mtime:
        im = Image.open(src).convert('L')
        bb = ImageOps.invert(im.point(lambda v: 255 if v > 200 else 0)).getbbox()
        if bb:
            im = im.crop((0, max(0, bb[1] - 30), im.width, min(im.height, bb[3] + 10)))
        im = im.resize((im.width * 3, im.height * 3), Image.LANCZOS).point(lambda v: 255 if v > 150 else (0 if v < 90 else v))
        im.save(ziel)
    return ziel.name


seiten = [folge(n, b, SAETZE.get(n, '')) for n in range(1, 25) if (b := druckbild(n))]
doc = (f'<!doctype html><html lang="de"><meta charset="utf-8"><title>Onni-Buch Probe</title><style>{CSS}</style><body>'
       + cover('ausmal-cover-druck.png') + inhalt() + onni_seite() + ''.join(seiten)
       + '</body></html>')
(HIER / 'probe.html').write_text(doc, encoding='utf-8')
print('probe.html geschrieben,', len(seiten), 'Türchen-Seiten')
