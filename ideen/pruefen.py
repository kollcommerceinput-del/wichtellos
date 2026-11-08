"""Prüft die handgeschriebenen Ideen in ideen/teil*.py und zählt die Abdeckung (08.11.).
python ideen/pruefen.py  →  Fehler je Eintrag, Dubletten, und wie viele Kombinationen Person × Interesse × Budget weniger als 6 Ideen haben."""
import ast
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
import geschenke as g  # noqa: E402

W = {k for k, _ in g.WER}
M = {k for k, _ in g.MAG}
A = {k for k, _, _ in g.ANLAESSE}
fehler, namen = 0, Counter()
for f in sorted(Path(__file__).parent.glob('teil*.py')):
    daten = ast.literal_eval(f.read_text(encoding='utf-8').split('=', 1)[1])
    for r in daten:
        p = []
        if len(r) != 7:
            p.append('7 Felder')
        else:
            n, t, q, w, b, m, a = r
            namen[n] += 1
            if set(w.split()) - W: p.append('wer ' + str(set(w.split()) - W))
            if set(m.split()) - M: p.append('mag ' + str(set(m.split()) - M))
            if set(a.split()) - A: p.append('anlass ' + str(set(a.split()) - A))
            if b not in (5, 10, 15, 20, 30, 50, 100): p.append('budget ' + str(b))
            if '(ab 18)' in n and set(w.split()) & {'kind', 'teen', 'kollege'}: p.append('Alkohol für kind/teen/kollege')
            if '€' in t or 'Euro' in t: p.append('Preis im Text')
        if p:
            fehler += 1
            print(f.name, r[0] if r else r, p)
    print(f.name, len(daten), 'Ideen')
alt = {i['n'] for i in g.ALLE_IDEEN}
print('Dubletten in den Dateien:', [n for n, c in namen.items() if c > 1])
print('Fehler:', fehler, '· Ideen gesamt (handgeschrieben):', len(g.ALLE_IDEEN))

I = g.ALLE_IDEEN
for bud in (10, 20, 30, 50):
    du = [(w, m) for w, _ in g.WER for m, _ in g.MAG if len([i for i in I if w in i['w'] and m in i['m'] and i['b'] <= bud]) < 6]
    print(f'bis {bud} €: {len(du)} von {len(g.WER) * len(g.MAG)} Kombinationen Person × Interesse unter 6 Ideen')
