import type { BeatEvent, Planner } from './planner'
import { loadSounds, type SoundName } from './sounds'

const LOOKAHEAD = 0.12
const TICK_MS = 25

/**
 * Spielt die Schläge eines Planners sample-genau über die Web-Audio-Uhr ab
 * und meldet jeden Schlag in dem Moment, in dem er erklingt.
 */
export class Engine {
  private ctx: AudioContext | null = null
  private sounds: Record<SoundName, AudioBuffer> | null = null
  private planner: Planner | null = null
  private nextTime = 0
  private timer = 0
  private frame = 0
  /** Geplante Schläge; `null` markiert das Ende des Probehörens. */
  private queue: { time: number; event: BeatEvent | null }[] = []
  private finished = false

  constructor(
    private readonly getTempo: () => number,
    private readonly onBeat: (event: BeatEvent) => void,
    private readonly onEnd: () => void,
  ) {}

  /** Muss aus einer Nutzeraktion heraus aufgerufen werden (Autoplay-Regeln). */
  async start(planner: Planner) {
    this.stop()
    if (!this.ctx) {
      // iOS: Ton auch bei aktivem Lautlos-Schalter
      const session = (navigator as { audioSession?: { type: string } }).audioSession
      if (session) session.type = 'playback'
      this.ctx = new AudioContext({ latencyHint: 'interactive' })
    }
    await this.ctx.resume()
    this.sounds ??= await loadSounds(this.ctx)

    this.planner = planner
    this.finished = false
    this.queue = []
    this.nextTime = this.ctx.currentTime + 0.1
    this.timer = window.setInterval(() => this.schedule(), TICK_MS)
    this.schedule()
    this.frame = requestAnimationFrame(() => this.dispatch())
  }

  stop() {
    clearInterval(this.timer)
    cancelAnimationFrame(this.frame)
    this.planner = null
    this.queue = []
  }

  private schedule() {
    const ctx = this.ctx!
    while (!this.finished && this.nextTime < ctx.currentTime + LOOKAHEAD) {
      const event = this.planner?.next()
      if (!event) {
        this.finished = true
        this.queue.push({ time: this.nextTime, event: null })
        break
      }
      this.play(event.click, this.nextTime)
      if (event.whistle) this.play(event.whistle === 'count' ? 'count-whistle' : 'double-whistle', this.nextTime)
      this.queue.push({ time: this.nextTime, event })
      this.nextTime += 60 / this.getTempo()
    }
  }

  private dispatch() {
    const now = this.ctx!.currentTime
    while (this.queue.length && this.queue[0].time <= now) {
      const { event } = this.queue.shift()!
      if (!event) {
        this.stop()
        this.onEnd()
        return
      }
      this.onBeat(event)
    }
    this.frame = requestAnimationFrame(() => this.dispatch())
  }

  private play(name: SoundName, time: number) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.sounds![name]
    src.connect(ctx.destination)
    src.start(time)
  }
}
