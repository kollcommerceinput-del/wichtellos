// Text-Einblendungen auf ein fertiges Video legen (Toni 12.11.: seine Videos aus G:\Video bauen Projekte schnell mit Text versehen).
// Texte immer oben (nie mittig auf Onni), cremefarbener Kasten wie bei den anderen Reels, sanft ein-/ausgeblendet. Ton bleibt unverändert.
//   node marketing/reel/render-text-auf-video.js <texte.json>
// texte.json: { "video": "…mp4", "out": "…mp4", "texte": [[start, ende, "<h1>…</h1><p>…</p>"], …] }
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,sans-serif;color:#2b1b17;text-align:center}
.box{position:absolute;top:150px;left:70px;right:70px;background:rgba(255,248,240,.94);border-radius:40px;padding:26px 36px 32px;box-shadow:0 14px 34px rgba(0,0,0,.4)}
h1{font-size:78px;line-height:1.1;margin:0;font-weight:600}h1 em{font-style:normal;color:#c62828}
p{font-size:50px;line-height:1.2;color:#2b1b17;margin:12px 0 0}
.url{display:inline-block;background:#c62828;color:#fff;font-size:56px;padding:8px 40px;border-radius:999px;margin-top:16px}
</style></head><body><div class="box">${inner}</div></body></html>`;

(async () => {
  const tmp = path.join(path.dirname(path.resolve(cfg.out)), 'tmp-text');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [i, [, , html]] of cfg.texte.entries()) {
    await p.setContent(page(html));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(tmp, `t${i}.png`), omitBackground: true });
  }
  await b.close();
  const args = ['-i', cfg.video];
  const fc = []; let prev = '0:v';
  cfg.texte.forEach(([a, e], i) => {
    args.push('-loop', '1', '-t', (e + 0.5).toFixed(2), '-i', path.join(tmp, `t${i}.png`));
    fc.push(`[${i + 1}:v]format=rgba,fade=t=in:st=${a}:d=0.3:alpha=1,fade=t=out:st=${(e - 0.3).toFixed(2)}:d=0.3:alpha=1[t${i}]`);
    fc.push(`[${prev}][t${i}]overlay=0:0:enable='between(t,${a},${e})'[o${i}]`);
    prev = `o${i}`;
  });
  fc.push(`[${prev}]format=yuv420p[v]`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args, '-filter_complex', fc.join(';'), '-map', '[v]', '-map', '0:a?', '-c:v', 'libx264',
    '-crf', '19', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', cfg.out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('fertig: ' + cfg.out);
})();
