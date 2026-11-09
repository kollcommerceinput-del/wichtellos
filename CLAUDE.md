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
  Datenschutz Abschn. 6. `/wichtel-t-shirts/` erst nach dem Shirt-Upload. Neues Motiv = Zeile in `TASSEN` + Bild. **09.11. Umbau (Toni: „Seite scheiße aufgebaut“, leere Motiv-Bilder):** Reiter je Produktart (`SHOP_REITER`: Tasse, Große Tasse, T-Shirt, Hoodie, Teddy – Preise von Hand, bei Preisänderung anpassen), darunter alle Sprüche als echtes Produktfoto (`fotos/merch/shop/<pt>-<Design-ID>.webp`) + Kachel „Und noch viel mehr“; Adresse `#tasse`, `#t-shirt` … öffnet den Reiter (site.js). Daten `shop_daten.py` erzeugt `tools/shop_fotos.py` aus `marketing/merch/shop-fotos/liste.json` + Fotos in F:\Download (beides im echten Chrome geholt: Shop-Seiten `/all?page=N` bzw. Produktseiten per fetch auslesen, Bilder auf image.spreadshirtmedia.net per fetch + `<a download>`; Chrome fragt einmal „mehrere Dateien herunterladen“ → Toni). Weiße Schrift nur auf T-Shirt/Hoodie, Tasse/Teddy nur dunkle Schrift. Shop-Karte (Geschenkfinder) und `.shop-hint` zeigen jetzt das Tassenfoto.
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
  TikTok: Toni. wichtel-nachts noch offen (Toni: immer nur eins).
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
- [ ] Bing-Index 02.11. (URL-Prüfung): 6 von 20 indiziert (Start, unter-10, Geschenkfinder, Kinder, Würfeln, Wichteltür),
      Rest „Erkannt, aber nicht gecrawlt“ (alle übermittelt, Bing crawlt neue Domains langsam). Bing-Hinweis „Alt-Attribut fehlt“
      = dekorative Bilder mit alt="" (gewollt). site:-Suche bei Bing zeigt noch nichts → Site-Explorer/URL-Prüfung nutzen
- [ ] Google-Indexierung: 31.10. nachmittags beantragt (7, dann Kontingent ~7/Tag/Property): Büro, Einladung-Vorlage,
      Geschenkfinder, unter-10, unter-5, Schrottwichteln, Würfeln. Startseite schon indexiert. 01.11. 09:30: Kontingent noch
      voll (rollierend 24 h), Sitemap neu eingereicht (18 URLs). 01.11. abends 9 beantragt: wichteltuer, wichteln-per-whatsapp,
      selber-machen, fuer-kinder, unter-20, unter-15, unter-30, schule-kita, weihnachtsfeier (10. = Kontingent).
      02.11. 15:50: wichtel-ausmalbilder beantragt, danach Kontingent wieder voll. Bing: ausmalbilder + wichteltuer übermittelt.
      03.11. ~14:00: wichtelgruss, wunschzettel, adventskalender-ideen, wichtelgedichte, woher-kommt-wichteln beantragt →
      **alle Seiten bei Google beantragt.** Sitemap neu eingereicht (Google erkennt 24 Seiten). Bing: diese 3 neuen + wichteltuer übermittelt.
      03.11. ~16:30: geschenke-fuer-maenner + geschenke-fuer-frauen beantragt, dann „Kontingent überschritten“ (Tageslimit lag heute bei 7).
      04.11. ~17:40: adventskalender-befuellen beantragt („nicht bekannt“ → in Warteschlange); wichtelgeschenke-selber-machen und
      wichtelgeschenke-fuer-kinder waren bereits indexiert. 04.11. ~18 Uhr alle 29 Sitemap-URLs geprüft: 27 indexiert;
      impressum + adventskalender-befuellen beantragt; Startseite neu beantragt (FAQ geändert). Ende 04.11.: nichts mehr offen.
      06.11. ~17 Uhr: geschenke-generator beantragt (Ergebnis nicht bestätigt, Tab geschlossen), rubbellos → „Kontingent überschritten“ →
      06.11. abends: rubbellos + geschenke-generator beantragt (beide „Indexierung wurde beantragt“, waren noch „nicht bekannt“) → in ein paar Tagen prüfen. 07.11.: black-friday-wichtelgeschenke beantragt („Indexierung wurde beantragt“). 08.11. ~17:40: wichtel-tassen beantragt (erster Versuch kurz nach dem Deploy „abgelehnt“ – Live-Test neu gestartet, dann ok). 08.11. ~23 Uhr: die 5 Wissens-Seiten beantragt (wie-funktioniert-wichteln, was-ist-ein-wichtel, wichteln-varianten, wichteln-zu-dritt, wichteln-per-post – alle „Indexierung wurde beantragt“). 09.11. ~17 Uhr: wichtel-tassen nach Umbau neu beantragt (war schon indexiert).
      Bing nicht von Hand (Toni 03.11.): IndexNow-Job meldet Sitemap-URLs bei jedem Push – nur prüfen, dass neue Seiten in der Sitemap stehen. Direktlink /search-console/inspect?…&id= gibt 404 → Prüffeld nutzen
