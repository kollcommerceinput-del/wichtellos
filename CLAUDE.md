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
- `build.py`: `whatsapp_page()` – `/wichteln-per-whatsapp/` (Anleitung + `WA_FAQ` mit FAQPage-Schema; Grund: Google Trends
  „wichteln whatsapp“ und „wichteln namen ziehen online“ steigend, 01.11.); Sitemap jetzt 19 URLs
- `build.py`: `school_page()` – `/wichteln-schule-kita/` (Ablauf Klasse/Kita, Budget, Elternbrief, Lose ohne Handy; 01.11.)
- `build.py`: `party_page()` `/weihnachtsfeier-ideen/`, `poems_page()` `/wichtelgedichte/` (eigene Reime in `POEMS` + Reim-Generator
  im Browser, nichts gespeichert), `history_page()` `/woher-kommt-wichteln/` (01.11.); Sitemap jetzt 17 URLs
- `build.py`: `door_page()` `/wichteltuer/` (24-Tage-Streichplan `DOOR_PLAN`, Begrüßungsbrief, Zubehör `DOOR_SHOP` als Amazon-Suchen);
  `supplies_block()` „Das brauchst du noch für die Bescherung“ (Anhänger, Würfel, Mützen, Tüten) auf Würfeln/Büro/Weihnachtsfeier (01.11.)
- `build.py`: `invite_page()` – `/wichteln-einladung-vorlage/`: Aushang „Wir wichteln!“ mit Teilnehmerliste (20 Zeilen) + QR zu
  wichtellos.de (`grafik/qr-wichtellos.svg`), druckt auf 1 Seite A4 (Body-Klasse `poster-page`). Teilen-Knöpfe „Kennst du noch eine
  Gruppe?“ in Ergebnis- und Aufdeck-Ansicht (`.share-wa`, Text ohne Namen/Links)
- `build.py`: `FAQ`/`HOW_TO` – sichtbare FAQ der Startseite und FAQPage-Daten aus einer Liste (Schema-Text = sichtbarer Text)
- `.github/workflows/pages.yml` – veröffentlicht `website/` bei jedem Push auf `main`;
  Job `indexnow` meldet danach die geänderten Seiten (nur Sitemap-URLs) an IndexNow (Bing, Yandex …),
  Schlüssel `INDEXNOW_KEY` in `build.py`, liegt öffentlich als `/<key>.txt` – nicht ändern
- `grafik/` – eigene SVGs: Wichtel-Posen (`wichtel-winkt/-geschenk/-lupe/-wuerfel/-schlaeft.svg`), Winterlandschaft, Lichterkette;
  in `build.py` über `pose_img()` / `page(..., mascot=..., playful=True)`. Die Geschenk-Pose wird auf der Startseite inline eingesetzt
  (Animation „Schleife geht auf“, Gruppe `class="lid"` nicht umbenennen).
- `assets/fonts/` – Fredoka (OFL, selbst gehostet) für Überschriften; Lizenzen stehen in der README
- `marketing/` – QR-Code, WhatsApp-Status- und LinkedIn-Bild; neu erzeugen mit `node marketing/render-status.js` bzw. `render-linkedin.js`
- `marketing/render-pins.js` – Pinterest-Pins 1000×1500 je Ratgeberseite nach `marketing/pins/` (`node marketing/render-pins.js`)
- `marketing/reel/render-reel-whatsapp.js` → `reel-whatsapp.mp4` (17,5 s, „Wichteln? Ganz simpel.“: Namen, Link per
  WhatsApp/E-Mail/Messenger/SMS, Geheimnis lüften, Abspann mit /wichteln-per-whatsapp). Kein WhatsApp-Logo (Markenrecht).
  Standbilder zur Kontrolle: `node marketing/reel/render-reel-whatsapp.js "1.5,8.8,15.5"`
- `marketing/render-social.js` – Instagram-/TikTok-Karussells (`SETS`: auslosen, buero-unter-10, whatsapp (10 Schritte), lose, wichteltuer) nach
  `marketing/social/<set>/`, je Folie `ig-NN.png` (1080×1350) und `tt-NN.png` (1080×1920) (01.11.)
