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
.cbild{position:relative;height:269mm;aspect-ratio:768/1376;margin:0 auto}.cbild img{display:block;width:100%;height:100%}.ctitel{position:absolute;left:-12mm;right:-12mm;top:0}.hierwohnt{position:absolute;left:-10mm;right:-10mm;top:27.5%;font-size:13mm}.schild{position:absolute;left:50%;top:38.9%;width:30%;transform:translate(-50%,-50%);text-align:center;font-size:4.6mm}.schild i{display:block;border-bottom:.5mm solid #111;height:9mm;margin:0 2mm}
.gehoert{margin-top:auto;font-size:8mm;display:flex;gap:4mm;align-items:flex-end}.gehoert span{flex:1;border-bottom:.6mm solid #111;height:10mm}
.inhalt h1{font-size:12mm;margin:0 0 5mm;text-align:center}
.inhalt ol{list-style:none;padding:0;margin:0;font-size:5.1mm}
.inhalt li{display:flex;align-items:center;gap:4mm;padding:1.45mm 0;border-bottom:.2mm solid #ddd}
.inhalt li b{width:8mm;text-align:right;color:#444}.box{width:6mm;height:6mm;border:.6mm solid #111;border-radius:1.2mm;flex:none}
.inhalt .tipp{margin:4mm 0 0;text-align:center;font-size:4.2mm;color:#555}
.folge .kopf{display:flex;align-items:center;gap:6mm}
.folge .nr{font-size:20mm;width:30mm;height:30mm;border:.8mm solid #111;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none}
.folge .kopf small{font-size:6mm;color:#444}.folge .kopf h1{font-size:10mm;margin:1mm 0 0;line-height:1.1}
.folge img{display:block;margin:6mm auto 0;width:100%;height:200mm;object-fit:contain}
.folge .satz{margin:6mm 0 0;font-size:5.6mm;text-align:center}
.fuss{position:absolute;bottom:6mm;left:26mm;right:14mm;display:flex;justify-content:space-between;font-size:3.4mm;color:#777}'''

LOCH = '<div class="rand"></div><div class="loch l1"></div><div class="loch l2"></div>'


def cover(bild):
    # 22.11. Toni: Cover ohne Onni – Rundbogentür, Titel „Onni / 24 Wichtelgeschichten“, darüber „Hier wohnt“, Name ins leere Schild auf der Tür
    return (f'<section class="s cover">{LOCH}<div class="cbild"><img src="{bild}" alt="">'
            f'<div class="ctitel"><p class="umriss" style="font-size:34mm">Onni</p>'
            f'<p class="umriss" style="font-size:13mm;margin-top:3mm">24 Wichtelgeschichten</p></div>'
            f'<p class="umriss hierwohnt">Hier wohnt</p>'
            f'</div></section>')


def inhalt():
    li = ''.join(f'<li><span class="box"></span><b>{i + 1}</b> {html.escape(t)}</li>' for i, t in enumerate(TITEL))
    return (f'<section class="s inhalt">{LOCH}<h1>Meine 24 Türchen</h1><ol>{li}</ol>'
            f'<p class="tipp">Ausgemalt? Dann mach einen Haken ins Kästchen!</p>'
            f'<div class="fuss"><span>Onni – 24 Wichtelgeschichten · wichtellos.de</span><span>2</span></div></section>')


def folge(n, bild, satz):
    return (f'<section class="s folge">{LOCH}<div class="kopf"><div class="nr umriss">{n}</div>'
            f'<div><small>Türchen {n}</small><h1>{html.escape(TITEL[n - 1])}</h1></div></div>'
            f'<img src="{bild}" alt=""><p class="satz">{html.escape(satz)}</p>'
            f'<div class="fuss"><span>Onni – 24 Wichtelgeschichten · wichtellos.de</span><span>{n}</span></div></section>')


doc = (f'<!doctype html><html lang="de"><meta charset="utf-8"><title>Onni-Buch Probe</title><style>{CSS}</style><body>'
       + cover('ausmal-cover-druck.png') + inhalt()
       + folge(13, 'ausmal-13-druck.png', '„Vorsichtig stellte er seine Laterne neben das weiche Fell.“')
       + '</body></html>')
(HIER / 'probe.html').write_text(doc, encoding='utf-8')
print('probe.html geschrieben')
