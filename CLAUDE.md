# WichtelLos – Projektkontext

Statische Website **wichtellos.de**: Wichteln online auslosen (kostenlos, ohne Anmeldung, ohne Server) plus
Ratgeber-Seiten mit Amazon-Partnerlinks. Betreiber: KOLL Commerce UG (haftungsbeschränkt), Geschäftsführer Antonio Koll.

**Eigenständiges Projekt – nie mit dem Shop-Repo `kollstore` oder dem Shop kollcommerce.de vermischen.**
Antworten auf Deutsch.

## Aufbau (Kurzfassung)

**Details zu jeder Seite, jedem Skript und jedem Marketing-Schritt: `notizen/aufbau-details.md`** – vor Arbeit an einer Seite,
einem Video, Pin, Shop- oder Podcast-Thema dort den passenden Abschnitt lesen (grep nach Seitenpfad oder Skriptname).

- `build.py` baut alle Seiten nach `website/` (Inhalte von Ratgebern, Impressum, Datenschutz stehen dort; Daten in `gifts.py`,
  `geschenke.py`, `hobbys.py`, `ideen/`, `themen.py`, `wissen.py`, `shop_daten.py`). `tool.html` = Startseite mit Auslosungs-Tool.
- `website/` ist **generiert** – nie von Hand bearbeiten. Nach jeder Änderung `python3 build.py website`, Ausgabe + Diff prüfen
  (ein abgebrochener Build ging einmal halb leer live). Nach dem Deploy `tests/live-check.py`, erst dann „online“ melden.
- Tests: Playwright in `tests/` (Server vorher: `cd website && python3 -m http.server 8766`).
- Amazon-Partner-ID steht **nur** in `build.py` (`AMAZON_TAG`). Keine Preise/Amazon-Fotos zeigen (PartnerNet-Regeln).
- Neue Seite = Sitemap + og-Bild (`marketing/render-og.js`) + Fuß-Link; Suche (`/suche.json`) und `/llms.txt` füllen sich selbst.
- Nie umbenennen (Pins/Animation hängen daran): Sprungmarken `#briefe`, `#wichtelname`, `#sticker`, `#streiche`; Gruppe `class="lid"`.
- Fredoka ist selbst gehostet – auf der Website nie Google Fonts (Datenschutz). Kein Tracking/Analyse ohne Datenschutz + Banner.
- Werbung nie im Kindertext/Onni-Video (UWG), nur „Für die Großen“. Alkohol-Ideen nur „ab 18“, nie auf Kinder-/Schulseiten.
- Onni = WichtelLos-Wichtel: klein, Mütze über den Augen, „läuft“ (tapst nie), nie „Taschentuch“ (→ „weißes Tuch“).
- `marketing/` = Pins, Reels, Videos, Merch, Podcast (Skripte `render-*.js`); Pins immer mit Themen, Alt-Text, KI-Label.
  Podcast-Regeln: `marketing/podcast/SCHREIBREGELN.md`.
- Schwesterprojekt `G:\wichtellos-content` (kein Git, nicht öffentlich) – nie ins Website-Repo kopieren.

## Wie das Tool funktioniert

Die Auslosung läuft komplett im Browser. Jeder Teilnehmer bekommt einen Link `https://wichtellos.de/#w=…`;
die Zuteilung steckt codiert (nicht verschlüsselt) im Teil nach `#` und wird nie an den Server geschickt.
Optional pro Person ein „💡 Tipp“ (max. 80 Zeichen, Feld `t`): steckt nur im Link dessen, der die Person zieht; die Seite des
geheimen Links zeigt ihn plus „Passend zum Tipp“-Amazon-Links (Stichworte aus dem Tipp, Verneinungen wie „keine …“ gefiltert).
Wichtel-Lose zum Ausdrucken (Ansicht `view-print`): je Person Name außen, QR-Code des geheimen Links innen, 6 pro A4.
Umschalter „Ohne Handy – für Kinder“ (`lose-mode=name`): innen steht stattdessen der Partner-Name (+ Tipp) im Klartext,
per `decode()` aus dem Link gelesen.
QR entsteht im Browser über `assets/qrcode.js` – gebündelt aus npm „qrcode“ + „dijkstrajs“ (MIT) mit `node tools/bundle-qr.js`.
Entwurf und letzte Links liegen nur im localStorage. Diese Zusagen stehen so auch in Datenschutz und FAQ –
wer Analyse, AdSense o. Ä. einbaut, muss Datenschutzerklärung, FAQ-Texte und Einwilligungs-Banner anpassen.

