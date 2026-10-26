import { describe, expect, it } from 'vitest'
import { defaultData, exampleRhythm, parseData, rhythmFromFile, rhythmToFile } from './exchange'

describe('exchange', () => {
  it('übersteht einen Export-Import-Durchlauf unverändert', () => {
    const rhythm = exampleRhythm()
    const back = rhythmFromFile(JSON.stringify(rhythmToFile(rhythm)))
    expect(back).toEqual(rhythm)
  })

  it('lehnt fremde Dateien ab', () => {
    expect(() => rhythmFromFile('{"foo": 1}')).toThrow()
    expect(() => rhythmFromFile('kein json')).toThrow()
  })

  it('repariert ungültige Werte statt abzustürzen', () => {
    const data = parseData({
      rhythms: [{ beatsPerBar: 4, lastTempo: 9999, breaks: [{ countStartBeat: 7, countBeats: -2, name: '' }] }],
    })
    const r = data.rhythms[0]
    expect(r.lastTempo).toBe(240)
    expect(r.breaks[0]).toMatchObject({ countStartBeat: 4, countBeats: 1, name: 'Break', active: true })
    expect(data.currentRhythmId).toBeNull()
  })

  it('startet ohne Rhythmen und mit Onboarding', () => {
    expect(parseData(null)).toEqual(defaultData())
    expect(defaultData()).toMatchObject({ rhythms: [], settings: { onboarded: false } })
  })
})
