/** Alle Oberflächentexte an einer Stelle, damit später übersetzt werden kann. */
export const t = {
  appName: 'Samba-Trainer',
  tabTrainer: 'Training',
  tabBreaks: 'Breaks',
  start: 'Start',
  stop: 'Stopp',
  bpm: 'BPM',
  targetTempo: 'Zieltempo',
  jumpToTarget: 'Aufs Zieltempo springen',
  tempo: 'Tempo',
  activeBreaks: (n: number) => (n === 1 ? '1 aktiver Break' : `${n} aktive Breaks`),
  gapInfo: (n: number) => `ca. alle ${n} Takte`,
  noActiveBreaks: 'Keine aktiven Breaks – es läuft nur der Groove.',
  bar: 'Takt',
  getReady: 'Gleich geht’s los',

  rhythmSettings: 'Einstellungen',
  avgGap: 'Abstand zwischen Breaks (ca. Takte)',
  avgGapHint: (min: number) => `Gemessen vom Ende eines Breaks bis zum Start des nächsten, mindestens ${min}.`,
  leadBars: 'Vorlauf nach dem Doppelpfiff (Takte)',
  breaks: 'Breaks',
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
  exportFile: 'Exportieren',
  importFile: 'Importieren',
  importDone: (n: number) => `${n} Breaks importiert.`,
  importFailed: 'Die Datei konnte nicht gelesen werden.',
}
