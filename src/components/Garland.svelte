<script lang="ts">
  // Bandeirinhas: Wimpelkette wie auf einem Samba-Fest
  const colors = ['#ff3d8b', '#ffc527', '#10a957', '#1d6fe0', '#ff7a1a', '#7a3cf0', '#0bb4a8']
  const count = 14
</script>

<svg class="garland" viewBox="0 0 {count * 20} 22" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 2 Q {count * 10} 8 {count * 20} 2" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4" />
  {#each { length: count }, i}
    {@const x = i * 20 + 3}
    {@const sag = 2 + Math.sin((Math.PI * (i + 0.5)) / count) * 4.5}
    <path d="M{x} {sag} L{x + 14} {sag} L{x + 7} {sag + 14} Z" fill={colors[i % colors.length]} />
  {/each}
</svg>

<style>
  .garland {
    display: block;
    width: 100%;
    height: 1.6rem;
    color: var(--text);
  }
</style>
