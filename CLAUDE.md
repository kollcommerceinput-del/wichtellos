# WichtelLos – Projektkontext

Statische Website **wichtellos.de**: Wichteln online auslosen (kostenlos, ohne Anmeldung, ohne Server) plus
Ratgeber-Seiten mit Amazon-Partnerlinks. Betreiber: KOLL Commerce UG (haftungsbeschränkt), Geschäftsführer Antonio Koll.

**Eigenständiges Projekt – nie mit dem Shop-Repo `kollstore` oder dem Shop kollcommerce.de vermischen.**
Antworten auf Deutsch.

## Aufbau

- `tool.html` – Startseite mit dem Auslosungs-Tool (Vorlage, Kopf/Fuß werden beim Bauen eingesetzt)
- `build.py` – baut alle Seiten nach `website/`; Inhalte der Ratgeber-Seiten, Impressum und Datenschutz stehen hier
- `assets/style.css`, `assets/site.js` – gemeinsames CSS und JS. Die Amazon-Partner-ID steht **nur** in `build.py` (`AMAZON_TAG`); das Bauen schreibt sie in alle Amazon-Links und in `site.js`
- `gifts.py` – Daten für Geschenkfinder (104 Ideen mit Alter, Budget, Kategorie, bürotauglich) und Selbermach-Anleitungen
- `assets/finder.js` – Filter des Geschenkfinders (`/geschenkfinder/`, Filter auch per Adresse `?fuer=&budget=&mag=&q=`)
- `build.py`: `office_page()` – `/wichteln-im-buero/` (Büro-Wichteln, verlinkt Geschenkfinder `?fuer=office`); Suchbegriffe
  Wichtelgenerator/Julklapp/Secret Santa stehen in Startseiten-Titel, Lead und FAQ (31.10.)
- `build.py`: `FAQ`/`HOW_TO` – sichtbare FAQ der Startseite und FAQPage-Daten aus einer Liste (Schema-Text = sichtbarer Text)
- `.github/workflows/pages.yml` – veröffentlicht `website/` bei jedem Push auf `main`
- `grafik/` – eigene SVGs: Wichtel-Posen (`wichtel-winkt/-geschenk/-lupe/-wuerfel/-schlaeft.svg`), Winterlandschaft, Lichterkette;
  in `build.py` über `pose_img()` / `page(..., mascot=..., playful=True)`. Die Geschenk-Pose wird auf der Startseite inline eingesetzt
  (Animation „Schleife geht auf“, Gruppe `class="lid"` nicht umbenennen).
- `assets/fonts/` – Fredoka (OFL, selbst gehostet) für Überschriften; Lizenzen stehen in der README
- `marketing/` – QR-Code, WhatsApp-Status- und LinkedIn-Bild; neu erzeugen mit `node marketing/render-status.js` bzw. `render-linkedin.js`
- `marketing/render-pins.js` – Pinterest-Pins 1000×1500 je Ratgeberseite nach `marketing/pins/` (`node marketing/render-pins.js`)
- `render-images.js` – erzeugt `og-image.png` und `apple-touch-icon.png` aus `favicon.svg` und `wichtel.svg`
- `website/` – **generiert**, nie von Hand bearbeiten. Nach jeder Änderung: `python3 build.py website`
- `tests/` – Playwright-Tests (Server vorher starten: `cd website && python3 -m http.server 8766`)

## Wie das Tool funktioniert

Die Auslosung läuft komplett im Browser. Jeder Teilnehmer bekommt einen Link `https://wichtellos.de/#w=…`;
die Zuteilung steckt codiert (nicht verschlüsselt) im Teil nach `#` und wird nie an den Server geschickt.
Optional pro Person ein „💡 Tipp“ (max. 80 Zeichen, Feld `t`): steckt nur im Link dessen, der die Person zieht; die Seite des
geheimen Links zeigt ihn plus „Passend zum Tipp“-Amazon-Links (Stichworte aus dem Tipp, Verneinungen wie „keine …“ gefiltert).
Wichtel-Lose zum Ausdrucken (Ansicht `view-print`): je Person Name außen, QR-Code des geheimen Links innen, 6 pro A4.
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
  `msvalidate.01` (in `build.py`). Deckt Edge, DuckDuckGo, Yahoo, Ecosia, ChatGPT-Suche ab.
