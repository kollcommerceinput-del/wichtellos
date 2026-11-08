// Video „Wichteln erklärt“ (Toni 08.11., Text von Toni): Was ist Wichteln, Julklapp/Herkunft, Wichteln heute mit WichtelLos, Kommentare/Like.
// node marketing/reel/render-video-wichteln-erklaert.js  -> marketing/reel/wichteln-erklaert/video-wichteln-erklaert.mp4
// Aufbau wie render-reel-was-ist-wichteln.js. Fakten wie /woher-kommt-wichteln/. Werbung nur, falls Geschenk-Links im Post.
// Text auf 3D-Stills (wichtel3d/stills) + Stimme (Gemini „puck“, je Szene ton-N.wav, wird gecacht; NEU=1 erzeugt neu).
// Szenenlänge = Sprechdauer + Luft (mind. Bildzeit). Nach der Eingangsfrage eine kurze Pause (Toni). Keine Musik. Beim Posten „Mit KI erstellt“ + „Werbung“.
// OHNE_STIMME=1 -> stille Fassung.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const ST = path.join(__dirname, 'wichtel3d', 'stills');
const OUT = path.join(__dirname, 'wichteln-erklaert');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const FPS = 30;
const STIMME = 'puck';
const STIL = 'Freundlich, fröhlich und zügig wie ein kurzes Social-Media-Erklärvideo, klar und natürlich, auf Deutsch.';
const OHNE_STIMME = !!process.env.OHNE_STIMME;
const TEMPO = +(process.env.TEMPO || 1.2); // Stimme etwas schneller (Videos kurz halten, Toni)

