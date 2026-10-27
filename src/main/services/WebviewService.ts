import { session } from 'electron'

import { configManager } from './ConfigManager'

/**
 * init the useragent of the webview session
 * remove the CherryStudio and Electron from the useragent
 */
export function initSessionUserAgent() {
  const wvSession = session.fromPartition('persist:webview')
  const originUA = wvSession.getUserAgent()
  const newUA = originUA.replace(/CherryStudio\/\S+\s/, '').replace(/Electron\/\S+\s/, '')

  wvSession.setUserAgent(newUA)
  wvSession.webRequest.onBeforeSendHeaders((details, cb) => {
    const language = configManager.getLanguage()
    const headers = {
      ...details.requestHeaders,
      'User-Agent': details.url.includes('gemini.google.com') || !details.url.includes('google.com') ? newUA : originUA,
      'Accept-Language': `${language}, en;q=0.9, *;q=0.5`
    }
    cb({ requestHeaders: headers })
  })
}