- [ ] Awin: Publisher-ID 3140404 (KOLL Commerce UG), freigeschaltet 30.10.2026. Bewerbungen gesendet 30.10.: Jochen Schweizer,
      Thalia, mydays (Carrera Toys: Toni schickt selbst ab). myToys gibt es bei Awin nicht. Awin-Profil noch unvollständig.
      Zugesagte Partner dann in passende Ideen einbauen (Erlebnisse ab 20 €/Büro, Bücher, Kinder 8–12)
      01.11.: Profil vervollständigt (Logo, Branchen auf Familien-passende reduziert – Erotik/Alkohol/Unterwäsche raus,
      Website-Text max. 255 Zeichen). Tchibo DE beworben (Toni). Etsy + myToys gibt es bei Awin nicht. Auszahlungsdetails
      (Bank/Steuer) erst nach 2FA-Aktivierung erreichbar – Toni. Vor erstem Awin-Link: Datenschutz um Awin ergänzen
      01.11. Fotogeschenke: Myposter DE + Pixum DE beworben (EPC 0,33 € bzw. 10 %); fotokasten verworfen (Awin-Risikostufe 2),
      MyHappyMoments/meinbildkalender (EPC ≤0,04 €) nicht. Bei Zusage: Fotokalender/-tasse in Selber-machen, Oma/Opa, unter 20 €.
      02.11.: **Thalia DE abgelehnt** („Aktuell noch zu geringe organische Reichweite“). Bücher bleiben Amazon-Suchlinks.
      Neu bewerben, wenn Search Console/Social spürbar Reichweite zeigen (frühestens Ende Nov., sonst 2027).
      02.11.: **Tchibo DE abgelehnt** – Grund „Keine URL angegeben“ (formaler Fehler, nicht Reichweite). Vor neuer Bewerbung
      im Awin-Profil prüfen, ob wichtellos.de als Werbefläche (Promotional Space) eingetragen ist und bei der Bewerbung mitgeht.
      02.11. Recherche Awin-Verzeichnis (öffentlich: awin.com/de/search/advertiser-directory, ohne Login, Suche per Stichwort):
      passende DE-Programme – Spiele/Kinder: Spielemax, idee+spiel, Milan-Spiele, Pinolino, puzzleYOU; Basteln: idee-shop, Rayher,
      Buttinette; Süßes/Tee: my-schoko-world, Zotter, Swiss Chocolate Club, Besser im Glas, Tee Handelskontor Bremen, Ronnefeldt;
      Advent: Kalendermaxx, Schneekugelhaus; Geschenke: Sheepworld, Gravur Geschenkideen (15 %), Hofmeister, Kartenliebe, PosterXXL;
      Socken: Socken-online.de, VON JUNGFELD; Bücher: bücher.de; Erlebnis: WellCard, Pfotenklee. Erst nach Validierung bewerben.
      Ursache: Werbefläche war bei Awin nicht validiert → Meta-Tag `<meta name="verification" …>` (Awin, in `build.py`, nicht löschen) eingebaut, 02.11. „Site validieren“ geklickt (Antwort true) – Schild-Symbol zeigte danach noch „validieren“, später prüfen.
      03.11.: Etsy erneut gesucht – weder im Awin-Verzeichnis (auch mit Nordamerika/GB) noch im öffentlichen Verzeichnis. Etsy-Links
      derzeit nicht möglich; eigener Etsy-Shop vertagt auf 2027 (Toni-Entscheidung offen, Empfehlung PC).
      Awin-Social-Links: Blog-URL = instagram.com/wichtellos (kein X-Konto, keine Facebook-Seite im Business-Portfolio).
