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

  async init() {
    await this.loadScript(reactSrc)
    await Promise.all([reactDomSrc, reactRouterDomSrc].map((src) => {
      return this.loadScript(src)
    }))
    let [{ Ins }] = await Promise.all([import('DOM/index'), RG.jssdk.Account.initPromise])
    window.RG.jssdk.App = Ins
    let user = Utils.getUrlParam('user')
    if (user) {
      var { userType, accountType } = RG.CurUserInfo()
      var isGuest = Utils.getAccountType(userType, accountType) === 'guest' ? true : false;
      window.RG.jssdk.App.hideLogin()
      window.RG.jssdk.App.showHover(isGuest)
      if (window.rgAsyncInit) {
        window.rgAsyncInit()
      } else {
        window.onload = function () {
          window.rgAsyncInit()
        }
      }
    } else {
      var userInfo = RG.jssdk.Account.user
      var autoLogin = false
      if (userInfo) {
        autoLogin = true
      } else {
        var usersInfo = RG.jssdk.Account.users
        var usersIdArr = Object.keys(usersInfo)
        if (usersIdArr.length) {
          var id = usersIdArr[0]
          userInfo = usersInfo[id]
          autoLogin = true
        }
      }
      var LoginModule = window.RG.jssdk.App.showLogin()
      if (autoLogin) {
        await RG.jssdk.Login(userInfo)
        LoginModule.loginComplete()
      }
    }
  }

  ExposeApis() {
    var exposeApis = [
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