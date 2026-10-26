// Offline-Cache: Seiten zuerst aus dem Netz (damit Updates ankommen),
// alles andere zuerst aus dem Cache. Beides wird beim Laden nachgefüllt.
const CACHE = 'samba-trainer-v2'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', 'manifest.webmanifest', 'icon.svg'])))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  const fromNetwork = () =>
    fetch(request).then((res) => {
      if (res.ok) {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(request, copy))
      }
      return res
    })

  if (request.mode === 'navigate') {
    event.respondWith(fromNetwork().catch(() => caches.match(request).then((r) => r ?? caches.match('./'))))
  } else {
    event.respondWith(caches.match(request).then((cached) => cached ?? fromNetwork()))
  }
})
