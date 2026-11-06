# Wort-für-Wort-Untertitel fürs TikTok-Video (Toni 06.11.): Zeiten je Wort aus der Stimme (Silben anteilig im gesprochenen Bereich)
import json, re, wave, array, pathlib
D = pathlib.Path(__file__).parent
T = ['Hey du – schon Wichteln vorbereitet? Per WhatsApp geht’s ganz einfach – mit wichtellos.de.', 'Gruppe und Budget eintragen.',
     'Dann alle Namen rein – wer mag, gibt noch einen Tipp mit.', 'Auf „Jetzt auslosen“ tippen – fertig.', 'Jeder bekommt seinen eigenen geheimen Link.',
     'Den schickst du per WhatsApp – zum Beispiel an Anna.', 'Anna tippt auf den Link …', '… und nur sie sieht, wen sie beschenkt.',
     'Wichtellos.de – kostenlos und ohne Anmeldung.', 'Gib uns ein Like oder einen Kommentar – dann sind wir auch nächstes Jahr wieder da!']

def woerter(t):
    out = []
    for w in t.split():
        if not re.search(r'[A-Za-zÄÖÜäöüß0-9]', w):
            if out: out[-1] += ' ' + w
            continue
        out.append(w)
    return [w.replace(' –', '').replace(' …', '').rstrip('.,') for w in out]

def silben(w):
    return max(1, len(re.findall(r'[aeiouäöüy]+', w.lower())))

def bereich(f):
    w = wave.open(str(f)); r = w.getframerate(); a = array.array('h', w.readframes(w.getnframes())); win = int(r * 0.02)
    e = [max(abs(x) for x in a[i:i + win]) for i in range(0, len(a) - win, win)]
    an = [i for i, v in enumerate(e) if v > 1500]
    return an[0] * 0.02, (an[-1] + 1) * 0.02

res = []
for n, t in enumerate(T):
    ws = woerter(t); a, b = bereich(D / f'stimme-schnell/s{n}.wav'); S = [silben(w) for w in ws]; tot = sum(S); x = a; z = []
    for w, s in zip(ws, S):
        z.append([w, round(x, 3)]); x += (b - a) * s / tot
    res.append({'ende': round(b, 3), 'woerter': z})
json.dump(res, open(D / 'woerter.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print([[w for w, _ in r['woerter']] for r in res])
