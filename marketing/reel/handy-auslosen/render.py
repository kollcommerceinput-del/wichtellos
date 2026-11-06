"""Reel „Wichteln per WhatsApp – Handy“ (06.11., Toni): echte Bildschirme, Wischen nach oben, Tippen, seitlich weiter.
python render.py            -> reel-handy-auslosen.mp4 (1080x1920, 30 fps, ohne Ton)
python render.py 3.0 12.0   -> nur Standbilder bei 3,0 s und 12,0 s nach standbild-*.png
"""
import json, os, subprocess, sys, wave
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

D = Path(__file__).parent
FPS, W, H = 30, 1080, 1920
SCHNELL = os.environ.get('SCHNELL') == '1'  # TikTok ~15 s: schnellere Stimme (stimme-schnell/), kürzere Pausen
STIMME = os.environ.get('STIMME') == '1' or SCHNELL   # Fassung „nur Handy + Stimme“ (Toni 06.11.)
SDIR = 'stimme-schnell' if SCHNELL else 'stimme'
SW = 880 if STIMME else 700    # Breite des Handy-Bildschirms im Video
K = SW / 1080                  # Faktor 1080er Bildschirmfoto -> Video
SH = round(2340 * K)
SX, SY = (W - SW) // 2, ((H - round(2340 * SW / 1080)) // 2 if STIMME else 330)
FFMPEG = 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
POS = json.loads((D / 'lang/pos.json').read_text(encoding='utf-8'))
BG = (255, 248, 240)


def lade(p, w=SW):
    im = Image.open(p).convert('RGB')
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)


toni = D / 'toni'
chrome = Image.open(toni / 'Screenshot_20261106_175305_Chrome.jpg').convert('RGB')
edge = Image.open(toni / 'Screenshot_20261106_175820_Edge.jpg').convert('RGB')
CH_TOP, CH_BOT = lade_bar = (chrome.crop((0, 0, 1080, 275)), chrome.crop((0, 2185, 1080, 2340)))
ED_TOP, ED_BOT = edge.crop((0, 0, 1080, 262)), edge.crop((0, 2020, 1080, 2340))
LANG = {k: lade(D / f'lang/{k}.png') for k in ('a-formular', 'b-ergebnis', 'c-link', 'd-aufgedeckt')}
WA = {k: lade(D / f'frames/{k}.png') for k in ('w1-kontakt', 'w2-schreiben', 'w3-gesendet')}
TXT = [Image.open(D / f'texte/t{i}.png').convert('RGBA') for i in range(9)]
ENDE = Image.open(D / 'texte/ende.png').convert('RGB')


def bildschirm(art, name=None, scroll=0.0):
    """Ein Handy-Bildschirm 1080x2340 (vor Skalierung): Browserleisten + Seitenausschnitt ab scroll (CSS-px)."""
    if art == 'wa':
        return WA[name]
    top, bot = (CH_TOP, CH_BOT) if art == 'chrome' else (ED_TOP, ED_BOT)
    t, b = lade_top(top), lade_top(bot)
    seite = LANG[name]
    vh = SH - t.height - b.height
    y = int(scroll * 3 * K)
    y = max(0, min(y, seite.height - vh))
    out = Image.new('RGB', (SW, SH), (255, 255, 255))
    out.paste(seite.crop((0, y, SW, y + vh)), (0, t.height))
    out.paste(t, (0, 0)); out.paste(b, (0, SH - b.height))
    return out


_cache = {}


def lade_top(im):
    k = id(im)
    if k not in _cache:
        _cache[k] = im.resize((SW, round(im.height * K)), Image.LANCZOS)
    return _cache[k]