// [Bild, Mindestdauer s, HTML, Sprechtext, Luft danach s]
const SFX = path.join(__dirname, 'sounds-pixabay');
// Tonlage (Gemini-Stil) und Geräusche je Szene: [Datei, ab s in der Szene, Länge s, Lautstärke] (Toni 08.11.)
const TON = {"0": {"stil": "neugierig und fragend, mit einem Lächeln", "sfx": [["glitzer", 0, 1.8, 0.5]]}, "1": {"stil": "freundlich erklärend", "sfx": [["papier", 0.3, 2.0, 0.4]]}, "2": {"stil": "leise und geheimnisvoll, fast flüsternd", "sfx": [["spannung", 0, 3.7, 0.18]]}, "3": {"stil": "fröhlich", "sfx": [["plopp", 0.2, 1.0, 0.5]]}, "4": {"stil": "neugierig und fragend", "sfx": [["glitzer", 0, 1.8, 0.5]]}, "5": {"stil": "erzählend wie ein Märchen, warm", "sfx": [["wind", 0, 6.5, 0.15]]}, "6": {"stil": "spannend erzählt, am Ende verschmitzt lachend bei „und war verschwunden“", "sfx": [["klopfen-tuer", 0, 1.9, 0.6], ["tuer-knarren", 2.2, 1.5, 0.35], ["rennen-holz", 4.3, 1.9, 0.4]]}, "7": {"stil": "ruhig erzählend", "sfx": [["kamin", 0, 6.5, 0.2]]}, "8": {"stil": "geheimnisvoll", "sfx": [["tapsen", 0.3, 2.7, 0.35], ["kichern", 4.2, 2.3, 0.3]]}, "9": {"stil": "augenzwinkernd, verschmitzt", "sfx": [["gloeckchen", 4.0, 3.0, 0.3]]}, "10": {"stil": "mit Schwung, als käme jetzt etwas Gutes", "sfx": [["idee", 0, 2.0, 0.45]]}, "11": {"stil": "locker und überzeugt", "sfx": [["handy-ton", 0.6, 1.5, 0.45]]}, "12": {"stil": "verschwörerisch, wie ein „Psst“", "sfx": [["rascheln-kurz", 0.3, 1.7, 0.4]]}, "13": {"stil": "hilfsbereit", "sfx": [["idee", 0.2, 2.0, 0.4]]}, "14": {"stil": "herzlich", "sfx": [["jubel", 3.5, 2.5, 0.3]]}, "15": {"stil": "fröhlich und einladend", "sfx": [["gloeckchen", 0, 3.0, 0.3]]}};
const SZENEN = [
  ["werkstatt.jpg", 1.5, "<div class=\"top\"><div class=\"big\">Was ist<br>Wichteln?</div></div>", "Was ist Wichteln?", 0.6],
  ["los.jpg", 2, "<div class=\"top\">Jeder zieht <span class=\"y\">heimlich</span><br>einen Namen …<div class=\"sub\">… und beschenkt genau diese Person</div></div>", "Wichteln ist ein Brauch zum Beschenken in der Vorweihnachtszeit: In einer Gruppe – Familie, Freunde oder Kollegen – zieht jeder per Los einen Namen und beschenkt diese Person heimlich.", 0.3],
  ["lupe.jpg", 2, "<div class=\"top\">Wer wen beschenkt,<br>bleibt <span class=\"y\">geheim</span><div class=\"sub\">oft bis zur Bescherung –<br>oder für immer</div></div>", "Wer wen beschenkt, bleibt geheim – oft bis zur Bescherung oder sogar für immer.", 0.3],
  ["feier.jpg", 2, "<div class=\"top\">Jeder bekommt<br>ein Geschenk 🎁<div class=\"sub\">Niemand muss für alle einkaufen –<br>Spannung gibt’s gratis dazu</div></div>", "So bekommt jeder ein Geschenk, niemand muss für alle einkaufen, und Spannung gibt es gratis dazu.", 0.5],
  ["umschlag.jpg", 1.5, "<div class=\"top\"><div class=\"big\">Woher kommt<br>das Wichteln?</div></div>", "Woher kommt das Wichteln?", 0.6],
  ["tuer.jpg", 2, "<div class=\"top\">In Schweden:<br><span class=\"y\">„Julklapp“</span><div class=\"sub\">„Jul“ = Weihnachten<br>„Klapp“ = Klopfen an der Tür</div></div>", "Die Wurzeln liegen in Skandinavien. In Schweden heißt der Brauch „Julklapp“: „Jul“ heißt Weihnachten, „Klapp“ steht für das Klopfen an der Tür.", 0.3],
  ["geschenk-muetze.jpg", 2, "<div class=\"top\">Anklopfen, Geschenk<br>hineinwerfen –<br><span class=\"y\">und weg!</span></div>", "Früher klopfte man an Heiligabend bei jemandem an, warf ein kleines Geschenk ins Haus und war verschwunden, bevor jemand sehen konnte, wer es war.", 0.3],
  ["wuerfel.jpg", 2, "<div class=\"top\">Seit dem<br>19. Jahrhundert<div class=\"sub\">Tradition in Schweden –<br>und „Julklapp“ in Norddeutschland</div></div>", "Im neunzehnten Jahrhundert wurde der Julklapp in vielen schwedischen Haushalten zur Tradition. Auch in Norddeutschland spricht man bis heute vom Julklapp.", 0.3],
  ["basteln.jpg", 2, "<div class=\"top\">Der Name kommt<br>von den <span class=\"y\">Wichteln</span><div class=\"sub\">Sagengestalten, die heimlich<br>Gutes tun – und nie gesehen werden</div></div>", "Seinen deutschen Namen hat der Brauch von den Wichteln: kleinen Gestalten aus nordischen Sagen, die heimlich Gutes tun und dabei nie gesehen werden.", 0.3],
  ["geschenk.jpg", 2, "<div class=\"top\">Der Schenkende<br>bleibt <span class=\"y\">unerkannt</span><div class=\"sub\">Österreich: „Engerl und Bengerl“<br>Englisch: „Secret Santa“</div></div>", "Genau wie ein Wichtel bleibt auch beim Wichteln der Schenkende unerkannt. In Österreich heißt das übrigens „Engerl und Bengerl“, im englischsprachigen Raum „Secret Santa“.", 0.5],
  ["onni-geschenk-tisch.jpg", 2, "<div class=\"top\"><div class=\"big\">Wichteln heute:<br>ganz einfach digital</div></div>", "Wichteln heute: ganz einfach digital. Früher wurde an der Tür geklopft, später Zettel aus der Mütze gezogen.", 0.3],
  ["onni-handy.jpg", 2, "<div class=\"top\">Online auslosen –<br>in wenigen Minuten<div class=\"sub\">kostenlos, ohne Anmeldung,<br>ohne Zettelchaos</div></div>", "Heute geht das Auslosen viel einfacher: Mit WichtelLos lost du eure Wichtelpartner in wenigen Minuten online aus – kostenlos, ohne Anmeldung und ohne Zettelchaos.", 0.3],
  ["onni-handy-ruecken.jpg", 2, "<div class=\"top\">Jeder bekommt seinen<br><span class=\"y\">Geheim-Link</span><div class=\"sub\">Nur er sieht, wen er beschenkt</div></div>", "Du trägst einfach alle Teilnehmer ein, und jeder bekommt seinen eigenen Geheim-Link. Darüber erfährt nur er, wen er beschenken darf. So bleibt das Geheimnis gewahrt – wie bei den echten Wichteln.", 0.3],
  ["schrott.jpg", 2, "<div class=\"top\">Keine Idee?<div class=\"sub\">Der Geschenkfinder hilft 🎁</div></div>", "Und wenn dir eine Idee fehlt, hilft dir unser Geschenkfinder, das passende Wichtelgeschenk zu finden.", 0.3],
  ["kinder.jpg", 2, "<div class=\"top\">Familie, Freunde,<br>Kollegen<div class=\"sub\">zusammen am Tisch oder über<br>ganz Deutschland verteilt</div></div>", "Ob mit der Familie, Freunden oder Kollegen, ob alle zusammensitzen oder über ganz Deutschland verteilt sind: Mit WichtelLos kann jeder mitwichteln.", 0.4],
  ["werkstatt.jpg", 3.4, "<div class=\"end\"><h1>Wie wichtelt ihr?</h1><p>Schreibt es in die Kommentare<br>und lasst ein Like da! 👍<br>Jetzt kostenlos wichteln:</p><div class=\"url\">wichtellos.de</div></div>", "Wie wichtelt ihr? Schreibt es in die Kommentare und lasst ein Like da! Jetzt kostenlos wichteln: auf wichtellos punkt de!", 0.9],
];

