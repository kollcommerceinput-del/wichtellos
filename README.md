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

## Grafiken und Schriften (Lizenzen)

- `wichtel.svg`, `favicon.svg`, alle Dateien in `grafik/` (Wichtel-Posen, Winterlandschaft, Lichterkette) und die
  Bilder in `marketing/`: eigene Grafiken der KOLL Commerce UG.
- Schrift **Fredoka** (`assets/fonts/fredoka-latin-600-normal.woff2`): SIL Open Font License 1.1,
  © The Fredoka Project Authors – Lizenztext in `assets/fonts/OFL-Fredoka.txt`. Selbst gehostet, kein Google Fonts.
- Kategorie-Symbole im Geschenkfinder sind Emoji des jeweiligen Geräts, keine Bilddateien.

## Veröffentlichen

Jeder Push auf `main` geht über GitHub Pages live (siehe `CLAUDE.md`). Die Amazon-Partner-ID steht nur in `build.py` (`AMAZON_TAG`).
