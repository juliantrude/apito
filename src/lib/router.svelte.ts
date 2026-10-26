export type RhythmTab = 'training' | 'breaks' | 'einstellungen'

export type Route =
  | { name: 'overview' }
  | { name: 'intro' }
  | { name: 'new' }
  | { name: 'rhythm'; id: string; tab: RhythmTab }

const TABS: RhythmTab[] = ['training', 'breaks', 'einstellungen']

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'intro') return { name: 'intro' }
  if (parts[0] === 'neu') return { name: 'new' }
  if (parts[0] === 'r' && parts[1]) {
    const tab = TABS.find((t) => t === parts[2]) ?? 'training'
    return { name: 'rhythm', id: decodeURIComponent(parts[1]), tab }
  }
  return { name: 'overview' }
}

export function href(route: Route): string {
  switch (route.name) {
    case 'overview':
      return '#/'
    case 'intro':
      return '#/intro'
    case 'new':
      return '#/neu'
    case 'rhythm':
      return `#/r/${encodeURIComponent(route.id)}/${route.tab}`
  }
}

export const router = $state({ route: parseHash(location.hash) })

window.addEventListener('hashchange', () => {
  router.route = parseHash(location.hash)
  window.scrollTo(0, 0)
})

export function go(route: Route, { replace = false } = {}) {
  if (replace) history.replaceState(null, '', href(route))
  else history.pushState(null, '', href(route))
  router.route = route
  window.scrollTo(0, 0)
}
