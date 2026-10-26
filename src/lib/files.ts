import { fileName, rhythmToFile } from './exchange'
import type { Rhythm } from './types'

export function downloadRhythm(rhythm: Rhythm) {
  const blob = new Blob([JSON.stringify(rhythmToFile(rhythm), null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = fileName(rhythm)
  a.click()
  URL.revokeObjectURL(a.href)
}

/** Öffnet den Dateidialog und liefert den Text der gewählten Datei. */
export function pickTextFile(accept = '.json,application/json'): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = async () => resolve((await input.files?.[0]?.text()) ?? null)
    input.oncancel = () => resolve(null)
    input.click()
  })
}
