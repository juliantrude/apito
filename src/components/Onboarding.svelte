<script lang="ts">
  import { browser, install, promptInstall } from '../lib/install.svelte'
  import { t, type InstallIcon } from '../lib/strings'
  import Mascot from './Mascot.svelte'

  let { ondone }: { ondone: () => void } = $props()

  const slides = t.intro
  let index = $state(0)
  const slide = $derived(slides[index])
  const last = $derived(index === slides.length - 1)

  // Im Browser-Tab kommt vor der Einführung erst die Installationsanleitung.
  const guide = browser === 'desktop' || install.standalone ? undefined : t.install.guides[browser]
  let installing = $state(guide !== undefined)

  let touchX = 0

  function next() {
    if (installing) installing = false
    else if (last) ondone()
    else index++
  }
  function prev() {
    if (installing) return
    if (index > 0) index--
    else if (guide) installing = true
  }
  function key(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }
</script>

<svelte:window onkeydown={key} />

<div
  class="intro"
  role="dialog"
  aria-modal="true"
  aria-label={t.help}
  tabindex="-1"
  style="--slide: var(--c-{installing ? 'blue' : slide.color})"
  ontouchstart={(e) => (touchX = e.touches[0].clientX)}
  ontouchend={(e) => {
    const dx = e.changedTouches[0].clientX - touchX
    if (dx < -50) next()
    if (dx > 50) prev()
  }}
>
  <button class="skip ghost" onclick={ondone}>{t.introSkip}</button>

  {#if installing && guide}
    <div class="content">
      {#if install.installed}
        <Mascot mood="happy" size="8rem" bounce />
        <h1>{t.install.doneTitle}</h1>
        <p>{t.install.doneText}</p>
      {:else}
        <Mascot mood="wink" size="8rem" />
        <h1>{t.install.title}</h1>
        <p>{t.install.text}</p>
        {#if install.canPrompt}
          <button class="hot install" onclick={promptInstall}>{t.install.button}</button>
        {/if}
        <p class="manual">{install.canPrompt ? t.install.manualAlt : t.install.manual}</p>
        <ol class="steps keys">
          {#each guide.steps as step}
            <li><span>{@render icon(step.icon)}</span>{step.text}</li>
          {/each}
        </ol>
        <p class="outro">{t.install.outro}</p>
      {/if}
    </div>
    <div class="nav">
      <div class="buttons">
        <button class="next" onclick={next}>{t.install.continueInBrowser}</button>
      </div>
    </div>
  {:else}
    {#key index}
      <div class="content">
        {#if slide.mascot}
          <Mascot mood={slide.mascot} size="8rem" bounce={index === 0} />
        {:else}
          <div class="emoji" aria-hidden="true">{slide.emoji}</div>
        {/if}
        <h1>{slide.title}</h1>
        <p>{slide.text}</p>
        {#if slide.steps}
          <ol class="steps">
            {#each slide.steps as step}
              <li style="--chip: var(--c-{step.color})"><span></span>{step.text}</li>
            {/each}
          </ol>
        {/if}
      </div>
    {/key}

    <div class="nav">
      <div class="dots">
        {#each slides as s, i}
          <button
            class="dot"
            class:on={i === index}
            style="--dot: var(--c-{s.color})"
            onclick={() => (index = i)}
            aria-label={`${i + 1}`}
          ></button>
        {/each}
      </div>
      <div class="buttons">
        {#if index > 0}<button onclick={prev}>{t.back}</button>{/if}
        <button class="hot next" onclick={next}>{last ? t.introDone : t.next}</button>
      </div>
    </div>
  {/if}
</div>

{#snippet icon(name: InstallIcon)}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    {#if name === 'share'}
      <path d="M12 3v12M8 7l4-4 4 4M8 10H6v11h12V10h-2" />
    {:else if name === 'dots'}
      <circle cx="12" cy="5" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="12" cy="19" r="1.2" />
    {:else if name === 'menu'}
      <path d="M4 6h16M4 12h16M4 18h16" />
    {:else if name === 'add'}
      <rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" />
    {:else}
      <path d="M5 12.5l4.5 4.5L19 7" />
    {/if}
  </svg>
{/snippet}

<style>
  .intro {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    padding: max(1rem, env(safe-area-inset-top)) 1.25rem max(1.25rem, env(safe-area-inset-bottom));
    background:
      radial-gradient(circle at 85% 10%, color-mix(in srgb, var(--slide) 35%, transparent) 0 12rem, transparent 12rem),
      radial-gradient(circle at 10% 90%, color-mix(in srgb, var(--slide) 22%, transparent) 0 14rem, transparent 14rem),
      var(--bg);
    transition: background 0.3s;
  }
  .skip {
    align-self: flex-end;
    color: var(--muted);
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 32rem;
    margin: 0 auto;
    width: 100%;
    animation: pop 0.35s ease-out;
  }
  @keyframes pop {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
  }
  .emoji {
    font-size: 5rem;
    line-height: 1;
  }
  .content :global(.apito),
  .emoji {
    margin-bottom: 1rem;
  }
  h1 {
    font-size: clamp(2rem, 9vw, 2.8rem);
    margin: 0 0 0.75rem;
    color: var(--slide);
  }
  p {
    font-size: 1.2rem;
    line-height: 1.45;
    margin: 0;
  }
  .steps {
    list-style: none;
    padding: 0;
    margin: 1.25rem 0 0;
    display: grid;
    gap: 0.6rem;
    font-size: 1.1rem;
  }
  .steps li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .steps span {
    flex: none;
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
    background: var(--chip);
  }
  .install {
    margin-top: 1.25rem;
    padding: 0.9rem 1.25rem;
    font-size: 1.15rem;
  }
  .manual {
    margin-top: 1.25rem;
    font-weight: 700;
  }
  .keys {
    margin-top: 0.5rem;
  }
  .keys span {
    display: grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 0.6rem;
    background: var(--surface);
    border: 2px solid var(--border);
    color: var(--c-blue);
  }
  .keys svg {
    width: 1.3rem;
    height: 1.3rem;
  }
  .outro {
    margin-top: 1.25rem;
    font-size: 1rem;
    color: var(--muted);
  }
  .nav {
    display: grid;
    gap: 1.25rem;
    max-width: 32rem;
    margin: 0 auto;
    width: 100%;
  }
  .dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }
  .dot {
    width: 0.8rem;
    height: 0.8rem;
    padding: 0;
    border: none;
    background: var(--border);
    transition: width 0.2s;
  }
  .dot.on {
    width: 2rem;
    background: var(--dot);
  }
  .buttons {
    display: flex;
    gap: 0.75rem;
  }
  .buttons button {
    padding: 0.9rem 1.25rem;
    font-size: 1.1rem;
  }
  .next {
    flex: 1;
  }
</style>
