
/**
 * SDK 基类 
 * SDK 的基础api 功能跟接口
 */

import Share from "Src/Base/Share";
import Payment from "Src/Base/Payment";
import Login from "Src/Base/Login";
import Api from "Src/Base/Api";
import Account from "Src/Base/Account";
import Utils from "Base/Utils";
import Mark from "Src/Base/Mark";

export default class Base {
  openPage = null
  config: CONFIG
  /**
   * 1: web端
   * 2：原生应用
   * 3：facebook页游平台
   * 4：facebook instant games
   */
  type: number
  version = VERSION
  server = SERVER
  static SDK: SDKs
  constructor() {
    window.SDK = this
    if (!window.JsToNative) {
      window.JsToNative = {
        getDeviceMsg: function (): string {
          var u = navigator.userAgent;
          var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
          var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
          var source = isAndroid ? 1 : isiOS ? 0 : 3
          return JSON.stringify({
            source: source,
            advChannel: SDK.config.advChannel,
            network: 0,
            model: '0',
            operatorOs: '0',
            deviceNo: '0',
            device: '0',
            version: '0',
            sdkVersion: '0',
            appId: SDK.config.appId
          })
        },
        getDeviceMsgAsync: function () {
          return new Promise(resolve => {
            resolve(JSON.parse(window.JsToNative.getDeviceMsg()))
          })
        },
        init: function (param: string) { },
        gameEvent: function (param: string) { },
        jpwork: function (param: string) { },
        consumeOrder: function (param: string) { },
        exitApp: function () { },
      }
    }
    ACTION === 'build-fb' ? this.polyfilled() : import("Src/Base/Polyfill").then(module => {
      module.default.instance.init()
    })
  }

  fbSdkIsLoaded = false

  polyfilled() {
    this.init().then(() => {
      RG.Mark('sdk_loaded')
      Base.SDK.Login()
    }).catch(err => {
      this.getSDKInstance().then(() => {
        RG.Mark('sdk_loaded')
        Base.SDK.Login()
      })
    })
  }

  async initDebugger() {
    return new Promise(resolve => {
      var js = document.createElement('script')
      js.src = "https://sdk-sg.pocketgamesol.com/jssdk/vconsole/vconsole.min.js"
      js.onload = () => {
        new window['VConsole']();
        console.log(location.href)
        console.log('当前版本：' + this.version)
        resolve()
      }
      document.head.appendChild(js)
    })
  }

