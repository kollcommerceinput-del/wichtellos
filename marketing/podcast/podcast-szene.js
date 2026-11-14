// Mehrstimmige Podcast-Szene (Erzähler/Onni/Ulla je eigene Gemini-Stimme) + Geräusche, ohne Musik (Toni 11.11.)
// szene.json: { "rollen": {"E": {"stimme":"puck","stil":"…"}, …}, "teile": [["E","Text", pauseDanach?], …],
//               "geraeusche": [[TeilNr, Versatz, "datei", Dauer, dB], …], "out": "probe.mp3" }
// node marketing/podcast/podcast-szene.js probe-szene/szene.json   (ton-N.wav gecacht, NEU=1 neu)
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const FFMPEG = process.env.FFMPEG || 'C:/Users/toens/AppData/Roaming/Python/Python314/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const SND = path.join(__dirname, '..', 'reel', 'sounds-pixabay');

function wavDur(f) {
  const b = fs.readFileSync(f); let o = 12, rate = 48000, block = 4;
  while (o < b.length - 8) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') { rate = b.readUInt32LE(o + 12); block = b.readUInt16LE(o + 20); }
    if (id === 'data') return sz / (rate * block); o += 8 + sz + (sz % 2); }
}
async function tts(text, stil, stimme) {
  let kp = path.join(os.homedir(), '.gemini-api-key');
  if (fs.statSync(kp).isDirectory()) kp = path.join(kp, fs.readdirSync(kp)[0]);
  for (;;) {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST', headers: { 'x-goog-api-key': fs.readFileSync(kp, 'utf8').trim(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.TTS_MODELL || 'gemini-3.8-flash-tts', input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style: stil }] }] }],
        response_format: { type: 'audio', mime_type: 'audio/wav' }, generation_config: { speech_config: [{ voice: stimme }] } }),
    });
    if (r.status === 429) { await new Promise((x) => setTimeout(x, 20000)); continue; }
    const j = await r.json(); if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300));
    return Buffer.from(j.steps.filter((s) => s.type === 'model_output').flatMap((s) => s.content).filter((c) => c.type === 'audio').pop().data, 'base64');
  }
}