def ease(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3   # Schwung, dann weich abbremsen


# Szenen: (start, ende, text, art, seite, scroll_von, scroll_bis, [aktionen])
# Aktion: ('wisch', t0, t1) Finger wischt hoch | ('tipp', t, x, y) x/y in 1080er Bildschirmkoordinaten
G, N, KN = POS['gruppe']['y'], POS['namen']['y'], POS['knopf']['y']
TOPCH = 275 / 3   # CSS-Höhe der Chrome-Leiste
SZ = [
    (0.0, 2.6, 0, 'chrome', 'a-formular', 0, 0, []),
    (2.6, 5.0, 1, 'chrome', 'a-formular', 0, G - 150, [('wisch', 2.8, 3.6)]),
    (5.0, 7.6, 2, 'chrome', 'a-formular', G - 150, N - 120, [('wisch', 5.2, 6.0)]),
    (7.6, 10.2, 3, 'chrome', 'a-formular', N - 120, KN - 420, [('wisch', 7.8, 8.6), ('tipp', 9.4, 540, (420 + 29) * 3 + 275)]),
    (10.2, 12.8, 4, 'chrome', 'b-ergebnis', 0, 0, [('tipp', 12.2, POS['ergebnis']['x'] * 3, POS['ergebnis']['y'] * 3 + 275)]),
    (12.8, 14.6, 5, 'wa', 'w1-kontakt', 0, 0, [('tipp', 13.6, 600, 1125), ('tipp', 14.2, 975, 2085)]),
    (14.6, 16.2, 5, 'wa', 'w2-schreiben', 0, 0, [('tipp', 15.6, 975, 2095)]),
    (16.2, 18.6, 6, 'wa', 'w3-gesendet', 0, 0, [('tipp', 18.0, 600, 1560)]),
    (18.6, 20.6, 7, 'edge', 'c-link', 0, 0, [('tipp', 19.8, POS['btn']['x'] * 3, POS['btn']['y'] * 3 + 262 + 90)]),
    (20.6, 23.2, 8, 'edge', 'd-aufgedeckt', 0, 0, []),
]
DUR = 26.0
if STIMME:
    L = []
    for n in range(9):
        with wave.open(str(D / f'{SDIR}/s{n}.wav')) as w:
            L.append(w.getnframes() / w.getframerate())
    GAP = [0.15, 0.15, 0.15, 0.2, 0.15, 0.6, 0.15, 0.35, 0.0] if SCHNELL else [0.25, 0.25, 0.25, 0.35, 0.25, 1.3, 0.35, 0.6, 0.0]
    WD, TD, W1, W2 = (0.5, 0.9, 0.85, 0.65) if SCHNELL else (0.8, 1.7, 1.4, 1.0)
    st = [0.2 if SCHNELL else 0.3]
    for n in range(8):
        st.append(st[-1] + L[n] + GAP[n])
    START = st
    a = st[5]
    SZ = [
        (0.0, st[1], 0, 'chrome', 'a-formular', 0, 0, []),
        (st[1], st[2], 1, 'chrome', 'a-formular', 0, G - 150, [('wisch', st[1] + 0.05, st[1] + 0.05 + WD)]),
        (st[2], st[3], 2, 'chrome', 'a-formular', G - 150, N - 120, [('wisch', st[2] + 0.05, st[2] + 0.05 + WD)]),
        (st[3], st[4], 3, 'chrome', 'a-formular', N - 120, KN - 420, [('wisch', st[3] + 0.05, st[3] + 0.05 + WD), ('tipp', st[3] + TD, 540, (420 + 29) * 3 + 275)]),
        (st[4], a, 4, 'chrome', 'b-ergebnis', 0, 0, [('tipp', a - 0.35, POS['ergebnis']['x'] * 3, POS['ergebnis']['y'] * 3 + 275)]),
        (a, a + W1, 5, 'wa', 'w1-kontakt', 0, 0, [('tipp', a + W1 * 0.4, 600, 1125), ('tipp', a + W1 * 0.8, 975, 2085)]),
        (a + W1, a + W1 + W2, 5, 'wa', 'w2-schreiben', 0, 0, [('tipp', a + W1 + W2 * 0.7, 975, 2095)]),
        (a + W1 + W2, st[6], 6, 'wa', 'w3-gesendet', 0, 0, [('tipp', st[6] - 0.3, 600, 1560)]),
        (st[6], st[7], 7, 'edge', 'c-link', 0, 0, [('tipp', st[6] + (0.6 if SCHNELL else 1.0), POS['btn']['x'] * 3, POS['btn']['y'] * 3 + 262 + 90)]),
        (st[7], st[8], 8, 'edge', 'd-aufgedeckt', 0, 0, []),
    ]
    DUR = st[8] + L[8] + (0.5 if SCHNELL else 0.9)
SEITLICH = {5, 8}   # Szenen, die von rechts hereingeschoben werden (App-Wechsel)


_sh = Image.new('RGBA', (SW + 80, SH + 80), (0, 0, 0, 0)); ImageDraw.Draw(_sh).rounded_rectangle((40, 50, SW + 40, SH + 40), 54, fill=(43, 27, 23, 90))
SCHATTEN = _sh.filter(ImageFilter.GaussianBlur(22))
MASKE = Image.new('L', (SW, SH), 0); ImageDraw.Draw(MASKE).rounded_rectangle((0, 0, SW - 1, SH - 1), 46, fill=255)


def finger(c, x, y, a=1.0, r=40):
    ov = Image.new('RGBA', c.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, int(150 * a)), outline=(60, 60, 60, int(170 * a)), width=4)
    c.alpha_composite(ov)