const html = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;src:url(${font}) format('woff2');font-weight:600}
html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:Fredoka,'Segoe UI Emoji',sans-serif;text-align:center}
.top{position:absolute;left:60px;right:60px;top:200px;color:#fff;font-size:84px;line-height:1.15;text-shadow:0 4px 18px rgba(0,0,0,.85),0 0 4px #000}
.top .big{font-size:120px;color:#f2b705;margin-bottom:10px}
.top .y{color:#f2b705}
.top .sub{font-size:60px;margin-top:22px;color:#ffe9a8}
.end{position:absolute;left:70px;right:70px;top:250px;background:rgba(255,248,240,.95);border-radius:44px;padding:50px 40px;color:#2b1b17}
.end h1{font-size:120px;line-height:1.05;margin:0 0 20px;color:#c62828}.end p{font-size:58px;color:#6d5d57;margin:0 0 34px}
.url{display:inline-block;background:#c62828;color:#fff;font-size:88px;padding:14px 56px;border-radius:999px}
.ki{position:absolute;right:30px;bottom:40px;color:rgba(255,255,255,.75);font-family:'Segoe UI',sans-serif;font-size:28px}
</style></head><body>${inner}</body></html>`;

function wavDur(f) {
  const b = fs.readFileSync(f); let o = 12, rate = 48000, block = 4;
  while (o < b.length - 8) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') { rate = b.readUInt32LE(o + 12); block = b.readUInt16LE(o + 20); }
    if (id === 'data') return sz / (rate * block); o += 8 + sz + (sz % 2); }
}

async function tts(text, stil = STIL) {
  let kp = path.join(os.homedir(), '.gemini-api-key');
  if (fs.statSync(kp).isDirectory()) kp = path.join(kp, fs.readdirSync(kp)[0]);
  for (;;) {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST', headers: { 'x-goog-api-key': fs.readFileSync(kp, 'utf8').trim(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.TTS_MODELL || 'gemini-3.8-flash-tts', input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style: stil + ' Auf Deutsch.' }] }] }],
        response_format: { type: 'audio', mime_type: 'audio/wav' }, generation_config: { speech_config: [{ voice: STIMME }] } }),
    });
    if (r.status === 429) { await new Promise((x) => setTimeout(x, 20000)); continue; }
    const j = await r.json(); if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300));
    return Buffer.from(j.steps.filter((s) => s.type === 'model_output').flatMap((s) => s.content).filter((c) => c.type === 'audio').pop().data, 'base64');
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = path.join(OUT, 'tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp);

  // Stimme je Szene (Stille vorn/hinten weg), Szenendauer daraus
  const dauer = [], ton = [];
  for (const [i, [, min, , text, luft]] of SZENEN.entries()) {
    if (OHNE_STIMME) { dauer.push(min); continue; }
    const f = path.join(OUT, `ton-${i}.wav`);
    if (!fs.existsSync(f) || process.env.NEU) {
      console.log('Stimme (Gemini):', text);
      fs.writeFileSync(path.join(tmp, 'raw.wav'), await tts(text, TON[i].stil));
      execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', path.join(tmp, 'raw.wav'), '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
        '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', f]);
    }
    ton.push(f);
    dauer.push(Math.max(min, +(0.15 + wavDur(f) / TEMPO + luft).toFixed(2)));
  }

  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  const overlays = [];
  for (const [i, [, , inner]] of SZENEN.entries()) {
    await pg.setContent(html(inner + '<div class="ki">Bilder: KI-generiert</div>'));
    await pg.evaluate(() => document.fonts.ready);
    const f = path.join(tmp, `o${i}.png`);
    await pg.screenshot({ path: f, omitBackground: true });
    overlays.push(f);
  }
  await br.close();

  const inputs = [], fc = [], start = [];
  let t = 0;
  SZENEN.forEach(([bild], i) => {
    const d = dauer[i]; start.push(t); t += d;
    const n = Math.round(d * FPS);
    inputs.push('-loop', '1', '-t', String(d), '-i', path.resolve(ST, bild), '-loop', '1', '-t', String(d), '-i', overlays[i]);
    fc.push(`[${2 * i}:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,` +
      `zoompan=z='1+0.08*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=1080x1920:fps=${FPS},setsar=1[b${i}]`);
    fc.push(`[b${i}][${2 * i + 1}:v]overlay=0:0:shortest=1,trim=duration=${d},setpts=PTS-STARTPTS[v${i}]`);
  });
  fc.push(`${SZENEN.map((_, i) => `[v${i}]`).join('')}concat=n=${SZENEN.length}:v=1:a=0,format=yuv420p[vout]`);
  // Schritt 1: Tonspur getrennt bauen (in einem Durchgang mit dem Bild hing ffmpeg)
  const spur = path.join(tmp, 'spur.wav');
  if (OHNE_STIMME) {
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'lavfi', '-t', t.toFixed(2), '-i', 'anullsrc=r=48000:cl=stereo', spur]);
  } else {
    const ai = [], af = [];
    ton.forEach((f, j) => { ai.push('-i', f); af.push(`[${j}:a]aformat=sample_rates=48000:channel_layouts=stereo,atempo=${TEMPO},adelay=${Math.round((start[j] + 0.15) * 1000)}:all=1[s${j}]`); });
    let k = ton.length; const lbl = ton.map((_, j) => `[s${j}]`);
    for (const [i, { sfx }] of Object.entries(TON)) for (const [d, ab, len, vol] of sfx) {
      ai.push('-i', path.join(SFX, d + '.mp3'));
      af.push(`[${k}:a]atrim=0:${len},afade=t=out:st=${Math.max(0, len - 0.4)}:d=0.4,volume=${vol},aformat=sample_rates=48000:channel_layouts=stereo,adelay=${Math.round((start[i] + ab) * 1000)}:all=1[x${k}]`);
      lbl.push(`[x${k}]`); k++;
    }
    af.push(`${lbl.join('')}amix=inputs=${lbl.length}:normalize=0:duration=longest,apad=whole_dur=${t.toFixed(2)},loudnorm=I=-16:TP=-1.5:LRA=11[a]`);
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...ai, '-filter_complex', af.join(';'), '-map', '[a]', '-ar', '48000', '-t', t.toFixed(2), spur]);
  }
  // Schritt 2: Bild + Tonspur
  const vid = path.join(tmp, 'bild.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc.join(';'), '-map', '[vout]',
    '-t', t.toFixed(2), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-r', String(FPS), vid], { stdio: 'inherit' });
  const out = path.join(OUT, `video-wichteln-erklaert${OHNE_STIMME ? '-ohne-ton' : ''}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', vid, '-i', spur, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${out} (${t.toFixed(1)} s) Szenen: ${dauer.join(' / ')}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
