# WichtelLos

Statische Seite für **wichtellos.de**: Wichteln online auslosen – kostenlos, ohne Anmeldung, ohne Server.
Dazu Ratgeber-Seiten (Geschenkideen nach Budget, Wichteln mit Würfeln, Schrottwichteln) mit Amazon-Partnerlinks.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `website/` | **Fertige Seite** – dieser Ordnerinhalt kommt auf den Webspace (IONOS, Ordner `/wichtellos`) |
| `tool.html` | Vorlage der Startseite mit dem Auslosungs-Tool |
| `build.py` | Baut alle Seiten nach `website/` (Inhalte der Ratgeber-Seiten stehen hier) |
| `assets/` | Gemeinsames CSS und `site.js` (Amazon-Partner-ID) |
| `render-images.js` | Erzeugt `og-image.png` und `apple-touch-icon.png` (Playwright) |
| `tests/` | Browser-Tests (Playwright) |

## Neu bauen

```bash
python3 build.py website
```

Bilder neu erzeugen (nur bei Änderungen an Logo oder Wichtel):

```bash
node render-images.js .
```

## Testen

```bash
cd website && python3 -m http.server 8766
```

In einem zweiten Terminal:

```bash
node tests/site-check.js /tmp
```

```bash
node tests/auslosung-stress.js
```

## Vor dem Livegang

1. Amazon-Partner-ID in `assets/site.js` bei `AMAZON_TAG` eintragen, neu bauen.
2. Impressum und Datenschutz: Platzhalter in `build.py` (Funktion `legal_pages`) ausfüllen, Entwurf-Hinweis entfernen, neu bauen.
3. Platzhalter „Anzeige“ entfernen oder durch AdSense ersetzen.
4. `website/` per WinSCP hochladen, SSL in IONOS aktivieren, Sitemap in der Google Search Console einreichen.
