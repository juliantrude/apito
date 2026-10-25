<script lang="ts">
  import { startTraining } from '../lib/player.svelte'
  import { currentRhythm } from '../lib/store.svelte'
  import { t } from '../lib/strings'
  import TempoControl from './TempoControl.svelte'

  const rhythm = $derived(currentRhythm())
  const active = $derived(rhythm.breaks.filter((b) => b.active).length)
</script>

<section class="trainer">
  <TempoControl />
  <button class="start" onclick={startTraining}>{t.start}</button>
  <p class="info">
    {#if active > 0}
      {t.activeBreaks(active)} · {t.gapInfo(rhythm.avgGapBars)}
    {:else}
      {t.noActiveBreaks}
    {/if}
  </p>
</section>

<style>
  .trainer {
    display: grid;
    gap: 2rem;
    justify-items: center;
    padding: 2rem 0;
  }
  .start {
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    font-size: 1.75rem;
    font-weight: 800;
    background: var(--accent);
    color: var(--on-accent);
    border: none;
  }
  .info {
    color: var(--muted);
    text-align: center;
    margin: 0;
  }
</style>
