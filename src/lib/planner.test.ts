import { describe, expect, it } from 'vitest'
import { Planner, type BeatEvent, type PlannerOptions } from './planner'
import { sampleGapBars, type Rng } from './random'
import type { Break } from './types'

function seeded(seed = 1): Rng {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function brk(over: Partial<Break> = {}): Break {
  return { id: 'b', name: 'Break 1', countStartBeat: 1, countBeats: 4, lengthBeats: 8, active: true, ...over }
}

function opts(over: Partial<PlannerOptions> = {}): PlannerOptions {
  return {
    beatsPerBar: 4,
    leadBars: 2,
    avgGapBars: 10,
    minGapBars: 4,
    breaks: [brk()],
    rng: seeded(),
    countIn: true,
    ...over,
  }
}

function take(p: Planner, n: number): BeatEvent[] {
  const out: BeatEvent[] = []
  for (let k = 0; k < n; k++) {
    const e = p.next()
    if (!e) break
    out.push(e)
  }
  return out
}

/** Zerlegt die Schlagfolge in Breaks mit ihren Eckpunkten. */
function cycles(events: BeatEvent[]) {
  const result: { double: number; countStart: number; breakStart: number; breakEnd: number }[] = []
  let cur: Partial<(typeof result)[number]> = {}
  for (const e of events) {
    if (e.whistle === 'double') cur = { double: e.index }
    if (e.phase === 'count' && e.countNumber === 1) cur.countStart = e.index
    if (e.phase === 'break' && cur.breakStart === undefined) cur.breakStart = e.index
    if (e.phase === 'break' && e.breakProgress === 1) {
      cur.breakEnd = e.index + 1
      result.push(cur as (typeof result)[number])
      cur = {}
    }
  }
  return result
}

describe('Planner', () => {
  it('zählt beim Start einen Takt mit Pfiffen ein, dann Groove auf der Eins', () => {
    const ev = take(new Planner(opts()), 5)
    expect(ev.slice(0, 4).map((e) => [e.phase, e.whistle, e.countNumber])).toEqual([
      ['countin', 'count', 1],
      ['countin', 'count', 2],
      ['countin', 'count', 3],
      ['countin', 'count', 4],
    ])
    expect(ev[4]).toMatchObject({ phase: 'groove', click: 'accent', whistle: null })
  })

  it('betont die Eins im Groove, aber nicht im Break', () => {
    const ev = take(new Planner(opts()), 400)
    for (const e of ev) {
      if (e.phase === 'break') expect(e.click).toBe('break')
      else expect(e.click).toBe(e.beatInBar === 0 ? 'accent' : 'groove')
    }
  })

  it('setzt den Doppelpfiff in den Takt drei Takte vor dem Einzähltakt', () => {
    const ev = take(new Planner(opts({ breaks: [brk({ countStartBeat: 3 })] })), 2000)
    const cs = cycles(ev)
    expect(cs.length).toBeGreaterThan(5)
    const beats = new Set<number>()
    for (const c of cs) {
      const countBar = Math.floor(c.countStart / 4)
      expect(Math.floor(c.double / 4)).toBe(countBar - 3)
      expect(c.countStart % 4).toBe(2)
      beats.add(c.double % 4)
    }
    // zufällige Position im Takt, nicht immer die Eins
    expect(beats.size).toBeGreaterThan(1)
  })

  it('startet den Break direkt nach dem letzten Zählschlag und hält die Länge ein', () => {
    const ev = take(new Planner(opts({ breaks: [brk({ countBeats: 3, lengthBeats: 6 })] })), 1000)
    for (const c of cycles(ev)) {
      expect(c.breakStart - c.countStart).toBe(3)
      expect(c.breakEnd - c.breakStart).toBe(6)
    }
  })

  it('zeigt bei der Einzählung die Nummer des Zählschlags, nicht die Taktposition', () => {
    const ev = take(new Planner(opts({ breaks: [brk({ countStartBeat: 3 })] })), 400)
    const counts = ev.filter((e) => e.phase === 'count').slice(0, 4)
    expect(counts.map((e) => e.countNumber)).toEqual([1, 2, 3, 4])
    expect(counts.map((e) => e.beatInBar)).toEqual([2, 3, 0, 1])
  })

  it('lässt das Taktraster nach einem Break mitten im Takt durchlaufen', () => {
    const ev = take(new Planner(opts({ breaks: [brk({ lengthBeats: 6 })] })), 400)
    const end = cycles(ev)[0].breakEnd
    expect(ev[end]).toMatchObject({ phase: 'groove', beatInBar: end % 4 })
    expect(end % 4).toBe(2)
  })

  it('misst den Abstand vom Ende des letzten Breaks bis zum Start des nächsten', () => {
    const ev = take(new Planner(opts({ avgGapBars: 10, breaks: [brk({ lengthBeats: 64 })] })), 20000)
    const cs = cycles(ev)
    const gaps = cs.slice(1).map((c, k) => (c.breakStart - cs[k].breakEnd) / 4)
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length
    expect(mean).toBeGreaterThan(9)
    expect(mean).toBeLessThan(11)
    for (const g of gaps) expect(g).toBeGreaterThanOrEqual(3.5)
  })

  it('hält den Mindestabstand ein, auch bei sehr kleinem Circa-Wert', () => {
    const ev = take(new Planner(opts({ avgGapBars: 1 })), 3000)
    const cs = cycles(ev)
    for (let k = 1; k < cs.length; k++) {
      expect(Math.floor(cs[k].double / 4)).toBeGreaterThanOrEqual(Math.ceil(cs[k - 1].breakEnd / 4))
    }
  })

  it('würfelt nur aus aktiven Breaks', () => {
    const breaks = [brk({ id: 'a', name: 'A' }), brk({ id: 'b', name: 'B', active: false }), brk({ id: 'c', name: 'C' })]
    const ev = take(new Planner(opts({ breaks })), 5000)
    const names = new Set(ev.filter((e) => e.breakItem).map((e) => e.breakItem!.name))
    expect(names).toEqual(new Set(['A', 'C']))
  })

  it('spielt ohne aktive Breaks einfach Groove', () => {
    const ev = take(new Planner(opts({ breaks: [brk({ active: false })] })), 200)
    expect(ev.slice(4).every((e) => e.phase === 'groove')).toBe(true)
  })

  it('spielt beim Probehören genau einen Break und hört dann auf', () => {
    const p = new Planner(opts({ preview: brk({ lengthBeats: 6 }), countIn: true }))
    const ev = take(p, 1000)
    expect(ev[0].phase).not.toBe('countin')
    expect(cycles(ev)).toHaveLength(1)
    expect(ev.length % 4).toBe(0)
    expect(ev.at(-1)!.phase).toBe('groove')
    expect(p.next()).toBeNull()
  })
})

describe('sampleGapBars', () => {
  it('streut um den Mittelwert und unterschreitet nie das Minimum', () => {
    const rng = seeded(7)
    const xs = Array.from({ length: 5000 }, () => sampleGapBars(10, 4, rng))
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length
    expect(mean).toBeGreaterThan(9.7)
    expect(mean).toBeLessThan(10.3)
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(4)
    expect(new Set(xs).size).toBeGreaterThan(5)
  })
})
