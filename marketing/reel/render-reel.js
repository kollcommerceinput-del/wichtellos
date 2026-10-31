// Rendert das Reel „Wichtel-Lose“ (1080x1920, 30 fps, ohne Ton) aus den Aufnahmen in shots/ -> reel-lose.mp4
// Vorher: node marketing/reel/shots.js   Ton/Musik kommt in Instagram/TikTok dazu.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const DIR = __dirname;
const ROOT = path.join(DIR, '..', '..');
const FPS = 30, DUR = 18;
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const svg = (f) => fs.readFileSync(path.join(ROOT, 'grafik', f), 'utf8');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const shot = (n) => b64(path.join(DIR, 'shots', n));

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#fff8f0;font-family:'Segoe UI',system-ui,sans-serif;color:#2b1b17}
.stripe{position:absolute;top:0;left:0;right:0;height:26px;background:repeating-linear-gradient(90deg,#c62828 0 120px,#f2b705 120px 160px,#1f6f4a 160px 280px,#f2b705 280px 320px);z-index:5}
.lights{position:absolute;top:26px;left:0;right:0;display:flex;z-index:5}.lights svg{width:50%;height:auto}
.scene{position:absolute;inset:0;opacity:0}
.cap{position:absolute;left:60px;right:60px;top:200px;text-align:center;font-family:Fredoka,sans-serif;font-size:84px;line-height:1.08}
.cap small{display:block;font-family:'Segoe UI',sans-serif;font-size:40px;color:#6d5d57;margin-top:18px}
.phone{position:absolute;left:150px;width:780px;top:470px;height:1330px;border-radius:64px;border:18px solid #2b1b17;overflow:hidden;background:#fff8f0;box-shadow:0 30px 80px rgba(43,27,23,.25)}
.phone img{width:100%;display:block}
.paper{position:absolute;left:110px;width:860px;top:500px;background:#fff;box-shadow:0 30px 80px rgba(43,27,23,.25);transform-origin:50% 0}
.paper img{width:100%;display:block}
.big{position:absolute;left:0;right:0;text-align:center}
#s1 .pose{position:absolute;left:50%;top:640px;width:520px;margin-left:-260px}#s1 .pose svg{width:100%;height:auto}
#s1 .cap{top:1300px;font-size:104px}
#s6{background:#c62828;color:#fff}
#s6 .pose{position:absolute;left:50%;top:330px;width:420px;margin-left:-210px}#s6 .pose svg{width:100%;height:auto}
#s6 .url{top:900px;font-family:Fredoka,sans-serif;font-size:132px;color:#fff}
#s6 .sub{top:1080px;font-size:50px;opacity:.95}
#s6 .usp{top:1200px;font-size:42px;opacity:.9;line-height:1.6}
#s6 .btn{top:1470px}#s6 .btn span{display:inline-block;background:#fff;color:#c62828;font-family:Fredoka,sans-serif;font-size:64px;padding:26px 56px;border-radius:999px}
.conf{position:absolute;width:26px;height:16px;z-index:6}
</style></head><body>
<div class="stripe"></div><div class="lights">${svg('lichterkette.svg')}${svg('lichterkette.svg')}</div>
<div class="scene" id="s1"><div class="pose">${svg('wichtel-geschenk.svg')}</div><div class="cap">Zettel ziehen<br>war gestern 🎁</div></div>
<div class="scene" id="s2"><div class="cap">Namen eintragen<small>💡 auf Wunsch mit Tipp für den Wichtel</small></div><div class="phone"><img id="i2" src="${shot('1-namen.png')}"></div></div>
<div class="scene" id="s3"><div class="cap">Auslosen &amp;<br>Lose ausdrucken 🖨️</div><div class="phone"><img id="i3" src="${shot('3-lose.png')}"></div></div>
<div class="scene" id="s4"><div class="cap">Ausschneiden,<br>falten, verteilen ✂️</div><div class="paper" id="p4"><img src="${shot('4-druckbogen.png')}"></div></div>
<div class="scene" id="s5"><div class="cap">Scannen =<br>Geheimnis lüften 🤫</div><div class="phone"><img id="i5" src="${shot('5-aufgedeckt.png')}"></div><div id="conf"></div></div>
<div class="scene" id="s6"><div class="pose">${svg('wichtel-winkt.svg')}</div>
  <div class="big url">wichtellos.de</div>
  <div class="big sub">Wichteln online auslosen<br>kostenlos · ohne Anmeldung</div>
  <div class="big usp">💡 Tipp für den Wichtel · 🖨️ Lose mit QR-Code<br>🔒 eure Namen bleiben bei euch</div>
  <div class="big btn"><span>🔗 Link im Profil</span></div></div>
<script>
const S=[['s1',0,2.6],['s2',2.6,5.8],['s3',5.8,9],['s4',9,12.2],['s5',12.2,15],['s6',15,18.5]];
const ease=(x)=>x<0?0:x>1?1:1-Math.pow(1-x,3);
const colors=['#c62828','#f2b705','#1f6f4a','#e57373','#ffffff'];
const conf=[...Array(70)].map((_,i)=>{const d=document.createElement('div');d.className='conf';d.style.background=colors[i%5];document.getElementById('conf').append(d);return {d,x:Math.random()*1080,v:500+Math.random()*700,r:Math.random()*720,dl:Math.random()*0.5};});
window.setT=(t)=>{
  for(const [id,a,b] of S){const el=document.getElementById(id);const fi=ease((t-a)/0.35),fo=ease((b-t)/0.3);el.style.opacity=Math.min(fi,fo);
    const cap=el.querySelector('.cap');if(cap)cap.style.transform='translateY('+(1-ease((t-a)/0.5))*60+'px)';}
  document.getElementById('s1').querySelector('.pose').style.transform='scale('+(0.8+0.25*ease(t/1.2))+') rotate('+Math.sin(t*4)*3+'deg)';
  document.getElementById('i2').style.transform='translateY('+(-ease((t-3.2)/2.2)*140)+'px)';
  document.getElementById('i3').style.transform='translateY('+(-ease((t-6.4)/2.2)*260)+'px)';
  const p=ease((t-9.2)/2.6);document.getElementById('p4').style.transform='rotate('+(-4+3*p)+'deg) scale('+(0.92+0.18*p)+')';
  const ct=t-12.6;conf.forEach(c=>{const tt=ct-c.dl;c.d.style.opacity=tt>0&&tt<2.4?1:0;c.d.style.transform='translate('+c.x+'px,'+(380+tt*c.v)+'px) rotate('+(c.r*tt)+'deg)';});
  document.getElementById('s6').querySelector('.pose').style.transform='translateY('+Math.sin(t*5)*10+'px)';
};
</script></body></html>`;

(async () => {
  const tmp = path.join(DIR, 'frames');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html);
  await p.evaluate(() => document.fonts.ready);
  const n = FPS * DUR;
  for (let i = 0; i < n; i++) {
    await p.evaluate((t) => window.setT(t), i / FPS);
    await p.screenshot({ path: path.join(tmp, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  await b.close();
  const out = path.join(DIR, 'reel-lose.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.jpg'),
    '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20',
    '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig:', out, Math.round(fs.statSync(out).size / 1024) + ' KB');
})();