- Pinterest: Unternehmensprofil pinterest.com/WichtelLos (entstand durch Umstellen des Logins kollcommerce;
  Kurzinfo + Impressum-Link gesetzt; Instagram @wichtellos verknüpft → neue Posts automatisch auf Pinnwand
  „Wichteln: Ideen & Reels“, ausgenommen #nopin/#anzeige; Werbe-Benachrichtigungen und Anzeigen-Personalisierung aus), Website bestätigt per Meta-Tag `p:domain_verify` (in `build.py`, nicht löschen). Pinterest-Tag (Tracking)
  bewusst nicht installiert – würde Datenschutz/Banner erfordern.

## Offen

- [x] Amazon-PartnerNet-Konto angelegt, Partner-ID `wichtellos-21` in `assets/site.js` eingetragen (30.10.2026)
- [ ] PartnerNet: Steuer-Interview (USA/Kanada) und Zahlungsempfänger (UG) vervollständigen – nötig vor der ersten Auszahlung
- [x] Livegang und Live-Test (30.10.2026, alle Prüfungen oben grün, damals noch mit SSL)
- [x] Umzug auf GitHub Pages abgeschlossen: DNS, Let's-Encrypt-Zertifikat, Enforce HTTPS an; SFTP-Benutzer bei IONOS gelöscht (30.10.2026)
- [x] Search Console + Bing eingerichtet, Sitemap bei beiden eingereicht (30.10.2026)
- [x] Sitemap in der Search Console erfolgreich gelesen (8 Seiten, 30.10.2026); Bing: alle 8 URLs übermittelt
- [x] 3 neue Adressen bei Bing übermittelt (alle 11 drin); Sitemap in der Search Console neu gesendet (30.10.,
      zeigte direkt danach noch 8 Seiten – Google liest sie später neu, in ein paar Tagen auf 11 prüfen)
- [ ] Google-Indexierung beantragen – 30.10. und 31.10. (11 Uhr, vor allen Shop-Anträgen) jeweils beim ersten Antrag „Kontingent überschritten“
      → Sperre gilt für die neue Property, nicht geteiltes Konto-Kontingent. Startseite trotzdem schon indexiert (31.10.), Rest kommt über die Sitemap;
      in ein paar Tagen erneut versuchen
- [ ] Awin: Publisher-ID 3140404 (KOLL Commerce UG), freigeschaltet 30.10.2026. Bewerbungen gesendet 30.10.: Jochen Schweizer,
      Thalia, mydays (Carrera Toys: Toni schickt selbst ab). myToys gibt es bei Awin nicht. Awin-Profil noch unvollständig.
      Zugesagte Partner dann in passende Ideen einbauen (Erlebnisse ab 20 €/Büro, Bücher, Kinder 8–12)
- [ ] Ko-fi-Konto (Toni, Firmen-PayPal): danach „Spendier dem Wichtel einen Kaffee“ im Fuß + auf der Seite des geheimen Links;
      später Premium-Druckvorlagen im Ko-fi-Shop (Einnahmen der UG, nicht „Spende“ nennen)
- [x] Social: Instagram @wichtellos (Profil + erstes Reel 31.10.), TikTok @wichtellos (Profil fertig; erstes Video vorbereitet,
      Veröffentlichen durch Toni). Getrennt von den Shop-Konten (@sneaker_drops_and_more / @kollstore). Bilder in `marketing/`
- [ ] Pinterest: 11 Pin-Entwürfe (je Ratgeberseite + Auslosen, Titel/Beschreibung/Link/Pinnwand fertig) – Veröffentlichen durch Toni
      (31.10.); 4 Pinnwände + „Wichteln: Ideen & Reels“ (Instagram-Import). Fuß: „Folge uns“ Instagram/Pinterest/TikTok
- Pinterest Trends DE (31.10.): „wichteln“ steigt ab Oktober, Höhepunkt Mitte–Ende November, ab Anfang Dezember fast weg →
  Pins bis spätestens Mitte November live; früh anziehend: „wichtelgeschenke selbstgemacht“, „kleine geschenke basteln weihnachten“.
  Achtung: „Wichtel streiche“/„Wichtelhaus“ = Wichteltür-Brauch (Kinder), anderes Thema
- [ ] Rechtstexte (Impressum, Datenschutz) einmal fachlich prüfen lassen
- [ ] Später: AdSense (braucht zertifizierten Einwilligungs-Banner, Werbeflächen `.ad-slot` in `style.css` einblenden),
      Wunschliste (braucht Server), digitaler Adventskalender als zweites Tool

## Zusammenarbeit

- Es arbeiten zwei Claude-Sitzungen am Repo: **PC** (Claude Code auf Tonis Rechner) und **Cloud** (claude.ai/code).
- **Toni legt fest, wer welche Aufgabe macht.** Nie beide an derselben Aufgabe.
- Vor jeder Arbeit `git pull`, danach kleine Commits und sofort `push`. Ein Push geht live – vorher testen.
- Commit-Nachrichten beginnen mit **[PC]** oder **[Cloud]**.
- Wird ein Push abgelehnt: `git pull --rebase`, nie `--force`.
- Neue Dateien und Funktionen kurz bei „Aufbau“ eintragen. Die CLAUDE.md pflegt nur PC; die Cloud meldet Änderungen über Toni.

## Regeln

- Keine Zugangsdaten (Passwörter, API-Keys, IONOS-/SFTP-Daten) committen.
- Commit-Nachrichten auf Deutsch, kurz und aussagekräftig; nach jeder Änderung committen und pushen (Branch `main`).
