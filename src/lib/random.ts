export type Rng = () => number

/** Standardnormalverteilte Zufallszahl (Box-Muller). */
export function gaussian(rng: Rng): number {
  const u = 1 - rng()
  const v = rng()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/** Streuung relativ zum Mittelwert, bewusst nicht einstellbar. */
export const GAP_SPREAD = 0.25

/** Würfelt einen Abstand in ganzen Takten um `mean`, nie unter `min`. */
export function sampleGapBars(mean: number, min: number, rng: Rng): number {
  const value = Math.round(mean + mean * GAP_SPREAD * gaussian(rng))
  return Math.max(min, value)
}

export function pick<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)]
}
