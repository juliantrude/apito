<script lang="ts">
  import { href, type RhythmTab } from '../lib/router.svelte'
  import { t } from '../lib/strings'
  import type { Rhythm } from '../lib/types'
  import BreakList from './BreakList.svelte'
  import RhythmSettings from './RhythmSettings.svelte'
  import Trainer from './Trainer.svelte'

  let { rhythm, tab }: { rhythm: Rhythm; tab: RhythmTab } = $props()

  const tabs: { id: RhythmTab; label: string }[] = [
    { id: 'training', label: t.tabTraining },
    { id: 'breaks', label: t.tabBreaks },
    { id: 'einstellungen', label: t.tabSettings },
  ]
</script>

<div class="title">
  <a class="back" href={href({ name: 'overview' })} aria-label={t.toOverview}>‹</a>
  <h2>{rhythm.name}</h2>
</div>

<nav>
  {#each tabs as item}
    <a class:selected={tab === item.id} href={href({ name: 'rhythm', id: rhythm.id, tab: item.id })}>
      {item.label}
      {#if item.id === 'breaks'}<span class="count">{rhythm.breaks.length}</span>{/if}
    </a>
  {/each}
</nav>

{#if tab === 'training'}
  <Trainer {rhythm} />
{:else if tab === 'breaks'}
  <BreakList {rhythm} />
{:else}
  <RhythmSettings {rhythm} />
{/if}

<style>
  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .back {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    flex: none;
    border-radius: 50%;
    background: var(--surface);
    border: 2px solid var(--border);
    color: inherit;
    text-decoration: none;
    font-size: 1.8rem;
    line-height: 1;
    padding-bottom: 0.2rem;
  }
  h2 {
    margin: 0;
    font-size: 1.6rem;
    overflow-wrap: anywhere;
  }
  nav {
    display: flex;
    gap: 0.25rem;
    margin: 1rem 0 0.5rem;
    padding: 0.3rem;
    border-radius: 999px;
    background: var(--surface);
    border: 2px solid var(--border);
  }
  nav a {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.45rem 0.25rem;
    border-radius: 999px;
    color: inherit;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.95rem;
  }
  nav a.selected {
    background: var(--c-purple);
    color: white;
  }
  .count {
    font-size: 0.75rem;
    min-width: 1.3rem;
    padding: 0 0.3rem;
    border-radius: 999px;
    background: var(--c-yellow);
    color: #2b1640;
    text-align: center;
  }
</style>