// Sparmodus (Standard, Toni 12.11.: „so wenig Abfragen wie möglich“): Alle fehlenden Teile EINER Rolle (gleiche Stimme + Stil)
// gehen gebündelt in eine Anfrage (bis BUENDEL Zeichen), Absätze mit Pause dazwischen. Danach wird an den längsten Pausen
// wieder in Einzelteile geschnitten (Anzahl bekannt) und jedes Stück passend zur Textlänge geprüft. EINZELN=1 = alter Weg (1 Anfrage je Teil).
// NUR_EINE=1 = nach der ersten Anfrage aufhören (Test).
const BUENDEL = +(process.env.BUENDEL || 1500);
function pausen(f) {   // Stille-Abschnitte [start, ende] einer WAV
  const out = require('child_process').spawnSync(FFMPEG, ['-i', f, '-af', 'silencedetect=noise=-40dB:d=0.25', '-f', 'null', '-'], { encoding: 'utf8' }).stderr || '';
  const st = [...out.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]), en = [...out.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  return st.map((s, i) => [s, en[i] ?? s]);
}
// Zeitmarken: ein Gemini-Textmodell hört das Bündel und nennt Start/Ende jedes Satzes (eigenes Kontingent, nicht das der Stimme).
// Getestet 12.11. mit Onni-Bündel (12 kurze Sätze): alle Grenzen passend. Danach wird auf die nächste echte Pause geschnappt.
async function zeitmarken(wav, saetze) {
  let kp = path.join(os.homedir(), '.gemini-api-key');
  if (fs.statSync(kp).isDirectory()) kp = path.join(kp, fs.readdirSync(kp)[0]);
  const mp3 = wav.replace(/\.wav$/, '-zeit.mp3');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '16000', '-b:a', '32k', mp3]);
  const prompt = 'In dieser Aufnahme werden nacheinander diese Sätze gesprochen:\n' + saetze.map((s, i) => `${i + 1}. ${s}`).join('\n') +
    '\nGib für jeden Satz Start- und Endzeit in Sekunden (auf 0,1 s genau) als JSON-Liste [{"nr":1,"start":0.0,"ende":0.0}, …]. Nur JSON.';
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.ZEIT_MODELL || 'gemini-3.8-flash'}:generateContent`, {
    method: 'POST', headers: { 'x-goog-api-key': fs.readFileSync(kp, 'utf8').trim(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ inline_data: { mime_type: 'audio/mp3', data: fs.readFileSync(mp3).toString('base64') } }, { text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' } }),
  });
  fs.rmSync(mp3);
  const j = await r.json(); if (!r.ok) throw new Error('Zeitmarken: ' + JSON.stringify(j).slice(0, 200));
  const liste = JSON.parse(j.candidates[0].content.parts.map((p) => p.text).join(''));
  if (liste.length !== saetze.length) throw new Error(`Zeitmarken: ${liste.length} statt ${saetze.length} Sätze`);
  return liste;
}

async function buendeln(k, dir, fehlend) {
  const gruppen = {};
  for (const i of fehlend) (gruppen[k.teile[i][0]] ||= []).push(i);
  let anfragen = 0;
  for (const [rolle, idx] of Object.entries(gruppen)) {
    const R = k.rollen[rolle];
    // in Bündel bis BUENDEL Zeichen teilen
    const buendel = [[]]; let len = 0;
    for (const i of idx) { const l = k.teile[i][1].length; if (len + l > BUENDEL && buendel.at(-1).length) { buendel.push([]); len = 0; } buendel.at(-1).push(i); len += l; }
    for (const b of buendel) {
      console.log(`Anfrage ${++anfragen}: ${rolle} (${R.stimme}), ${b.length} Teile, ${b.reduce((a, i) => a + k.teile[i][1].length, 0)} Zeichen`);
      const raw = path.join(dir, 'raw.wav'), sauber = path.join(dir, `buendel-${b[0]}-${b.at(-1)}.wav`);
      // schon geholtes Bündel (z. B. nach Schnittfehler) wiederverwenden statt neu anzufragen
      if (!fs.existsSync(sauber)) fs.writeFileSync(raw, await tts(b.map((i) => k.teile[i][1]).join('\n\n'), R.stil + ' Mache nach jedem Absatz eine deutliche Pause von etwa zwei Sekunden.', R.stimme));
      if (fs.existsSync(raw)) { execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', raw, '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', sauber]); fs.rmSync(raw); }
      const dauer = wavDur(sauber);
      // Schnittpunkte: beste Kombination aller Pausen (dynamische Programmierung). Erwartete Länge je Teil = Grundzeit + Zeichen × Tempo
      // (kurze Sätze wie „Bereit!“ brauchen relativ mehr Zeit). Bewertet: Abweichung von der erwarteten Länge minus Pausenlänge.
      const chars = b.map((i) => k.teile[i][1].length), GRUND = 0.6;
      const proZeichen = Math.max(0.02, (dauer - GRUND * b.length - 1.2 * (b.length - 1)) / chars.reduce((a, c) => a + c, 0));
      const erw = chars.map((c) => GRUND + c * proZeichen);
      const kand = pausen(sauber).filter(([s, e]) => s > 0.1 && e < dauer - 0.1).map(([s, e]) => ({ t: (s + e) / 2, lang: e - s }));
      const N = b.length, M = kand.length, kosten = (d, e) => ((d - e) ** 2) / Math.max(e, 1);
      if (M < N - 1) throw new Error(`Bündel ${rolle}: nur ${M} Pausen für ${N} Teile – EINZELN=1 nutzen`);
      // best[j][m] = minimale Kosten, wenn Schnitt j (0-basiert) auf Kandidat m liegt
      const best = Array.from({ length: N - 1 }, () => Array(M).fill(Infinity)), vor = Array.from({ length: N - 1 }, () => Array(M).fill(-1));
      if (N > 1) for (let m = 0; m < M; m++) best[0][m] = kosten(kand[m].t, erw[0] + kand[m].lang / 2) - 3 * kand[m].lang;
      for (let j = 1; j < N - 1; j++) for (let m = j; m < M; m++) for (let q = j - 1; q < m; q++) {
        if (best[j - 1][q] === Infinity) continue;
        const v = best[j - 1][q] + kosten(kand[m].t - kand[q].t, erw[j] + (kand[q].lang + kand[m].lang) / 2) - 3 * kand[m].lang;
        if (v < best[j][m]) { best[j][m] = v; vor[j][m] = q; }
      }
      let endM = -1, endV = Infinity;
      if (N > 1) for (let m = N - 2; m < M; m++) { const v = best[N - 2]?.[m] + kosten(dauer - kand[m].t, erw[N - 1] + kand[m].lang / 2); if (v < endV) { endV = v; endM = m; } }
      let p = [];
      if (N > 1) { for (let j = N - 2, m = endM; j >= 0; m = vor[j][m], j--) p.unshift(kand[m].t); }
      // Bevorzugt: Zeitmarken von Gemini, auf die nächste Pause (±1 s) geschnappt; die Rechnung oben bleibt Rückfall
      if (N > 1 && !process.env.OHNE_ZEITMARKEN) {
        try {
          const z = await zeitmarken(sauber, b.map((i) => k.teile[i][1]));
          // Bei langen Bündeln liegen Geminis Zeiten oft gestreckt (12.11.: Ende 146,8 s bei 110,4 s Aufnahme) → auf echte Länge skalieren
          const faktor = dauer / Math.max(z.at(-1).ende, 0.1);
          const neu = z.slice(0, -1).map((s, j) => {
            const ziel = ((s.ende + z[j + 1].start) / 2) * faktor, fenster = 2;
            // stärkste Pause in der Nähe (lang, nah)
            const nah = kand.filter((c) => Math.abs(c.t - ziel) < fenster).sort((a, c) => (c.lang - Math.abs(c.t - ziel) / fenster) - (a.lang - Math.abs(a.t - ziel) / fenster))[0];
            return nah ? nah.t : ziel;
          });
          if (neu.some((t, j) => t <= (neu[j - 1] ?? 0) + 0.3 || t >= dauer - 0.3)) throw new Error('Zeitmarken nicht aufsteigend');
          // Beide Schnitte bewerten (Teil-Längen gegen erwartete Längen), den besseren nehmen.
          // 12.11.: kurze Dialogsätze → Zeitmarken besser; langes Erzähler-Bündel (110 s) → Zeitmarken verrutscht, Rechnung besser.
          const guete = (pp) => { const g = [0, ...pp, dauer]; return erw.reduce((a, e, j) => a + kosten(g[j + 1] - g[j], e + 0.8), 0); };
          const gz = guete(neu), gr = guete(p);
          console.log(`  Abweichung: Zeitmarken ${gz.toFixed(1)}, Rechnung ${gr.toFixed(1)} → ${gz <= gr ? 'Zeitmarken' : 'Rechnung'}`);
          if (gz <= gr) p = neu;
        } catch (e) { console.log('  ⚠ ' + e.message + ' – schneide nach Längen-Rechnung'); }
      }
      const grenzen = [0, ...p, dauer];
      b.forEach((i, j) => {
        const d = grenzen[j + 1] - grenzen[j], erwartet = erw[j] + 0.8;
        if (d < erwartet * 0.5 || d > erwartet * 1.8) console.log(`  ⚠ Teil ${i}: ${d.toFixed(1)} s, erwartet ~${erwartet.toFixed(1)} s – bitte anhören`);
        const f = path.join(dir, `ton-${i}.wav`);
        execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-ss', grenzen[j].toFixed(3), '-to', grenzen[j + 1].toFixed(3), '-i', sauber, '-af',
          'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', '-c:a', 'pcm_s16le', f]);
        fs.writeFileSync(f + '.txt', `${R.stimme}|${R.stil}|${k.teile[i][1]}`);
      });
      // Bündel bleibt liegen (zum Nachschneiden ohne neue Anfrage); löschen, wenn alles passt
      if (process.env.NUR_EINE) { console.log('NUR_EINE: Test-Anfrage fertig.'); process.exit(0); }
    }
  }
  console.log(`${anfragen} Anfrage(n) für ${fehlend.length} Teile.`);
}

(async () => {
  const kf = path.resolve(__dirname, process.argv[2]), dir = path.dirname(kf);
  const k = JSON.parse(fs.readFileSync(kf, 'utf8'));
  const fehltTeil = (i) => { const R = k.rollen[k.teile[i][0]], f = path.join(dir, `ton-${i}.wav`);
    return !fs.existsSync(f) || process.env.NEU || fs.readFileSync(f + '.txt', 'utf8') !== `${R.stimme}|${R.stil}|${k.teile[i][1]}`; };
  if (!process.env.EINZELN) { const fehlend = k.teile.map((_, i) => i).filter(fehltTeil); if (fehlend.length) await buendeln(k, dir, fehlend); delete process.env.NEU; }
  const ton = [];
  for (const [i, [rolle, text]] of k.teile.entries()) {
    const R = k.rollen[rolle], f = path.join(dir, `ton-${i}.wav`), key = `${R.stimme}|${R.stil}|${text}`;
    if (!fs.existsSync(f) || process.env.NEU || fs.readFileSync(f + '.txt', 'utf8') !== key) {
      console.log(rolle, text);
      const raw = path.join(dir, 'raw.wav');
      fs.writeFileSync(raw, await tts(text, R.stil, R.stimme));
      execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', raw, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
        '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', f]);
      fs.rmSync(raw); fs.writeFileSync(f + '.txt', key);
    }
    ton.push(f);
  }
  let t = 0.6; const start = [];
  k.teile.forEach(([rolle, , pause], i) => {
    start.push(t);
    const tempo = k.rollen[rolle].tempo || 1;
    t += wavDur(ton[i]) / tempo + (pause ?? (k.teile[i + 1]?.[0] === rolle ? 0.5 : 0.35));
  });
  const ende = t + 1.5, ai = [], af = [], mix = [];
  ton.forEach((f, j) => { ai.push('-i', f); af.push(`[${j}:a]atempo=${k.rollen[k.teile[j][0]].tempo || 1},adelay=${Math.round(start[j] * 1000)}:all=1[s${j}]`); mix.push(`[s${j}]`); });
  const PEGEL = JSON.parse(fs.readFileSync(path.join(__dirname, "pegel.json"), "utf8"));
  (k.geraeusche || []).forEach(([nr, vers, datei, d0, db0], j) => {
    const db = db0 ?? PEGEL[datei] ?? -6;
    let d = d0; if (typeof d === 'string') d = start[+d.split(':')[1]] - start[nr] - vers; // "bis:N" = bis Teil N
    const n = ton.length + j, fd = Math.min(0.4, d / 3);
    ai.push('-stream_loop', '-1', '-i', path.join(SND, datei + '.mp3')); // Schleife: „läuft weiter“-Geräusche (Uhr, Tropfen) länger als die Datei (13.11.)
    af.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${d},asetpts=PTS-STARTPTS,volume=${db}dB,` +
      `afade=t=in:d=0.05,afade=t=out:st=${(d - fd).toFixed(2)}:d=${fd},adelay=${Math.round((start[nr] + vers) * 1000)}:all=1[g${j}]`);
    mix.push(`[g${j}]`);
  });
  // Musik (nur auf Wunsch, Toni 12.11. Trailer): "musik": ["datei ohne .mp3 (sounds-pixabay/…)", dB] – läuft in Schleife unter allem, ein-/ausgeblendet
  if (k.musik) {
    // optional 3. Wert: Lautstärke-Verlauf [[TeilNr, dB], …] – linear zwischen den Teil-Anfängen (Toni 12.11.: zur Mitte lauter, Höhepunkt bei „Folgt uns“)
    const [datei, db = -24, verlauf = []] = k.musik, n = ai.filter((a) => a === '-i').length;
    const pkt = [[0, db], ...verlauf.map(([nr, d, vers = 0]) => [start[nr] + vers, d])];  // [TeilNr, dB, Versatz s]
    const lin = (d) => Math.pow(10, d / 20).toFixed(4);
    let ausdruck = lin(pkt.at(-1)[1]);
    for (let i = pkt.length - 2; i >= 0; i--) {
      const [t0, d0] = pkt[i], [t1, d1] = pkt[i + 1];
      ausdruck = `if(lt(t,${t1.toFixed(2)}),pow(10,(${d0}+(${d1 - d0})*(t-${t0.toFixed(2)})/${Math.max(t1 - t0, 0.01).toFixed(2)})/20),${ausdruck})`;
    }
    ai.push('-stream_loop', '-1', '-i', path.join(SND, datei + '.mp3'));
    af.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${ende.toFixed(2)},asetpts=PTS-STARTPTS,volume='${ausdruck}':eval=frame,afade=t=in:d=1.5,afade=t=out:st=${(ende - 3).toFixed(2)}:d=3[mus]`);
    mix.push('[mus]');
  }
  // 14.11. (Toni: Uhr „mit Satzende unterbrochen“): loudnorm im Einfach-Modus regelt dynamisch (Pausen lauter) → Hintergrund pumpt.
  // Jetzt 2 Durchgänge: erst messen, dann linear = eine feste Verstärkung für die ganze Folge.
  const LN = 'I=-18:TP=-1.5:LRA=20';
  const graph = (ln) => [...af, `${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,apad=whole_dur=${ende.toFixed(2)},loudnorm=${ln}[a]`].join(';');
  const mess = require('child_process').spawnSync(FFMPEG, ['-hide_banner', '-nostats', ...ai, '-filter_complex', graph(LN + ':print_format=json'), '-map', '[a]', '-t', ende.toFixed(2), '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const m = JSON.parse(mess.stderr.slice(mess.stderr.lastIndexOf('{'), mess.stderr.lastIndexOf('}') + 1));
  const ln2 = `${LN}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  const out = path.join(dir, k.out || 'probe.mp3');
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...ai, '-filter_complex', graph(ln2), '-map', '[a]', '-ar', '44100', '-t', ende.toFixed(2), '-c:a', 'libmp3lame', '-b:a', '128k', out]);
  console.log(`fertig: ${out} (${ende.toFixed(1)} s)`);
})().catch((e) => { console.error(e.message); process.exit(1); });
