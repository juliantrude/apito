<script lang="ts">
  /** Apito, das Maskottchen: eine Dreiton-Sambapfeife mit Gesicht. */
  let {
    mood = 'happy',
    size = '4rem',
    bounce = false,
  }: { mood?: 'happy' | 'wink' | 'blow'; size?: string; bounce?: boolean } = $props()

  const ink = '#2b1640'
  const yellow = '#ffd21f'
  const strands = ['M20 49 C 10 36, 8 20, 2 4', 'M25 46 C 20 30, 24 16, 18 0']
</script>

<svg class="apito" class:bounce style="width: {size}" viewBox="-2 -4 142 118" role="img" aria-label="Apito">
  <g stroke-linejoin="round">
    <!-- geflochtene Kordel in Rot, Grün, Gelb -->
    <g fill="none">
      {#each strands as d, i}
        <path {d} stroke={ink} stroke-width="7.5" stroke-linecap="round" />
        <path {d} stroke={yellow} stroke-width="4.5" stroke-linecap="round" />
        <path {d} stroke="#e0262f" stroke-width="4.5" stroke-dasharray="4 8" stroke-dashoffset={i * 2} />
        <path {d} stroke="#12a150" stroke-width="4.5" stroke-dasharray="4 8" stroke-dashoffset={8 + i * 2} />
      {/each}
    </g>
    <!-- Öse und Ring -->
    <rect x="28" y="46" width="18" height="16" rx="6" fill={yellow} stroke={ink} stroke-width="3.5" />
    <circle cx="26" cy="54" r="8" fill="none" stroke={ink} stroke-width="7" />
    <circle cx="26" cy="54" r="8" fill="none" stroke="#d9dce6" stroke-width="3.5" />
    <!-- grüne und rote Kammer -->
    <path d="M56 26 L60 5 Q70 0 80 5 L84 26 Z" fill="#12a150" stroke={ink} stroke-width="3.5" />
    <path d="M56 86 L60 107 Q70 112 80 107 L84 86 Z" fill="#e0262f" stroke={ink} stroke-width="3.5" />
    <!-- Mundstück mit Fenster -->
    <path d="M94 42 L131 46 Q136 47 136 52 L136 66 Q136 71 131 72 L94 76 Z" fill={yellow} stroke={ink} stroke-width="3.5" />
    <rect x="102" y="51" width="11" height="9" rx="2" fill={ink} />
    <!-- Körper -->
    <rect x="40" y="28" width="60" height="58" rx="18" fill={yellow} stroke={ink} stroke-width="3.5" />
    <ellipse cx="52" cy="38" rx="8" ry="4" fill="#fff7c2" transform="rotate(-30 52 38)" />
    <rect x="49" y="21" width="42" height="10" rx="4" fill="#0b7d3c" stroke={ink} stroke-width="3.5" />
    <rect x="49" y="83" width="42" height="10" rx="4" fill="#b81d25" stroke={ink} stroke-width="3.5" />

    <!-- Augen -->
    {#if mood === 'wink'}
      <path d="M54 54 q 6 -6 12 0" fill="none" stroke={ink} stroke-width="3.5" stroke-linecap="round" />
    {:else}
      <ellipse cx="60" cy="53" rx="7" ry="9" fill="white" stroke={ink} stroke-width="2.5" />
      <circle cx="62" cy="55" r="4.2" fill={ink} />
      <circle cx="63.5" cy="53" r="1.5" fill="white" />
    {/if}
    <ellipse cx="81" cy="53" rx="7" ry="9" fill="white" stroke={ink} stroke-width="2.5" />
    <circle cx="83" cy="55" r="4.2" fill={ink} />
    <circle cx="84.5" cy="53" r="1.5" fill="white" />

    <!-- Bäckchen -->
    <ellipse cx="51" cy="68" rx="5" ry="3" fill="#ff3d8b" opacity="0.6" />
    <ellipse cx="90" cy="68" rx="5" ry="3" fill="#ff3d8b" opacity="0.6" />

    <!-- Mund -->
    {#if mood === 'blow'}
      <ellipse cx="71" cy="70" rx="4" ry="5" fill={ink} />
      <!-- Pfiff aus dem Fenster -->
      <g class="sound" fill="none" stroke="#ff3d8b" stroke-width="3.5" stroke-linecap="round">
        <path d="M108 40 q 2 -8 9 -12" />
        <path d="M117 44 q 6 -6 14 -6" />
        <path d="M103 36 q -1 -8 3 -14" />
      </g>
    {:else}
      <path d="M64 68 q 7 8 14 0" fill="none" stroke={ink} stroke-width="3.5" stroke-linecap="round" />
    {/if}
  </g>
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
