# Samba-Trainer – Idee

Stand: 2026-10-25 · Status: gegrillt, V1 in Umsetzung

## Grundprinzip

Ein modifiziertes Metronom zum Üben von Breaks in Samba-Rhythmen.
Das Metronom gibt den Grundtakt vor (z. B. 120 BPM). Zwischendurch
zählt die App vorher hinterlegte Breaks an, der Spieler spielt den
Break, danach geht es im Groove weiter.

## V1 – Metronom mit Breaks

### Breaks hinterlegen

Ein Break wird vorab vom Nutzer selbst angelegt und hat:

- **Name** – wird beim Einzählen angesagt bzw. angezeigt (z. B. „Break 1“)
- **Einzählung** – wie und wo eingezählt wird, z. B. am Taktanfang oder
  ab der Taktmitte („1, 2, 3, 4“)
- **Start** – wo der Break nach der Einzählung beginnt
- **Länge** – wie lange der Break dauert

### Ablauf

1. Metronom läuft im Groove (normaler Klick), z. B. ein Takt.
2. Die App wählt **zufällig** einen der hinterlegten Breaks aus.
3. Im nächsten Takt wird der Break eingezählt
   („Break 1 … 1, 2, 3, 4“).
4. Während des Breaks läuft ein **hörbar anderer Metronom-Klick**,
   damit klar ist: jetzt ist Break.
5. Nach dem Break zurück in den normalen Groove-Klick, dann nächster Break.

Reihenfolge der Breaks in V1: nur zufällig (vordefinierte Reihenfolge
wurde kurz erwogen, aber verworfen).

## V2 – Mehrere Rhythmen

Man kann mehrere **Rhythmen** speichern, z. B. Samba Reggae, Samba
Afro, Ijexá, Mali, Cimbalada.

Ein Rhythmus besteht aus:

- **Taktart**
- **Default-Tempo** – das Tempo ist beim Üben jederzeit änderbar,
  der Default ist nur der Startwert
- **Satz an Breaks** – eigene Breaks pro Rhythmus

Mehr nicht.

## V3+ – Zukunftsmusik

- **Playbacks**: Aufnahmen der ganzen Band hinterlegen; das Instrument,
  das gerade geübt wird, wird ausgeblendet (Play-along / Minus-One).
- Wirft **Copyright-Fragen** auf → bewusst ausgeklammert.

## Abgrenzung für V1/V2

Keine fremden Inhalte. Alles, was in der App ist – Rhythmen und
Breaks – legt der Nutzer selbst an und programmiert es selbst ein.
Damit sind Urheberrechtsfragen für die ersten Versionen umgangen.

## Entscheidungen (Grilling)

### Runde 1

- **Plattform**: installierbare Web-App oder native App – noch offen (Runde 2).
- **Nutzer**: auch für andere gedacht, aber **kein eigenes Backend**. Alles läuft
  lokal auf dem Gerät.
- **Taktart V1**: fest 4/4, intern aber schon „Schläge pro Takt“ gespeichert.
- **Break-Modell**: Startschlag der Einzählung im Takt + Anzahl Zählschläge +
  Länge in ganzen Schlägen. Keine Achtel/Sechzehntel-Auflösung vorerst.
- **Ansage & Einzählung** (mit Samba-Pfeife statt Sprache):
  1. Ein Pfiff holt die Aufmerksamkeit aufs Display.
  2. Name des Breaks wird fullscreen angezeigt.
  3. Nach ca. 2 Takten zählt die App ein: Display zeigt 1 – 2 – 3 – 4, dazu
     auf jedem Zählschlag ein Pfiff über dem Metronom.
- **Abstand zwischen Breaks**: Nutzer gibt einen Circa-Wert ein („ca. alle
  10 Takte“), der tatsächliche Abstand wird über eine Normalverteilung gewürfelt.
- **Klick im Break**: nur andere Klangfarbe, kein Break-Muster. Muster erst mit
  Playback.
- **Wiederholung**: derselbe Break darf direkt wieder kommen – reines Training.

### Runde 2

- **Plattform**: installierbare Web-App (PWA), statisch gehostet auf GitHub Pages.
  Kein Backend, läuft nach Installation offline.
- **Stack**: TypeScript + Vite + Svelte, Speicherung lokal im Browser
  (keine Präferenz des Nutzers, Svelte gesetzt).
- **Einzählung**: ein Pfiff pro Zählschlag.
- **Aufmerksamkeits-Signal**: Doppelpfiff („Pfiff-Pfiff“), separat aufgenommen.
  Danach 2 Takte Vorlauf bis zur Einzählung (global einstellbar).
- **Circa-Abstand** misst vom **Ende des letzten Breaks bis zum Start des
  nächsten** (weil manche Breaks sehr lang sind). Normalverteilung, Streuung fix
  ca. 25 % des Mittelwerts, nach unten begrenzt, sodass Ankündigung + Vorlauf +
  Einzählung hineinpassen.
