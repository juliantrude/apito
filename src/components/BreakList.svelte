<script lang="ts">
  import { newId } from '../lib/exchange'
  import { previewBreak } from '../lib/player.svelte'
  import { t } from '../lib/strings'
  import type { Break, Rhythm } from '../lib/types'
  import BreakEditor from './BreakEditor.svelte'

  let { rhythm }: { rhythm: Rhythm } = $props()

  const palette = ['pink', 'orange', 'green', 'purple', 'blue', 'teal']

  /** id des bearbeiteten Breaks, 'new' für einen neuen. */
  // svelte-ignore state_referenced_locally
  let editing = $state<string | null>(rhythm.breaks.length === 0 ? 'new' : null)

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
</script>

<section>
  {#if editing === 'new'}
    <BreakEditor
      initial={blankBreak()}
      beatsPerBar={rhythm.beatsPerBar}
      isNew
      onsave={save}
      oncancel={() => (editing = null)}
    />
  {:else if editing === null}
    <button class="hot add" onclick={() => (editing = 'new')}>+ {t.newBreak}</button>
  {/if}

  {#if rhythm.breaks.length === 0 && editing !== 'new'}
    <p class="empty">{t.breaksEmpty}</p>
  {/if}

  <ul>
    {#each rhythm.breaks as item, i (item.id)}
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
          <div class="card item" class:inactive={!item.active} style="--stripe: var(--c-{palette[i % palette.length]})">
            <label class="toggle" title={t.active}>
              <input type="checkbox" bind:checked={item.active} aria-label={t.active} />
            </label>
            <div class="text">
              <strong>{item.name}</strong>
              <small>{t.breakSummary(item.countStartBeat, item.countBeats, item.lengthBeats)}</small>
            </div>
            <div class="buttons">
              <button class="play" onclick={() => previewBreak(item)} aria-label={t.preview} title={t.preview}>▶</button>
              <button onclick={() => (editing = item.id)} aria-label={t.edit} title={t.edit}>✎</button>
              <button onclick={() => remove(item)} aria-label={t.delete} title={t.delete}>✕</button>
            </div>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</section>

<style>
  section {
    display: grid;
    gap: 0.75rem;
    padding-top: 0.5rem;
  }
  .add {
    padding: 0.8rem;
    font-size: 1.1rem;
  }
  .empty {
    text-align: center;
    color: var(--muted);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.6rem;
  }
  .item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.75rem 0.75rem 1rem;
    border-left: 0.45rem solid var(--stripe);
  }
  .item.inactive {
    border-left-color: var(--border);
  }
  .item.inactive .text {
    opacity: 0.5;
  }
  .toggle input {
    width: 1.5rem;
    height: 1.5rem;
    accent-color: var(--stripe);
  }
  .text {
    flex: 1;
    display: grid;
    gap: 0.1rem;
    min-width: 0;
  }
  .text strong {
    font-size: 1.15rem;
    overflow-wrap: anywhere;
  }
  .text small {
    color: var(--muted);
    line-height: 1.3;
  }
  .buttons {
    display: flex;
    gap: 0.3rem;
  }
  .buttons button {
    width: 2.6rem;
    height: 2.6rem;
    padding: 0;
  }
  .play {
    background: var(--stripe);
    border-color: var(--stripe);
    color: white;
  }
</style>
