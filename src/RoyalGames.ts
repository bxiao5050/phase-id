import Mark from 'Base/Mark'
import Utils from 'Src/Base/Utils';
import App from 'DOM/index'
export default class RoyalGames {
  RoyalGames = true
  static _ins: RoyalGames
  static get instance(): RoyalGames {
    return this._ins || new RoyalGames;
  }
  constructor() {
    RoyalGames._ins = this;
    this.ExposeApis()
    Mark.instance.init()
  }

  Login() {
    let user = Utils.getParameterByName('user')
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
      var userInfo = SDK.GetUser()
      var autoLogin = false
      if (userInfo) {
        autoLogin = true
      } else {
        var usersInfo = SDK.GetUsers()
        var usersIdArr = Object.keys(usersInfo)
        if (usersIdArr.length) {
          var id = usersIdArr[0]
          userInfo = usersInfo[id]
          autoLogin = true
        }
      }
      var LoginModule = App.instance.showLogin()
      if (autoLogin) {
        SDK.Login(userInfo).then(() => {
          LoginModule.loginComplete()
        })
      }
    }
  }

  ExposeApis() {
    window.RG = {} as any
    var exposeApis = [
      "server",
      "version",
      "Messenger",
      "Fb",
      "CurUserInfo",
      "BindZone",
      "Share",
      "Mark",
    ]
    exposeApis.forEach(api => {
      window.RG[api] = SDK[api]
    })
    window.RG["Pay"] = this.Pay
    window.RG["Install"] = this.Install
  }

  Pay(paymentConfig: PaymentConfig) {
    return SDK.PaymentConfig(paymentConfig).then(paymentConfigRes => {
      App.instance.showPayment(paymentConfigRes)
    })
  }

  Install(fileName, link) {
    var appId = SDK.config.appId
    var params = encodeURIComponent(JSON.stringify({
      fileName,
      link,
      appId
    }))
    window.open(`${SERVER.replace('https', 'http')}/page/sdk-add-shortcuts/index.html?params=${params}`)
  }

}

