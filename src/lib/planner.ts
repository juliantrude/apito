import type { Break } from './types'
import { pick, sampleGapBars, type Rng } from './random'

export type Phase = 'countin' | 'groove' | 'announce' | 'count' | 'break'

export interface BeatEvent {
  /** Globaler Schlagindex ab Start (0-basiert). */
  index: number
  /** Position im Takt (0-basiert). */
  beatInBar: number
  phase: Phase
  click: 'groove' | 'accent' | 'break'
  whistle: 'count' | 'double' | null
  /** Nummer des Zählschlags (1-basiert) bei Einzählung. */
  countNumber?: number
  breakItem?: Break
  /** Fortschritt des Breaks nach diesem Schlag, 0 … 1. */
  breakProgress?: number
}

export interface PlannerOptions {
  beatsPerBar: number
  leadBars: number
  avgGapBars: number
  minGapBars: number
  breaks: Break[]
  rng?: Rng
  /** Einen Takt einzählen, bevor der Groove startet. */
  countIn?: boolean
  /** Probehören: genau dieser Break, kürzester Vorlauf, danach Schluss. */
  preview?: Break
}

interface Plan {
  item: Break
  doubleBeat: number
  countStart: number
  breakStart: number
  breakEnd: number
}

/**
 * Entscheidet Schlag für Schlag, was zu hören und zu sehen ist.
 * Kennt keine Zeit und kein Audio, nur Schläge.
 */
export class Planner {
  private i = 0
  private plan: Plan | null = null
  private endAt = Infinity
  private readonly rng: Rng
  private readonly countInBeats: number

  constructor(private readonly opts: PlannerOptions) {
    this.rng = opts.rng ?? Math.random
    this.countInBeats = opts.countIn && !opts.preview ? opts.beatsPerBar : 0
    this.plan = this.makePlan(this.countInBeats)
  }

  /** Nächster Schlag, oder null wenn das Probehören vorbei ist. */
  next(): BeatEvent | null {
    const i = this.i
    if (i >= this.endAt) return null
    this.i++

    const bpb = this.opts.beatsPerBar
    const beatInBar = i % bpb
    const grooveClick = beatInBar === 0 ? 'accent' : 'groove'
    const base = { index: i, beatInBar }

    if (i < this.countInBeats) {
      return { ...base, phase: 'countin', click: grooveClick, whistle: 'count', countNumber: i + 1 }
    }

    const plan = this.plan
    if (!plan || i < plan.doubleBeat) {
      return { ...base, phase: 'groove', click: grooveClick, whistle: null }
    }
    if (i < plan.countStart) {
      return {
        ...base,
        phase: 'announce',
        click: grooveClick,
        whistle: i === plan.doubleBeat ? 'double' : null,
        breakItem: plan.item,
      }
    }
    if (i < plan.breakStart) {
      return {
        ...base,
        phase: 'count',
        click: grooveClick,
        whistle: 'count',
        countNumber: i - plan.countStart + 1,
        breakItem: plan.item,
      }
    }

    const done = i - plan.breakStart + 1
    if (i === plan.breakEnd - 1) this.finishBreak(plan)
    return {
      ...base,
      phase: 'break',
      click: 'break',
      whistle: null,
      breakItem: plan.item,
      breakProgress: done / plan.item.lengthBeats,
    }
  }

  private finishBreak(plan: Plan) {
    if (this.opts.preview) {
      // Nach dem Break noch bis zum Ende des nächsten Taktes Groove.
      const bpb = this.opts.beatsPerBar
      this.endAt = (Math.floor(plan.breakEnd / bpb) + 1) * bpb
      this.plan = null
    } else {
      this.plan = this.makePlan(plan.breakEnd)
    }
  }

  /** Plant den nächsten Break, der frühestens `ref` (erster Groove-Schlag) beginnt. */
  private makePlan(ref: number): Plan | null {
    const { beatsPerBar: bpb, leadBars, preview } = this.opts
    const candidates = preview ? [preview] : this.opts.breaks.filter((b) => b.active)
    if (candidates.length === 0) return null

    const item = pick(candidates, this.rng)
    const gapBars = preview
      ? this.opts.minGapBars
      : sampleGapBars(this.opts.avgGapBars, this.opts.minGapBars, this.rng)

    const startOffset = Math.min(Math.max(item.countStartBeat, 1), bpb) - 1
    const target = ref + gapBars * bpb
    const earliestCountBar = Math.ceil(ref / bpb) + leadBars + 1
    const countBar = Math.max(earliestCountBar, Math.round((target - startOffset - item.countBeats) / bpb))

    const doubleBar = countBar - leadBars - 1
    const doubleBeat = doubleBar * bpb + Math.floor(this.rng() * bpb)
    const countStart = countBar * bpb + startOffset
    const breakStart = countStart + item.countBeats
    return { item, doubleBeat, countStart, breakStart, breakEnd: breakStart + item.lengthBeats }
  }
}
