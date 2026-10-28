import { detectBrowser } from './platform'

/** Chromes Installationsangebot; steht (noch) nicht in den TypeScript-Typen. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const appMode = matchMedia('(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)')

function runsAsApp() {
  return appMode.matches || (navigator as { standalone?: boolean }).standalone === true
}

export const browser = detectBrowser(navigator.userAgent, navigator.maxTouchPoints)

export const install = $state({
  /** Läuft als installierte App statt im Browser-Tab. */
  standalone: runsAsApp(),
  /** Der Browser bietet einen eigenen Installieren-Dialog an (Chrome, Edge, Samsung). */
  canPrompt: false,
  /** Wurde gerade aus diesem Tab heraus installiert. */
  installed: false,
})

let deferred: BeforeInstallPromptEvent | null = null

appMode.addEventListener('change', () => (install.standalone = runsAsApp()))

// Das Event kommt früh, deshalb wird es schon beim Laden abgefangen.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferred = e as BeforeInstallPromptEvent
  install.canPrompt = true
})

window.addEventListener('appinstalled', () => {
  install.installed = true
  install.canPrompt = false
  deferred = null
})

export async function promptInstall() {
  if (!deferred) return
  const e = deferred
  deferred = null
  install.canPrompt = false
  await e.prompt()
  if ((await e.userChoice).outcome === 'accepted') install.installed = true
}
