/** Browser, für die es eine eigene Installationsanleitung gibt. */
export type Browser =
  | 'ios-safari'
  | 'ios-chrome'
  | 'ios-firefox'
  | 'ios-other'
  | 'android-chrome'
  | 'android-firefox'
  | 'android-samsung'
  | 'android-other'
  | 'desktop'

/** Erkennt Browser und System am User-Agent. iPads melden sich als Mac, verraten sich aber per Touch. */
export function detectBrowser(ua: string, maxTouchPoints = 0): Browser {
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && maxTouchPoints > 1)
  if (ios) {
    if (/CriOS/.test(ua)) return 'ios-chrome'
    if (/FxiOS/.test(ua)) return 'ios-firefox'
    // In-App-Browser (Instagram & Co.) haben kein „Safari/“ im User-Agent.
    if (/EdgiOS|OPiOS|GSA\//.test(ua) || !/Safari\//.test(ua)) return 'ios-other'
    return 'ios-safari'
  }
  if (/Android/.test(ua)) {
    if (/SamsungBrowser/.test(ua)) return 'android-samsung'
    if (/Firefox/.test(ua)) return 'android-firefox'
    if (/EdgA|OPR|YaBrowser|MiuiBrowser|HuaweiBrowser|; wv\)/.test(ua)) return 'android-other'
    if (/Chrome/.test(ua)) return 'android-chrome'
    return 'android-other'
  }
  return 'desktop'
}
