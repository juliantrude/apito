import { describe, expect, it } from 'vitest'
import { defaultData, parseData, rhythmFromFile, rhythmToFile } from './exchange'

describe('exchange', () => {
  it('übersteht einen Export-Import-Durchlauf unverändert', () => {
    const rhythm = defaultData().rhythms[0]
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
    expect(data.currentRhythmId).toBe(r.id)
  })

  it('fällt bei leeren Daten auf den Standard zurück', () => {
    expect(parseData(null).rhythms).toHaveLength(1)
  })
})
