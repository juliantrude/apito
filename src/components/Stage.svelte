<script lang="ts">
  import { player, stop } from '../lib/player.svelte'
  import { currentRhythm } from '../lib/store.svelte'
  import { t } from '../lib/strings'
  import Mascot from './Mascot.svelte'
  import TempoControl from './TempoControl.svelte'

  const ev = $derived(player.event)
  const rhythm = $derived(currentRhythm())
  const bpb = $derived(rhythm?.beatsPerBar ?? 4)
  const phase = $derived(ev?.phase ?? 'countin')
  const dotColors = ['pink', 'yellow', 'green', 'blue', 'orange', 'purple', 'teal']
</script>

<div class="stage phase-{phase}">
  <div class="display">
    {#if !ev}
      <div class="hint">{t.getReady}</div>
    {:else if ev.phase === 'countin' || ev.phase === 'count'}
      {#if ev.breakItem}<div class="name small">{ev.breakItem.name}</div>{/if}
      <div class="count">{ev.countNumber}</div>
    {:else if ev.phase === 'announce'}
      <Mascot mood="blow" size="7rem" />
      <div class="name">{ev.breakItem?.name}</div>
    {:else if ev.phase === 'break'}
      <div class="name">{ev.breakItem?.name}</div>
      <div class="progress"><div style="width: {(ev.breakProgress ?? 0) * 100}%"></div></div>
    {:else}
      <div class="dots">
        {#each { length: bpb }, i}
          <span class:on={ev.beatInBar === i} class:one={i === 0} style="--dot: var(--c-{dotColors[i % dotColors.length]})"
          ></span>
        {/each}
      </div>
      <div class="bar">{t.bar} {player.bar}</div>
    {/if}
  </div>

  <div class="controls">
    {#if player.mode === 'train' && rhythm}<TempoControl {rhythm} compact />{/if}
    <button class="stop" onclick={stop}>{t.stop}</button>
  </div>
</div>

<style>
  .stage {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    padding: max(1rem, env(safe-area-inset-top)) 1rem max(1rem, env(safe-area-inset-bottom));
  }
  .phase-announce {
    background: var(--announce-bg);
    color: var(--announce-fg);
  }
  .phase-count,
  .phase-countin {
    background: var(--count-bg);
    color: white;
  }
  .phase-break {
    background: var(--break-bg);
    color: white;
  }
  .display {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    text-align: center;
    min-height: 0;
  }
  .name {
    font-size: clamp(2.5rem, 13vw, 7rem);
    text-shadow: 0 3px 0 rgb(0 0 0 / 0.12);
    font-weight: 800;
    line-height: 1.05;
    overflow-wrap: anywhere;
  }
  .name.small {
    font-size: clamp(1.25rem, 6vw, 2.5rem);
    opacity: 0.8;
  }
  .count {
    font-size: clamp(8rem, 50vw, 22rem);
    font-weight: 800;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .hint {
    font-size: 1.5rem;
    opacity: 0.8;
  }
  .progress {
    width: min(90%, 36rem);
    height: 1.25rem;
    border-radius: 999px;
    background: color-mix(in srgb, currentColor 18%, transparent);
    overflow: hidden;
  }
  .progress div {
    height: 100%;
    background: currentColor;
    transition: width 0.1s linear;
  }
  .dots {
    display: flex;
    gap: 1rem;
  }
  .dots span {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--border);
  }
  .dots span.one {
    outline: 3px solid var(--border);
    outline-offset: 3px;
  }
  .dots span.on {
    background: var(--dot);
    transform: scale(1.25);
  }
  .dots span {
    transition: transform 0.08s;
  }
  .bar {
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  .controls {
    display: grid;
    gap: 1rem;
    justify-items: center;
    /* eigene Fläche, damit die Bedienung auf jeder Phasenfarbe lesbar bleibt */
    background: var(--surface);
    color: var(--text);
    border-radius: 1.5rem;
    padding: 1rem;
    box-shadow: var(--shadow);
  }
  .stop {
    width: min(100%, 24rem);
    padding: 1rem;
    font-size: 1.25rem;
    font-weight: 700;
    background: var(--danger);
    color: white;
    border: none;
  }
</style>
