import Utils from 'Base/Utils';
import Base from 'Src/Base'

export default class Web extends Base {

  config
  fb_sdk_loaded

  constructor(config, fb_sdk_loaded) {
    super()

    this.config = config
    this.fb_sdk_loaded = fb_sdk_loaded

    let RG = function () { }
    RG.prototype.jssdk = this

    window.RG = new RG
    this.ExposeApis()
  }

  loadScript(src) {
    let resolve, script = document.createElement('script')
    script.src = src
    script.onload = function () {
      resolve()
    }
    document.head.appendChild(script)
    return new Promise(function (_) {
      resolve = _
    })
  }

  rgAsyncInit() {
    window.rgAsyncInit()
    window.$postMessage({ action: 'rgAsyncInit' }, window.$rg_main.Mark.index_url.origin)
  }

  async init() {
    await this.loadScript(reactSrc)
    await Promise.all([reactDomSrc, reactRouterDomSrc].map((src) => {
      return this.loadScript(src)
    }))
    let [{ Ins }] = await Promise.all([import('DOM/index'), RG.jssdk.Account.initPromise])
    window.RG.jssdk.App = Ins
    let user = RG.jssdk.Account.user
    let autoLogin = false
    if (user) {
      autoLogin = true
    } else {
      if (RG.jssdk.Account.users) {
        let usersIdArr = Object.keys(RG.jssdk.Account.users)
        if (usersIdArr.length) {
          user = RG.jssdk.Account.users[
            usersIdArr[0]
          ]
          autoLogin = true
        }
      }
    }
    let LoginModule = window.RG.jssdk.App.showLogin()
    if (window.name === 'redirect') {
      window.name = ''
    } else {
      if (autoLogin) {
        await RG.jssdk.Login(user)
        LoginModule.loginComplete()
      }
    }


  }

  ExposeApis() {
    let exposeApis = [
      "server",
      "version",
      "Redirect",
      "Messenger",
      "Fb",
      "CurUserInfo",
      "BindZone",
      "Share",
      "Mark",
      "Pay",
      "Install",
      "ChangeAccount"
    ]
    exposeApis.forEach(api => {
      window.RG[api] = RG.jssdk[api]
    })
  }

  Pay(paymentConfig: PaymentConfig) {
    return RG.jssdk.PaymentConfig(paymentConfig).then(paymentConfigRes => {
      window.RG.jssdk.App.showPayment(paymentConfigRes)
    })
  }

  Install() {
    let link
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      link = `${SERVER}/jssdk/${Utils.getUrlParam('sdkVersion')}/add-shortcut.html?lang=en&system=ios&appId=${RG.jssdk.config.appId}&link=${RG.jssdk.config.page.index}`
    } else if (/(Android)/i.test(navigator.userAgent)) {
      link = `${SERVER}/jssdk/${Utils.getUrlParam('sdkVersion')}/add-shortcut.html?lang=en&system=android&appId=${RG.jssdk.config.appId}&link=${RG.jssdk.config.page.index}`
    } else {
      window.name = 'install'
      link = RG.jssdk.config.page.index
    }
    window.open(link)
  }
}