// Aussprache-Prüfung (Toni 13.11.: Sprecher sagte „erzohlte“ statt „erzählte“ – die normale Abschrift korrigiert so etwas stillschweigend).
// Schickt jeden Sprech-Teil (ton-N.wav) MIT dem Soll-Text an Gemini und fragt gezielt nach Abweichungen in der Aussprache.
//   node marketing/podcast/aussprache-check.js folge-06            (alle Teile ab 4, ohne Intro/Outro aus dem Cache)
//   node marketing/podcast/aussprache-check.js folge-06 10 14      (nur diese Teile)
// Ausgabe: nur auffällige Teile, je Wort: geschrieben → gehört. Kostet keine Stimm-Anfragen (Textmodell).
const fs = require('fs'), path = require('path'), os = require('os');
let kp = path.join(os.homedir(), '.gemini-api-key'); if (fs.statSync(kp).isDirectory()) kp = path.join(kp, fs.readdirSync(kp)[0]);
const KEY = fs.readFileSync(kp, 'utf8').trim();
const dir = path.resolve(__dirname, process.argv[2]);
const k = JSON.parse(fs.readFileSync(path.join(dir, 'szene.json'), 'utf8'));
let idx = process.argv.slice(3).map(Number);
if (!idx.length) idx = k.teile.map((_, i) => i).filter((i) => i >= 4 && !['OF', 'EA', 'FS'].includes(k.teile[i][0]));

const FRAGE = (soll) => `Du bist Tonmeister für ein deutsches Kinderhörbuch. Der Sprecher sollte GENAU diesen Text sprechen:
"""${soll}"""
Höre sehr genau hin. Melde jedes Wort, das hörbar ANDERS ausgesprochen wird als geschrieben: falscher Vokal oder Umlaut (z. B. „erzohlte“ statt „erzählte“, „Mutze“ statt „Mütze“), verschluckte oder abgeschnittene Silben (besonders am Satzanfang, z. B. „nni“ statt „Onni“), falsche Betonung, die das Wort verfremdet, ausgelassene, zusätzliche oder vertauschte Wörter. Der Name „Onni“ wird „On-ni“ gesprochen (kurzes O).
Ignoriere normale Sprechmelodie, Pausen und Satzzeichen. Melde nichts, wenn du unsicher bist.
Antworte NUR mit JSON: {"fehler":[{"wort":"geschrieben","gehoert":"so klingt es","art":"Vokal|Silbe|Betonung|Wort"}]} – leere Liste, wenn alles stimmt.`;

(async () => {
  let n = 0;
  for (const i of idx) {
    const f = path.join(dir, `ton-${i}.wav`);
    if (!fs.existsSync(f)) { console.log(i, 'fehlt'); continue; }
    const body = { contents: [{ parts: [{ inline_data: { mime_type: 'audio/wav', data: fs.readFileSync(f).toString('base64') } }, { text: FRAGE(k.teile[i][1]) }] }],
      generationConfig: { responseMimeType: 'application/json' } };
    let j;
    for (let v = 0; v < 4; v++) {
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
        { method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (r.status === 429) { await new Promise((x) => setTimeout(x, 20000)); continue; }
      j = await r.json(); break;
    }
    let erg; try { erg = JSON.parse(j.candidates[0].content.parts[0].text).fehler || []; } catch { console.log(i, 'Antwort unklar:', JSON.stringify(j).slice(0, 150)); continue; }
    if (erg.length) { n++; console.log(`${i} [${k.teile[i][0]}] ` + erg.map((e) => `${e.wort} → ${e.gehoert} (${e.art})`).join(' · ')); }
  }
  console.log(`geprüft: ${idx.length} Teile, auffällig: ${n}`);
})();