## Hosting und Deploy (GitHub Pages)

- Repo ist **öffentlich** (nötig für kostenloses GitHub Pages) – also nie Zugangsdaten, Kundendaten o. Ä. committen.
- Jeder Push auf `main` veröffentlicht `website/` automatisch (`.github/workflows/pages.yml`). Kein Upload mehr.
- Domain `wichtellos.de` bleibt bei IONOS registriert; DNS zeigt auf GitHub Pages (A-Records 185.199.108–111.153,
  `www` als CNAME auf `kollcommerceinput-del.github.io`). HTTPS macht GitHub kostenlos („Enforce HTTPS“).
- `.htaccess` wird von GitHub Pages ignoriert; die 404-Seite (`404.html`) und www → ohne www übernimmt Pages selbst.
- Bis 30.10.2026 lief die Seite im IONOS-Webspace (Ordner `/wichtellos`); das IONOS-SSL (96 €/Jahr) wurde gekündigt.
- Nach dem Deploy live prüfen: Startseite, Auslosung bis zum geheimen Link, alle Ratgeber-Seiten,
  `/gibt-es-nicht/` muss die eigene 404-Seite zeigen, `/sitemap.xml`, `/robots.txt`, Vorschaubild beim Teilen in WhatsApp.
- Google Search Console: Domain-Property `wichtellos.de`, bestätigt per DNS-TXT (`google-site-verification=…`, nicht löschen).
- Bing Webmaster Tools: `https://wichtellos.de/`, bestätigt per DNS-CNAME `b6492afd…` → `verify.bing.com` und Meta-Tag
  `msvalidate.01` (in `build.py`). Deckt Edge, DuckDuckGo, Yahoo, Ecosia, ChatGPT-Suche ab. Login: Konto mit KOLL-Logo als Profilbild (das Konto „KU“ hat keine Website – dort nichts anlegen). Stand 09.11.: Bing 1.–6.11. 54 Klicks/906 Aufrufe (mehr Klicks als Google: 26/1.210 in 28 Tagen), Platz 1–2 für „wichtel losen/auslosen“, „wichtelgenerator“; „wichtel-o-mat“ 158 Aufrufe Platz 8, 0 Klicks. AI Performance (Copilot): 156 Zitate in 6 Tagen, v. a. „wichteln auslosen“.
- YouTube (05.11.): Kanal **@WichtelLos** https://www.youtube.com/@WichtelLos (ID UCBaoI654NB6hH052CYAT08Q, Google-Login
  kollcommerce.input@gmail.com, Dienste nicht verknüpft). Banner `marketing/youtube-banner.jpg` (`node marketing/render-youtube-banner.js`),
  Logo = `marketing/instagram-profilbild.png`. Zielgruppe „je Video prüfen“ (Folgen = „für Kinder“), Upload-Standards: Deutsch, Film & Animation,
  Tags, Standard-Beschreibung mit Link + KI-Hinweis. Jedes Video: KI-Verwendung „Ja“. Erstes Short 05.11.: youtube.com/shorts/RHBsgQK2bxk
  (TikTok-Countdown 26). Planen auf 0 Uhr erst nach Telefon-Bestätigung (youtube.com/verify, Toni). Links in Fuß, Onni-Seite, Schema, llms.txt.
