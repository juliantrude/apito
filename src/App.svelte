<script lang="ts">
  import BreakList from './components/BreakList.svelte'
  import Stage from './components/Stage.svelte'
  import Trainer from './components/Trainer.svelte'
  import { player } from './lib/player.svelte'
  import { t } from './lib/strings'

  let tab = $state<'trainer' | 'breaks'>('trainer')
</script>

<header>
  <h1>{t.appName}</h1>
  <nav>
    <button class:selected={tab === 'trainer'} onclick={() => (tab = 'trainer')}>{t.tabTrainer}</button>
    <button class:selected={tab === 'breaks'} onclick={() => (tab = 'breaks')}>{t.tabBreaks}</button>
  </nav>
</header>

<main>
  {#if tab === 'trainer'}
    <Trainer />
  {:else}
    <BreakList />
  {/if}
</main>

{#if player.running}
  <Stage />
{/if}

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }
  h1 {
    margin: 0;
    font-size: 1.2rem;
  }
  nav {
    display: flex;
    gap: 0.25rem;
  }
  nav button {
    background: transparent;
    border-color: transparent;
  }
  nav button.selected {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
