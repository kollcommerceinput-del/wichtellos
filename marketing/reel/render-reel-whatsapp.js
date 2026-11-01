// Rendert das Reel „Wichteln – ganz simpel“ (3 Schritte, Versand per WhatsApp/E-Mail/Messenger/SMS) (1080x1920, 30 fps, ohne Ton) -> reel-whatsapp.mp4
// Nutzt die Aufnahmen aus shots/ (node marketing/reel/shots.js). Kein WhatsApp-Logo (Markenrecht), nur Wort + Chat-Optik.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const DIR = __dirname;
const ROOT = path.join(DIR, '..', '..');
const FPS = 30, DUR = 17.5;
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
.ring{position:absolute;left:52px;top:506px;width:210px;height:92px;border-radius:22px;border:8px solid #f2b705}
.big{position:absolute;left:0;right:0;text-align:center}
.link{position:absolute;left:50%;top:560px;transform:translateX(-50%);background:#fff;border:6px solid #f2b705;border-radius:999px;padding:24px 44px;font-size:52px;font-weight:700;white-space:nowrap;box-shadow:0 14px 40px rgba(0,0,0,.12)}
.apps{position:absolute;left:90px;right:90px;top:860px;display:grid;grid-template-columns:1fr 1fr;gap:50px}
.app{height:330px;border-radius:60px;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;box-shadow:0 18px 40px rgba(0,0,0,.18)}
.app span{font-size:130px;line-height:1}.app b{font-size:50px}
.note{position:absolute;left:0;right:0;top:1680px;text-align:center;font-size:50px;color:#6d5d57}
#s1 .pose{position:absolute;left:50%;top:600px;width:480px;margin-left:-240px}#s1 .pose svg{width:100%;height:auto}
#s1 .cap{top:1240px;font-size:110px}
#s5{background:#c62828;color:#fff}
#s5 .pose{position:absolute;left:50%;top:250px;width:500px;height:500px;margin-left:-250px;background:#fff8f0;border-radius:50%;padding:60px 80px}#s5 .pose svg{width:100%;height:auto}
#s5 .url{top:850px;font-family:Fredoka,sans-serif;font-size:132px;color:#fff}
#s5 .sub{top:1030px;font-size:54px;opacity:.95;line-height:1.35}
#s5 .usp{top:1250px;font-size:40px;opacity:.9;line-height:1.6}
#s5 .btn{top:1480px}#s5 .btn span{display:inline-block;background:#fff;color:#c62828;font-family:Fredoka,sans-serif;font-size:64px;padding:26px 56px;border-radius:999px}
.conf{position:absolute;width:26px;height:16px;z-index:6}
</style></head><body>
<div class="stripe"></div><div class="lights">${svg('lichterkette.svg')}${svg('lichterkette.svg')}</div>
<div class="scene" id="s1"><div class="pose">${svg('wichtel-winkt.svg')}</div><div class="cap">Wichteln?<br>Ganz simpel.</div></div>
<div class="scene" id="s2"><div class="cap">1. Namen<br>eintragen ✏️</div><div class="phone"><img id="i2" src="${shot('1-namen.png')}"></div></div>
<div class="scene" id="s3"><div class="cap">2. Link<br>verschicken</div>
  <div class="link" id="lnk">🔗 Dein Wichtel-Link</div>
  <div class="apps">
    <div class="app" style="background:#1f8f4e"><span>💬</span><b>WhatsApp</b></div>
    <div class="app" style="background:#1a6fb0"><span>📧</span><b>E-Mail</b></div>
    <div class="app" style="background:#7b4bd0"><span>🗨️</span><b>Messenger</b></div>
    <div class="app" style="background:#6d5d57"><span>📨</span><b>SMS</b></div>
  </div>
  <div class="note">Jeder bekommt <u>seinen eigenen</u> Link</div></div>
<div class="scene" id="s4"><div class="cap">3. Antippen &amp;<br>Geheimnis lüften 🤫</div><div class="phone"><img src="${shot('5-aufgedeckt.png')}"></div><div id="conf"></div></div>
<div class="scene" id="s5"><div class="pose">${svg('wichtel-winkt.svg')}</div>
  <div class="big url">wichtellos.de</div>
  <div class="big sub">Wichteln online auslosen<br>kostenlos · ohne Anmeldung</div>
  <div class="big usp">📖 So geht's per WhatsApp:<br>wichtellos.de/wichteln-per-whatsapp</div>
  <div class="big btn"><span>🔗 Link im Profil</span></div></div>
<script>
const S=[['s1',0,2.4],['s2',2.4,5.4],['s3',5.4,10],['s4',10,13],['s5',13,17.5]];
const ease=(x)=>x<0?0:x>1?1:1-Math.pow(1-x,3);
const colors=['#c62828','#f2b705','#1f6f4a','#e57373','#ffffff'];
const conf=[...Array(70)].map((_,i)=>{const d=document.createElement('div');d.className='conf';d.style.background=colors[i%5];document.getElementById('conf').append(d);return {d,x:Math.random()*1080,v:500+Math.random()*700,r:Math.random()*720,dl:Math.random()*0.5};});
const apps=[...document.querySelectorAll('.app')];
window.setT=(t)=>{
  for(const [id,a,b] of S){const el=document.getElementById(id);const fi=ease((t-a)/0.35),fo=ease((b-t)/0.3);el.style.opacity=Math.min(fi,fo);
    const cap=el.querySelector('.cap');if(cap)cap.style.transform='translateY('+(1-ease((t-a)/0.5))*60+'px)';}
  document.getElementById('s1').querySelector('.pose').style.transform='scale('+(0.8+0.25*ease(t/1.2))+') rotate('+Math.sin(t*4)*3+'deg)';
  document.getElementById('i2').style.transform='translateY('+(-ease((t-3)/2.2)*140)+'px)';
  document.getElementById('lnk').style.transform='translateX(-50%) scale('+(0.6+0.4*ease((t-5.6)/0.5))+')';
  apps.forEach((a,i)=>{const k=ease((t-6.2-i*0.45)/0.45);a.style.opacity=k;a.style.transform='scale('+(0.6+0.4*k+0.05*Math.max(0,Math.sin((t-6.2-i*0.45)*6))*(k>0.99?1:0))+')';});
  document.querySelector('.note').style.opacity=ease((t-8.2)/0.5);
  const ct=t-10.4;conf.forEach(c=>{const tt=ct-c.dl;c.d.style.opacity=tt>0&&tt<2.4?1:0;c.d.style.transform='translate('+c.x+'px,'+(380+tt*c.v)+'px) rotate('+(c.r*tt)+'deg)';});
  document.getElementById('s5').querySelector('.pose').style.transform='translateY('+Math.sin(t*5)*10+'px)';
};
</script></body></html>`;

(async () => {
  const tmp = path.join(DIR, 'frames-wa');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html);
  await p.evaluate(() => document.fonts.ready);
  const only = process.argv[2];  // z. B. "1,4,7,10.5,13.5,17" -> nur Standbilder zur Kontrolle
  const times = only ? only.split(',').map(Number) : [...Array(FPS * DUR).keys()].map((i) => i / FPS);
  for (const [i, t] of times.entries()) {
    await p.evaluate((x) => window.setT(x), t);
    await p.screenshot({ path: path.join(tmp, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  await b.close();
  if (only) { console.log('Standbilder in', tmp); return; }
  const out = path.join(DIR, 'reel-whatsapp.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.jpg'),
    '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20',
    '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig:', out, Math.round(fs.statSync(out).size / 1024) + ' KB');
})();
