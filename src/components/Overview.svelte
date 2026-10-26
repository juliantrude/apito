<script lang="ts">
  import { exampleRhythm, newId, rhythmFromFile } from '../lib/exchange'
  import { pickTextFile } from '../lib/files'
  import { go } from '../lib/router.svelte'
  import { data } from '../lib/store.svelte'
  import { t } from '../lib/strings'

  const palette = ['pink', 'orange', 'green', 'purple', 'blue', 'teal', 'yellow']
  let message = $state('')

  function addExample() {
    const rhythm = exampleRhythm()
    data.rhythms.push(rhythm)
    go({ name: 'rhythm', id: rhythm.id, tab: 'training' })
  }

  async function importRhythm() {
    const text = await pickTextFile()
    if (text === null) return
    try {
      const rhythm = rhythmFromFile(text)
      // neue ids, damit ein zweiter Import keine Dubletten erzeugt
      rhythm.id = newId()
      for (const b of rhythm.breaks) b.id = newId()
      data.rhythms.push(rhythm)
      message = t.importDone(rhythm.name)
    } catch {
      message = t.importFailed
    }
  }
</script>

{#if data.rhythms.length === 0}
  <section class="empty">
    <div class="drum" aria-hidden="true">🪘</div>
    <h2>{t.emptyTitle}</h2>
    <p>{t.emptyText}</p>
    <button class="hot big" onclick={() => go({ name: 'new' })}>+ {t.createFirst}</button>
    <div class="secondary">
      <button onclick={addExample}>{t.tryExample}</button>
      <button onclick={importRhythm}>{t.importRhythm}</button>
    </div>
  </section>
{:else}
  <section>
    <h2>{t.overviewTitle}</h2>
    <ul>
      {#each data.rhythms as rhythm, i (rhythm.id)}
        <li>
          <a
            class="card rhythm"
            style="--stripe: var(--c-{palette[i % palette.length]})"
            href="#/r/{encodeURIComponent(rhythm.id)}/training"
          >
            <strong>{rhythm.name}</strong>
            <small>{t.rhythmMeta(rhythm.beatsPerBar, rhythm.targetTempo, rhythm.breaks.length)}</small>
            <span class="tempo">{rhythm.lastTempo}<em>{t.bpm}</em></span>
          </a>
        </li>
      {/each}
    </ul>
    <button class="hot big" onclick={() => go({ name: 'new' })}>+ {t.newRhythm}</button>
    <div class="secondary">
      <button onclick={importRhythm}>{t.importRhythm}</button>
    </div>
  </section>
{/if}

{#if message}<p class="message">{message}</p>{/if}

<style>
  section {
    display: grid;
    gap: 1rem;
  }
  h2 {
    margin: 0.5rem 0 0;
    font-size: 1.6rem;
  }
  .empty {
    text-align: center;
    justify-items: center;
    padding: 2rem 0;
  }
  .empty p {
    margin: 0;
    color: var(--muted);
    max-width: 22rem;
    font-size: 1.1rem;
  }
  .drum {
    font-size: 5rem;
    line-height: 1;
  }
  .big {
    width: 100%;
    max-width: 24rem;
    padding: 1rem;
    font-size: 1.25rem;
    justify-self: center;
  }
  .secondary {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.75rem;
  }
  .rhythm {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.15rem 1rem;
    padding: 1rem 1.1rem 1rem 1.4rem;
    color: inherit;
    text-decoration: none;
    position: relative;
    overflow: hidden;
  }
  .rhythm::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 0.5rem;
    background: var(--stripe);
  }
  .rhythm strong {
    font-size: 1.35rem;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }
  .rhythm small {
    grid-column: 1;
    color: var(--muted);
  }
  .tempo {
    grid-row: 1 / 3;
    grid-column: 2;
    align-self: center;
    display: grid;
    justify-items: center;
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1;
    color: var(--stripe);
  }
  .tempo em {
    font-style: normal;
    font-size: 0.7rem;
    color: var(--muted);
  }
  .message {
    text-align: center;
    color: var(--muted);
  }
</style>
