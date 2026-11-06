// Sprechertext fürs Reel „Handy + Stimme“ (Gemini, Stimme Charon = informativ). node stimme.js [nr]
const fs = require('fs'), os = require('os'), path = require('path');
let kp = path.join(os.homedir(), '.gemini-api-key'); if (fs.statSync(kp).isDirectory()) kp = path.join(kp, fs.readdirSync(kp)[0]);
const KEY = fs.readFileSync(kp, 'utf8').trim();
const STIL = 'Deutsch, zügig, klar und informativ, freundlich wie ein kurzes Erklärvideo, keine langen Pausen.';
const T = ['Wichteln per WhatsApp? Ganz einfach – mit wichtellos.de.', 'Gruppe und Budget eintragen.', 'Dann alle Namen rein – wer mag, gibt noch einen Tipp mit.',
  'Auf „Jetzt auslosen“ tippen – fertig.', 'Jeder bekommt seinen eigenen geheimen Link.', 'Den schickst du per WhatsApp – zum Beispiel an Anna.',
  'Anna tippt auf den Link …', '… und nur sie sieht, wen sie beschenkt.', 'Wichtellos.de – kostenlos und ohne Anmeldung.'];
const nur = process.argv[2] !== undefined ? +process.argv[2] : null;
(async () => {
  for (const [i, t] of T.entries()) {
    if (nur !== null && i !== nur) continue;
    const body = { model: 'gemini-3.8-flash-tts', input: [{ type: 'user_input', content: [{ type: 'text', text: t, annotations: [{ type: 'speech_metadata', style: STIL }] }] }],
      response_format: { type: 'audio', mime_type: 'audio/wav' }, generation_config: { speech_config: [{ voice: 'Charon' }] } };
    let r; for (;;) { r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', { method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); if (r.status !== 429) break; await new Promise((x) => setTimeout(x, 20000)); }
    const j = await r.json(); if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300));
    const a = j.steps.filter((s) => s.type === 'model_output').flatMap((s) => s.content).filter((c) => c.type === 'audio').pop();
    const buf = Buffer.from(a.data, 'base64'); fs.writeFileSync(path.join(__dirname, 'stimme', `s${i}.wav`), buf);
    console.log(`s${i}.wav ${(buf.length / 48000).toFixed(1)} s  ${t}`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
