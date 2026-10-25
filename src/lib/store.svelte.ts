import { loadData, saveData } from './exchange'
import type { Rhythm } from './types'

export const data = $state(loadData())

$effect.root(() => {
  $effect(() => saveData($state.snapshot(data)))
})

/** In V1 gibt es genau einen (unsichtbaren) Rhythmus. */
export function currentRhythm(): Rhythm {
  return data.rhythms.find((r) => r.id === data.currentRhythmId) ?? data.rhythms[0]
}
