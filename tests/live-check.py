# Live-Prüfung nach dem Deploy: lädt alle Seiten der Sitemap von wichtellos.de und prüft jede verlinkte Datei
# (Bilder, PDFs, ZIP, Video, CSS/JS, OG-Bilder) auf Status 200.  python tests/live-check.py
import re, urllib.request, urllib.parse, concurrent.futures as cf
B='https://wichtellos.de'
def get(u):
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 wichtellos-check'}),timeout=20); return r.status, r.read()
    except urllib.error.HTTPError as e: return e.code, b''
    except Exception as e: return str(e), b''
st,sm=get(B+'/sitemap.xml'); pages=re.findall(r'<loc>([^<]+)',sm.decode())+[B+'/impressum/',B+'/datenschutz/']
res=set(); refs={}
for p in pages:
    s,h=get(p); h=h.decode('utf-8','ignore')
    if s!=200: print('SEITE',s,p)
    urls=re.findall(r'(?:src|href|poster|data-video|content)="([^"]+)"',h)
    for ss in re.findall(r'srcset="([^"]+)"',h): urls+= [x.strip().split(' ')[0] for x in ss.split(',')]
    for u in urls:
        if u.startswith('#') or u.startswith('mailto:') or u.startswith('tel:') or u.startswith('data:') or u.startswith('javascript'): continue
        if u.startswith('/') or u.startswith(B):
            full=urllib.parse.urljoin(p,u).split('#')[0]
            if full.startswith(B): res.add(full); refs.setdefault(full,p)
s,css=get(B+'/assets/style.css')
for u in re.findall(r'url\((/[^)]+)\)',css.decode()): res.add(B+u); refs.setdefault(B+u,'style.css')
print(len(pages),'Seiten,',len(res),'Adressen')
def chk(u): return u,get(u)[0]
bad=[]
with cf.ThreadPoolExecutor(12) as ex:
    for u,s in ex.map(chk,sorted(res)):
        if s!=200: bad.append((s,u,refs[u]))
kinds={}
for u in res:
    e=u.rsplit('.',1)[-1].lower() if '.' in u.rsplit('/',1)[-1] else 'seite'
    kinds[e]=kinds.get(e,0)+1
print('Typen:',kinds)
print('FEHLER:',len(bad))
for b in bad: print(*b)