- [ ] Externe Links/Erwähnungen (06.11., Toni: Gemini behauptet, wichtellos.de existiere nicht; ChatGPT findet uns über Bing).
      AlternativeTo: Konto „WichtelLos“ (Google-Login kollcommerce.input@gmail.com) angelegt, aber **Eintrag nicht möglich – AlternativeTo
      nimmt nur Apps, die Englisch unterstützen** (FAQ). Erst mit englischer Fassung (frühestens 2027) eintragen; Screenshots + Text liegen in
      marketing/alternativeto/. Kostenlose Warteschlange dort sehr lang, Vorziehen kostet einmalig. 09.11.: Liste für Onnis Adventskalender (Familienblogs/Redaktionen, Prio A/B + Mailtext) in `marketing/presse/onni-kalender-blogs.md` – **09.11. ~18:15 verschickt** (von wichtellos@mailbox.org, Signatur „WichtelLos“): info@kita.de, redaktion@familienleben.ch, info@familie.de, redaktion@stzn.de (Sie-Form). Offen: Prio B, dpa (nur alte Adresse themendienst@dpa.com). Antworten abwarten. Nächster Schritt: Mails an Redaktionen
      (t3n Büro-Wichteln-Apps, Vodafone featured Digitales Wichteln, Karrierebibel Wichteln im Büro, appgefahren) – Toni schickt selbst.
- [ ] Zielmarkt bis Weihnachten 2026: nur DACH (Toni 01.11.). FAQ „Österreich und Schweiz“ + Budget in CHF erkannt. Übersetzungen
      frühestens 2027: zuerst Englisch („Secret Santa“), Skandinavien höchstens danach (kleine Märkte, kaum Amazon/Awin).
- [x] Ko-fi ko-fi.com/wichtellos (01.11.; Login Google kollcommerce.input@gmail.com, PayPal rechnung@kollcommerce.de, Standort bestätigt).
      Knopf „🎁 Ein Geschenk für den Wichtel“ (Toni: Geschenk statt Kaffee, nicht bettelnd) (`.kofi-btn`, reiner Link) im FOOTER + Seite des geheimen Links (`.kofi-hint`
      in tool.html); Datenschutz Abschn. 6 ergänzt. Ko-fi-Einstellungen: Simple tip, Euro, Wording „Tip“, Mindestbetrag 2 € (Toni), Zähler/Rangliste aus, Cover = Lichterkette/Tannen ohne Text,
      Membership mode „Off“ (keine Monats-Abos), deutsche Dankesnachricht, Bio + Website wichtellos.de.
      Galerie: nur Album „So geht's: Wichteln in 1 Minute auslosen“ (7 Folien `social/auslosen`). Toni: dort keine
      Geschenkideen/Kaufwerbung, nur dezent zeigen, was WichtelLos macht. Ko-fi-Oberfläche bleibt Englisch (keine Spracheinstellung). Buchhaltung: Umsatz 19 % der UG, keine Spendenquittungen, nie „Spende“ nennen.
      02.11. aufgehübscht (Toni: „Potenzial nach oben“): Farbe #c62828 statt Ko-fi-Blau, Cover = 3D-Werkstatt (`marketing/kofi-cover-3d.jpg`),
      Status „🎄 Wichtel-Saison läuft – frohes Auslosen!“, angepinnter Bild-Beitrag „Hallo, ich bin der Wichtel von WichtelLos“
      (`marketing/kofi-intro-3d.jpg`, Text ohne Betteln/„Spende“). Achtung: „Pin to top“ und Datei-Uploads können den Tab kurz einfrieren.
      Ko-fi-Shop/Premium-Vorlagen verworfen (Toni 03.11.: nichts verkaufen, nur Trinkgeld)
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
      von Toni gewählt), Text+8 Hashtags inkl. #wichtelnperwhatsapp. Auch auf TikTok (Toni, bestätigt 01.11.)