- Amazon-Direktlinks: `product_links(query, asin)` in `build.py` – Produktlink `/dp/ASIN?tag=` + Suchlink „weitere Modelle“ als
  Rückfall. Seit 01.11. bei SUPPLIES (Würfel, Kraftpapier-Tüten) und DOOR_SHOP (Set, Figur, Lichterkette). Keine Preise/Amazon-Fotos zeigen
  (PartnerNet-Regeln). ASINs ab und zu auf „Auf Lager“ prüfen; Geschenkfinder/Geschenkseiten bleiben Suchlinks.
- `fotos/` – Unsplash-Fotos (Unsplash-Lizenz, kein Unsplash+), selbst gehostet als WebP in 2 Breiten, eingebunden über `photo()` in
  `build.py` mit Namensnennung + Link. Nur Ratgeberseiten (Woher kommt Wichteln, Weihnachtsfeier, Wichteltür), nicht Tool/Startseite.
  Regeln: keine erkennbaren Gesichter, keine Marken/Logos im Ausschnitt (ggf. zuschneiden), nie direkt von Unsplash einbinden (Datenschutz).
- `og/` – Vorschaubild (1200×630) je Ratgeberseite, `build.py` setzt es automatisch als og:image; neu erzeugen mit
  `node marketing/render-og.js` (neue Seite = dort eintragen). Startseite nutzt weiter `og-image.png`
- `render-icons.js` – erzeugt `favicon.ico` (16/32/48), `favicon-48/96.png`, `icon-192/512.png` aus `favicon.svg`;
  `site.webmanifest` schreibt `build.py`
- `render-images.js` – erzeugt `og-image.png` und `apple-touch-icon.png` aus `favicon.svg` und `wichtel.svg`
- `website/` – **generiert**, nie von Hand bearbeiten. Nach jeder Änderung: `python3 build.py website`
- `tests/` – Playwright-Tests (Server vorher starten: `cd website && python3 -m http.server 8766`)

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
  `msvalidate.01` (in `build.py`). Deckt Edge, DuckDuckGo, Yahoo, Ecosia, ChatGPT-Suche ab.
