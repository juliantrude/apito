<script lang="ts">
  import { currentRhythm } from '../lib/store.svelte'
  import { t } from '../lib/strings'
  import { TEMPO_MAX, TEMPO_MIN } from '../lib/types'

  let { compact = false }: { compact?: boolean } = $props()

  const rhythm = $derived(currentRhythm())

  function set(value: number) {
    rhythm.lastTempo = Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, Math.round(value)))
  }
</script>

<div class="tempo" class:compact>
  <div class="row">
    <button class="step" onclick={() => set(rhythm.lastTempo - 5)} aria-label="−5">−5</button>
    <button class="step" onclick={() => set(rhythm.lastTempo - 1)} aria-label="−1">−</button>
    <div class="value">
      <span class="bpm">{rhythm.lastTempo}</span>
      <span class="unit">{t.bpm}</span>
    </div>
    <button class="step" onclick={() => set(rhythm.lastTempo + 1)} aria-label="+1">+</button>
    <button class="step" onclick={() => set(rhythm.lastTempo + 5)} aria-label="+5">+5</button>
  </div>
  <input
    type="range"
    min={TEMPO_MIN}
    max={TEMPO_MAX}
    value={rhythm.lastTempo}
    oninput={(e) => set(Number(e.currentTarget.value))}
    aria-label={t.tempo}
  />
  <button
    class="target"
    class:reached={rhythm.lastTempo === rhythm.targetTempo}
    onclick={() => set(rhythm.targetTempo)}
    title={t.jumpToTarget}
  >
    {t.targetTempo}: {rhythm.targetTempo}
  </button>
</div>

<style>
  .tempo {
    display: grid;
    gap: 0.75rem;
    justify-items: center;
    width: 100%;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .value {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 6.5rem;
  }
  .bpm {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .compact .bpm {
    font-size: 2.25rem;
  }
  .unit {
    font-size: 0.8rem;
    color: var(--muted);
  }
  .step {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    font-size: 1.1rem;
  }
  input[type='range'] {
    width: min(100%, 24rem);
    accent-color: var(--accent);
  }
  .target {
    background: transparent;
    border: 1px dashed var(--border);
    color: var(--muted);
    font-size: 0.9rem;
    padding: 0.35rem 0.8rem;
  }
  .target.reached {
    border-style: solid;
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