- [x] 01.11.: LinkedIn (Antonio Koll) Video-Beitrag „Wichteln im Team – in 1 Minute ausgelost“ mit reel-folien.mp4, ohne Musik
      (LinkedIn-Editor hat keine Musikbibliothek; Instagram-Musik darf nicht übernommen werden), Link /wichteln-im-buero/
- [x] Pinterest: 16 Pins + 3 Reels veröffentlicht; 01.11. dazu unter-30 (Budget), schule-kita + wichteltuer (Kinder),
      weihnachtsfeier (Schrottwichteln & Wichtelspiele), wichtelgedichte (Ideen & Reels). 01.11. abends: whatsapp (Ideen & Reels, Link /wichteln-per-whatsapp/). Neue Seite = neuer Pin; 4 Pinnwände + „Wichteln: Ideen & Reels“ (Instagram-Import). Fuß: „Folge uns“ Instagram/Pinterest/TikTok
- Pinterest Trends DE (31.10.): „wichteln“ steigt ab Oktober, Höhepunkt Mitte–Ende November, ab Anfang Dezember fast weg →
  Pins bis spätestens Mitte November live; früh anziehend: „wichtelgeschenke selbstgemacht“, „kleine geschenke basteln weihnachten“.
  Achtung: „Wichtel streiche“/„Wichtelhaus“ = Wichteltür-Brauch (Kinder), anderes Thema
- Google Trends DE (Okt.–Dez. 2025, geprüft 03.11.2026): „geschenke für männer“ / „… für frauen“ = größte Suchen, steigen ab Nov.,
  Höhepunkt 10.–20.12. „adventskalender befüllen“ Höhepunkt Mitte–Ende Nov., ab 1.12. weg. „nikolaus geschenke“ Spitze 1.–6.12.
  „wichteln“ selbst: Höhepunkte Anfang Dez. und 22./23.12. (Saison läuft also den ganzen Dezember). Weihnachtsgrüße/-sprüche/-gedichte:
  riesig, aber nur 22.–24.12. (starke Konkurrenz). Kaum gesucht: „weihnachtsfeier spiele“, „geschenk kollegen“, „geschenke für oma“, „last minute geschenke“.
- Pinterest Trends DE „wichteltür“: Höhepunkt Woche bis 3.12.2025, danach steil runter → Seite/Pins bis Mitte November live
- [x] 31.10.: LinkedIn-Profil Antonio Koll (neu, 0 Kontakte) – Beitrag „Wichteln im Büro“ (Text 4 aus `marketing/teilen-texte.md`,
      Link-Vorschau mit og-Bild) gepostet. Reel `marketing/reel/reel-lose.mp4` (ohne Ton) gerendert – Hochladen + Musik durch Toni
- [x] 01.11. ~22 Uhr: Reel „Wichteln per WhatsApp – in 8 Schritten“ (Folien-Video `marketing/social/whatsapp8/reel-folien.mp4`,
      10 Folien à 2,5 s = 25 s, Set `whatsapp8` in render-social.js) auf Instagram, Musik von Toni gewählt. Grund für 8 statt 10
      Schritte: Business Suite erlaubt max. 10 Bilder pro Beitrag/Karussell; Tipp steckt jetzt in Schritt 4
- [x] 08.11.: 10-Schritte-Karussell auf `/wichteln-per-whatsapp/` („Alle 10 Schritte zum Durchwischen“): `WA_SCHRITTE` + `wa_karussell()`
      in `build.py`, Bilder `fotos/whatsapp/schritt-NN.webp` (Folien 2–11, 480×600), CSS `.karussell` (Scroll-Snap), Pfeile in `site.js`