- **Break-Ende**: kein Extra-Signal, direkt zurück zum Groove-Klick.
- **Display**: Groove → aktueller Schlag, Tempo, großer Start/Stopp.
  Ankündigung → Break-Name fullscreen. Einzählung → große Zahlen.
  Break → Name + Fortschrittsbalken. Bildschirm bleibt an (Wake Lock).
- **Tempo**: live änderbar (Schieberegler, Plus/Minus), greift ab nächstem Schlag.
- **Session**: endlos bis Stopp.
- **Sounds**: Pfiffe und Klicks nimmt der Nutzer selbst auf (keine Lizenzfragen).

### Runde 3

- **Doppelpfiff-Position**: zufällig innerhalb des Taktes, der 3 Takte vor dem
  Einzähltakt liegt (Antwort: „random in Takt start −3“ – Deutung in Runde 4
  bestätigen).
- **Break-Start**: direkt nach dem letzten Zählschlag (reicht für V1).
- **Anzeige beim Einzählen**: immer die Nummer des Zählschlags (1–2–3–4),
  nicht die Position im Takt.
- **Taktraster** läuft durch; endet ein Break mitten im Takt, setzt der Groove
  dort ein.
- **Sounds** (fest eingebaut, selbst aufgenommen): Groove-Klick,
  betonter Groove-Klick (Eins), Break-Klick, Zählpfiff, Doppelpfiff.
- **Break-Editor**: Formular (Name, Startschlag 1–4, Zählschläge Standard 4,
  Länge in Schlägen) + Probehören-Knopf.
- **Aktiv/Inaktiv**: Häkchen pro Break, gewürfelt wird nur aus aktiven.
- **Erster Break**: gleiche Verteilung, gemessen ab Start.
- **Teilen**: Export/Import als Datei schon in V1 (auch Backup).
- **Sprache**: Deutsch, Texte zentral für spätere Übersetzung.

### Runde 4

- **Doppelpfiff** (bestätigt): zufälliger Schlag im Takt, der 3 Takte vor dem
  Einzähltakt liegt; danach 2 volle Takte Vorlauf, dann Einzählung auf dem
  Startschlag. Man soll sich nicht auf die Eins verlassen können.
- **Mindestabstand**: 4 Takte zwischen Break-Ende und nächstem Break-Start,
  beim Würfeln (Anheben auf Minimum) und bei der Eingabe des Circa-Werts.
- **Datenmodell**: Rhythmen schon ab V1; V1 hat genau einen unsichtbaren Rhythmus.
- **Taktart V2**: nur Schläge pro Takt, BPM bezieht sich auf diese Schläge,
  keine Unterteilung. Startschlag im Editor 1 … Schläge pro Takt.
- **Break ↔ Rhythmus**: jeder Break gehört zu genau einem Rhythmus,
  Kopierfunktion für ähnliche Breaks.
- **Circa-Abstand**: pro Rhythmus gespeichert.
- **Tempo**: das zuletzt verwendete Tempo bleibt pro Rhythmus gespeichert
  (direkt weiterüben). Das Default-Tempo wird immer daneben angezeigt, als
  **Zieltempo**, auf das man hinarbeitet.
- **Export V2**: eine Datei pro Rhythmus inkl. Breaks, plus Gesamt-Export als
  Backup.
- **Start**: die App zählt einmal ein, bevor der Groove beginnt.

### Runde 5

- **Start-Einzählung**: ein Takt, Zählpfiff auf jedem Schlag, große Zahlen
  1–2–3–4, dann Groove auf der Eins. Kein Doppelpfiff, keine Ansage.
- **Erster Break**: Abstand gemessen ab der ersten Eins im Groove.
- **Zieltempo**: heißt überall so (statt Default-Tempo). Tipp auf die Anzeige
  springt direkt aufs Zieltempo.
- **Projekt**: Git lokal jetzt, GitHub-Repo mit dem ersten Code.

### Notiz für V3+ (Playback)

Mit Playback bauen nicht mehr die Schüler die Stücke, sondern der Lehrer, und
gibt sie seinen Schülern frei → braucht eine **Marketplace-/Freigabe-Logik**.


## Nachträge nach V1

- **Startseite = Projektübersicht**: „Projekt“ heißt in der App Rhythmus. Die
  Mehr-Rhythmen-Verwaltung aus V2 ist damit vorgezogen (Anlegen, Duplizieren,
  Löschen, Import als neuer Rhythmus, Export pro Rhythmus).
- **Onboarding**: fünf kurze Folien beim ersten Start, jederzeit über „?“
  erneut aufrufbar.
- **Design**: bunt, Samba-Fest (Bandeirinhas, Pink/Orange/Gelb/Grün/Lila),
  Schrift Baloo 2 lokal eingebunden (offline-fähig).
- **Name & Branding**: Die App heißt **Apito** (die Sambapfeife). Maskottchen ist
  Apito selbst, eine gelbe Pfeife mit Gesicht: „Oi! Ich bin Apito, dein digitaler
  Anpfeifer zum Üben zu Hause – ganz ohne Band.“ Gespeicherte Daten und
  Exportdateien aus der Zeit als Samba-Trainer werden weiter gelesen.
