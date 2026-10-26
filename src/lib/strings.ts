type Color = 'green' | 'yellow' | 'orange' | 'pink' | 'purple' | 'blue' | 'teal'
export type Mood = 'happy' | 'wink' | 'blow'

interface IntroSlide {
  /** Entweder Apito in einer Stimmung oder ein Emoji. */
  mascot?: Mood
  emoji?: string
  color: Color
  title: string
  text: string
  steps?: { color: Color; text: string }[]
}

/** Alle Oberflächentexte an einer Stelle, damit später übersetzt werden kann. */
export const t = {
  appName: 'Apito',
  tagline: 'Dein digitaler Anpfeifer – zum Üben zu Hause, ganz ohne Band.',
  help: 'Einführung',
  back: 'Zurück',
  next: 'Weiter',

  intro: [
    {
      mascot: 'happy',
      color: 'pink',
      title: 'Oi! Ich bin Apito.',
      text: 'Dein digitaler Anpfeifer zum Üben zu Hause – ganz ohne Band. Ich gebe dir den Takt und pfeife dir zufällig Breaks an, wie dein Mestre. Du übst, auf mein Signal zu reagieren.',
    },
    {
      emoji: '🎶',
      color: 'orange',
      title: 'Deine Rhythmen',
      text: 'Leg für jeden Rhythmus ein eigenes Projekt an: Samba Reggae, Ijexá, Cimbalada … Jeder hat seine Taktart, sein Zieltempo und seine eigenen Breaks.',
    },
    {
      emoji: '✏️',
      color: 'green',
      title: 'Breaks einprogrammieren',
      text: 'Gib jedem Break einen Namen und sag, auf welchem Schlag eingezählt wird, wie viele Zählschläge es gibt und wie lang der Break ist. Mit ▶ hörst du ihn probe.',
    },
    {
      mascot: 'blow',
      color: 'purple',
      title: 'So läuft das Training',
      text: 'Du spielst zum Klick. Irgendwann pfeife ich einen Break an:',
      steps: [
        { color: 'yellow', text: 'Doppelpfiff – der Name des Breaks erscheint groß' },
        { color: 'orange', text: 'Einzählen mit Pfiffen: 1 – 2 – 3 – 4' },
        { color: 'blue', text: 'Break mit anderem Klick' },
        { color: 'green', text: 'Zurück in den Groove' },
      ],
    },
    {
      mascot: 'wink',
      color: 'teal',
      title: 'Tempo & Teilen',
      text: 'Fang langsam an und steigere dich: Dein letztes Tempo bleibt gespeichert, das Zieltempo steht immer daneben. Rhythmen kannst du als Datei exportieren und an deine Band schicken.',
    },
  ] satisfies IntroSlide[] as IntroSlide[],
  introSkip: 'Überspringen',
  introDone: 'Bora! Los geht’s!',

  overviewTitle: 'Deine Rhythmen',
  newRhythm: 'Neuer Rhythmus',
  emptyTitle: 'Noch keine Rhythmen',
  emptyBubble: 'Leg los – ich pfeif dir was!',
  emptyText: 'Leg deinen ersten Rhythmus an und programmiere die Breaks ein, die du üben willst.',
  createFirst: 'Ersten Rhythmus anlegen',
  tryExample: 'Beispiel ausprobieren',
  importRhythm: 'Rhythmus importieren',
  rhythmMeta: (bpb: number, tempo: number, breaks: number) =>
    `${bpb} Schläge pro Takt · Ziel ${tempo} BPM · ${breaks === 1 ? '1 Break' : `${breaks} Breaks`}`,

  newRhythmTitle: 'Neuer Rhythmus',
  rhythmName: 'Name',
  rhythmNamePlaceholder: 'z. B. Samba Reggae',
  beatsPerBar: 'Schläge pro Takt',
  beatsPerBarHint: '4 für die meisten Samba-Rhythmen, 2 für einen Sechsachtel.',
  create: 'Anlegen',
  notFound: 'Diesen Rhythmus gibt es nicht mehr.',
  toOverview: 'Zur Übersicht',

  tabTraining: 'Training',
  tabBreaks: 'Breaks',
  tabSettings: 'Einstellungen',

  start: 'Start',
  stop: 'Stopp',
  bpm: 'BPM',
  targetTempo: 'Zieltempo',
  jumpToTarget: 'Aufs Zieltempo springen',
  tempo: 'Tempo',
  activeBreaks: (n: number) => (n === 1 ? '1 aktiver Break' : `${n} aktive Breaks`),
  gapInfo: (n: number) => `ca. alle ${n} Takte`,
  noBreaksYet: 'Noch keine Breaks – leg zuerst welche an, sonst läuft nur der Groove.',
  noActiveBreaks: 'Keine aktiven Breaks – es läuft nur der Groove.',
  addBreaks: 'Breaks anlegen',
  bar: 'Takt',
  getReady: 'Gleich geht’s los',

  avgGap: 'Abstand zwischen Breaks (ca. Takte)',
  avgGapHint: (min: number) => `Gemessen vom Ende eines Breaks bis zum Start des nächsten, mindestens ${min}.`,
  leadBars: 'Vorlauf nach dem Doppelpfiff (Takte)',
  leadBarsHint: 'Gilt für alle Rhythmen.',
  breaks: 'Breaks',
  breaksEmpty: 'Noch keine Breaks. Leg deinen ersten an!',
  newBreak: 'Neuer Break',
  edit: 'Bearbeiten',
  preview: 'Probehören',
  delete: 'Löschen',
  confirmDelete: (name: string) => `„${name}“ wirklich löschen?`,
  breakSummary: (start: number, count: number, length: number) =>
    `Einzählen ab Schlag ${start} · ${count} Zählschläge · ${length} Schläge lang`,
  active: 'aktiv',

  editorTitleNew: 'Neuer Break',
  editorTitleEdit: 'Break bearbeiten',
  name: 'Name',
  countStartBeat: 'Einzählung beginnt auf Schlag',
  countBeats: 'Anzahl Zählschläge',
  lengthBeats: 'Länge des Breaks (Schläge)',
  lengthHint: (bpb: number, beats: number) => {
    const bars = beats / bpb
    return Number.isInteger(bars) ? `= ${bars} ${bars === 1 ? 'Takt' : 'Takte'}` : `= ${bars.toFixed(2).replace('.', ',')} Takte`
  },
  save: 'Speichern',
  cancel: 'Abbrechen',

  exchange: 'Teilen & Sichern',
  exportFile: 'Als Datei exportieren',
  duplicate: 'Duplizieren',
  copySuffix: '(Kopie)',
  deleteRhythm: 'Rhythmus löschen',
  importDone: (name: string) => `„${name}“ importiert.`,
  importFailed: 'Die Datei konnte nicht gelesen werden.',
}
