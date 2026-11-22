# Anreißer Podcast Folge 1 (9:16): Ausschnitt aus onni-folge-01.mp3 + Folgenbilder mit langsamem Zoom, Text oben, Endkarte Spotify
import subprocess, os
FF = 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
HIER = os.path.dirname(os.path.abspath(__file__))
MP3 = 'G:/wichtellos/marketing/podcast/folge-01-v2/onni-folge-01.mp3'
BILD = 'G:/Video bauen Projekte/Folge 01 – Onni zieht ein/'
FONT = 'fredoka.ttf'
os.chdir(HIER)
# Audio: Titel (32.2–35.6) + Szene (98.9–149.4) + 4,5 s Endkarte (Stille)
TEILE = [(32.2, 35.6), (98.9, 149.4)]
ENDE = 4.5
# Bilder (Dauer in s) passend zum Gesprochenen
SZENEN = [('Wichtel_Haus_von_außen_a5e441d3.jpg', 3.4),          # Türchen eins
          ('eingefuegt-20261110155405.jpg', 11.7),               # Wind, Nase, Nanu?
          ('eingefuegt-20261110155521.jpg', 11.9),               # hinaus in den Schnee
          ('eingefuegt-20261110160951.jpg', 10.6),               # Kakao, Kekse, Decke
          ('Haus_Außen_Ansicht_8bfd417e.jpg', 3.6),              # So riecht ein Zuhause
          ('Haus_draußen_Ansicht_wiet_weg._28af26d4.jpg', 10.8), # viel zu weit
          ('Onni_Eingangstür_Draußen_996719ce.jpg', 2.3),        # Wie soll ich da nur hinkommen?
          ('eingefuegt-20261110162353.jpg', ENDE)]               # Endkarte: Ulla taucht auf


def run(a):
    subprocess.run([FF, '-y', '-loglevel', 'error'] + a, check=True)


# Audio schneiden
f = ';'.join(f'[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.08,afade=t=out:st={b - a - 0.15}:d=0.15[a{i}]' for i, (a, b) in enumerate(TEILE))
f += f';anullsrc=r=48000:cl=stereo,atrim=0:{ENDE}[st];' + ''.join(f'[a{i}]' for i in range(len(TEILE))) + f'[st]concat=n={len(TEILE) + 1}:v=0:a=1[out]'
run(['-i', MP3, '-filter_complex', f, '-map', '[out]', '-ar', '48000', '-c:a', 'pcm_s16le', os.path.join(HIER, 'ton.wav')])

# Bilder: Cover auf 1080x1920, langsamer Zoom
clips = []
for i, (b, d) in enumerate(SZENEN):
    out = os.path.join(HIER, f'clip{i}.mp4'); n = int(d * 30) + 1
    z = "'min(1+0.0009*on,1.12)'" if i % 2 == 0 else "'max(1.12-0.0009*on,1)'"
    run(['-loop', '1', '-i', BILD + b, '-vf',
         f'scale=1188:2112:force_original_aspect_ratio=increase,crop=1188:2112,zoompan=z={z}:x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2):d={n}:s=1080x1920:fps=30,format=yuv420p',
         '-frames:v', str(n), '-c:v', 'libx264', '-crf', '20', out])
    clips.append(out)
with open(os.path.join(HIER, 'liste.txt'), 'w') as l:
    l.writelines(f"file '{c}'\n" for c in clips)
run(['-f', 'concat', '-safe', '0', '-i', os.path.join(HIER, 'liste.txt'), '-c', 'copy', os.path.join(HIER, 'bild.mp4')])

dauer = sum(b - a for a, b in TEILE) + ENDE
t_end = dauer - ENDE
txt = lambda s, size, y, extra='': (f"drawtext=fontfile='{FONT}':text='{s}':fontsize={size}:fontcolor=white:borderw=6:bordercolor=black@0.55:"
                                     f"x=(w-text_w)/2:y={y}{extra}")
vf = ','.join([
    'drawbox=x=0:y=0:w=iw:h=330:color=black@0.28:t=fill',
    txt('Onnis Adventskalender', 58, 70, f":enable='lt(t,{t_end})'"),
    txt('Folge 1 – jetzt auf Spotify', 70, 160, f":enable='lt(t,{t_end})'"),
    txt('Wie geht es weiter?', 92, 90, f":enable='gte(t,{t_end})'"),
    txt('Ganze Folge auf Spotify', 74, 205, f":enable='gte(t,{t_end})'"),
    txt('Ab 1. Dezember jeden Abend ein Türchen', 50, 'h-260', f":enable='gte(t,{t_end})'"),
    f"drawtext=fontfile='{FONT}':text='Mit KI erstellt':fontsize=30:fontcolor=white@0.85:x=w-text_w-30:y=h-60",
])
run(['-i', os.path.join(HIER, 'bild.mp4'), '-i', os.path.join(HIER, 'ton.wav'), '-vf', vf, '-t', f'{dauer:.2f}',
     '-c:v', 'libx264', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart',
     os.path.join(HIER, 'anreisser-folge-01.mp4')])
print('fertig', round(dauer, 1), 's')
