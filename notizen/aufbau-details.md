# Aufbau – Details (aus CLAUDE.md ausgelagert am 11.11.2026)

Vollständige Notizen zu Seiten, Skripten, Marketing-Dateien und Abläufen. Kurzfassung steht in der CLAUDE.md.


- `tool.html` – Startseite mit dem Auslosungs-Tool (Vorlage, Kopf/Fuß werden beim Bauen eingesetzt)
- `build.py` – baut alle Seiten nach `website/`; Inhalte der Ratgeber-Seiten, Impressum und Datenschutz stehen hier
- `assets/style.css`, `assets/site.js` – gemeinsames CSS und JS. Die Amazon-Partner-ID steht **nur** in `build.py` (`AMAZON_TAG`); das Bauen schreibt sie in alle Amazon-Links und in `site.js`
- `gifts.py` – Daten für Geschenkfinder (104 Ideen mit Alter, Budget, Kategorie, bürotauglich) und Selbermach-Anleitungen
- `assets/finder.js` – Filter des Geschenkfinders (`/geschenkfinder/`, Filter auch per Adresse `?fuer=&budget=&mag=&q=`)
- `build.py`: `office_page()` – `/wichteln-im-buero/` (Büro-Wichteln, verlinkt Geschenkfinder `?fuer=office`); Suchbegriffe
  Wichtelgenerator/Julklapp/Secret Santa stehen in Startseiten-Titel, Lead und FAQ (31.10.)
- `build.py`: `dice_page()` – `/wichteln-wuerfeln-regeln/` (09.11. Umbau, Google Platz 1,5 ohne Klicks): Titel „Regeln 1–6 + Spielplan zum Ausdrucken“, Spielplan-Karte `.dice-card` (Regeln aus `DICE_RULES`, Knopf `data-print="karte"` druckt nur die Karte auf 1 A4-Seite), Würfel & Timer `#wuerfeln` (site.js: Runde 1/2, Regel zur Zahl, Timer 5/10/15 Min mit WebAudio-Klingeln + Wake Lock), `WUERFEL_FAQ` (7 Fragen aus Google/Bing-Suchbegriffen, FAQPage), Varianten +4 (2 Würfel, Kinder, Aktionskarten, Video-Call).
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
- Handy (09.11., Toni): Menü bis 600 px als 2×3-Kacheln (Symbol über Wort, Kurzname `.nav-k`, Desktop `.nav-l`), kein Wischen mehr. `.idea-grid` am Handy 2 Spalten (Text 3 Zeilen, Alterszeile aus); Abschnitte mit >14 Ideen zeigen 12 + „Alle N Ideen zeigen“ + Finder/Generator-Link (site.js), Geschenkfinder blättert in 20ern (finder.js). Alles bleibt im HTML (Google).
- Eigener Shop + Folgen (09.11., Toni): Menüpunkt „☕ Tassen & Shirts“ (grün, `.nav-shop`) statt „Spiele“; Desktop „Für Kinder“ statt „Geschenke für Kinder“ (Platz). `shop_card()` = grüne Karte „Aus unserem Shop“ (kein Sternchen) an 3. Stelle im Geschenkfinder (mit data-Filtern) und auf unter-20/30; Seite des geheimen Links: Kasten `.shop-hint` in tool.html. Onni-Seite: „🔔 Keine Folge verpassen“ (`<details class="ak-folgen">`) → Instagram/TikTok folgen, YouTube abonnieren (`?sub_confirmation=1`); Kalender-Datei nicht mehr verlinkt (Toni: „Datei runterladen bringt nichts“), /onni-erinnerung.ics wird noch erzeugt.
- Hauptmenü (`HEADER` in `build.py`, Toni 02.11. Variante A): roter Knopf „🎁 Geschenkideen“ (/geschenkfinder/), „🎲 Geschenke-Generator“ (06.11., Toni), Nach Budget (/unter-10/),
  Wichtel-Zubehör, Für Kinder, Spiele – Seiten mit Amazon-Links nach oben. Unter 900 px eigene Zeile zum Wischen.
- Footer (03.11., Toni): 4 Gruppen als `<details class="fgroup">` (Handy aufklappbar, ab 700 px per JS in `site.js` offen),
  Impressum/Datenschutz in der Copyright-Zeile. Suche: Lupe `.search-btn` im `HEADER`, Panel `#search-panel`, Index `/suche.json`
  (schreibt `extras()`: alle Seiten aus `page()` über `SEARCH` + Startseite + `IDEAS` aus gifts.py → `/geschenkfinder/?q=`), Logik in
  `site.js` (lädt erst beim Öffnen, `/` öffnet, Pfeile/Enter/Esc). Neue Seite = automatisch im Index.
- `build.py`: `share_page()` – `/teilen/` (Cloud, 31.10.): kurze Adresse fürs Weiterleiten (WhatsApp, E-Mail, Link kopieren, andere App über
  `navigator.share`) mit fertigem Text `SHARE_TEXT`. noindex, nicht in der Sitemap, nicht zur Indexierung anmelden. Wird im WhatsApp-Status verwendet.
- `gifts.py` (03.11., Toni/Regeln der Cloud): 5 Alkohol-Ideen „(ab 18)“ (Piccolo 5 €, Likör-Probierset 10 €, Craft-Bier 15 €, Wein mit
  Spruch-Etikett 20 €, Whisky/Rum-Tasting 30 €; dazu bestehendes Gin-Set) – nur `ADULT`, nie bürotauglich, nüchtern beschrieben, nie auf
  Kinder-/Schul-/Wichteltür-Seiten, kein Wichtel mit Flasche, keine eigene Alkohol-Seite. Alkoholfrei + bürotauglich: alkoholfreier Sekt/Gin,
  Whisky-Steine mit Glas, Bierglas mit Spruch. Geschenkfinder jetzt 112 Ideen. `gifts.py` pflegt PC (Cloud fasst sie nicht an).
- `/llms.txt` (03.11., Toni): Kurzbeschreibung für KI-Assistenten, schreibt `extras()` aus Sitemap-URLs + `SEARCH` (neue Seite = automatisch drin). robots.txt erlaubt alle Bots (auch KI-Crawler)
- Bedienbarkeit Paket 1 (03.11., Toni nach Prüfbericht): Ergebnis-Ansicht mit „✓ verschickt“ je Person (`sent` im localStorage-Ergebnis),
  Karte „🔒 Links sichern“ (WhatsApp/E-Mail an mich – Mail ab ~1900 Zeichen ausgeblendet – oder alle kopieren; Text beginnt mit
  „Nur für dich – nicht in die Gruppe weiterleiten.“), Rückfrage `#redraw-confirm` vor „Neu auslosen“, „Deine letzte Auslosung „…““ im
  Kopfbereich, Ausschlüsse als zugeklapptes `<details id="excl-card">`, Gruppe/Budget/Datum „(optional)“. Ko-fi in Ergebnis-Ansicht und auf
  der Seite des geheimen Links nur noch im Fuß; Geschenk-Kasten auf der Link-Seite und Schlagwort-Reihe auf der Startseite entfernt.
  Fuß-Gruppe 4 jetzt „Kinder & Advent“ (Wichteltür, Ausmalbilder, Zubehör, Adventskalender ×2); Gedichte → „Wichteln organisieren“,
  „Woher kommt Wichteln?“ → „Spiele & Anlässe“. Menüpunkt „Geschenke für Kinder“. Nicht umsetzen: Verlauf/Zurück-Taste (Hash-Reload-Risiko),
  Menü bleibt Variante A.