  async init() {
    var AndroidVersion = navigator.userAgent.match(/Android \d{1}.\d{1}/)
    var isLge4_4
    if (AndroidVersion) isLge4_4 = Number(AndroidVersion[0].split(' ')[1]) >= 4.4;
    var debugger_ = Utils.getParameterByName('debugger') || window['debugger']
    if (debugger_) {
      if (AndroidVersion) {
        if (isLge4_4) await this.initDebugger();
      } else {
        await this.initDebugger();
      }
    }
    await this.getGameConfig()
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getSDKInstance(),
        this.initFbJsSdk(),
      ]).then(() => {
        resolve()
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }

  /** 获取游戏配置 */
  async getGameConfig() {
    return new Promise((resolve) => {
      var appId = Utils.getParameterByName('appId') || window['appId']
      var advChannel = Utils.getParameterByName('advChannel') || window['advChannel']
      if (!appId || !advChannel) {
        console.error('appId or advChannel is missing')
      } else {
        var config
        var translation
        var promise1 = new Promise(async (rosolve1) => {
          config = await import('Src/config')
          rosolve1(config.default)
        })
        var promise2 = new Promise(async (rosolve2) => {
          translation = await import('DOM/i18n')
          rosolve2(translation.default)
        })
        Promise.all([
          promise1,
          promise2
        ]).then(([config, translation]) => {
          SDK.config = config[appId][advChannel] ? config[appId][advChannel] : config[appId].default
          SDK.config.appId = appId
          SDK.config.advChannel = advChannel
          SDK.config.i18n = translation[SDK.config.language]
          resolve()
        })
      }
    })

  }

  /**
   * 获取SDk的类型
   */
  getSDKInstance() {
    if (SDK.config.advChannel < 30000) {
      SDK.type = 2
      return this.importNativeGamesSDK()
    } else if (SDK.config.advChannel > 30000 && SDK.config.advChannel < 31000) {
      SDK.type = 1
      return this.importRoyalGamesSDK()
    } else if (SDK.config.advChannel > 31000 && SDK.config.advChannel < 32000) {
      SDK.type = 3
      return this.importFacebookWebGamesSDK()
    } else if (SDK.config.advChannel > 32000 && SDK.config.advChannel < 33000) {
      SDK.type = 4
      return this.importFacebookInstantGamesSDK()
    }
  }

  importFacebookInstantGamesSDK() {
    return import('Src/FacebookInstantGames')
      .then(SDK => {
        Base.SDK = SDK.default.instance
      })
  }

  importNativeGamesSDK() {
    return import('Src/NativeGames')
      .then(SDK => {
        Base.SDK = SDK.default.instance
      })
  }

  importFacebookWebGamesSDK() {
    return import('Src/FacebookWebGames')
      .then(SDK => {
        Base.SDK = SDK.default.instance
      })
  }

  importRoyalGamesSDK() {
    return import('Src/RoyalGames')
      .then(SDK => {
        Base.SDK = SDK.default.instance
      })
  }

  Mark(markName: string, markParams: any) {
    Mark.instance.Mark(markName)
  }

  initFbJsSdk() {
    return new Promise((resolve, reject) => {
      if (SDK.type === 4) { // instant games
        this.fbSdkIsLoaded = true
        resolve()
        return
      }
      var js = document.createElement('script')
      document.body.appendChild(js)
      js.src = "https://connect.facebook.net/en_US/sdk.js"
      js.onload = () => {
        if (window.FB) {
          FB.init({
            appId: SDK.config.FbAppID,
            status: true,
            xfbml: true,
            version: FBVersion
          })
          this.fbSdkIsLoaded = true
          resolve(FB)
        } else {
          console.error('RG: Facebook SDK failed to load')
        }
      }
      js.onerror = function () {
        console.log('RG: Facebook SDK failed to load2')
        reject('fb')
      }
    })
  }

  Login(loginParam: LoginParam): Promise<LoginRes> {
    var promise: Promise<LoginRes>
    if (loginParam.isFacebook) { // facebook 登陆
      promise = Login.instance.facebookLogin()
    } else { // 平台登陆
      promise = Login.instance.platformLogin(loginParam)
    }
    return promise
  }

  BindZone(BindZoneParam: BindZoneParam) {
    return Api.instance.Bind(BindZoneParam)
  }

  GetUser() {
    return Account.instance.userInfo
  }

  GetUsers() {
    return Account.instance.usersInfo
  }

  SetUser(userInfo: UserInfo, userId?: any) {
    if (userInfo) {
      Account.instance.userInfo = userInfo
    } else {
      Account.instance.delCurUser(userId)
    }
  }

  SetUsers(usersInfo: UsersInfo) {
    Account.instance.usersInfo = usersInfo
  }

  _getParamUserHasParsed = false

  CurUserInfo(): {
    userId: number
    userName: string
    token: string
  } {
    var user = Utils.getParameterByName('user')
    if (user && !this._getParamUserHasParsed) {
      this._getParamUserHasParsed = true
      user = JSON.parse(decodeURIComponent(user))
      SDK.SetUser(user)
      return user
    } else {
      return SDK.GetUser()
    }
  }

  Share(shareUrl: string) {
    return Share.instance.share(shareUrl)
  }

  Messenger() {
    return window.open(SDK.config.messenger)
  }

  Fb() {
    var useragent = navigator.userAgent; // cache the userAgent info
    var iPhone = (useragent.match(/(iPad|iPhone|iPod)/g));
    var scheme;
    if (iPhone)
      scheme = "fb://page/?id=" + SDK.config.FbPageId;
    else
      scheme = "fb://page/" + SDK.config.FbPageId;

    if (!window.open(scheme)) {
      location.href = SDK.config.fanpage;
    }
  }

  static paymentConfig: PaymentConfig
  PaymentConfig(PaymentConfig: PaymentConfig): Promise<PaymentConfigRes> {
    Base.paymentConfig = PaymentConfig
    return Payment.instance.getPaymentConfig(PaymentConfig)
  }

  Ordering(OrderingData: PaymentChannel) {
    console.log('base.Ordering', OrderingData)
    return Payment.instance.createOrder(Base.paymentConfig, {
      channel: OrderingData.channel,
      code: OrderingData.code,
      amount: OrderingData.selectedProduct.amount + '',
      currency: OrderingData.selectedProduct.currency,
      productName: OrderingData.selectedProduct.productName,
      itemType: OrderingData.selectedProduct.itemType,
      isOfficial: OrderingData.isOfficial,
      exInfo: OrderingData.exInfo,
    })
  }

  FinishOrder(finishOrderParams: FinishOrderParams): Promise<ServerRes> {
    console.log('base finish order begin')
    return Payment.instance.finishOrder({
      transactionId: finishOrderParams.transactionId,
      channel: finishOrderParams.channel,
      receipt: finishOrderParams.receipt,
      signature: finishOrderParams.signature,
      exInfo: finishOrderParams.exInfo
    })
  }

  GetPaymentHistory() {
    return Payment.instance.getPaymentHistory()
  }

  ChangePassword(oldpass, newpass) {
    return Account.instance.changePass(oldpass, newpass)
  }

  VisitorUpgrade(account: string, pass: string) {
    return Api.instance.BindVisitor(account, pass)
  }

}

new Base