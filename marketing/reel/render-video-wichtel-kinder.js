// Kindervideo „Was ist ein Wichtel?“ (Toni 08.11., Text von Toni, gekürzt: nur den Wichtel erklären, keine Sagen/Heinzelmännchen).
// node marketing/reel/render-video-wichtel-kinder.js -> marketing/reel/wichtel-kinder/video-wichtel-kinder.mp4
// Bilder aus den Onni-Folgen, Vorlesestimme puck (TEMPO 1.0), Geräusche leise, keine Musik, kein Text außer wichtellos.de am Ende. YouTube „für Kinder“.
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
const ST = path.join(__dirname, 'adventskalender');
const OUT = path.join(__dirname, 'wichtel-kinder');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts/fredoka-latin-600-normal.woff2')).toString('base64');
const FPS = 30;
const STIMME = 'puck';
const STIL = 'Freundlich, fröhlich und zügig wie ein kurzes Social-Media-Erklärvideo, klar und natürlich, auf Deutsch.';
const OHNE_STIMME = !!process.env.OHNE_STIMME;
const TEMPO = +(process.env.TEMPO || 1.0); // Stimme etwas schneller (Videos kurz halten, Toni)

// [Bild, Mindestdauer s, HTML, Sprechtext, Luft danach s]
const SFX = path.join(__dirname, 'sounds-pixabay');
// Tonlage (Gemini-Stil) und Geräusche je Szene: [Datei, ab s in der Szene, Länge s, Lautstärke] (Toni 08.11.)
const TON = {"0": {"stil": "warm und einladend, wie beim Vorlesen am Abend", "sfx": [["kamin", 0, 9, 0.12]]}, "1": {"stil": "liebevoll, staunend, mit einem Lächeln", "sfx": []}, "2": {"stil": "liebevoll, verschmitzt", "sfx": []}, "3": {"stil": "liebevoll beschreibend, mit einem Lächeln", "sfx": []}, "4": {"stil": "liebevoll beschreibend", "sfx": []}, "5": {"stil": "gemütlich, warm", "sfx": []}, "6": {"stil": "geheimnisvoll, leise", "sfx": []}, "7": {"stil": "geheimnisvoll", "sfx": []}, "8": {"stil": "geheimnisvoll, staunend", "sfx": [["tuer-knarren", -2.2, 2.0, 0.3]]}, "9": {"stil": "ruhig, leise", "sfx": []}, "10": {"stil": "leise, fast flüsternd, spannend", "sfx": [["laufen-holz", -2.8, 2.6, 0.25]]}, "11": {"stil": "fröhlich erzählend", "sfx": []}, "12": {"stil": "fröhlich erzählend", "sfx": []}, "13": {"stil": "warm, freundlich", "sfx": []}, "14": {"stil": "verschmitzt und lustig, am Ende ein kleines Kichern bei „Hihi“", "sfx": [["kichern", -2.4, 2.3, 0.3]]}, "15": {"stil": "leise und verschwörerisch, wie ein Geheimnis", "sfx": []}, "16": {"stil": "leise, verschwörerisch, beruhigend", "sfx": [["rascheln-diele", 1.4, 2.0, 0.3]]}, "17": {"stil": "staunend, nachdenklich", "sfx": []}, "18": {"stil": "staunend, leise", "sfx": [["glitzer", 0.6, 1.8, 0.35]]}, "19": {"stil": "staunend, fragend", "sfx": []}, "20": {"stil": "herzlich und fröhlich", "sfx": []}, "21": {"stil": "herzlich, neugierig fragend", "sfx": []}, "22": {"stil": "herzlich, voller Vorfreude", "sfx": []}, "23": {"stil": "herzlich, fröhlich", "sfx": []}, "24": {"stil": "herzlich, sanft zum Abschied", "sfx": [["gloeckchen", -3.2, 3.0, 0.3]]}};
const SZENEN = [
  [["folge-01/b01-wald.jpg", "folge-02/b01-bett.jpg"], 2.5, "", "Weißt du, was ein Wichtel ist? Nein? Dann mach es dir gemütlich. Ich erzähle dir alles, was man über Wichtel wissen muss.", 0.7],
  [["folge-01/b02-zapfen.jpg"], 2.5, "", "Ein Wichtel ist ganz klein, so groß wie eine kleine Kaffeetasse!", 0.7],
  [["folge-02/b04-teddy.jpg", "folge-02/b05-anlehnen.jpg"], 2.5, "", "Er könnte sich hinter deinem Teddy verstecken, und du würdest ihn nicht finden.", 0.7],
  [["folge-06/b08-muetze.jpg", "folge-01/b03-nase.jpg", "folge-03/b02-schnuppern.jpg"], 2.5, "", "Auf dem Kopf trägt er eine rote Zipfelmütze. Die rutscht ihm so tief über die Augen, dass man fast nur seine runde Knubbelnase sieht.", 0.7],
  [["folge-01/b06-packen.jpg"], 2.5, "", "Viele Wichtel haben einen langen weißen Bart.", 0.7],
  [["folge-05/b01-friert.jpg", "folge-06/b16-kuscheln.jpg"], 2.5, "", "Sie tragen warme Sachen: eine Strickjacke, einen Schal und kleine Stiefel. Wichtel mögen es nämlich kuschelig.", 0.7],
  [["folge-01/b08-haus.jpg"], 2.5, "", "Wichtel wohnen heimlich bei den Menschen.", 0.7],
  [["folge-05/b02-flur.jpg", "folge-05/b03-klettern.jpg"], 2.5, "", "Manche wohnen im Haus, unter den Dielen oder hinter dem Ofen.", 0.7],
  [["folge-01/b09-tuer.jpg", "folge-05/b09-brief-tuer.jpg"], 2.5, "", "Und manche wohnen hinter einer winzigen Tür, die so klein ist, dass man sie fast übersieht.", 0.7],
  [["folge-02/b08-schlafen.jpg"], 2.5, "", "Tagsüber merkt man nichts von ihm.", 0.7],
  [["folge-07/b01-wach.jpg", "folge-06/b06-schleichen.jpg", "folge-06/b03-schneespuren.jpg"], 2.5, "", "Aber nachts, wenn alle schlafen, wird der Wichtel ganz fleißig. Leise huscht er durchs Haus.", 0.7],
  [["folge-05/b08-korb-socken.jpg"], 2.5, "", "Er räumt auf, was liegen geblieben ist.", 0.7],
  [["folge-04/b06-ringelsocke.jpg"], 2.5, "", "Er flickt Sachen, die kaputt sind, zum Beispiel ein Loch in der Socke.", 0.7],
  [["folge-06/b09-flur-glitzer.jpg"], 2.5, "", "Und er passt auf das ganze Haus auf und bringt Glück.", 0.7],
  [["folge-06/b12-stiefel.jpg", "folge-06/b13-kruemel.jpg", "folge-07/b09-kichern.jpg"], 2.5, "", "Manchmal macht ein Wichtel aber auch ein bisschen Quatsch. Dann sind am Morgen plötzlich die Schnürsenkel zusammengeknotet. Hihi!", 0.7],
  [["folge-06/b02-lauschen.jpg", "folge-06/b04-schnuppern.jpg"], 2.5, "", "Das größte Geheimnis der Wichtel: Gesehen werden wollen sie nie!", 0.7],
  [["folge-07/b04-hoeren.jpg", "folge-07/b08-schlafzimmer.jpg", "folge-07/b05-uhr.jpg"], 2.5, "", "Wenn nachts etwas leise knarrt, dann bleib schön im Bett und schau nicht nach. Vielleicht war das ein Wichtel, und der möchte unentdeckt bleiben.", 0.7],
  [["folge-01/b04-weit.jpg", "folge-07/b02-wald.jpg", "folge-01/b05-ulla.jpg"], 2.5, "", "Gibt es Wichtel wirklich? Gesehen hat noch niemand einen. Das ist aber kein Wunder, denn Wichtel wollen ja nicht gesehen werden!", 0.7],
  [["folge-04/b01-kruemel.jpg", "folge-03/b07-schlitten.jpg", "folge-02/b06-brief.jpg"], 2.5, "", "Vielleicht findest du aber Spuren: ein aufgeräumtes Spielzeug, eine winzige Tür oder einen kleinen Krümel auf dem Boden.", 0.7],
  [["folge-02/b02-rausschauen.jpg"], 2.5, "", "Dann darfst du dich fragen: War das etwa ein Wichtel?", 0.7],
  [["folge-02/b03-baum.jpg", "folge-07/b10-singen.jpg"], 2.5, "", "Und weißt du was? Bei uns wohnt auch ein Wichtel. Er heißt Onni.", 0.7],
  [["folge-05/b07-schreiben.jpg", "folge-07/b11-brief.jpg"], 2.5, "<div style=\"position:absolute;left:0;right:0;bottom:170px;text-align:center\"><span class=\"url\">wichtellos.de</span></div>", "Und wie heißt dein Wichtel? Hat er noch keinen Namen? Auf wichtellos punkt de findet ihr einen.", 0.7],
  [["folge-03/b04-kekse.jpg"], 2.5, "<div style=\"position:absolute;left:0;right:0;bottom:170px;text-align:center\"><span class=\"url\">wichtellos.de</span></div>", "Ab dem ersten Dezember erzählt Onni dir jeden Tag eine neue Geschichte.", 0.7],
  [["folge-01/b10-brief.jpg"], 2.5, "<div style=\"position:absolute;left:0;right:0;bottom:170px;text-align:center\"><span class=\"url\">wichtellos.de</span></div>", "Frag deine Eltern, ob ihr den Kanal abonniert – dann bist du vom ersten Tag an dabei!", 0.7],
  [["folge-07/b13-gutenacht.jpg"], 2.5, "<div style=\"position:absolute;left:0;right:0;bottom:170px;text-align:center\"><span class=\"url\">wichtellos.de</span></div>", "Bis bald! Onni freut sich auf dich.", 2.2],
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
  // Mehrere Bilder je Szene (Toni 08.11.: „mehr Bilder“): Szenendauer wird gleichmäßig aufgeteilt
  let k = 0; const segs = [];
  SZENEN.forEach(([bild], i) => {
    const d = dauer[i]; start.push(t); t += d;
    const bilder = Array.isArray(bild) ? bild : [bild];
    bilder.forEach((b, j) => {
      const dj = +(d / bilder.length).toFixed(3);
      const n = Math.round(dj * FPS);
      inputs.push('-loop', '1', '-t', String(dj), '-i', path.resolve(ST, b), '-loop', '1', '-t', String(dj), '-i', overlays[i]);
      const zoom = (k % 2) ? `1.08-0.08*on/${n}` : `1+0.08*on/${n}`;
      fc.push(`[${2 * k}:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,` +
        `zoompan=z='${zoom}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=1080x1920:fps=${FPS},setsar=1[b${k}]`);
      fc.push(`[b${k}][${2 * k + 1}:v]overlay=0:0:shortest=1,trim=duration=${dj},setpts=PTS-STARTPTS[v${k}]`);
      segs.push(`[v${k}]`); k++;
    });
  });
  fc.push(`${segs.join('')}concat=n=${segs.length}:v=1:a=0,format=yuv420p[vout]`);
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
      af.push(`[${k}:a]atrim=0:${len},afade=t=out:st=${Math.max(0, len - 0.4)}:d=0.4,volume=${vol},aformat=sample_rates=48000:channel_layouts=stereo,adelay=${Math.round((ab < 0 ? start[i] + dauer[i] + ab : start[i] + ab) * 1000)}:all=1[x${k}]`);
      lbl.push(`[x${k}]`); k++;
    }
    af.push(`${lbl.join('')}amix=inputs=${lbl.length}:normalize=0:duration=longest,apad=whole_dur=${t.toFixed(2)},loudnorm=I=-16:TP=-1.5:LRA=11[a]`);
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...ai, '-filter_complex', af.join(';'), '-map', '[a]', '-ar', '48000', '-t', t.toFixed(2), spur]);
  }
  // Schritt 2: Bild + Tonspur
  const vid = path.join(tmp, 'bild.mp4');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc.join(';'), '-map', '[vout]',
    '-t', t.toFixed(2), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-r', String(FPS), vid], { stdio: 'inherit' });
  const out = path.join(OUT, `video-wichtel-kinder${OHNE_STIMME ? '-ohne-ton' : ''}.mp4`);
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', vid, '-i', spur, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`fertig: ${out} (${t.toFixed(1)} s) Szenen: ${dauer.join(' / ')}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
