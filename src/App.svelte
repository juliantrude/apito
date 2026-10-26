<script lang="ts">
  import Garland from './components/Garland.svelte'
  import Mascot from './components/Mascot.svelte'
  import NewRhythm from './components/NewRhythm.svelte'
  import Onboarding from './components/Onboarding.svelte'
  import Overview from './components/Overview.svelte'
  import RhythmPage from './components/RhythmPage.svelte'
  import Stage from './components/Stage.svelte'
  import { player } from './lib/player.svelte'
  import { go, href, router } from './lib/router.svelte'
  import { data, findRhythm } from './lib/store.svelte'
  import { t } from './lib/strings'

  const route = $derived(router.route)
  const rhythm = $derived(route.name === 'rhythm' ? findRhythm(route.id) : undefined)
  const showIntro = $derived(route.name === 'intro' || !data.settings.onboarded)

  // Der Player spielt immer den Rhythmus, der gerade offen ist.
  $effect(() => {
    data.currentRhythmId = rhythm?.id ?? null
  })

  function finishIntro() {
    data.settings.onboarded = true
    if (route.name === 'intro') go({ name: 'overview' }, { replace: true })
  }
</script>

<header>
  <Garland />
  <div class="bar">
    <a class="logo" href={href({ name: 'overview' })}>
      <Mascot size="2.6rem" />
      <span class="word">{t.appName}</span>
    </a>
    <a class="help" href={href({ name: 'intro' })} aria-label={t.help} title={t.help}>?</a>
  </div>
</header>

<main>
  {#if route.name === 'new'}
    <NewRhythm />
  {:else if route.name === 'rhythm'}
    {#if rhythm}
      <RhythmPage {rhythm} tab={route.tab} />
    {:else}
      <p class="missing">{t.notFound} <a href={href({ name: 'overview' })}>{t.toOverview}</a></p>
    {/if}
  {:else}
    <Overview />
  {/if}
</main>

{#if showIntro}
  <Onboarding ondone={finishIntro} />
{/if}

{#if player.running}
  <Stage />
{/if}

<style>
  header {
    margin: 0 -1rem 1rem;
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 1rem 0;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1.7rem;
    font-weight: 800;
    color: inherit;
    text-decoration: none;
  }
  .word {
    background: linear-gradient(90deg, var(--c-pink), var(--c-orange) 55%, var(--c-purple));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .help {
    display: grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: var(--c-yellow);
    color: #2b1640;
    font-weight: 800;
    text-decoration: none;
  }
  .missing {
    text-align: center;
    color: var(--muted);
  }
</style>
