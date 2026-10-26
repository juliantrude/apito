import type { AppData, Break, Rhythm } from './types'
import { TEMPO_MAX, TEMPO_MIN } from './types'

const STORAGE_KEY = 'apito'
/** Schlüssel aus der Zeit vor der Umbenennung, wird einmalig übernommen. */
const LEGACY_STORAGE_KEY = 'samba-trainer'

export function newId(): string {
  // randomUUID fehlt ohne HTTPS, z. B. beim Testen über die LAN-Adresse
  return crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function newRhythm(over: Partial<Rhythm> = {}): Rhythm {
  const targetTempo = over.targetTempo ?? 120
  return {
    id: newId(),
    name: 'Neuer Rhythmus',
    beatsPerBar: 4,
    targetTempo,
    lastTempo: targetTempo,
    avgGapBars: 10,
    breaks: [],
    ...over,
  }
}

/** Beispiel zum Ausprobieren, wird nur auf Wunsch angelegt. */
export function exampleRhythm(): Rhythm {
  return newRhythm({
    name: 'Samba Reggae (Beispiel)',
    targetTempo: 100,
    lastTempo: 90,
    breaks: [
      { id: newId(), name: 'Break 1', countStartBeat: 1, countBeats: 4, lengthBeats: 8, active: true },
      { id: newId(), name: 'Break 2', countStartBeat: 3, countBeats: 4, lengthBeats: 4, active: true },
    ],
  })
}

export function defaultData(): AppData {
  return { version: 1, settings: { leadBars: 2, onboarded: false }, rhythms: [], currentRhythmId: null }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY)
    if (raw) return parseData(JSON.parse(raw))
  } catch {
    // kaputte oder fehlende Daten → Standard
  }
  return defaultData()
}

export function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Speicher voll oder gesperrt: Export bleibt als Backup
  }
}

function int(value: unknown, min: number, max: number, fallback: number): number {
  const n = Math.round(Number(value))
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

export function parseBreak(raw: unknown, beatsPerBar: number): Break {
  const b = (raw ?? {}) as Record<string, unknown>
  return {
    id: typeof b.id === 'string' ? b.id : newId(),
    name: typeof b.name === 'string' && b.name.trim() ? b.name.trim() : 'Break',
    countStartBeat: int(b.countStartBeat, 1, beatsPerBar, 1),
    countBeats: int(b.countBeats, 1, 16, 4),
    lengthBeats: int(b.lengthBeats, 1, 256, 8),
    active: b.active !== false,
  }
}

export function parseRhythm(raw: unknown): Rhythm {
  const r = (raw ?? {}) as Record<string, unknown>
  const beatsPerBar = int(r.beatsPerBar, 1, 16, 4)
  const targetTempo = int(r.targetTempo, TEMPO_MIN, TEMPO_MAX, 120)
  return {
    id: typeof r.id === 'string' ? r.id : newId(),
    name: typeof r.name === 'string' && r.name.trim() ? r.name.trim() : 'Rhythmus',
    beatsPerBar,
    targetTempo,
    lastTempo: int(r.lastTempo, TEMPO_MIN, TEMPO_MAX, targetTempo),
    avgGapBars: int(r.avgGapBars, 1, 999, 10),
    breaks: Array.isArray(r.breaks) ? r.breaks.map((b) => parseBreak(b, beatsPerBar)) : [],
  }
}

export function parseData(raw: unknown): AppData {
  const d = (raw ?? {}) as Record<string, unknown>
  const rhythms = Array.isArray(d.rhythms) ? d.rhythms.map(parseRhythm) : []
  const settings = (d.settings ?? {}) as Record<string, unknown>
  return {
    version: 1,
    settings: { leadBars: int(settings.leadBars, 0, 8, 2), onboarded: settings.onboarded === true },
    rhythms,
    currentRhythmId: rhythms.find((r) => r.id === d.currentRhythmId)?.id ?? null,
  }
}

/** Austauschformat: eine Datei pro Rhythmus inklusive Breaks. */
export interface RhythmFile {
  app: 'apito'
  version: 1
  rhythm: Rhythm
}

export function rhythmToFile(rhythm: Rhythm): RhythmFile {
  return { app: 'apito', version: 1, rhythm }
}

export function rhythmFromFile(text: string): Rhythm {
  const parsed = JSON.parse(text) as { app?: string; rhythm?: unknown }
  if ((parsed?.app !== 'apito' && parsed?.app !== 'samba-trainer') || !parsed.rhythm) throw new Error('Keine Apito-Datei')
  return parseRhythm(parsed.rhythm)
}

export function fileName(rhythm: Rhythm): string {
  const slug = rhythm.name.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-|-$/g, '')
  return `${slug || 'rhythmus'}.apito.json`
}
