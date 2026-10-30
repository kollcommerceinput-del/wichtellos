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

## Offen

- [x] Amazon-PartnerNet-Konto angelegt, Partner-ID `wichtellos-21` in `assets/site.js` eingetragen (30.10.2026)
- [ ] PartnerNet: Steuer-Interview (USA/Kanada) und Zahlungsempfänger (UG) vervollständigen – nötig vor der ersten Auszahlung
- [x] Livegang und Live-Test (30.10.2026, alle Prüfungen oben grün, damals noch mit SSL)
- [x] Umzug auf GitHub Pages abgeschlossen: DNS, Let's-Encrypt-Zertifikat, Enforce HTTPS an; SFTP-Benutzer bei IONOS gelöscht (30.10.2026)
- [x] Search Console + Bing eingerichtet, Sitemap bei beiden eingereicht (30.10.2026)
- [x] Sitemap in der Search Console erfolgreich gelesen (8 Seiten, 30.10.2026)
- [ ] Rechtstexte (Impressum, Datenschutz) einmal fachlich prüfen lassen
- [ ] Später: AdSense (braucht zertifizierten Einwilligungs-Banner, Werbeflächen `.ad-slot` in `style.css` einblenden),
      Wunschliste (braucht Server), digitaler Adventskalender als zweites Tool

## Regeln

- Keine Zugangsdaten (Passwörter, API-Keys, IONOS-/SFTP-Daten) committen.
- Commit-Nachrichten auf Deutsch, kurz und aussagekräftig; nach jeder Änderung committen und pushen (Branch `main`).
