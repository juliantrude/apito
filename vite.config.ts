import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// Relative Pfade, damit die App unter jedem GitHub-Pages-Unterpfad läuft.
export default defineConfig({
  base: './',
  plugins: [svelte()],
})