- [ ] Rechtstexte 03.11. geprüft: beide gut. Erledigt 03.11.: Datenschutz um Aufsichtsbehörde (BlnBDI), Speicherdauer GitHub,
      Social-Links, Wichtelgruß/Wunschzettel/Kalender ergänzt. Telefon kurz entfernt, dann wieder eingetragen (Toni 03.11.:
      zweiter Kontaktweg Pflicht; Kontaktformular verworfen – n8n-Server des Shops nicht für öffentliche Formulare nutzen).
      **Toni 03.11.: Kein Verkauf über Ko-fi** (kein Shop, keine Premium-Vorlagen) – damit entfallen AGB/Widerruf/EU-USt.
      Ko-fi bleibt reines Trinkgeld, nie „Spende“. Knopf seit 03.11. „💛 WichtelLos unterstützen“ + „Freiwillig – hilft, WichtelLos
      kostenlos zu halten.“: oben im Footer, in der Ergebnis-Ansicht unter den Links („Hat alles geklappt?“, `.kofi-line`), auf der Seite
      des geheimen Links. Ko-fi-Shop nur für kostenlose Downloads (z. B. 24 Briefe von Onni). PDFs bleiben direkt auf der Website
      herunterladbar (nicht hinter Ko-fi); darunter einmal pro Seite `KOFI_LINE` „Gefällt dir das? 💛 WichtelLos unterstützen“
      (Ausmalbilder; Wichteltür: unter den 24 Briefen).
      03.11.: „24 Briefe von Onni“ (Flat-Onni, aus wichtellos-content, von Toni freigegeben) kostenlos auf `/wichteltuer/#briefe`:
      `fotos/onni/onni-briefe-24.pdf` (16 S.) + Vorschau `-480.webp`. Quelle/Neu rendern im Content-Projekt, dann PDF hierher kopieren.
      Ko-fi: Gratis-Artikel https://ko-fi.com/s/62d307cd11 (0 €, „Pay what you want“ aus, 3 Vorschaubilder aus `marketing/kofi-briefe/`).
      **Ko-fi-Gratis-Artikel (Stand 04.11. abends, morgen weiter):** Briefe-Text neu (Bitte „💛 Onni und WichtelLos sind kostenlos …
      Geschenk dalassen: ko-fi.com/wichtellos – ganz freiwillig“ + „Illustrationen mit KI-Unterstützung.“), gespeichert. Offen: 3 neue Artikel
      Ausmalbilder (`fotos/onni/ausmalbilder-alle.pdf`), Wichteltür-Vorlagen (`marketing/kofi-vorlagen/wichteltuer-vorlagen.zip`, nicht im Git
      wegen *.zip – neu: zipfile aus den 4 tuer-*.pdf), Sticker (`fotos/onni/onni-sticker.zip`); Vorschaubilder `marketing/kofi-vorlagen/vorschau-*.jpg`.
      Je Kategorie „wichtel“ (Toni angelegt) + Käufer-Nachricht (Toni wählt: kurz oder mit Druck-Tipp). Rechte-Häkchen setzt Toni.
      Entscheidung offen: „Zahl, was du willst“ ab 0 € (= Verkauf → Bedingungen/Widerruf; Entwurf im Chat 04.11., erst Prüfstelle) oder ohne.
      Datei-Upload bei Ko-fi: `input[type=file]` per JS sichtbar machen + aria-label, dann find → file_upload.
      06.11. abends: die 3 Artikel (Ausmalbilder, Sticker, Wichteltür-Vorlagen) komplett ausgefüllt (0 €, „Pay what you want“ aus, je 3 Vorschaubilder,
      Text wie Briefe, keine Käufer-Nachricht) – Ko-fi speichert nicht einmal als Entwurf ohne Rechte-Häkchen → Toni hat sie 06.11. veröffentlicht: Ausmalbilder https://ko-fi.com/s/5d787162da,
      Sticker https://ko-fi.com/s/4c7dd3c76a, Wichteltür-Vorlagen https://ko-fi.com/s/f07157b789. Vorschau-Videos (Feld „Embed media“, nur YouTube-/Vimeo-Link) 06.11.:
      Ausmalbilder + Sticker → YouTube-Short youtube.com/shorts/oX89TTgIkcI (reel-onni.mp4), Vorlagen + Briefe → youtube.com/shorts/y7p02iI3l3Y
      (reel-briefe.mp4); beide Shorts öffentlich, „für Kinder“, KI „Ja“. Achtung: Ko-fi schaltet „Pay what you want“ bei 0 € gern wieder an →
      nach jedem Speichern öffentliche Seite prüfen (muss „Free“ zeigen).
      Ko-fi: neues Produkt nur über „Add product“-Dialog (Direktadresse /shop/items/add gibt Fehlerseite); „Pay what you want“ springt bei 0 € an.
      Pin `marketing/pins-onni/pin-briefe.png` (`node marketing/render-pin-briefe.js`) 03.11. veröffentlicht: Pinnwand „Wichtelgeschenke
      für Kinder“, Link /wichteltuer/#briefe, Themen Wichteln/Weihnachtsbräuche/Advent („Kindergarten“ gab es diesmal nicht), Alt-Text, KI-Label. IONOS-Satz bleibt (Domain/DNS).
