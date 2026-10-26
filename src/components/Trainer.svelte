<script lang="ts">
  import { startTraining } from '../lib/player.svelte'
  import { href } from '../lib/router.svelte'
  import { t } from '../lib/strings'
  import type { Rhythm } from '../lib/types'
  import TempoControl from './TempoControl.svelte'

  let { rhythm }: { rhythm: Rhythm } = $props()

  const active = $derived(rhythm.breaks.filter((b) => b.active).length)
</script>

<section class="trainer">
  <TempoControl {rhythm} />
  <button class="start hot" onclick={startTraining}>{t.start}</button>
  <p class="info">
    {#if rhythm.breaks.length === 0}
      {t.noBreaksYet}
      <a href={href({ name: 'rhythm', id: rhythm.id, tab: 'breaks' })}>{t.addBreaks}</a>
    {:else if active > 0}
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
    padding: 1.5rem 0;
  }
  .start {
    width: 11rem;
    height: 11rem;
    border-radius: 50%;
    font-size: 2rem;
    letter-spacing: 0.02em;
    box-shadow:
      0 0 0 0.6rem color-mix(in srgb, var(--c-pink) 18%, transparent),
      0 0 0 1.2rem color-mix(in srgb, var(--c-yellow) 16%, transparent),
      var(--shadow);
  }
  .info {
    color: var(--muted);
    text-align: center;
    margin: 0;
    display: grid;
    gap: 0.5rem;
  }
  .info a {
    color: var(--c-pink);
    font-weight: 700;
  }
</style>
