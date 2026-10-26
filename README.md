# Apito

Dein digitaler Anpfeifer: ein Metronom, das zufällig Samba-Breaks ankündigt
und einzählt – zum Üben zu Hause, ganz ohne Band.
Installierbare Web-App, läuft komplett lokal im Browser. Idee und Entscheidungen:
[IDEA.md](IDEA.md).

## Entwickeln

```sh
npm install
npm run dev      # Entwicklungsserver
npm test         # Tests der Planungslogik und des Dateiformats
npm run check    # Typprüfung
npm run build    # statische Dateien nach dist/
```

## Aufbau

| Datei                        | Aufgabe                                                   |
| ---------------------------- | --------------------------------------------------------- |
| `src/lib/planner.ts`         | Entscheidet Schlag für Schlag, was passiert (rein, getestet) |
| `src/lib/engine.ts`          | Spielt die Schläge sample-genau über Web Audio ab         |
| `src/lib/sounds.ts`          | Lädt Aufnahmen, sonst synthetische Platzhalter            |
| `src/lib/exchange.ts`        | Speichern, Laden, Export/Import, Validierung              |
| `src/lib/player.svelte.ts`   | Verbindet Planner, Engine, Wake Lock und Oberfläche       |
| `src/lib/strings.ts`         | Alle Oberflächentexte                                     |
| `public/sounds/`             | Eigene Aufnahmen (siehe README dort)                      |

## Veröffentlichen

Push auf `main` baut und veröffentlicht über GitHub Actions auf GitHub Pages
(in den Repo-Einstellungen unter „Pages“ als Quelle „GitHub Actions“ wählen).