- Bedienbarkeit Paket 2 (04.11.): Namenliste einfügen (`splitNames()`/`pasteNames()` in tool.html: Zeilen/Semikolon, sonst Komma; <E-Mail>,
  Aufzählungszeichen, Dubletten raus, max. 60, Meldung `#paste-note`). „WhatsApp an mich“ ab 15 Personen in Teilen à 15 Links (je ~2,7 kB).
  Wichteltür: Sprungmarken `.jump` (#briefe, #vorlagen, #wichtelname, #streiche, #zubehoer – #briefe/#wichtelname/#sticker nie umbenennen,
  Pins verlinken darauf), 24-Tage-Plan in `<details class="plan-details print-open">` (site.js klappt beim Drucken auf). Startseite: `FAQ_TOP`
  (8 Fragen sichtbar, Rest in `.faq-more`, Schema = alle, wortgleich). Schrift: .hint/label/.tip 15 px, .idea p 16 px. Tippflächen Menü/Fuß
  (Handy) ≥ 44 px. Geschenkfinder: Filter in `<details id="f-more">`, Handy zu, Desktop offen, mit Filtern in der Adresse immer zu;
  „Aktiv: …“ + Knopf „N Ideen ansehen“.
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
- `marketing/render-pinterest-cover.js` → `pinterest-cover-3d.png` (1920×1080): Pinterest-Profil-Titelbild mit 3D-Werkstatt (seit 02.11. live)
- **Onni** = Name des WichtelLos-Wichtels (Toni 02.11., finnisch „Glück“, aus Liste mein-wichtel.de gewählt). Sticker/Ausmalbilder/
  Vorlagen aus Google Flow (Bilder kostenlos im Pro-Abo). Wichtel sind KLEIN – Bäume, Häuser, Geschenke groß (Toni 02.11.).
  - `/wichtel-ausmalbilder/` (`ausmal_page()`): 6 Ausmalbilder als A4-PDF + Gesamt-PDF, 8 Onni-Sticker (WebP 512, ZIP) mit WhatsApp-Anleitung
  - `/wichteltuer/`: Wichtelnamen-Generator (`WICHTEL_NAMEN`, eigene Bedeutungen, setzt Namen in den Begrüßungsbrief, JS in `site.js`)
    + Druckvorlagen (Begrüßungs-/Abschiedsbrief 4×A6, Urkunde, 6 Türschilder)
  - Tool: Onni-Sprechblase nach dem Auslosen (+ Konfetti) und auf der Seite des geheimen Links („Onni flüstert“)
  - `marketing/render-onni-druck.js` erzeugt alle PDFs nach `fotos/onni/` (Quellen `marketing/onni/`); Sticker freigestellt per Python
- `build.py`: `zubehoer_page()` – `/wichtel-zubehoer/` (Toni 02.11.: „alles, was wir als Zubehör finden, auch über 30 €“): `ZUBEHOER`,
  38 Ideen in 8 Kategorien (Tür & Haus, Möbel, Licht & Deko, Post, Figuren, Bücher, Basteln, „große Wichtelwelt“ über 30 €), nur Amazon-Suchen.
  Verlinkt von Wichteltür + Ausmalbilder; Ausmalbilder-Seite hat zusätzlich „Für die Mal-Ecke“ (`MAL_SHOP`), Wichteltür +3 Bastel-Ideen.
  Sitemap jetzt 21 URLs.
