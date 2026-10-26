<script lang="ts">
  /** Apito, das Maskottchen: eine Sambapfeife mit Gesicht. */
  let {
    mood = 'happy',
    size = '4rem',
    bounce = false,
  }: { mood?: 'happy' | 'wink' | 'blow'; size?: string; bounce?: boolean } = $props()

  const ink = '#2b1640'
</script>

<svg
  class="apito"
  class:bounce
  style="width: {size}"
  viewBox="0 0 128 104"
  role="img"
  aria-label="Apito"
>
  <!-- Kordel -->
  <path d="M106 20 C 120 4, 126 30, 116 44 S 122 78, 126 90" fill="none" stroke="#ff3d8b" stroke-width="4" stroke-linecap="round" />
  <!-- Ring -->
  <circle cx="102" cy="24" r="8" fill="none" stroke={ink} stroke-width="7" />
  <circle cx="102" cy="24" r="8" fill="none" stroke="#ffd95e" stroke-width="3.5" />
  <!-- Mundstück -->
  <rect x="6" y="34" width="56" height="22" rx="6" fill="#f5a400" stroke={ink} stroke-width="3.5" />
  <rect x="34" y="34" width="12" height="7" rx="2" fill={ink} />
  <!-- Körper -->
  <circle cx="74" cy="58" r="38" fill="#ffc527" stroke={ink} stroke-width="3.5" />
  <ellipse cx="60" cy="36" rx="12" ry="6" fill="#fff4c4" transform="rotate(-25 60 36)" />

  <!-- Augen -->
  {#if mood === 'wink'}
    <path d="M57 54 q 7 -7 14 0" fill="none" stroke={ink} stroke-width="3.5" stroke-linecap="round" />
  {:else}
    <ellipse cx="64" cy="52" rx="7.5" ry="9.5" fill="white" stroke={ink} stroke-width="2.5" />
    <circle cx="66" cy="54" r="4.5" fill={ink} />
    <circle cx="67.5" cy="52" r="1.6" fill="white" />
  {/if}
  <ellipse cx="86" cy="52" rx="7.5" ry="9.5" fill="white" stroke={ink} stroke-width="2.5" />
  <circle cx="88" cy="54" r="4.5" fill={ink} />
  <circle cx="89.5" cy="52" r="1.6" fill="white" />

  <!-- Bäckchen -->
  <ellipse cx="55" cy="69" rx="6" ry="3.5" fill="#ff3d8b" opacity="0.55" />
  <ellipse cx="96" cy="69" rx="6" ry="3.5" fill="#ff3d8b" opacity="0.55" />

  <!-- Mund -->
  {#if mood === 'blow'}
    <ellipse cx="76" cy="72" rx="4.5" ry="5.5" fill={ink} />
    <!-- Pfiff aus der Öffnung -->
    <g fill="none" stroke="#ff3d8b" stroke-width="3.5" stroke-linecap="round" class="sound">
      <path d="M36 26 q -3 -8 2 -14" />
      <path d="M45 24 q 0 -10 7 -16" />
      <path d="M27 28 q -6 -6 -4 -14" />
    </g>
  {:else}
    <path d="M68 68 q 8 9 16 0" fill="none" stroke={ink} stroke-width="3.5" stroke-linecap="round" />
  {/if}
</svg>

<style>
  .apito {
    display: block;
    height: auto;
    overflow: visible;
  }
  .bounce {
    animation: bounce 1.6s ease-in-out infinite;
    transform-origin: 50% 100%;
  }
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0) rotate(-3deg);
    }
    50% {
      transform: translateY(-6%) rotate(3deg);
    }
  }
  .sound {
    animation: toot 0.5s ease-in-out infinite alternate;
  }
  @keyframes toot {
    from {
      opacity: 0.4;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .bounce,
    .sound {
      animation: none;
    }
  }
</style>