- Pinterest: Unternehmensprofil pinterest.com/WichtelLos (entstand durch Umstellen des Logins kollcommerce;
  Kurzinfo + Impressum-Link gesetzt; Instagram @wichtellos verknüpft → neue Posts automatisch auf Pinnwand
  „Wichteln: Ideen & Reels“, ausgenommen #nopin/#anzeige; Werbe-Benachrichtigungen und Anzeigen-Personalisierung aus), Website bestätigt per Meta-Tag `p:domain_verify` (in `build.py`, nicht löschen). Pinterest-Tag (Tracking)
  bewusst nicht installiert – würde Datenschutz/Banner erfordern.

## Offen

- [x] Amazon-PartnerNet-Konto angelegt, Partner-ID `wichtellos-21` in `assets/site.js` eingetragen (30.10.2026)
- [x] PartnerNet: Steuer-Interview (USA/Kanada) und Zahlungsempfänger (UG) vervollständigt (Toni, bestätigt 01.11.2026)
- [x] Livegang und Live-Test (30.10.2026, alle Prüfungen oben grün, damals noch mit SSL)
- [x] Umzug auf GitHub Pages abgeschlossen: DNS, Let's-Encrypt-Zertifikat, Enforce HTTPS an; SFTP-Benutzer bei IONOS gelöscht (30.10.2026)
- [x] Search Console + Bing eingerichtet, Sitemap bei beiden eingereicht (30.10.2026)
- [x] Sitemap in der Search Console erfolgreich gelesen (8 Seiten, 30.10.2026); Bing: alle 8 URLs übermittelt
- [x] 01.11. 12:30: Bing URL-Übermittlung um 8 neue Seiten ergänzt → alle 19 URLs übermittelt (Kontingent 100/Tag).
      Google 12:25 erneut „Kontingent überschritten“
- [x] 3 neue Adressen bei Bing übermittelt (alle 11 drin); Sitemap in der Search Console neu gesendet (30.10.,
      zeigte direkt danach noch 8 Seiten – Google liest sie später neu, in ein paar Tagen auf 11 prüfen)
- [ ] Google-Indexierung: 31.10. nachmittags beantragt (7, dann Kontingent ~7/Tag/Property): Büro, Einladung-Vorlage,
      Geschenkfinder, unter-10, unter-5, Schrottwichteln, Würfeln. Startseite schon indexiert. 01.11. 09:30: Kontingent noch
      voll (rollierend 24 h), Sitemap neu eingereicht (18 URLs). 01.11. abends 9 beantragt: wichteltuer, wichteln-per-whatsapp,
      selber-machen, fuer-kinder, unter-20, unter-15, unter-30, schule-kita, weihnachtsfeier (10. = Kontingent).
      Noch offen: wichtelgedichte, woher-kommt-wichteln (ab 02.11. abends). Direktlink /search-console/inspect?…&id= gibt 404 → Prüffeld nutzen
- [ ] Awin: Publisher-ID 3140404 (KOLL Commerce UG), freigeschaltet 30.10.2026. Bewerbungen gesendet 30.10.: Jochen Schweizer,
      Thalia, mydays (Carrera Toys: Toni schickt selbst ab). myToys gibt es bei Awin nicht. Awin-Profil noch unvollständig.
      Zugesagte Partner dann in passende Ideen einbauen (Erlebnisse ab 20 €/Büro, Bücher, Kinder 8–12)
      01.11.: Profil vervollständigt (Logo, Branchen auf Familien-passende reduziert – Erotik/Alkohol/Unterwäsche raus,
      Website-Text max. 255 Zeichen). Tchibo DE beworben (Toni). Etsy + myToys gibt es bei Awin nicht. Auszahlungsdetails
      (Bank/Steuer) erst nach 2FA-Aktivierung erreichbar – Toni. Vor erstem Awin-Link: Datenschutz um Awin ergänzen
      01.11. Fotogeschenke: Myposter DE + Pixum DE beworben (EPC 0,33 € bzw. 10 %); fotokasten verworfen (Awin-Risikostufe 2),
      MyHappyMoments/meinbildkalender (EPC ≤0,04 €) nicht. Bei Zusage: Fotokalender/-tasse in Selber-machen, Oma/Opa, unter 20 €.
- [ ] Zielmarkt bis Weihnachten 2026: nur DACH (Toni 01.11.). FAQ „Österreich und Schweiz“ + Budget in CHF erkannt. Übersetzungen
      frühestens 2027: zuerst Englisch („Secret Santa“), Skandinavien höchstens danach (kleine Märkte, kaum Amazon/Awin).
- [x] Ko-fi ko-fi.com/wichtellos (01.11.; Login Google kollcommerce.input@gmail.com, PayPal rechnung@kollcommerce.de, Standort bestätigt).
      Knopf „🎁 Ein Geschenk für den Wichtel“ (Toni: Geschenk statt Kaffee, nicht bettelnd) (`.kofi-btn`, reiner Link) im FOOTER + Seite des geheimen Links (`.kofi-hint`
      in tool.html); Datenschutz Abschn. 6 ergänzt. Ko-fi-Einstellungen: Simple tip, Euro, Wording „Tip“, Mindestbetrag 5 €,
      Membership mode „Off“ (keine Monats-Abos), deutsche Dankesnachricht, Bio + Website wichtellos.de. Buchhaltung: Umsatz 19 % der UG, keine Spendenquittungen, nie „Spende“ nennen.
      Später Premium-Druckvorlagen im Ko-fi-Shop
- [x] Social: Instagram @wichtellos (Profil + erstes Reel 31.10.), TikTok @wichtellos (Profil fertig; erstes Video vorbereitet,
      Veröffentlichen durch Toni). Getrennt von den Shop-Konten (@sneaker_drops_and_more / @kollstore). Bilder in `marketing/`
- [x] 01.11.: Instagram-Storys + Highlights „So geht's“ (Auslosen, Link-Sticker wichtellos.de) und „Geschenke“ (Büro unter 10 €,
      Link-Sticker /geschenkfinder/). Storys gehen nur über Meta Business Suite (business.facebook.com, Asset wichtellos;
      Datei-Upload per JS-Hook auf input.click). Highlight-Titel am Desktop nur aus Story-Folien wählbar – eigene Titelbilder
      `marketing/social/highlights/` nur per App. 01.11. 11:2x: auch „Wichteltür“ (8 Folien, Sticker /wichteltuer/) und „Lose“ (Set `lose`, Sticker
      wichtellos.de) – 4 Highlights komplett. Achtung: Business Suite lässt bei Mehrfach-Upload gelegentlich eine Folie fallen
      (v. a. die mit Sticker) → im Highlight-Dialog zählen, fehlende einzeln nachposten und per „Bearbeiten“ ergänzen.
      Profil: Link wichtellos.de (Toni, App), öffentliche E-Mail = Impressum-Adresse, „Einbetten auf Websites“ an