- [ ] Idee 04.11. (Vorschlag aus anderer Sitzung, Toni prüft morgen): „Onnis Adventskalender“ – 24 Hörgeschichten (3–4 Min., passend zu
      24 Briefen + Streichplan), Seite /onni-adventskalender/ mit eigenem Player + MP3 (Kreativ-Tonie/Yoto), evtl. Podcast/YouTube (Kinder-Haken).
      Start muss 1.12. sein. Erst Folge 1 als Probe; Stimme Toni oder KI (ElevenLabs, gewerbl. Abo). Keine Werbung im Kindertext, ruhige Enden,
      keine gefährlichen Streiche, eigene Musik. Texte gehören ins Content-Projekt. Toni legt fest, ob PC oder Cloud.
      04.11.: Entscheidung Video mit Ton (60–90 s je Folge, für Reels/TikTok/YouTube + Website). Folge 1 als Probe:
      `node marketing/reel/render-adventskalender.js 1` → `marketing/reel/adventskalender/folge-01/folge-01.mp4` (Texte/Bildzuordnung in
      `folge.json`, Ton `ton-N.wav` je Absatz, sonst `platzhalter-N.wav` = Windows-Stimme Hedda, nur zum Anhören). Bilder b1 Wald, b5 Bett
      (Flow 2K, Projekt „Nov 03 - 17:06“, Onni 3D), b3 tuer/b4 feder aus stills; **b2-eule.jpg fehlt noch** („Gnome flying on snowy owl“ in Flow
      herunterladen). Geschichten im Content-Projekt `produkte/2026-onni-adventskalender/`. Stimme: später (Toni nimmt auf, ich verbessere).
