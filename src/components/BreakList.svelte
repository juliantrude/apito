<script lang="ts">
  import { fileName, newId, rhythmFromFile, rhythmToFile } from '../lib/exchange'
  import { previewBreak } from '../lib/player.svelte'
  import { currentRhythm, data } from '../lib/store.svelte'
  import { t } from '../lib/strings'
  import { minGapBars, TEMPO_MAX, TEMPO_MIN, type Break } from '../lib/types'
  import BreakEditor from './BreakEditor.svelte'

  const rhythm = $derived(currentRhythm())
  const minGap = $derived(minGapBars(data.settings))

  /** id des bearbeiteten Breaks, 'new' für einen neuen. */
  let editing = $state<string | null>(null)
  let message = $state('')
  let fileInput: HTMLInputElement

  function blankBreak(): Break {
    return {
      id: newId(),
      name: `Break ${rhythm.breaks.length + 1}`,
      countStartBeat: 1,
      countBeats: rhythm.beatsPerBar,
      lengthBeats: rhythm.beatsPerBar * 2,
      active: true,
    }
  }

  function save(item: Break) {
    const i = rhythm.breaks.findIndex((b) => b.id === item.id)
    if (i >= 0) rhythm.breaks[i] = item
    else rhythm.breaks.push(item)
    editing = null
  }

  function remove(item: Break) {
    if (confirm(t.confirmDelete(item.name))) rhythm.breaks = rhythm.breaks.filter((b) => b.id !== item.id)
  }

  function clampInt(value: number, min: number, max: number) {
    return Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : min
  }

  function exportRhythm() {
    const blob = new Blob([JSON.stringify(rhythmToFile($state.snapshot(rhythm)), null, 2)], {
      type: 'application/json',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = fileName(rhythm)
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function importRhythm(e: Event & { currentTarget: HTMLInputElement }) {
    const file = e.currentTarget.files?.[0]
    e.currentTarget.value = ''
    if (!file) return
    try {
      const imported = rhythmFromFile(await file.text())
      // V1: Breaks in den einen Rhythmus übernehmen, mit neuen ids gegen Dubletten
      const breaks = imported.breaks.map((b) => ({
        ...b,
        id: newId(),
        countStartBeat: Math.min(b.countStartBeat, rhythm.beatsPerBar),
      }))
      rhythm.breaks.push(...breaks)
      message = t.importDone(breaks.length)
    } catch {
      message = t.importFailed
    }
  }
</script>

<section>
  <h2>{t.rhythmSettings}</h2>
  <div class="settings">
    <label>
      {t.targetTempo} ({t.bpm})
      <input
        type="number"
        min={TEMPO_MIN}
        max={TEMPO_MAX}
        value={rhythm.targetTempo}
        onchange={(e) => (rhythm.targetTempo = clampInt(e.currentTarget.valueAsNumber, TEMPO_MIN, TEMPO_MAX))}
      />
    </label>
    <label>
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
    <label>
      {t.leadBars}
      <input
        type="number"
        min="0"
        max="8"
        value={data.settings.leadBars}
        onchange={(e) => {
          data.settings.leadBars = clampInt(e.currentTarget.valueAsNumber, 0, 8)
          rhythm.avgGapBars = Math.max(rhythm.avgGapBars, minGapBars(data.settings))
        }}
      />
    </label>
  </div>
</section>

<section>
  <div class="head">
    <h2>{t.breaks}</h2>
    {#if editing === null}
      <button class="primary" onclick={() => (editing = 'new')}>+ {t.newBreak}</button>
    {/if}
  </div>

  {#if editing === 'new'}
    <BreakEditor
      initial={blankBreak()}
      beatsPerBar={rhythm.beatsPerBar}
      isNew
      onsave={save}
      oncancel={() => (editing = null)}
    />
  {/if}

  <ul>
    {#each rhythm.breaks as item (item.id)}
      <li>
        {#if editing === item.id}
          <BreakEditor
            initial={$state.snapshot(item)}
            beatsPerBar={rhythm.beatsPerBar}
            isNew={false}
            onsave={save}
            oncancel={() => (editing = null)}
          />
        {:else}
          <div class="item" class:inactive={!item.active}>
            <label class="toggle" title={t.active}>
              <input type="checkbox" bind:checked={item.active} />
            </label>
            <div class="text">
              <strong>{item.name}</strong>
              <small>{t.breakSummary(item.countStartBeat, item.countBeats, item.lengthBeats)}</small>
            </div>
            <div class="buttons">
              <button onclick={() => previewBreak(item)} aria-label={t.preview} title={t.preview}>▶</button>
              <button onclick={() => (editing = item.id)} aria-label={t.edit} title={t.edit}>✎</button>
              <button onclick={() => remove(item)} aria-label={t.delete} title={t.delete}>✕</button>
            </div>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</section>

<section>
  <h2>{t.exchange}</h2>
  <div class="exchange">
    <button onclick={exportRhythm}>{t.exportFile}</button>
    <button onclick={() => fileInput.click()}>{t.importFile}</button>
    <input
      bind:this={fileInput}
      type="file"
      accept=".json,application/json"
      hidden
      onchange={importRhythm}
    />
  </div>
  {#if message}<p class="message">{message}</p>{/if}
</section>

<style>
  section {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  h2 {
    margin: 0;
    font-size: 1.1rem;
  }
  .settings {
    display: grid;
    gap: 1rem;
  }
  .settings label {
    display: grid;
    gap: 0.35rem;
  }
  small {
    color: var(--muted);
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.5rem;
  }
  .item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    background: var(--surface);
  }
  .item.inactive .text {
    opacity: 0.5;
  }
  .toggle input {
    width: 1.4rem;
    height: 1.4rem;
    accent-color: var(--accent);
  }
  .text {
    flex: 1;
    display: grid;
    gap: 0.2rem;
    min-width: 0;
  }
  .text strong {
    overflow-wrap: anywhere;
  }
  .buttons {
    display: flex;
    gap: 0.35rem;
  }
  .exchange {
    display: flex;
    gap: 0.5rem;
  }
  .message {
    margin: 0;
    color: var(--muted);
  }
</style>