- [x] 01.11. 10:40: Reel „Wichteln in 1 Minute auslosen“ (Folien-Video `marketing/social/auslosen/reel-folien.mp4`, 2,5 s/Folie,
      ffmpeg aus imageio_ffmpeg) mit Song „Christmas Is Coming“ (DM Production), Text+Hashtags aus `teilen-texte.md`.
      Musik nur im Reel-Editor der Business Suite (Bearbeiten → Audio, ▶ auf Cover = Hörprobe); Karussell-Beiträge und
      Foto-Reels haben dort keine Musik. Song wählt Toni nach Gehör. Karussell-Version noch nicht gepostet
- [x] 01.11. ~13 Uhr: Reel „Wichteln? Ganz simpel.“ (reel-whatsapp.mp4) auf Instagram, Song „Kleine Geschenke“ (Cindy & Bert,
      von Toni gewählt), Text+8 Hashtags inkl. #wichtelnperwhatsapp. TikTok noch offen
- [x] 01.11.: LinkedIn (Antonio Koll) Video-Beitrag „Wichteln im Team – in 1 Minute ausgelost“ mit reel-folien.mp4, ohne Musik
      (LinkedIn-Editor hat keine Musikbibliothek; Instagram-Musik darf nicht übernommen werden), Link /wichteln-im-buero/
- [x] Pinterest: 16 Pins + 3 Reels veröffentlicht; 01.11. dazu unter-30 (Budget), schule-kita + wichteltuer (Kinder),
      weihnachtsfeier (Schrottwichteln & Wichtelspiele), wichtelgedichte (Ideen & Reels). Neue Seite = neuer Pin; 4 Pinnwände + „Wichteln: Ideen & Reels“ (Instagram-Import). Fuß: „Folge uns“ Instagram/Pinterest/TikTok
- Pinterest Trends DE (31.10.): „wichteln“ steigt ab Oktober, Höhepunkt Mitte–Ende November, ab Anfang Dezember fast weg →
  Pins bis spätestens Mitte November live; früh anziehend: „wichtelgeschenke selbstgemacht“, „kleine geschenke basteln weihnachten“.
  Achtung: „Wichtel streiche“/„Wichtelhaus“ = Wichteltür-Brauch (Kinder), anderes Thema
- Pinterest Trends DE „wichteltür“: Höhepunkt Woche bis 3.12.2025, danach steil runter → Seite/Pins bis Mitte November live
- [x] 31.10.: LinkedIn-Profil Antonio Koll (neu, 0 Kontakte) – Beitrag „Wichteln im Büro“ (Text 4 aus `marketing/teilen-texte.md`,
      Link-Vorschau mit og-Bild) gepostet. Reel `marketing/reel/reel-lose.mp4` (ohne Ton) gerendert – Hochladen + Musik durch Toni
- [ ] Später (Toni 01.11.): 10-Schritte-Karussell `marketing/social/whatsapp/` auch auf `/wichteln-per-whatsapp/` einbinden
      bzw. von dort auf den Instagram-Beitrag verlinken
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