- `build.py`: `gruss_page()` + `assets/gruss.js` – `/wichtelgruss/` (03.11.): digitale Wichtel-Karte, 8 Anlässe (`GRUSS`, je ein
  Onni-Sticker), 4 Farben, Canvas 1080×1350 → „Als Bild teilen“ (Web Share mit Datei, sonst Download) oder Link `/wichtelgruss/#g=…`
  (Base64url-JSON, nur im #, Empfänger sieht die Karte + Hinweis). Verlinkt: Fuß, Gedichte, Seite des geheimen Links. Sitemap 22 URLs.
  9. Anlass „Rate mal, wer ich bin!“ (Rätsel-Hinweise). Pin: `marketing/render-pins-gruss.js` (braucht lokalen Server) → `pins-onni/pin-wichtelgruss.png`
- `build.py`: `wunsch_page()` + `assets/wunsch.js` – `/wunschzettel/` (03.11.): bis 5 Wünsche + „Bitte nicht“, Link `/wunschzettel/#z=…`
  (nur im #), Empfänger-Ansicht mit Amazon-Suchlink je Wunsch („Größe …“ wird aus der Suche entfernt). WhatsApp-Text enthält die Liste
  im Klartext + Link. Pin `pins3d/pin3d-wunschzettel.png`. Sitemap 23 URLs. Pin-Texte in `teilen-texte.md`.
  03.11. beide Pins veröffentlicht (Ideen & Reels, KI-Label, Alt-Text): wichtelgruss (Wichteln, Weihnachtsgrüße, Weihnachtskarten),
  wunschzettel (Wichteln, Wichtelgeschenke, Geschenkideen für Weihnachten – „Wunschzettel“ gibt es als Thema nicht).
- `build.py`: `tassen_page()` – `/wichtel-tassen/` (08.11., Toni): 14 Spreadshop-Motive in 3 Gruppen (`TASSEN`), Knopf „Tasse ansehen“ +
  „auch als T-Shirt“. Link `shop_link(slug, id, produkt)` = `/<Artikel>?sellable=<Motiv-ID>-<Produkt>` (31 Tasse, 6 Männer-Shirt, 1470 große Tasse).
  Bilder `fotos/merch/tasse-NN.webp` (aus `marketing/merch/tassen/`). Kein Werbe-Sternchen (eigener Shop). Fuß „Geschenkideen“, Büro, Schrottwichteln,
  Datenschutz Abschn. 6. `/wichtel-t-shirts/` erst nach dem Shirt-Upload. Neues Motiv = Zeile in `TASSEN` + Bild. **09.11. Umbau (Toni: „Seite scheiße aufgebaut“, leere Motiv-Bilder):** Reiter je Produktart (`SHOP_REITER`: Tasse, Große Tasse, T-Shirt, Hoodie, Teddy – Preise von Hand, bei Preisänderung anpassen), darunter alle Sprüche als echtes Produktfoto (`fotos/merch/shop/<pt>-<Design-ID>.webp`) + Kachel „Und noch viel mehr“; Adresse `#tasse`, `#t-shirt` … öffnet den Reiter (site.js). Daten `shop_daten.py` erzeugt `tools/shop_fotos.py` aus `marketing/merch/shop-fotos/liste.json` + Fotos in F:\Download (beides im echten Chrome geholt: Shop-Seiten `/all?page=N` bzw. Produktseiten per fetch auslesen, Bilder auf image.spreadshirtmedia.net per fetch + `<a download>`; Chrome fragt einmal „mehrere Dateien herunterladen“ → Toni). Weiße Schrift nur auf T-Shirt/Hoodie, Tasse/Teddy nur dunkle Schrift. Shop-Karte (Geschenkfinder) und `.shop-hint` zeigen jetzt das Tassenfoto. **09.11. abends Umbau 2 (Toni: „so billig“):** grüner Einstieg `.ms-hero` (H1 „Wichtelgeschenke mit Spruch“ + 3 Produktfotos, kein Einleitungstext, keine Häkchen-Zeile – Toni), Reiter-Leiste mit Preis (`<small>`), kein Preis je Kachel, Sprüche nach den `TASSEN`-Gruppen (Zuordnung über Design-ID im Artikelpfad, Rest „Rund um den Wichtel“), Kacheln mit „Ansehen →“; unten EIN grüner Knopf `.ms-alle` statt Kachel „Und noch viel mehr“ + zweitem Knopf. Reiter-Adresse = erstes Textstück des Knopfs (site.js).
- `supplies_block(items, title, note)` mit Listen `SUPPLIES` (Würfeln/Büro/Feier), `WRAP` (Seite des geheimen Links, Platzhalter
  `<!--VERPACKEN-->` in tool.html, „Schön verpacken – und geheim bleiben“) und `GRUSS_SHOP` (/wichtelgruss/ „Kleine Grüße zum Anfassen“) (03.11.)
- `build.py`: `advent_page()` – `/adventskalender-ideen/` (03.11.): `ADVENT`, 28 Ideen in 5 Gruppen (Büro, Genießer, Erwachsene,
  Kinder, Selbstbefüllen) mit Onni-Sticker an der Überschrift (`.h-onni`), Abschnitt „Adventskalender-Wichteln“, nur Amazon-Suchen.
  Titelbild vorerst `wichtel3d-basteln` – eigenes 3D-Bild (Onni klein vor großem Adventskalender) folgt aus Flow (Toni).
  Verlinkt: Fuß, alle Budgetseiten (Hinweis unter den Chips), Wichteltür. Sitemap 24 URLs.
- Seite des geheimen Links (03.11.): „📅 Bescherung in den Kalender“ (.ics ganztägig + Erinnerung 1 Tag vorher, ohne Namen des
  Beschenkten; nur wenn ein Datum gesetzt ist) und „📝 Eigenen Wunschzettel schreiben“
- `themen.py` + `themen_pages()` in `build.py` (03.11., nach Google Trends): `/adventskalender-befuellen/` (`AK_FUELLEN` 24 Ideen,
  `AK_BASTELN` 4 Bastelanleitungen mit Material-Links – Toni: „Anleitungen mit Zubehör von Amazon“, `AK_GUTSCHEINE`),
  `/geschenke-fuer-maenner/` (`MAENNER`, 23) und `/geschenke-fuer-frauen/` (`FRAUEN`, 21). Gemeinsamer Baustein `idea_sections()`.
  Alkohol-Sets (Craft-Beer, Gin „ab 18“) bleiben drin (Toni). Footer + Sitemap (27 URLs) ergänzt.
- `marketing/render-pins-onni.js` → `marketing/pins-onni/` (02.11. alle 4 veröffentlicht, KI-markiert, Alt-Text, Themen):
  ausmalbilder → /wichtel-ausmalbilder/ (Kinder; Malvorlagen, Weihnachtsmalvorlagen, Wichteln, Kindergarten),
  sticker → /wichtel-ausmalbilder/#sticker (Ideen & Reels; Wichteln, Weihnachtsgrüße, Weihnachten),
  wichtelnamen → /wichteltuer/#wichtelname (Kinder; Wichteln, Weihnachtsbräuche, Kindergarten),
  tuer-vorlagen → /wichteltuer/ (Kinder; Wichteln, Weihnachtsbasteln, Kindergarten).
  Tipp Themenfeld: Vorschlag per find-Ref anklicken; Strg+A im leeren Feld hinterlässt ein „a“ → vor dem Veröffentlichen prüfen.
- `marketing/reel/render-reel-onni.js` → `reel-onni.mp4` (9,5 s, ohne Ton): Onni stellt sich vor, Ausmalbilder, Sticker, Namen,
  Abspann wichtellos.de. Toni 02.11.: Videos knapp halten, keine langen Szenen.
  02.11.: TikTok (Toni), Pinterest-Video-Pin (Kinder; Wichteln, Malvorlagen, Kindergarten). Erklär-Galerie `galerie.mp4` als
  Video-Pin (Ideen & Reels; Wichteln, Weihnachtsparty, Weihnachten, Link Startseite). Instagram-Reel vorbereitet – Musik + Teilen: Toni.
- `marketing/reel/render-reel-unter10.js` → `reel-unter10.mp4` (13,5 s, Spieluhr-Ton): „5 Wichtelgeschenke unter 10 €, die keiner
  wegwirft“ (Kakao am Stiel, Kuschelsocken, Duftkerze, Mini-Pflanze, Gourmet-Schokolade – je ein 3D-Bild aus Flow,
  `wichtel3d/stills/geschenke/`) → Geschenkfinder. Posten mit
  „Werbung“ + „Mit KI erstellt“ (Titelbild 3D) (03.11.)
  03.11.: Pinterest-Video-Pin veröffentlicht (Wichtelgeschenke nach Budget, Link /unter-10/, Themen Wichteln/Wichtelgeschenke/
  Geschenkideen für Weihnachten, Alt-Text, KI-Label). Texte für Instagram/TikTok/LinkedIn in `teilen-texte.md`.
- `marketing/reel/render-reel-briefe.js` → `reel-briefe.mp4` (13,6 s, Spieluhr): 24 Briefe von Onni (Titel, 1.12., Nikolaus, Spiegelschrift,
  Steckbrief) + 3 Ausmalbilder + CTA wichtellos.de → Wichteltür. Briefe-Bilder fotografiert aus wichtellos-content nach `marketing/reel/briefe/` (03.11.)
  Zweite Fassung `render-reel-briefe-3d.js` → `reel-briefe-3d.mp4` (13,6 s): gleiche Szenen auf 3D-Plüsch-Wichtel-Hintergründen
  (feder, umschlag, tuer, lupe, basteln, kinder, geschenk) mit Textbox oben (Toni 03.11.: „mit 3D-Bildern“).
  03.11.: helle Fassung als Pinterest-Video-Pin veröffentlicht (Pinnwand „Wichtelgeschenke für Kinder“, Link /wichteltuer/#briefe,
  Themen Wichteln/Weihnachtsbräuche/Advent, Alt-Text, KI-Label); der Ton läuft auf Pinterest mit. 3D-Fassung auf Instagram + TikTok
  gepostet (Toni, 03.11.).
- Google Flow (03.11.): neues Projekt „Nov 03 - 17:06“, Charakter **„Onni 3D“** (aus `geschenk.jpg`) – beim Prompt immer per „+“ als
  Referenz anhängen, sonst erfindet Flow fremde Figuren. Agent-Einstellung „vor dem Generieren bestätigen: Immer“, Format 9:16.
  Omni 1.1 Flash (12 Punkte/8-s-Clip) lässt die Mütze hochrutschen → Gesicht mit Augen sichtbar (Toni: „egal“). Für exakten Onni Veo testen.
  Verlängern („Extend“) nur bei Veo-Clips. Guthaben 1.050 Punkte bis 02.12. 09:34 (Plan: Themen A Auslosen, B Geschenke, C Streiche, D Saison).
- `marketing/reel/render-reel-a1.js` → `reel-a1-lose.mp4` (13,2 s): Clips `wichtel3d/clips-a/a1-tuer.mp4` (Onni kommt aus der Wichteltür,
  schüttet Lose aus) + `a2-winken.mp4`, Überblendung 0,4 s, Texte „Zettel ziehen war gestern“ / „WichtelLos – kostenlos … wichtellos.de“.
  Fassung ohne Musik `reel-a1-lose-ohne-musik.mp4` (`OHNE_MUSIK=1`; Toni: Musik nicht automatisch, nicht immer dieselbe).
  03.11. als Pinterest-Video-Pin veröffentlicht (ohne Musik; „Wichteln: Ideen & Reels“, Link Startseite, Themen Wichteln/Weihnachten/
  Weihnachtsparty, Alt-Text, KI-Label). Instagram/TikTok: Toni (Texte im Chat 03.11.).
- **Veo 3.1 Fast (20 Punkte/8 s) hält Onni im Original** (Mütze über den Augen, kein Gesicht) – Standard-Videomodell im Flow-Agent seit
  03.11. Prompt: „Mütze bleibt tief über den Augen, Augen/Gesicht/Ohren nie sichtbar, Onni bewegt vor allem die Hände, Kopf ruhig“.
  Flow kann Videos auch direkt auf YouTube hochladen (Toni 03.11.: jetzt nicht). Herunterladen 1080p (hochskaliert) ging ohne Zusatzkosten.
- `marketing/reel/render-reel-b1.js` → `reel-b1-socken.mp4` (9,6 s, ohne Musik): Clip `clips-a/b1-socken.mp4` (Onni packt Kuschelsocken aus),
  letztes Bild 1,8 s stehen, Texte „Wichtelgeschenk unter 10 €“ / „Kuschelsocken – über 100 Ideen – wichtellos.de“. Posten mit „Werbung“.
  Flow-Guthaben 03.11. abends: ~1.006 Punkte.
- `marketing/render-insta-onni.js` → `social/kinder/story-NN.png` (4 Storys aus den Onni-Pins) + `social/highlights-onni/cover-*.png`
  (Highlight-Titelbilder Onni auf Kreis; nur in der App setzbar – Toni). 02.11.: Highlight „Für Kinder“ (4 Storys mit Link-Stickern)
  angelegt; „So geht's“ um die 8 Galerie-Folien (`social/wichtel3d/story-NN.jpg`) ergänzt. Business Suite: Link-Sticker landet in
  Bildmitte und lässt sich oft nicht verschieben → Bildmitte (≈46 % Höhe) frei halten. Mehrere Bilder > 10 MB → als JPG hochladen.
- `marketing/render-gallery3d.js` → `marketing/social/wichtel3d/`: Erklär-Galerie mit 3D-Wichtel, 8 Folien (Werkstatt, Namen, Auslosen,
  Link schicken, Tipp, Lose, Geheimnis lüften, CTA) als `ig-NN` 1080×1350, `tt-NN` 1080×1920, `pin-NN` 1000×1500 + `galerie.mp4`
  (14,8 s, 1,8 s/Folie, ohne Ton – Toni: 3 s war zu lang gezogen). Bildausschnitt je Folie über `focus` (02.11.)
- 09.11. Pins: `pin3d-wuerfeln.png` (`node marketing/render-pins3d.js wuerfeln` – Argument = nur diese Pins bauen; Pinnwand Schrottwichteln & Wichtelspiele, Themen Wichteln/Weihnachten/Spiele für Familientreffen, KI-Label) und `pin-shop.png` (`marketing/render-pin-shop.js`, echte Produktfotos, kein KI-Label; Pinnwand Wichtelgeschenke nach Budget, Themen Wichtelgeschenke/Geschenkideen für Weihnachten/Wichteln), beide mit Alt-Text veröffentlicht. Pinterest-Profil: ~940 monatliche Aufrufe.
- 09.11. abends Reels (Toni: „wie immer mit Erklärung“ = Stimme puck + leise Geräusche, keine Musik): `render-reel-wuerfeln.js` (echte Würfel-Seite im Handy-Rahmen, Bild für Bild mit Playwright-Uhr, Würfel fest 6/3) → `wuerfeln/reel-wuerfeln-stimme.mp4`; `render-reel-shop.js` (Produktfotos, nur 400 px → Karten ≤ 640 px) → `shop/reel-shop-stimme.mp4`; `render-reel-ab-dezember.js` (Veo-Clip Onni + Eule, Bild ab 7,1 s eingefroren, Veo blendet aus) → `adventskalender/ab-dezember/reel-ab-dezember-stimme.mp4`. Stimme/Geräusche für alle: `stimme-reel.js <ordner>/stimme.json` (Sätze mit Startsekunde, `--laenge` zeigt Längen/Überlappungen). Ab-Dezember: Pinterest-Video-Pin (Wichtelgeschenke für Kinder, /onni-adventskalender/, Themen Adventskalender/Wichteln/Weihnachtsbräuche, Alt-Text, KI) + Instagram-Story; TikTok: Toni. Würfel/Shop: TikTok Toni; 09.11. beide als Pinterest-Video-Pin (Würfel: Schrottwichteln & Wichtelspiele, /wichteln-wuerfeln-regeln/, Themen Wichteln/Spiele für Familientreffen/Weihnachten, KI-Label; Shop: Wichtelgeschenke nach Budget, /wichtel-tassen/, Themen Wichtelgeschenke/Kleine Geschenke/Wichteln, ohne KI-Label), je Alt-Text.
- Onni-Folgen NEU (09.11., Toni: alle 24 „einheitlich und sauber“): `marketing/reel/onni-neu/` mit Original-Texten `Onnis-Adventskalender-Folgen-01-24.md` und `folge-01…24/` für Tonis Flow-Bilder (~22 je Folge). Offen: Bildliste je Folge mit kurzer Beschreibung + drinnen/draußen + Orte-Sammelliste (PC).
- 10.11. Pins (Seiten ohne Pin, Saison-Höhepunkt): `pin3d-maenner` (nach Budget; Geschenkideen für Männer/Wichtelgeschenke/Geschenke für Papa), `pin3d-frauen` (nach Budget; Wichtelgeschenke/Geschenkideen für Weihnachten/Kleine Geschenke – „Geschenke für Frauen“ gibt es als Thema nicht), `pin3d-adventskalender-befuellen` (für Kinder; Adventskalender/Advent/Weihnachten), `pin3d-wie-funktioniert-wichteln` (Ideen & Reels; Wichteln/Weihnachtswichtel/Weihnachten), alle KI-Label + Alt-Text. `pin3d-was-ist-ein-wichtel` 11.11. veröffentlicht (Wichtelgeschenke für Kinder, /was-ist-ein-wichtel/, Themen Wichteln/Weihnachtswichtel/Advent, KI-Label, Alt-Text). Noch ohne Pin: Varianten, zu dritt, per Post, Nikolaus, Black Friday (ab 16.11.), Zubehör, Einladung.
- Eltern-Video (10.11., Toni: „YouTube soll Muttis/Eltern auf die Seite holen“): `marketing/reel/render-video-wichteltuer-eltern.js` + `stimme-reel.js wichteltuer-eltern/stimme.json` → `wichteltuer-eltern/video-wichteltuer-eltern.mp4` (33,5 s: Tür an die Fußleiste, Begrüßungsbrief, Namen-Generator am Handy, 24 Briefe, Ausmalbild+Urkunde, Schluss wichtellos.de). YouTube youtube.com/shorts/14GN_lQh38c (NICHT für Kinder – sonst keine Kommentare/Karten/Endbildschirme; KI „Ja“, Kinder-Tags entfernt, Beschreibung beginnt mit „Alle Vorlagen kostenlos: wichtellos.de/wichteltuer“). Eltern-Video 2 (10.11.): `render-video-streiche-eltern.js` + `stimme-reel.js streiche-eltern/stimme.json` → `streiche-eltern/video-streiche-eltern.mp4` (35,8 s: 5 Streiche Socken-Chaos, Kuscheltier-Picknick, Waschtag, Schaumbad, Nikolaus auf Bildern der Onni-Folgen + Streichplan am Handy, Schluss wichtellos.de). 10.11. YouTube youtube.com/shorts/Soh-1O3axbA (nicht für Kinder, KI „Ja“, Kinder-Tags raus, öffentlich) + Instagram-Reel (ohne Musik, Stimme); TikTok: Toni. Upload-Kopie `-upload.mp4` (crf 23, 6,7 MB < 10 MB Upload-Grenze). Eltern-Video 3 (10.11.): `render-video-kalender-eltern.js` + `stimme-reel.js kalender-eltern/stimme.json` → `kalender-eltern/video-kalender-eltern.mp4` (23,6 s, Onnis Adventskalender erklärt: Eule, Kalender am Handy mit `?datum=2026-12-07`, Kekse/Lied/Schlafen, Schluss wichtellos.de). 10.11. Instagram-Reel (ohne Musik) + TikTok (Toni); 11.11. YouTube youtube.com/shorts/phXzTEkz6RE (nicht für Kinder, KI „Ja“, Tag „Kindergeschichte“ entfernt, öffentlich)). 10./11.11. dazu (Toni: mehr Reichweite): `marketing/render-karussell-streiche.js` → `marketing/social/streiche/` (Karussell ig-01…10 „24 Wichtel-Streiche zum Speichern“ aus `DOOR_PLAN` via `streiche-plan.json`, `pin-streiche.jpg` 1000×1500, `story-streiche.jpg` 1080×1920 Mitte frei). Pinterest (alle Pinnwand „Wichtelgeschenke für Kinder“, KI-Label, Alt-Text): Video-Pin Streiche → /wichteltuer/#streiche (Wichteln/Weihnachten/Advent – „Weihnachtsbräuche“ nicht angeboten), Video-Pin Kalender → /onni-adventskalender/ (Adventskalender/Wichteln/Advent), Bild-Pin Streiche-Liste → /wichteltuer/#streiche (Wichteln/Weihnachten/Advent). Instagram-Storys: Streiche-Video + Bild mit Link-Sticker „Alle 24 Streiche“ → /wichteltuer/#streiche. Karussell in der Business Suite geplant für 11.11. 20:30. Tipp Pinterest-Themen: Vorschlag per find-Ref wählen (Klick nach Koordinaten traf „Adventure Time“); Business Suite: Uhrzeit im Zeitplan nur per Einzeltasten (key „2 0“), Planen-Anzeige kann hängen bleiben, obwohl der Beitrag geplant ist → unter „Geplant“ prüfen. Eltern-Videos weiter: Ausmalbilder, „Kind entdeckt den Wichtel“, Onni-Kalender erklärt. Türschilder (6 auf A4) laut Toni hässlich → Entwurf Papier-Wichteltür + 8 Mini-Schilder `marketing/onni/papiertuer/tuer-entwurf.html` (Toni: später).
- `marketing/render-pins3d.js` – Foto-Pins mit 3D-Wichtel nach `marketing/pins3d/` (Standbilder `marketing/reel/wichtel3d/stills/`, 02.11.)
  02.11. alle 6 veröffentlicht (auslosen, whatsapp, wichtelgedichte, lose-drucken → „Ideen & Reels“; buero → „Ideen & Reels“; unter-10 →
  „nach Budget“), alle KI-markiert + Alt-Text. Themen-Tags nur bei buero + unter-10 (bei den ersten 4 vergessen, nachträglich nicht möglich).
  Regel: jeder Pin mit Themen, Alt-Text, KI-Label.
- `marketing/reel/render-reel-whatsapp.js` → `reel-whatsapp.mp4` (17,5 s, „Wichteln? Ganz simpel.“: Namen, Link per
  WhatsApp/E-Mail/Messenger/SMS, Geheimnis lüften, Abspann mit /wichteln-per-whatsapp). Kein WhatsApp-Logo (Markenrecht).
  Standbilder zur Kontrolle: `node marketing/reel/render-reel-whatsapp.js "1.5,8.8,15.5"`
- `marketing/reel/render-reel-wichtel3d.js` → `reel-wichtel3d.mp4` (25,8 s, 3D-Plüsch-Wichtel: Umschlag, Namen, Auslosen, Geschenk,
  Abspann wichtellos.de, mit Umgebungston). Clips in `marketing/reel/wichtel3d/` aus Google Flow (Projekt „Nov 02 - 10:17“,
  Omni 1.1 Flash, 12 Credits/Clip, Startbilder von Toni aus Gemini). Gemini-Funkeln unten rechts: Clip 1–3 erst ab 2,2 s, Clip 4
  gezoomt. Beim Posten „Mit KI erstellt“ angeben (02.11.)
- Startseite aufgepeppt (Toni 02.11.): Kopfbereich `.hero-3d` in `tool.html` = großes Werkstatt-Bild (bis 1080 px breit, dunkler Verlauf,
  Knöpfe „Los geht’s“ → #form und „So geht’s in 25 s“ → #so-gehts), Handy: Bild oben, Text darunter auf Dunkelbraun. USP-Karten mit
  Onni-Stickern überlappen das Bild, Onni-Sticker an den Schritten 1–3 (`.step-onni`) und im Geschenk-Hinweis. Das frühere Werkstatt-Foto
  unter dem Formular ist entfallen (`<!--FOTO-->` weg).
  Deko links/rechts (≥1180 px) und CTA-Box „Noch nicht ausgelost?“ zeigen jetzt Onni-Sticker statt der gezeichneten Wichtel (Tannen bleiben).
- 3D-Wichtel auf der Website (Toni 02.11.: „freundlicher“): `ai_photo()` in `build.py`, Bilder `fotos/wichtel3d-*.webp`, Bildunterschrift
  „Bild: KI-generiert“. Startseite: Werkstatt-Bild (statt Unsplash-Raureif). Ratgeber: kleines Hochformat rechts neben dem Lead
  (`.photo-ai`, ersetzt dort den SVG-Wichtel): Budgetseiten + Büro (Geschenk), Schule/Kita (Los), WhatsApp (Umschlag), Gedichte (Feder).
  Tool, Icons und Animation bleiben SVG.
- Erklärvideo (02.11.): `video_block()` in `build.py` → `fotos/wichtel3d-video.mp4` (540×960, 2,1 MB, mit Ton) + Poster;
  lädt erst nach Klick (`data-video` in `site.js`, kein Autoplay, kein YouTube). Startseite „So funktioniert's“ + WhatsApp-Seite;
  VideoObject-Schema auf der Startseite. Neu erzeugen: Reel rendern, dann ffmpeg scale=540:960 crf 28.
- `marketing/render-social.js` – Instagram-/TikTok-Karussells (`SETS`: auslosen, buero-unter-10, whatsapp (10 Schritte), whatsapp8 (8 Schritte, max. 10 Bilder Business Suite), lose, wichteltuer) nach
  `marketing/social/<set>/`, je Folie `ig-NN.png` (1080×1350) und `tt-NN.png` (1080×1920) (01.11.)
- Amazon-Direktlinks: `product_links(query, asin)` in `build.py` – Produktlink `/dp/ASIN?tag=` + Suchlink „weitere Modelle“ als
  Rückfall. Seit 01.11. bei SUPPLIES (Würfel, Kraftpapier-Tüten) und DOOR_SHOP (Set, Figur, Lichterkette). Keine Preise/Amazon-Fotos zeigen
  (PartnerNet-Regeln). ASINs ab und zu auf „Auf Lager“ prüfen; Geschenkfinder/Geschenkseiten bleiben Suchlinks.
- `fotos/` – Bilder der Website: 3D-Wichtel (`wichtel3d-*`, KI aus Google Flow, Quellen `marketing/reel/wichtel3d/stills/`) als WebP
  in 2 Breiten über `ai_photo()`, dazu das Erklärvideo. Seit 02.11. keine Unsplash-Fotos mehr (`photo()` bleibt für spätere Fotos:
  Unsplash-Lizenz, nie direkt von Unsplash einbinden, keine Gesichter/Logos). 3D-Szenen: werkstatt, umschlag, feder, los, geschenk,
  wuerfel, schrott, lupe, basteln, tuer, kinder, feier (Bilder in Flow kosten im Pro-Abo keine Credits, Videos schon)
- `og/` – Vorschaubild (1200×630) je Ratgeberseite, `build.py` setzt es automatisch als og:image; neu erzeugen mit
  `node marketing/render-og.js` (neue Seite = dort eintragen). Startseite nutzt weiter `og-image.png`
- `render-icons.js` – erzeugt `favicon.ico` (16/32/48), `favicon-48/96.png`, `icon-192/512.png` aus `favicon.svg`;
  `site.webmanifest` schreibt `build.py`
- `render-images.js` – erzeugt `og-image.png` und `apple-touch-icon.png` aus `favicon.svg` und `wichtel.svg`
- `website/` – **generiert**, nie von Hand bearbeiten. Nach jeder Änderung: `python3 build.py website`
- `tests/live-check.py` – nach jedem Deploy: prüft alle Seiten + jede verlinkte Datei live auf 200 (02.11. eingeführt, nachdem die
  Sticker-ZIP wegen `*.zip` in `.gitignore` nie online war). `build.py` warnt am Ende, wenn Git eine Datei in `website/` ignoriert.
- `tests/` – Playwright-Tests (Server vorher starten: `cd website && python3 -m http.server 8766`)
- `build.py`: `onni_kalender_page()` – `/onni-adventskalender/` (05.11., Toni): „24 Wichtel-Geschichten für kleine und große Kinder“.
  Kalender mit 24 Türchen auf großem Onni-Bild (`fotos/onni/kalender-bg.webp` aus folge-05/b04-kekse), Reihenfolge gemischt
  (`ONNI_REIHE`, fest). Türchen N öffnet um 0 Uhr deutscher Zeit am N. Dezember (Logik in `site.js`, `.ak-grid`; lokal testen mit
  `?datum=2026-12-05`, geht nur auf localhost). Offen = Videobild + gelbe Zahl, Klick spielt Video (lädt erst dann), Adresse `#tag-N`
  (Posts verlinken darauf). Videos: `fotos/onni/folge-NN.mp4` (540×960, crf 29, ~4–5 MB) + `folge-NN-poster.webp` (Bild bei 1,5 s) aus
  `marketing/reel/adventskalender/folge-NN/folge-NN.mp4` – alle vorab online (Toni: ok, wer den Dateinamen errät, sieht sie früher).
  Neue Folge = Titel in `ONNI_FOLGEN` + Video/Poster nach `fotos/onni/`. `ONNI_YT` {Tag: URL} → Knopf „Auf YouTube ansehen“ (Kanal legt Toni an,
  Uploads geplant 0 Uhr, „für Kinder“). Unter dem Video „Für die Großen“ (`ONNI_GROSS`: 1.–5. Nikolaus, bis 19. Geschenkfinder, dann unter 10 €),
  unten `ONNI_SHOP` „Für die Großen: Du suchst noch Geschenke?“. Geschenk-Werbung nie im Video/Kindertext (UWG), nur für Eltern.
  Lesefassung aller 24 Geschichten kommt Ende November.
  07.11.: Startseiten-Kasten `.ak-teaser` (tool.html, Zahl/Türchen per site.js, ab 25.12. weg), Knopf „Jeden Abend an Onni erinnern“ →
  `/onni-erinnerung.ics` (schreibt `extras()`, 24× 18:30). Briefe ≠ Folgen (Toni): Seite sagt „unabhängig von den Geschichten“.
  Countdown: `render-reel-countdown.js [N]` (Reel, `MUSIK=zuckerfee`, `OHNE_ZAHL=1` = „Bald geht’s los …“ für Pinterest) und
  `render-tiktok-countdown.js [N]` (Stimme Gemini). Seit 07.11. Bilder aus Folge 6/7. 07.11. „Noch 24×“: Insta-Reel + Story (Musik),
  Pin ohne Zahl (Wichtelgeschenke für Kinder, Themen Adventskalender/Wichteln/Weihnachtsbräuche); TikTok: Toni. YouTube-Short youtube.com/shorts/es-wN7Iy7lQ (TikTok-Fassung, für Kinder, KI „Ja“, öffentlich). Post-Texte je Türchen: `marketing/reel/adventskalender/post-texte.md`.
- Teilen + Symbole (06.11., Toni): `share_row(text, betreff)` in `build.py` (WhatsApp/E-Mail/„Link teilen“ = navigator.share bzw.
  kopieren, Handler `.sh-copy` in `site.js`), auf `/onni-adventskalender/` allgemein (`AK_SHARE`) + je Türchen im Player (`.ak-share`, JS).
  `ICONS` (eigene Inline-SVGs) + `SOCIAL`/`social_links()` → Fuß „Folge uns“ und „Folge Onni“. Adventskalender-Reihenfolge neu:
  1 zieht ein, 2 Kuscheltier, 3 Keks, 4 Waschtag, 5 Sockenkorb, 6 Nikolaus (`ONNI_FOLGEN`). Folgen 1–7 abgenommen und auf der Website (Folge 7 „Ein Lied für Onni“: 07.11.).
- Geschenke-Generator + Rubbellos (06.11., Toni: „ganzes Jahr, besser als die anderen“): `geschenke.py` (`ALLE_IDEEN` = 117 neue
  Ideen für alle Anlässe + die Wichtel-Ideen aus gifts.py, zusammen 230; Felder n/t/q/w/b/m/a), `generator_page()` → `/geschenke-generator/`
  (Anlass/für wen/Budget/mag → 3 Lose zum Freirubbeln, 🎲 je Los, Merkliste `wl-merkliste` im localStorage, Adresse `?anlass=&fuer=&budget=&mag=`),
  `rubbellos_page()` → `/rubbellos/` (Geschenk hinter Rubbelschicht, Link `#r=` Base64url, `?g=` füllt vor). JS: `assets/rubbel.js`
  (gemeinsame Rubbelschicht + Konfetti), `generator.js`, `rubbellos.js`. Fuß „Geschenkideen“, Sitemap, Datenschutz ergänzt. Generator seit 06.11. im Hauptmenü. **08.11. Umbau (Toni: „extrem schlecht“, Technik-Fan bekam Anzuchtset):** Punkte statt harter Filter (Hobby/Interesse fliegt nie raus, Budget nie überschritten, ohne Hobby keine Hobby-Bausteine), `hobbys.py` = 24 Interessen + 425 Hobbys × Bausteine (Typen a/s/f/t/g/l/r/e/p) → Ideen entstehen im Browser, eingetipptes Hobby bekommt dieselben Bausteine; 25 Anlässe, `ANL_HART` (Taufe, Baby … nur eigens eingetragene Ideen); zusammen „über 4.200 Ideen“. Anlass als Auswahlliste, Hobby als Eingabefeld mit Liste, Bereiche einklappbar. Shop-Ideen (`SHOP_IDEEN`, Feld u, ~40 % ein Shop-Los). Etappe 2 (08.11. abends): `ideen/teil1–6.py` = ~1.370 handgeschriebene Ideen (6 Helfer, je 4 Interessen, Format wie `_RAW`), Lader `_ideen_dateien()` in geschenke.py (ungültige Einträge fliegen raus, Dubletten nur einmal), Prüfung `python ideen/pruefen.py` (Fehler, Dubletten, Abdeckung Person × Interesse × Budget). Ideen liegen in `/geschenke-daten.json` (baut generator_page, ~400 KB, gzip ~100 KB), generator.js lädt sie nach. Offen: Etappe 3 Anlass-typische Ideen; Lücken v. a. bis 10 €. Eigene og-Bilder + Pins `pins3d/pin3d-geschenke-generator.png`, `pin3d-rubbellos.png` (06.11. veröffentlicht, Ideen & Reels,
  Themen Generator: Geschenkideen für Weihnachten/Geburtstagsgeschenke/Wichteln; Rubbellos: Gutscheine/Geschenkideen für Weihnachten/Wichteln; Alt-Text, KI-Label).
- `marketing/reel/handy-auslosen/` (06.11., Toni): Reel „Wichteln per WhatsApp am Handy“ aus echten Bildschirmen (Website neu mit Anna/Ben…,
  WhatsApp aus Tonis Screenshots, private Kontakte entfernt: `wa-edit.js`), Wischen/Tippen/seitlicher App-Wechsel in `render.py`.
  Fassungen: `reel-handy-auslosen.mp4` (26 s, Texte), `reel-handy-stimme.mp4` (28 s, Stimme Gemini „Charon“), `reel-handy-tiktok-15s.mp4`
  (`SCHNELL=1`), `reel-handy-28s-musik.mp4` (+ leise Spieluhr). 06.11.: Pinterest-Video-Pin (Ideen & Reels, Link /wichteln-per-whatsapp/,
  Themen Wichteln/Weihnachtswichtel/Geschenkideen für Weihnachten, Alt-Text, KI-Label) + Instagram-Story (ohne Link-Sticker – bei Videos
  in der Business Suite nicht möglich). TikTok: Toni (Text in teilen-texte.md).
- `marketing/reel/render-reel-was-ist-wichteln.js` → `was-ist-wichteln/reel-was-ist-wichteln.mp4` (19 s, Toni 07./08.11.): „Schon mal von Wichteln
  gehört?“ – erklärt Wichteln auf 3D-Stills, Stimme Gemini „puck“ (ton-N.wav gecacht, TEMPO 1.2, Pause nach der Frage), Ende „Mach mit! Per WhatsApp
  oder E-Mail – ganz einfach, kostenlos und mit Spaß“. Ton und Bild werden getrennt gebaut (in einem ffmpeg-Durchgang hing es). 08.11.: YouTube-Short
  youtube.com/shorts/TQXJ610aEw0 (nicht für Kinder, KI „Ja“), Pinterest-Video-Pin (Ideen & Reels, Link Startseite, Themen Wichteln/Weihnachtsparty/
  Weihnachten, Alt-Text, KI-Label). TikTok: Toni. Achtung YouTube: Escape im Upload-Dialog schließt ihn (Video bleibt als Entwurf unter „Shorts“).
- `marketing/reel/render-video-wichteln-erklaert.js` → `wichteln-erklaert/video-wichteln-erklaert.mp4` (1:56, Toni 08.11., Text von Toni): Was ist Wichteln,
  Julklapp/Herkunft, Wichteln heute mit WichtelLos, Kommentare/Like. Stimme „puck“ mit Tonlage je Szene (`TON`), Geräusche aus `sounds-pixabay/`
  (neu: `klopfen-tuer.mp3`, `handy-ton.mp3`), keine Musik. 08.11. YouTube youtube.com/shorts/-FtaIxCICVw (nicht für Kinder, KI „Ja“, öffentlich).
  YouTube: anklickbare Links + eigenes Vorschaubild erst nach Identitätsbestätigung (youtube.com/verify, Toni) → Links ohne https:// schreiben.
  Upload-Standard-Tags sind Kinder-Tags (Onni) → bei Nicht-Kinder-Videos entfernen. Videos > 10 MB lädt Toni per Drag & Drop hoch.
- `marketing/reel/render-video-wichtel-kinder.js` → `wichtel-kinder/video-wichtel-kinder.mp4` (2:42, Toni 08.11., Text von Toni gekürzt: nur den Wichtel
  erklären, keine Sagen/Heinzelmännchen – Kinder hätten Fragen): 45 Bilder aus den Onni-Folgen (mehrere je Szene, Toni: „mehr Bilder“), Vorlesestimme puck
  TEMPO 1.0, Tonlagen + leise Geräusche, Schluss Abo-Bitte über die Eltern + Wichtelnamen, letztes Bild 1,5 s länger (Toni: „sofort Schluss ist schlecht“).
  08.11. YouTube youtube.com/shorts/bsDVOosOR74 (für Kinder, KI „Ja“, öffentlich).
  Upload > 10 MB: Datei mit `split -b 9400000` teilen, je Teil eigenes `<input type=file>` per JS + file_upload (einzeln, nicht im Batch!),
  dann per JS `new File(teile)` → YouTube-Input; vorher Größe prüfen.
  Kurzfassung `render-reel-was-ist-ein-wichtel.js` (22,9 s, Hinweis Onni-Kalender ab 1.12.): 08.11. Instagram-Story (Business Suite) + Pinterest-Video-Pin
  (Wichtelgeschenke für Kinder, Link /onni-adventskalender/, Themen Wichteln/Weihnachtsbräuche/Advent, Alt-Text, KI-Label). TikTok: Toni (08.11. gepostet).
  Toni 08.11.: Insta/TikTok nur kurze Fassungen (lange Videos schaut dort keiner) – `render-ausschnitte.js` schneidet `ausschnitte/julklapp.mp4` (30 s)
  und `wichtel-nachts.mp4` (34 s) aus den langen Videos + Schlussbild „auf YouTube @WichtelLos“. 08.11. julklapp: Instagram-Reel (ohne Musik) +
  Pinterest-Video-Pin (Ideen & Reels, Link /woher-kommt-wichteln/, Themen Wichteln/Weihnachten/Weihnachtswichtel – „Weihnachtsbräuche“ gab es nicht, Alt-Text, KI-Label);
  TikTok: Toni. wichtel-nachts: überall gepostet (Toni, 11.11.).
- Erklärvideos auf der Website (Toni 08.11.: nur selbst gehostet, kein YouTube-Link/-Einbettung – Besucher sollen auf der Seite bleiben): `video_block(v)`
  mit `VIDEO_ERKLAERT` (/woher-kommt-wichteln/ unter dem Lead) und `VIDEO_KINDER` (/onni-adventskalender/#was-ist-ein-wichtel unter dem Kalender);
  Dateien `fotos/video-*.mp4` (540×960, crf 28) + `-poster.webp`, laden erst beim Klick.
- `marketing/reel/render-reel-folgen.js` → `adventskalender/folgen/reel-folgen.mp4` (11,3 s, ohne Ton, Toni 08.11.: „damit uns mehr abonnieren“): „Ab 1. Dezember … erzählt Onni jeden Tag eine neue Wichtel-Geschichte … 24 Türchen … Jetzt folgen @wichtellos“ (Bilder Folge 1/3/5/6/7). 08.11. abends Instagram-Reel (ohne Musik); TikTok: Toni.
- `marketing/reel/render-countdown-spiegel.js [N]` → `adventskalender/folge-08/countdown/countdown-NN-spiegel-spannung.mp4` (10,6 s, Toni 09.11.): Veo-Clip 1 aus Folge 8 („Spiegel-Wichtel“, `folge-08/clips/`, Flow-Szene 11-09 10:42) – schnell laufen → Zeitlupe+Zoom → Ruck-Zoom aufs Spiegelbild → Karte. Texte Toni: „Wer läuft da nachts durch euren Flur? 👀 / Ein Wichtel … / Ist da noch einer? 😳 / Nicht verpassen! Ab 1. Dezember: 24 Geschichten … Folgt uns & verratet uns, wie euer Wichtel heißt!“. Eigene Geräusche (Veo-Ton raus). 09.11. Instagram-Reel (Titelbild „Ist da noch einer?“); TikTok: Toni. Veo-Prompts: Toni will ausführlich (Bewegung, Ablauf in Sekunden) und bei Folge-Clips „orientiere dich am Referenzbild, alles bleibt so, nur die Figur …“.
- `wissen.py` + `wissen_pages()` (08.11., Toni: „was hilft, sind Seiten wie Was ist ein Wichtel / Wie wichtelt man“): 5 Wissens-Seiten `/wie-funktioniert-wichteln/` (Anleitung 6 Schritte + HowTo-Schema, 10 Regeln), `/was-ist-ein-wichtel/` (Wort, Aussehen, Tomte/Nisse/Heinzelmännchen, Kinderkasten + Kindervideo), `/wichteln-varianten/` (12 Spielarten), `/wichteln-zu-dritt/`, `/wichteln-per-post/`; je FAQPage, og-Bild, Fuß „Spiele & Anlässe“, Sitemap 40 URLs. Platzhalter <!--CTA-->, <!--VIDEO_…-->, <!--ERKL_KIND-->, <!--SCHRITTE-->. Neue Seite = Eintrag in WISSEN + Sitemap + render-og.js.
- `themen.py` `BLACKFRIDAY` + `/black-friday-wichtelgeschenke/` in `themen_pages()` (07.11., Toni): 36 Ideen in 6 Gruppen + Knopf zur
  Amazon-Angebotsseite (`/deals?tag=`). Hinweis `.bf-banner` (nur 16.11.–1.12., `data-zeit-von/-bis`, site.js) auf der Seite des geheimen
  Links und den Budgetseiten; Fuß „Geschenkideen“, Sitemap 32 URLs, og-Bild. Seite des geheimen Links: Ideen jetzt als Karte `.gift-card`
  „Was schenkst du <Name>?“ + Knopf „Noch mehr Wichtelgeschenke bis X € bei Amazon“. Ganze `.idea`-Kachel klickbar (CSS ::after, „weitere Modelle“ bleibt).
- `themen.py` `NIKOLAUS` + `/nikolaus-geschenke/` in `themen_pages()` (05.11.): 21 Ideen (Kinder, Erwachsene, Büro, Stiefel & Zubehör), Ziel der
  Posts zu Türchen 1–5 (Google Trends „nikolaus geschenke“ 1.–6.12.). Fuß „Kinder & Advent“, Sitemap jetzt 31 URLs.

