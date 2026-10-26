<script lang="ts">
  import { newRhythm } from '../lib/exchange'
  import { go } from '../lib/router.svelte'
  import { data } from '../lib/store.svelte'
  import { t } from '../lib/strings'
  import { BEATS_PER_BAR_OPTIONS, TEMPO_MAX, TEMPO_MIN } from '../lib/types'

  let name = $state('')
  let beatsPerBar = $state(4)
  let targetTempo = $state(110)

  const valid = $derived(name.trim().length > 0 && targetTempo >= TEMPO_MIN && targetTempo <= TEMPO_MAX)

  function submit(e: SubmitEvent) {
    e.preventDefault()
    if (!valid) return
    const rhythm = newRhythm({ name: name.trim(), beatsPerBar, targetTempo: Math.round(targetTempo) })
    data.rhythms.push(rhythm)
    // gleich weiter zu den Breaks, ohne die sind Rhythmen nur Metronom
    go({ name: 'rhythm', id: rhythm.id, tab: 'breaks' }, { replace: true })
  }
</script>

<form class="card" onsubmit={submit}>
  <h2>{t.newRhythmTitle}</h2>

  <label class="field">
    {t.rhythmName}
    <!-- svelte-ignore a11y_autofocus -->
    <input bind:value={name} placeholder={t.rhythmNamePlaceholder} required autofocus />
  </label>

  <div class="field">
    {t.beatsPerBar}
    <div class="choices">
      {#each BEATS_PER_BAR_OPTIONS as n}
        <button type="button" class:selected={beatsPerBar === n} onclick={() => (beatsPerBar = n)}>{n}</button>
      {/each}
    </div>
    <small>{t.beatsPerBarHint}</small>
  </div>

  <label class="field">
    {t.targetTempo} ({t.bpm})
    <input type="number" min={TEMPO_MIN} max={TEMPO_MAX} bind:value={targetTempo} />
  </label>

  <div class="actions">
    <button type="button" onclick={() => go({ name: 'overview' })}>{t.cancel}</button>
    <button type="submit" class="hot" disabled={!valid}>{t.create}</button>
  </div>
</form>

<style>
  form {
    display: grid;
    gap: 1.25rem;
    padding: 1.25rem;
  }
  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  .actions button {
    padding: 0.7rem 1.4rem;
  }
</style>
