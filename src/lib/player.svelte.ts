import { Engine } from './engine'
import { Planner, type BeatEvent } from './planner'
import { currentRhythm, data } from './store.svelte'
import { minGapBars, type Break } from './types'

export const player = $state({
  running: false,
  mode: 'train' as 'train' | 'preview',
  event: null as BeatEvent | null,
  /** Zählt Takte seit Start, nur für die Anzeige. */
  bar: 0,
})

const engine = new Engine(
  () => currentRhythm().lastTempo,
  (event) => {
    player.event = event
    if (event.beatInBar === 0 && event.phase !== 'countin') player.bar++
  },
  () => finish(),
)

let wakeLock: WakeLockSentinel | null = null

async function keepScreenOn() {
  try {
    wakeLock = (await navigator.wakeLock?.request('screen')) ?? null
  } catch {
    wakeLock = null
  }
}

document.addEventListener('visibilitychange', () => {
  if (player.running && document.visibilityState === 'visible') keepScreenOn()
})

function begin(mode: 'train' | 'preview', preview?: Break) {
  const rhythm = currentRhythm()
  const planner = new Planner({
    beatsPerBar: rhythm.beatsPerBar,
    leadBars: data.settings.leadBars,
    avgGapBars: rhythm.avgGapBars,
    minGapBars: minGapBars(data.settings),
    breaks: $state.snapshot(rhythm.breaks),
    countIn: true,
    preview: preview && $state.snapshot(preview),
  })
  player.mode = mode
  player.event = null
  player.bar = 0
  player.running = true
  keepScreenOn()
  engine.start(planner)
}

export function startTraining() {
  begin('train')
}

export function previewBreak(item: Break) {
  begin('preview', item)
}

export function stop() {
  engine.stop()
  finish()
}

function finish() {
  player.running = false
  player.event = null
  wakeLock?.release().catch(() => {})
  wakeLock = null
}
