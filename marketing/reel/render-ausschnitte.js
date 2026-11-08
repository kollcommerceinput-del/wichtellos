// Kurze Ausschnitte für Instagram/TikTok/Pinterest aus den langen YouTube-Videos (Toni 08.11.)
// node marketing/reel/render-ausschnitte.js -> ausschnitte/*.mp4  (Schluss: 2,5 s Standbild mit Hinweis auf YouTube)
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process'), { chromium } = require('playwright');
const FFMPEG = 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const ROOT = path.join(__dirname, '..', '..'), OUT = path.join(__dirname, 'ausschnitte');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const CUTS = [
  { name: 'julklapp', src: 'wichteln-erklaert/video-wichteln-erklaert.mp4', von: 21.77, bis: 48.95, text: 'Ganzes Video<br>auf YouTube' },
  { name: 'wichtel-nachts', src: 'wichtel-kinder/video-wichtel-kinder.mp4', von: 60.07, bis: 91.22, text: 'Folge Onni!', unter: 'Ab 1. Dezember jeden Tag<br>eine neue Wichtel-Geschichte', crf: 24 },  // Toni 08.11.: Follower statt YouTube
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const c of CUTS.filter((c) => !process.env.NUR || c.name === process.env.NUR)) {
    const tmp = path.join(OUT, 'tmp-' + c.name); fs.mkdirSync(tmp, { recursive: true });
    await pg.setContent(`<html><body style="margin:0;width:1080px;height:1920px;background:transparent;font-family:F;text-align:center"><style>@font-face{font-family:F;src:url(${font})}</style>
      <div style="position:absolute;left:70px;right:70px;top:620px;background:rgba(255,248,240,.95);border-radius:44px;padding:50px 40px;color:#2b1b17">
      <div style="font-size:96px;line-height:1.1;color:#c62828">${c.text}</div>${c.unter ? `<div style="font-size:62px;line-height:1.2;margin-top:24px;color:#2b1b17">${c.unter}</div>` : ''}<div style="font-size:64px;margin-top:30px;color:#6d5d57">@WichtelLos</div>
      <div style="display:inline-block;margin-top:30px;background:#c62828;color:#fff;font-size:80px;padding:12px 50px;border-radius:999px">wichtellos.de</div></div></body></html>`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(tmp, 'ende.png'), omitBackground: true });
    const src = path.join(__dirname, c.src), d = (c.bis - c.von).toFixed(2);
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-ss', String(c.bis - 0.05), '-i', src, '-frames:v', '1', path.join(tmp, 'letztes.png')]);
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-ss', String(c.von), '-t', d, '-i', src,
      '-loop', '1', '-t', '2.5', '-i', path.join(tmp, 'letztes.png'), '-loop', '1', '-t', '2.5', '-i', path.join(tmp, 'ende.png'),
      '-f', 'lavfi', '-t', '2.5', '-i', 'anullsrc=r=48000:cl=stereo', '-filter_complex',
      `[0:v]fps=30,format=yuv420p,setsar=1[a];[1:v][2:v]overlay=0:0,fps=30,format=yuv420p,setsar=1,trim=duration=2.5[e];[0:a]afade=t=out:st=${d - 0.4}:d=0.4,aformat=sample_rates=48000:channel_layouts=stereo[aa];[a][aa][e][3:a]concat=n=2:v=1:a=1[v][au]`,
      '-map', '[v]', '-map', '[au]', '-c:v', 'libx264', '-crf', String(c.crf || 20), '-preset', 'medium', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', path.join(OUT, c.name + '.mp4')]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('fertig', c.name, (+d + 2.5).toFixed(1), 's');
  }
  await br.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
