<script lang="ts">
  /**
   * Apito, das Maskottchen: eine Dreiton-Sambapfeife als Figur.
   * Kordel = Haare, grüne und rote Kammer = Arme, Mundstück = Beine.
   */
  let {
    mood = 'happy',
    size = '4rem',
    bounce = false,
  }: { mood?: 'happy' | 'wink' | 'blow'; size?: string; bounce?: boolean } = $props()

  const ink = '#2b1640'
  const yellow = '#ffd21f'
  const hair = [
    'M66 14 C 56 4, 42 8, 36 -4',
    'M68 12 C 64 0, 56 -8, 56 -18',
    'M72 12 C 76 0, 84 -8, 84 -18',
    'M74 14 C 84 4, 98 8, 104 -4',
  ]
</script>

<svg class="apito" class:bounce style="width: {size}" viewBox="-4 -24 148 162" role="img" aria-label="Apito">
  <g stroke-linejoin="round">
    <!-- Haare: geflochtene Kordel in Rot, Grün, Gelb -->
    <g fill="none" class="hair">
      {#each hair as d, i}
        <path {d} stroke={ink} stroke-width="7.5" stroke-linecap="round" />
        <path {d} stroke={yellow} stroke-width="4.5" stroke-linecap="round" />
        <path {d} stroke="#e0262f" stroke-width="4.5" stroke-dasharray="4 8" stroke-dashoffset={i * 3} />
        <path {d} stroke="#12a150" stroke-width="4.5" stroke-dasharray="4 8" stroke-dashoffset={8 + i * 3} />
      {/each}
    </g>
    <!-- Ring und Öse -->
    <circle cx="70" cy="19" r="7" fill="none" stroke={ink} stroke-width="7" />
    <circle cx="70" cy="19" r="7" fill="none" stroke="#d9dce6" stroke-width="3.5" />
    <rect x="62" y="25" width="16" height="13" rx="5" fill={yellow} stroke={ink} stroke-width="3.5" />

    <!-- Arme: grüne und rote Kammer, hochgerissen -->
    <g class="arm left">
      <path d="M36 56 L14 59 Q7 65 14 71 L36 74 Z" fill="#12a150" stroke={ink} stroke-width="3.5" transform="rotate(42 36 65)" />
    </g>
    <g class="arm right">
      <path d="M104 56 L126 59 Q133 65 126 71 L104 74 Z" fill="#e0262f" stroke={ink} stroke-width="3.5" transform="rotate(-42 104 65)" />
    </g>

    <!-- Beine: das geteilte Mundstück, mit Füßen -->
    <path d="M56 90 L57 122 Q57 126 61 126 L66 126 Q69 126 69 122 L69 90 Z" fill={yellow} stroke={ink} stroke-width="3.5" />
    <path d="M71 90 L71 122 Q71 126 74 126 L79 126 Q83 126 83 122 L84 90 Z" fill={yellow} stroke={ink} stroke-width="3.5" />
    <ellipse cx="60" cy="128" rx="9" ry="4.5" fill="#f5a400" stroke={ink} stroke-width="3" />
    <ellipse cx="80" cy="128" rx="9" ry="4.5" fill="#f5a400" stroke={ink} stroke-width="3" />

    <!-- Körper mit Fenster als Bauchnabel -->
    <rect x="40" y="34" width="60" height="60" rx="20" fill={yellow} stroke={ink} stroke-width="3.5" />
    <ellipse cx="52" cy="44" rx="8" ry="4" fill="#fff7c2" transform="rotate(-30 52 44)" />
    <rect x="65" y="84" width="10" height="5" rx="2" fill={ink} />
    <rect x="32" y="50" width="10" height="30" rx="4" fill="#0b7d3c" stroke={ink} stroke-width="3.5" />
    <rect x="98" y="50" width="10" height="30" rx="4" fill="#b81d25" stroke={ink} stroke-width="3.5" />

    <!-- Augen -->
    {#if mood === 'wink'}
      <path d="M55 60 q 6 -6 12 0" fill="none" stroke={ink} stroke-width="3.5" stroke-linecap="round" />
    {:else}
      <ellipse cx="61" cy="59" rx="7" ry="9" fill="white" stroke={ink} stroke-width="2.5" />
      <circle cx="63" cy="61" r="4.2" fill={ink} />
      <circle cx="64.5" cy="59" r="1.5" fill="white" />
    {/if}
    <ellipse cx="80" cy="59" rx="7" ry="9" fill="white" stroke={ink} stroke-width="2.5" />
    <circle cx="82" cy="61" r="4.2" fill={ink} />
    <circle cx="83.5" cy="59" r="1.5" fill="white" />

    <!-- Bäckchen -->
    <ellipse cx="51" cy="73" rx="5" ry="3" fill="#ff3d8b" opacity="0.6" />
    <ellipse cx="90" cy="73" rx="5" ry="3" fill="#ff3d8b" opacity="0.6" />

    <!-- Mund -->
    {#if mood === 'blow'}
      <ellipse cx="70.5" cy="75" rx="4" ry="5" fill={ink} />
      <g class="sound" fill="none" stroke="#ff3d8b" stroke-width="3.5" stroke-linecap="round">
        <path d="M112 36 q 8 -4 12 -12" />
        <path d="M116 46 q 10 0 18 -6" />
        <path d="M106 28 q 2 -8 8 -12" />
      </g>
    {:else}
      <path d="M64 73 q 6.5 8 13 0" fill="none" stroke={ink} stroke-width="3.5" stroke-linecap="round" />
    {/if}
  </g>
</svg>

<style>
  .apito {
    display: block;
    height: auto;
    overflow: visible;
  }
  .arm {
    transform-box: view-box;
  }
  .arm.left {
    transform-origin: 36px 65px;
  }
  .arm.right {
    transform-origin: 104px 65px;
  }
  .bounce {
    animation: bounce 1.6s ease-in-out infinite;
    transform-origin: 50% 100%;
  }
  .bounce .arm.left {
    animation: wave-left 0.8s ease-in-out infinite alternate;
  }
  .bounce .arm.right {
    animation: wave-right 0.8s ease-in-out infinite alternate;
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
  @keyframes wave-left {
    to {
      transform: rotate(14deg);
    }
  }
  @keyframes wave-right {
    to {
      transform: rotate(-14deg);
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
    .bounce .arm,
    .sound {
      animation: none;
    }
  }
</style>