- [ ] **Spreadshop wichtellos.myspreadshop.de (07.11., Toni)** – live seit 07.11. abends, Partnerkonto partner.spreadshirt.de (Spread-ID 215794844, Shop-ID 1594876). Kunde kauft bei sprd.net AG (Partner-AGB A.4), UG bekommt monatl. Gutschrift. Gestaltung: Logo/Favicon/Rechnungslogo/Banner/Über-uns aus `marketing/merch/shop/`, Farben #c62828/#F6EFE6/#1D3B2C, Überschrift Baloo Bhai. Motive nur Logo-Wichtel (`wichtel.svg`, Toni: „das Logo ist Einzahl“), kein Herz statt „liebe“ (Herz nur als Zusatzfassung). Druckdateien `marketing/merch/tassen/` (12) + `shirts/` (11 Sprüche × hell/dunkel). Upload-Limit ~11 Designs/Tag: 07.11. tasse-01…12 hochgeladen (tasse-12 + Shirts 08.11.). Erst tasse-01 eingerichtet + veröffentlicht (Tasse, Panoramatasse, große Tasse, Weihnachtsteddy, Shirts Männer/Frauen/Bio/Kinder nur Weiß – Toni). OFFEN: übrige 10 Tassen-Motive genauso einrichten; Shirts hochladen (hell → helle, dunkel → dunkle Stoffe); Preise **Toni 07.11.: Tasse 17,90 €, T-Shirt 24,90 €** (= Marge Tasse 4,41 € auf Basis 13,49; Männer/Frauen-Shirt 7,41 € auf 17,49) – morgen unter Preise & Rabatte einstellen, andere Produkte (Panoramatasse, große Tasse, Teddy, Bio-/Kinder-Shirt) mit Toni abstimmen; Rabatt-Aktionen 20–25 % automatisch an – prüfen, ob Marge sinkt; Seite auf wichtellos.de mit Bestell-Links (+ Datenschutz-Satz) – noch NICHT verlinkt. 08.11. Preise: Toni hat 48 Hauptprodukte selbst festgelegt (Tabelle `marketing/merch/shop/preise-spreadshop.xlsx`, Spalte E; z. B. T-Shirt Männer/Frauen 29,99 €, Kinder-T-Shirt 19,99 €, Bio-Hoodie 49,99 €, Tasse 19,99 €, große Tasse 24,99 €, Weihnachtsteddy 29,99 €); alle übrigen Produkte = nächste Stufe auf 4,99/9,99 ab Spreadshirt-Standard. Immer auf ,99 enden; Preisleiter (Bio/Zip teurer, Kinder günstiger), nie stumpf runden. Streichpreise nur über echte Rabatt-Aktionen (PAngV: niedrigster Preis der letzten 30 Tage), nie erfundene „vorher“-Preise. Rabatt-Aktionen: prüfen, ob sie von der Marge abgehen. Toni 08.11.: USt-Formular `F:\Download\acc_UstID_DE_DE_ausgefuellt.pdf` (Steuernr./USt-ID/Finanzamt/seit + Unterschrift fehlen) an partner@spreadshirt.net, 2FA einrichten, Bankverbindung, Steuerstatus „Sitz in DE (19% USt)“, Shop-Impressum zeigt noch „Antonio Koll“ statt UG → Persönliche Angaben speichern, dann prüfen. **Toni daran erinnern.** **Motive (08.11.):** Toni gewählt: Tassen 3, 7, 8 + Shirts 01, 03, 04, 04h, 05, 05h, 06 (je hell+dunkel); neue Sprüche 13–21 (`tasse-13`…`21`: Bargeld, Champion, Legende, des Jahres, König, Königin, Beute, Trophäe, Glückspilz; Toni: „je mehr, desto besser – soll nach Shop aussehen“). Skripte `marketing/merch/skripte/render-tassen(-neu).js`, `render-shirts.js` (Playwright, Fredoka, `wichtel.svg`). Upload-Plan: 08.11. tasse-12 + 13–21 (10 Uploads); 09.11. Shirts dunkel 01/03/04/04h/05/05h/06 + hell 01/03/04/04h; 10.11. hell 05/05h/06. Jedes Motiv bekommt dieselben 8 Produkte wie tasse-01 (Männer T-Shirt SOL'S, Frauen T-Shirt Gildan, Stanley/Stella Unisex CRAFTER, Kinder MINI CREATOR – alle nur Weiß; Tasse, Panoramatasse Standard Weiß/Rot, Große Tasse 440 ml, Weihnachtsteddy), Name = Spruch, Beschreibung + ~10 Tags (Tags einzeln tippen, je 1 s warten, dann Komma – sonst Autovervollständigung), dann Spreadshop-Schalter an + Speichern. Shirt-Motive (hell = helle Schrift) auf dunkle Stoffe. 08.11. veröffentlicht (je 8 Produkte, Name, Beschreibung, 8–10 Tags): tasse-01, 03, 07, 08, 12, 13–21 = 13 Motive. Entwürfe ohne Produkte (nicht gewählt): 02, 04, 05, 06, 09, 10, 11. **09.11. Shirts veröffentlicht** per Express-Erstellung (Partnerbereich „Umschalten“ → „Wechsel zur Express-Erstellung“, legt 200–390 Produkte an, kontrastarme Farben automatisch aus): dunkel 03 (335), 04 (196), 04h (234), 05 (217), 05h (251), 06 (335); hell 01 (243), 03 (388), 04 (388), 04h (388) – helle Fassungen heißen „… – rot-grün“. shirt-01-dunkel 09.11. auf Express umgestellt (334; Kategorien/Zielgruppen von Hand auf „Alle“ gesetzt – nach dem Umstellen prüfen, die alte Auswahl bleibt sonst stehen). Offen: hell 05/05h/06 hochladen (10.11.). **Tassen-Motive 09.11. ebenfalls auf Express** (alle 13 veröffentlichten, je ~250–390 Produkte; Toni: Rot/Grün auf dunklen Stoffen „sieht top aus“). Nach dem Umstellen immer „Einstellungen ändern“: Accessoires + Kinder + Babys anhaken (alte Auswahl bleibt sonst), Platzierung prüfen (Express setzte bei „Schrottwichtel-Geschenk“ „Oben rechts“ → Medium vorn), Speichern, dann „Speichern & Veröffentlichen“. Achtung: Bei einem schon auf Express stehenden Motiv bietet „Umschalten“ den Wechsel zurück an – abbrechen. tasse-01: Panoramatasse-Standardfarbe noch Weiß/Gelb (alle anderen Weiß/Rot) – angleichen. 08.11. abends: Teaser = `marketing/merch/shop/teaser-mit-text.jpg` (Teddy/Tasse/Tasse/Shirt + eigener Text „Wichtelgeschenke von WichtelLos – Tassen, T-Shirts & Teddys mit Spruch“ in Fredoka; Vorlage `marketing/merch/skripte/teaser-mit-text.html`, im echten Chrome über localhost öffnen, Ausschnitt speichern, auf 1400×400). **Trick:** Spreadshop legt das Bild nur mit 50 % Deckkraft hin, solange „Überschrift und Kurzbeschreibung“ an ist → Schalter AUS, Text ins Bild; Knopf „Alle Motive ansehen“ bleibt (Ziel nur „Alle Produkte“/„Design-Tool“). Ränder werden je nach Breite abgeschnitten → Wichtiges mittig. Produktbilder von image.spreadshirtmedia.net blocken curl/Playwright (403) – nur im echten Chrome ladbar. **Rabatt-Aktionen bleiben alle an (Toni 08.11.)** – sie gehen anteilig von der Marge ab (Spreadshirt-Hilfe), kein Verlust. Startseiten-Bausteine Produktvorschau/Designvorschau/„Designs & Produkte“ im Editor gesperrt („zu wenige Produkte“) – später erneut prüfen, sonst Spreadshirt-Chat. Tassen-Standardansicht (Druck vorne) noch offen. Browser-Ablauf: Produkt + Farbe per JS wählbar, aber „Speichern“ nur per echtem Mausklick (JS-Klick wird ignoriert); Spreadshop-Schalter auch per Mausklick.
- [ ] **UX-Analyse 08.11.** (Bericht + Bilder in `G:\wichtellos-content\analysen\2026-11-ux-analyse\`, nicht ins Repo): Q1–Q5, Q7, Q8 umgesetzt
      (Felder 16 px, „Los geht’s“ → `#wer` + Fokus Namensfeld, Fokus auf Ergebnis/Geheimnis, Feldrand `--field` #998479, Fokus 3 px Grün,
      Fuß-Rechtslinks 44 px, Lupe/Farbkreise 44 px). Q6: ein einheitlicher Werbehinweis (Text aus dem Fuß, mit „Als Amazon-Partner …“) überall. Offen:
      Wichtelgruß 08.11. erledigt: Handy-Leiste `#gr-bar` („Als Bild teilen“ + „Link per WhatsApp“) läuft unten mit, solange die Karte im Bild ist (nicht bei Schritt 3); Anlässe am Handy 2 je Zeile, übrige letzte Kachel volle Breite, Desktop 3 je Zeile; `tests/auslosung-stress.js` veraltet
      – 08.11. angepasst (Ausschlüsse aufklappen, Rückfrage bestätigen), 300 Auslosungen 0 Fehler.
- [x] 08.11.: Erklärungen in zwei Fassungen (Toni freigegeben): `ERKL_GROSS` (Was ist Wichteln?) + `ERKL_KIND` (Was ist ein Wichtel?, zum
      Vorlesen, nach dem Kindervideo – keine Sagen) mit Links auf eigene Video-Seiten (kein YouTube), Baustein `erkl_box(art, titel, link)`.
      Eingebaut: Startseiten-FAQ „Was ist Wichteln?“, /woher-kommt-wichteln/ (Kinderkasten), /onni-adventskalender/ (unter dem Kindervideo +
      „Für die Großen“), /wichteltuer/ (nach „Was ist eine Wichteltür?“), /wichteln-schule-kita/ (beide Kästen vor dem Ablauf).
- [ ] Später: AdSense (braucht zertifizierten Einwilligungs-Banner, Werbeflächen `.ad-slot` in `style.css` einblenden),
      Wunschliste (braucht Server), digitaler Adventskalender als zweites Tool

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
