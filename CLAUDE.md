# WichtelLos – Projektkontext

Statische Website **wichtellos.de**: Wichteln online auslosen (kostenlos, ohne Anmeldung, ohne Server) plus
Ratgeber-Seiten mit Amazon-Partnerlinks. Betreiber: KOLL Commerce UG (haftungsbeschränkt), Geschäftsführer Antonio Koll.

**Eigenständiges Projekt – nie mit dem Shop-Repo `kollstore` oder dem Shop kollcommerce.de vermischen.**
Antworten auf Deutsch.

## Aufbau

- `tool.html` – Startseite mit dem Auslosungs-Tool (Vorlage, Kopf/Fuß werden beim Bauen eingesetzt)
- `build.py` – baut alle Seiten nach `website/`; Inhalte der Ratgeber-Seiten, Impressum und Datenschutz stehen hier
- `assets/style.css`, `assets/site.js` – gemeinsames CSS; in `site.js` steht oben die Amazon-Partner-ID (`AMAZON_TAG`)
- `render-images.js` – erzeugt `og-image.png` und `apple-touch-icon.png` aus `favicon.svg` und `wichtel.svg`
- `website/` – **generiert**, nie von Hand bearbeiten. Nach jeder Änderung: `python3 build.py website`
- `tests/` – Playwright-Tests (Server vorher starten: `cd website && python3 -m http.server 8766`)

## Wie das Tool funktioniert

Die Auslosung läuft komplett im Browser. Jeder Teilnehmer bekommt einen Link `https://wichtellos.de/#w=…`;
die Zuteilung steckt codiert (nicht verschlüsselt) im Teil nach `#` und wird nie an den Server geschickt.
Entwurf und letzte Links liegen nur im localStorage. Diese Zusagen stehen so auch in Datenschutz und FAQ –
wer Analyse, AdSense o. Ä. einbaut, muss Datenschutzerklärung, FAQ-Texte und Einwilligungs-Banner anpassen.

## Hosting und Deploy (IONOS)

- Domain `wichtellos.de` bei IONOS, Ziel: **eigener Ordner `/wichtellos`** im Webspace – nie der Shop-Ordner.
- Upload: den **Inhalt** von `website/` in diesen Ordner (SFTP/WinSCP). Auch die versteckte Datei `.htaccess`
  mit hochladen (WinSCP zeigt versteckte Dateien erst nach Einstellung „Versteckte Dateien anzeigen“).
- SSL-Zertifikat für die Domain in IONOS aktivieren. Eine Weiterleitung http→https / www→ohne www ist noch
  nicht eingerichtet – erst live prüfen, wie IONOS sich verhält, dann ggf. in `.htaccess` (über `build.py`) ergänzen.
- Nach dem Upload live prüfen: Startseite, Auslosung bis zum geheimen Link, alle Ratgeber-Seiten,
  `/gibt-es-nicht/` muss die eigene 404-Seite zeigen, `/sitemap.xml`, `/robots.txt`, Vorschaubild beim Teilen in WhatsApp.
- Danach Domain in der Google Search Console anmelden und `https://wichtellos.de/sitemap.xml` einreichen.

## Offen

- [x] Amazon-PartnerNet-Konto angelegt, Partner-ID `wichtellos-21` in `assets/site.js` eingetragen (30.10.2026)
- [ ] PartnerNet: Steuer-Interview (USA/Kanada) und Zahlungsempfänger (UG) vervollständigen – nötig vor der ersten Auszahlung
- [ ] Livegang (siehe oben) und Live-Test
- [ ] Rechtstexte (Impressum, Datenschutz) einmal fachlich prüfen lassen
- [ ] Später: AdSense (braucht zertifizierten Einwilligungs-Banner, Werbeflächen `.ad-slot` in `style.css` einblenden),
      Wunschliste (braucht Server), digitaler Adventskalender als zweites Tool

## Regeln

- Keine Zugangsdaten (Passwörter, API-Keys, IONOS-/SFTP-Daten) committen.
- Commit-Nachrichten auf Deutsch, kurz und aussagekräftig; nach jeder Änderung committen und pushen (Branch `main`).
