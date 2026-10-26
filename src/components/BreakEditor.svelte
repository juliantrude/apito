<script lang="ts">
  import { previewBreak } from '../lib/player.svelte'
  import { t } from '../lib/strings'
  import type { Break } from '../lib/types'

  let {
    initial,
    beatsPerBar,
    isNew,
    onsave,
    oncancel,
  }: {
    initial: Break
    beatsPerBar: number
    isNew: boolean
    onsave: (b: Break) => void
    oncancel: () => void
  } = $props()

  // Bewusst eine Kopie: Änderungen erst beim Speichern übernehmen.
  // svelte-ignore state_referenced_locally
  let draft = $state({ ...initial })

  const valid = $derived(draft.name.trim().length > 0 && draft.countBeats >= 1 && draft.lengthBeats >= 1)

  function submit(e: SubmitEvent) {
    e.preventDefault()
    if (valid) onsave({ ...draft, name: draft.name.trim() })
  }
</script>

<form class="card editor" onsubmit={submit}>
  <h2>{isNew ? t.editorTitleNew : t.editorTitleEdit}</h2>

  <label class="field">
    {t.name}
    <!-- svelte-ignore a11y_autofocus -->
    <input bind:value={draft.name} required autofocus={isNew} />
  </label>

  <fieldset class="field">
    <legend>{t.countStartBeat}</legend>
    <div class="choices">
      {#each { length: beatsPerBar }, i}
        <button
          type="button"
          class:selected={draft.countStartBeat === i + 1}
          onclick={() => (draft.countStartBeat = i + 1)}>{i + 1}</button
        >
      {/each}
    </div>
  </fieldset>

  <label class="field">
    {t.countBeats}
    <input type="number" min="1" max="16" bind:value={draft.countBeats} />
  </label>

  <label class="field">
    {t.lengthBeats}
    <input type="number" min="1" max="256" bind:value={draft.lengthBeats} />
    <small>{t.lengthHint(beatsPerBar, draft.lengthBeats || 0)}</small>
  </label>

  <div class="actions">
    <button type="button" class="play" disabled={!valid} onclick={() => previewBreak({ ...draft })}>▶ {t.preview}</button>
    <span class="spacer"></span>
    <button type="button" onclick={oncancel}>{t.cancel}</button>
    <button type="submit" class="hot" disabled={!valid}>{t.save}</button>
  </div>
</form>

<style>
  .editor {
    display: grid;
    gap: 1rem;
    padding: 1.1rem;
    border-color: var(--c-pink);
  }
  h2 {
    margin: 0;
    font-size: 1.3rem;
  }
  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }
  legend {
    padding: 0;
    margin-bottom: 0.35rem;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .play {
    background: var(--c-teal);
    border-color: var(--c-teal);
    color: white;
  }
  .spacer {
    flex: 1;
  }
</style>
