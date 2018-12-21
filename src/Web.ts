import Mark from 'Base/Mark'
import Utils from 'Base/Utils';
import App from 'DOM/index'
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
    Mark.instance.init()
  }

  init() {
    let user = Utils.getUrlParam('user')
    if (user) {
      var { userType, accountType } = RG.CurUserInfo()
      var isGuest = Utils.getAccountType(userType, accountType) === 'guest' ? true : false;
      App.instance.hideLogin()
      App.instance.showHover(isGuest)
      if (window.rgAsyncInit) {
        window.rgAsyncInit()
      } else {
        window.onload = function () {
          window.rgAsyncInit()
        }
      }
    } else {
      var userInfo = RG.jssdk.GetUser()
      var autoLogin = false
      if (userInfo) {
        autoLogin = true
      } else {
        var usersInfo = RG.jssdk.GetUsers()
        var usersIdArr = Object.keys(usersInfo)
        if (usersIdArr.length) {
          var id = usersIdArr[0]
          userInfo = usersInfo[id]
          autoLogin = true
        }
      }
      var LoginModule = App.instance.showLogin()
      if (autoLogin) {
        RG.jssdk.Login(userInfo).then(() => {
          LoginModule.loginComplete()
        })
      }
    }
  }

  ExposeApis() {
    var exposeApis = [
      "server",
      "version",
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
      App.instance.showPayment(paymentConfigRes)
    })
  }

  Install(fileName, link) {
    var appId = RG.jssdk.config.appId
    var params = encodeURIComponent(JSON.stringify({
      fileName,
      link,
      appId
    }))
    window.open(`${SERVER.replace('https', 'http')}/jssdk/add_shortcut/index.html?params=${params}`)
  }

}