# Spieluhr-Melodie „Jingle Bells“ (Melodie gemeinfrei, J. Pierpont 1857) selbst synthetisiert -> keine Musiklizenz nötig.
# python marketing/reel/spieluhr.py <ausgabe.wav> [dauer_s]
import sys
import wave
import numpy as np

SR = 44100
out = sys.argv[1]
dur = float(sys.argv[2]) if len(sys.argv) > 2 else 10.0
BPM = 150
beat = 60 / BPM
N = {'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.0, 'C6': 1046.5, 'G4': 392.0, 'C4': 261.63, 'G3': 196.0, 'F4': 349.23}
# (Ton, Schläge)
MEL = [('E5', 1), ('E5', 1), ('E5', 2), ('E5', 1), ('E5', 1), ('E5', 2), ('E5', 1), ('G5', 1), ('C5', 1.5), ('D5', .5), ('E5', 4),
       ('F5', 1), ('F5', 1), ('F5', 1.5), ('F5', .5), ('F5', 1), ('E5', 1), ('E5', 1), ('E5', .5), ('E5', .5),
       ('E5', 1), ('D5', 1), ('D5', 1), ('E5', 1), ('D5', 2), ('G5', 2)]
BASS = [('C4', 4), ('C4', 4), ('C4', 4), ('C4', 4), ('F4', 4), ('C4', 4), ('G3', 4), ('G3', 4)]

total = int(SR * dur)
buf = np.zeros(total)


def tone(f, start, length, vol):
    n = int(SR * min(length + 1.2, dur - start))
    if n <= 0:
        return
    t = np.arange(n) / SR
    env = np.exp(-t * 3.2) * np.minimum(1, t / 0.004)  # Spieluhr: harter Anschlag, langes Ausklingen
    sig = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3.01 * f * t)) * env
    i = int(SR * start)
    buf[i:i + n] += vol * sig[:total - i]


t = 0.25
while t < dur - 0.3:  # Melodie wiederholen, bis das Video zu Ende ist
    for note, b in MEL:
        if t > dur - 0.3:
            break
        tone(N[note], t, b * beat, 0.32)
        t += b * beat
tb = 0.25
for _ in range(3):
    for note, b in BASS:
        if tb > dur - 0.3:
            break
        tone(N[note] / 2, tb, b * beat, 0.16)
        tb += b * beat
# kleines Glöckchen am Anfang
for k, f in enumerate([1568, 2093, 2637]):
    tone(f, 0.02 + k * 0.06, 0.3, 0.08)
fade = int(SR * 0.8)
buf[-fade:] *= np.linspace(1, 0, fade)
buf = buf / np.max(np.abs(buf)) * 0.8
pcm = (buf * 32767).astype(np.int16)
stereo = np.repeat(pcm[:, None], 2, axis=1)
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(stereo.tobytes())
print('ok', out)
