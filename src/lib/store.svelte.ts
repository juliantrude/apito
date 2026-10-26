import { loadData, saveData } from './exchange'
import type { Rhythm } from './types'

export const data = $state(loadData())

$effect.root(() => {
  $effect(() => saveData($state.snapshot(data)))
})

/** Der gerade geöffnete Rhythmus, falls einer offen ist. */
export function currentRhythm(): Rhythm | undefined {
  return data.rhythms.find((r) => r.id === data.currentRhythmId)
}

export function findRhythm(id: string): Rhythm | undefined {
  return data.rhythms.find((r) => r.id === id)
}

/** Taktart ändern und Einzähl-Startschläge der Breaks mitziehen. */
export function setBeatsPerBar(rhythm: Rhythm, beatsPerBar: number) {
  rhythm.beatsPerBar = beatsPerBar
  for (const b of rhythm.breaks) b.countStartBeat = Math.min(b.countStartBeat, beatsPerBar)
}