def frame(t):
    c = Image.new('RGBA', (W, H), BG + (255,))
    if t >= SZ[-1][1]:
        e = ENDE.copy().convert('RGBA')
        if t < SZ[-1][1] + 0.4:
            c.alpha_composite(Image.blend(c, e, (t - SZ[-1][1]) / 0.4)); return c.convert('RGB')
        return e.convert('RGB')
    i = max(k for k, s in enumerate(SZ) if s[0] <= t)
    a0, a1, ti, art, name, s0, s1, akt = SZ[i]
    wisch = [x for x in akt if x[0] == 'wisch']
    p = ease((t - wisch[0][1]) / (wisch[0][2] - wisch[0][1])) if wisch else 0
    scr = bildschirm(art, name, s0 + (s1 - s0) * p)
    # seitlich hereinschieben (App-Wechsel)
    dx = 0
    if i in SEITLICH and t - a0 < 0.4:
        q = ease((t - a0) / 0.4)
        prev = SZ[i - 1]
        alt = bildschirm(prev[3], prev[4], prev[6])
        dx = int(SW * (1 - q))
    # Rahmen + Schatten
    c.alpha_composite(SCHATTEN, (SX - 40, SY - 40))
    m = MASKE
    if dx:
        both = Image.new('RGB', (SW, SH)); both.paste(alt, (dx - SW, 0)); both.paste(scr, (dx, 0)); scr = both
    c.paste(scr, (SX, SY), m)
    # Finger
    for x in akt:
        if x[0] == 'wisch' and x[1] - 0.15 <= t <= x[2] + 0.1:
            q = ease((t - x[1]) / (x[2] - x[1]))
            finger(c, SX + SW * 0.62, SY + SH * (0.78 - 0.45 * q), 1 - max(0, (t - x[2]) / 0.1))
        if x[0] == 'tipp' and x[1] - 0.45 <= t <= x[1] + 0.35:
            fx, fy = SX + x[2] * K, SY + x[3] * K
            if t < x[1]:
                finger(c, fx, fy, (t - (x[1] - 0.45)) / 0.45)
            else:
                q = (t - x[1]) / 0.35
                finger(c, fx, fy, 1 - q, 40 + 40 * q)
    # Text oben (sanft wechseln)
    txt = TXT[ti]
    if t - a0 < 0.25 and (i == 0 or SZ[i - 1][2] != ti):
        txt = txt.copy(); txt.putalpha(txt.getchannel('A').point(lambda v: int(v * (t - a0) / 0.25)))
    if not STIMME:
        c.alpha_composite(txt, (0, 0))
    return c.convert('RGB')


if len(sys.argv) > 1:
    for s in sys.argv[1:]:
        frame(float(s)).save(D / f'standbild-{s}.png')
    print('Standbilder ok')
    sys.exit()

out = D / ('reel-handy-tiktok-ohne-ton.mp4' if SCHNELL else 'reel-handy-stimme-ohne-ton.mp4' if STIMME else 'reel-handy-auslosen.mp4')
pr = subprocess.Popen([FFMPEG, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                       '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(out)], stdin=subprocess.PIPE)
for n in range(int(DUR * FPS)):
    pr.stdin.write(frame(n / FPS).tobytes())
pr.stdin.close(); pr.wait()
print('fertig:', out)
if STIMME:
    ins, flt = [], []
    for n in range(9):
        ins += ['-i', str(D / f'{SDIR}/s{n}.wav')]
        flt.append(f'[{n + 1}:a]adelay={int(START[n] * 1000) if n < 8 else int((SZ[-1][1] + 0.3) * 1000)}|{int(START[n] * 1000) if n < 8 else int((SZ[-1][1] + 0.3) * 1000)}[a{n}]')
    mix = ''.join(f'[a{n}]' for n in range(9)) + f'amix=inputs=9:normalize=0,apad,atrim=0:{DUR:.2f}[a]'
    fin = D / ('reel-handy-tiktok-15s.mp4' if SCHNELL else 'reel-handy-stimme.mp4')
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', str(out), *ins, '-filter_complex', ';'.join(flt) + ';' + mix,
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', str(fin)], check=True)
    print('mit Stimme:', fin)
