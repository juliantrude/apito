export type SoundName = 'groove' | 'accent' | 'break' | 'count-whistle' | 'double-whistle'

const NAMES: SoundName[] = ['groove', 'accent', 'break', 'count-whistle', 'double-whistle']
const EXTENSIONS = ['wav', 'mp3', 'ogg']

/**
 * Lädt die Aufnahmen aus `public/sounds/<name>.<wav|mp3|ogg>`.
 * Fehlt eine Aufnahme, wird ein synthetischer Platzhalter erzeugt.
 */
export async function loadSounds(ctx: AudioContext): Promise<Record<SoundName, AudioBuffer>> {
  const entries = await Promise.all(
    NAMES.map(async (name) => [name, (await loadFile(ctx, name)) ?? synth(ctx, name)] as const),
  )
  return Object.fromEntries(entries) as Record<SoundName, AudioBuffer>
}

async function loadFile(ctx: AudioContext, name: SoundName): Promise<AudioBuffer | null> {
  for (const ext of EXTENSIONS) {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}sounds/${name}.${ext}`)
      if (!res.ok || !res.headers.get('content-type')?.startsWith('audio')) continue
      return await ctx.decodeAudioData(await res.arrayBuffer())
    } catch {
      // nächste Endung probieren
    }
  }
  return null
}

function synth(ctx: AudioContext, name: SoundName): AudioBuffer {
  switch (name) {
    case 'groove':
      return render(ctx, 0.05, (t) => Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 90) * 0.6)
    case 'accent':
      return render(ctx, 0.06, (t) => Math.sin(2 * Math.PI * 1600 * t) * Math.exp(-t * 70) * 0.9)
    case 'break':
      // dumpfer Holzblock-Klang, klar anders als der Groove-Klick
      return render(ctx, 0.08, (t) => {
        const tone = Math.sin(2 * Math.PI * 420 * t) + 0.5 * Math.sin(2 * Math.PI * 1180 * t)
        return tone * Math.exp(-t * 55) * 0.6
      })
    case 'count-whistle':
      return render(ctx, 0.16, (t) => whistle(t, 0.16))
    case 'double-whistle':
      return render(ctx, 0.3, (t) => (t < 0.12 ? whistle(t, 0.12) : t > 0.18 ? whistle(t - 0.18, 0.12) : 0))
  }
}

/** Sambapfeifen-artiger Ton: hoher Sinus mit schnellem Triller. */
function whistle(t: number, length: number): number {
  const env = Math.min(1, t / 0.01) * Math.min(1, (length - t) / 0.02)
  const trill = 0.7 + 0.3 * Math.sin(2 * Math.PI * 35 * t)
  return Math.sin(2 * Math.PI * 2900 * t) * env * trill * 0.5
}

function render(ctx: AudioContext, seconds: number, fn: (t: number) => number): AudioBuffer {
  const rate = ctx.sampleRate
  const buffer = ctx.createBuffer(1, Math.ceil(seconds * rate), rate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = fn(i / rate)
  return buffer
}
