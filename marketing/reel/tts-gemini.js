// Erzählstimme über die Gemini-API (gemini-3.8-flash-tts, Stimme „Riko“ wie in AI Studio).
// node marketing/reel/tts-gemini.js 2          -> adventskalender/folge-02/ton-0.wav (Titel) … ton-N.wav (je Bild)
// node marketing/reel/tts-gemini.js 2 3        -> nur ton-3.wav neu
// Schlüssel: Datei in C:\Users\<name>\.gemini-api-key (oder Ordner mit genau einer Datei darin) – nie ins Repo.
// Kosten (bezahlter Schlüssel): ca. 0,2 Cent je 10 s Audio.
const fs = require('fs');
const path = require('path');
const os = require('os');
const N = String(process.argv[2] || '1').padStart(2, '0');
const ONLY = process.argv[3] !== undefined ? +process.argv[3] : null;
const DIR = path.join(__dirname, 'adventskalender', `folge-${N}`);
const cfg = JSON.parse(fs.readFileSync(path.join(DIR, 'folge.json'), 'utf8'));
let kp = path.join(os.homedir(), '.gemini-api-key');
if (fs.statSync(kp).isDirectory()) kp = path.join(kp, fs.readdirSync(kp)[0]);
const KEY = fs.readFileSync(kp, 'utf8').trim();
const VOICE = cfg.stimme || 'en-us-riko';
// Grundstil + Stimmung je Bild (folge.json: titelStimmung, absaetze[].stimmung)
const STIL = cfg.stil || 'Warme Erzählerstimme für Kinder, auf Deutsch, zügig und lebendig gesprochen, kurze Pausen.';

const texte = [cfg.titelSprache, ...cfg.absaetze.map((a) => (a.sprache || a.untertitel.join(' ')))];
const stimmungen = [cfg.titelStimmung, ...cfg.absaetze.map((a) => a.stimmung)];

async function tts(text, stimmung) {
  const body = {
    model: 'gemini-3.8-flash-tts',
    input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style: stimmung ? STIL + ' Stimmung: ' + stimmung : STIL }] }] }],
    response_format: { type: 'audio', mime_type: 'audio/wav' },
    generation_config: { speech_config: [{ voice: VOICE }] },
  };
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 400));
  const audio = j.steps.filter((s) => s.type === 'model_output').flatMap((s) => s.content).filter((c) => c.type === 'audio').pop();
  return Buffer.from(audio.data, 'base64');
}

(async () => {
  for (const [i, t] of texte.entries()) {
    if (!t || (ONLY !== null && i !== ONLY)) continue;
    const buf = await tts(t, stimmungen[i]);
    fs.writeFileSync(path.join(DIR, `ton-${i}.wav`), buf);
    console.log(`ton-${i}.wav  ${(buf.length / 48000).toFixed(1)} s  ${t.slice(0, 50)}`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