- E-Mail-Adresse der Website seit 05.11.: **wichtellos@mailbox.org** (Alias im mailbox.org-Postfach, Toni) – Impressum, Datenschutz, Schema.
- Pinterest: Unternehmensprofil pinterest.com/WichtelLos (entstand durch Umstellen des Logins kollcommerce;
  Kurzinfo + Impressum-Link gesetzt; Instagram @wichtellos verknüpft → neue Posts automatisch auf Pinnwand
  „Wichteln: Ideen & Reels“, ausgenommen #nopin/#anzeige; Werbe-Benachrichtigungen und Anzeigen-Personalisierung aus), Website bestätigt per Meta-Tag `p:domain_verify` (in `build.py`, nicht löschen). Pinterest-Tag (Tracking)
  bewusst nicht installiert – würde Datenschutz/Banner erfordern.

## Offen (Kurzliste)

**Verlauf und alle Einzelheiten: `notizen/offen.md`** – dort auch erledigte Punkte, Logins, Kontingente und Stolperfallen.

- Indexierung Google/Bing: neue Seiten in der Search Console beantragen; Bing über IndexNow automatisch.
- Awin: Thalia/Tchibo abgelehnt, Werbefläche validiert – neu bewerben erst mit mehr Reichweite.
- Externe Erwähnungen: Mails an Familienblogs 09.11. verschickt, Antworten abwarten.
- Spreadshop wichtellos.myspreadshop.de: `logo-wichtel-heisst-frei-fuer-dunkle-stoffe.png` hochladen; Werbung „Mit eurem Wichtelnamen“.
- Podcast „Onnis Adventskalender“ (Spotify-Show steht): Folge 1 bauen, Toni abnehmen lassen; danach Branch
  `podcast-vorbereitung` mergen (erst wenn Folge 1 online ist), Apple/Amazon, Werbe-Pins/-Video.
- UX-Analyse 08.11. teils offen; Türschilder-Entwurf (später); AdSense/Wunschliste später.

## Zusammenarbeit

- **Schwesterprojekt `G:\wichtellos-content`** (aus Cloud-Sitzung 02./03.11., kein Git, nicht öffentlich – nie ins Website-Repo
  kopieren): Flat-Onni als animierbare SVG-Figur (`wichtel/wichtel.js`, Toni 03.11. für Flat-Onni entschieden), Instagram-Story
  „Wichteln 2026?“ (noch nicht gepostet), **„24 Briefe von Onni“ (PDF für Ko-fi, Texte gegenlesen: Toni)**. Wichtelbriefe also
  nicht hier noch einmal bauen. Deren Search-Console-Liste ist veraltet – maßgeblich ist „Offen“ unten. `brand.css` dort lädt
  Google Fonts – auf der Website nie (Datenschutz), dort bleibt Fredoka selbst gehostet.

- Es arbeiten zwei Claude-Sitzungen am Repo: **PC** (Claude Code auf Tonis Rechner) und **Cloud** (claude.ai/code).
- **Toni legt fest, wer welche Aufgabe macht.** Nie beide an derselben Aufgabe.
- Vor jeder Arbeit `git pull`, danach kleine Commits und sofort `push`. Ein Push geht live – vorher testen.
- Commit-Nachrichten beginnen mit **[PC]** oder **[Cloud]**.
- Wird ein Push abgelehnt: `git pull --rebase`, nie `--force`.
- Neue Dateien und Funktionen kurz bei „Aufbau“ eintragen. Die CLAUDE.md pflegt nur PC; die Cloud meldet Änderungen über Toni.

## Regeln

- Keine Zugangsdaten (Passwörter, API-Keys, IONOS-/SFTP-Daten) committen.
- Commit-Nachrichten auf Deutsch, kurz und aussagekräftig; nach jeder Änderung committen und pushen (Branch `main`).
