class UrlParam {
  urlParamKeyArr: string[] = []
  urlParamMap: any = {}
  constructor() {
    let interrogationIndex = location.href.indexOf("?") + 1
    let str = interrogationIndex === 0 ? "" : location.href.slice(interrogationIndex)
    if (str) {
      let arr = str.split(/&|%26/)
      arr.forEach((item) => {
        let arr = item.split(/=|%3D/)
        let key = arr[0]
        let val = arr[1]
        this.urlParamMap[key] = val
        this.urlParamKeyArr.push(key)
      })
    }
  }
  add(key: string, val: string) {
    this.urlParamMap[key] = val
    this.urlParamKeyArr.push(key)
  }
  del(key: string) {
    let index = this.urlParamKeyArr.indexOf(key)
    if (index !== -1) {
      delete this.urlParamMap[key]
      this.urlParamKeyArr.splice(index, 1)
    }
  }
  get(name: string) {
    return this.urlParamMap[name]
  }
  keys() {
    return this.urlParamKeyArr
  }
}

window.$rg_index = function (options: {
  appId: string
  advChannel: string
  sdkVersion: string
  login: HTMLIFrameElement
  origin: string
  hash: string
}) {
  /**
   * init
   */
  const U = new UrlParam()
  const APP_ID = 'appId'
  const ADV_CHANNEL = 'advChannel'
  const SDK_VERSION = 'sdkVersion'
  const SHORTCUT = 'shortcut'
  const T = 't'
  const sdk = document.createElement('script')
  const handleMessage = function (event: MessageEvent, iframe) {
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
    else if (event.data.action === 'location') {
      iframe.src = event.data.data
    }
  }
  const onMessage = function (event: MessageEvent) {
    console.log('index receive msg', event.origin, event.data)
    if (event.origin.indexOf(window.$rg_main.Mark.login_host) > -1) {
      handleMessage(event, options.login)
    }
    if (event.origin.indexOf(window.$rg_main.Mark.game_host) > -1) {
      handleMessage(event, options.login)
    }
  }

  window[APP_ID] = options.appId
  window[ADV_CHANNEL] = options.advChannel
  window[SDK_VERSION] = options.sdkVersion

  U.add(SDK_VERSION, window[SDK_VERSION])
  U.add(APP_ID, window[APP_ID])
  U.add(ADV_CHANNEL, window[ADV_CHANNEL])
  U.add(T, options.hash)

  window.addEventListener("message", onMessage, false);

  sdk.src = `${options.origin}/jssdk/${options.sdkVersion}/sdk.js?${U.get(T)}`
  sdk.async = !0
  document.head.append(sdk)

  const src = `${options.origin}/jssdk/${options.sdkVersion}/login.html?${(function () {
    return U.keys().map(key => {
      return `${key}=${U.get(key)}`
    }).join('&')
  })()}`

  options.login.src = src

  const link = `${options.origin}/platform/shortcut.jsp?link=${encodeURIComponent(location.origin + location.pathname)}?shortcut=1&fileName=Pokemon-Quest`;

  return {
    isFromShortcut: U.get(SHORTCUT),
    link
  }

}

