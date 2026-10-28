import type { Browser } from './platform'

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

export type InstallIcon = 'share' | 'dots' | 'menu' | 'add' | 'check'

interface InstallGuide {
  steps: { icon: InstallIcon; text: string }[]
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

  install: {
    title: 'Hol mich aufs Handy!',
    text: 'Ich laufe nur als App – dafür bin ich mit einem Tipp da, im Vollbild und auch ohne Internet.',
    button: 'Jetzt installieren',
    manual: 'So geht’s:',
    manualAlt: 'Oder von Hand:',
    outro: 'Danach öffnest du Apito über das neue Symbol auf deinem Startbildschirm.',
    doneTitle: 'Geschafft!',
    doneText: 'Öffne Apito jetzt über das neue Symbol auf deinem Startbildschirm.',
    guides: {
      'ios-safari': {
        steps: [
          { icon: 'share', text: 'Tippe unten auf das Teilen-Symbol. Siehst du es nicht, tippe erst auf •••.' },
          { icon: 'add', text: 'Wähle „Zum Home-Bildschirm“ – eventuell etwas nach unten scrollen.' },
          { icon: 'check', text: 'Tippe oben rechts auf „Hinzufügen“.' },
        ],
      },
      'ios-chrome': {
        steps: [
          { icon: 'share', text: 'Tippe oben rechts in der Adressleiste auf das Teilen-Symbol.' },
          { icon: 'add', text: 'Wähle „Zum Home-Bildschirm“ – eventuell unter „Mehr“.' },
          { icon: 'check', text: 'Tippe auf „Hinzufügen“.' },
        ],
      },
      'ios-firefox': {
        steps: [
          { icon: 'menu', text: 'Tippe unten rechts auf das Menü ☰.' },
          { icon: 'share', text: 'Wähle „Teilen“.' },
          { icon: 'add', text: 'Wähle „Zum Home-Bildschirm“ und tippe auf „Hinzufügen“.' },
        ],
      },
      'ios-other': {
        steps: [
          { icon: 'share', text: 'Öffne die Seite in Safari und tippe auf das Teilen-Symbol.' },
          { icon: 'add', text: 'Wähle „Zum Home-Bildschirm“ und tippe auf „Hinzufügen“.' },
        ],
      },
      'android-chrome': {
        steps: [
          { icon: 'dots', text: 'Tippe oben rechts auf das Menü ⋮.' },
          { icon: 'add', text: 'Wähle „Zum Startbildschirm hinzufügen“ oder „App installieren“.' },
          { icon: 'check', text: 'Bestätige mit „Installieren“.' },
        ],
      },
      'android-firefox': {
        steps: [
          { icon: 'dots', text: 'Tippe auf das Menü ⋮ (oben oder unten rechts).' },
          { icon: 'add', text: 'Wähle „Zum Startbildschirm hinzufügen“ – je nach Version auch „Installieren“.' },
          { icon: 'check', text: 'Bestätige mit „Hinzufügen“.' },
        ],
      },
      'android-samsung': {
        steps: [
          { icon: 'menu', text: 'Tippe unten rechts auf das Menü ☰.' },
          { icon: 'add', text: 'Wähle „Seite hinzufügen zu“ und dann „Startbildschirm“.' },
          { icon: 'check', text: 'Bestätige mit „Hinzufügen“.' },
        ],
      },
      'android-other': {
        steps: [
          { icon: 'dots', text: 'Öffne das Menü deines Browsers.' },
          { icon: 'add', text: 'Wähle „Zum Startbildschirm hinzufügen“ oder „App installieren“.' },
        ],
      },
    } satisfies Record<Exclude<Browser, 'desktop'>, InstallGuide> as Record<Exclude<Browser, 'desktop'>, InstallGuide>,
  },

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
