window.$rg_index = function (options: {
  iframe: HTMLIFrameElement
  origin: string
  U: any
}) {
  /**
   * init
   */
  const { iframe, U, origin } = options
  const DEBUGGER = 'debugger'
  const SDK_VERSION = 'sdkVersion'
  const SDK_HASH = 't'
  const APP_ID = 'appId'
  const ADV_CHANNEL = 'advChannel'
  const handleMessage = function (event: MessageEvent, iframe: HTMLIFrameElement) {
    if (event.data.action === 'get') {
      iframe.contentWindow.postMessage({
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '',
        users: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {},
      }, event.origin);
    }
    else if (event.data.action === 'set') {
      localStorage.setItem('user', JSON.stringify(event.data.data.user))
      localStorage.setItem('users', JSON.stringify(event.data.data.users))
    }
    else if (event.data.action === 'mark') {
      event.data.data.param ? RG.Mark(event.data.data.name, event.data.data.param) : RG.Mark(event.data.data.name)
    }
  }
  const onMessage = function (event: MessageEvent) {
    console.log('index receive msg', event.origin, event.data)
    if (event.origin === window.$rg_main.Mark.game_url.origin) {
      handleMessage(event, iframe)
    }
  }
  const sdk = document.createElement('script')
  window[APP_ID] = U.get(APP_ID)
  window[ADV_CHANNEL] = U.get(ADV_CHANNEL)
  window.addEventListener("message", onMessage, false);
  sdk.src = `${origin}/jssdk/${U.get(SDK_VERSION)}/sdk.js?${U.get(SDK_HASH)}`
  sdk.async = !0
  document.head.append(sdk)
  sdk.onload = async function () {
    await window.$rg_main.get_game_config
    const config: JSSDK.Config = window.$rg_main.config
    const src = `${U.get(DEBUGGER) ? config.page.game.test : config.page.game.formal}?${(function () {
      return U.keys().map(key => {
        return `${key}=${U.get(key)}`
      }).join('&')
    })()}`
    iframe.src = src
  }

}

