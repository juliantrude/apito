<script lang="ts">
  import { newId } from '../lib/exchange'
  import { downloadRhythm } from '../lib/files'
  import { go } from '../lib/router.svelte'
  import { data, setBeatsPerBar } from '../lib/store.svelte'
  import { t } from '../lib/strings'
  import { BEATS_PER_BAR_OPTIONS, minGapBars, TEMPO_MAX, TEMPO_MIN, type Rhythm } from '../lib/types'

  let { rhythm }: { rhythm: Rhythm } = $props()

  const minGap = $derived(minGapBars(data.settings))

  function clampInt(value: number, min: number, max: number) {
    return Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : min
  }

  function duplicate() {
    const copy = $state.snapshot(rhythm)
    copy.id = newId()
    copy.name = `${rhythm.name} ${t.copySuffix}`
    for (const b of copy.breaks) b.id = newId()
    data.rhythms.push(copy)
    go({ name: 'rhythm', id: copy.id, tab: 'einstellungen' })
  }

  function remove() {
    if (!confirm(t.confirmDelete(rhythm.name))) return
    const id = rhythm.id
    go({ name: 'overview' }, { replace: true })
    data.rhythms = data.rhythms.filter((r) => r.id !== id)
  }
</script>

<section class="card">
  <label class="field">
    {t.rhythmName}
    <input
      value={rhythm.name}
      onchange={(e) => {
        const name = e.currentTarget.value.trim()
        if (name) rhythm.name = name
        else e.currentTarget.value = rhythm.name
      }}
    />
  </label>

  <div class="field">
    {t.beatsPerBar}
    <div class="choices">
      {#each BEATS_PER_BAR_OPTIONS as n}
        <button class:selected={rhythm.beatsPerBar === n} onclick={() => setBeatsPerBar(rhythm, n)}>{n}</button>
      {/each}
    </div>
  </div>

  <label class="field">
    {t.targetTempo} ({t.bpm})
    <input
      type="number"
      min={TEMPO_MIN}
      max={TEMPO_MAX}
      value={rhythm.targetTempo}
      onchange={(e) => {
        rhythm.targetTempo = clampInt(e.currentTarget.valueAsNumber, TEMPO_MIN, TEMPO_MAX)
        e.currentTarget.value = String(rhythm.targetTempo)
      }}
    />
  </label>

  <label class="field">
    {t.avgGap}
    <input
      type="number"
      min={minGap}
      max="999"
      value={rhythm.avgGapBars}
      onchange={(e) => {
        rhythm.avgGapBars = clampInt(e.currentTarget.valueAsNumber, minGap, 999)
        e.currentTarget.value = String(rhythm.avgGapBars)
      }}
    />
    <small>{t.avgGapHint(minGap)}</small>
  </label>

  <label class="field">
    {t.leadBars}
    <input
      type="number"
      min="0"
      max="8"
      value={data.settings.leadBars}
      onchange={(e) => {
        data.settings.leadBars = clampInt(e.currentTarget.valueAsNumber, 0, 8)
        e.currentTarget.value = String(data.settings.leadBars)
        const min = minGapBars(data.settings)
        for (const r of data.rhythms) r.avgGapBars = Math.max(r.avgGapBars, min)
      }}
    />
    <small>{t.leadBarsHint}</small>
  </label>
</section>

<section class="card">
  <h3>{t.exchange}</h3>
  <div class="row">
    <button onclick={() => downloadRhythm($state.snapshot(rhythm))}>{t.exportFile}</button>
    <button onclick={duplicate}>{t.duplicate}</button>
  </div>
  <button class="danger" onclick={remove}>{t.deleteRhythm}</button>
</section>

<style>
  section {
    display: grid;
    gap: 1.1rem;
    padding: 1.1rem;
    margin-top: 0.75rem;
  }
  h3 {
    margin: 0;
    font-size: 1.15rem;
  }
  .row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .danger {
    justify-self: start;
    color: var(--danger);
    border-color: color-mix(in srgb, var(--danger) 40%, transparent);
  }
</style>
