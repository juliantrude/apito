export interface Break {
  id: string
  name: string
  /** Schlag im Takt, auf dem die Einzählung beginnt (1-basiert). */
  countStartBeat: number
  /** Anzahl Zählschläge (je ein Pfiff). */
  countBeats: number
  /** Länge des Breaks in Schlägen. */
  lengthBeats: number
  active: boolean
}

export interface Rhythm {
  id: string
  name: string
  beatsPerBar: number
  targetTempo: number
  /** Zuletzt verwendetes Tempo, damit man direkt weiterüben kann. */
  lastTempo: number
  /** Circa-Abstand in Takten vom Ende eines Breaks bis zum Start des nächsten. */
  avgGapBars: number
  breaks: Break[]
}

export interface Settings {
  /** Volle Takte zwischen Doppelpfiff-Takt und Einzähltakt. */
  leadBars: number
}

export interface AppData {
  version: 1
  settings: Settings
  rhythms: Rhythm[]
  currentRhythmId: string
}

export const TEMPO_MIN = 40
export const TEMPO_MAX = 240

/** Kleinster Abstand: Doppelpfiff-Takt + Vorlauf + Einzähltakt. */
export function minGapBars(settings: Settings): number {
  return settings.leadBars + 2
}
