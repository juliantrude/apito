import { describe, expect, it } from 'vitest'
import { detectBrowser } from './platform'

const UA = {
  iosSafari:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
  iosChrome:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/138.0.7204.156 Mobile/15E148 Safari/604.1',
  iosFirefox:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/141.0 Mobile/15E148 Safari/605.1.15',
  iosInstagram:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 390.0.0.0',
  iPad: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',
  androidChrome:
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
  androidFirefox: 'Mozilla/5.0 (Android 15; Mobile; rv:141.0) Gecko/141.0 Firefox/141.0',
  androidSamsung:
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  androidEdge:
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 EdgA/138.0.0.0',
  desktopFirefox: 'Mozilla/5.0 (X11; Linux x86_64; rv:141.0) Gecko/20100101 Firefox/141.0',
}

describe('detectBrowser', () => {
  it('erkennt die iOS-Browser', () => {
    expect(detectBrowser(UA.iosSafari)).toBe('ios-safari')
    expect(detectBrowser(UA.iosChrome)).toBe('ios-chrome')
    expect(detectBrowser(UA.iosFirefox)).toBe('ios-firefox')
    expect(detectBrowser(UA.iosInstagram)).toBe('ios-other')
  })

  it('hält ein iPad mit Touch nicht für einen Mac', () => {
    expect(detectBrowser(UA.iPad, 5)).toBe('ios-safari')
    expect(detectBrowser(UA.iPad, 0)).toBe('desktop')
  })

  it('erkennt die Android-Browser', () => {
    expect(detectBrowser(UA.androidChrome)).toBe('android-chrome')
    expect(detectBrowser(UA.androidFirefox)).toBe('android-firefox')
    expect(detectBrowser(UA.androidSamsung)).toBe('android-samsung')
    expect(detectBrowser(UA.androidEdge)).toBe('android-other')
  })

  it('fällt sonst auf Desktop zurück', () => {
    expect(detectBrowser(UA.desktopFirefox)).toBe('desktop')
  })
})
